import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { product } = await request.json()

    // Simulate AI analysis processing
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const trustScore = Math.round((1 - product.rrdi) * 100)
    const riskLevel = product.rrdi > 0.4 ? "High" : product.rrdi > 0.2 ? "Medium" : "Low"

    const analysis = {
      trustScore,
      riskLevel,
      recommendation: product.is_fraudulent_product
        ? "This product requires immediate review and potential delisting due to high fraud indicators."
        : "This product appears trustworthy and can continue normal operations with routine monitoring.",
      factors: {
        rrdi: {
          score: product.rrdi,
          interpretation:
            product.rrdi > 0.4
              ? "High deviation suggests potential manipulation"
              : product.rrdi > 0.2
                ? "Moderate deviation warrants monitoring"
                : "Natural rating variation within expected bounds",
        },
        bayesian: {
          score: product.bayesian_smoothed_score,
          interpretation: `Adjusted for ${product.total_reviews} reviews to reduce extreme rating impact`,
        },
        burst: {
          score: product.smoothed_rrdi,
          interpretation:
            product.smoothed_rrdi > 0.4 ? "Suspicious burst activity detected" : "No significant burst patterns found",
        },
      },
    }

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze product" }, { status: 500 })
  }
}
