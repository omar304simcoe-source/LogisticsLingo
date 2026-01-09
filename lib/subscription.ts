export const SUBSCRIPTION_LIMITS = {
    free: {
      messages: 10,
    },
    pro: {
      messages: 100,
    },
    agency: {
      messages: Infinity,
    },
  } as const
  
  export type SubscriptionTier = keyof typeof SUBSCRIPTION_LIMITS
  