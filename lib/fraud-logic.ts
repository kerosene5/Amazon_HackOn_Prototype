export interface ProductData {
  asin: string
  // Raw review data
  review_score: number // average score
  total_reviews: number
  positive_reviews: number // reviews with 4* or above
  // Raw order data
  units_sold: number // Represents total orders
  return_rate: number
  // Raw fraud signals
  bayesian_smoothed_score: number
  smoothed_rrdi: number // Represents burst detection score
  gnn_fraud_signal: boolean
  // Metadata
  category: string
  seller: string
}

export interface Product extends ProductData {
  rrdi: number
  trust_score: number
  return_quality_score: number
  is_fraudulent_product: boolean
  is_blocked: boolean
}

/**
 * Calculates the Review-Return Discrepancy Index (RRDI).
 * This metric quantifies the mismatch between customer reviews and return behavior.
 * A high RRDI score is a strong indicator of review manipulation or product quality misrepresentation.
 *
 * Formula:
 * RRDI = | (Positive Reviews / Total Reviews) - (Successful Deliveries / Total Orders) |
 */
export function calculateRrdi(data: ProductData): number {
  if (data.total_reviews === 0 || data.units_sold === 0) {
    return 0
  }

  const positiveReviewRatio = data.positive_reviews / data.total_reviews
  const successfulDeliveryRatio = 1 - data.return_rate

  const rrdi = Math.abs(positiveReviewRatio - successfulDeliveryRatio)
  return parseFloat(rrdi.toFixed(4))
}

/**
 * Calculates a statistically sound Trust Score.
 * This score provides an overall measure of product trustworthiness by integrating multiple signals.
 * It starts with a base score from Bayesian smoothing and is then penalized by risk factors.
 *
 * Signals Used:
 * 1. Bayesian Smoothed Score: A more stable measure of review quality.
 * 2. RRDI: A powerful signal for detecting review/return mismatches.
 * 3. Burst Detection (smoothed_rrdi): A signal for detecting suspicious review velocity.
 */
export function calculateTrustScore(data: ProductData, rrdi: number): number {
  // Normalize the Bayesian score to a 0-100 scale (assuming 5-star rating system)
  const baseScore = (data.bayesian_smoothed_score / 5) * 100

  // Create a combined risk factor from RRDI and burst detection.
  // Weights can be tuned based on model performance. Here, RRDI is weighted more heavily.
  const riskFactor = 0.7 * rrdi + 0.3 * data.smoothed_rrdi

  // The final score is penalized by the risk factor.
  // The penalty is capped to prevent scores from becoming nonsensically low.
  const penalty = Math.min(riskFactor, 1) // Cap penalty at 100%
  const finalScore = baseScore * (1 - penalty)

  return Math.round(Math.max(0, finalScore)) // Ensure score is not negative
}

/**
 * Determines if a product should be flagged as fraudulent based on a set of signals.
 */
export function isFraudulent(data: ProductData, rrdi: number): boolean {
  // Flag if RRDI is very high, or if RRDI and burst score are both moderately high.
  if (rrdi > 0.45) return true
  if (rrdi > 0.3 && data.smoothed_rrdi > 0.5) return true
  // Flag if a GNN provides a strong external signal, reinforcing other suspicions.
  if (data.gnn_fraud_signal && rrdi > 0.2) return true

  return false
} 