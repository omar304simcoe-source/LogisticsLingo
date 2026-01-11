import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Note: The PublicGlobalCounter has been moved to 
          app/dashboard/layout.tsx to show only for logged-in users.
      */}
      
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
          Logistics Messaging <span className="text-blue-600">Simplified.</span>
        </h1>
        
        <p className="mt-6 max-w-2xl text-lg text-slate-600">
          Generate professional dispatch, carrier, and broker messages in seconds.
          Join the logistics professionals streamlining their communication today.
        </p>

        <div className="mt-10 flex gap-4">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 shadow-lg">
            <Link href="/auth/login">Get Started for Free</Link>
          </Button>
          
          <Button asChild variant="outline" size="lg">
            <Link href="/auth/login">Login</Link>
          </Button>
        </div>
      </main>

      <footer className="py-6 border-t text-center text-sm text-slate-500">
        © {new Date().getFullYear()} LogisticsLingo. All rights reserved.
      </footer>
    </div>
  )
}