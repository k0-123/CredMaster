-- Create leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  employee_count INTEGER,
  engineering_team_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audits table
CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  total_current_spend DECIMAL(10, 2) NOT NULL,
  total_optimized_spend DECIMAL(10, 2) NOT NULL,
  total_savings DECIMAL(10, 2) NOT NULL,
  suggestions_json JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
