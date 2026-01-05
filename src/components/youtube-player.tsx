'use client'

import { useState, useEffect } from 'react'
import { Brain, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface YouTubePlayerProps {
  videoUrl: string
  title: string
}

export function YouTubePlayer({ videoUrl, title }: YouTubePlayerProps) {
  const [isClient, setIsClient] = useState(false)
  const [videoError, setVideoError] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
    return match ? match[1] : null
  }

  const videoId = getYouTubeId(videoUrl)

  if (!isClient) {
    return (
      <div className="aspect-video w-full bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          <Brain className="w-16 h-16 text-slate-400 animate-pulse" />
        </div>
      </div>
    )
  }

  if (!videoId) {
    return (
      <Card className="border-2">
        <CardContent className="pt-6">
          <div className="aspect-video w-full bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
            <div className="text-center p-6">
              <ExternalLink className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground font-medium">Video link not available</p>
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:underline mt-2 inline-block"
              >
                Open in new tab →
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="aspect-video w-full bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
      {videoError ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center p-6">
            <Brain className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground font-medium mb-2">Video unavailable</p>
            <p className="text-sm text-muted-foreground mb-4">This video may be restricted or unavailable</p>
            <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline inline-flex items-center gap-1"
            >
              Watch on YouTube
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      ) : (
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onError={() => setVideoError(true)}
          suppressHydrationWarning
        />
      )}
    </div>
  )
}
