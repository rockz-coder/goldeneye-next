'use client'
import React, { useCallback, useEffect, useState } from 'react'

type Info = { production: boolean; counts: Record<string, number> }

export default function DemoDataView() {
  const [info, setInfo] = useState<Info | null>(null)
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    const r = await fetch('/api/demo-data', { credentials: 'include' })
    if (r.ok) setInfo(await r.json())
    else setMsg('Only super-admin can use this page.')
  }, [])
  useEffect(() => { void load() }, [load])

  const run = async (reset: boolean) => {
    if (reset && !window.confirm('This deletes ALL projects, listings, news, FAQs, testimonials, stats, media and leads, then loads the demo data. Users and customers are kept. Continue?')) return
    setBusy(true); setMsg('Working… this can take a minute.')
    try {
      const r = await fetch('/api/demo-data', { method: 'POST', credentials: 'include', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ reset }) })
      const j = await r.json()
      setMsg(!r.ok ? `Failed: ${j.error}` : j.skipped ? 'Content already exists. Use "Reset to demo" to reload the demo data.' : 'Demo data imported.')
    } catch { setMsg('Request failed.') }
    setBusy(false); void load()
  }

  const box: React.CSSProperties = { border: '1px solid var(--theme-elevation-150)', borderRadius: 6, padding: 16, marginBottom: 16 }
  return (
    <div style={{ padding: '32px var(--gutter-h, 32px)', maxWidth: 720 }}>
      <h1>Demo Data</h1>
      <p>Load the sample Goldeneye content (projects, listings, news, FAQs, testimonials, stats, images) so the site is ready to explore.</p>
      {info && (
        <div style={box}>
          <strong>Current content</strong>
          <ul style={{ margin: '8px 0 0' }}>{Object.entries(info.counts).map(([k, v]) => <li key={k}>{k}: {v}</li>)}</ul>
        </div>
      )}
      {info?.production && <p style={{ color: 'var(--theme-error-500)' }}>Disabled in production.</p>}
      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn btn--style-primary btn--size-medium" disabled={busy || !info || info.production} onClick={() => run(false)}>Import demo data</button>
        <button className="btn btn--style-secondary btn--size-medium" disabled={busy || !info || info.production} onClick={() => run(true)}>Reset to demo</button>
      </div>
      {msg && <p style={{ marginTop: 16 }}>{msg}</p>}
    </div>
  )
}
