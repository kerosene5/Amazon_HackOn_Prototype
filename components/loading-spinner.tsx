"use client"

export function LoadingSpinner() {
  return (
    <div className="text-center">
      <div className="tte-spinner mx-auto mb-6"></div>
      <p className="tte-text-muted text-lg animate-pulse">Initializing Temporal Trust Engine...</p>
      <div className="mt-4 flex justify-center space-x-1">
        <div className="w-2 h-2 bg-[#ff6b6b] rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-[#ff6b6b] rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
        <div className="w-2 h-2 bg-[#ff6b6b] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
      </div>
    </div>
  )
}
