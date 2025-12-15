'use client'

import { useState, useRef, useEffect } from 'react'
import { Utensils, Plus, Trash2, Edit2, Flame, Search, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { MealType, Meal } from '@/types'
import { useFoodSearch } from '@/lib/hooks/useFoodSearch'
import type { FoodSearchResult } from '@/lib/food-api/types'

interface NutritionTrackerProps {
  meals?: Meal[]
  setMeals?: (meals: Meal[]) => void
}

export function NutritionTracker({ meals = [], setMeals = () => { } }: NutritionTrackerProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'breakfast' as MealType,
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    notes: '',
  })

  // Food search state
  const [foodSearchQuery, setFoodSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Use food search hook
  const { data: searchResults, isLoading: isSearching } = useFoodSearch(foodSearchQuery, {
    debounceMs: 300,
    limit: 15
  })

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
    { value: 'lunch', label: 'Lunch', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
    { value: 'dinner', label: 'Dinner', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
    { value: 'snack', label: 'Snack', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  ]

  const todayCalories = meals.reduce((sum, meal) => sum + meal.calories, 0)
  const dailyGoal = 2000
  const progress = (todayCalories / dailyGoal) * 100

  const handleFoodSelect = (food: FoodSearchResult) => {
    setFormData(prev => ({
      ...prev,
      name: food.description,
      calories: food.nutrients.calories.toString(),
      protein: food.nutrients.protein.toString(),
      carbs: food.nutrients.carbs.toString(),
      fat: food.nutrients.fat.toString(),
    }))
    setFoodSearchQuery('')
    setShowSuggestions(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const mealData: Meal = {
      id: editingMeal?.id || Date.now().toString(),
      userId: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      name: formData.name,
      type: formData.type,
      calories: parseInt(formData.calories) || 0,
      protein: formData.protein ? parseFloat(formData.protein) : undefined,
      carbs: formData.carbs ? parseFloat(formData.carbs) : undefined,
      fat: formData.fat ? parseFloat(formData.fat) : undefined,
      notes: formData.notes || undefined,
      date: new Date(),
    }

    if (editingMeal) {
      setMeals(meals.map(m => m.id === editingMeal.id ? mealData : m))
    } else {
      setMeals([...meals, mealData])
    }

    resetForm()
    setDialogOpen(false)
  }

  const handleEdit = (meal: Meal) => {
    setEditingMeal(meal)
    setFormData({
      name: meal.name,
      type: meal.type,
      calories: meal.calories.toString(),
      protein: meal.protein?.toString() || '',
      carbs: meal.carbs?.toString() || '',
      fat: meal.fat?.toString() || '',
      notes: meal.notes || '',
    })
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setMeals(meals.filter(m => m.id !== id))
  }

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'breakfast',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      notes: '',
    })
    setEditingMeal(null)
    setFoodSearchQuery('')
  }

  const getMealTypeInfo = (type: string) => {
    return mealTypes.find(t => t.value === type) || mealTypes[0]
  }

  const totalMacros = meals.reduce(
    (acc, meal) => ({
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fat: acc.fat + (meal.fat || 0),
    }),
    { protein: 0, carbs: 0, fat: 0 }
  )

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'usda':
        return <Badge variant="outline" className="text-xs ml-2">USDA</Badge>
      case 'nutritionix':
        return <Badge variant="outline" className="text-xs ml-2">Nutritionix</Badge>
      default:
        return <Badge variant="outline" className="text-xs ml-2">Local</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Nutrition Tracking</h2>
          <p className="text-muted-foreground">Log your meals and track your calorie intake</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Add Meal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingMeal ? 'Edit Meal' : 'Add New Meal'}
              </DialogTitle>
              <DialogDescription>
                Search for foods or enter nutrition info manually
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Food Search */}
              {!editingMeal && (
                <div className="space-y-2">
                  <Label>Search Foods</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      ref={searchInputRef}
                      placeholder="Search for foods (e.g., chicken breast, apple)..."
                      value={foodSearchQuery}
                      onChange={(e) => {
                        setFoodSearchQuery(e.target.value)
                        setShowSuggestions(true)
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      className="pl-10 pr-10"
                    />
                    {foodSearchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setFoodSearchQuery('')
                          setShowSuggestions(false)
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      </button>
                    )}

                    {/* Search Results Dropdown */}
                    {showSuggestions && (foodSearchQuery.length >= 2 || searchResults.length > 0) && (
                      <div
                        ref={suggestionsRef}
                        className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-64 overflow-y-auto"
                      >
                        {isSearching ? (
                          <div className="flex items-center justify-center py-4">
                            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                            <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
                          </div>
                        ) : searchResults.length > 0 ? (
                          <ul className="py-1">
                            {searchResults.map((food, index) => (
                              <li key={`${food.fdcId}-${index}`}>
                                <button
                                  type="button"
                                  onClick={() => handleFoodSelect(food)}
                                  className="w-full px-3 py-2 text-left hover:bg-muted transition-colors flex items-start justify-between"
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm truncate flex items-center">
                                      {food.description}
                                      {getSourceBadge(food.source)}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-0.5">
                                      {food.nutrients.calories} cal • P: {food.nutrients.protein}g • C: {food.nutrients.carbs}g • F: {food.nutrients.fat}g
                                    </div>
                                    {food.brandName && (
                                      <div className="text-xs text-muted-foreground">
                                        {food.brandName}
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
                                    {food.servingSize} {food.servingUnit}
                                  </div>
                                </button>
                              </li>
                            ))}
                          </ul>
                        ) : foodSearchQuery.length >= 2 ? (
                          <div className="py-4 text-center text-sm text-muted-foreground">
                            No foods found. Try a different search term.
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Search includes USDA database with 300K+ foods
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Meal Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Grilled Chicken Salad"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Meal Type *</Label>
                <Select value={formData.type} onValueChange={(value: MealType) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mealTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="calories">Calories *</Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="0"
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={formData.protein}
                    onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={formData.carbs}
                    onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fat">Fat (g)</Label>
                  <Input
                    id="fat"
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={formData.fat}
                    onChange={(e) => setFormData({ ...formData, fat: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about your meal..."
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
                <Button type="submit">{editingMeal ? 'Update' : 'Add'} Meal</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Daily Summary Card */}
      <Card className="border-2 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            Today's Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Calories</p>
              <p className="text-2xl font-bold">
                {todayCalories} <span className="text-sm text-muted-foreground">/ {dailyGoal}</span>
              </p>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-2">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${progress > 100 ? 'bg-red-500' : 'bg-gradient-to-r from-orange-500 to-red-500'
                    }`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Protein</p>
              <p className="text-2xl font-bold">{totalMacros.protein.toFixed(1)}g</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Carbs</p>
              <p className="text-2xl font-bold">{totalMacros.carbs.toFixed(1)}g</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fat</p>
              <p className="text-2xl font-bold">{totalMacros.fat.toFixed(1)}g</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meals List */}
      {meals.length === 0 ? (
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Today's Meals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Utensils className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No meals logged yet today</p>
              <p className="text-sm text-muted-foreground mt-2">Click "Add Meal" to start tracking your nutrition</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Today's Meals</h3>
          {meals.map((meal) => {
            const mealType = getMealTypeInfo(meal.type)
            return (
              <Card key={meal.id} className="border-2 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={mealType.color}>{mealType.label}</Badge>
                        <h4 className="font-semibold">{meal.name}</h4>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Flame className="w-4 h-4" />
                          {meal.calories} calories
                        </span>
                        {meal.protein && <span>P: {meal.protein}g</span>}
                        {meal.carbs && <span>C: {meal.carbs}g</span>}
                        {meal.fat && <span>F: {meal.fat}g</span>}
                      </div>
                      {meal.notes && (
                        <p className="text-sm text-muted-foreground mt-2 italic">{meal.notes}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(meal)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(meal.id)}
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
