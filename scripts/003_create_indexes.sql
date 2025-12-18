-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON public.profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier ON public.profiles(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_saved_templates_user_id ON public.saved_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_message_history_user_id ON public.message_history(user_id);
CREATE INDEX IF NOT EXISTS idx_message_history_created_at ON public.message_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agency_members_owner ON public.agency_members(agency_owner_id);
CREATE INDEX IF NOT EXISTS idx_agency_members_member ON public.agency_members(member_id);
