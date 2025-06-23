"use client"

import { useEffect, useRef } from "react"

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

interface NetworkGraphProps {
  product: Product
}

export function NetworkGraph({ product }: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    // Clear previous content
    const svg = svgRef.current
    svg.innerHTML = ""

    const width = 600
    const height = 400

    // Create nodes with hex.tech color scheme
    const nodes = [
      {
        id: product.asin,
        type: "product",
        x: width / 2,
        y: height / 2,
        r: 35,
        color: product.is_fraudulent_product ? "#ef4444" : "#ff6b6b",
      },
      {
        id: product.seller,
        type: "seller",
        x: width / 2 - 120,
        y: height / 2 - 80,
        r: 25,
        color: "#f59e0b",
      },
      {
        id: "reviews",
        type: "reviews",
        x: width / 2 + 120,
        y: height / 2 - 80,
        r: 20,
        color: "#10b981",
      },
      {
        id: "returns",
        type: "returns",
        x: width / 2,
        y: height / 2 + 100,
        r: 15,
        color: "#ef4444",
      },
    ]

    // Add reviewer nodes
    for (let i = 1; i <= Math.min(product.total_reviews, 4); i++) {
      const angle = (i / Math.min(product.total_reviews, 4)) * 2 * Math.PI
      nodes.push({
        id: `reviewer_${i}`,
        type: "reviewer",
        x: width / 2 + Math.cos(angle) * 80,
        y: height / 2 + Math.sin(angle) * 80,
        r: 10,
        color: "#6b7280",
      })
    }

    // Create links
    const links = [
      { source: product.asin, target: product.seller, color: "#f59e0b" },
      { source: product.asin, target: "reviews", color: "#10b981" },
      { source: product.asin, target: "returns", color: "#ef4444" },
    ]

    // Add reviewer links
    for (let i = 1; i <= Math.min(product.total_reviews, 4); i++) {
      links.push({
        source: product.asin,
        target: `reviewer_${i}`,
        color: "#6b7280",
      })
    }

    // Draw links
    links.forEach((link) => {
      const sourceNode = nodes.find((n) => n.id === link.source)
      const targetNode = nodes.find((n) => n.id === link.target)

      if (sourceNode && targetNode) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line")
        line.setAttribute("x1", sourceNode.x.toString())
        line.setAttribute("y1", sourceNode.y.toString())
        line.setAttribute("x2", targetNode.x.toString())
        line.setAttribute("y2", targetNode.y.toString())
        line.setAttribute("stroke", link.color)
        line.setAttribute("stroke-width", "2")
        line.setAttribute("opacity", "0.4")
        svg.appendChild(line)
      }
    })

    // Draw nodes
    nodes.forEach((node) => {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
      circle.setAttribute("cx", node.x.toString())
      circle.setAttribute("cy", node.y.toString())
      circle.setAttribute("r", node.r.toString())
      circle.setAttribute("fill", node.color)
      circle.setAttribute("stroke", "#374151")
      circle.setAttribute("stroke-width", "2")
      circle.style.cursor = "pointer"

      // Add hover effect
      circle.addEventListener("mouseenter", () => {
        circle.setAttribute("r", (node.r + 3).toString())
        circle.setAttribute("stroke", "#ffffff")
      })
      circle.addEventListener("mouseleave", () => {
        circle.setAttribute("r", node.r.toString())
        circle.setAttribute("stroke", "#374151")
      })

      svg.appendChild(circle)

      // Add labels
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text")
      text.setAttribute("x", node.x.toString())
      text.setAttribute("y", (node.y + node.r + 15).toString())
      text.setAttribute("text-anchor", "middle")
      text.setAttribute("fill", "#9ca3af")
      text.setAttribute("font-size", "11")
      text.setAttribute("font-weight", "500")
      text.textContent =
        node.type === "product"
          ? node.id
          : node.type === "seller"
            ? "Seller"
            : node.type === "reviews"
              ? `${product.total_reviews} Reviews`
              : node.type === "returns"
                ? `${(product.return_rate * 100).toFixed(1)}% Returns`
                : `R${node.id.split("_")[1]}`
      svg.appendChild(text)
    })
  }, [product])

  return <svg ref={svgRef} className="w-full h-full" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet" />
}
