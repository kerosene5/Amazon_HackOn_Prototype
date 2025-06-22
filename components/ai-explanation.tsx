"use client"

import { useState, useEffect } from "react"

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

interface AIExplanationProps {
  product: Product
}

export function AIExplanation({ product }: AIExplanationProps) {
  const [explanation, setExplanation] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate AI analysis
    setTimeout(() => {
      const trustScore = Math.round((1 - product.rrdi) * 100)
      const riskLevel = product.rrdi > 0.4 ? "High" : product.rrdi > 0.2 ? "Medium" : "Low"

      const generatedExplanation = `
        <div class="space-y-6 text-[#9ca3af] leading-relaxed">
          <div class="p-4 bg-[#1f2937] rounded-lg border-l-4 ${product.is_fraudulent_product ? "border-red-400" : "border-green-400"}">
            <h5 class="text-white text-lg font-semibold mb-3">Executive Summary</h5>
            <p>Product ${product.asin} has been classified as <span class="${product.is_fraudulent_product ? "text-red-400 font-semibold" : "text-green-400 font-semibold"}">${product.is_fraudulent_product ? "HIGH RISK" : "TRUSTED"}</span> with an overall trust score of <span class="text-[#ff6b6b] font-semibold">${trustScore}%</span>.</p>
          </div>
          
          <div>
            <h6 class="text-white font-semibold mb-3 flex items-center gap-2">
              <div class="w-2 h-2 bg-[#ff6b6b] rounded-full"></div>
              RRDI Score Analysis
            </h6>
            <p class="mb-3">The Reviewer Rating Deviation Index (RRDI) of <span class="font-semibold text-yellow-400">${product.rrdi.toFixed(3)}</span> indicates <span class="font-semibold">${riskLevel.toLowerCase()} deviation</span> from expected rating patterns.</p>
            <p class="text-sm bg-[#1f2937] p-3 rounded border-l-2 border-yellow-400">${product.rrdi > 0.4 ? "⚠️ This suggests potential manipulation or artificial inflation of ratings." : product.rrdi > 0.2 ? "📊 This shows moderate deviation that warrants monitoring." : "✅ This indicates natural rating variation within expected bounds."}</p>
          </div>
          
          <div>
            <h6 class="text-white font-semibold mb-3 flex items-center gap-2">
              <div class="w-2 h-2 bg-blue-400 rounded-full"></div>
              Bayesian Smoothing
            </h6>
            <p class="mb-3">After applying Bayesian smoothing, the adjusted score is <span class="font-semibold text-blue-400">${product.bayesian_smoothed_score.toFixed(2)}</span>, which accounts for the limited sample size of ${product.total_reviews} reviews.</p>
            <p class="text-sm bg-[#1f2937] p-3 rounded border-l-2 border-blue-400">📈 This technique helps reduce the impact of extreme ratings in products with few reviews, providing a more reliable assessment.</p>
          </div>
          
          <div>
            <h6 class="text-white font-semibold mb-3 flex items-center gap-2">
              <div class="w-2 h-2 bg-orange-400 rounded-full"></div>
              Burst Detection Analysis
            </h6>
            <p class="mb-3">The smoothed RRDI of <span class="font-semibold text-orange-400">${product.smoothed_rrdi.toFixed(3)}</span> ${product.smoothed_rrdi > 0.4 ? "indicates suspicious burst activity in rating patterns." : "shows no significant burst patterns."}</p>
            <p class="text-sm bg-[#1f2937] p-3 rounded border-l-2 border-orange-400">${product.smoothed_rrdi > 0.4 ? "🚨 Coordinated fake reviews detected - immediate investigation recommended." : "✅ Organic review accumulation pattern detected."}</p>
          </div>
          
          <div>
            <h6 class="text-white font-semibold mb-3">Risk Factor Assessment</h6>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-[#1f2937] p-4 rounded-lg">
                <div class="text-sm text-[#9ca3af] mb-1">Return Rate</div>
                <div class="text-lg font-semibold text-white">${(product.return_rate * 100).toFixed(1)}%</div>
                <div class="text-xs ${product.return_rate > 0.3 ? "text-red-400" : product.return_rate > 0.15 ? "text-yellow-400" : "text-green-400"}">
                  ${product.return_rate > 0.3 ? "High Risk" : product.return_rate > 0.15 ? "Moderate" : "Low Risk"}
                </div>
              </div>
              <div class="bg-[#1f2937] p-4 rounded-lg">
                <div class="text-sm text-[#9ca3af] mb-1">Sales Volume</div>
                <div class="text-lg font-semibold text-white">${product.units_sold.toLocaleString()}</div>
                <div class="text-xs text-blue-400">
                  ${product.units_sold > 200 ? "High Volume" : "Moderate Volume"}
                </div>
              </div>
              <div class="bg-[#1f2937] p-4 rounded-lg">
                <div class="text-sm text-[#9ca3af] mb-1">Review Coverage</div>
                <div class="text-lg font-semibold text-white">${((product.total_reviews / product.units_sold) * 100).toFixed(2)}%</div>
                <div class="text-xs text-[#9ca3af]">Buyer engagement</div>
              </div>
            </div>
          </div>
          
          <div class="p-4 bg-[#ff6b6b]/10 border border-[#ff6b6b]/20 rounded-lg">
            <h6 class="text-[#ff6b6b] font-semibold mb-2">Recommended Action</h6>
            <p class="text-white">${product.is_fraudulent_product ? "🔴 This product requires immediate review and potential delisting due to high fraud indicators. Consider suspending sales pending investigation." : "🟢 This product appears trustworthy and can continue normal operations with routine monitoring."}</p>
          </div>
        </div>
      `

      setExplanation(generatedExplanation)
      setLoading(false)
    }, 2000)
  }, [product])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center gap-3 hex-text-muted">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-[#ff6b6b] rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-[#ff6b6b] rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-[#ff6b6b] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
          <span>Generating comprehensive AI analysis...</span>
        </div>
      </div>
    )
  }

  return <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: explanation }} />
}
