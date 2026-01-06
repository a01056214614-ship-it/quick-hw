import { createBrowserClient } from "@supabase/ssr"

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (supabaseClient) {
    return supabaseClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_QUICKSUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_QUICKSUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Please check your .env.local file:\n" +
      "- NEXT_PUBLIC_QUICKSUPABASE_URL\n" +
      "- NEXT_PUBLIC_QUICKSUPABASE_ANON_KEY\n\n" +
      "Get these values from: https://supabase.com/dashboard/project/_/settings/api"
    )
  }

  try {
    supabaseClient = createBrowserClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        auth: {
          persistSession: false, // localStorage 사용 안 함
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      },
    )

    return supabaseClient
  } catch (error) {
    console.error("[v0] Error creating Supabase client:", error)
    throw error
  }
}
