'use client'

import { useState, useEffect } from 'react'
import { User, Settings, Ruler, Weight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { UserProfile } from '@/types'

interface ProfileDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    profile: UserProfile | null
    onSave: (profile: UserProfile) => void
}

export function ProfileDialog({ open, onOpenChange, profile, onSave }: ProfileDialogProps) {
    const [formData, setFormData] = useState<UserProfile>({
        name: '',
        age: 30,
        height: 170, // cm
        weight: 70, // kg
        gender: 'male',
        activityLevel: 'moderate',
        goalWeight: 0,
        goalDate: undefined,
    })

    // Load profile when dialog opens
    useEffect(() => {
        if (profile) {
            setFormData(profile)
        }
    }, [profile, open])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // For now, assume metric. In a real app, we'd handle unit conversion here if the UI had toggles.
        onSave(formData)
        onOpenChange(false)
    }

    // Helper for simple changes
    const updateField = (field: keyof UserProfile, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <User className="w-5 h-5 text-purple-500" />
                        Your Wellness Profile
                    </DialogTitle>
                    <DialogDescription>
                        Help us personalize your experience and goals.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">

                    <div className="space-y-2">
                        <Label htmlFor="name">Display Name</Label>
                        <Input
                            id="name"
                            value={formData.name || ''}
                            onChange={(e) => updateField('name', e.target.value)}
                            placeholder="e.g. John Doe"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="age">Age</Label>
                            <Input
                                id="age"
                                type="number"
                                value={formData.age}
                                onChange={(e) => updateField('age', parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select
                                value={formData.gender}
                                onValueChange={(val: any) => updateField('gender', val)}
                            >
                                <SelectTrigger id="gender">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="height" className="flex items-center gap-1">
                                <Ruler className="w-4 h-4" /> Height (cm)
                            </Label>
                            <Input
                                id="height"
                                type="number"
                                value={formData.height}
                                onChange={(e) => updateField('height', parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="weight" className="flex items-center gap-1">
                                <Weight className="w-4 h-4" /> Weight (kg)
                            </Label>
                            <Input
                                id="weight"
                                type="number"
                                value={formData.weight}
                                onChange={(e) => updateField('weight', parseFloat(e.target.value) || 0)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="activity">Activity Level</Label>
                        <Select
                            value={formData.activityLevel}
                            onValueChange={(val: any) => updateField('activityLevel', val)}
                        >
                            <SelectTrigger id="activity">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sedentary">Sedentary (Little or no exercise)</SelectItem>
                                <SelectItem value="light">Light (Exercise 1-3 times/week)</SelectItem>
                                <SelectItem value="moderate">Moderate (Exercise 3-5 times/week)</SelectItem>
                                <SelectItem value="active">Active (Daily exercise)</SelectItem>
                                <SelectItem value="very_active">Very Active (Intense exercise/physical job)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="pt-4 border-t">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Settings className="w-4 h-4" /> Goals
                        </h4>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="goalWeight">Goal Weight (kg)</Label>
                                <Input
                                    id="goalWeight"
                                    type="number"
                                    placeholder="Optional"
                                    value={formData.goalWeight || ''}
                                    onChange={(e) => updateField('goalWeight', parseFloat(e.target.value) || 0)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="goalDate">Target Date</Label>
                                <Input
                                    id="goalDate"
                                    type="date"
                                    value={formData.goalDate ? new Date(formData.goalDate).toISOString().split('T')[0] : ''}
                                    onChange={(e) => updateField('goalDate', e.target.value ? new Date(e.target.value) : undefined)}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" className="bg-gradient-to-r from-purple-600 to-orange-600">Save Profile</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
