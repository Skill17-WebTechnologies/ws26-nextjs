import { version as reactVersion } from 'react'
import Counter from './Counter'

export default function Home() {
  return (
    <main style={{ background: '#151c33', padding: '2.5rem 3rem', borderRadius: 16, boxShadow: '0 10px 40px rgba(0,0,0,.4)' }}>
      <h1>Next.js <span style={{ color: '#7c9cff' }}>16.1.6</span></h1>
      <p>WSC2026 Web Technologies — minimal Next.js app (App Router, React {reactVersion}).</p>
      <Counter />
    </main>
  )
}
