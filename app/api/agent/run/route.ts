import { NextResponse } from "next/server"
import { fraudAgent } from "@/lib/fraud-agent"

export const dynamic = "force-dynamic"

// This endpoint triggers the sophisticated fraud detection agent
export async function GET() {
  try {
    const agentStatus = fraudAgent.getStatus()
    
    if (agentStatus.isRunning) {
      return NextResponse.json({
        error: "Agent is already running",
        status: agentStatus,
      }, { status: 409 })
    }

    console.log("🚀 Starting fraud detection agent...")
    
    const result = await fraudAgent.runFraudDetection()
    
    const updatedStatus = fraudAgent.getStatus()
    const recentActions = fraudAgent.getRecentActions()

    return NextResponse.json({
      success: true,
      message: `Agent completed successfully. Analyzed ${result.analyzed} products.`,
      results: {
        analyzed: result.analyzed,
        blocked: result.blocked,
        flagged: result.flagged,
        actions: result.actions,
      },
      status: updatedStatus,
      recentActions: recentActions.slice(-5), // Last 5 actions
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Agent run error:", error)
    return NextResponse.json({
      error: "Failed to run fraud detection agent",
      details: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 })
  }
}

// Get agent status
export async function POST() {
  try {
    const status = fraudAgent.getStatus()
    const recentActions = fraudAgent.getRecentActions()
    
    return NextResponse.json({
      status,
      recentActions: recentActions.slice(-10), // Last 10 actions
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Agent status error:", error)
    return NextResponse.json({
      error: "Failed to get agent status",
    }, { status: 500 })
  }
} 