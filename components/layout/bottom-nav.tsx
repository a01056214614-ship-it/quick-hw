"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Package, Truck, LayoutDashboard, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomNav() {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith("/auth")

  if (isAuthPage) return null

  const isCustomerRoute = pathname?.startsWith("/customer")
  const isDriverRoute = pathname?.startsWith("/driver")
  const isAdminRoute = pathname?.startsWith("/admin")

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
            <span className="text-xs">내 정보</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
