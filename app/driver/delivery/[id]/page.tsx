import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getDeliveryDetails } from "@/lib/actions/tracking"
import { DriverLocationUpdater } from "@/components/driver/driver-location-updater"
import { DeliveryStatusTimeline } from "@/components/tracking/delivery-status-timeline"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const statusConfig = {
  accepted: { label: "수락됨", color: "bg-blue-100 text-blue-800" },
  picked_up: { label: "픽업완료", color: "bg-indigo-100 text-indigo-800" },
  in_transit: { label: "배송중", color: "bg-purple-100 text-purple-800" },
  delivered: { label: "완료", color: "bg-green-100 text-green-800" },
}

export default async function DriverDeliveryDetailPage({ params }: { params: { id: string } }) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { id } = await params
  const { delivery } = await getDeliveryDetails(id)

  if (!delivery || delivery.driver_id !== user.id) {
    redirect("/driver")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline">
            <Link href="/driver">← 돌아가기</Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">배송 상세</h1>
            <p className="text-sm text-muted-foreground">배송 정보와 경로를 확인하세요</p>
          </div>
          <Badge className={statusConfig[delivery.status as keyof typeof statusConfig]?.color}>
            {statusConfig[delivery.status as keyof typeof statusConfig]?.label}
          </Badge>
        </div>

        <DriverLocationUpdater deliveryId={delivery.id} />

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                픽업 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">주소</p>
                <p className="font-medium">{delivery.pickup_address}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">담당자</p>
                <p className="font-medium">{delivery.pickup_contact_name}</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">연락처</p>
                  <p className="font-medium">{delivery.pickup_contact_phone}</p>
                </div>
                <Button asChild size="sm">
                  <a href={`tel:${delivery.pickup_contact_phone}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    전화
                  </a>
                </Button>
              </div>
              {delivery.pickup_notes && (
                <div className="bg-accent/50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">메모</p>
                  <p className="text-sm">{delivery.pickup_notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-red-600" />
                배송 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">주소</p>
                <p className="font-medium">{delivery.delivery_address}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">수령인</p>
                <p className="font-medium">{delivery.delivery_contact_name}</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">연락처</p>
                  <p className="font-medium">{delivery.delivery_contact_phone}</p>
                </div>
                <Button asChild size="sm">
                  <a href={`tel:${delivery.delivery_contact_phone}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    전화
                  </a>
                </Button>
              </div>
              {delivery.delivery_notes && (
                <div className="bg-accent/50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">메모</p>
                  <p className="text-sm">{delivery.delivery_notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>배송 진행 상황</CardTitle>
          </CardHeader>
          <CardContent>
            <DeliveryStatusTimeline delivery={delivery} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>요금 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">거리</span>
              <span className="font-medium">{delivery.distance_km?.toFixed(1)}km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">기본 요금</span>
              <span className="font-medium">{delivery.base_fee.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">거리 요금</span>
              <span className="font-medium">{delivery.distance_fee?.toLocaleString() || 0}원</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="font-semibold">배송원 수익</span>
              <span className="text-xl font-bold text-green-600">{delivery.driver_fee?.toLocaleString() || 0}원</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
