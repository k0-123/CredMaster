-- Run this in Supabase SQL editor to create the tables

create table if not exists audits (
  id uuid primary key default gen_random_uuid(),
  input jsonb not null,
  tool_results jsonb not null,
  total_monthly_savings numeric not null,
  total_annual_savings numeric not null,
  ai_summary text,
  created_at timestamptz default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  audit_id uuid references audits(id),
  email text not null,
  company_name text,
  role text,
  team_size integer,
  created_at timestamptz default now()
);

-- Index for fast lookup by audit_id
create index if not exists leads_audit_id_idx on leads(audit_id);

-- Row Level Security: audits are public read, 
-- only service role can write
alter table audits enable row level security;
create policy "Public audits are viewable by everyone" 
  on audits for select using (true);
create policy "Service role can insert audits" 
  on audits for insert with check (true);

alter table leads enable row level security;
create policy "Service role only" 
  on leads for all using (false);
