import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  // throw early in server logs if misconfigured
  // eslint-disable-next-line no-console
  console.error('[create-admin] SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL is not set');
}

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '') || null;

  if (!token) return res.status(401).json({ error: 'Missing Authorization token' });

  const { email, password, name } = req.body || {};
  if (!email || !password || !name) return res.status(400).json({ error: 'email, password and name are required' });

  try {
    // verify actor: use service client to query admins where id = actor id extracted via auth.getUser
    // supabase.auth.getUser accepts an access token in v2; pass the token to verify identity
    const { data: actorData, error: actorErr } = await supabaseAdmin.auth.getUser(token);
    const actorId = actorData?.user?.id;
    if (actorErr || !actorId) return res.status(401).json({ error: 'Invalid actor token' });

    // Check actor is master admin in admins table
    const { data: actorRow, error: actorRowErr } = await supabaseAdmin.from('admins').select('id,role').eq('id', actorId).single();
    if (actorRowErr || !actorRow || actorRow.role !== 'master') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // create user using service role
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
    });

    if (error) return res.status(400).json({ error });

    const newUserId = data.user.id;

    // insert into admins table
    const { error: insertErr } = await supabaseAdmin.from('admins').insert([{ id: newUserId, email, name, role: 'admin' }]);
    if (insertErr) return res.status(500).json({ error: insertErr });

    return res.status(200).json({ success: true, id: newUserId });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('create-admin error', err);
    return res.status(500).json({ error: String(err) });
  }
}
