'use client'

import { useState } from 'react'
import { Target, Plus, Trash2, Edit2, Calendar, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { GoalCategory, GoalStatus } from '@/types'

interface Goal {
  id: string
  title: string
  description?: string
  category: GoalCategory
  targetValue?: number
  currentValue?: number
  unit?: string
  startDate: Date
  targetDate: Date
  status: GoalStatus
}

export function GoalsModule() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Lose 5 lbs',
      description: 'Achieve healthy weight loss through diet and exercise',
      category: 'fitness',
      targetValue: 5,
      currentValue: 3,
      unit: 'lbs',
      startDate: new Date('2024-12-01'),
      targetDate: new Date('2024-12-31'),
      status: 'active',
    },
    {
      id: '2',
      title: 'Meditate 100 times',
      description: 'Build a consistent meditation practice',
      category: 'meditation',
      targetValue: 100,
      currentValue: 45,
      unit: 'sessions',
      startDate: new Date('2024-11-01'),
      targetDate: new Date('2025-01-15'),
      status: 'active',
    },
    {
      id: '3',
      title: 'Journal daily for 30 days',
      description: 'Build a daily journaling habit',
      category: 'other',
      targetValue: 30,
      currentValue: 22,
      unit: 'days',
      startDate: new Date('2024-11-25'),
      targetDate: new Date('2024-12-25'),
      status: 'active',
    },
  ])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'fitness' as Goal['category'],
    targetValue: '',
    currentValue: '',
    unit: '',
    targetDate: '',
  })

  const categories = [
    { value: 'fitness', label: 'Fitness', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
    { value: 'nutrition', label: 'Nutrition', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
    { value: 'meditation', label: 'Meditation', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
    { value: 'manifestation', label: 'Manifestation', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300' },
    { value: 'other', label: 'Other', color: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300' },
  ]

  const getCategoryInfo = (category: string) => {
    return categories.find(c => c.value === category) || categories[0]
  }

  const calculateProgress = (goal: Goal) => {
    if (goal.targetValue && goal.currentValue) {
      return Math.min(100, (goal.currentValue / goal.targetValue) * 100)
    }
    return 0
  }

  const activeGoals = goals.filter(g => g.status === 'active')
  const completedGoals = goals.filter(g => g.status === 'completed')
  // const pausedGoals = goals.filter(g => g.status === 'paused')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const goalData: Goal = {
      id: editingGoal?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description || undefined,
      category: formData.category,
      targetValue: formData.targetValue ? parseFloat(formData.targetValue) : undefined,
      currentValue: formData.currentValue ? parseFloat(formData.currentValue) : undefined,
      unit: formData.unit || undefined,
      startDate: editingGoal?.startDate || new Date(),
      targetDate: new Date(formData.targetDate),
      status: editingGoal?.status || 'active',
    }

    if (editingGoal) {
      setGoals(goals.map(g => g.id === editingGoal.id ? goalData : g))
    } else {
      setGoals([...goals, goalData])
    }

    resetForm()
    setDialogOpen(false)
  }

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal)
    setFormData({
      title: goal.title,
      description: goal.description || '',
      category: goal.category,
      targetValue: goal.targetValue?.toString() || '',
      currentValue: goal.currentValue?.toString() || '',
      unit: goal.unit || '',
      targetDate: format(goal.targetDate, 'yyyy-MM-dd'),
    })
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setGoals(goals.filter(g => g.id !== id))
  }

  const handleUpdateProgress = (goal: Goal, newValue: number) => {
    setGoals(goals.map(g =>
      g.id === goal.id ? { ...g, currentValue: newValue } : g
    ))
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'fitness',
      targetValue: '',
      currentValue: '',
      unit: '',
      targetDate: '',
    })
    setEditingGoal(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Your Goals</h2>
          <p className="text-muted-foreground">Set and track your wellness objectives</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingGoal ? 'Edit Goal' : 'Add New Goal'}
              </DialogTitle>
              <DialogDescription>
                Set a new goal to track your wellness progress
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Goal Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Run 5K marathon"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your goal in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value: any) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="targetValue">Target Value</Label>
                  <Input
                    id="targetValue"
                    type="number"
                    step="0.1"
                    placeholder="100"
                    value={formData.targetValue}
                    onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    placeholder="kg, miles, etc."
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentValue">Current</Label>
                  <Input
                    id="currentValue"
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={formData.currentValue}
                    onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetDate">Target Date *</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  required
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
                <Button type="submit">{editingGoal ? 'Update' : 'Add'} Goal</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-2 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
          <CardHeader>
            <CardTitle className="text-lg">Active Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{activeGoals.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Currently tracking</p>
          </CardContent>
        </Card>
        <Card className="border-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <CardHeader>
            <CardTitle className="text-lg">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{completedGoals.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Goals achieved</p>
          </CardContent>
        </Card>
        <Card className="border-2 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <CardHeader>
            <CardTitle className="text-lg">Average Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {activeGoals.length > 0
                ? Math.round(activeGoals.reduce((sum, g) => sum + calculateProgress(g), 0) / activeGoals.length)
                : 0
              }%
            </p>
            <p className="text-sm text-muted-foreground mt-1">Across active goals</p>
          </CardContent>
        </Card>
      </div>

      {/* Goals List */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Active Goals</h3>
        {activeGoals.length === 0 ? (
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Target className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No active goals</p>
                <p className="text-sm text-muted-foreground mt-2">Set your first wellness goal</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {activeGoals.map((goal) => {
              const categoryInfo = getCategoryInfo(goal.category)
              const progress = calculateProgress(goal)
              return (
                <Card key={goal.id} className="border-2 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={categoryInfo.color}>{categoryInfo.label}</Badge>
                        </div>
                        <CardTitle className="text-lg">{goal.title}</CardTitle>
                        {goal.description && (
                          <CardDescription className="mt-1">{goal.description}</CardDescription>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                          {progress.toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-orange-500 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {goal.targetValue && goal.unit && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {goal.currentValue || 0} / {goal.targetValue} {goal.unit}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      Target: {format(goal.targetDate, 'MMM dd, yyyy')}
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newValue = (goal.currentValue || 0) + 1
                          handleUpdateProgress(goal, newValue)
                        }}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Update
                      </Button>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(goal)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(goal.id)}
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

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Completed Goals</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {completedGoals.map((goal) => {
              const categoryInfo = getCategoryInfo(goal.category)
              return (
                <Card key={goal.id} className="border-2 opacity-75">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <Badge className={categoryInfo.color}>{categoryInfo.label}</Badge>
                    </div>
                    <CardTitle>{goal.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Completed on {format(goal.targetDate, 'MMM dd, yyyy')}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
