'use client'

import { useState } from 'react'
import { BookOpen, Plus, Trash2, Edit2, Calendar, Search, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format } from 'date-fns'
import { MoodType } from '@/types'

interface JournalEntry {
  id: string
  title?: string
  content: string
  mood?: MoodType
  tags?: string
  isPrivate: boolean
  date: Date
}

export function JournalModule() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterMood, setFilterMood] = useState<string>('all')
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: undefined as MoodType | undefined,
    tags: '',
    isPrivate: true,
  })

  const moodOptions = [
    { value: 'happy', label: 'Happy', emoji: '😊', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' },
    { value: 'grateful', label: 'Grateful', emoji: '🙏', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300' },
    { value: 'calm', label: 'Calm', emoji: '😌', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
    { value: 'stressed', label: 'Stressed', emoji: '😰', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
    { value: 'anxious', label: 'Anxious', emoji: '😟', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
    { value: 'excited', label: 'Excited', emoji: '🎉', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
    { value: 'peaceful', label: 'Peaceful', emoji: '✨', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
  ]

  const totalEntries = entries.length

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const entryData: JournalEntry = {
      id: editingEntry?.id || Date.now().toString(),
      title: formData.title || undefined,
      content: formData.content,
      mood: formData.mood || undefined,
      tags: formData.tags || undefined,
      isPrivate: formData.isPrivate,
      date: editingEntry?.date || new Date(),
    }

    if (editingEntry) {
      setEntries(entries.map(e => e.id === editingEntry.id ? entryData : e))
    } else {
      setEntries([entryData, ...entries])
    }

    resetForm()
    setDialogOpen(false)
  }

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntry(entry)
    setFormData({
      title: entry.title || '',
      content: entry.content,
      mood: entry.mood,
      tags: entry.tags || '',
      isPrivate: entry.isPrivate,
    })
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setEntries(entries.filter(e => e.id !== id))
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      mood: undefined,
      tags: '',
      isPrivate: true,
    })
    setEditingEntry(null)
  }

  const getMoodInfo = (mood?: string) => {
    return moodOptions.find(m => m.value === mood)
  }

  const getMoodCounts = () => {
    const counts: Record<string, number> = {}
    entries.forEach(entry => {
      if (entry.mood) {
        counts[entry.mood] = (counts[entry.mood] || 0) + 1
      }
    })
    return counts
  }

  const filteredEntries = entries.filter(entry => {
    const matchesSearch =
      entry.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.tags?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesMood = filterMood === 'all' || entry.mood === filterMood

    return matchesSearch && matchesMood
  })

  const moodCounts = getMoodCounts()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Wellness Journal</h2>
          <p className="text-muted-foreground">Reflect on your journey and track your thoughts</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEntry ? 'Edit Journal Entry' : 'New Journal Entry'}
              </DialogTitle>
              <DialogDescription>
                {editingEntry ? 'Update your journal entry' : 'Express your thoughts and reflections'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title (optional)</Label>
                <Input
                  id="title"
                  placeholder="Give your entry a title..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  placeholder="How are you feeling today? What's on your mind?"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={8}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mood">How are you feeling?</Label>
                <Select value={formData.mood} onValueChange={(value: any) => setFormData({ ...formData, mood: value })}>
                  <SelectTrigger id="mood">
                    <SelectValue placeholder="Select your mood" />
                  </SelectTrigger>
                  <SelectContent>
                    {moodOptions.map((mood) => (
                      <SelectItem key={mood.value} value={mood.value}>
                        <span className="mr-2">{mood.emoji}</span>
                        {mood.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="wellness, gratitude, meditation..."
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={formData.isPrivate}
                  onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="isPrivate" className="cursor-pointer">
                  Keep this entry private
                </Label>
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
                <Button type="submit">{editingEntry ? 'Update' : 'Save'} Entry</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Card */}
      <Card className="border-2 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-green-500" />
            Your Journal Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Entries</p>
              <p className="text-2xl font-bold">{totalEntries}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Most Common Mood</p>
              <p className="text-2xl font-bold">
                {Object.entries(moodCounts).length > 0
                  ? getMoodInfo(Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0][0])?.emoji || '-'
                  : '-'
                }
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">This Week</p>
              <p className="text-2xl font-bold">
                {entries.filter(e => {
                  const entryDate = new Date(e.date)
                  const now = new Date()
                  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                  return entryDate >= weekAgo
                }).length}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
              <p className="text-2xl font-bold">0 days</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      {entries.length > 0 && (
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search entries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterMood} onValueChange={setFilterMood}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filter by mood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Moods</SelectItem>
                  {moodOptions.map((mood) => (
                    <SelectItem key={mood.value} value={mood.value}>
                      <span className="mr-2">{mood.emoji}</span>
                      {mood.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Journal Entries */}
      {entries.length === 0 ? (
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Your Journal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No journal entries yet</p>
              <p className="text-sm text-muted-foreground mt-2">Start documenting your wellness journey</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">
            {filteredEntries.length} {filteredEntries.length === 1 ? 'Entry' : 'Entries'}
          </h3>
          {filteredEntries.length === 0 ? (
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No entries match your search</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredEntries.map((entry) => {
              const moodInfo = getMoodInfo(entry.mood)
              return (
                <Card key={entry.id} className="border-2 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {entry.title && (
                          <h4 className="font-semibold text-lg mb-2">{entry.title}</h4>
                        )}
                        <p className="text-muted-foreground mb-4 whitespace-pre-wrap">{entry.content}</p>
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(entry.date), 'MMM dd, yyyy • h:mm a')}
                          </div>
                          {moodInfo && (
                            <Badge className={moodInfo.color}>
                              {moodInfo.emoji} {moodInfo.label}
                            </Badge>
                          )}
                          {entry.tags && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Tag className="w-3 h-3" />
                              {entry.tags}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(entry)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(entry.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
