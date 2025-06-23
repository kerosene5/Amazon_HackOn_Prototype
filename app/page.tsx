"use client"

import { useState, useEffect, useCallback } from "react"
import { ProductCard } from "@/components/product-card"
import { FilterSection } from "@/components/filter-section"
import { StatsOverview } from "@/components/stats-overview"
import { LoadingSpinner } from "@/components/loading-spinner"
import { DashboardCharts } from "@/components/dashboard-charts"
import { ProductCardSkeleton } from "@/components/product-card-skeleton"
import { TrendingUp, AlertTriangle, Shield, Activity, Sparkles, Bot } from "lucide-react"
import type { Product } from "@/lib/fraud-logic"
import { getProducts, resetDB } from "@/lib/db"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { AIExplanation } from "@/components/ai-explanation"
import { MetricsGrid } from "@/components/metrics-grid"
import { InteractiveDemo } from "@/components/interactive-demo"

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [currentFilter, setCurrentFilter] = useState<"all" | "flagged" | "trusted">("all")
  const [loading, setLoading] = useState(true)

  const fetchProducts = useCallback(() => {
    const allProducts = getProducts()
    setProducts(allProducts)
    // Re-apply the current filter to the new data
    switch (currentFilter) {
      case "flagged":
        setFilteredProducts(allProducts.filter((p) => p.is_fraudulent_product))
        break
      case "trusted":
        setFilteredProducts(allProducts.filter((p) => !p.is_fraudulent_product))
        break
      default:
        setFilteredProducts(allProducts)
    }
  }, [currentFilter])

  useEffect(() => {
    // Simulate loading data with smooth transition
    setTimeout(() => {
      fetchProducts()
      setLoading(false)
    }, 1000)
  }, [fetchProducts])

  useEffect(() => {
    // This effect now only handles filtering when the filter changes
    const allProducts = getProducts()
    switch (currentFilter) {
      case "flagged":
        setFilteredProducts(allProducts.filter((p) => p.is_fraudulent_product))
        break
      case "trusted":
        setFilteredProducts(allProducts.filter((p) => !p.is_fraudulent_product))
        break
      default:
        setFilteredProducts(allProducts)
    }
  }, [currentFilter])

  const handleRunAgent = async () => {
    toast.info("Fraud detection agent is running...", {
      icon: <Bot className="animate-pulse" />,
    })
    const response = await fetch("/api/agent/run")
    const result = await response.json()

    if (response.ok) {
      toast.success(result.message, {
        description:
          result.blockedCount > 0
            ? `Blocked ASINs: ${result.blocked_asins.join(", ")}`
            : "No suspicious activity required action.",
      })
      // Refresh the product list to show updated statuses
      fetchProducts()
    } else {
      toast.error("Agent run failed", {
        description: result.error,
      })
    }
  }

  const stats = {
    total: products.length,
    flagged: products.filter((p) => p.is_fraudulent_product).length,
    trusted: products.filter((p) => !p.is_fraudulent_product).length,
  }

  if (loading) {
    return (
      <div className="min-h-screen tte-grid-bg flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <main className="flex-1">
      <div className="min-h-screen tte-grid-bg page-transition">
        <SiteHeader />

        {/* Hero Section */}
        <header className="pt-24 pb-20 text-center relative overflow-hidden screen-container">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#ff6b6b]/5"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10 screen-content">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                Go deeper than
                <br />
                <span className="tte-accent-text floating">fraud detection.</span>
              </h1>
              <p
                className="text-xl tte-text-muted mb-12 leading-relaxed max-w-3xl mx-auto animate-fade-in-up"
                style={{ animationDelay: "0.3s" }}
              >
              Stop bad actors before they ruin your marketplace. AI that protects Amazon at Amazon speed.
            </p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* --- Interactive Demo --- */}
          <div className="mb-12">
            <InteractiveDemo />
          </div>
          
          {/* Stats Overview */}
          <div className="animate-slide-in-left" style={{ animationDelay: "0.2s" }}>
            <StatsOverview stats={stats} />
          </div>

          {/* Analytics Charts */}
          <div className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <DashboardCharts products={products} />
          </div>

          {/* Filter Section */}
          <div className="animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            <FilterSection currentFilter={currentFilter} onFilterChange={setCurrentFilter} stats={stats} />
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading
              ? Array.from({ length: 6 }).map((_, index) => <ProductCardSkeleton key={index} />)
              : filteredProducts.map((product, index) => (
                  <ProductCard key={product.asin} product={product} index={index} />
                ))}
          </div>

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <div className="tte-card p-12 max-w-md mx-auto">
                <p className="tte-text-muted text-lg mb-4">No products found for the selected filter.</p>
                <button onClick={() => setCurrentFilter("all")} className="tte-btn tte-btn-secondary">
                  View all products
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </main>
  )
}
