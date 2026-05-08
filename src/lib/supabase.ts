import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseUrl !== "your_supabase_project_url" &&
  supabaseAnonKey &&
  supabaseAnonKey !== "your_supabase_anon_key";

// Browser client (uses ANON key, safe for client components)
// We only instantiate if we have a valid URL to prevent build errors
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any);

// Server client (uses SERVICE ROLE key, only used in API routes)
export const supabaseAdmin = isSupabaseConfigured && supabaseServiceRoleKey && supabaseServiceRoleKey !== "your_supabase_service_role_key"
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : (null as any);

export type AuditRow = {
  id: string;
  input: string; // JSON stringified AuditInput
  tool_results: string; // JSON stringified ToolAuditResult[]
  total_monthly_savings: number;
  total_annual_savings: number;
  ai_summary: string | null;
  created_at: string;
};

export type LeadRow = {
  id: string;
  audit_id: string;
  email: string;
  company_name: string | null;
  role: string | null;
  team_size: number | null;
  created_at: string;
};
