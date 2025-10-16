import { createClient } from '@supabase/supabase-js';

// Use your service role key here (keep it secret!)
const supabase = createClient(
  'https://bysnrvuqzoxkgzfwdlla.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5c25ydnVxem94a2d6ZndkbGxhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDUxNjI5MSwiZXhwIjoyMDc2MDkyMjkxfQ.RMBES-aqHb0eMthxeLJoaBNoFjsO45vaMV9HoeSgSso'
);

const createMasterAdmin = async () => {
  const email = 'wokomad16@gmail.com';
  const password = '1212';

  // 1. Create user in Supabase Auth
  const { data: user, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: 'master', name: 'Master Admin' },
  });

  if (authError) {
    console.error('Auth creation error:', authError.message);
    return;
  }

  // 2. Insert into admins table
  const { error: dbError } = await supabase.from('admins').insert([
    {
      id: user.user.id,
      email,
      name: 'Master Admin',
      role: 'master',
    },
  ]);

  if (dbError) {
    console.error('Database insert error:', dbError.message);
  } else {
    console.log('Master admin created successfully!');
  }
};

createMasterAdmin();
