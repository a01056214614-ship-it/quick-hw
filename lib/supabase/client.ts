import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
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
    // createBrowserClient는 브라우저에서 쿠키를 자동으로 읽습니다
    // 별도 설정 없이도 쿠키에서 세션을 읽고 쓸 수 있습니다
    return createBrowserClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.error("[v0] Error creating Supabase client:", error)
    throw error
  }
}
