import { NextResponse, type NextRequest } from "next/server"
import { getProduct, updateProduct } from "@/lib/db"

// This endpoint allows for manually blocking or unblocking a product.
export async function POST(request: NextRequest) {
  try {
    const { asin, blocked } = await request.json()

    if (!asin) {
      return NextResponse.json(
        { error: "ASIN is required." },
        { status: 400 }
      )
    }

    const product = getProduct(asin as string)

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      )
    }

    const updatedProduct = updateProduct(asin as string, {
      is_blocked: blocked,
    })

    return NextResponse.json({
      message: `Product ${asin} has been ${blocked ? "blocked" : "unblocked"}.`,
      product: updatedProduct,
    })
  } catch (error) {
    console.error("Block action error:", error)
    return NextResponse.json(
      { error: "Failed to perform block action on product." },
      { status: 500 }
    )
  }
} 