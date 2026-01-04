import { createBrowserClient } from "@supabase/ssr"

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (supabaseClient) {
    return supabaseClient
  }

  try {
    supabaseClient = createBrowserClient(
      process.env.NEXT_PUBLIC_QUICKSUPABASE_URL!,
      process.env.NEXT_PUBLIC_QUICKSUPABASE_ANON_KEY!,
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

    try {
      supabaseClient = createBrowserClient(
        process.env.NEXT_PUBLIC_QUICKSUPABASE_URL!,
        process.env.NEXT_PUBLIC_QUICKSUPABASE_ANON_KEY!,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
          },
        },
      )
      return supabaseClient
    } catch (retryError) {
      console.error("[v0] Retry failed:", retryError)
      throw retryError
    }
  }
}
