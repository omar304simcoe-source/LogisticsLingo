-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'agency')),
  subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'cancelled')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  messages_today INTEGER DEFAULT 0,
  messages_reset_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_delete_own" ON public.profiles
  FOR DELETE USING (auth.uid() = id);

-- Create saved templates table
CREATE TABLE IF NOT EXISTS public.saved_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_name TEXT NOT NULL,
  message_type TEXT NOT NULL,
  template_content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on saved templates
ALTER TABLE public.saved_templates ENABLE ROW LEVEL SECURITY;

-- Saved templates policies
CREATE POLICY "templates_select_own" ON public.saved_templates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "templates_insert_own" ON public.saved_templates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "templates_update_own" ON public.saved_templates
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "templates_delete_own" ON public.saved_templates
  FOR DELETE USING (auth.uid() = user_id);

-- Create message history table
CREATE TABLE IF NOT EXISTS public.message_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_type TEXT NOT NULL,
  generated_message TEXT NOT NULL,
  load_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on message history
ALTER TABLE public.message_history ENABLE ROW LEVEL SECURITY;

-- Message history policies
CREATE POLICY "history_select_own" ON public.message_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "history_insert_own" ON public.message_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "history_delete_own" ON public.message_history
  FOR DELETE USING (auth.uid() = user_id);

-- Create agency members table (for agency plan)
CREATE TABLE IF NOT EXISTS public.agency_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  member_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(agency_owner_id, member_id)
);

-- Enable RLS on agency members
ALTER TABLE public.agency_members ENABLE ROW LEVEL SECURITY;

-- Agency members policies
CREATE POLICY "agency_select_own" ON public.agency_members
  FOR SELECT USING (auth.uid() = agency_owner_id OR auth.uid() = member_id);

CREATE POLICY "agency_insert_owner" ON public.agency_members
  FOR INSERT WITH CHECK (auth.uid() = agency_owner_id);

CREATE POLICY "agency_delete_owner" ON public.agency_members
  FOR DELETE USING (auth.uid() = agency_owner_id);
