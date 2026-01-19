-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.Account details (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  Username character varying,
  Password character varying,
  Preferences character varying,
  CONSTRAINT Account details_pkey PRIMARY KEY (id)
);
CREATE TABLE public.Caregiver Details (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  Name text,
  HP smallint,
  NRIC character varying,
  DOB date,
  Religion text,
  Address text,
  House type character varying,
  diet character varying,
  Blk info character varying,
  user_id uuid UNIQUE,
  CONSTRAINT Caregiver Details_pkey PRIMARY KEY (id),
  CONSTRAINT caregiver_user_fk FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.Events (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  Name character varying,
  Event Type character varying,
  No. of people smallint,
  Date and Time timestamp without time zone,
  Duration smallint,
  CONSTRAINT Events_pkey PRIMARY KEY (id)
);
CREATE TABLE public.Participant Details (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  Name text,
  HP smallint,
  NRIC character varying,
  DOB date,
  Religion text,
  Address text,
  House type character varying,
  diet character varying,
  Blk info character varying,
  user_id uuid UNIQUE,
  CONSTRAINT Participant Details_pkey PRIMARY KEY (id),
  CONSTRAINT participant_user_fk FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.event_volunteers (
  id bigint NOT NULL DEFAULT nextval('event_volunteers_id_seq'::regclass),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  event_id bigint NOT NULL,
  volunteer_user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'signed_up'::text,
  CONSTRAINT event_volunteers_pkey PRIMARY KEY (id),
  CONSTRAINT event_volunteers_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.Events(id),
  CONSTRAINT event_volunteers_volunteer_user_id_fkey FOREIGN KEY (volunteer_user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.profiles (
  user_id uuid NOT NULL,
  role USER-DEFINED,
  display_name text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (user_id),
  CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);