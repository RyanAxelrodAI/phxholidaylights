import type { Metadata, Viewport } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'PHX Holiday Lights — Christmas Light Displays in Phoenix, AZ',
    template: '%s | PHX Holiday Lights',
  },
  description:
    'Interactive map of the best Christmas and holiday light displays across Phoenix, Chandler, Gilbert, Mesa, Scottsdale, and the entire Valley. Submit new locations and share updates.',
  keywords: [
    'Phoenix holiday lights',
    'Christmas lights Phoenix',
    'Phoenix Christmas light map',
    'holiday lights Arizona',
    'Chandler Christmas lights',
    'Gilbert Christmas lights',
    'Scottsdale holiday lights',
    'Mesa Christmas lights',
    'AZ holiday displays',
  ],
  metadataBase: new URL('https://phxholidaylights.com'),
  alternates: {
    canonical: 'https://phxholidaylights.com',
  },
  openGraph: {
    title: 'PHX Holiday Lights — Christmas Light Displays in Phoenix, AZ',
    description:
      'Find & share the best holiday light displays across the Phoenix metro area.',
    url: 'https://phxholidaylights.com',
    siteName: 'PHX Holiday Lights',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PHX Holiday Lights',
    description:
      'Interactive map of the best Christmas light displays across the Phoenix metro area.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
      <GoogleAnalytics gaId="G-L5GFHJTTV7" />
    </html>
  )
}
