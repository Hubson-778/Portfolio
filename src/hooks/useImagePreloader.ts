import { useEffect } from 'react'

/**
 * Preloads full-res images in priority order after first paint.
 * Uses requestIdleCallback so it never competes with the initial render.
 */
export function useImagePreloader(urls: string[]) {
  useEffect(() => {
    if (!urls.length) return

    let i = 0
    const schedule = 'requestIdleCallback' in window
      ? (cb: () => void) => (window as unknown as { requestIdleCallback: (cb: () => void, o: object) => void })
          .requestIdleCallback(cb, { timeout: 2000 })
      : (cb: () => void) => setTimeout(cb, 200)

    const loadNext = () => {
      if (i >= urls.length) return
      const img = new Image()
      img.decoding = 'async'
      img.src = urls[i++]
      img.onload = img.onerror = () => schedule(loadNext)
    }

    // Start after first paint settles
    schedule(loadNext)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
