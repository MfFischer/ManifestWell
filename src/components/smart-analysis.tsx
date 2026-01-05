'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Brain, Scale, Activity, Calculator, AlertCircle, ArrowRight } from 'lucide-react'
import { UserProfile, Meal, Workout } from '@/types'
import { differenceInDays, addWeeks, format } from 'date-fns'

interface SmartAnalysisProps {
    profile: UserProfile | null
    onOpenProfile: () => void
    meals: Meal[]
    workouts: Workout[] // You'll need to update types to export Workout, or just inline it if it's local
}

export function SmartAnalysis({ profile, onOpenProfile, meals: _meals, workouts: _workouts }: SmartAnalysisProps) {
    if (!profile) {
        return (
            <Card className="border-2 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <Brain className="w-16 h-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Profile Found</h3>
                    <p className="text-muted-foreground mb-6 max-w-md">
                        To generate smart insights and tracking, we need to know a bit more about you.
                    </p>
                    <Button onClick={onOpenProfile} size="lg" className="bg-gradient-to-r from-purple-600 to-orange-600">
                        Set Up Your Profile
                    </Button>
                </CardContent>
            </Card>
        )
    }

    // --- CALCULATIONS ---

    // BMI
    const heightM = profile.height / 100
    const bmi = profile.weight / (heightM * heightM)

    let bmiCategory = ''
    let bmiColor = ''
    if (bmi < 18.5) { bmiCategory = 'Underweight'; bmiColor = 'text-blue-500 bg-blue-100 dark:bg-blue-900/30'; }
    else if (bmi < 25) { bmiCategory = 'Healthy Weight'; bmiColor = 'text-green-500 bg-green-100 dark:bg-green-900/30'; }
    else if (bmi < 30) { bmiCategory = 'Overweight'; bmiColor = 'text-orange-500 bg-orange-100 dark:bg-orange-900/30'; }
    else { bmiCategory = 'Obese'; bmiColor = 'text-red-500 bg-red-100 dark:bg-red-900/30'; }

    // BMR (Mifflin-St Jeor Equation)
    let bmr = 0
    if (profile.gender === 'male') {
        bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5
    } else {
        bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161
    }

    // TDEE
    const activityMultipliers: Record<string, number> = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9,
    }
    const tdee = Math.round(bmr * (activityMultipliers[profile.activityLevel] || 1.2))

    // Goal Analysis
    let goalInsight = ''
    let caloriesToGoal = 0
    let projectedWeeks = 0

    if (profile.goalWeight) {
        const weightDiff = profile.weight - profile.goalWeight
        const isWeightLoss = weightDiff > 0

        // 7700 calories approx 1kg fat
        const totalCalorieDiff = Math.abs(weightDiff) * 7700

        if (profile.goalDate) {
            const daysUntilGoal = Math.max(1, differenceInDays(new Date(profile.goalDate), new Date()))
            const dailyDeficit = Math.round(totalCalorieDiff / daysUntilGoal)

            caloriesToGoal = isWeightLoss ? (tdee - dailyDeficit) : (tdee + dailyDeficit)

            // Safety checks
            if (isWeightLoss && caloriesToGoal < 1200) {
                goalInsight = "⚠️ Your deadline is very aggressive. Less than 1200 calories/day is not recommended safely without medical supervision."
            } else if (!isWeightLoss && caloriesToGoal > 4000) {
                goalInsight = "⚠️ Your deadline requires a very high calorie surplus. Consider extending the date."
            } else {
                goalInsight = isWeightLoss
                    ? `To reach ${profile.goalWeight}kg by ${format(new Date(profile.goalDate), 'MMM d')}, aim for ~${caloriesToGoal} calories/day.`
                    : `To reach ${profile.goalWeight}kg by ${format(new Date(profile.goalDate), 'MMM d')}, aim for ~${caloriesToGoal} calories/day.`
            }

        } else {
            // Projection mode (if no date set, assume safe rate of 0.5kg/week)
            // 0.5kg = 3850 cal deficit/week = 550 cal/day
            const safeRate = 0.5
            projectedWeeks = Math.ceil(Math.abs(weightDiff) / safeRate)
            const deficit = 550

            caloriesToGoal = isWeightLoss ? tdee - deficit : tdee + deficit

            const projectedDate = addWeeks(new Date(), projectedWeeks)
            goalInsight = `At a safe pace of 0.5kg/week, you could reach your goal by ${format(projectedDate, 'MMM d, yyyy')}. Target: ${caloriesToGoal} cal/day.`
        }
    }

    // Today's Data
    // const todayCalories = meals.reduce((sum, m) => sum + m.calories, 0)
    //   const todayBurned = workouts.reduce((sum, w) => sum + (w.calories || 0), 0)

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">

                {/* BMI Card */}
                <Card className="flex-1 border-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Scale className="w-5 h-5" /> BMI Analysis
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-center">
                            <span className="text-4xl font-bold">{bmi.toFixed(1)}</span>
                            <p className="text-sm text-muted-foreground mt-1">Body Mass Index</p>
                        </div>
                        <div className="flex justify-center">
                            <Badge className={`${bmiColor} px-3 py-1 text-base`}>
                                {bmiCategory}
                            </Badge>
                        </div>
                        <Progress value={(bmi / 40) * 100} className="h-2" />
                        <p className="text-xs text-muted-foreground text-center">
                            Normal range is 18.5 - 24.9
                        </p>
                    </CardContent>
                </Card>

                {/* Metabolism Card */}
                <Card className="flex-1 border-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Activity className="w-5 h-5" /> Metabolic Rate
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center border-b pb-2">
                            <span className="text-muted-foreground">BMR (Resting)</span>
                            <span className="font-mono font-bold">{Math.round(bmr)} cal</span>
                        </div>
                        <div className="flex justify-between items-center border-b pb-2">
                            <span className="text-muted-foreground">TDEE (Daily Burn)</span>
                            <span className="font-mono font-bold text-green-600">{tdee} cal</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Your TDEE is how many calories you burn in a day including activity. Eat below this to lose weight.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* AI Goal Projector */}
            {profile.goalWeight ? (
                <Card className="border-2 border-purple-200 dark:border-purple-900 bg-gradient-to-br from-purple-50 to-white dark:from-slate-900 dark:to-slate-950">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Brain className="w-6 h-6 text-purple-600" />
                            Smart Goal Projection
                        </CardTitle>
                        <CardDescription>AI-powered tailored advice for your journey</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-start gap-4 p-4 bg-white dark:bg-slate-900 rounded-lg shadow-sm border">
                            <Calculator className="w-8 h-8 text-blue-500 mt-1" />
                            <div>
                                <h4 className="font-semibold text-lg mb-1">Daily Calorie Target</h4>
                                <p className="text-muted-foreground text-sm mb-3">
                                    Based on your meta-analysis, here is your recommended intake:
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-blue-600">{caloriesToGoal}</span>
                                    <span className="text-sm font-medium text-muted-foreground">kcal / day</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-white dark:bg-slate-900 rounded-lg shadow-sm border">
                            <AlertCircle className="w-8 h-8 text-orange-500 mt-1" />
                            <div>
                                <h4 className="font-semibold text-lg mb-1">Analysis & Insights</h4>
                                <p className="text-sm text-foreground/80 leading-relaxed">
                                    {goalInsight}
                                </p>
                            </div>
                        </div>

                        {/* Progress Status */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">Current Goal Progress</span>
                                <span className="text-muted-foreground">
                                    {profile.weight}kg <ArrowRight className="w-4 h-4 inline mx-1" /> {profile.goalWeight}kg
                                </span>
                            </div>
                            {/* Simple visual of current vs goal, not a real progress percentage since start weight isnt stored in profile yet */}
                            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-1/2 animate-pulse" />
                            </div>
                            <p className="text-xs text-muted-foreground text-center">
                                Keep logging your weight to track precision progress.
                            </p>
                        </div>

                    </CardContent>
                </Card>
            ) : (
                <Card className="border-2">
                    <CardContent className="flex flex-col items-center justify-center py-8">
                        <p className="text-muted-foreground mb-4">Set a goal weight in your profile to unlock AI projections.</p>
                        <Button variant="outline" onClick={onOpenProfile}>Add Goal</Button>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
