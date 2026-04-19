import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Phoenix Holiday Lights — map of the Valley\'s brightest displays'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'radial-gradient(ellipse at center, #1a5c2a 0%, #0a2614 75%, #050f08 100%)',
          color: 'white',
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 180, lineHeight: 1, marginBottom: 24 }}>🎄</div>
        <div
          style={{
            fontSize: 84,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            textAlign: 'center',
            padding: '0 60px',
          }}
        >
          Phoenix Holiday Lights
        </div>
        <div
          style={{
            fontSize: 34,
            marginTop: 18,
            color: 'rgba(255,255,255,0.78)',
            textAlign: 'center',
            padding: '0 80px',
          }}
        >
          Your map of the Valley's brightest displays
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 70,
            background: '#c41e3a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: '0.04em',
          }}
        >
          phxholidaylights.com
        </div>
      </div>
    ),
    { ...size }
  )
}
