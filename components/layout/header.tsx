"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Package } from "lucide-react"

export function Header() {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith("/auth")

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Image src="/logo.svg" alt="퀵HW 로고" width={120} height={40} priority />
        </Link>

        {!isAuthPage && (
          <nav className="flex items-center gap-2">
            <Link href="/customer">
              <Button variant="ghost" size="sm" className="gap-2">
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">배송 요청</span>
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="sm">
                로그인
              </Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
