import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getAllDeliveries } from "@/lib/actions/admin"
import { getAvailableDriversForDispatch, dispatchDriver } from "@/lib/actions/dispatch"
import { DispatchDialog } from "@/components/admin/dispatch-dialog"

export default async function DispatchPage() {
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

  const { deliveries = [] } = await getAllDeliveries()
  const { drivers = [] } = await getAvailableDriversForDispatch()

  const pendingDeliveries = deliveries.filter((d: any) => d.status === "pending" && !d.driver_id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-balance">배차 관리</h1>
            <p className="text-muted-foreground mt-1">배송원을 배송에 배차하세요</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>배차 대기 중인 배송</CardTitle>
              <CardDescription>배송원 배차가 필요한 배송 목록</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingDeliveries.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">배차 대기 중인 배송이 없습니다</p>
                ) : (
                  pendingDeliveries.map((delivery: any) => (
                    <div key={delivery.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">
                            {delivery.pickup_address} → {delivery.delivery_address}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            거리: {delivery.distance_km?.toFixed(1)}km | 요금: {delivery.total_fee?.toLocaleString()}원
                          </p>
                          <p className="text-xs text-muted-foreground">
                            요청 시간: {new Date(delivery.created_at).toLocaleString("ko-KR")}
                          </p>
                        </div>
                        <DispatchDialog delivery={delivery} drivers={drivers} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>배송 가능한 배송원</CardTitle>
              <CardDescription>현재 배송 가능한 배송원 목록</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {drivers.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">배송 가능한 배송원이 없습니다</p>
                ) : (
                  drivers.map((driver: any) => (
                    <div key={driver.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{driver.full_name || driver.email}</p>
                          <p className="text-sm text-muted-foreground">
                            차량: {driver.driver_info?.vehicle_type} ({driver.driver_info?.vehicle_number})
                          </p>
                          <p className="text-sm text-muted-foreground">
                            평점: {driver.driver_info?.rating?.toFixed(1)} | 배송 건수: {driver.driver_info?.total_deliveries || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

