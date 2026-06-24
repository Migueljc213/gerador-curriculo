import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: '#4f46e5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* document body */}
        <div
          style={{
            width: 16,
            height: 20,
            background: 'white',
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            padding: '4px 3px 3px 3px',
            gap: 2,
            position: 'relative',
          }}
        >
          {/* fold corner */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 5,
              height: 5,
              background: '#4f46e5',
              borderBottomLeftRadius: 2,
            }}
          />
          {/* lines */}
          <div style={{ width: 8, height: 1.5, background: '#4f46e5', borderRadius: 1, marginTop: 1 }} />
          <div style={{ width: 10, height: 1.5, background: '#c7d2fe', borderRadius: 1 }} />
          <div style={{ width: 10, height: 1.5, background: '#c7d2fe', borderRadius: 1 }} />
          <div style={{ width: 7, height: 1.5, background: '#c7d2fe', borderRadius: 1 }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
