/**
 * Platform detection hook
 * Detects device type and platform for adaptive UI
 */

import { useState, useEffect } from 'react'

export interface PlatformInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isIOS: boolean
  isAndroid: boolean
  isWeb: boolean
  isTouchDevice: boolean
  screenWidth: number
  screenHeight: number
}

/**
 * Hook to detect current platform and device type
 *
 * @returns Platform information object
 *
 * @example
 * ```typescript
 * const platform = usePlatform()
 *
 * if (platform.isMobile) {
 *   return <MobileTabBar />
 * }
 * return <DesktopSidebar />
 * ```
 */
export function usePlatform(): PlatformInfo {
  const [platform, setPlatform] = useState<PlatformInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isIOS: false,
    isAndroid: false,
    isWeb: true,
    isTouchDevice: false,
    screenWidth: 1920,
    screenHeight: 1080
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const detectPlatform = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || ''
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight

      // Detect iOS
      const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream

      // Detect Android
      const isAndroid = /android/i.test(userAgent)

      // Detect touch device
      const isTouchDevice =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0

      // Detect mobile (screen width based)
      const isMobile = screenWidth < 768

      // Detect tablet
      const isTablet = screenWidth >= 768 && screenWidth < 1024 && isTouchDevice

      // Detect desktop
      const isDesktop = screenWidth >= 1024

      // Check if running in Capacitor
      const isCapacitor = !!(window as any).Capacitor

      setPlatform({
        isMobile,
        isTablet,
        isDesktop,
        isIOS,
        isAndroid,
        isWeb: !isCapacitor,
        isTouchDevice,
        screenWidth,
        screenHeight
      })
    }

    detectPlatform()

    // Re-detect on resize
    window.addEventListener('resize', detectPlatform)
    return () => window.removeEventListener('resize', detectPlatform)
  }, [])

  return platform
}

/**
 * Hook to check if currently on mobile device
 *
 * @returns True if mobile device
 *
 * @example
 * ```typescript
 * const isMobile = useIsMobile()
 * return isMobile ? <MobileView /> : <DesktopView />
 * ```
 */
export function useIsMobile(): boolean {
  const platform = usePlatform()
  return platform.isMobile
}

/**
 * Hook to check if device has touch capability
 *
 * @returns True if touch device
 */
export function useIsTouchDevice(): boolean {
  const platform = usePlatform()
  return platform.isTouchDevice
}

/**
 * Hook to get current screen dimensions
 *
 * @returns Screen width and height
 *
 * @example
 * ```typescript
 * const { width, height } = useScreenSize()
 * ```
 */
export function useScreenSize(): { width: number; height: number } {
  const platform = usePlatform()
  return {
    width: platform.screenWidth,
    height: platform.screenHeight
  }
}
