import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Package, MapPin, Clock, TrendingUp } from "lucide-react"
import { DeliveryList } from "@/components/customer/delivery-list"
import { getMyDeliveries } from "@/lib/actions/deliveries"

export default async function CustomerDashboard() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profile?.role !== "customer") {
    redirect("/")
  }

  const { deliveries = [] } = await getMyDeliveries()

  const stats = {
    total: deliveries.length,
    pending: deliveries.filter((d) => d.status === "pending").length,
    inProgress: deliveries.filter((d) => ["accepted", "picked_up", "in_transit"].includes(d.status)).length,
    completed: deliveries.filter((d) => d.status === "delivered").length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-balance">안녕하세요, {profile?.full_name}님</h1>
            <p className="text-muted-foreground mt-1">빠르고 안전한 퀵배송 서비스</p>
          </div>
          <Button asChild size="lg" className="md:w-auto">
            <Link href="/customer/new-delivery">
              <MapPin className="mr-2 h-5 w-5" />새 배송 요청
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>전체 배송</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
            <CardContent>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>대기 중</CardDescription>
              <CardTitle className="text-3xl text-yellow-600">{stats.pending}</CardTitle>
            </CardHeader>
            <CardContent>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>진행 중</CardDescription>
              <CardTitle className="text-3xl text-blue-600">{stats.inProgress}</CardTitle>
            </CardHeader>
            <CardContent>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>완료</CardDescription>
              <CardTitle className="text-3xl text-green-600">{stats.completed}</CardTitle>
            </CardHeader>
            <CardContent>
              <Package className="h-4 w-4 text-green-600" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>내 배송 목록</CardTitle>
            <CardDescription>최근 배송 내역을 확인하고 관리하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <DeliveryList deliveries={deliveries} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
