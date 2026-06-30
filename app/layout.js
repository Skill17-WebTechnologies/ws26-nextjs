export const metadata = { title: 'WSC2026 · Next.js 16.1.6' }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0, minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0b1020', color: '#e7ecff' }}>
        {children}
      </body>
    </html>
  )
}
