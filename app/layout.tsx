import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PHX Holiday Lights',
  description: 'Discover the best holiday light displays around Phoenix, AZ. Submit new locations and give feedback on existing ones.',
  keywords: 'Phoenix holiday lights, Christmas lights Phoenix, AZ holiday displays',
  metadataBase: new URL('https://phxholidaylights.com'),
  openGraph: {
    title: 'PHX Holiday Lights',
    description: 'Find & share the best holiday light displays in Phoenix, AZ.',
    url: 'https://phxholidaylights.com',
    siteName: 'PHX Holiday Lights',
    locale: 'en_US',
    type: 'website',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'PHX Lights',
  },
  icons: {
    apple: '/icons/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a5c2a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-holiday-dark text-white antialiased">
        {children}
      </body>
    </html>
  )
}
