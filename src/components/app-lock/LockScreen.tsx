'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Fingerprint, AlertCircle, Sparkles, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import {
  verifyPin,
  unlockWithBiometric,
  isLockedOut,
  getLockoutRemaining,
  formatLockoutRemaining,
  type AppLockConfig
} from '@/lib/auth/app-lock-client'
import { getFailedAttempts } from '@/lib/auth/pin-security'
import { checkBiometricAvailability, getBiometryTypeName } from '@/lib/auth/biometric'
import { BiometryType } from '@aparajita/capacitor-biometric-auth'

interface LockScreenProps {
  config: AppLockConfig
  onUnlock: () => void
}

export function LockScreen({ config, onUnlock }: LockScreenProps) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [biometryType, setBiometryType] = useState<BiometryType>(BiometryType.none)
  const [attempts, setAttempts] = useState(0)
  const [lockoutRemaining, setLockoutRemaining] = useState<number | null>(null)

  // Check lockout status and update countdown
  useEffect(() => {
    // Initial check
    setAttempts(getFailedAttempts())

    const checkLockout = () => {
      const remaining = getLockoutRemaining()
      setLockoutRemaining(remaining)
      return remaining
    }

    checkLockout()

    // Update countdown every second if locked out
    const interval = setInterval(() => {
      const remaining = checkLockout()
      if (remaining === null) {
        // No longer locked out, clear error
        setError(null)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Check biometric availability on mount
  useEffect(() => {
    if (config.biometricEnabled) {
      checkBiometricAvailability().then(result => {
        if (result.isAvailable) {
          setBiometryType(result.biometryType)
          // Auto-trigger biometric on mount (only if not locked out)
          if (!isLockedOut()) {
            handleBiometricUnlock()
          }
        }
      })
    }
  }, [config.biometricEnabled])

  const handlePinComplete = useCallback(async (value: string) => {
    if (value.length !== 4) return

    // Check lockout before attempting
    if (isLockedOut()) {
      const remaining = getLockoutRemaining()
      setLockoutRemaining(remaining)
      setError(`Too many attempts. Try again in ${formatLockoutRemaining(remaining!)}`)
      setPin('')
      return
    }

    setIsVerifying(true)
    setError(null)

    try {
      const isValid = await verifyPin(value)
      if (isValid) {
        onUnlock()
      } else {
        const newAttempts = getFailedAttempts()
        setAttempts(newAttempts)

        // Check if now locked out
        const remaining = getLockoutRemaining()
        if (remaining) {
          setLockoutRemaining(remaining)
          setError(`Too many attempts. Try again in ${formatLockoutRemaining(remaining)}`)
        } else {
          setError('Incorrect PIN')
        }

        setPin('')

        // Vibrate on error (mobile)
        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100])
        }
      }
    } catch (err) {
      // Handle lockout error from verifyPin
      if (err instanceof Error && err.message.includes('Too many attempts')) {
        setError(err.message)
        setLockoutRemaining(getLockoutRemaining())
      } else {
        setError('Verification failed')
      }
      setPin('')
    } finally {
      setIsVerifying(false)
    }
  }, [onUnlock])

  const handleBiometricUnlock = async () => {
    // Biometric bypasses PIN lockout (it's a separate auth method)
    setIsVerifying(true)
    setError(null)

    try {
      const success = await unlockWithBiometric()
      if (success) {
        onUnlock()
      } else {
        setError('Biometric authentication failed')
      }
    } catch {
      setError('Biometric not available')
    } finally {
      setIsVerifying(false)
    }
  }

  const isLocked = lockoutRemaining !== null && lockoutRemaining > 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 max-w-sm w-full">
        {/* Logo/Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-violet-500/30">
            {isLocked ? (
              <Clock className="w-10 h-10 text-white" />
            ) : (
              <Sparkles className="w-10 h-10 text-white" />
            )}
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          {isLocked ? (
            <>
              <h1 className="text-2xl font-bold text-white mb-2">Temporarily Locked</h1>
              <p className="text-violet-200/70">Too many failed attempts</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-violet-200/70">Enter your PIN to unlock</p>
            </>
          )}
        </motion.div>

        {/* Lockout countdown */}
        {isLocked && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8 p-4 bg-red-500/20 rounded-xl border border-red-500/30"
          >
            <div className="text-center">
              <p className="text-red-300 text-sm mb-1">Try again in</p>
              <p className="text-2xl font-bold text-white">
                {formatLockoutRemaining(lockoutRemaining)}
              </p>
            </div>
          </motion.div>
        )}

        {/* PIN Input */}
        {config.pinEnabled && !isLocked && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <InputOTP
              maxLength={4}
              value={pin}
              onChange={setPin}
              onComplete={handlePinComplete}
              disabled={isVerifying || isLocked}
            >
              <InputOTPGroup className="gap-3">
                {[0, 1, 2, 3].map(index => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="w-14 h-14 text-xl bg-white/10 border-white/20 text-white rounded-xl"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </motion.div>
        )}

        {/* Error message */}
        <AnimatePresence>
          {error && !isLocked && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 text-red-400 mb-4"
            >
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Biometric button - always available even when PIN is locked */}
        {config.biometricEnabled && biometryType !== BiometryType.none && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              variant="ghost"
              size="lg"
              onClick={handleBiometricUnlock}
              disabled={isVerifying}
              className="text-violet-200 hover:text-white hover:bg-white/10"
            >
              <Fingerprint className="w-6 h-6 mr-2" />
              Use {getBiometryTypeName(biometryType)}
            </Button>
          </motion.div>
        )}

        {/* Failed attempts warning (before lockout) */}
        {attempts >= 2 && attempts < 3 && !isLocked && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-amber-400/80 text-sm mt-4 text-center"
          >
            {3 - attempts} attempt{3 - attempts !== 1 ? 's' : ''} remaining before temporary lockout
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}
