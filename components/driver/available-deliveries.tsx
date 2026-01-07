"use client"

import type { Delivery } from "@/lib/types/database"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Package, Phone, AlertCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ko } from "date-fns/locale"
import { acceptDelivery } from "@/lib/actions/driver"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface AvailableDeliveriesProps {
  deliveries: Delivery[]
}

export function AvailableDeliveries({ deliveries }: AvailableDeliveriesProps) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [acceptedId, setAcceptedId] = useState<string | null>(null)

  async function handleAccept(deliveryId: string) {
    setLoadingId(deliveryId)
    const result = await acceptDelivery(deliveryId)

    if (result.error) {
      alert(result.error)
      setLoadingId(null)
    } else {
      setAcceptedId(deliveryId)
      router.refresh()
    }
  }

  if (deliveries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">현재 대기 중인 배송 요청이 없습니다</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Alert className="border-blue-200 bg-blue-50">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          배송을 수락하면 고객 연락처가 공개됩니다. 고객과 직접 통화하여 요금을 협의하세요.
        </AlertDescription>
      </Alert>

      {deliveries.map((delivery) => (
        <Card key={delivery.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">배송 요청</CardTitle>
                <CardDescription>
                  {formatDistanceToNow(new Date(delivery.created_at), { addSuffix: true, locale: ko })}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">거리</div>
                <div className="text-lg font-bold">{delivery.distance_km?.toFixed(1) || "0"}km</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium">출발지</p>
                  <p className="text-muted-foreground">{delivery.pickup_address}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium">도착지</p>
                  <p className="text-muted-foreground">{delivery.delivery_address}</p>
                </div>
              </div>
            </div>

            {delivery.item_description && (
              <div className="flex items-start gap-2">
                <Package className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium">물품</p>
                  <p className="text-muted-foreground">{delivery.item_description}</p>
                </div>
              </div>
            )}

            <Alert className="border-orange-200 bg-orange-50">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800 text-sm">
                요금은 고객과 직접 협의하세요. 플랫폼은 요금에 관여하지 않습니다.
              </AlertDescription>
            </Alert>

            {acceptedId === delivery.id ? (
              <Alert className="border-green-200 bg-green-50">
                <Phone className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  배송 요청을 수락했습니다! 고객 연락처가 공개되었습니다. 고객과 직접 통화하여 요금을 협의하세요.
                </AlertDescription>
              </Alert>
            ) : (
              <Button
                onClick={() => handleAccept(delivery.id)}
                disabled={loadingId !== null}
                className="w-full"
                size="lg"
              >
                {loadingId === delivery.id ? "수락 중..." : "배송 수락하기"}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
