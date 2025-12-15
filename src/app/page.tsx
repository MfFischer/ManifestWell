'use client'

import { useState, useEffect } from 'react'
import {
  Utensils,
  Activity,
  Brain,
  Sparkles,
  BookOpen,
  Target,
  Menu,
  X,
  Calendar,
  Heart,
  Zap,
  User,
  LineChart,
  Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { NutritionTracker } from '@/components/nutrition-tracker'
import { FitnessTracker } from '@/components/fitness-tracker'
import { MeditationModule } from '@/components/meditation-module'
import { ManifestationModule } from '@/components/manifestation-module'
import { JournalModule } from '@/components/journal-module'
import { GoalsModule } from '@/components/goals-module'
import { SmartAnalysis } from '@/components/smart-analysis'
import { ProfileDialog } from '@/components/profile-dialog'
import { SettingsPage } from '@/components/settings/SettingsPage'
import { HealthDashboard } from '@/components/health'
import { GamificationCard } from '@/components/gamification'
import { OnboardingFlow } from '@/components/onboarding'
import { isOnboardingComplete } from '@/lib/storage/preferences'
import { UserProfile, Meal, Workout } from '@/types'

export default function ManifestWellDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [profileOpen, setProfileOpen] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null)

  // Check if onboarding is needed
  useEffect(() => {
    const checkOnboarding = async () => {
      const complete = await isOnboardingComplete()
      setShowOnboarding(!complete)
    }
    checkOnboarding()
  }, [])

  // -- Lifted State --
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [meals, setMeals] = useState<Meal[]>([])
  const [workouts, setWorkouts] = useState<Workout[]>([])

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'analysis', label: 'Analysis', icon: LineChart },
    { id: 'nutrition', label: 'Nutrition', icon: Utensils },
    { id: 'fitness', label: 'Fitness', icon: Activity },
    { id: 'meditation', label: 'Meditation', icon: Brain },
    { id: 'manifestation', label: 'Manifestation', icon: Sparkles },
    { id: 'journal', label: 'Journal', icon: BookOpen },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const quickStats = [
    { label: 'Today\'s Calories', value: meals.reduce((acc, m) => acc + m.calories, 0).toString(), goal: '2,000', icon: Utensils, color: 'text-orange-500' },
    { label: 'Activities', value: workouts.length.toString(), goal: '3', icon: Activity, color: 'text-blue-500' },
    { label: 'Meditation Time', value: '15 min', goal: '30 min', icon: Brain, color: 'text-purple-500' },
    { label: 'Streak', value: '7 days', goal: '30 days', icon: Zap, color: 'text-yellow-500' },
  ]

  const todayActivities = [
    { time: '8:00 AM', activity: 'Morning Meditation', duration: '10 min', completed: true },
    ...meals.map(m => ({
      time: 'Meal',
      activity: m.name,
      calories: m.calories,
      completed: true
    })),
    ...workouts.map(w => ({
      time: 'Workout',
      activity: w.name,
      duration: `${w.duration} min`,
      completed: true
    }))
  ]

  const upcomingGoals = [
    { title: userProfile?.goalWeight ? `Reach ${userProfile.goalWeight}kg` : 'Set a weight goal', progress: 0, deadline: userProfile?.goalDate ? new Date(userProfile.goalDate).toLocaleDateString() : 'N/A' },
    { title: 'Meditate 100 times', progress: 45, deadline: 'Jan 15, 2025' },
    { title: 'Journal daily for 30 days', progress: 75, deadline: 'Dec 25, 2024' },
  ]

  // Show loading state while checking onboarding status
  if (showOnboarding === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 flex items-center justify-center">
        <div className="animate-pulse text-white text-lg">Loading...</div>
      </div>
    )
  }

  // Show onboarding for first-time users
  if (showOnboarding) {
    return <OnboardingFlow onComplete={() => setShowOnboarding(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-orange-50 dark:from-slate-950 dark:via-purple-950 dark:to-orange-950">

      {/* Profile Dialog */}
      <ProfileDialog
        open={profileOpen}
        onOpenChange={setProfileOpen}
        profile={userProfile}
        onSave={setUserProfile}
      />

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white/80 backdrop-blur-sm shadow-lg"
        >
          {sidebarOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-slate-900 border-r shadow-xl transform transition-transform duration-300 z-40 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
      >
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg overflow-hidden bg-white">
              <img src="/logo.png" alt="ManifestWell Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
                ManifestWell
              </h1>
              <p className="text-xs text-muted-foreground">Mind-Body Wellness</p>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-8rem)] p-4">
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === item.id
                    ? 'bg-gradient-to-r from-purple-100 to-orange-100 dark:from-purple-900/30 dark:to-orange-900/30 text-purple-700 dark:text-purple-300'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>
        </ScrollArea>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors" onClick={() => setProfileOpen(true)}>
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <User className="text-white w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{userProfile?.name || 'Set Profile'}</p>
              <p className="text-xs text-muted-foreground truncate">{userProfile?.age ? `${userProfile.age} yo` : 'Click to setup'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-72 min-h-screen overflow-y-auto touch-pan-y">
        <div className="p-6 lg:p-8 pb-20">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                  Good Morning, {userProfile?.name ? userProfile.name.split(' ')[0] : 'Wellness Warrior'}! 👋
                </h2>
                <p className="text-muted-foreground">Track your wellness journey and manifest your best self.</p>
              </div>

              {/* Quick Stats */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {quickStats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                        <Icon className={`w-5 h-5 ${stat.color}`} />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Goal: {stat.goal}
                        </p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {/* Health Dashboard */}
                <HealthDashboard stepGoal={10000} calorieGoal={500} />

                {/* Today's Activities */}
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Today's Schedule
                    </CardTitle>
                    <CardDescription>Your wellness activities for today</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {todayActivities.slice(0, 5).map((activity, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-3 p-3 rounded-lg ${activity.completed
                          ? 'bg-green-50 dark:bg-green-950/20'
                          : 'bg-slate-50 dark:bg-slate-800/50'
                          }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${activity.completed ? 'bg-green-500' : 'bg-slate-300'
                            }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{activity.activity}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                        {((activity as any).calories || (activity as any).duration) && (
                          <div className="text-xs font-medium px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                            {(activity as any).calories ? `${(activity as any).calories} cal` : (activity as any).duration}
                          </div>
                        )}

                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Upcoming Goals */}
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Goal Progress
                    </CardTitle>
                    <CardDescription>Your wellness objectives</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {upcomingGoals.map((goal, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{goal.title}</p>
                          <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                            {goal.progress}%
                          </span>
                        </div>
                        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-orange-500 rounded-full transition-all duration-500"
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">Deadline: {goal.deadline}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Gamification Progress */}
              <GamificationCard variant="full" />

              {/* Quick Actions */}
              <Card className="border-2 bg-gradient-to-br from-purple-50 to-orange-50 dark:from-purple-950/20 dark:to-orange-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Log your wellness activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <Button
                      variant="outline"
                      className="h-auto flex-col gap-2 py-6 border-2 hover:border-purple-300"
                      onClick={() => setActiveTab('nutrition')}
                    >
                      <Utensils className="w-8 h-8 text-orange-500" />
                      <span className="font-medium">Log Meal</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto flex-col gap-2 py-6 border-2 hover:border-blue-300"
                      onClick={() => setActiveTab('fitness')}
                    >
                      <Activity className="w-8 h-8 text-blue-500" />
                      <span className="font-medium">Log Workout</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto flex-col gap-2 py-6 border-2 hover:border-purple-300"
                      onClick={() => setActiveTab('meditation')}
                    >
                      <Brain className="w-8 h-8 text-purple-500" />
                      <span className="font-medium">Start Meditation</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto flex-col gap-2 py-6 border-2 hover:border-orange-300"
                      onClick={() => setActiveTab('journal')}
                    >
                      <BookOpen className="w-8 h-8 text-green-500" />
                      <span className="font-medium">Write Journal</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Smart Analysis Tab */}
            <TabsContent value="analysis">
              <SmartAnalysis
                profile={userProfile}
                onOpenProfile={() => setProfileOpen(true)}
                meals={meals}
                workouts={workouts}
              />
            </TabsContent>

            {/* Nutrition Tab */}
            <TabsContent value="nutrition">
              <NutritionTracker
                meals={meals}
                setMeals={setMeals}
              />
            </TabsContent>

            {/* Fitness Tab */}
            <TabsContent value="fitness">
              <FitnessTracker
                workouts={workouts}
                setWorkouts={setWorkouts}
                userProfile={userProfile}
              />
            </TabsContent>

            {/* Meditation Tab */}
            <TabsContent value="meditation">
              <MeditationModule />
            </TabsContent>

            {/* Manifestation Tab */}
            <TabsContent value="manifestation">
              <ManifestationModule />
            </TabsContent>

            {/* Journal Tab */}
            <TabsContent value="journal">
              <JournalModule />
            </TabsContent>

            {/* Goals Tab */}
            <TabsContent value="goals">
              <GoalsModule />
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <SettingsPage />
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <footer className="mt-auto py-6 px-6 lg:px-8 border-t bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 ManifestWell. Mind-Body Wellness App.
            </p>
            <p className="text-sm text-muted-foreground">
              Made with ❤️ for your wellness journey
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
