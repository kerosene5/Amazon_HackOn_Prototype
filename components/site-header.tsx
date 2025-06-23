"use client"

import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, BarChart, AreaChart } from "lucide-react"

export function SiteHeader() {
  const itemClasses = "cursor-pointer group hover:bg-white/10 !text-white/80 hover:!text-white transition-all duration-200"
  const iconClasses = "mr-3 h-5 w-5 text-white/60 transition-all duration-200 group-hover:text-white group-hover:scale-110"

  return (
    <div className="sticky top-0 z-50 w-full">
      <header className="w-full rounded-lg border-b border-white/10 bg-black/30 backdrop-blur-lg">
        <div className="flex h-16 items-center px-8">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0 h-auto hover:bg-transparent">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" 
                  alt="Amazon Menu"
                  className="h-6"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-60 bg-slate-900/80 backdrop-blur-lg border-white/10 text-white rounded-xl mt-2"
              align="start"
            >
              <DropdownMenuItem asChild className={itemClasses}>
                <Link href="/dashboard">
                  <LayoutDashboard className={iconClasses} />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className={itemClasses}>
                <Link href="/analytics">
                  <BarChart className={iconClasses} />
                  <span>Analytics</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className={itemClasses}>
                <Link href="/reports">
                  <AreaChart className={iconClasses} />
                  <span>Reports</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex flex-1 items-center justify-end space-x-4">
            {/* The "Start Interactive Demo" button has been removed as requested */}
          </div>
        </div>
      </header>
    </div>
  )
} 