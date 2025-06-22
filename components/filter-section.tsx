"use client"

import { Filter } from "lucide-react"

interface FilterSectionProps {
  currentFilter: "all" | "flagged" | "trusted"
  onFilterChange: (filter: "all" | "flagged" | "trusted") => void
  stats: {
    total: number
    flagged: number
    trusted: number
  }
}

export function FilterSection({ currentFilter, onFilterChange, stats }: FilterSectionProps) {
  const filters = [
    { key: "all" as const, label: "All Products", count: stats.total },
    { key: "flagged" as const, label: "Flagged", count: stats.flagged },
    { key: "trusted" as const, label: "Trusted", count: stats.trusted },
  ]

  return (
    <div className="tte-card p-8 mb-12 gradient-overlay shadow-premium">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-[#374151] to-[#4b5563] rounded-xl interactive-element">
            <Filter className="w-6 h-6 tte-accent-text" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Filter Products</h3>
            <p className="text-sm tte-text-muted">Refine your view by trust status</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                currentFilter === filter.key
                  ? "bg-gradient-to-r from-[#ff6b6b] to-[#ff5252] text-white shadow-lg transform scale-105"
                  : "bg-white/5 tte-text-muted hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/20"
              }`}
            >
              {filter.label}
              <span
                className={`px-2 py-1 rounded-full text-xs font-bold ${
                  currentFilter === filter.key ? "bg-white/20 text-white" : "bg-white/10 text-white/60"
                }`}
              >
                {filter.count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
