// Mock Supabase client for demo purposes
export const supabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: () => Promise.resolve({ data: null, error: null }),
    signUp: () => Promise.resolve({ data: null, error: null }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: null }),
      }),
    }),
    insert: () => Promise.resolve({ data: null }),
    update: () => Promise.resolve({ data: null }),
  }),
  channel: () => ({
    on: () => ({
      subscribe: () => {},
    }),
  }),
  removeChannel: () => {},
}
