import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Truck, Shield, Clock } from "lucide-react"

export default function HomePage() {
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
            <CardContent className="flex gap-4 justify-center flex-wrap">
              <Button asChild size="lg">
                <Link href="/auth/signup?role=customer">고객으로 가입</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/auth/signup?role=driver">배송원으로 가입</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
