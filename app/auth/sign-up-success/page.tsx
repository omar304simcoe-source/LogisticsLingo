import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-white">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Truck className="h-8 w-8" />
            <h1 className="text-2xl font-bold">LogisticsLingo</h1>
          </div>
          <Card className="border-black">
            <CardHeader>
              <CardTitle className="text-2xl">Check your email</CardTitle>
              <CardDescription className="text-gray-600">We sent you a confirmation link</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Please check your email and click the confirmation link to activate your account.
              </p>
              <Button asChild className="w-full bg-black text-white hover:bg-gray-800">
                <Link href="/auth/login">Return to login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
