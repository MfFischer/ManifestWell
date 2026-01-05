'use client'

import { useState, useMemo } from 'react'
import { Brain, Play, CheckCircle, ExternalLink, Clock, Star, TrendingUp, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { YouTubePlayer } from '@/components/youtube-player'
import {
  allMeditations,
  getMeditationsByType,
  searchMeditations,
  getPopularMeditations,
  getMeditationCounts,
  type MeditationData,
  type MeditationType,
  type MeditationLevel
} from '@/content/meditations'

interface MeditationSession {
  id: string
  meditationId: string
  completed: boolean
  rating?: number
  notes?: string
  date: Date
}

const ITEMS_PER_PAGE = 12

export function MeditationModule() {
  const [selectedMeditation, setSelectedMeditation] = useState<MeditationData | null>(null)
  const [sessionDialog, setSessionDialog] = useState(false)
  const [rating, setRating] = useState(0)
  const [notes, setNotes] = useState('')
  const [completedSessions, setCompletedSessions] = useState<MeditationSession[]>([])

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [levelFilter, setLevelFilter] = useState<MeditationLevel | 'all'>('all')
  const [durationFilter, setDurationFilter] = useState<'all' | 'short' | 'medium' | 'long'>('all')
  const [currentPage, setCurrentPage] = useState(1)

  // Get meditation counts
  const counts = getMeditationCounts()

  // Filter and search meditations
  const filteredMeditations = useMemo(() => {
    let result = searchQuery ? searchMeditations(searchQuery) : allMeditations

    // Apply level filter
    if (levelFilter !== 'all') {
      result = result.filter(m => m.level === levelFilter)
    }

    // Apply duration filter
    if (durationFilter !== 'all') {
      if (durationFilter === 'short') {
        result = result.filter(m => m.duration <= 10)
      } else if (durationFilter === 'medium') {
        result = result.filter(m => m.duration > 10 && m.duration <= 25)
      } else if (durationFilter === 'long') {
        result = result.filter(m => m.duration > 25)
      }
    }

    return result
  }, [searchQuery, levelFilter, durationFilter])

  // Paginate results
  const paginatedMeditations = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredMeditations.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredMeditations, currentPage])

  const totalPages = Math.ceil(filteredMeditations.length / ITEMS_PER_PAGE)

  // Reset pagination when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleLevelFilterChange = (value: MeditationLevel | 'all') => {
    setLevelFilter(value)
    setCurrentPage(1)
  }

  const handleDurationFilterChange = (value: 'all' | 'short' | 'medium' | 'long') => {
    setDurationFilter(value)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setLevelFilter('all')
    setDurationFilter('all')
    setCurrentPage(1)
  }

  const hasActiveFilters = searchQuery || levelFilter !== 'all' || durationFilter !== 'all'

  const handleCompleteSession = () => {
    if (selectedMeditation) {
      const newSession: MeditationSession = {
        id: Date.now().toString(),
        meditationId: selectedMeditation.id,
        completed: true,
        rating: rating || undefined,
        notes: notes || undefined,
        date: new Date(),
      }
      setCompletedSessions([...completedSessions, newSession])
      resetSessionForm()
      setSessionDialog(false)
      setSelectedMeditation(null)
    }
  }

  const resetSessionForm = () => {
    setRating(0)
    setNotes('')
  }

  const totalMeditationTime = completedSessions.reduce((sum, session) => {
    const meditation = allMeditations.find(m => m.id === session.meditationId)
    return sum + (meditation?.duration || 0)
  }, 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Meditation & Mindfulness</h2>
        <p className="text-muted-foreground">
          {allMeditations.length} guided meditation sessions for inner peace and clarity
        </p>
      </div>

      {/* Stats Card */}
      <Card className="border-2 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Sessions Completed</p>
              <p className="text-2xl font-bold">{completedSessions.length}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Meditation Time</p>
              <p className="text-2xl font-bold">{totalMeditationTime} min</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
              <p className="text-2xl font-bold">
                {completedSessions.length > 0
                  ? (completedSessions.reduce((sum, s) => sum + (s.rating || 0), 0) / completedSessions.filter(s => s.rating).length).toFixed(1)
                  : '-'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search meditations..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Level Filter */}
            <Select value={levelFilter} onValueChange={handleLevelFilterChange}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>

            {/* Duration Filter */}
            <Select value={durationFilter} onValueChange={handleDurationFilterChange}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Duration</SelectItem>
                <SelectItem value="short">Short (≤10 min)</SelectItem>
                <SelectItem value="medium">Medium (11-25 min)</SelectItem>
                <SelectItem value="long">Long (25+ min)</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                <X className="w-4 h-4" />
                Clear
              </Button>
            )}
          </div>

          {/* Results count */}
          {hasActiveFilters && (
            <p className="text-sm text-muted-foreground mt-3">
              Showing {filteredMeditations.length} of {allMeditations.length} meditations
            </p>
          )}
        </CardContent>
      </Card>

      {/* Meditation Categories */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
          <TabsTrigger value="all">All ({allMeditations.length})</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="breathing">Breathing ({counts.breathing})</TabsTrigger>
          <TabsTrigger value="mindfulness">Mindfulness ({counts.mindfulness})</TabsTrigger>
          <TabsTrigger value="visualization">Visualization ({counts.visualization})</TabsTrigger>
          <TabsTrigger value="stress_relief">Stress ({counts.stress_relief})</TabsTrigger>
          <TabsTrigger value="sleep">Sleep ({counts.sleep})</TabsTrigger>
        </TabsList>

        {/* All Tab with Search/Filter */}
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {paginatedMeditations.map((meditation) => (
              <MeditationCard
                key={meditation.id}
                meditation={meditation}
                onStart={() => setSelectedMeditation(meditation)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Most Popular Tab */}
        <TabsContent value="popular" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getPopularMeditations(12).map((meditation) => (
              <MeditationCard
                key={meditation.id}
                meditation={meditation}
                onStart={() => setSelectedMeditation(meditation)}
              />
            ))}
          </div>
        </TabsContent>

        {/* Type-specific tabs */}
        {(['breathing', 'mindfulness', 'visualization', 'stress_relief', 'sleep'] as MeditationType[]).map((type) => (
          <TabsContent key={type} value={type} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {getMeditationsByType(type).map((meditation) => (
                <MeditationCard
                  key={meditation.id}
                  meditation={meditation}
                  onStart={() => setSelectedMeditation(meditation)}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Video/Practice Dialog */}
      <Dialog open={!!selectedMeditation && !sessionDialog} onOpenChange={(open) => !open && setSelectedMeditation(null)}>
        <DialogContent className="sm:max-w-3xl">
          {selectedMeditation && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Brain className="w-6 h-6 text-purple-500" />
                  {selectedMeditation.title}
                </DialogTitle>
                <DialogDescription>
                  {selectedMeditation.description}
                  {selectedMeditation.instructor && (
                    <span className="block mt-1 text-xs">by {selectedMeditation.instructor}</span>
                  )}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {selectedMeditation.videoUrl ? (
                  <YouTubePlayer videoUrl={selectedMeditation.videoUrl} title={selectedMeditation.title} />
                ) : (
                  <div className="aspect-video w-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Brain className="w-16 h-16 mx-auto text-purple-500 mb-4" />
                      <p className="text-muted-foreground">Video content coming soon</p>
                    </div>
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSelectedMeditation(null)}>
                    Close
                  </Button>
                  <Button
                    className="gap-2"
                    onClick={() => {
                      setSessionDialog(true)
                    }}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark as Complete
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Session Completion Dialog */}
      <Dialog open={sessionDialog} onOpenChange={setSessionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Session Complete!</DialogTitle>
            <DialogDescription>
              How was your meditation experience?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Rate your experience</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                    title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  >
                    <Star
                      className={`w-8 h-8 ${star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-slate-200 text-slate-200'
                        }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="How do you feel? Any insights?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSessionDialog(false)}>
                Skip
              </Button>
              <Button onClick={handleCompleteSession}>
                Save Session
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface MeditationCardProps {
  meditation: MeditationData
  onStart: () => void
}

function MeditationCard({ meditation, onStart }: MeditationCardProps) {
  const getTypeInfo = (type: string) => {
    const types: Record<string, { label: string; color: string }> = {
      breathing: { label: 'Breathing', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300' },
      mindfulness: { label: 'Mindfulness', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
      visualization: { label: 'Visualization', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300' },
      sleep: { label: 'Sleep', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' },
      stress_relief: { label: 'Stress Relief', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
    }
    return types[type] || types.breathing
  }

  const getLevelInfo = (level: string) => {
    const levels: Record<string, { label: string; color: string }> = {
      beginner: { label: 'Beginner', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
      intermediate: { label: 'Intermediate', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' },
      advanced: { label: 'Advanced', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
    }
    return levels[level] || levels.beginner
  }

  const typeInfo = getTypeInfo(meditation.type)
  const levelInfo = getLevelInfo(meditation.level)

  return (
    <Card className="border-2 hover:shadow-lg transition-all cursor-pointer group">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="mb-2 text-base">{meditation.title}</CardTitle>
            <CardDescription className="line-clamp-2">{meditation.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge className={typeInfo.color}>{typeInfo.label}</Badge>
            <Badge className={levelInfo.color}>{levelInfo.label}</Badge>
            {meditation.popularity && meditation.popularity <= 3 && (
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Top {meditation.popularity}
              </Badge>
            )}
          </div>

          {/* Instructor */}
          {meditation.instructor && (
            <p className="text-xs text-muted-foreground">by {meditation.instructor}</p>
          )}

          {/* Duration and Video indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              {meditation.duration} min
            </div>
            <div className="flex items-center gap-2">
              {meditation.views && (
                <span className="text-xs text-muted-foreground">{meditation.views} views</span>
              )}
              {meditation.videoUrl ? (
                <span className="text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 px-2 py-1 rounded-full flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  Video
                </span>
              ) : (
                <span className="text-xs bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300 px-2 py-1 rounded-full">
                  Audio Only
                </span>
              )}
            </div>
          </div>
          <Button
            className="w-full gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onStart}
          >
            <Play className="w-4 h-4" />
            Start
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
