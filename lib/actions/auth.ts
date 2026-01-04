"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function signUp(formData: FormData) {
  const supabase = await getSupabaseServerClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("fullName") as string
  const phone = formData.get("phone") as string
  const role = (formData.get("role") as string) || "customer"

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo:
        process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
        (typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_QUICKSUPABASE_URL),
    },
  })

  if (authError) {
    return { error: authError.message }
  }

  if (authData.user) {
    // 프로필 생성
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      email,
      full_name: fullName,
      phone,
      role,
    })

    if (profileError) {
      return { error: profileError.message }
    }

    // 배송원인 경우 driver_info 테이블에도 레코드 생성
    if (role === "driver") {
      const { error: driverError } = await supabase.from("driver_info").insert({
        id: authData.user.id,
      })

      if (driverError) {
        return { error: driverError.message }
      }
    }
  }

  revalidatePath("/", "layout")
  redirect("/auth/verify-email")
}

export async function signIn(formData: FormData) {
  const supabase = await getSupabaseServerClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // 사용자 역할에 따라 리다이렉트
  if (data.user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single()

    revalidatePath("/", "layout")

    if (profile?.role === "admin") {
      redirect("/admin")
    } else if (profile?.role === "driver") {
      redirect("/driver")
    } else {
      redirect("/customer")
    }
  }
}

export async function signOut() {
  const supabase = await getSupabaseServerClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/")
}

export async function getCurrentUser() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return { user, profile }
}
