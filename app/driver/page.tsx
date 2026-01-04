import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, Package, Star, TrendingUp } from "lucide-react"
import { AvailableDeliveries } from "@/components/driver/available-deliveries"
import { AssignedDeliveries } from "@/components/driver/assigned-deliveries"
import { DriverStatusToggle } from "@/components/driver/driver-status-toggle"
import { getAvailableDeliveries, getMyAssignedDeliveries, getDriverInfo } from "@/lib/actions/driver"

export default async function DriverDashboard() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profile?.role !== "driver") {
    redirect("/")
  }

  const { driverInfo } = await getDriverInfo()
  const { deliveries: available = [] } = await getAvailableDeliveries()
  const { deliveries: assigned = [] } = await getMyAssignedDeliveries()

  // 오늘 수익 계산
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data: todayDeliveries } = await supabase
    .from("deliveries")
    .select("driver_fee")
    .eq("driver_id", user.id)
    .eq("status", "delivered")
    .gte("delivered_at", today.toISOString())

  const todayEarnings = todayDeliveries?.reduce((sum, d) => sum + (d.driver_fee || 0), 0) || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-balance">배송원 대시보드</h1>
            <p className="text-muted-foreground mt-1">{profile?.full_name}님, 안전 운행하세요</p>
          </div>
          <DriverStatusToggle initialStatus={driverInfo?.is_available || false} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>평점</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-1">
                {driverInfo?.rating?.toFixed(1) || "5.0"}
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{driverInfo?.total_deliveries || 0}건 완료</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>오늘 수익</CardDescription>
              <CardTitle className="text-2xl">{todayEarnings.toLocaleString()}원</CardTitle>
            </CardHeader>
            <CardContent>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>진행 중</CardDescription>
              <CardTitle className="text-3xl text-blue-600">{assigned.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>대기 배송</CardDescription>
              <CardTitle className="text-3xl text-yellow-600">{available.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <Package className="h-4 w-4 text-yellow-600" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="assigned" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="assigned">진행 중 배송 ({assigned.length})</TabsTrigger>
            <TabsTrigger value="available">대기 중 배송 ({available.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="assigned" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>진행 중인 배송</CardTitle>
                <CardDescription>현재 담당하고 있는 배송 건입니다</CardDescription>
              </CardHeader>
              <CardContent>
                <AssignedDeliveries deliveries={assigned} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="available" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>수락 가능한 배송</CardTitle>
                <CardDescription>새로운 배송 요청을 확인하고 수락하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <AvailableDeliveries deliveries={available} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
