import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAccidentReports } from "@/lib/actions/accident"
import { AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react"

export default async function AccidentsPage() {
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

  const { accidents = [] } = await getAccidentReports()

  const stats = {
    total: accidents.length,
    reported: accidents.filter((a: any) => a.status === "reported").length,
    investigating: accidents.filter((a: any) => a.status === "investigating").length,
    resolved: accidents.filter((a: any) => a.status === "resolved").length,
    closed: accidents.filter((a: any) => a.status === "closed").length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-balance">사고 접수 관리</h1>
            <p className="text-muted-foreground mt-1">사고 접수 내역을 관리하세요</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>전체 사고</CardDescription>
              <CardTitle className="text-2xl">{stats.total}</CardTitle>
            </CardHeader>
            <CardContent>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>접수됨</CardDescription>
              <CardTitle className="text-2xl text-yellow-600">{stats.reported}</CardTitle>
            </CardHeader>
            <CardContent>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>조사 중</CardDescription>
              <CardTitle className="text-2xl text-blue-600">{stats.investigating}</CardTitle>
            </CardHeader>
            <CardContent>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>해결됨</CardDescription>
              <CardTitle className="text-2xl text-green-600">{stats.resolved + stats.closed}</CardTitle>
            </CardHeader>
            <CardContent>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>사고 접수 목록</CardTitle>
            <CardDescription>모든 사고 접수 내역을 확인하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {accidents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">사고 접수 내역이 없습니다</p>
              ) : (
                accidents.map((accident: any) => (
                  <div key={accident.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold">
                          {accident.accident_type === "vehicle"
                            ? "차량 사고"
                            : accident.accident_type === "package_damage"
                              ? "물품 손상"
                              : accident.accident_type === "injury"
                                ? "부상"
                                : "기타"}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">{accident.accident_description}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          접수자: {accident.reporter?.full_name || accident.reporter?.email} | 접수 시간:{" "}
                          {new Date(accident.created_at).toLocaleString("ko-KR")}
                        </p>
                        {accident.delivery && (
                          <p className="text-xs text-muted-foreground">
                            배송: {accident.delivery.pickup_address} → {accident.delivery.delivery_address}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            accident.status === "closed"
                              ? "bg-gray-100 text-gray-800"
                              : accident.status === "resolved"
                                ? "bg-green-100 text-green-800"
                                : accident.status === "investigating"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {accident.status === "closed"
                            ? "종료"
                            : accident.status === "resolved"
                              ? "해결됨"
                              : accident.status === "investigating"
                                ? "조사 중"
                                : "접수됨"}
                        </span>
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
  )
}

