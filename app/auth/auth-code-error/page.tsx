import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AuthCodeErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const errorMessage = params?.error

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
              <CardTitle className="text-2xl">Authentication Error</CardTitle>
            </CardHeader>
            <CardContent>
              {errorMessage ? (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-red-600 mb-2">Error Details:</p>
                  <p className="text-sm text-gray-600">{errorMessage}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-600 mb-4">
                  There was an error processing your authentication code. This could happen if:
                </p>
              )}
              {!errorMessage && (
                <ul className="text-sm text-gray-600 mb-4 list-disc list-inside space-y-1">
                  <li>The link has expired</li>
                  <li>The link has already been used</li>
                  <li>The link is invalid</li>
                </ul>
              )}
              <div className="space-y-2">
                <Button asChild className="w-full bg-black text-white hover:bg-gray-800">
                  <Link href="/auth/login">Return to login</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/auth/sign-up">Create a new account</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
