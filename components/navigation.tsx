"use client"

import { BarChart3, Settings, Bell, User } from "lucide-react"

export function Navigation() {
  return (
    <nav className="tte-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="tte-brand">TEMPORAL TRUST ENGINE</div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <button className="text-white/50 hover:text-white transition-colors">
              Analytics
            </button>
            <button className="text-white/50 hover:text-white transition-colors">
              Reports
            </button>
            <button className="text-white/50 hover:text-white transition-colors">
              Settings
            </button>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-white/50 hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </button>
            <button className="p-2 text-white/50 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 text-white/50 hover:text-white transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
