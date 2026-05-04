--
-- PostgreSQL database dump
--

-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.3 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: increment_listing_view(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.increment_listing_view(p_id text) RETURNS integer
    LANGUAGE sql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  update public.listings
     set view_count = coalesce(view_count, 0) + 1
   where id = p_id
   returning view_count;
$$;


--
-- Name: rls_auto_enable(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.rls_auto_enable() RETURNS event_trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_catalog'
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;


--
-- Name: set_profiles_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_profiles_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO ''
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: agent_saling; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.agent_saling (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    agent_id text NOT NULL,
    listing_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    agent_posted boolean DEFAULT true NOT NULL
);


--
-- Name: agents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.agents (
    id text NOT NULL,
    profile_id uuid,
    name text NOT NULL,
    avatar text,
    phone text,
    email text,
    company text,
    rating numeric(2,1) DEFAULT 0 NOT NULL,
    review_count integer DEFAULT 0 NOT NULL,
    listings_count integer DEFAULT 0 NOT NULL,
    verified boolean DEFAULT false NOT NULL,
    bio text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    clerk_user_id text
);


--
-- Name: COLUMN agents.clerk_user_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.agents.clerk_user_id IS 'Clerk user id (user_...) — нэг Clerk = нэг agents мөр.';


--
-- Name: buy_request_recommendations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.buy_request_recommendations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    buy_request_id text NOT NULL,
    listing_id text NOT NULL,
    agent_id text,
    recommended_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: buy_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.buy_requests (
    id text NOT NULL,
    title text,
    property_type text NOT NULL,
    district text,
    location text,
    budget bigint,
    rooms integer,
    sqm numeric(10,2),
    notes text,
    contact_phone text,
    workflow_status text DEFAULT 'open'::text NOT NULL,
    submitted_by jsonb,
    assigned_agent_id text,
    barter_offer text,
    barter_target text,
    cash_difference bigint,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    submitted_by_profile_id uuid,
    CONSTRAINT buy_requests_workflow_status_check CHECK ((workflow_status = ANY (ARRAY['open'::text, 'claimed'::text, 'in_progress'::text, 'closed'::text])))
);


--
-- Name: listings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.listings (
    id text NOT NULL,
    title text NOT NULL,
    property_type text NOT NULL,
    price bigint NOT NULL,
    payment_method text,
    price_per_sqm bigint,
    sqm numeric(10,2),
    rooms integer,
    bathrooms integer,
    floor integer,
    total_floors integer,
    commission_year integer,
    location text,
    district text,
    address text,
    description text,
    features text[] DEFAULT '{}'::text[] NOT NULL,
    images text[] DEFAULT '{}'::text[] NOT NULL,
    verified boolean DEFAULT false NOT NULL,
    featured boolean DEFAULT false NOT NULL,
    agent_id text,
    nearby_services jsonb DEFAULT '[]'::jsonb NOT NULL,
    latitude double precision,
    longitude double precision,
    workflow_status text DEFAULT 'draft'::text NOT NULL,
    selected_agent_id text,
    submitted_by jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    service_type text DEFAULT 'self'::text NOT NULL,
    submitted_by_profile_id uuid,
    view_count integer DEFAULT 0 NOT NULL,
    contact_phone text,
    CONSTRAINT listings_service_type_check CHECK ((service_type = ANY (ARRAY['self'::text, 'agent'::text]))),
    CONSTRAINT listings_workflow_status_check CHECK ((workflow_status = ANY (ARRAY['draft'::text, 'pending'::text, 'published'::text, 'archived'::text])))
);


--
-- Name: COLUMN listings.view_count; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.listings.view_count IS 'Detail page impressions (increment via API).';


--
-- Name: COLUMN listings.contact_phone; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.listings.contact_phone IS 'Зар дээрх холбоо барих дугаар (submitted_by.phone-тай ижил утгаар синк).';


--
-- Name: news; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.news (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    href text NOT NULL,
    source text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    clerk_user_id text NOT NULL,
    email text,
    full_name text,
    phone text,
    role text DEFAULT 'buyer'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    avatar_url text,
    CONSTRAINT profiles_role_check CHECK ((role = ANY (ARRAY['buyer'::text, 'agent'::text, 'admin'::text])))
);


--
-- Name: TABLE profiles; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.profiles IS 'Clerk-аас таньсан хэрэглэгч — нэг clerk_user_id = нэг мөр. API (POST /api/profile/sync) эсвэл бусад upsert-ээр бөглөнө.';


--
-- Name: COLUMN profiles.clerk_user_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.clerk_user_id IS 'Clerk user id (user_...).';


--
-- Name: COLUMN profiles.avatar_url; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.profiles.avatar_url IS 'Clerk profile image URL (optional).';


--
-- Name: property_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.property_images (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    property_id text NOT NULL,
    image_url text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    uploaded_by_profile_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: saved_listings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.saved_listings (
    user_profile_id uuid NOT NULL,
    listing_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: searching_agent; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.searching_agent (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    property_id text NOT NULL,
    user_id uuid NOT NULL,
    status text DEFAULT 'open'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT searching_agent_status_check CHECK ((status = ANY (ARRAY['open'::text, 'claimed'::text, 'closed'::text])))
);


--
-- Name: agent_saling agent_saling_agent_id_listing_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agent_saling
    ADD CONSTRAINT agent_saling_agent_id_listing_id_key UNIQUE (agent_id, listing_id);


--
-- Name: agent_saling agent_saling_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agent_saling
    ADD CONSTRAINT agent_saling_pkey PRIMARY KEY (id);


--
-- Name: agents agents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agents
    ADD CONSTRAINT agents_pkey PRIMARY KEY (id);


--
-- Name: buy_request_recommendations buy_request_recommendations_buy_request_listing_agent_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.buy_request_recommendations
    ADD CONSTRAINT buy_request_recommendations_buy_request_listing_agent_key UNIQUE (buy_request_id, listing_id, agent_id);


--
-- Name: buy_request_recommendations buy_request_recommendations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.buy_request_recommendations
    ADD CONSTRAINT buy_request_recommendations_pkey PRIMARY KEY (id);


--
-- Name: buy_requests buy_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.buy_requests
    ADD CONSTRAINT buy_requests_pkey PRIMARY KEY (id);


--
-- Name: listings listings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_pkey PRIMARY KEY (id);


--
-- Name: news news_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_clerk_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_clerk_user_id_key UNIQUE (clerk_user_id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: property_images property_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.property_images
    ADD CONSTRAINT property_images_pkey PRIMARY KEY (id);


--
-- Name: saved_listings saved_listings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.saved_listings
    ADD CONSTRAINT saved_listings_pkey PRIMARY KEY (user_profile_id, listing_id);


--
-- Name: searching_agent searching_agent_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.searching_agent
    ADD CONSTRAINT searching_agent_pkey PRIMARY KEY (id);


--
-- Name: searching_agent searching_agent_property_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.searching_agent
    ADD CONSTRAINT searching_agent_property_id_user_id_key UNIQUE (property_id, user_id);


--
-- Name: agent_saling_agent_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX agent_saling_agent_id_idx ON public.agent_saling USING btree (agent_id);


--
-- Name: agent_saling_listing_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX agent_saling_listing_id_idx ON public.agent_saling USING btree (listing_id);


--
-- Name: agents_clerk_user_id_uidx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX agents_clerk_user_id_uidx ON public.agents USING btree (clerk_user_id) WHERE (clerk_user_id IS NOT NULL);


--
-- Name: idx_agents_profile_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_agents_profile_id ON public.agents USING btree (profile_id);


--
-- Name: idx_buy_req_recs_listing_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_buy_req_recs_listing_id ON public.buy_request_recommendations USING btree (listing_id);


--
-- Name: idx_buy_request_recommendations_agent_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_buy_request_recommendations_agent_id ON public.buy_request_recommendations USING btree (agent_id);


--
-- Name: idx_buy_request_recommendations_buy_request_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_buy_request_recommendations_buy_request_id ON public.buy_request_recommendations USING btree (buy_request_id);


--
-- Name: idx_buy_requests_assigned_agent_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_buy_requests_assigned_agent_id ON public.buy_requests USING btree (assigned_agent_id);


--
-- Name: idx_buy_requests_district; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_buy_requests_district ON public.buy_requests USING btree (district);


--
-- Name: idx_buy_requests_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_buy_requests_status ON public.buy_requests USING btree (workflow_status);


--
-- Name: idx_buy_requests_submitted_by_profile_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_buy_requests_submitted_by_profile_id ON public.buy_requests USING btree (submitted_by_profile_id);


--
-- Name: idx_listings_agent_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_listings_agent_id ON public.listings USING btree (agent_id);


--
-- Name: idx_listings_district; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_listings_district ON public.listings USING btree (district);


--
-- Name: idx_listings_selected_agent_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_listings_selected_agent_id ON public.listings USING btree (selected_agent_id);


--
-- Name: idx_listings_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_listings_status ON public.listings USING btree (workflow_status);


--
-- Name: idx_listings_submitted_by_profile_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_listings_submitted_by_profile_id ON public.listings USING btree (submitted_by_profile_id);


--
-- Name: idx_property_images_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_property_images_created_at ON public.property_images USING btree (created_at DESC);


--
-- Name: idx_property_images_property_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_property_images_property_id ON public.property_images USING btree (property_id);


--
-- Name: idx_property_images_uploaded_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_property_images_uploaded_by ON public.property_images USING btree (uploaded_by_profile_id);


--
-- Name: idx_saved_listings_listing_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_saved_listings_listing_id ON public.saved_listings USING btree (listing_id);


--
-- Name: idx_searching_agent_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_searching_agent_created_at ON public.searching_agent USING btree (created_at DESC);


--
-- Name: idx_searching_agent_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_searching_agent_status ON public.searching_agent USING btree (status);


--
-- Name: idx_searching_agent_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_searching_agent_user_id ON public.searching_agent USING btree (user_id);


--
-- Name: news_sort_created_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX news_sort_created_idx ON public.news USING btree (sort_order, created_at);


--
-- Name: profiles profiles_set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_profiles_updated_at();


--
-- Name: agent_saling agent_saling_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agent_saling
    ADD CONSTRAINT agent_saling_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.agents(id) ON DELETE CASCADE;


--
-- Name: agent_saling agent_saling_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agent_saling
    ADD CONSTRAINT agent_saling_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON DELETE CASCADE;


--
-- Name: agents agents_profile_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agents
    ADD CONSTRAINT agents_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE SET NULL;


--
-- Name: buy_request_recommendations buy_request_recommendations_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.buy_request_recommendations
    ADD CONSTRAINT buy_request_recommendations_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.agents(id) ON DELETE SET NULL;


--
-- Name: buy_request_recommendations buy_request_recommendations_buy_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.buy_request_recommendations
    ADD CONSTRAINT buy_request_recommendations_buy_request_id_fkey FOREIGN KEY (buy_request_id) REFERENCES public.buy_requests(id) ON DELETE CASCADE;


--
-- Name: buy_request_recommendations buy_request_recommendations_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.buy_request_recommendations
    ADD CONSTRAINT buy_request_recommendations_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON DELETE CASCADE;


--
-- Name: buy_requests buy_requests_assigned_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.buy_requests
    ADD CONSTRAINT buy_requests_assigned_agent_id_fkey FOREIGN KEY (assigned_agent_id) REFERENCES public.agents(id) ON DELETE SET NULL;


--
-- Name: buy_requests buy_requests_submitted_by_profile_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.buy_requests
    ADD CONSTRAINT buy_requests_submitted_by_profile_id_fkey FOREIGN KEY (submitted_by_profile_id) REFERENCES public.profiles(id) ON DELETE SET NULL;


--
-- Name: listings listings_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.agents(id) ON DELETE SET NULL;


--
-- Name: listings listings_selected_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_selected_agent_id_fkey FOREIGN KEY (selected_agent_id) REFERENCES public.agents(id) ON DELETE SET NULL;


--
-- Name: listings listings_submitted_by_profile_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_submitted_by_profile_id_fkey FOREIGN KEY (submitted_by_profile_id) REFERENCES public.profiles(id) ON DELETE SET NULL;


--
-- Name: property_images property_images_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.property_images
    ADD CONSTRAINT property_images_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.listings(id) ON DELETE CASCADE;


--
-- Name: property_images property_images_uploaded_by_profile_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.property_images
    ADD CONSTRAINT property_images_uploaded_by_profile_id_fkey FOREIGN KEY (uploaded_by_profile_id) REFERENCES public.profiles(id) ON DELETE SET NULL;


--
-- Name: saved_listings saved_listings_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.saved_listings
    ADD CONSTRAINT saved_listings_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON DELETE CASCADE;


--
-- Name: saved_listings saved_listings_user_profile_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.saved_listings
    ADD CONSTRAINT saved_listings_user_profile_id_fkey FOREIGN KEY (user_profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: searching_agent searching_agent_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.searching_agent
    ADD CONSTRAINT searching_agent_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.listings(id) ON DELETE CASCADE;


--
-- Name: searching_agent searching_agent_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.searching_agent
    ADD CONSTRAINT searching_agent_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: agent_saling; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.agent_saling ENABLE ROW LEVEL SECURITY;

--
-- Name: agent_saling agent_saling_private; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY agent_saling_private ON public.agent_saling FOR SELECT TO authenticated, anon USING (false);


--
-- Name: agents; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

--
-- Name: agents agents_public_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY agents_public_read ON public.agents FOR SELECT TO authenticated, anon USING (true);


--
-- Name: buy_request_recommendations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.buy_request_recommendations ENABLE ROW LEVEL SECURITY;

--
-- Name: buy_request_recommendations buy_request_recommendations_public_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY buy_request_recommendations_public_read ON public.buy_request_recommendations FOR SELECT TO authenticated, anon USING ((EXISTS ( SELECT 1
   FROM public.buy_requests br
  WHERE ((br.id = buy_request_recommendations.buy_request_id) AND (br.workflow_status = ANY (ARRAY['open'::text, 'in_progress'::text]))))));


--
-- Name: buy_requests; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.buy_requests ENABLE ROW LEVEL SECURITY;

--
-- Name: buy_requests buy_requests_public_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY buy_requests_public_read ON public.buy_requests FOR SELECT TO authenticated, anon USING ((workflow_status = ANY (ARRAY['open'::text, 'in_progress'::text])));


--
-- Name: listings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

--
-- Name: listings listings_public_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY listings_public_read ON public.listings FOR SELECT TO authenticated, anon USING ((workflow_status = 'published'::text));


--
-- Name: news; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

--
-- Name: news news_public_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY news_public_read ON public.news FOR SELECT TO authenticated, anon USING (is_active);


--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles profiles_private; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY profiles_private ON public.profiles FOR SELECT TO authenticated, anon USING (false);


--
-- Name: property_images; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;

--
-- Name: property_images property_images_public_read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY property_images_public_read ON public.property_images FOR SELECT TO authenticated, anon USING ((EXISTS ( SELECT 1
   FROM public.listings l
  WHERE ((l.id = property_images.property_id) AND (l.workflow_status = 'published'::text)))));


--
-- Name: saved_listings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.saved_listings ENABLE ROW LEVEL SECURITY;

--
-- Name: saved_listings saved_listings_private; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY saved_listings_private ON public.saved_listings FOR SELECT TO authenticated, anon USING (false);


--
-- Name: searching_agent; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.searching_agent ENABLE ROW LEVEL SECURITY;

--
-- Name: searching_agent searching_agent_private; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY searching_agent_private ON public.searching_agent FOR SELECT TO authenticated, anon USING (false);


--
-- PostgreSQL database dump complete
--

