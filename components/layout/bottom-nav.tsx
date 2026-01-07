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
    let mounted = true
    
    // 현재 세션 확인
    const checkSession = async () => {
      try {
        // getSession()을 사용하여 쿠키에서 세션 확인
        const { data: { session }, error } = await supabase.auth.getSession()
        if (!mounted) return
        
        if (error) {
          console.error("BottomNav session check error:", error)
          setIsAuthenticated(false)
          setUserRole(null)
        } else {
          const authenticated = !!session
          setIsAuthenticated(authenticated)
          console.log("BottomNav session check:", authenticated, session?.user?.id)
          
          if (session?.user) {
            // 프로필 정보 가져오기
            const { data: profile, error: profileError } = await supabase
              .from("profiles")
              .select("role")
              .eq("id", session.user.id)
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
        if (!mounted) return
        console.error("BottomNav session check exception:", error)
        setIsAuthenticated(false)
        setUserRole(null)
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }
    
    // 즉시 세션 확인
    checkSession()

    // 인증 상태 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
      if (!mounted) return
      
      console.log("BottomNav auth state changed:", _event, !!session)
      const authenticated = !!session
      setIsAuthenticated(authenticated)
      
      if (session?.user) {
        // 프로필 정보 가져오기
        supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .maybeSingle()
          .then(({ data: profile, error: profileError }) => {
            if (!mounted) return
            if (profileError) {
              console.error("Profile fetch error in onAuthStateChange:", profileError)
            } else {
              setUserRole(profile?.role || null)
            }
            setIsLoading(false)
          })
      } else {
        setUserRole(null)
        setIsLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
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
