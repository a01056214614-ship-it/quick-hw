import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "퀵HW - 빠르고 안전한 퀵배송 서비스",
  description: "카카오T 스타일의 편리한 배송 요청과 실시간 추적으로 안심하고 이용하세요",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if (typeof localStorage !== 'undefined') {
                    // 모든 Supabase 관련 키를 찾아서 삭제
                    var keys = [];
                    for (var i = 0; i < localStorage.length; i++) {
                      var key = localStorage.key(i);
                      if (key && key.startsWith('sb-')) {
                        keys.push(key);
                      }
                    }
                    // 찾은 키들을 모두 삭제
                    keys.forEach(function(key) {
                      try {
                        localStorage.removeItem(key);
                      } catch (e) {
                        // 개별 키 삭제 실패는 무시
                      }
                    });
                  }
                } catch (e) {
                  // localStorage 접근 불가시 무시
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`font-sans antialiased`} suppressHydrationWarning>
        <Header />
        <main className="pt-16 pb-16 min-h-screen">{children}</main>
        <BottomNav />
        <Analytics />
      </body>
    </html>
  )
}
