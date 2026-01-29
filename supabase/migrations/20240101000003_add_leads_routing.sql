-- Add property_id and agent_id columns to leads table for proper routing
-- This fixes the "Lead Routing" bug where leads don't track which property or agent they're for

alter table leads 
add column property_id uuid references properties on delete set null,
add column agent_id uuid references auth.users on delete set null;

-- Create index for faster queries
create index idx_leads_property on leads(property_id);
create index idx_leads_agent on leads(agent_id);
