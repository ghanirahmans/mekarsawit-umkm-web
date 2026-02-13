import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabaseAdmin: SupabaseClient | null = null;

/**
 * Get the server-side Supabase admin client (lazy-initialized).
 * Uses service_role key for privileged operations like Storage uploads.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE;

    if (!supabaseUrl || !supabaseServiceRole) {
      throw new Error(
        "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE environment variable.",
      );
    }

    _supabaseAdmin = createClient(supabaseUrl, supabaseServiceRole);
  }
  return _supabaseAdmin;
}
