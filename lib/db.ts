import {
  type Product,
  type ProductData,
  calculateRrdi,
  calculateTrustScore,
  isFraudulent,
} from "./fraud-logic"

const productDataSource: ProductData[] = [
  // Existing data with new `positive_reviews` and `gnn_fraud_signal` fields
  {
    asin: "B006UIOPSD",
    review_score: 4.0,
    total_reviews: 4,
    positive_reviews: 3, // 3/4 are 4*+
    units_sold: 83,
    return_rate: 0.5,
    bayesian_smoothed_score: 3.5,
    smoothed_rrdi: 0.2,
    gnn_fraud_signal: false,
    category: "Home & Garden",
    seller: "S12345",
  },
  {
    asin: "B001XRTM2I",
    review_score: 3.75,
    total_reviews: 8,
    positive_reviews: 5, // 5/8 are 4*+
    units_sold: 156,
    return_rate: 0.25,
    bayesian_smoothed_score: 3.5,
    smoothed_rrdi: 0.2,
    gnn_fraud_signal: false,
    category: "Electronics",
    seller: "S23456",
  },
  {
    asin: "B005ZXCVBN",
    review_score: 4.833,
    total_reviews: 6,
    positive_reviews: 6,
    units_sold: 234,
    return_rate: 0.167,
    bayesian_smoothed_score: 4.25,
    smoothed_rrdi: 0.033,
    gnn_fraud_signal: false,
    category: "Sports",
    seller: "S34567",
  },
  {
    asin: "B003QWERTY",
    review_score: 4.0,
    total_reviews: 4,
    positive_reviews: 4, // All reviews are positive
    units_sold: 92,
    return_rate: 0.45, // High return rate despite perfect reviews
    bayesian_smoothed_score: 3.5,
    smoothed_rrdi: 0.6,
    gnn_fraud_signal: true, // GNN also flags this
    category: "Books",
    seller: "S45678",
  },
  {
    asin: "B004ASDFGH",
    review_score: 4.125,
    total_reviews: 8,
    positive_reviews: 6,
    units_sold: 187,
    return_rate: 0.25,
    bayesian_smoothed_score: 3.8,
    smoothed_rrdi: 0.08,
    gnn_fraud_signal: false,
    category: "Clothing",
    seller: "S56789",
  },
  {
    asin: "B000LQOCH0",
    review_score: 4.5,
    total_reviews: 4,
    positive_reviews: 4,
    units_sold: 320,
    return_rate: 0.3, // High return rate
    bayesian_smoothed_score: 3.833,
    smoothed_rrdi: 0.467,
    gnn_fraud_signal: false,
    category: "Electronics",
    seller: "S78901",
  },
  {
    asin: "B002NVKLK4",
    review_score: 4.0,
    total_reviews: 4,
    positive_reviews: 4,
    units_sold: 276,
    return_rate: 0.55, // Extremely high return rate
    bayesian_smoothed_score: 3.5,
    smoothed_rrdi: 0.6,
    gnn_fraud_signal: true,
    category: "Automotive",
    seller: "S90123",
  },
  {
    asin: "B007POIUYT",
    review_score: 3.2,
    total_reviews: 12,
    positive_reviews: 4,
    units_sold: 145,
    return_rate: 0.35,
    bayesian_smoothed_score: 3.3,
    smoothed_rrdi: 0.12,
    gnn_fraud_signal: false,
    category: "Home & Garden",
    seller: "S11223",
  },
  {
    asin: "B008LKJHGF",
    review_score: 4.8,
    total_reviews: 3,
    positive_reviews: 3,
    units_sold: 89,
    return_rate: 0.0, // No returns, but suspicious reviews
    bayesian_smoothed_score: 3.2,
    smoothed_rrdi: 0.7,
    gnn_fraud_signal: true,
    category: "Electronics",
    seller: "S33445",
  },
  {
    asin: "B009MNBVCX",
    review_score: 4.1,
    total_reviews: 15,
    positive_reviews: 12,
    units_sold: 312,
    return_rate: 0.18,
    bayesian_smoothed_score: 4.1,
    smoothed_rrdi: 0.05,
    gnn_fraud_signal: false,
    category: "Sports",
    seller: "S55667",
  },
  {
    asin: "B010ZXCVBN",
    review_score: 4.6,
    total_reviews: 5,
    positive_reviews: 5,
    units_sold: 203,
    return_rate: 0.38,
    bayesian_smoothed_score: 3.7,
    smoothed_rrdi: 0.55,
    gnn_fraud_signal: false,
    category: "Books",
    seller: "S77889",
  },
  {
    asin: "B011ASDFGH",
    review_score: 3.9,
    total_reviews: 9,
    positive_reviews: 7,
    units_sold: 178,
    return_rate: 0.22,
    bayesian_smoothed_score: 3.8,
    smoothed_rrdi: 0.09,
    gnn_fraud_signal: false,
    category: "Clothing",
    seller: "S99001",
  },
]

// This function processes the raw data and enriches it with calculated metrics.
// In a real application, this would happen on the backend when data is ingested or updated.
function enrichProductData(data: ProductData): Product {
  const rrdi = calculateRrdi(data)
  const trust_score = calculateTrustScore(data, rrdi)
  
  // Calculate return quality score (inverse of return rate, normalized to 0-100)
  const return_quality_score = Math.round((1 - data.return_rate) * 100)
  
  return {
    ...data,
    rrdi,
    trust_score,
    return_quality_score,
    is_fraudulent_product: isFraudulent(data, rrdi),
    is_blocked: false, // Initially, no products are blocked
  }
}

// In-memory "database" of products.
// We use a Map to allow for easy lookups and updates by ASIN.
let productsDB = new Map<string, Product>(
  productDataSource.map(enrichProductData).map((p) => [p.asin, p])
)

// --- Database Accessor Functions ---

export function getProducts(): Product[] {
  return Array.from(productsDB.values())
}

export function getProduct(asin: string): Product | undefined {
  return productsDB.get(asin)
}

export function updateProduct(asin: string, updatedFields: Partial<Product>): Product | undefined {
  const product = productsDB.get(asin)
  if (product) {
    const updatedProduct = { ...product, ...updatedFields }
    productsDB.set(asin, updatedProduct)
    return updatedProduct
  }
  return undefined
}

// Function to reset the database state if needed for demos
export function resetDB() {
  productsDB = new Map<string, Product>(
    productDataSource.map(enrichProductData).map((p) => [p.asin, p])
  )
} 