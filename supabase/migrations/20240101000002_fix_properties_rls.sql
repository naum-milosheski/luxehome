-- Add SELECT policy to allow public access to Active properties
-- This fixes the "Invisible Listings" bug where new properties don't appear on Home/Listings pages

create policy "Anyone can view active properties"
  on properties for select
  using ( status = 'Active' );
