import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, Package, Users, TrendingUp, Truck } from "lucide-react"
import { getDashboardStats, getAllDeliveries } from "@/lib/actions/admin"
import { AdminDeliveryList } from "@/components/admin/admin-delivery-list"

export default async function AdminDashboard() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profile?.role !== "admin") {
    redirect("/")
  }

  const { stats } = await getDashboardStats()
  const { deliveries = [] } = await getAllDeliveries()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-balance">관리자 대시보드</h1>
            <p className="text-muted-foreground mt-1">퀵HW 플랫폼 관리</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>총 수익</CardDescription>
              <CardTitle className="text-2xl">{stats.totalRevenue.toLocaleString()}원</CardTitle>
            </CardHeader>
            <CardContent>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>오늘 수익</CardDescription>
              <CardTitle className="text-2xl">{stats.todayRevenue.toLocaleString()}원</CardTitle>
            </CardHeader>
            <CardContent>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>전체 배송</CardDescription>
              <CardTitle className="text-2xl">{stats.totalDeliveries}</CardTitle>
            </CardHeader>
            <CardContent>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>진행 중</CardDescription>
              <CardTitle className="text-2xl text-blue-600">{stats.activeDeliveries}</CardTitle>
            </CardHeader>
            <CardContent>
              <Truck className="h-4 w-4 text-blue-600" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>고객</CardDescription>
              <CardTitle className="text-2xl">{stats.customerCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <Users className="h-4 w-4 text-purple-600" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>배송원</CardDescription>
              <CardTitle className="text-2xl">{stats.driverCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <Truck className="h-4 w-4 text-orange-600" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="deliveries" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="deliveries">배송 관리</TabsTrigger>
            <TabsTrigger value="revenue">수익 분석</TabsTrigger>
            <TabsTrigger value="users">사용자 관리</TabsTrigger>
          </TabsList>

          <TabsContent value="deliveries" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>전체 배송 목록</CardTitle>
                <CardDescription>플랫폼의 모든 배송을 관리하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminDeliveryList deliveries={deliveries} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>수익 분석</CardTitle>
                <CardDescription>기간별 수익과 세금계산서를 관리하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>오늘 통계</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">배송 건수</span>
                          <span className="font-semibold">{stats.todayDeliveries}건</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">수익</span>
                          <span className="font-semibold text-green-600">{stats.todayRevenue.toLocaleString()}원</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>누적 통계</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">총 배송</span>
                          <span className="font-semibold">{stats.totalDeliveries}건</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">총 수익</span>
                          <span className="font-semibold text-green-600">{stats.totalRevenue.toLocaleString()}원</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>고객 관리</CardTitle>
                  <CardDescription>등록된 고객: {stats.customerCount}명</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">고객 목록 및 상세 관리 기능은 추가 개발 예정입니다</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>배송원 관리</CardTitle>
                  <CardDescription>등록된 배송원: {stats.driverCount}명</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">배송원 목록 및 상세 관리 기능은 추가 개발 예정입니다</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
