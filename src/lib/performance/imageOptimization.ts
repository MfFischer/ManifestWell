/**
 * Image Optimization Utilities
 * Helpers for lazy loading images and optimizing performance
 */

/**
 * Lazy load images using Intersection Observer
 *
 * @example
 * ```typescript
 * useEffect(() => {
 *   lazyLoadImages('.lazy-image')
 * }, [])
 * ```
 */
export function lazyLoadImages(selector: string = '[data-lazy]'): () => void {
  if (typeof window === 'undefined') {
    return () => {}
  }

  const images = document.querySelectorAll<HTMLImageElement>(selector)

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            const src = img.dataset.src
            const srcset = img.dataset.srcset

            if (src) {
              img.src = src
            }
            if (srcset) {
              img.srcset = srcset
            }

            img.classList.remove('lazy')
            observer.unobserve(img)
          }
        })
      },
      {
        rootMargin: '50px 0px', // Start loading 50px before entering viewport
        threshold: 0.01
      }
    )

    images.forEach((img) => imageObserver.observe(img))

    // Cleanup function
    return () => {
      images.forEach((img) => imageObserver.unobserve(img))
    }
  } else {
    // Fallback for browsers without IntersectionObserver
    images.forEach((img) => {
      const src = img.dataset.src
      const srcset = img.dataset.srcset

      if (src) {
        img.src = src
      }
      if (srcset) {
        img.srcset = srcset
      }
    })

    return () => {}
  }
}

/**
 * Preload critical images
 *
 * @param urls - Array of image URLs to preload
 *
 * @example
 * ```typescript
 * preloadImages(['/hero.jpg', '/logo.png'])
 * ```
 */
export function preloadImages(urls: string[]): Promise<void[]> {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise<void>((resolve, reject) => {
          const img = new Image()
          img.onload = () => resolve()
          img.onerror = reject
          img.src = url
        })
    )
  )
}

/**
 * Generate responsive image srcset
 *
 * @param baseUrl - Base image URL
 * @param widths - Array of widths to generate
 * @returns srcset string
 *
 * @example
 * ```typescript
 * const srcset = generateSrcSet('/images/photo.jpg', [320, 640, 960, 1280])
 * // Returns: "/images/photo.jpg?w=320 320w, /images/photo.jpg?w=640 640w, ..."
 * ```
 */
export function generateSrcSet(baseUrl: string, widths: number[]): string {
  return widths.map((width) => `${baseUrl}?w=${width} ${width}w`).join(', ')
}

/**
 * Check if WebP is supported
 *
 * @returns Promise resolving to true if WebP is supported
 *
 * @example
 * ```typescript
 * const supportsWebP = await checkWebPSupport()
 * const imageUrl = supportsWebP ? 'image.webp' : 'image.jpg'
 * ```
 */
export function checkWebPSupport(): Promise<boolean> {
  if (typeof window === 'undefined') {
    return Promise.resolve(false)
  }

  return new Promise((resolve) => {
    const webP = new Image()
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2)
    }
    webP.src =
      'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
  })
}

/**
 * Get optimal image format based on browser support
 *
 * @returns 'webp', 'avif', or 'jpg'
 *
 * @example
 * ```typescript
 * const format = await getOptimalImageFormat()
 * const imageUrl = `/image.${format}`
 * ```
 */
export async function getOptimalImageFormat(): Promise<'avif' | 'webp' | 'jpg'> {
  if (typeof window === 'undefined') {
    return 'jpg'
  }

  // Check AVIF support
  try {
    const avifSupported = await new Promise<boolean>((resolve) => {
      const avif = new Image()
      avif.onload = () => resolve(avif.height === 2)
      avif.onerror = () => resolve(false)
      avif.src =
        'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A='
    })
    if (avifSupported) return 'avif'
  } catch {}

  // Check WebP support
  const webpSupported = await checkWebPSupport()
  if (webpSupported) return 'webp'

  return 'jpg'
}

/**
 * Debounce scroll events for image loading
 *
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>

  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), delay)
  }
}
