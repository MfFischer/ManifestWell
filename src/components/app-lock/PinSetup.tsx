'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Fingerprint, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { setupPin, removePin, enableBiometric, disableBiometric, type AppLockConfig } from '@/lib/auth/app-lock-client'
import { checkBiometricAvailability, getBiometryTypeName } from '@/lib/auth/biometric'
import { BiometryType } from '@aparajita/capacitor-biometric-auth'
import { toast } from 'sonner'

interface PinSetupProps {
  config: AppLockConfig
  onConfigChange: () => void
}

type SetupStep = 'idle' | 'enter' | 'confirm'

export function PinSetup({ config, onConfigChange }: PinSetupProps) {
  const [step, setStep] = useState<SetupStep>('idle')
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [biometryType, setBiometryType] = useState<BiometryType>(BiometryType.none)

  // Check biometric availability
  useState(() => {
    checkBiometricAvailability().then(result => {
      if (result.isAvailable) {
        setBiometryType(result.biometryType)
      }
    })
  })

  const handlePinComplete = async (value: string) => {
    if (step === 'enter') {
      setPin(value)
      setStep('confirm')
      setConfirmPin('')
    } else if (step === 'confirm') {
      if (value === pin) {
        setIsLoading(true)
        try {
          await setupPin(value)
          toast.success('PIN set successfully')
          onConfigChange()
          resetSetup()
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to set PIN')
        } finally {
          setIsLoading(false)
        }
      } else {
        setError('PINs do not match')
        setConfirmPin('')
      }
    }
  }

  const handleRemovePin = async () => {
    setIsLoading(true)
    try {
      await removePin()
      toast.success('PIN removed')
      onConfigChange()
    } catch {
      toast.error('Failed to remove PIN')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBiometricToggle = async (enabled: boolean) => {
    setIsLoading(true)
    try {
      if (enabled) {
        await enableBiometric()
        toast.success('Biometric unlock enabled')
      } else {
        await disableBiometric()
        toast.success('Biometric unlock disabled')
      }
      onConfigChange()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update biometric setting')
    } finally {
      setIsLoading(false)
    }
  }

  const resetSetup = () => {
    setStep('idle')
    setPin('')
    setConfirmPin('')
    setError(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          App Lock
        </CardTitle>
        <CardDescription>
          Protect your wellness data with PIN or biometric authentication
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* PIN Setup */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label>PIN Lock</Label>
                <p className="text-sm text-muted-foreground">
                  {config.pinEnabled ? 'PIN is set' : 'Set a 4-digit PIN'}
                </p>
              </div>
            </div>
            {config.pinEnabled ? (
              <Button variant="outline" size="sm" onClick={handleRemovePin} disabled={isLoading}>
                Remove PIN
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setStep('enter')} disabled={isLoading}>
                Set PIN
              </Button>
            )}
          </div>

          {/* PIN Entry UI */}
          <AnimatePresence>
            {step !== 'idle' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 pb-2 flex flex-col items-center gap-4 bg-muted/50 rounded-lg p-4">
                  <p className="text-sm font-medium">
                    {step === 'enter' ? 'Enter new PIN' : 'Confirm PIN'}
                  </p>
                  <InputOTP
                    maxLength={4}
                    value={step === 'enter' ? pin : confirmPin}
                    onChange={step === 'enter' ? setPin : setConfirmPin}
                    onComplete={handlePinComplete}
                    disabled={isLoading}
                  >
                    <InputOTPGroup className="gap-2">
                      {[0, 1, 2, 3].map(i => (
                        <InputOTPSlot key={i} index={i} className="w-12 h-12" />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button variant="ghost" size="sm" onClick={resetSetup}>
                    Cancel
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Biometric Toggle */}
        {biometryType !== BiometryType.none && (
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-3">
              <Fingerprint className="w-5 h-5 text-muted-foreground" />
              <div>
                <Label>{getBiometryTypeName(biometryType)}</Label>
                <p className="text-sm text-muted-foreground">
                  Unlock with {getBiometryTypeName(biometryType).toLowerCase()}
                </p>
              </div>
            </div>
            <Switch
              checked={config.biometricEnabled}
              onCheckedChange={handleBiometricToggle}
              disabled={isLoading || !config.pinEnabled}
            />
          </div>
        )}

        {/* Info text */}
        {!config.pinEnabled && biometryType !== BiometryType.none && (
          <p className="text-xs text-muted-foreground">
            Set a PIN first to enable biometric unlock as a backup.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

