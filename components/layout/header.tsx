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
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error("Header session check error:", error)
          setIsAuthenticated(false)
        } else {
          const authenticated = !!session
          setIsAuthenticated(authenticated)
          console.log("Header session check:", authenticated, session?.user?.id)
        }
      } catch (error) {
        console.error("Header session check exception:", error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkSession()

    // 인증 상태 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
      console.log("Header auth state changed:", _event, !!session)
      setIsAuthenticated(!!session)
      setIsLoading(false)
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
            {!isLoading && (
              isAuthenticated ? (
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
              )
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
