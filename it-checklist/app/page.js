'use client'

import { useState, useEffect, useCallback } from 'react'

const DEVICES = [
  { id: 1,  name: "AC + Rack Server Backbone Utama",           location: "Office Baru Lt 1",        desc: "Memantau backbone utama, trafik jaringan dan CCTV Mojoagung" },
  { id: 2,  name: "Rack Walmount 8U",                           location: "Office Baru Lt 2",        desc: "Distribusi jaringan dan CCTV Office Lt 2" },
  { id: 3,  name: "Rack Walmount 8U",                           location: "Office Baru Lt 3",        desc: "Distribusi jaringan dan CCTV Office Lt 3" },
  { id: 4,  name: "Box Panel Switch",                           location: "R. Security",             desc: "Distribusi CCTV area Security" },
  { id: 5,  name: "Power Switch Listrik R. Tamu",               location: "R. Tamu",                 desc: "Distribusi CCTV Ezviz POS" },
  { id: 6,  name: "Box Panel Switch",                           location: "R. Transit",              desc: "Distribusi konektivitas CCTV area Transit" },
  { id: 7,  name: "AC + Rack Server Backbone Sub Distribusi",   location: "R. Admin Gedung 1",       desc: "Distribusi jaringan internet dan CCTV Gedung 1" },
  { id: 8,  name: "Switch CCTV Distribusi",                     location: "R. Sparepart Lama",       desc: "Distribusi CCTV area Cleanroom Gedung 2" },
  { id: 9,  name: "Box Panel Switch",                           location: "R. Admin Gedung 2",       desc: "Distribusi jaringan internet dan CCTV Gedung 2" },
  { id: 10, name: "Box Panel Switch",                           location: "R. Admin Gedung 3",       desc: "Distribusi jaringan internet dan CCTV Gedung 3" },
  { id: 11, name: "Box Panel Switch",                           location: "R. Admin Gedung 4",       desc: "Distribusi jaringan internet dan CCTV Gedung 4" },
  { id: 12, name: "Rack Walmount 8U",                           location: "R. Admin Gedung 6",       desc: "Distribusi jaringan internet dan CCTV Gedung 6" },
  { id: 13, name: "Box Panel Switch",                           location: "Diatas Cleanroom Gd 7",   desc: "Distribusi CCTV area Cleanroom Gedung 6" },
  { id: 14, name: "Rack Walmount 8U",                           location: "R. Admin Gedung 6 Lt 2",  desc: "Distribusi jaringan internet dan CCTV Gedung 6 Lt 2" },
  { id: 15, name: "Box Panel Switch",                           location: "Diatas R. Oxyflow HCG",   desc: "Distribusi CCTV area Gedung 6 Lt 2 Belakang" },
  { id: 16, name: "Box Panel Switch",                           location: "Diatas R. Cleanroom",     desc: "Distribusi CCTV area Gedung 6 Lt 2 Cleanroom" },
  { id: 17, name: "Rack Walmount 8U",                           location: "R. Admin Gedung 9",       desc: "Distribusi jaringan internet dan CCTV Gedung 9" },
  { id: 18, name: "Box Panel Switch",                           location: "Diatas R. Povidone",      desc: "Distribusi CCTV area Gedung 9 Lt 2 Belakang" },
  { id: 19, name: "Rack Walmount 8U",                           location: "R. Ganti Sepatu Gd 13",   desc: "Distribusi jaringan internet dan CCTV Gedung 13" },
  { id: 20, name: "Rack Walmount 8U",                           location: "R. Matras Gd 12",         desc: "Distribusi jaringan internet dan CCTV Gedung 12" },
  { id: 21, name: "Box Panel Switch",                           location: "Area Gudang 12 Lt 2",     desc: "Distribusi CCTV area Gedung 12 Lt 2 Belakang" },
  { id: 22, name: "Rack Walmount 8U",                           location: "R. Admin Gd 11",          desc: "Distribusi jaringan internet dan CCTV Gedung 11, MTC" },
  { id: 23, name: "Rack Walmount 8U",                           location: "R. Admin Lama Gd 10",     desc: "Distribusi jaringan internet dan CCTV Gedung 10, RND, QA, QC Lab Pusat" },
  { id: 24, name: "Box Panel Switch",                           location: "Area Gudang 10 Lt 2",     desc: "Distribusi CCTV area Gedung 10 Lt 2 Belakang" },
  { id: 25, name: "Power Switch Listrik Lab Pusat",             location: "R. RND Lab Pusat",        desc: "Distribusi jaringan dan CCTV Ezviz dan Mesin Climatic RND" },
  { id: 26, name: "Box Panel MTC",                              location: "R. MTC",                  desc: "Distribusi jaringan dan CCTV Ezviz MTC" },
  { id: 27, name: "Rack Walmount 12U",                          location: "Control Room Ebeam",      desc: "Distribusi jaringan internet dan CCTV Gedung 14" },
  { id: 28, name: "Rack Walmount 8U",                           location: "R. Admin Gedung 15",      desc: "Distribusi jaringan internet dan CCTV Gedung 15" },
  { id: 29, name: "Rack Walmount 8U",                           location: "R. Admin Gedung 17",      desc: "Distribusi jaringan internet dan CCTV Gedung NDC" },
]

const STORAGE_KEY = 'it_checklist_2026'

function getToday() {
  return new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function getDateKey() {
  return new Date().toISOString().split('T')[0]
}

function getNow() {
  return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

export default function ChecklistPage() {
  const [checks, setChecks]   = useState({})
  const [notes, setNotes]     = useState({})
  const [times, setTimes]     = useState({})
  const [filter, setFilter]   = useState('all')
  const [search, setSearch]   = useState('')
  const [showDone, setShowDone] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      const today = getDateKey()
      if (saved.date === today) {
        setChecks(saved.checks || {})
        setNotes(saved.notes || {})
        setTimes(saved.times || {})
      }
    } catch {}
  }, [])

  const save = useCallback((c, n, t) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        date: getDateKey(), checks: c, notes: n, times: t
      }))
    } catch {}
  }, [])

  const toggle = (id) => {
    const newChecks = { ...checks, [id]: !checks[id] }
    const newTimes  = checks[id]
      ? { ...times, [id]: undefined }
      : { ...times, [id]: getNow() }
    setChecks(newChecks)
    setTimes(newTimes)
    save(newChecks, notes, newTimes)
  }

  const setNote = (id, val) => {
    const newNotes = { ...notes, [id]: val }
    setNotes(newNotes)
    save(checks, newNotes, times)
  }

  const reset = () => {
    if (!confirm('Reset semua checklist hari ini?')) return
    setChecks({}); setNotes({}); setTimes({})
    localStorage.removeItem(STORAGE_KEY)
  }

  const done  = DEVICES.filter(d => checks[d.id]).length
  const total = DEVICES.length
  const pct   = Math.round((done / total) * 100)

  const filtered = DEVICES.filter(d => {
    const matchFilter = filter === 'all' || (filter === 'done' ? checks[d.id] : !checks[d.id])
    const q = search.toLowerCase()
    const matchSearch = !q || d.name.toLowerCase().includes(q) || d.location.toLowerCase().includes(q)
    return matchFilter && matchSearch
  })

  if (!mounted) return null

  return (
    <div style={S.page}>

      {/* HEADER */}
      <header style={S.header}>
        <div style={S.headerTop}>
          <div>
            <div style={S.badge}>IT OPS · 2026</div>
            <h1 style={S.title}>Standby Checklist</h1>
            <p style={S.date}>{getToday()}</p>
          </div>
          <button onClick={reset} style={S.resetBtn} title="Reset">↺</button>
        </div>

        {/* Progress */}
        <div style={S.progressWrap}>
          <div style={S.progressBar}>
            <div style={{ ...S.progressFill, width: `${pct}%`, background: pct === 100 ? 'var(--green)' : 'var(--accent)' }} />
          </div>
          <div style={S.progressLabel}>
            <span style={{ fontFamily: 'var(--mono)', color: pct === 100 ? '#00e676' : 'var(--accent)', fontWeight: 600 }}>
              {done}/{total}
            </span>
            <span style={{ color: 'var(--text2)', fontSize: 13 }}>{pct}% selesai</span>
          </div>
        </div>

        {/* Filters */}
        <div style={S.filterRow}>
          <input
            style={S.search}
            placeholder="Cari perangkat / lokasi..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div style={S.filterBtns}>
            {['all','pending','done'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ ...S.filterBtn, ...(filter === f ? S.filterActive : {}) }}>
                {f === 'all' ? `Semua (${total})` : f === 'done' ? `✓ Selesai (${done})` : `◯ Belum (${total - done})`}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* LIST */}
      <main style={S.main}>
        {filtered.length === 0 && (
          <div style={S.empty}>Tidak ada perangkat ditemukan</div>
        )}
        {filtered.map((device) => {
          const checked = !!checks[device.id]
          return (
            <div key={device.id} style={{ ...S.card, ...(checked ? S.cardDone : {}) }}>
              <div style={S.cardTop}>
                {/* Checkbox */}
                <button
                  onClick={() => toggle(device.id)}
                  style={{ ...S.checkbox, ...(checked ? S.checkboxDone : {}) }}
                  aria-label={checked ? 'Tandai belum' : 'Tandai selesai'}
                >
                  {checked && <span style={S.checkMark}>✓</span>}
                </button>

                {/* Info */}
                <div style={S.cardInfo}>
                  <div style={S.cardNum}>#{String(device.id).padStart(2,'0')}</div>
                  <div style={{ ...S.cardName, ...(checked ? S.cardNameDone : {}) }}>{device.name}</div>
                  <div style={S.cardLoc}>
                    <span style={S.pin}>⬡</span> {device.location}
                    {times[device.id] && (
                      <span style={S.time}>· {times[device.id]}</span>
                    )}
                  </div>
                  <div style={S.cardDesc}>{device.desc}</div>
                </div>
              </div>

              {/* Note input */}
              <div style={S.noteWrap}>
                <input
                  style={S.noteInput}
                  placeholder="Tambah catatan..."
                  value={notes[device.id] || ''}
                  onChange={e => setNote(device.id, e.target.value)}
                />
              </div>
            </div>
          )
        })}
      </main>

      {/* ALL DONE Banner */}
      {pct === 100 && (
        <div style={S.doneBanner}>
          <span style={{ fontSize: 22 }}>✓</span>
          Semua perangkat sudah dicek!
        </div>
      )}

      {/* Floating summary */}
      <div style={S.fab}>
        <span style={{ color: pct === 100 ? '#00e676' : 'var(--accent)', fontFamily: 'var(--mono)', fontWeight: 600 }}>
          {done}/{total}
        </span>
      </div>
    </div>
  )
}

const S = {
  page: {
    minHeight: '100dvh',
    maxWidth: 680,
    margin: '0 auto',
    paddingBottom: 80,
  },
  header: {
    padding: '20px 16px 0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'var(--bg)',
    borderBottom: '1px solid var(--border)',
    paddingBottom: 12,
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  badge: {
    display: 'inline-block',
    fontFamily: 'var(--mono)',
    fontSize: 10,
    fontWeight: 600,
    color: 'var(--accent)',
    background: '#00d4ff12',
    border: '1px solid #00d4ff30',
    padding: '3px 8px',
    borderRadius: 4,
    letterSpacing: '0.08em',
    marginBottom: 6,
  },
  title: {
    fontFamily: 'var(--mono)',
    fontSize: 22,
    fontWeight: 600,
    color: '#e8f4ff',
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
  },
  date: {
    fontSize: 12,
    color: 'var(--text3)',
    marginTop: 3,
    fontFamily: 'var(--mono)',
  },
  resetBtn: {
    background: 'var(--surface)',
    border: '1px solid var(--border2)',
    color: 'var(--text2)',
    width: 36,
    height: 36,
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    flexShrink: 0,
  },
  progressWrap: {
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    background: 'var(--border)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
    transition: 'width 0.4s ease, background 0.3s',
  },
  progressLabel: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
  filterRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  search: {
    background: 'var(--surface)',
    border: '1px solid var(--border2)',
    borderRadius: 8,
    color: 'var(--text)',
    padding: '8px 12px',
    fontSize: 13,
    fontFamily: 'var(--sans)',
    outline: 'none',
    width: '100%',
  },
  filterBtns: {
    display: 'flex',
    gap: 6,
    flexWrap: 'wrap',
  },
  filterBtn: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 6,
    color: 'var(--text2)',
    padding: '5px 10px',
    fontSize: 12,
    fontFamily: 'var(--mono)',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  filterActive: {
    background: '#00d4ff12',
    border: '1px solid #00d4ff40',
    color: 'var(--accent)',
  },
  main: {
    padding: '12px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: '12px 14px',
    transition: 'border-color 0.2s, background 0.2s',
  },
  cardDone: {
    background: '#00e67606',
    border: '1px solid #00e67625',
  },
  cardTop: {
    display: 'flex',
    gap: 12,
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    border: '2px solid var(--border2)',
    background: 'transparent',
    cursor: 'pointer',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    transition: 'all 0.2s',
  },
  checkboxDone: {
    background: 'var(--green)',
    border: '2px solid var(--green)',
  },
  checkMark: {
    color: '#0a0e13',
    fontSize: 14,
    fontWeight: 700,
    lineHeight: 1,
  },
  cardInfo: {
    flex: 1,
    minWidth: 0,
  },
  cardNum: {
    fontFamily: 'var(--mono)',
    fontSize: 10,
    color: 'var(--text3)',
    letterSpacing: '0.05em',
    marginBottom: 2,
  },
  cardName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#e8f4ff',
    lineHeight: 1.3,
    marginBottom: 3,
    transition: 'color 0.2s',
  },
  cardNameDone: {
    color: 'var(--text2)',
    textDecoration: 'line-through',
    textDecorationColor: '#00e67660',
  },
  cardLoc: {
    fontSize: 12,
    color: 'var(--accent2)',
    fontFamily: 'var(--mono)',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  pin: {
    fontSize: 10,
    color: 'var(--accent)',
  },
  time: {
    color: 'var(--green)',
    marginLeft: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: 'var(--text2)',
    lineHeight: 1.5,
  },
  noteWrap: {
    marginTop: 10,
    paddingTop: 10,
    borderTop: '1px solid var(--border)',
  },
  noteInput: {
    width: '100%',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'var(--text2)',
    fontSize: 12,
    fontFamily: 'var(--sans)',
    resize: 'none',
    placeholder: 'var(--text3)',
  },
  empty: {
    textAlign: 'center',
    color: 'var(--text3)',
    padding: '40px 0',
    fontFamily: 'var(--mono)',
    fontSize: 13,
  },
  doneBanner: {
    position: 'fixed',
    bottom: 70,
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#00e67615',
    border: '1px solid #00e67640',
    color: '#00e676',
    padding: '10px 20px',
    borderRadius: 100,
    fontWeight: 600,
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    whiteSpace: 'nowrap',
    fontFamily: 'var(--mono)',
  },
  fab: {
    position: 'fixed',
    bottom: 20,
    right: 20,
    background: 'var(--surface2)',
    border: '1px solid var(--border2)',
    borderRadius: 100,
    padding: '8px 16px',
    fontSize: 13,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    boxShadow: '0 4px 20px #00000060',
  },
}
