-- Create sequence for event_caregivers
create sequence "public"."event_caregivers_id_seq";

-- Create event_caregivers table
create table "public"."event_caregivers" (
  "id" bigint not null default nextval('public.event_caregivers_id_seq'::regclass),
  "created_at" timestamp with time zone not null default now(),
  "event_id" bigint not null,
  "caregiver_user_id" uuid not null,
  "status" text not null default 'signed_up'::text,
  "submission_data" jsonb
);

-- Set sequence ownership
alter sequence "public"."event_caregivers_id_seq" owned by "public"."event_caregivers"."id";

-- Create indexes
CREATE UNIQUE INDEX event_caregivers_pkey ON public.event_caregivers USING btree (id);
CREATE UNIQUE INDEX event_caregivers_event_id_caregiver_user_id_key ON public.event_caregivers USING btree (event_id, caregiver_user_id);
CREATE UNIQUE INDEX event_caregivers_unique_signup ON public.event_caregivers USING btree (event_id, caregiver_user_id);

-- Add primary key constraint
alter table "public"."event_caregivers" add constraint "event_caregivers_pkey" PRIMARY KEY using index "event_caregivers_pkey";

-- Add foreign key constraints
alter table "public"."event_caregivers" add constraint "event_caregivers_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public."Events"(id) ON DELETE CASCADE not valid;
alter table "public"."event_caregivers" validate constraint "event_caregivers_event_id_fkey";

alter table "public"."event_caregivers" add constraint "event_caregivers_caregiver_user_id_fkey" FOREIGN KEY (caregiver_user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;
alter table "public"."event_caregivers" validate constraint "event_caregivers_caregiver_user_id_fkey";

alter table "public"."event_caregivers" add constraint "event_caregivers_event_id_caregiver_user_id_key" UNIQUE using index "event_caregivers_event_id_caregiver_user_id_key";

alter table "public"."event_caregivers" add constraint "event_caregivers_unique_signup" UNIQUE using index "event_caregivers_unique_signup";

-- Enable RLS
alter table "public"."event_caregivers" enable row level security;

-- Create RLS policies
create policy "staff can view all caregiver signups"
  on "public"."event_caregivers"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.user_id = auth.uid()) AND (p.role = 'staff'::public.user_role)))));

create policy "caregivers can insert their signup"
  on "public"."event_caregivers"
  as permissive
  for insert
  to authenticated
with check ((caregiver_user_id = auth.uid()));

create policy "caregivers can view their signups"
  on "public"."event_caregivers"
  as permissive
  for select
  to authenticated
using ((caregiver_user_id = auth.uid()));

create policy "caregivers can update their signups"
  on "public"."event_caregivers"
  as permissive
  for update
  to authenticated
using ((caregiver_user_id = auth.uid()));

-- Grant permissions
grant delete on table "public"."event_caregivers" to "anon";
grant insert on table "public"."event_caregivers" to "anon";
grant references on table "public"."event_caregivers" to "anon";
grant select on table "public"."event_caregivers" to "anon";
grant trigger on table "public"."event_caregivers" to "anon";
grant truncate on table "public"."event_caregivers" to "anon";
grant update on table "public"."event_caregivers" to "anon";

grant delete on table "public"."event_caregivers" to "authenticated";
grant insert on table "public"."event_caregivers" to "authenticated";
grant references on table "public"."event_caregivers" to "authenticated";
grant select on table "public"."event_caregivers" to "authenticated";
grant trigger on table "public"."event_caregivers" to "authenticated";
grant truncate on table "public"."event_caregivers" to "authenticated";
grant update on table "public"."event_caregivers" to "authenticated";

grant delete on table "public"."event_caregivers" to "service_role";
grant insert on table "public"."event_caregivers" to "service_role";
grant references on table "public"."event_caregivers" to "service_role";
grant select on table "public"."event_caregivers" to "service_role";
grant trigger on table "public"."event_caregivers" to "service_role";
grant truncate on table "public"."event_caregivers" to "service_role";
grant update on table "public"."event_caregivers" to "service_role";
