"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Package, LogOut } from "lucide-react"
import { signOut } from "@/lib/actions/auth"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function Header() {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith("/auth")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    
    // 현재 세션 확인
    const checkSession = async () => {
      try {
        // getUser()를 사용하여 더 확실하게 세션 확인
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) {
          console.error("Header user check error:", error)
          setIsAuthenticated(false)
        } else {
          const authenticated = !!user
          setIsAuthenticated(authenticated)
          console.log("Header user check:", authenticated, user?.id)
        }
      } catch (error) {
        console.error("Header user check exception:", error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }
    
    // 즉시 세션 확인
    checkSession()

    // 인증 상태 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event: string, session: any) => {
      console.log("Header auth state changed:", _event, !!session)
      const authenticated = !!session
      setIsAuthenticated(authenticated)
      setIsLoading(false)
      
      // 세션 변경 시 추가 확인
      if (_event === "SIGNED_IN" || _event === "SIGNED_OUT" || _event === "TOKEN_REFRESHED") {
        // 약간의 지연 후 다시 확인하여 확실하게 상태 업데이트
        setTimeout(async () => {
          const { data: { user } } = await supabase.auth.getUser()
          setIsAuthenticated(!!user)
          setIsLoading(false)
        }, 100)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    await signOut()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Image src="/logo.svg" alt="퀵HW 로고" width={120} height={40} priority />
        </Link>

        {!isAuthPage && (
          <nav className="flex items-center gap-2">
            <Link href="/terms">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                약관
              </Button>
            </Link>
            {isAuthenticated && (
              <Link href="/customer">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Package className="w-4 h-4" />
                  <span className="hidden sm:inline">배송 요청</span>
                </Button>
              </Link>
            )}
            {isLoading ? (
              <Button variant="outline" size="sm" disabled>
                <span className="hidden sm:inline">...</span>
              </Button>
            ) : isAuthenticated ? (
              <form action={handleSignOut}>
                <Button variant="outline" size="sm" type="submit" className="gap-2">
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">로그아웃</span>
                </Button>
              </form>
            ) : (
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  로그인
                </Button>
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
