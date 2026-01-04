"use client"

import type { Delivery } from "@/lib/types/database"
import { Button } from "@/components/ui/button"
import { MapPin, DollarSign } from "lucide-react"
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

  async function handleAccept(deliveryId: string) {
    setLoadingId(deliveryId)
    const result = await acceptDelivery(deliveryId)

    if (result.error) {
      alert(result.error)
    } else {
      router.refresh()
    }

    setLoadingId(null)
  }

  if (deliveries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">현재 대기 중인 배송이 없습니다</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {deliveries.map((delivery) => (
        <div key={delivery.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 space-y-2">
              <div className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(delivery.created_at), { addSuffix: true, locale: ko })}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium">출발</p>
                    <p className="text-muted-foreground">{delivery.pickup_address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium">도착</p>
                    <p className="text-muted-foreground">{delivery.delivery_address}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-green-600 font-bold text-xl">
                <DollarSign className="h-5 w-5" />
                {delivery.driver_fee?.toLocaleString() || "계산중"}원
              </div>
              <p className="text-xs text-muted-foreground">{delivery.distance_km?.toFixed(1)}km</p>
            </div>
          </div>
          <Button
            onClick={() => handleAccept(delivery.id)}
            disabled={loadingId === delivery.id}
            className="w-full"
            size="lg"
          >
            {loadingId === delivery.id ? "수락 중..." : "배송 수락하기"}
          </Button>
        </div>
      ))}
    </div>
  )
}
