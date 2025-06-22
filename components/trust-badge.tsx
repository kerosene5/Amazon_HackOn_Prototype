"use client"

import { AlertTriangle, Shield } from "lucide-react"

interface TrustBadgeProps {
  isFraudulent: boolean
}

export function TrustBadge({ isFraudulent }: TrustBadgeProps) {
  return (
    <div className={`status-badge ${isFraudulent ? "status-flagged" : "status-trusted"}`}>
      {isFraudulent ? (
        <>
          <AlertTriangle className="w-4 h-4" />
          High Risk Product
        </>
      ) : (
        <>
          <Shield className="w-4 h-4" />
          Trusted Product
        </>
      )}
    </div>
  )
}
