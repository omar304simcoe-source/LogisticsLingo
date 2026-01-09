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
import { User, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function NavUser({ user }: { user: any }) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/auth/login"
  }

  const initials = user?.email?.charAt(0).toUpperCase() || "U"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
        <Avatar className="h-9 w-9 rounded-lg border shadow-sm">
          <AvatarFallback className="rounded-lg bg-blue-600 text-white text-xs font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="grid text-left text-sm leading-tight">
          <span className="font-semibold text-slate-900">Account</span>
          <span className="text-xs text-slate-500">{user?.email}</span>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-medium text-slate-900">Account</p>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.push("/dashboard/profile")}
          >
            <User className="mr-2 h-4 w-4 text-slate-500" />
            <span>Profile</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-red-600 focus:text-red-600 cursor-pointer"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
