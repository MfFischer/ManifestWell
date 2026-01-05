'use client'

import { useState } from 'react'
import { Sparkles, Play, CheckCircle, ExternalLink, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { YouTubePlayer } from '@/components/youtube-player'
import { ManifestationTechnique, ExperienceLevel } from '@/types'

interface Manifestation {
  id: string
  title: string
  description: string
  technique: ManifestationTechnique | 'silva_method' | 'quantum_jumping'
  duration: number
  videoUrl?: string
  level: ExperienceLevel
  instructions?: string[]
}

interface ManifestationSession {
  id: string
  manifestationId: string
  intention: string
  completed: boolean
  feeling?: string
  notes?: string
  date: Date
}

export function ManifestationModule() {
  const [selectedManifestation, setSelectedManifestation] = useState<Manifestation | null>(null)
  const [sessionDialog, setSessionDialog] = useState(false)
  const [intention, setIntention] = useState('')
  const [feeling, setFeeling] = useState('')
  const [notes, setNotes] = useState('')
  const [completedSessions, setCompletedSessions] = useState<ManifestationSession[]>([])

  const manifestations: Manifestation[] = [
    {
      id: '1',
      title: 'Silva Method Alpha State',
      description: 'Enter the alpha brainwave state to access your subconscious mind and manifest your desires',
      technique: 'silva_method',
      duration: 15,
      level: 'intermediate',
      videoUrl: 'https://www.youtube.com/watch?v=9HyOZ6xL_oM',
      instructions: [
        'Close your eyes and take three deep breaths',
        'Count backwards from 10 to 1 to enter alpha state',
        'Visualize a peaceful place where you feel completely relaxed',
        'State your intention clearly and positively',
        'Feel the emotion of your desire being fulfilled',
        'Visualize the outcome as if it has already happened',
        'Thank the universe and slowly return to awareness'
      ]
    },
    {
      id: '2',
      title: 'Quantum Jumping: Best Self',
      description: 'Visualize your best self in an alternate reality and bring that energy into your present',
      technique: 'quantum_jumping',
      duration: 20,
      level: 'advanced',
      videoUrl: 'https://www.youtube.com/watch?v=Kr7mSQI7Vcc',
      instructions: [
        'Relax deeply and clear your mind',
        'Imagine a parallel reality where you already achieved your goal',
        'Step into that reality and observe yourself',
        'Notice how you look, feel, and act in that reality',
        'Absorb the feelings and qualities of your best self',
        'Bring those qualities back with you to the present',
        'Express gratitude for this experience'
      ]
    },
    {
      id: '3',
      title: 'Future Self Visualization',
      description: 'Connect with your future self who has already manifested your desires',
      technique: 'visualization',
      duration: 15,
      level: 'intermediate',
      videoUrl: 'https://www.youtube.com/watch?v=5kkS4icwrcI',
      instructions: [
        'Sit comfortably and take deep breaths',
        'Visualize your future self, 6 months from now',
        'See them living the life you desire',
        'Feel the joy, peace, and fulfillment',
        'Ask your future self for guidance',
        'Receive any messages or insights',
        'Express gratitude and return to the present'
      ]
    },
    {
      id: '4',
      title: 'Power Affirmations',
      description: 'Reprogram your subconscious mind with powerful positive affirmations',
      technique: 'affirmation',
      duration: 10,
      level: 'beginner',
      videoUrl: 'https://www.youtube.com/watch?v=2l8WD4U4KMk',
      instructions: [
        'Choose 3-5 affirmations that resonate with you',
        'Repeat each one with feeling and conviction',
        'Speak them aloud or silently in your mind',
        'Feel the truth of each statement',
        'Visualize yourself living your affirmations',
        'Practice this daily for best results'
      ]
    },
    {
      id: '5',
      title: 'Gratitude Manifestation',
      description: 'Use the power of gratitude to attract more abundance into your life',
      technique: 'gratitude',
      duration: 10,
      level: 'beginner',
      videoUrl: 'https://www.youtube.com/watch?v=xfD4HaBBc0I',
      instructions: [
        'List 10 things you are grateful for',
        'Feel the emotion of gratitude deeply',
        'Visualize each blessing expanding in your life',
        'Express thanks to the universe',
        'Feel the abundance flowing to you',
        'Trust that more is on its way'
      ]
    },
    {
      id: '6',
      title: 'Vision Board Meditation',
      description: 'Mentally create and energize your vision board with focused intention',
      technique: 'visualization',
      duration: 15,
      level: 'intermediate',
      videoUrl: 'https://www.youtube.com/watch?v=lBKjpxMQpV4',
      instructions: [
        'Relax and enter a meditative state',
        'Create a mental image of your vision board',
        'See all your goals and desires clearly',
        'Add details, colors, and emotions',
        'Spend time feeling each manifestation',
        'Energize the board with positive emotion',
        'Know that it\'s already manifesting'
      ]
    },
    {
      id: '7',
      title: 'Quantum Jumping: Abundance',
      description: 'Jump to a reality where abundance flows freely and bring that energy back',
      technique: 'quantum_jumping',
      duration: 25,
      level: 'advanced',
      videoUrl: 'https://www.youtube.com/watch?v=5jCeqlsmRQg',
      instructions: [
        'Enter a deep meditative state',
        'Visualize many parallel realities around you',
        'Find one where abundance is your natural state',
        'Step into that reality fully',
        'Experience life as your abundant self',
        'Notice all the ways abundance manifests',
        'Return to this reality with that energy'
      ]
    },
    {
      id: '8',
      title: 'Silva Method Problem Solving',
      description: 'Use alpha state to find solutions to current challenges',
      technique: 'silva_method',
      duration: 15,
      level: 'intermediate',
      videoUrl: 'https://www.youtube.com/watch?v=Zd34ie2qhTA',
      instructions: [
        'Enter the alpha state through counting',
        'Clearly state your problem or challenge',
        'Ask for a solution while in alpha',
        'Wait patiently for insights to appear',
        'Trust whatever comes to your mind',
        'Express gratitude for the guidance',
        'Return to full awareness and act on insights'
      ]
    }
  ]


  const filteredManifestations = {
    all: manifestations,
    silva_method: manifestations.filter(m => m.technique === 'silva_method'),
    quantum_jumping: manifestations.filter(m => m.technique === 'quantum_jumping'),
    visualization: manifestations.filter(m => m.technique === 'visualization'),
    affirmation: manifestations.filter(m => m.technique === 'affirmation'),
    gratitude: manifestations.filter(m => m.technique === 'gratitude'),
  }

  const handleCompleteSession = () => {
    if (selectedManifestation && intention) {
      const newSession: ManifestationSession = {
        id: Date.now().toString(),
        manifestationId: selectedManifestation.id,
        intention,
        completed: true,
        feeling: feeling || undefined,
        notes: notes || undefined,
        date: new Date(),
      }
      setCompletedSessions([...completedSessions, newSession])
      resetSessionForm()
      setSessionDialog(false)
      setSelectedManifestation(null)
    }
  }

  const resetSessionForm = () => {
    setIntention('')
    setFeeling('')
    setNotes('')
  }

  const totalTime = completedSessions.reduce((sum, session) => {
    const manifestation = manifestations.find(m => m.id === session.manifestationId)
    return sum + (manifestation?.duration || 0)
  }, 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Manifestation Techniques</h2>
        <p className="text-muted-foreground">Practice Silva Method, Quantum Jumping & more to manifest your desires</p>
      </div>

      {/* Stats Card */}
      <Card className="border-2 bg-gradient-to-br from-orange-50 to-purple-50 dark:from-orange-950/20 dark:to-purple-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Your Manifestation Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Sessions Completed</p>
              <p className="text-2xl font-bold">{completedSessions.length}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Practice Time</p>
              <p className="text-2xl font-bold">{totalTime} min</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Intentions Set</p>
              <p className="text-2xl font-bold">{completedSessions.filter(s => s.intention).length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manifestation Techniques */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="silva_method">Silva Method</TabsTrigger>
          <TabsTrigger value="quantum_jumping">Quantum Jumping</TabsTrigger>
          <TabsTrigger value="visualization">Visualization</TabsTrigger>
          <TabsTrigger value="affirmation">Affirmation</TabsTrigger>
          <TabsTrigger value="gratitude">Gratitude</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {manifestations.map((manifestation) => (
              <ManifestationCard
                key={manifestation.id}
                manifestation={manifestation}
                onStart={() => setSelectedManifestation(manifestation)}
              />
            ))}
          </div>
        </TabsContent>

        {Object.entries(filteredManifestations).filter(([key]) => key !== 'all').map(([key, meds]) => (
          <TabsContent key={key} value={key} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {meds.map((manifestation) => (
                <ManifestationCard
                  key={manifestation.id}
                  manifestation={manifestation}
                  onStart={() => setSelectedManifestation(manifestation)}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Practice/Instructions Dialog */}
      <Dialog open={!!selectedManifestation && !sessionDialog} onOpenChange={(open) => !open && setSelectedManifestation(null)}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedManifestation && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-500" />
                  {selectedManifestation.title}
                </DialogTitle>
                <DialogDescription>{selectedManifestation.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {selectedManifestation.videoUrl ? (
                  <YouTubePlayer videoUrl={selectedManifestation.videoUrl} title={selectedManifestation.title} />
                ) : (
                  <Card className="border-2">
                    <CardContent className="pt-6">
                      <div className="text-center py-8">
                        <Sparkles className="w-16 h-16 mx-auto text-purple-500 mb-4" />
                        <p className="text-muted-foreground">Video content coming soon</p>
                        <p className="text-sm text-muted-foreground mt-2">Use the instructions below to practice</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {selectedManifestation.instructions && selectedManifestation.instructions.length > 0 && (
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Practice Instructions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ol className="space-y-3">
                        {selectedManifestation.instructions.map((instruction, index) => (
                          <li key={index} className="flex gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <p className="text-sm flex-1">{instruction}</p>
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>
                )}

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSelectedManifestation(null)}>
                    Close
                  </Button>
                  <Button
                    className="gap-2"
                    onClick={() => {
                      setSessionDialog(true)
                    }}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Complete Practice
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
            <DialogTitle>Practice Complete! ✨</DialogTitle>
            <DialogDescription>
              Set your intention and reflect on your experience
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="intention">What is your intention? *</Label>
              <Input
                id="intention"
                placeholder="e.g., I am manifesting abundance and joy"
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feeling">How do you feel now?</Label>
              <Input
                id="feeling"
                placeholder="e.g., Peaceful, energized, hopeful"
                value={feeling}
                onChange={(e) => setFeeling(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Any insights or notes? (optional)</Label>
              <Textarea
                id="notes"
                placeholder="Write your thoughts and insights..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSessionDialog(false)}>
                Skip
              </Button>
              <Button onClick={handleCompleteSession} disabled={!intention}>
                Save Session
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface ManifestationCardProps {
  manifestation: Manifestation
  onStart: () => void
}

function ManifestationCard({ manifestation, onStart }: ManifestationCardProps) {
  const getTechniqueInfo = (technique: string) => {
    const types: Record<string, { label: string; color: string }> = {
      silva_method: { label: 'Silva Method', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
      quantum_jumping: { label: 'Quantum Jumping', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
      visualization: { label: 'Visualization', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
      affirmation: { label: 'Affirmation', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
      gratitude: { label: 'Gratitude', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300' },
    }
    return types[technique] || types.silva_method
  }

  const getLevelInfo = (level: string) => {
    const levels: Record<string, { label: string; color: string }> = {
      beginner: { label: 'Beginner', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
      intermediate: { label: 'Intermediate', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' },
      advanced: { label: 'Advanced', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
    }
    return levels[level] || levels.beginner
  }

  const techniqueInfo = getTechniqueInfo(manifestation.technique)
  const levelInfo = getLevelInfo(manifestation.level)

  return (
    <Card className="border-2 hover:shadow-lg transition-all cursor-pointer group">
      <CardHeader>
        <CardTitle className="mb-2">{manifestation.title}</CardTitle>
        <CardDescription>{manifestation.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge className={techniqueInfo.color}>{techniqueInfo.label}</Badge>
            <Badge className={levelInfo.color}>{levelInfo.label}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              {manifestation.duration} min
            </div>
            {manifestation.videoUrl && (
              <span className="text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 px-2 py-1 rounded-full flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                Video
              </span>
            )}
          </div>
          <Button
            className="w-full gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onStart}
          >
            <Play className="w-4 h-4" />
            Start Practice
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
