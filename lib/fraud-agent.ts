import type { Product } from "./fraud-logic"
import { getProducts, updateProduct } from "./db"

export interface AgentDecision {
  action: "BLOCK" | "FLAG" | "MONITOR" | "TRUST"
  confidence: number
  reasoning: string[]
  riskFactors: string[]
  timestamp: Date
}

export interface AgentAction {
  asin: string
  decision: AgentDecision
  executed: boolean
  executionTime?: Date
}

export class FraudDetectionAgent {
  private static instance: FraudDetectionAgent
  private isRunning: boolean = false
  private actionHistory: AgentAction[] = []

  static getInstance(): FraudDetectionAgent {
    if (!FraudDetectionAgent.instance) {
      FraudDetectionAgent.instance = new FraudDetectionAgent()
    }
    return FraudDetectionAgent.instance
  }

  /**
   * Main agent workflow - analyzes all products and takes action
   */
  async runFraudDetection(): Promise<{
    analyzed: number
    blocked: number
    flagged: number
    actions: AgentAction[]
  }> {
    if (this.isRunning) {
      throw new Error("Agent is already running")
    }

    this.isRunning = true
    const startTime = new Date()
    
    try {
      const products = getProducts()
      const actions: AgentAction[] = []
      let blockedCount = 0
      let flaggedCount = 0

      console.log(`🤖 Agent starting analysis of ${products.length} products...`)

      for (const product of products) {
        const decision = this.analyzeProduct(product)
        const action: AgentAction = {
          asin: product.asin,
          decision,
          executed: false,
        }

        // Execute the decision
        if (decision.action === "BLOCK" && !product.is_blocked) {
          await this.executeBlock(product.asin)
          action.executed = true
          action.executionTime = new Date()
          blockedCount++
        } else if (decision.action === "FLAG" && !product.is_fraudulent_product) {
          // In a real system, this would create a review ticket
          flaggedCount++
        }

        actions.push(action)
        this.actionHistory.push(action)
      }

      const endTime = new Date()
      const duration = endTime.getTime() - startTime.getTime()

      console.log(`✅ Agent completed in ${duration}ms`)
      console.log(`📊 Results: ${blockedCount} blocked, ${flaggedCount} flagged`)

      return {
        analyzed: products.length,
        blocked: blockedCount,
        flagged: flaggedCount,
        actions,
      }
    } finally {
      this.isRunning = false
    }
  }

  /**
   * Analyzes a single product and returns a decision
   */
  private analyzeProduct(product: Product): AgentDecision {
    const reasoning: string[] = []
    const riskFactors: string[] = []
    let riskScore = 0

    // Factor 1: RRDI Analysis (Review-Return Discrepancy Index)
    if (product.rrdi > 0.5) {
      riskScore += 40
      riskFactors.push(`High RRDI: ${product.rrdi.toFixed(3)}`)
      reasoning.push(`RRDI of ${product.rrdi.toFixed(3)} indicates significant mismatch between reviews and returns`)
    } else if (product.rrdi > 0.3) {
      riskScore += 25
      riskFactors.push(`Moderate RRDI: ${product.rrdi.toFixed(3)}`)
      reasoning.push(`RRDI of ${product.rrdi.toFixed(3)} suggests potential review manipulation`)
    }

    // Factor 2: GNN Fraud Signal
    if (product.gnn_fraud_signal) {
      riskScore += 30
      riskFactors.push("GNN Fraud Signal Detected")
      reasoning.push("Graph Neural Network identified suspicious patterns in product relationships")
    }

    // Factor 3: Burst Detection (Suspicious Review Velocity)
    if (product.smoothed_rrdi > 0.6) {
      riskScore += 20
      riskFactors.push(`High Burst Score: ${product.smoothed_rrdi.toFixed(3)}`)
      reasoning.push(`Burst detection score of ${product.smoothed_rrdi.toFixed(3)} indicates suspicious review velocity`)
    }

    // Factor 4: Return Rate Analysis
    if (product.return_rate > 0.4) {
      riskScore += 15
      riskFactors.push(`High Return Rate: ${(product.return_rate * 100).toFixed(1)}%`)
      reasoning.push(`Return rate of ${(product.return_rate * 100).toFixed(1)}% is significantly above normal`)
    }

    // Factor 5: Trust Score
    if (product.trust_score < 30) {
      riskScore += 25
      riskFactors.push(`Low Trust Score: ${product.trust_score}%`)
      reasoning.push(`Trust score of ${product.trust_score}% indicates high risk`)
    }

    // Factor 6: Review Count Analysis
    if (product.total_reviews < 5) {
      riskScore += 10
      riskFactors.push(`Low Review Count: ${product.total_reviews}`)
      reasoning.push(`Only ${product.total_reviews} reviews - insufficient data for confidence`)
    }

    // Factor 7: Perfect Score Suspicion
    if (product.review_score >= 4.8 && product.total_reviews < 10) {
      riskScore += 15
      riskFactors.push(`Suspicious Perfect Score: ${product.review_score}`)
      reasoning.push(`Perfect score with few reviews may indicate fake reviews`)
    }

    // Decision Logic
    let action: "BLOCK" | "FLAG" | "MONITOR" | "TRUST"
    let confidence: number

    if (riskScore >= 80) {
      action = "BLOCK"
      confidence = Math.min(riskScore / 100, 0.95)
      reasoning.push("High risk score warrants immediate blocking")
    } else if (riskScore >= 60) {
      action = "FLAG"
      confidence = riskScore / 100
      reasoning.push("Moderate risk score requires human review")
    } else if (riskScore >= 30) {
      action = "MONITOR"
      confidence = riskScore / 100
      reasoning.push("Low risk but requires ongoing monitoring")
    } else {
      action = "TRUST"
      confidence = 1 - (riskScore / 100)
      reasoning.push("Low risk score indicates trustworthy product")
    }

    return {
      action,
      confidence,
      reasoning,
      riskFactors,
      timestamp: new Date(),
    }
  }

  /**
   * Executes a block action on a product
   */
  private async executeBlock(asin: string): Promise<void> {
    try {
      updateProduct(asin, { is_blocked: true })
      console.log(`🚫 Blocked product: ${asin}`)
      
      // Simulate API call to external systems
      await this.notifyExternalSystems(asin, "BLOCKED")
      
    } catch (error) {
      console.error(`❌ Failed to block product ${asin}:`, error)
      throw error
    }
  }

  /**
   * Notifies external systems about agent actions
   */
  private async notifyExternalSystems(asin: string, action: string): Promise<void> {
    // Simulate API calls to external systems
    const notifications = [
      `📧 Email notification sent to fraud team about ${action} action on ${asin}`,
      `🔔 Slack notification sent to #fraud-alerts channel`,
      `📋 Jira ticket created for manual review`,
      `📊 Analytics dashboard updated with new fraud signal`,
    ]

    for (const notification of notifications) {
      console.log(notification)
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  /**
   * Gets the agent's action history
   */
  getActionHistory(): AgentAction[] {
    return [...this.actionHistory]
  }

  /**
   * Gets recent actions (last 24 hours)
   */
  getRecentActions(): AgentAction[] {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    return this.actionHistory.filter(action => 
      action.decision.timestamp > oneDayAgo
    )
  }

  /**
   * Gets agent status
   */
  getStatus(): {
    isRunning: boolean
    totalActions: number
    recentActions: number
    lastRun?: Date
  } {
    const recentActions = this.getRecentActions()
    const lastRun = recentActions.length > 0 
      ? recentActions[recentActions.length - 1].decision.timestamp 
      : undefined

    return {
      isRunning: this.isRunning,
      totalActions: this.actionHistory.length,
      recentActions: recentActions.length,
      lastRun,
    }
  }

  /**
   * Resets the agent (clears history, useful for testing)
   */
  reset(): void {
    this.actionHistory = []
    this.isRunning = false
  }
}

// Export a singleton instance
export const fraudAgent = FraudDetectionAgent.getInstance() 