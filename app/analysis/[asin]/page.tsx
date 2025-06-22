"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, RotateCcw, Brain } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { NetworkGraph } from "@/components/network-graph"
import { TrustBadge } from "@/components/trust-badge"
import { MetricsGrid } from "@/components/metrics-grid"
import { AIExplanation } from "@/components/ai-explanation"
import type { Product } from "@/lib/fraud-logic"
import { getProduct } from "@/lib/db"

export default function AnalysisPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const asin = params.asin as string
    const foundProduct = getProduct(asin)

    setTimeout(() => {
      setProduct(foundProduct || null)
      setLoading(false)
    }, 800)
  }, [params.asin])

  if (loading) {
    return (
      <div className="min-h-screen tte-grid-bg">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="tte-spinner"></div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen tte-grid-bg">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center animate-fade-in-up">
            <h2 className="tte-heading-md mb-4">Product Not Found</h2>
            <button onClick={() => router.push("/")} className="tte-btn tte-btn-primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen tte-grid-bg page-transition">
      <Navigation />

      {/* Header */}
      <header className="border-b border-[#374151] py-6 animate-slide-in-left">
        <div className="max-w-7xl mx-auto px-6">
          <button onClick={() => router.push("/")} className="tte-btn tte-btn-ghost mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="tte-heading-lg">Deep Analysis: {product.asin}</h1>
              <p className="tte-text-muted mt-2">Comprehensive fraud detection analysis and risk assessment</p>
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <TrustBadge isFraudulent={product.is_fraudulent_product} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Product Info Panel */}
          <div className="lg:col-span-1 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="tte-card p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Product Metrics</h3>
              <MetricsGrid product={product} />
            </div>
          </div>

          {/* Network Graph */}
          <div className="lg:col-span-3 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <div className="tte-card p-6">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-semibold text-white">Relationship Network</h4>
                <button className="tte-btn tte-btn-ghost">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset View
                </button>
              </div>
              <div className="h-96 bg-[#0a0e1a] rounded-xl overflow-hidden">
                <NetworkGraph product={product} />
              </div>
            </div>
          </div>

          {/* AI Explanation Panel */}
          <div className="lg:col-span-4 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            <div className="tte-card p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#ff6b6b]/10 rounded-lg animate-glow">
                    <Brain className="w-5 h-5 tte-accent-text" />
                  </div>
                  <h4 className="text-lg font-semibold text-white">AI Trust Analysis</h4>
                </div>
                <div className="flex items-center gap-2 tte-accent-text text-sm font-medium">
                  <div className="w-2 h-2 bg-[#ff6b6b] rounded-full animate-pulse"></div>
                  AI Powered
                </div>
              </div>
              <AIExplanation product={product} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
