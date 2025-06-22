"use client"

import { useRouter } from "next/navigation"
import { AlertTriangle, Shield, TrendingUp, Users, ExternalLink, Ban } from "lucide-react"
import type { Product } from "@/lib/fraud-logic"

interface ProductCardProps {
  product: Product
  index: number
}

export function ProductCard({ product, index }: ProductCardProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/analysis/${product.asin}`)
  }

  const badge = product.is_blocked
    ? {
        label: "Blocked",
        icon: Ban,
        style: "status-blocked",
      }
    : product.is_fraudulent_product
      ? {
          label: "Flagged",
          icon: AlertTriangle,
          style: "status-flagged",
        }
      : {
          label: "Trusted",
          icon: Shield,
          style: "status-trusted",
  }

  return (
    <div
      className={`tte-card p-8 cursor-pointer animate-fade-in-up gradient-overlay shadow-premium group ${
        product.is_blocked ? "opacity-60" : ""
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={handleClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-white mono">{product.asin}</h3>
            <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors" />
          </div>
          <p className="text-sm tte-text-muted font-medium">{product.category}</p>
        </div>
        <div className={`status-badge ${badge.style}`}>
          <badge.icon className="w-3 h-3" />
          {badge.label}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="metric-card text-center group/metric">
          <div className="text-3xl font-bold tte-accent-text mb-2 mono group-hover/metric:scale-110 transition-transform">
            {product.rrdi.toFixed(3)}
          </div>
          <div className="text-xs tte-text-muted uppercase tracking-wider font-semibold">RRDI Score</div>
          <div className="text-xs text-white/50 mt-1">Risk indicator</div>
        </div>
        <div className="metric-card text-center group/metric">
          <div className="text-3xl font-bold text-white mb-2 mono group-hover/metric:scale-110 transition-transform">
            {product.trust_score}%
          </div>
          <div className="text-xs tte-text-muted uppercase tracking-wider font-semibold">Trust Score</div>
          <div className="text-xs text-white/50 mt-1">Confidence level</div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between interactive-element p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-3 tte-text-muted">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Return Rate</span>
          </div>
          <span className="text-sm font-bold text-white mono">{(product.return_rate * 100).toFixed(1)}%</span>
        </div>
        <div className="flex items-center justify-between interactive-element p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-3 tte-text-muted">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">Reviews</span>
          </div>
          <span className="text-sm font-bold text-white mono">{product.total_reviews}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-6 border-t border-white/10 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs tte-text-muted">Seller</span>
          <span className="text-sm font-semibold text-white mono">{product.seller}</span>
        </div>
        <div className="flex flex-col gap-1 text-right">
          <span className="text-xs tte-text-muted">Units Sold</span>
          <span className="text-sm font-semibold text-white mono">{product.units_sold.toLocaleString()}</span>
        </div>
      </div>

      {/* Hover indicator */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-2 h-2 bg-[#ff6b6b] rounded-full animate-pulse"></div>
      </div>
    </div>
  )
}
