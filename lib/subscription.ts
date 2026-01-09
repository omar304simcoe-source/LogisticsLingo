export const SUBSCRIPTION_LIMITS = {
    free: {
      messages: 3,
    },
    pro: {
      messages: 100,
    },
    agency: {
      messages: Infinity,
    },
  } as const
  
  export type SubscriptionTier = keyof typeof SUBSCRIPTION_LIMITS
  