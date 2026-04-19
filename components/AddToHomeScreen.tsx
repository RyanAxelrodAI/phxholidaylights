'use client'

import { useEffect, useState } from 'react'

type Platform = 'ios' | 'android' | null

export default function AddToHomeScreen() {
  const [platform, setPlatform] = useState<Platform>(null)
  const [visible, setVisible] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<Event & { prompt: () => void } | null>(null)

  useEffect(() => {
    // Don't show if already installed (running as standalone PWA)
    if (window.matchMedia('(display-mode: standalone)').matches) return

    // Don't show if user already dismissed
    if (localStorage.getItem('a2hs-dismissed')) return

    const ua = navigator.userAgent

    const isIOS = /iphone|ipad|ipod/i.test(ua) && !(window as unknown as Record<string, unknown>).MSStream
    const isAndroid = /android/i.test(ua)

    if (!isIOS && !isAndroid) return

    // Listen for Android install prompt
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as Event & { prompt: () => void })
    }
    window.addEventListener('beforeinstallprompt', handler)

    // Show after 3 seconds
    const timer = setTimeout(() => {
      setPlatform(isIOS ? 'ios' : 'android')
      setVisible(true)
    }, 3000)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  function dismiss() {
    localStorage.setItem('a2hs-dismissed', '1')
    setVisible(false)
  }

  async function installAndroid() {
    if (deferredPrompt) {
      deferredPrompt.prompt()
    }
    dismiss()
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 flex justify-center px-4 pb-6 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-sm bg-holiday-green-dark border border-holiday-green/50 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-holiday-green/20 border-b border-holiday-green/20">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎄</span>
            <span className="text-white font-semibold text-sm">Add to Home Screen</span>
          </div>
          <button
            onClick={dismiss}
            className="text-white/40 hover:text-white text-xl leading-none w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-4">
          <p className="text-white/70 text-sm mb-4">
            Get quick access to PHX Holiday Lights right from your home screen!
          </p>

          {platform === 'ios' && (
            <ol className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-holiday-green/30 text-holiday-green text-xs font-bold flex items-center justify-center mt-0.5">1</span>
                <span className="text-white/80 text-sm">
                  Tap the <span className="inline-flex items-center gap-1 text-white font-medium">Share <ShareIcon /></span> button at the bottom of Safari
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-holiday-green/30 text-holiday-green text-xs font-bold flex items-center justify-center mt-0.5">2</span>
                <span className="text-white/80 text-sm">
                  Scroll down and tap <span className="text-white font-medium">"Add to Home Screen"</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-holiday-green/30 text-holiday-green text-xs font-bold flex items-center justify-center mt-0.5">3</span>
                <span className="text-white/80 text-sm">
                  Tap <span className="text-white font-medium">"Add"</span> in the top right
                </span>
              </li>
            </ol>
          )}

          {platform === 'android' && (
            <div className="space-y-3">
              {deferredPrompt ? (
                <button
                  onClick={installAndroid}
                  className="w-full bg-holiday-green hover:bg-holiday-green-light text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                >
                  Install App
                </button>
              ) : (
                <ol className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-holiday-green/30 text-holiday-green text-xs font-bold flex items-center justify-center mt-0.5">1</span>
                    <span className="text-white/80 text-sm">
                      Tap the <span className="text-white font-medium">⋮ menu</span> in Chrome
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-holiday-green/30 text-holiday-green text-xs font-bold flex items-center justify-center mt-0.5">2</span>
                    <span className="text-white/80 text-sm">
                      Tap <span className="text-white font-medium">"Add to Home screen"</span>
                    </span>
                  </li>
                </ol>
              )}
            </div>
          )}

          <button
            onClick={dismiss}
            className="mt-4 w-full text-white/40 hover:text-white/70 text-xs transition-colors py-1"
          >
            Don't show again
          </button>
        </div>
      </div>
    </div>
  )
}

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="inline-block">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  )
}
