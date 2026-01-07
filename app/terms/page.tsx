import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Shield, FileText } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">약관 및 안내</h1>
          <p className="text-muted-foreground">서비스 이용 약관 및 중요 안내사항</p>
        </div>

        {/* 법적 고지 */}
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>중요:</strong> 본 플랫폼은 운송 당사자가 아닌 중개 플랫폼입니다.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              서비스 정체성
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              본 플랫폼은 퀵 기사와 고객(또는 업체)을 연결해주는 중개 플랫폼입니다.
            </p>
            <div className="space-y-2">
              <p><strong>요금 책정:</strong> 플랫폼은 요금에 관여하지 않으며, 기사와 고객이 직접 협의합니다.</p>
              <p><strong>인적 사고 책임:</strong> 인적 사고(상해·사망)는 기사 개인 책임입니다.</p>
              <p><strong>물품 사고 책임:</strong> 물품 사고(파손·분실)는 플랫폼 보험으로 처리되며, 명확한 한도 내에서만 보상됩니다.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              보험 안내
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">플랫폼 단체 물품 보험</h3>
              <p className="text-sm text-muted-foreground mb-4">
                물품 파손·분실 시 플랫폼 보험으로 처리됩니다.
              </p>
              <div className="space-y-2">
                <p><strong>보상 범위:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>물품 파손: 실제 손해액 (최대 100만원)</li>
                  <li>물품 분실: 실제 손해액 (최대 100만원)</li>
                  <li>인적 사고: 보상 불가 (기사 개인 책임)</li>
                </ul>
              </div>
            </div>
            <Alert>
              <AlertDescription>
                보상 한도 및 세부 사항은 보험 약관에 명시되어 있습니다. 
                사고 발생 시 즉시 접수해주시기 바랍니다.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>요금 안내</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              요금은 기사와 고객이 직접 협의합니다. 플랫폼은 요금에 관여하지 않으며, 
              중개 수수료를 받지 않습니다.
            </p>
            <p className="text-sm text-muted-foreground">
              기사와 연결된 후 직접 통화하여 요금을 협의하시기 바랍니다.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>책임 한계</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">플랫폼 책임</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>물품 사고 보상 (약관에 명시된 범위 내)</li>
                <li>기사-고객 연결 서비스 제공</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">플랫폼 비책임</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>인적 사고 (상해·사망) - 기사 개인 책임</li>
                <li>요금 협의 및 지불 - 기사-고객 직접 책임</li>
                <li>운송 계약 위반 - 기사-고객 간 분쟁</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>문의 및 사고 접수</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              일반 문의나 물품 사고 접수가 필요하신 경우, 고객 대시보드에서 접수하실 수 있습니다.
            </p>
            <p className="text-sm text-muted-foreground">
              사고 접수 후 1영업일 내 안내드립니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

