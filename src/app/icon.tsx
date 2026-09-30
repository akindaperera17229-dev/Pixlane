import { ImageResponse } from 'next/og'

export const sizes = [192, 512]
export const contentType = 'image/png'

export default function Icon({ params }: { params?: { size?: string } }) {
  const size = params?.size ? parseInt(params.size) : 192

  return new ImageResponse(
    (
      <div
        style={{
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FF7654 0%, #FFA387 100%)',
          borderRadius: size * 0.22,
        }}
      >
        <div
          style={{
            width: size * 0.55,
            height: size * 0.55,
            borderRadius: '50%',
            border: `${size * 0.07}px solid white`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: size * 0.28,
              height: size * 0.28,
              borderRadius: '50%',
              background: 'white',
              opacity: 0.95,
            }}
          />
        </div>
      </div>
    ),
    { width: size, height: size }
  )
}
