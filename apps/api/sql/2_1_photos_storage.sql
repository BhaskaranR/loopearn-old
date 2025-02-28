
create policy "Allow public view access to images"
on "storage"."objects"
as permissive
for select
using (bucket_id = 'images'::text);


drop policy "Give members access to team folder insert" on storage.objects;

-- Then create the new simple policy
create policy "Allow authenticated users to upload images"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (bucket_id = 'images'::text);

create policy "Give members access to team folder insert"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (
  bucket_id = 'images'::text --AND 
--   public.is_user_in_business((storage.foldername(objects.name))[1]::uuid)
);

create policy "Give members access to team folder update"
on "storage"."objects"
as permissive
for update
to authenticated
using (
  bucket_id = 'images'::text AND 
  public.is_user_in_business((storage.foldername(objects.name))[1]::uuid)
);

create policy "Give members access to team folder delete"
on "storage"."objects"
as permissive
for delete
to authenticated
using (
  bucket_id = 'images'::text AND 
  public.is_user_in_business((storage.foldername(objects.name))[1]::uuid)
);
