import './globals.css'

export const metadata = { title: 'WSC2026 · Next.js 16.1.6' }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
