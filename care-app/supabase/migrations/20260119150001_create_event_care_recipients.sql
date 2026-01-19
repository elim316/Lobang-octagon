-- Create sequence for event_care_recipients
create sequence "public"."event_care_recipients_id_seq";

-- Create event_care_recipients table
create table "public"."event_care_recipients" (
  "id" bigint not null default nextval('public.event_care_recipients_id_seq'::regclass),
  "created_at" timestamp with time zone not null default now(),
  "event_id" bigint not null,
  "care_recipient_user_id" uuid not null,
  "status" text not null default 'signed_up'::text,
  "submission_data" jsonb
);

-- Set sequence ownership
alter sequence "public"."event_care_recipients_id_seq" owned by "public"."event_care_recipients"."id";

-- Create indexes
CREATE UNIQUE INDEX event_care_recipients_pkey ON public.event_care_recipients USING btree (id);
CREATE UNIQUE INDEX event_care_recipients_event_id_care_recipient_user_id_key ON public.event_care_recipients USING btree (event_id, care_recipient_user_id);
CREATE UNIQUE INDEX event_care_recipients_unique_signup ON public.event_care_recipients USING btree (event_id, care_recipient_user_id);

-- Add primary key constraint
alter table "public"."event_care_recipients" add constraint "event_care_recipients_pkey" PRIMARY KEY using index "event_care_recipients_pkey";

-- Add foreign key constraints
alter table "public"."event_care_recipients" add constraint "event_care_recipients_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public."Events"(id) ON DELETE CASCADE not valid;
alter table "public"."event_care_recipients" validate constraint "event_care_recipients_event_id_fkey";

alter table "public"."event_care_recipients" add constraint "event_care_recipients_care_recipient_user_id_fkey" FOREIGN KEY (care_recipient_user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;
alter table "public"."event_care_recipients" validate constraint "event_care_recipients_care_recipient_user_id_fkey";

alter table "public"."event_care_recipients" add constraint "event_care_recipients_event_id_care_recipient_user_id_key" UNIQUE using index "event_care_recipients_event_id_care_recipient_user_id_key";

alter table "public"."event_care_recipients" add constraint "event_care_recipients_unique_signup" UNIQUE using index "event_care_recipients_unique_signup";

-- Enable RLS
alter table "public"."event_care_recipients" enable row level security;

-- Create RLS policies
create policy "staff can view all care recipient signups"
  on "public"."event_care_recipients"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles p
  WHERE ((p.user_id = auth.uid()) AND (p.role = 'staff'::public.user_role)))));

create policy "care recipients can insert their signup"
  on "public"."event_care_recipients"
  as permissive
  for insert
  to authenticated
with check ((care_recipient_user_id = auth.uid()));

create policy "care recipients can view their signups"
  on "public"."event_care_recipients"
  as permissive
  for select
  to authenticated
using ((care_recipient_user_id = auth.uid()));

create policy "care recipients can update their signups"
  on "public"."event_care_recipients"
  as permissive
  for update
  to authenticated
using ((care_recipient_user_id = auth.uid()));

-- Grant permissions
grant delete on table "public"."event_care_recipients" to "anon";
grant insert on table "public"."event_care_recipients" to "anon";
grant references on table "public"."event_care_recipients" to "anon";
grant select on table "public"."event_care_recipients" to "anon";
grant trigger on table "public"."event_care_recipients" to "anon";
grant truncate on table "public"."event_care_recipients" to "anon";
grant update on table "public"."event_care_recipients" to "anon";

grant delete on table "public"."event_care_recipients" to "authenticated";
grant insert on table "public"."event_care_recipients" to "authenticated";
grant references on table "public"."event_care_recipients" to "authenticated";
grant select on table "public"."event_care_recipients" to "authenticated";
grant trigger on table "public"."event_care_recipients" to "authenticated";
grant truncate on table "public"."event_care_recipients" to "authenticated";
grant update on table "public"."event_care_recipients" to "authenticated";

grant delete on table "public"."event_care_recipients" to "service_role";
grant insert on table "public"."event_care_recipients" to "service_role";
grant references on table "public"."event_care_recipients" to "service_role";
grant select on table "public"."event_care_recipients" to "service_role";
grant trigger on table "public"."event_care_recipients" to "service_role";
grant truncate on table "public"."event_care_recipients" to "service_role";
grant update on table "public"."event_care_recipients" to "service_role";
