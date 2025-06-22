"use client"

interface Product {
  asin: string
  review_score: number
  return_quality_score: number
  return_rate: number
  total_reviews: number
  rrdi: number
  bayesian_smoothed_score: number
  smoothed_rrdi: number
  is_fraudulent_product: boolean
  category: string
  seller: string
  units_sold: number
}

interface MetricsGridProps {
  product: Product
}

export function MetricsGrid({ product }: MetricsGridProps) {
  const trustScore = Math.round((1 - product.rrdi) * 100)

  const metrics = [
    {
      label: "RRDI Score",
      value: product.rrdi.toFixed(3),
      description: "Rating deviation index",
      color: product.rrdi > 0.4 ? "text-red-400" : product.rrdi > 0.2 ? "text-yellow-400" : "text-green-400",
    },
    {
      label: "Trust Score",
      value: `${trustScore}%`,
      description: "Overall trust rating",
      color: "tte-accent-text",
    },
    {
      label: "Return Rate",
      value: `${(product.return_rate * 100).toFixed(1)}%`,
      description: "Product return frequency",
      color: "text-white",
    },
    {
      label: "Reviews",
      value: product.total_reviews.toString(),
      description: "Total review count",
      color: "text-white",
    },
    {
      label: "Units Sold",
      value: product.units_sold.toLocaleString(),
      description: "Sales volume",
      color: "text-white",
    },
    {
      label: "Category",
      value: product.category,
      description: "Product category",
      color: "tte-text-muted",
    },
  ]

  return (
    <div className="space-y-4">
      {metrics.map((metric, index) => (
        <div key={index} className="metric-card">
          <div className="flex justify-between items-start mb-1">
            <span className="text-xs tte-text-muted uppercase tracking-wide mono">{metric.label}</span>
          </div>
          <div className={`text-lg font-semibold ${metric.color} mb-1 mono`}>{metric.value}</div>
          <div className="text-xs tte-text-muted">{metric.description}</div>
        </div>
      ))}
    </div>
  )
}
