'use client'

import { useState, useEffect } from 'react'
import { Activity, Plus, Trash2, Edit2, Clock, Flame, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ActivityType, IntensityLevel } from '@/types'

import { UserProfile, Workout } from '@/types'

interface FitnessTrackerProps {
  activeTab?: string
  setActiveTab?: (tab: string) => void
  workouts?: Workout[]
  setWorkouts?: (workouts: Workout[]) => void
  userProfile?: UserProfile | null
}

export function FitnessTracker({ workouts = [], setWorkouts = () => { }, userProfile }: FitnessTrackerProps) {

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'cardio' as ActivityType,
    duration: '',
    calories: '',
    intensity: 'medium' as IntensityLevel,
    notes: '',
  })

  const workoutTypes = [
    { value: 'cardio', label: 'Cardio', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
    { value: 'strength', label: 'Strength', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
    { value: 'yoga', label: 'Yoga', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
    { value: 'walking', label: 'Walking', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
    { value: 'running', label: 'Running', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
    { value: 'cycling', label: 'Cycling', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300' },
    { value: 'swimming', label: 'Swimming', color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300' },
    { value: 'other', label: 'Other', color: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300' },
  ]

  const intensityLevels = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-700' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'high', label: 'High', color: 'bg-red-100 text-red-700' },
  ]

  // MET (Metabolic Equivalent of Task) values for varying activities
  const MET_VALUES: Record<string, number> = {
    cardio: 7.0,
    strength: 5.0,
    yoga: 3.0,
    walking: 3.8,
    running: 9.8,
    cycling: 7.5,
    swimming: 6.0,
    other: 4.0,
  }

  const INTENSITY_MULTIPLIERS: Record<string, number> = {
    low: 0.8,
    medium: 1.0,
    high: 1.2,
  }

  // Auto-calculate calories when type, duration, or intensity changes
  useEffect(() => {
    if (formData.duration && !isNaN(parseInt(formData.duration))) {
      const durationMin = parseInt(formData.duration)
      const met = MET_VALUES[formData.type] || MET_VALUES.other
      const intensityMult = INTENSITY_MULTIPLIERS[formData.intensity] || 1.0

      // Standard Formula: Calories = (MET * 3.5 * Weight(kg) / 200) * Duration(min)
      // Use profile weight or default to 70kg
      const weightKg = userProfile?.weight || 70

      const calculatedCalories = Math.round((met * intensityMult * 3.5 * weightKg / 200) * durationMin)

      setFormData(prev => ({
        ...prev,
        calories: calculatedCalories.toString()
      }))
    }
  }, [formData.type, formData.duration, formData.intensity])

  const todayDuration = workouts.reduce((sum, w) => sum + w.duration, 0)
  const todayCalories = workouts.reduce((sum, w) => sum + (w.calories || 0), 0)
  const dailyGoal = 30 // 30 minutes per day

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const workoutData: Workout = {
      id: editingWorkout?.id || Date.now().toString(),
      userId: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      name: formData.name,
      type: formData.type,
      duration: parseInt(formData.duration) || 0,
      calories: formData.calories ? parseInt(formData.calories) : undefined,
      intensity: formData.intensity,
      notes: formData.notes || undefined,
      date: new Date(),
    }

    if (editingWorkout) {
      setWorkouts(workouts.map(w => w.id === editingWorkout.id ? workoutData : w))
    } else {
      setWorkouts([...workouts, workoutData])
    }

    resetForm()
    setDialogOpen(false)
  }

  const handleEdit = (workout: Workout) => {
    setEditingWorkout(workout)
    setFormData({
      name: workout.name,
      type: workout.type,
      duration: workout.duration.toString(),
      calories: workout.calories?.toString() || '',
      intensity: workout.intensity || 'medium',
      notes: workout.notes || '',
    })
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setWorkouts(workouts.filter(w => w.id !== id))
  }

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'cardio',
      duration: '',
      calories: '',
      intensity: 'medium',
      notes: '',
    })
    setEditingWorkout(null)
  }

  const getWorkoutTypeInfo = (type: string) => {
    return workoutTypes.find(t => t.value === type) || workoutTypes[0]
  }

  const getIntensityInfo = (intensity?: string) => {
    return intensityLevels.find(i => i.value === intensity)
  }

  const recentWorkouts = workouts.slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Fitness Tracking</h2>
          <p className="text-muted-foreground">Log your workouts and track your progress</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Log Workout
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingWorkout ? 'Edit Workout' : 'Log New Workout'}
              </DialogTitle>
              <DialogDescription>
                Record your workout to track your fitness progress
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Workout Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Morning Run"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Workout Type *</Label>
                <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {workoutTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (min) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="30"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="calories">Calories Burned</Label>
                  <Input
                    id="calories"
                    type="number"
                    placeholder="0"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="intensity">Intensity</Label>
                <Select value={formData.intensity} onValueChange={(value: any) => setFormData({ ...formData, intensity: value })}>
                  <SelectTrigger id="intensity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {intensityLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="How did you feel? Any achievements?"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm()
                    setDialogOpen(false)
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">{editingWorkout ? 'Update' : 'Log'} Workout</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Daily Stats Card */}
      <Card className="border-2 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Today's Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Duration</p>
              <p className="text-2xl font-bold">
                {todayDuration} <span className="text-sm text-muted-foreground">min</span>
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Zap className="w-4 h-4 text-yellow-500" />
                <p className="text-xs text-muted-foreground">
                  Goal: {dailyGoal} min
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Calories</p>
              <p className="text-2xl font-bold">
                {todayCalories} <span className="text-sm text-muted-foreground">burned</span>
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Flame className="w-4 h-4 text-orange-500" />
                <p className="text-xs text-muted-foreground">
                  {workouts.length} workout{workouts.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Workouts</p>
              <p className="text-2xl font-bold">{workouts.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Today</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workouts List */}
      {workouts.length === 0 ? (
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Recent Workouts</CardTitle>
            <CardDescription>Your recent fitness activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Activity className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No workouts logged yet</p>
              <p className="text-sm text-muted-foreground mt-2">Start tracking your fitness journey</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Recent Workouts</h3>
          {recentWorkouts.map((workout) => {
            const workoutType = getWorkoutTypeInfo(workout.type)
            const intensityInfo = getIntensityInfo(workout.intensity)
            return (
              <Card key={workout.id} className="border-2 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <Badge className={workoutType.color}>{workoutType.label}</Badge>
                        <h4 className="font-semibold">{workout.name}</h4>
                        {intensityInfo && (
                          <Badge className={intensityInfo.color}>{intensityInfo.label}</Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {workout.duration} minutes
                        </span>
                        {workout.calories && (
                          <span className="flex items-center gap-1">
                            <Flame className="w-4 h-4" />
                            {workout.calories} calories
                          </span>
                        )}
                      </div>
                      {workout.notes && (
                        <p className="text-sm text-muted-foreground mt-2 italic">{workout.notes}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(workout)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(workout.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
