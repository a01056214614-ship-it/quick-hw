"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface CreateDeliveryData {
  pickupAddress: string
  pickupLat: number
  pickupLng: number
  pickupContactName: string
  pickupContactPhone: string
  pickupNotes?: string

  deliveryAddress: string
  deliveryLat: number
  deliveryLng: number
  deliveryContactName: string
  deliveryContactPhone: string
  deliveryNotes?: string

  itemDescription?: string
  itemWeight?: number
  packageSize?: string
}

export async function createDelivery(data: CreateDeliveryData) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "인증이 필요합니다" }
  }

  // 거리 계산
  const { data: distanceData, error: distanceError } = await supabase.rpc("calculate_distance", {
    lat1: data.pickupLat,
    lon1: data.pickupLng,
    lat2: data.deliveryLat,
    lon2: data.deliveryLng,
  })

  if (distanceError) {
    return { error: "거리 계산에 실패했습니다" }
  }

  const distanceKm = distanceData as number

  // 요금 계산
  const { data: feeData, error: feeError } = await supabase.rpc("calculate_delivery_fee", {
    distance_km: distanceKm,
  })

  if (feeError || !feeData || feeData.length === 0) {
    return { error: "요금 계산에 실패했습니다" }
  }

  const fees = feeData[0]

  const { data: delivery, error } = await supabase
    .from("deliveries")
    .insert({
      customer_id: user.id,
      pickup_address: data.pickupAddress,
      pickup_location: `POINT(${data.pickupLng} ${data.pickupLat})`,
      pickup_contact_name: data.pickupContactName,
      pickup_contact_phone: data.pickupContactPhone,
      pickup_notes: data.pickupNotes,
      delivery_address: data.deliveryAddress,
      delivery_location: `POINT(${data.deliveryLng} ${data.deliveryLat})`,
      delivery_contact_name: data.deliveryContactName,
      delivery_contact_phone: data.deliveryContactPhone,
      delivery_notes: data.deliveryNotes,
      item_description: data.itemDescription,
      item_weight: data.itemWeight,
      package_size: data.packageSize,
      distance_km: distanceKm,
      base_fee: fees.base_fee,
      distance_fee: fees.distance_fee,
      total_fee: fees.total_fee,
      driver_fee: fees.driver_fee,
      platform_fee: fees.platform_fee,
      status: "pending",
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  const { data: nearbyDrivers } = await supabase.rpc("find_nearby_drivers", {
    pickup_lat: data.pickupLat,
    pickup_lng: data.pickupLng,
    max_distance_km: 10.0,
    limit_count: 5,
  })

  revalidatePath("/customer")
  return {
    success: true,
    delivery,
    nearbyDriversCount: nearbyDrivers?.length || 0,
  }
}

export async function getMyDeliveries() {
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
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    return { error: error.message }
  }

  return { deliveries: data }
}

export async function cancelDelivery(deliveryId: string) {
  const supabase = await getSupabaseServerClient()

  const { error } = await supabase
    .from("deliveries")
    .update({
      status: "cancelled",
      cancelled_at: new Date().toISOString(),
    })
    .eq("id", deliveryId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/customer")
  return { success: true }
}

export async function rateDelivery(deliveryId: string, rating: number, review?: string) {
  const supabase = await getSupabaseServerClient()

  const { error } = await supabase
    .from("deliveries")
    .update({
      customer_rating: rating,
      customer_review: review,
    })
    .eq("id", deliveryId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/customer")
  return { success: true }
}

export async function getNearbyDrivers(pickupLat: number, pickupLng: number) {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase.rpc("find_nearby_drivers", {
    pickup_lat: pickupLat,
    pickup_lng: pickupLng,
    max_distance_km: 10.0,
    limit_count: 10,
  })

  if (error) {
    return { error: error.message }
  }

  return { drivers: data }
}
