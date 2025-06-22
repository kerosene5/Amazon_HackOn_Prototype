import { NextResponse } from "next/server"
import { getProducts, updateProduct } from "@/lib/db"

export const dynamic = "force-dynamic" // Defaults to auto

// This endpoint simulates an agentic workflow that runs on a schedule or trigger.
// It scans for products with strong fraud signals and automatically blocks them.
export async function GET() {
  try {
    const products = getProducts()
    const productsToBlock = products.filter(
      (p) => p.gnn_fraud_signal && !p.is_blocked
    )

    if (productsToBlock.length === 0) {
      return NextResponse.json({
        message: "Agent check complete. No new products to block.",
        blockedCount: 0,
      })
    }

    // Block each product identified by the GNN signal
    for (const product of productsToBlock) {
      updateProduct(product.asin, { is_blocked: true })
    }

    return NextResponse.json({
      message: `Agent check complete. Successfully blocked ${productsToBlock.length} products.`,
      blockedCount: productsToBlock.length,
      blocked_asins: productsToBlock.map((p) => p.asin),
    })
  } catch (error) {
    console.error("Agent run error:", error)
    return NextResponse.json(
      { error: "Failed to run fraud detection agent." },
      { status: 500 }
    )
  }
} 