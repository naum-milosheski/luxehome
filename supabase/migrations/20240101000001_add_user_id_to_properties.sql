-- Add user_id to properties table
alter table properties 
add column user_id uuid references auth.users on delete cascade;

-- Update RLS policies to allow users to update/delete only their own properties
-- (Assuming existing policies need update, or adding new ones)
create policy "Users can update their own properties"
  on properties for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own properties"
  on properties for delete
  using ( auth.uid() = user_id );
