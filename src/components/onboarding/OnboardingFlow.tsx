'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Sparkles, Heart, Shield, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { initializeLocalUser } from '@/lib/auth/local-user'
import { setOnboardingComplete } from '@/lib/storage/preferences'
import { logger } from '@/lib/utils/logger'

interface OnboardingFlowProps {
  onComplete: () => void
}

type Step = 'welcome' | 'profile' | 'features' | 'security' | 'complete'

const STEPS: Step[] = ['welcome', 'profile', 'features', 'security', 'complete']

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<Step>('welcome')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const currentIndex = STEPS.indexOf(currentStep)
  const isFirstStep = currentIndex === 0
  const isLastStep = currentIndex === STEPS.length - 1

  const goNext = () => {
    if (!isLastStep) {
      setCurrentStep(STEPS[currentIndex + 1])
    }
  }

  const goBack = () => {
    if (!isFirstStep) {
      setCurrentStep(STEPS[currentIndex - 1])
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    try {
      // Initialize local user with profile
      await initializeLocalUser({ name: name || 'Wellness Seeker' })
      await setOnboardingComplete(true)
      onComplete()
    } catch (error) {
      logger.error('Failed to complete onboarding:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
        <CardContent className="p-6">
          {/* Progress indicator */}
          <div className="flex justify-center gap-2 mb-8">
            {STEPS.map((step, index) => (
              <div
                key={step}
                className={`h-1.5 w-8 rounded-full transition-colors ${
                  index <= currentIndex ? 'bg-violet-400' : 'bg-white/20'
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 'welcome' && <WelcomeStep />}
              {currentStep === 'profile' && (
                <ProfileStep name={name} setName={setName} />
              )}
              {currentStep === 'features' && <FeaturesStep />}
              {currentStep === 'security' && <SecurityStep />}
              {currentStep === 'complete' && <CompleteStep name={name} />}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="ghost"
              onClick={goBack}
              disabled={isFirstStep}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {isLastStep ? (
              <Button
                onClick={handleComplete}
                disabled={isLoading}
                className="bg-violet-500 hover:bg-violet-600 text-white"
              >
                {isLoading ? 'Setting up...' : 'Get Started'}
                <Check className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={goNext}
                className="bg-violet-500 hover:bg-violet-600 text-white"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function WelcomeStep() {
  return (
    <div className="text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
        <Sparkles className="w-10 h-10 text-white" />
      </div>
      <h1 className="text-2xl font-bold text-white mb-3">Welcome to ManifestWell</h1>
      <p className="text-violet-200/80">
        Your personal wellness companion for mindful living, healthy habits, and manifesting your best self.
      </p>
    </div>
  )
}

function ProfileStep({ name, setName }: { name: string; setName: (n: string) => void }) {
  return (
    <div className="text-center">
      <Heart className="w-12 h-12 mx-auto mb-4 text-pink-400" />
      <h2 className="text-xl font-bold text-white mb-2">What should we call you?</h2>
      <p className="text-violet-200/70 mb-6 text-sm">This helps personalize your experience</p>
      <div className="space-y-2">
        <Label htmlFor="name" className="text-white/80">Your Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
        />
      </div>
    </div>
  )
}

function FeaturesStep() {
  const features = [
    { icon: '🍽️', title: 'Meal Tracking', desc: 'Log meals and nutrition' },
    { icon: '🧘', title: 'Meditation', desc: 'Guided sessions for peace' },
    { icon: '✨', title: 'Manifestation', desc: 'Visualize your goals' },
    { icon: '📔', title: 'Journal', desc: 'Reflect on your journey' },
  ]

  return (
    <div className="text-center">
      <h2 className="text-xl font-bold text-white mb-6">Everything you need</h2>
      <div className="grid grid-cols-2 gap-3">
        {features.map((f) => (
          <div key={f.title} className="bg-white/5 rounded-lg p-3 text-left">
            <span className="text-2xl">{f.icon}</span>
            <h3 className="text-white font-medium text-sm mt-1">{f.title}</h3>
            <p className="text-violet-200/60 text-xs">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function SecurityStep() {
  return (
    <div className="text-center">
      <Shield className="w-12 h-12 mx-auto mb-4 text-emerald-400" />
      <h2 className="text-xl font-bold text-white mb-2">Your data stays private</h2>
      <p className="text-violet-200/70 mb-4 text-sm">
        ManifestWell is a local-first app. Your data never leaves your device.
      </p>
      <div className="space-y-2 text-left text-sm">
        <div className="flex items-center gap-2 text-violet-200/80">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>All data stored locally on device</span>
        </div>
        <div className="flex items-center gap-2 text-violet-200/80">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Optional PIN & biometric lock</span>
        </div>
        <div className="flex items-center gap-2 text-violet-200/80">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Export your data anytime</span>
        </div>
      </div>
    </div>
  )
}

function CompleteStep({ name }: { name: string }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
        <Check className="w-8 h-8 text-emerald-400" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">
        You&apos;re all set{name ? `, ${name}` : ''}!
      </h2>
      <p className="text-violet-200/70 text-sm">
        Start your wellness journey today. You can customize settings anytime.
      </p>
    </div>
  )
}

