"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Play, Clock, Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface AgentStatus {
  isRunning: boolean
  totalActions: number
  recentActions: number
  lastRun?: string
}

interface AgentAction {
  asin: string
  decision: {
    action: "BLOCK" | "FLAG" | "MONITOR" | "TRUST"
    confidence: number
    reasoning: string[]
    riskFactors: string[]
    timestamp: string
  }
  executed: boolean
  executionTime?: string
}

export function AgentStatus() {
  const [status, setStatus] = useState<AgentStatus | null>(null)
  const [recentActions, setRecentActions] = useState<AgentAction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isRunning, setIsRunning] = useState(false)

  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/agent/run", { method: "POST" })
      const data = await response.json()
      
      if (response.ok) {
        setStatus(data.status)
        setRecentActions(data.recentActions || [])
        setIsRunning(data.status.isRunning)
      }
    } catch (error) {
      console.error("Failed to fetch agent status:", error)
    }
  }

  const runAgent = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/agent/run")
      const data = await response.json()
      
      if (response.ok) {
        toast({
          title: "Agent Started",
          description: data.message,
        })
        setStatus(data.status)
        setRecentActions(data.recentActions || [])
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to start agent",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start agent",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 5000) // Poll every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const getActionIcon = (action: string) => {
    switch (action) {
      case "BLOCK":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "FLAG":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "MONITOR":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "TRUST":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "BLOCK":
        return "bg-red-100 text-red-800 border-red-200"
      case "FLAG":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "MONITOR":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "TRUST":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (!status) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Fraud Detection Agent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Agent Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Fraud Detection Agent
          </CardTitle>
          <CardDescription>
            AI-powered agent that automatically detects and blocks fraudulent products
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{status.totalActions}</div>
              <div className="text-sm text-muted-foreground">Total Actions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{status.recentActions}</div>
              <div className="text-sm text-muted-foreground">Last 24h</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {status.lastRun ? "🟢" : "🔴"}
              </div>
              <div className="text-sm text-muted-foreground">Status</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {status.isRunning ? "🔄" : "⏸️"}
              </div>
              <div className="text-sm text-muted-foreground">Running</div>
            </div>
          </div>

          {/* Control Button */}
          <div className="flex justify-center">
            <Button
              onClick={runAgent}
              disabled={isLoading || status.isRunning}
              className="w-full max-w-xs"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {status.isRunning ? "Agent Running..." : "Run Fraud Detection"}
            </Button>
          </div>

          {/* Status Alert */}
          {status.isRunning && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Agent is currently running. Please wait for completion.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Recent Actions */}
      {recentActions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Agent Actions</CardTitle>
            <CardDescription>
              Latest decisions made by the fraud detection agent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActions.map((action, index) => (
                <div
                  key={`${action.asin}-${index}`}
                  className="border rounded-lg p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getActionIcon(action.decision.action)}
                      <span className="font-mono text-sm">{action.asin}</span>
                    </div>
                    <Badge className={getActionColor(action.decision.action)}>
                      {action.decision.action}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Confidence: {(action.decision.confidence * 100).toFixed(1)}%
                  </div>
                  
                  {action.decision.riskFactors.length > 0 && (
                    <div className="text-sm">
                      <div className="font-medium text-red-600 mb-1">Risk Factors:</div>
                      <ul className="list-disc list-inside space-y-1">
                        {action.decision.riskFactors.map((factor, i) => (
                          <li key={i} className="text-xs">{factor}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="text-xs text-muted-foreground">
                    {new Date(action.decision.timestamp).toLocaleString()}
                    {action.executed && " • Executed"}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 