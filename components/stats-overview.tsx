"use client"

import { BarChart3, AlertTriangle, Shield, TrendingUp } from "lucide-react"

interface StatsOverviewProps {
  stats: {
    total: number
    flagged: number
    trusted: number
  }
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const flaggedPercentage = stats.total > 0 ? Math.round((stats.flagged / stats.total) * 100) : 0
  const trustedPercentage = stats.total > 0 ? Math.round((stats.trusted / stats.total) * 100) : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      <div className="tte-card p-8 gradient-overlay shadow-premium">
        <div className="flex items-center justify-between mb-6">
          <div className="p-4 bg-gradient-to-br from-[#374151] to-[#4b5563] rounded-2xl interactive-element shadow-premium">
            <BarChart3 className="w-7 h-7 tte-accent-text" />
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-white mb-1">{stats.total}</div>
            <div className="text-sm tte-text-muted font-medium">Total Products</div>
          </div>
        </div>
        <div className="text-sm tte-text-muted leading-relaxed">
          Products analyzed with advanced AI algorithms for comprehensive fraud detection
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-white/60">
          <TrendingUp className="w-3 h-3" />
          <span>Updated in real-time</span>
        </div>
      </div>

      <div className="tte-card p-8 gradient-overlay shadow-premium">
        <div className="flex items-center justify-between mb-6">
          <div className="p-4 bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-2xl interactive-element animate-glow">
            <AlertTriangle className="w-7 h-7 text-red-400" />
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-red-400 mb-1">{stats.flagged}</div>
            <div className="text-sm tte-text-muted font-medium">Flagged ({flaggedPercentage}%)</div>
          </div>
        </div>
        <div className="text-sm tte-text-muted leading-relaxed">
          High-risk products requiring immediate attention and potential investigation
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-red-400/80">
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
          <span>Requires action</span>
        </div>
      </div>

      <div className="tte-card p-8 gradient-overlay shadow-premium">
        <div className="flex items-center justify-between mb-6">
          <div className="p-4 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-2xl interactive-element">
            <Shield className="w-7 h-7 text-green-400" />
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-green-400 mb-1">{stats.trusted}</div>
            <div className="text-sm tte-text-muted font-medium">Trusted ({trustedPercentage}%)</div>
          </div>
        </div>
        <div className="text-sm tte-text-muted leading-relaxed">
          Verified authentic products with confirmed trustworthy seller patterns
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-green-400/80">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>Verified authentic</span>
        </div>
      </div>
    </div>
  )
}
