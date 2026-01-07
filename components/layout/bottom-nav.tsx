"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, Package, Truck, LayoutDashboard, User, DollarSign, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { signOut } from "@/lib/actions/auth"

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const isAuthPage = pathname?.startsWith("/auth")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    
    // 현재 세션 확인
    const checkSession = async () => {
      try {
        // getUser()를 사용하여 더 확실하게 세션 확인
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) {
          console.error("BottomNav user check error:", error)
          setIsAuthenticated(false)
          setUserRole(null)
        } else {
          const authenticated = !!user
          setIsAuthenticated(authenticated)
          console.log("BottomNav user check:", authenticated, user?.id)
          
          if (user) {
            // 프로필 정보 가져오기
            const { data: profile, error: profileError } = await supabase
              .from("profiles")
              .select("role")
              .eq("id", user.id)
              .maybeSingle()
            
            if (profileError) {
              console.error("Profile fetch error:", profileError)
            } else {
              setUserRole(profile?.role || null)
              console.log("User role:", profile?.role)
            }
          } else {
            setUserRole(null)
          }
        }
      } catch (error) {
        console.error("BottomNav user check exception:", error)
        setIsAuthenticated(false)
        setUserRole(null)
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
      console.log("BottomNav auth state changed:", _event, !!session)
      const authenticated = !!session
      setIsAuthenticated(authenticated)
      
      if (session?.user) {
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .maybeSingle()
          setUserRole(profile?.role || null)
        } catch (error) {
          console.error("Profile fetch error in onAuthStateChange:", error)
          setUserRole(null)
        }
      } else {
        setUserRole(null)
      }
      
      setIsLoading(false)
      
      // 세션 변경 시 추가 확인
      if (_event === "SIGNED_IN" || _event === "SIGNED_OUT" || _event === "TOKEN_REFRESHED") {
        // 약간의 지연 후 다시 확인하여 확실하게 상태 업데이트
        setTimeout(async () => {
          const { data: { user } } = await supabase.auth.getUser()
          setIsAuthenticated(!!user)
          if (user) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("role")
              .eq("id", user.id)
              .maybeSingle()
            setUserRole(profile?.role || null)
          } else {
            setUserRole(null)
          }
          setIsLoading(false)
        }, 100)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  if (isAuthPage) return null

  const isCustomerRoute = pathname?.startsWith("/customer")
  const isDriverRoute = pathname?.startsWith("/driver")
  const isAdminRoute = pathname?.startsWith("/admin")

  // 내 정보 링크 결정
  const getProfileLink = () => {
    if (!isAuthenticated) return "/auth/login"
    if (userRole === "customer") return "/customer"
    if (userRole === "driver") return "/driver"
    if (userRole === "admin") return "/admin"
    return "/auth/login"
  }

  async function handleSignOut() {
    await signOut()
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          <Link
            href="/"
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
              pathname === "/" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">홈</span>
          </Link>

          {isCustomerRoute && (
            <>
              <Link
                href="/customer"
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                  pathname === "/customer"
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Package className="w-5 h-5" />
                <span className="text-xs">내 배송</span>
              </Link>
              <Link
                href="/customer/new-delivery"
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                  pathname === "/customer/new-delivery"
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Package className="w-5 h-5" />
                <span className="text-xs">배송 요청</span>
              </Link>
            </>
          )}

          {isDriverRoute && (
            <>
              <Link
                href="/driver"
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                  pathname === "/driver" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Truck className="w-5 h-5" />
                <span className="text-xs">배송 관리</span>
              </Link>
              <Link
                href="/driver/settlements"
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                  pathname === "/driver/settlements"
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <DollarSign className="w-5 h-5" />
                <span className="text-xs">정산</span>
              </Link>
            </>
          )}

          {isAdminRoute && (
            <Link
              href="/admin"
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                pathname === "/admin" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-xs">대시보드</span>
            </Link>
          )}

          {isLoading ? (
            <Link
              href="/auth/login"
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                "text-muted-foreground opacity-50"
              )}
            >
              <User className="w-5 h-5" />
              <span className="text-xs">로딩...</span>
            </Link>
          ) : isAuthenticated ? (
            <form action={handleSignOut} className="flex-1">
              <button
                type="submit"
                className={cn(
                  "w-full flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                  "text-muted-foreground hover:text-foreground"
                )}
              >
                <LogOut className="w-5 h-5" />
                <span className="text-xs">로그아웃</span>
              </button>
            </form>
          ) : (
            <Link
              href="/auth/login"
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                pathname?.startsWith("/auth")
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <User className="w-5 h-5" />
              <span className="text-xs">로그인</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
