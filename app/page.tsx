import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Truck, Shield, Clock } from "lucide-react"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const supabase = await getSupabaseServerClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 로그인한 사용자는 역할에 따라 대시보드로 리다이렉트
  if (user) {
    // maybeSingle() 사용 - 결과가 없어도 에러를 던지지 않음
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle()
    
    // 에러 로깅 (RLS 정책 위반 등)
    if (profileError) {
      console.error("Profile fetch error:", profileError)
      console.error("User ID:", user.id)
      console.error("Error details:", {
        code: profileError.code,
        message: profileError.message,
        details: profileError.details,
        hint: profileError.hint,
      })
      
      // RLS 정책 위반인 경우 또는 기타 에러인 경우 프로필이 없다고 간주
      // 회원가입 페이지로 리다이렉트
      redirect("/auth/signup?error=profile_missing")
    }
    
    // 프로필이 있고 role이 있는 경우 역할에 따라 리다이렉트
    if (profile && profile.role) {
      if (profile.role === "admin") {
        redirect("/admin")
      } else if (profile.role === "driver") {
        redirect("/driver")
      } else {
        redirect("/customer")
      }
    } else {
      // 프로필이 없거나 role이 없는 경우 회원가입 페이지로 리다이렉트
      console.warn("Profile not found or missing role, redirecting to signup")
      console.warn("User ID:", user.id)
      redirect("/auth/signup?error=profile_missing")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-balance">
            빠르고 안전한
            <br />
            <span className="text-primary">퀵배송 서비스</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            카카오T 스타일의 편리한 배송 요청, 실시간 추적으로 안심하고 이용하세요
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/auth/signup">시작하기</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <Link href="/auth/login">로그인</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          <Card>
            <CardHeader>
              <Package className="h-12 w-12 text-primary mb-2" />
              <CardTitle>간편한 배송 요청</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>지도에서 터치 한 번으로 픽업과 배송지를 설정하고 즉시 요청하세요</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Truck className="h-12 w-12 text-primary mb-2" />
              <CardTitle>실시간 위치 추적</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                배송원의 현재 위치를 실시간으로 확인하고 정확한 도착 시간을 알 수 있습니다
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-12 w-12 text-primary mb-2" />
              <CardTitle>안전한 거래</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>검증된 배송원과 보험 처리로 안심하고 이용할 수 있습니다</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Clock className="h-12 w-12 text-primary mb-2" />
              <CardTitle>빠른 배송</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>가까운 배송원이 즉시 매칭되어 신속하게 배송합니다</CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="mt-24 text-center">
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl">지금 바로 시작하세요</CardTitle>
              <CardDescription className="text-lg">고객, 배송원, 관리자 모두를 위한 편리한 플랫폼</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                회원가입 시 고객 또는 배송원을 선택할 수 있습니다
              </p>
              <Button asChild size="lg">
                <Link href="/auth/signup">회원가입하기</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
