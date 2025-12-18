"use client" // Must be a client component to refresh session

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Truck, Loader2 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function PaymentSuccessPage() {
  const [isSyncing, setIsSyncing] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const syncSession = async () => {
      // Refresh the session so the new 'subscription_tier' claim is picked up
      await supabase.auth.refreshSession()
      
      // router.refresh() ensures any server components (like your Sidebar/Header) 
      // see the new data immediately
      router.refresh()
      
      // Give it a tiny delay for better UX
      setTimeout(() => setIsSyncing(false), 1000)
    }

    syncSession()
  }, [supabase.auth, router])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="border-black max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-black flex items-center justify-center">
            {isSyncing ? (
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            ) : (
              <CheckCircle2 className="h-8 w-8 text-white" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {isSyncing ? "Updating Account..." : "Payment Successful!"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-gray-600">
            {isSyncing 
              ? "We're syncing your premium access with your account." 
              : "Your subscription has been activated. You now have access to all premium features!"
            }
          </p>
          
          <Button 
            asChild 
            disabled={isSyncing}
            className={`w-full bg-black text-white hover:bg-gray-800 ${isSyncing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Link href={isSyncing ? "#" : "/dashboard"}>
              <Truck className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}