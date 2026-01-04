"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getAvailableDeliveries() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "인증이 필요합니다" }
  }

  // 배송원의 현재 위치 가져오기
  const { data: driverInfo } = await supabase.from("driver_info").select("*").eq("id", user.id).single()

  if (!driverInfo || !driverInfo.current_latitude || !driverInfo.current_longitude) {
    // 위치 정보가 없으면 모든 배송 요청 표시
    const { data, error } = await supabase
      .from("deliveries")
      .select("*")
      .eq("status", "pending")
      .is("driver_id", null)
      .order("created_at", { ascending: false })
      .limit(20)

    if (error) {
      return { error: error.message }
    }

    return { deliveries: data }
  }

  const { data: allDeliveries, error: allError } = await supabase
    .from("deliveries")
    .select("*")
    .eq("status", "pending")
    .is("driver_id", null)
    .order("created_at", { ascending: false })

  if (allError) {
    return { error: allError.message }
  }

  // 거리 계산하여 가까운 배송만 필터링
  const nearbyDeliveries = []
  for (const delivery of allDeliveries || []) {
    const pickupLocation = delivery.pickup_location as any
    if (pickupLocation) {
      const coords = pickupLocation.replace("POINT(", "").replace(")", "").split(" ")
      const pickupLng = Number.parseFloat(coords[0])
      const pickupLat = Number.parseFloat(coords[1])

      const { data: distance } = await supabase.rpc("calculate_distance", {
        lat1: driverInfo.current_latitude,
        lon1: driverInfo.current_longitude,
        lat2: pickupLat,
        lon2: pickupLng,
      })

      if (distance && distance <= 10) {
        nearbyDeliveries.push(delivery)
      }
    }
  }

  return { deliveries: nearbyDeliveries.slice(0, 20) }
}

export async function getMyAssignedDeliveries() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "인증이 필요합니다" }
  }

  const { data, error } = await supabase
    .from("deliveries")
    .select("*")
    .eq("driver_id", user.id)
    .in("status", ["accepted", "picked_up", "in_transit"])
    .order("accepted_at", { ascending: false })

  if (error) {
    return { error: error.message }
  }

  return { deliveries: data }
}

export async function getMyDeliveryHistory() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "인증이 필요합니다" }
  }

  const { data, error } = await supabase
    .from("deliveries")
    .select("*")
    .eq("driver_id", user.id)
    .in("status", ["delivered", "cancelled"])
    .order("delivered_at", { ascending: false })
    .limit(50)

  if (error) {
    return { error: error.message }
  }

  return { deliveries: data }
}

export async function acceptDelivery(deliveryId: string) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "인증이 필요합니다" }
  }

  const { error } = await supabase
    .from("deliveries")
    .update({
      driver_id: user.id,
      status: "accepted",
      accepted_at: new Date().toISOString(),
    })
    .eq("id", deliveryId)
    .is("driver_id", null)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/driver")
  return { success: true }
}

export async function updateDeliveryStatus(deliveryId: string, status: string) {
  const supabase = await getSupabaseServerClient()

  const updateData: any = {
    status,
  }

  if (status === "picked_up") {
    updateData.picked_up_at = new Date().toISOString()
  } else if (status === "delivered") {
    updateData.delivered_at = new Date().toISOString()
  }

  const { error } = await supabase.from("deliveries").update(updateData).eq("id", deliveryId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/driver")
  return { success: true }
}

export async function updateDriverAvailability(isAvailable: boolean) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "인증이 필요합니다" }
  }

  const { error } = await supabase.from("driver_info").update({ is_available: isAvailable }).eq("id", user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/driver")
  return { success: true }
}

export async function getDriverInfo() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "인증이 필요합니다" }
  }

  const { data, error } = await supabase.from("driver_info").select("*").eq("id", user.id).single()

  if (error) {
    return { error: error.message }
  }

  return { driverInfo: data }
}

export async function updateDriverLocation(lat: number, lng: number, deliveryId?: string) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "인증이 필요합니다" }
  }

  // driver_info 테이블의 현재 위치 업데이트
  const { error: updateError } = await supabase
    .from("driver_info")
    .update({
      current_location: `POINT(${lng} ${lat})`,
      current_latitude: lat,
      current_longitude: lng,
    })
    .eq("id", user.id)

  if (updateError) {
    return { error: updateError.message }
  }

  // 진행 중인 배송이 있으면 추적 기록 추가
  if (deliveryId) {
    const { error: trackingError } = await supabase.from("delivery_tracking").insert({
      delivery_id: deliveryId,
      driver_id: user.id,
      location: `POINT(${lng} ${lat})`,
    })

    if (trackingError) {
      console.error("Tracking error:", trackingError)
    }
  }

  return { success: true }
}
