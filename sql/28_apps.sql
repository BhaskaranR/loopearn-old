
create table "public"."apps" (
    "id" uuid not null default gen_random_uuid(),
    "business_id" uuid default gen_random_uuid(),
    "config" jsonb,
    "created_at" timestamp with time zone default now(),
    "app_id" text not null,
    "created_by" uuid default gen_random_uuid(),
    "settings" jsonb
);


alter table "public"."apps" enable row level security;


CREATE UNIQUE INDEX integrations_pkey ON public.apps USING btree (id);

CREATE UNIQUE INDEX unique_app_id_business_id ON public.apps USING btree (app_id, business_id);

alter table "public"."apps" add constraint "integrations_pkey" PRIMARY KEY using index "integrations_pkey";

alter table "public"."apps" add constraint "apps_created_by_fkey" FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."apps" validate constraint "apps_created_by_fkey";

alter table "public"."apps" add constraint "integrations_business_id_fkey" FOREIGN KEY (business_id) REFERENCES business(id) ON DELETE CASCADE not valid;

alter table "public"."apps" validate constraint "integrations_business_id_fkey";

alter table "public"."apps" add constraint "unique_app_id_business_id" UNIQUE using index "unique_app_id_business_id";



grant delete on table "public"."apps" to "anon";

grant insert on table "public"."apps" to "anon";

grant references on table "public"."apps" to "anon";

grant select on table "public"."apps" to "anon";

grant trigger on table "public"."apps" to "anon";

grant truncate on table "public"."apps" to "anon";

grant update on table "public"."apps" to "anon";

grant delete on table "public"."apps" to "authenticated";

grant insert on table "public"."apps" to "authenticated";

grant references on table "public"."apps" to "authenticated";

grant select on table "public"."apps" to "authenticated";

grant trigger on table "public"."apps" to "authenticated";

grant truncate on table "public"."apps" to "authenticated";

grant update on table "public"."apps" to "authenticated";

grant delete on table "public"."apps" to "service_role";

grant insert on table "public"."apps" to "service_role";

grant references on table "public"."apps" to "service_role";

grant select on table "public"."apps" to "service_role";

grant trigger on table "public"."apps" to "service_role";

grant truncate on table "public"."apps" to "service_role";

grant update on table "public"."apps" to "service_role";


CREATE OR REPLACE FUNCTION "private"."get_businesses_for_authenticated_user"() RETURNS SETOF "uuid"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select business_id
  from business_users
  where user_id = auth.uid()
$$;

ALTER FUNCTION "private"."get_businesses_for_authenticated_user"() OWNER TO "postgres";

create policy "Apps can be deleted by a member of the team"
on "public"."apps"
as permissive
for delete
to public
using ((business_id IN ( SELECT private.get_businesses_for_authenticated_user() AS get_businesses_for_authenticated_user)));


create policy "Apps can be inserted by a member of the team"
on "public"."apps"
as permissive
for insert
to public
with check ((business_id IN ( SELECT private.get_businesses_for_authenticated_user() AS get_businesses_for_authenticated_user)));


create policy "Apps can be selected by a member of the team"
on "public"."apps"
as permissive
for select
to public
using ((business_id IN ( SELECT private.get_businesses_for_authenticated_user() AS get_businesses_for_authenticated_user)));


create policy "Apps can be updated by a member of the team"
on "public"."apps"
as permissive
for update
to public
using ((business_id IN ( SELECT private.get_businesses_for_authenticated_user() AS get_businesses_for_authenticated_user)));
