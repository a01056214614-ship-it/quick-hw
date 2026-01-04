"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createDelivery } from "@/lib/actions/deliveries"
import { useRouter } from "next/navigation"
import { MapPin, Package, Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface DeliveryRequestFormProps {
  userProfile: any
}

export function DeliveryRequestForm({ userProfile }: DeliveryRequestFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [nearbyDriversCount, setNearbyDriversCount] = useState<number | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setNearbyDriversCount(null)

    const formData = new FormData(e.currentTarget)

    const data = {
      pickupAddress: formData.get("pickupAddress") as string,
      pickupLat: Number.parseFloat(formData.get("pickupLat") as string) || 37.5665,
      pickupLng: Number.parseFloat(formData.get("pickupLng") as string) || 126.978,
      pickupContactName: formData.get("pickupContactName") as string,
      pickupContactPhone: formData.get("pickupContactPhone") as string,
      pickupNotes: formData.get("pickupNotes") as string,

      deliveryAddress: formData.get("deliveryAddress") as string,
      deliveryLat: Number.parseFloat(formData.get("deliveryLat") as string) || 37.5665,
      deliveryLng: Number.parseFloat(formData.get("deliveryLng") as string) || 126.978,
      deliveryContactName: formData.get("deliveryContactName") as string,
      deliveryContactPhone: formData.get("deliveryContactPhone") as string,
      deliveryNotes: formData.get("deliveryNotes") as string,

      itemDescription: formData.get("itemDescription") as string,
      itemWeight: Number.parseFloat(formData.get("itemWeight") as string) || undefined,
      packageSize: formData.get("packageSize") as string,
    }

    const result = await createDelivery(data)

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      setNearbyDriversCount(result.nearbyDriversCount || 0)
      setIsLoading(false)

      // 3초 후 자동으로 고객 페이지로 이동
      setTimeout(() => {
        router.push("/customer")
      }, 3000)
    }
  }

  if (nearbyDriversCount !== null) {
    return (
      <div className="space-y-6">
        <Alert className="border-green-200 bg-green-50">
          <Check className="h-5 w-5 text-green-600" />
          <AlertTitle className="text-green-800">배송 요청이 완료되었습니다!</AlertTitle>
          <AlertDescription className="text-green-700">
            {nearbyDriversCount > 0
              ? `픽업 위치 근처 ${nearbyDriversCount}명의 배송원에게 알림이 전송되었습니다. 곧 배송원이 배송을 수락할 예정입니다.`
              : "배송 요청이 등록되었습니다. 배송원이 확인하는 대로 배송을 시작합니다."}
          </AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/customer")} className="w-full">
          내 배송 목록으로 이동
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            픽업 정보
          </CardTitle>
          <CardDescription>물품을 픽업할 장소 정보를 입력하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pickupAddress">픽업 주소</Label>
            <Input id="pickupAddress" name="pickupAddress" placeholder="서울시 강남구 테헤란로 123" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pickupLat">위도 (테스트용)</Label>
              <Input id="pickupLat" name="pickupLat" type="number" step="any" placeholder="37.5665" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pickupLng">경도 (테스트용)</Label>
              <Input id="pickupLng" name="pickupLng" type="number" step="any" placeholder="126.978" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pickupContactName">픽업 담당자</Label>
            <Input
              id="pickupContactName"
              name="pickupContactName"
              placeholder="홍길동"
              defaultValue={userProfile?.full_name || ""}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pickupContactPhone">픽업 연락처</Label>
            <Input
              id="pickupContactPhone"
              name="pickupContactPhone"
              type="tel"
              placeholder="010-1234-5678"
              defaultValue={userProfile?.phone || ""}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pickupNotes">픽업 메모 (선택)</Label>
            <Textarea id="pickupNotes" name="pickupNotes" placeholder="1층 로비에서 픽업" rows={2} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-red-600" />
            배송 정보
          </CardTitle>
          <CardDescription>물품을 배송받을 장소 정보를 입력하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deliveryAddress">배송 주소</Label>
            <Input id="deliveryAddress" name="deliveryAddress" placeholder="서울시 서초구 서초대로 456" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deliveryLat">위도 (테스트용)</Label>
              <Input id="deliveryLat" name="deliveryLat" type="number" step="any" placeholder="37.5012" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryLng">경도 (테스트용)</Label>
              <Input id="deliveryLng" name="deliveryLng" type="number" step="any" placeholder="127.0396" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryContactName">수령인</Label>
            <Input id="deliveryContactName" name="deliveryContactName" placeholder="김철수" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryContactPhone">수령인 연락처</Label>
            <Input
              id="deliveryContactPhone"
              name="deliveryContactPhone"
              type="tel"
              placeholder="010-9876-5432"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryNotes">배송 메모 (선택)</Label>
            <Textarea id="deliveryNotes" name="deliveryNotes" placeholder="경비실에 맡겨주세요" rows={2} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            물품 정보
          </CardTitle>
          <CardDescription>배송할 물품에 대한 정보를 입력하세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="itemDescription">물품 설명 (선택)</Label>
            <Input id="itemDescription" name="itemDescription" placeholder="서류, 선물 등" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="itemWeight">무게 (kg, 선택)</Label>
              <Input id="itemWeight" name="itemWeight" type="number" step="0.1" placeholder="1.5" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="packageSize">크기 (선택)</Label>
              <Input id="packageSize" name="packageSize" placeholder="소형, 중형, 대형" />
            </div>
          </div>
        </CardContent>
      </Card>

      {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
          취소
        </Button>
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "요청 중..." : "배송 요청하기"}
        </Button>
      </div>
    </form>
  )
}
