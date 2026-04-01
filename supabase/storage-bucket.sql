-- Create public-assets storage bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'public-assets',
  'public-assets',
  true,
  5242880, -- 5MB limit
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do nothing;

-- Allow anyone to read public files
create policy "Public read access"
  on storage.objects for select
  using ( bucket_id = 'public-assets' );

-- Allow authenticated users to upload
create policy "Authenticated users can upload"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'public-assets' );

-- Allow authenticated users to update their own uploads
create policy "Authenticated users can update"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'public-assets' );

-- Allow authenticated users to delete their own uploads
create policy "Authenticated users can delete"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'public-assets' );
