"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Loader2, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  AlertCircle, 
  Brain, 
  Network, 
  Calculator,
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  Activity
} from "lucide-react"

interface AnalysisResult {
  trustScore: number
  riskLevel: string
  recommendation: string
  factors: {
    rrdi: { score: number; interpretation: string }
    bayesian: { score: number; interpretation: string }
    burst: { score: number; interpretation: string }
  }
}

interface AnalysisStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  duration: number
  data?: any
}

export function InteractiveDemo() {
  const [asin, setAsin] = useState("B003QWERTY")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState<number>(-1)
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>([])
  const [showGraph, setShowGraph] = useState(false)
  const [graphData, setGraphData] = useState<any>(null)

  const createAnalysisSteps = (productData: any): AnalysisStep[] => [
    {
      id: "fetch",
      title: "Fetching Product Data",
      description: "Retrieving product information from database...",
      icon: <Package className="h-6 w-6" />,
      duration: 800,
      data: productData
    },
    {
      id: "rrdi",
      title: "Calculating RRDI",
      description: "Computing Review-Return Discrepancy Index...",
      icon: <Calculator className="h-6 w-6" />,
      duration: 1200,
      data: {
        reviewScore: productData.review_score,
        returnRate: productData.return_rate,
        rrdi: productData.rrdi
      }
    },
    {
      id: "bayesian",
      title: "Bayesian Smoothing",
      description: "Applying Bayesian smoothing to reduce extreme rating impact...",
      icon: <Brain className="h-6 w-6" />,
      duration: 1000,
      data: {
        totalReviews: productData.total_reviews,
        bayesianScore: productData.bayesian_smoothed_score
      }
    },
    {
      id: "burst",
      title: "Burst Detection",
      description: "Analyzing review patterns for suspicious burst activity...",
      icon: <Activity className="h-6 w-6" />,
      duration: 900,
      data: {
        smoothedRrdi: productData.smoothed_rrdi,
        gnnSignal: productData.gnn_fraud_signal
      }
    },
    {
      id: "gnn",
      title: "GNN Network Analysis",
      description: "Running Graph Neural Network analysis on seller network...",
      icon: <Network className="h-6 w-6" />,
      duration: 1500,
      data: {
        seller: productData.seller,
        category: productData.category
      }
    },
    {
      id: "final",
      title: "Final Assessment",
      description: "Combining all signals for final fraud assessment...",
      icon: <ShieldCheck className="h-6 w-6" />,
      duration: 600
    }
  ]

  const generateGraphData = (productData: any) => {
    const nodes = [
      { id: productData.seller, label: `Seller ${productData.seller}`, group: 'seller', fraud: productData.gnn_fraud_signal },
      { id: productData.asin, label: productData.asin, group: 'product', fraud: productData.is_fraudulent_product },
      { id: 'review1', label: 'Review 1', group: 'review', fraud: false },
      { id: 'review2', label: 'Review 2', group: 'review', fraud: false },
      { id: 'review3', label: 'Review 3', group: 'review', fraud: false },
      { id: 'return1', label: 'Return 1', group: 'return', fraud: true },
      { id: 'return2', label: 'Return 2', group: 'return', fraud: true },
    ]

    const edges = [
      { from: productData.seller, to: productData.asin, label: 'sells' },
      { from: productData.asin, to: 'review1', label: 'has' },
      { from: productData.asin, to: 'review2', label: 'has' },
      { from: productData.asin, to: 'review3', label: 'has' },
      { from: productData.asin, to: 'return1', label: 'has' },
      { from: productData.asin, to: 'return2', label: 'has' },
    ]

    return { nodes, edges }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)
    setError(null)
    setCurrentStep(-1)
    setShowGraph(false)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asin }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "An unknown error occurred.")
      }

      // Create analysis steps
      const steps = createAnalysisSteps(data.product || {})
      setAnalysisSteps(steps)
      setGraphData(generateGraphData(data.product || {}))

      // Start step-by-step animation
      let stepIndex = 0
      const runSteps = () => {
        if (stepIndex < steps.length) {
          setCurrentStep(stepIndex)
          setTimeout(() => {
            stepIndex++
            runSteps()
          }, steps[stepIndex].duration)
        } else {
          setResult(data.analysis)
          setShowGraph(true)
          setIsLoading(false)
        }
      }
      runSteps()

    } catch (err: any) {
      setError(err.message)
      setIsLoading(false)
    }
  }

  const getResultColor = () => {
    if (!result) return 'border-slate-700'
    if (result.trustScore > 70) return 'border-green-500'
    if (result.trustScore > 40) return 'border-yellow-500'
    return 'border-red-500'
  }

  const renderStepContent = (step: AnalysisStep) => {
    switch (step.id) {
      case 'rrdi':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-800 p-3 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span>Review Score</span>
                </div>
                <div className="text-2xl font-bold text-green-400">{step.data.reviewScore}</div>
              </div>
              <div className="bg-slate-800 p-3 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-4 w-4 text-red-400" />
                  <span>Return Rate</span>
                </div>
                <div className="text-2xl font-bold text-red-400">{(step.data.returnRate * 100).toFixed(1)}%</div>
              </div>
            </div>
            <div className="bg-slate-800 p-4 rounded">
              <div className="text-center">
                <div className="text-sm text-slate-400 mb-2">RRDI Score</div>
                <div className="text-3xl font-bold text-orange-400">{step.data.rrdi.toFixed(3)}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {step.data.rrdi > 0.4 ? 'High Risk' : step.data.rrdi > 0.2 ? 'Medium Risk' : 'Low Risk'}
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'bayesian':
        return (
          <div className="space-y-4">
            <div className="bg-slate-800 p-4 rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Total Reviews</span>
                <Badge variant="outline">{step.data.totalReviews}</Badge>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-400 mb-2">Bayesian Smoothed Score</div>
                <div className="text-3xl font-bold text-blue-400">{step.data.bayesianScore.toFixed(2)}</div>
              </div>
            </div>
          </div>
        )

      case 'burst':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800 p-3 rounded text-center">
                <div className="text-sm text-slate-400 mb-1">Smoothed RRDI</div>
                <div className="text-xl font-bold text-purple-400">{step.data.smoothedRrdi.toFixed(3)}</div>
              </div>
              <div className="bg-slate-800 p-3 rounded text-center">
                <div className="text-sm text-slate-400 mb-1">GNN Signal</div>
                <div className={`text-xl font-bold ${step.data.gnnSignal ? 'text-red-400' : 'text-green-400'}`}>
                  {step.data.gnnSignal ? 'SUSPICIOUS' : 'CLEAN'}
                </div>
              </div>
            </div>
          </div>
        )

      case 'gnn':
        return (
          <div className="space-y-4">
            <div className="bg-slate-800 p-4 rounded">
              <div className="text-center">
                <Network className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                <div className="text-sm text-slate-400">Analyzing seller network patterns</div>
                <div className="text-xs text-slate-500 mt-1">Seller: {step.data.seller} | Category: {step.data.category}</div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-slate-900/50 border-white/10 text-white">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Interactive Fraud Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-center text-slate-400">
          Enter a product ASIN to see the Temporal Trust Engine analyze it step-by-step. Try{" "}
          <code className="bg-slate-700/50 text-yellow-300 p-1 rounded">B002NVKLK4</code> (high-risk) or{" "}
          <code className="bg-slate-700/50 text-green-300 p-1 rounded">B005ZXCVBN</code> (low-risk).
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <Input
            type="text"
            value={asin}
            onChange={(e) => setAsin(e.target.value)}
            placeholder="Enter Product ASIN (e.g., B006UIOPSD)"
            className="bg-slate-800 border-slate-700 text-white flex-grow"
            disabled={isLoading}
          />
          <Button type="submit" className="tte-btn tte-btn-primary" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Analyze
              </>
            )}
          </Button>
        </form>

        {error && (
          <Alert variant="destructive" className="bg-red-900/50 border-red-500/50 text-white">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Analysis Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Analysis Steps */}
        {isLoading && analysisSteps.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">Analysis Progress</h3>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-400">
                <span>Step {currentStep + 1} of {analysisSteps.length}</span>
                <span>{Math.round(((currentStep + 1) / analysisSteps.length) * 100)}% Complete</span>
              </div>
              <Progress 
                value={((currentStep + 1) / analysisSteps.length) * 100} 
                className="h-2 bg-slate-700"
              />
            </div>
            
            <div className="space-y-3">
              {analysisSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`p-4 rounded-lg border transition-all duration-300 ${
                    index === currentStep
                      ? 'bg-blue-900/30 border-blue-500/50 step-active'
                      : index < currentStep
                      ? 'bg-green-900/30 border-green-500/50 step-complete'
                      : 'bg-slate-800/50 border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded ${
                      index === currentStep
                        ? 'bg-blue-500/20 text-blue-400'
                        : index < currentStep
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-slate-700 text-slate-400'
                    }`}>
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{step.title}</div>
                      <div className="text-sm text-slate-400">{step.description}</div>
                    </div>
                    {index < currentStep && (
                      <ShieldCheck className="h-5 w-5 text-green-400" />
                    )}
                    {index === currentStep && (
                      <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
                    )}
                  </div>
                  
                  {index === currentStep && step.data && (
                    <div className="mt-3 animate-fade-in calculation-animation p-3 rounded">
                      {renderStepContent(step)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Final Result */}
        {result && (
          <div className={`p-6 rounded-lg border-2 font-mono transition-all duration-500 animate-fade-in ${getResultColor()} bg-slate-900/50`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <h3 className="text-lg font-bold tracking-wider">Analysis Complete</h3>
                <p className="text-slate-400 mt-1 text-sm">{result.recommendation}</p>
              </div>
              <div className={`text-right ${
                  result.trustScore > 70 ? 'text-green-400' :
                  result.trustScore > 40 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                <div className="flex justify-end items-center gap-2">
                  {result.trustScore > 70 ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
                  <span className="text-2xl font-bold">{result.riskLevel}</span>
                </div>
                <div className="text-2xl font-bold text-right">Risk</div>
              </div>
            </div>

            <div className="text-center my-6 md:my-8">
              <p className="text-slate-400 text-sm tracking-widest uppercase">Calculated Trust Score</p>
              <p className={`text-7xl font-bold ${
                  result.trustScore > 70 ? 'text-green-400' :
                  result.trustScore > 40 ? 'text-yellow-400' : 'text-red-400'
                }`}>{result.trustScore}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-slate-800/70 p-4 rounded">
                    <p className="text-sm text-slate-400 tracking-widest">RRDI SCORE</p>
                    <p className="text-3xl font-bold text-orange-400 my-2">{result.factors.rrdi.score.toFixed(3)}</p>
                    <p className="text-xs text-slate-500 h-10">{result.factors.rrdi.interpretation}</p>
                </div>
                <div className="bg-slate-800/70 p-4 rounded">
                    <p className="text-sm text-slate-400 tracking-widest">BAYESIAN SCORE</p>
                    <p className="text-3xl font-bold text-blue-400 my-2">{result.factors.bayesian.score.toFixed(2)}</p>
                    <p className="text-xs text-slate-500 h-10">{result.factors.bayesian.interpretation}</p>
                </div>
                <div className="bg-slate-800/70 p-4 rounded">
                    <p className="text-sm text-slate-400 tracking-widest">BURST DETECTION</p>
                    <p className="text-3xl font-bold text-purple-400 my-2">{result.factors.burst.score.toFixed(3)}</p>
                    <p className="text-xs text-slate-500 h-10">{result.factors.burst.interpretation}</p>
                </div>
            </div>
          </div>
        )}

        {/* GNN Graph Visualization */}
        {showGraph && graphData && (
          <div className="space-y-4 mt-8 animate-fade-in">
            <h3 className="text-lg font-semibold text-center">GNN Network Analysis</h3>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 font-mono text-xs">
              <div className="flex gap-4">
                {/* Seller and Product Nodes */}
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded border-2 h-32 flex flex-col justify-center items-center graph-node ${
                    graphData.nodes[0].fraud ? 'border-red-500 bg-red-900/20' : 'border-blue-500 bg-blue-900/20'
                  }`}>
                    <Users className="h-5 w-5 mb-1" />
                    <div className="font-bold">{graphData.nodes[0].label}</div>
                    <div className="opacity-75">Seller</div>
                  </div>
                  <div className={`p-4 rounded border-2 h-32 flex flex-col justify-center items-center graph-node ${
                    graphData.nodes[1].fraud ? 'border-red-500 bg-red-900/20' : 'border-green-500 bg-green-900/20'
                  }`} style={{ animationDelay: '0.1s' }}>
                    <Package className="h-5 w-5 mb-1" />
                    <div className="font-bold">{graphData.nodes[1].label}</div>
                    <div className="opacity-75">Product</div>
                  </div>
                </div>

                {/* Review Nodes */}
                <div className="flex-1 flex flex-col gap-2">
                  {graphData.nodes.filter((n: any) => n.group === 'review').map((node: any, idx: number) => (
                    <div key={node.id} className="p-2 rounded border border-green-500/30 bg-green-900/10 graph-node flex-1 flex flex-col justify-center text-center" style={{ animationDelay: `${(idx + 2) * 0.1}s` }}>
                      <div className="font-medium">{node.label}</div>
                      <div className="opacity-75">Review</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Return Nodes */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                {graphData.nodes.filter((n: any) => n.group === 'return').map((node: any, idx: number) => (
                  <div key={node.id} className="p-4 rounded border border-red-500/30 bg-red-900/10 graph-node flex flex-col justify-center text-center" style={{ animationDelay: `${(idx + 5) * 0.1}s` }}>
                    <div className="font-medium">{node.label}</div>
                    <div className="opacity-75">Return</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 