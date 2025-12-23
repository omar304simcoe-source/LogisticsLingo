'use client'

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut, CreditCard } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function NavUser({ user }: { user: any }) {
  const router = useRouter()
  const supabase = createClient()

  // This function handles the sign out safely
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    
    // Using window.location forces a full refresh which clears the 
    // internal cache and lets the proxy/middleware see the session is gone.
    window.location.href = "/auth/login"
  }

  const initials = user?.email?.charAt(0).toUpperCase() || "U"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 outline-none group hover:opacity-90 transition-opacity">
        <Avatar className="h-9 w-9 rounded-lg border shadow-sm">
          <AvatarFallback className="rounded-lg bg-blue-600 text-white text-xs font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold text-slate-900">Account</span>
          <span className="truncate text-xs text-slate-500">{user?.email}</span>
        </div>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56" align="end" sideOffset={8} shadow-lg>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-slate-900">User Settings</p>
            <p className="text-xs leading-none text-slate-500">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/dashboard/profile')}>
            <User className="mr-2 h-4 w-4 text-slate-500" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <CreditCard className="mr-2 h-4 w-4 text-slate-500" />
            <span>Billing</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4 text-slate-500" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        {/* Changed from Form to MenuItem with onClick to avoid 405 error */}
        <DropdownMenuItem 
          className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}