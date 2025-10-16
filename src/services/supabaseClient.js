import { createClient } from '@supabase/supabase-js'

// Reads Vite env vars. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
	// Warn early in dev so it's obvious why auth/data calls may fail
	// eslint-disable-next-line no-console
	console.warn(
		'[supabaseClient] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not set. Supabase client will be created but requests will likely fail.'
	)
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export default supabase
