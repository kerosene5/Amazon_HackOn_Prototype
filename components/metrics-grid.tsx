"use client"

import type { Product } from "@/lib/fraud-logic"
import { TrendingUp, Percent, Star, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

interface MetricCardProps {
  label: string
  value: string
  description: string
  icon: React.ReactNode
  variant?: "default" | "success" | "warning" | "danger"
}

const MetricCard = ({ label, value, description, icon, variant = "default" }: MetricCardProps) => {
  const valueColor = {
    success: "text-green-400",
    warning: "text-yellow-400",
    danger: "text-red-400",
    default: "text-white",
  }[variant]

  return (
    <div className="bg-[#1e293b]/50 rounded-lg p-4 space-y-2 border border-transparent hover:border-blue-500/50 transition-colors duration-300">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-slate-300">{label}</div>
        {icon}
      </div>
      <div className={`text-3xl font-bold ${valueColor}`}>{value}</div>
      <div className="text-xs text-slate-400">{description}</div>
    </div>
  )
}

interface MetricsGridProps {
  product: Product
}

export function MetricsGrid({ product }: MetricsGridProps) {
  const { rrdi, trust_score, return_rate, review_score, total_reviews, units_sold } = product

  const getMetricVariant = (isFraudulent: boolean) => {
    return isFraudulent ? "danger" : "success"
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <MetricCard
        label="TRUST SCORE"
        value={`${trust_score}%`}
        description="Overall trust rating"
        icon={<Percent className="w-5 h-5 text-slate-400" />}
        variant={getMetricVariant(product.is_fraudulent_product)}
      />
      <MetricCard
        label="RRDI SCORE"
        value={rrdi.toFixed(3)}
        description="Rating deviation index"
        icon={<TrendingUp className="w-5 h-5 text-slate-400" />}
        variant={getMetricVariant(product.is_fraudulent_product)}
      />
      <MetricCard
        label="RETURN RATE"
        value={`${(return_rate * 100).toFixed(1)}%`}
        description="Product return frequency"
        icon={<AlertTriangle className="w-5 h-5 text-slate-400" />}
        variant={return_rate > 0.4 ? "danger" : return_rate > 0.2 ? "warning" : "success"}
      />
      <MetricCard
        label="REVIEW SCORE"
        value={review_score.toFixed(2)}
        description={`Based on ${total_reviews} reviews`}
        icon={<Star className="w-5 h-5 text-slate-400" />}
        variant="default"
      />
    </div>
  )
}
