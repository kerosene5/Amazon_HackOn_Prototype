"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart, ScatterChart, Scatter } from "recharts"
import { TrendingUp, AlertTriangle, Shield, Activity, BarChart3, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

interface DashboardChartsProps {
  products: Product[]
}

const COLORS = {
  primary: "#ff6b6b",
  secondary: "#10b981",
  warning: "#f59e0b",
  muted: "#6b7280",
  trusted: "#10b981",
  flagged: "#ef4444",
}

export function DashboardCharts({ products }: DashboardChartsProps) {
  const chartData = useMemo(() => {
    // Category distribution
    const categoryData = products.reduce((acc, product) => {
      const category = product.category
      if (!acc[category]) {
        acc[category] = { trusted: 0, flagged: 0, total: 0 }
      }
      acc[category].total++
      if (product.is_fraudulent_product) {
        acc[category].flagged++
      } else {
        acc[category].trusted++
      }
      return acc
    }, {} as Record<string, { trusted: number; flagged: number; total: number }>)

    const categoryChartData = Object.entries(categoryData).map(([category, data]) => ({
      category,
      trusted: data.trusted,
      flagged: data.flagged,
      total: data.total,
    }))

    // Risk level distribution
    const riskLevels = products.reduce((acc, product) => {
      const rrdi = product.rrdi
      if (rrdi > 0.4) {
        acc.high++
      } else if (rrdi > 0.2) {
        acc.medium++
      } else {
        acc.low++
      }
      return acc
    }, { low: 0, medium: 0, high: 0 })

    const riskChartData = [
      { name: "Low Risk", value: riskLevels.low, color: COLORS.trusted },
      { name: "Medium Risk", value: riskLevels.medium, color: COLORS.warning },
      { name: "High Risk", value: riskLevels.high, color: COLORS.flagged },
    ]

    // Fraud trend over time (simulated)
    const trendData = [
      { time: "00:00", flagged: 2, trusted: 5 },
      { time: "04:00", flagged: 1, trusted: 6 },
      { time: "08:00", flagged: 3, trusted: 4 },
      { time: "12:00", flagged: 2, trusted: 5 },
      { time: "16:00", flagged: 1, trusted: 6 },
      { time: "20:00", flagged: 2, trusted: 5 },
    ]

    // Return rate vs RRDI correlation
    const correlationData = products.map(product => ({
      rrdi: product.rrdi,
      returnRate: product.return_rate * 100,
      isFraudulent: product.is_fraudulent_product,
    }))

    return {
      categoryChartData,
      riskChartData,
      trendData,
      correlationData,
    }
  }, [products])

  return (
    <div className="space-y-8 mb-12">
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Distribution */}
        <div className="tte-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-[#374151] to-[#4b5563] rounded-lg">
                <BarChart3 className="w-5 h-5 tte-accent-text" />
              </div>
              <h3 className="text-lg font-semibold text-white">Category Distribution</h3>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-white/50" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Shows the number of trusted vs. flagged products in each category.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.categoryChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="category" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#ffffff",
                }}
              />
              <Bar dataKey="trusted" fill={COLORS.trusted} name="Trusted" />
              <Bar dataKey="flagged" fill={COLORS.flagged} name="Flagged" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Level Distribution */}
        <div className="tte-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-[#374151] to-[#4b5563] rounded-lg">
                <AlertTriangle className="w-5 h-5 tte-accent-text" />
              </div>
              <h3 className="text-lg font-semibold text-white">Risk Level Distribution</h3>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-white/50" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Distribution of products based on their RRDI risk score.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.riskChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.riskChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
                itemStyle={{ color: "#ffffff" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Fraud Trend */}
        <div className="tte-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-[#374151] to-[#4b5563] rounded-lg">
                <TrendingUp className="w-5 h-5 tte-accent-text" />
              </div>
              <h3 className="text-lg font-semibold text-white">Fraud Detection Trend</h3>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-white/50" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Simulated trend of flagged vs. trusted products over time.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData.trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#ffffff",
                }}
              />
              <Area type="monotone" dataKey="flagged" stackId="1" stroke={COLORS.flagged} fill={COLORS.flagged} fillOpacity={0.6} />
              <Area type="monotone" dataKey="trusted" stackId="1" stroke={COLORS.trusted} fill={COLORS.trusted} fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Return Rate vs RRDI Correlation */}
        <div className="tte-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-[#374151] to-[#4b5563] rounded-lg">
                <Activity className="w-5 h-5 tte-accent-text" />
              </div>
              <h3 className="text-lg font-semibold text-white">Return Rate vs RRDI</h3>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-white/50" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Shows the relationship between product return rates and RRDI scores.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={chartData.correlationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" dataKey="rrdi" name="RRDI" stroke="#9ca3af" fontSize={12} />
              <YAxis type="number" dataKey="returnRate" name="Return Rate %" stroke="#9ca3af" fontSize={12} />
              <RechartsTooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
                itemStyle={{ color: "#ffffff" }}
              />
              <Scatter dataKey="returnRate" fill={COLORS.primary} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Metrics Summary */}
      <div className="tte-card p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Key Analytics Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold tte-accent-text mb-2">
              {((products.filter(p => p.is_fraudulent_product).length / products.length) * 100).toFixed(1)}%
            </div>
            <div className="text-sm tte-text-muted">Fraud Rate</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-green-400 mb-2">
              {products.reduce((acc, p) => acc + p.units_sold, 0).toLocaleString()}
            </div>
            <div className="text-sm tte-text-muted">Total Units Sold</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-blue-400 mb-2">
              {(products.reduce((acc, p) => acc + p.total_reviews, 0) / products.length).toFixed(1)}
            </div>
            <div className="text-sm tte-text-muted">Avg Reviews/Product</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400 mb-2">
              {(products.reduce((acc, p) => acc + p.return_rate, 0) / products.length * 100).toFixed(1)}%
            </div>
            <div className="text-sm tte-text-muted">Avg Return Rate</div>
          </div>
        </div>
      </div>
    </div>
  )
} 