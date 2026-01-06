"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { reportAccident } from "@/lib/actions/accident"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function AccidentReportPage() {
  const [formData, setFormData] = useState({
    deliveryId: "",
    accidentType: "",
    accidentDate: new Date().toISOString().split("T")[0],
    accidentLocation: "",
    accidentDescription: "",
    vehicleDamageDescription: "",
    packageDamageDescription: "",
    injuryDescription: "",
    witnessInfo: "",
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.accidentType || !formData.accidentDescription) {
      toast.error("필수 항목을 입력해주세요")
      return
    }

    setLoading(true)
    const result = await reportAccident({
      deliveryId: formData.deliveryId || undefined,
      accidentType: formData.accidentType,
      accidentDate: new Date(formData.accidentDate).toISOString(),
      accidentLocation: formData.accidentLocation || undefined,
      accidentDescription: formData.accidentDescription,
      vehicleDamageDescription: formData.vehicleDamageDescription || undefined,
      packageDamageDescription: formData.packageDamageDescription || undefined,
      injuryDescription: formData.injuryDescription || undefined,
      witnessInfo: formData.witnessInfo || undefined,
    })

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("사고 접수가 완료되었습니다")
      router.push("/customer")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">사고 접수</h1>
          <p className="text-muted-foreground mt-1">사고가 발생한 경우 접수해주세요</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>사고 정보 입력</CardTitle>
            <CardDescription>사고 상세 정보를 입력해주세요</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="accidentType">사고 유형 *</Label>
                <Select value={formData.accidentType} onValueChange={(value) => setFormData({ ...formData, accidentType: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="사고 유형을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vehicle">차량 사고</SelectItem>
                    <SelectItem value="package_damage">물품 손상</SelectItem>
                    <SelectItem value="injury">부상</SelectItem>
                    <SelectItem value="other">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="accidentDate">사고 발생일 *</Label>
                <Input
                  id="accidentDate"
                  type="date"
                  value={formData.accidentDate}
                  onChange={(e) => setFormData({ ...formData, accidentDate: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="accidentLocation">사고 발생 장소</Label>
                <Input
                  id="accidentLocation"
                  value={formData.accidentLocation}
                  onChange={(e) => setFormData({ ...formData, accidentLocation: e.target.value })}
                  placeholder="사고 발생 장소를 입력하세요"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="accidentDescription">사고 상세 설명 *</Label>
                <Textarea
                  id="accidentDescription"
                  value={formData.accidentDescription}
                  onChange={(e) => setFormData({ ...formData, accidentDescription: e.target.value })}
                  placeholder="사고 상세 내용을 입력하세요"
                  className="mt-1"
                  rows={4}
                  required
                />
              </div>

              {formData.accidentType === "vehicle" && (
                <div>
                  <Label htmlFor="vehicleDamageDescription">차량 손상 설명</Label>
                  <Textarea
                    id="vehicleDamageDescription"
                    value={formData.vehicleDamageDescription}
                    onChange={(e) => setFormData({ ...formData, vehicleDamageDescription: e.target.value })}
                    placeholder="차량 손상 내용을 입력하세요"
                    className="mt-1"
                    rows={3}
                  />
                </div>
              )}

              {formData.accidentType === "package_damage" && (
                <div>
                  <Label htmlFor="packageDamageDescription">물품 손상 설명</Label>
                  <Textarea
                    id="packageDamageDescription"
                    value={formData.packageDamageDescription}
                    onChange={(e) => setFormData({ ...formData, packageDamageDescription: e.target.value })}
                    placeholder="물품 손상 내용을 입력하세요"
                    className="mt-1"
                    rows={3}
                  />
                </div>
              )}

              {formData.accidentType === "injury" && (
                <div>
                  <Label htmlFor="injuryDescription">부상 설명</Label>
                  <Textarea
                    id="injuryDescription"
                    value={formData.injuryDescription}
                    onChange={(e) => setFormData({ ...formData, injuryDescription: e.target.value })}
                    placeholder="부상 내용을 입력하세요"
                    className="mt-1"
                    rows={3}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="witnessInfo">목격자 정보</Label>
                <Input
                  id="witnessInfo"
                  value={formData.witnessInfo}
                  onChange={(e) => setFormData({ ...formData, witnessInfo: e.target.value })}
                  placeholder="목격자 연락처 또는 정보를 입력하세요"
                  className="mt-1"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "접수 중..." : "사고 접수하기"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

