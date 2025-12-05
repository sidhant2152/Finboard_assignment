import { Loader2 } from 'lucide-react'
import React from 'react'

const WidgetLoading = () => {
  return (
    <div className="flex h-full flex-col gap-3 p-4 animate-pulse">
    <div className="flex justify-between">
      <div className="space-y-2">
        <div className="h-6 w-16 rounded bg-muted" />
        <div className="h-4 w-24 rounded bg-muted" />
      </div>
      <div className="h-6 w-16 rounded-full bg-muted" />
    </div>
    <div className="mt-auto space-y-2">
      <div className="h-8 w-28 rounded bg-muted" />
      <div className="h-4 w-20 rounded bg-muted" />
    </div>
  </div>
  )
}

export default WidgetLoading    