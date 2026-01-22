'use client'

/**
 * Offline Fallback Page
 * Shown when user is offline and page not cached
 */

import { WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function OfflinePage() {
  const handleRefresh = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="rounded-full bg-muted p-6">
            <WifiOff className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">You're Offline</h1>
          <p className="text-muted-foreground">
            It looks like you've lost your internet connection. Your wellness data is safe and will
            sync automatically when you're back online.
          </p>
        </div>

        <div className="space-y-4">
          <Button onClick={handleRefresh} size="lg" className="w-full">
            Try Again
          </Button>

          <div className="text-sm text-muted-foreground">
            <p>While you're offline, you can:</p>
            <ul className="mt-2 space-y-1 text-left">
              <li>• View previously loaded data</li>
              <li>• Add new journal entries</li>
              <li>• Track meals and activities</li>
              <li>• Everything will sync when you reconnect</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
