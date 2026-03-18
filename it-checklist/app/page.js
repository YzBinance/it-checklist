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

const KEY     = 'it_checklist_2026'
const dateKey = () => new Date().toISOString().split('T')[0]
const today   = () => new Date().toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric' })
const nowTime = () => new Date().toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' })

function buildHTML(checks, notes, times) {
  const done = DEVICES.filter(d => checks[d.id]).length
  const rows = DEVICES.map(d => {
    const ok = checks[d.id]
    return `<tr style="background:${ok ? '#edf7f2' : ''}">
      <td style="padding:7px 10px;text-align:center;color:#94a3b8;font-size:12px;border-bottom:1px solid #e8edf2">${d.id}</td>
      <td style="padding:7px 10px;font-size:13px;font-weight:500;border-bottom:1px solid #e8edf2">${d.name}</td>
      <td style="padding:7px 10px;font-size:12px;color:#64748b;border-bottom:1px solid #e8edf2">${d.location}</td>
      <td style="padding:7px 10px;text-align:center;color:${ok ? '#2d8a5e' : '#cbd5e1'};font-size:15px;border-bottom:1px solid #e8edf2">${ok ? '✓' : '—'}</td>
      <td style="padding:7px 10px;font-size:12px;color:#2d8a5e;border-bottom:1px solid #e8edf2">${times[d.id] || ''}</td>
      <td style="padding:7px 10px;font-size:12px;color:#64748b;border-bottom:1px solid #e8edf2">${notes[d.id] || ''}</td>
    </tr>`
  }).join('')
  return `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8">
<title>Laporan Checklist IT — ${today()}</title>
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; margin: 32px; color: #1e2d3d; background: #f5f8fa; }
  .wrap { background: #fff; padding: 28px; border-radius: 10px; max-width: 900px; margin: 0 auto; }
  h2 { font-size: 17px; margin: 0 0 4px; color: #1e2d3d; }
  .date { font-size: 12px; color: #8fa3b3; margin-bottom: 20px; }
  .badge { display:inline-block; background:#dbeafe; color:#2563eb; padding:4px 14px; border-radius:20px; font-size:12px; font-weight:600; margin-bottom:20px; }
  table { width:100%; border-collapse:collapse; }
  th { background:#2c4a6e; color:#fff; padding:9px 10px; text-align:left; font-size:11px; font-weight:600; }
  tfoot td { background:#f0f4f7; font-weight:600; padding:8px 10px; font-size:13px; }
  @media print { body { margin:16px; background:#fff } }
</style></head>
<body><div class="wrap">
<h2>Laporan Checklist Perangkat IT Standby 24 Jam</h2>
<div class="date">${today()}</div>
<div class="badge">Selesai: ${done} / ${DEVICES.length} (${Math.round(done / DEVICES.length * 100)}%)</div>
<table><thead><tr>
  <th style="width:36px">No</th><th>Nama Perangkat</th><th>Lokasi</th>
  <th style="width:56px;text-align:center">Status</th><th style="width:72px">Waktu</th><th>Catatan</th>
</tr></thead><tbody>${rows}</tbody>
<tfoot><tr><td colspan="3">Total Selesai</td><td colspan="3">${done} / ${DEVICES.length}</td></tr></tfoot>
</table></div></body></html>`
}

function dlPDF(checks, notes, times) {
  const w = window.open('', '_blank')
  w.document.write(buildHTML(checks, notes, times))
  w.document.close()
  w.focus()
  setTimeout(() => w.print(), 500)
}

function dlWord(checks, notes, times) {
  const blob = new Blob(['\ufeff', buildHTML(checks, notes, times)], { type: 'application/msword' })
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(blob),
    download: `checklist-it-${dateKey()}.doc`
  })
  a.click()
}

export default function App() {
  const [checks,  setChecks]  = useState({})
  const [notes,   setNotes]   = useState({})
  const [times,   setTimes]   = useState({})
  const [filter,  setFilter]  = useState('all')
  const [search,  setSearch]  = useState('')
  const [preview, setPreview] = useState(false)
  const [ready,   setReady]   = useState(false)

  useEffect(() => {
    setReady(true)
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || '{}')
      if (s.date === dateKey()) {
        setChecks(s.checks || {})
        setNotes(s.notes  || {})
        setTimes(s.times  || {})
      }
    } catch {}
  }, [])

  const persist = useCallback((c, n, t) => {
    try { localStorage.setItem(KEY, JSON.stringify({ date: dateKey(), checks: c, notes: n, times: t })) }
    catch {}
  }, [])

  const toggle = id => {
    const nc = { ...checks, [id]: !checks[id] }
    const nt = checks[id] ? { ...times, [id]: undefined } : { ...times, [id]: nowTime() }
    setChecks(nc); setTimes(nt); persist(nc, notes, nt)
  }
  const setNote = (id, v) => {
    const nn = { ...notes, [id]: v }
    setNotes(nn); persist(checks, nn, times)
  }
  const reset = () => {
    if (!confirm('Reset semua checklist hari ini?')) return
    setChecks({}); setNotes({}); setTimes({})
    localStorage.removeItem(KEY)
  }

  const done  = DEVICES.filter(d => checks[d.id]).length
  const total = DEVICES.length
  const pct   = Math.round(done / total * 100)

  const list = DEVICES.filter(d => {
    const mf = filter === 'all' || (filter === 'done' ? checks[d.id] : !checks[d.id])
    const q  = search.toLowerCase()
    return mf && (!q || d.name.toLowerCase().includes(q) || d.location.toLowerCase().includes(q))
  })

  if (!ready) return null

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', minHeight: '100dvh' }}>

      {/* ── HEADER ── */}
      <div style={s.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={s.eyebrow}>PERANGKAT IT · 2026</div>
            <div style={s.title}>Standby Checklist</div>
            <div style={s.date}>{today()}</div>
          </div>
          <button onClick={reset} style={s.iconBtn} title="Reset hari ini">↺</button>
        </div>

        {/* Progress */}
        <div style={s.progressWrap}>
          <div style={s.track}>
            <div style={{
              ...s.fill,
              width: `${pct}%`,
              background: pct === 100 ? '#2d8a5e' : '#3b6fa0'
            }} />
          </div>
          <span style={{ ...s.pct, color: pct === 100 ? '#2d8a5e' : '#3b6fa0' }}>
            {done}/{total}
          </span>
        </div>

        {/* Search */}
        <input
          style={s.search}
          placeholder="Cari perangkat atau lokasi..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {/* Filter tabs */}
        <div style={s.tabs}>
          {[['all', 'Semua'], ['pending', 'Belum'], ['done', 'Selesai']].map(([f, l]) => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ ...s.tab, ...(filter === f ? s.tabOn : {}) }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* ── LIST ── */}
      <div style={s.list}>
        {list.length === 0 && <div style={s.empty}>Tidak ada hasil</div>}

        {list.map(d => {
          const ok = !!checks[d.id]
          return (
            <div key={d.id} style={{ ...s.card, ...(ok ? s.cardOk : {}) }}>
              <div style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>

                {/* Checkbox */}
                <button onClick={() => toggle(d.id)}
                  style={{ ...s.box, ...(ok ? s.boxOk : {}) }}>
                  {ok && (
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                      <path d="M1 5l3.5 3.5L11 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ ...s.name, ...(ok ? s.nameDone : {}) }}>
                    <span style={s.num}>#{String(d.id).padStart(2,'0')} </span>
                    {d.name}
                  </div>
                  <div style={s.loc}>
                    {d.location}
                    {times[d.id] && <span style={s.stamp}> · {times[d.id]}</span>}
                  </div>
                  <div style={s.desc}>{d.desc}</div>
                </div>
              </div>

              {/* Note */}
              <div style={s.noteLine}>
                <input
                  style={s.noteInput}
                  placeholder="Tambah catatan..."
                  value={notes[d.id] || ''}
                  onChange={e => setNote(d.id, e.target.value)}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* ── BOTTOM BAR ── */}
      <div style={s.bar}>
        <button onClick={() => setPreview(true)} style={s.previewBtn}>
          Preview Laporan
        </button>
        <button onClick={() => dlPDF(checks, notes, times)}  style={s.dlBtn}>↓ PDF</button>
        <button onClick={() => dlWord(checks, notes, times)} style={s.dlBtn}>↓ Word</button>
      </div>

      {/* ── PREVIEW MODAL ── */}
      {preview && (
        <div style={s.overlay} onClick={() => setPreview(false)}>
          <div style={s.sheet} onClick={e => e.stopPropagation()}>

            <div style={s.sheetHead}>
              <span style={s.sheetTitle}>Preview Laporan</span>
              <button onClick={() => setPreview(false)} style={s.closeBtn}>✕</button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, padding: 16 }}>

              {/* Summary */}
              <div style={s.sumRow}>
                {[
                  { label: 'Selesai',  val: done,       color: '#2d8a5e' },
                  { label: 'Belum',    val: total-done,  color: '#c0392b' },
                  { label: 'Progress', val: `${pct}%`,   color: '#3b6fa0' },
                ].map(item => (
                  <div key={item.label} style={s.sumCard}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: item.color }}>{item.val}</div>
                    <div style={{ fontSize: 11, color: '#8fa3b3', marginTop: 2 }}>{item.label}</div>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #d4dce4' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr>
                      {['No', 'Perangkat', 'Lokasi', '✓', 'Waktu', 'Catatan'].map(h => (
                        <th key={h} style={s.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {DEVICES.map((d, i) => {
                      const ok = !!checks[d.id]
                      return (
                        <tr key={d.id} style={{
                          background: ok ? '#edf7f2' : i % 2 === 0 ? '#f5f8fa' : '#f0f4f7'
                        }}>
                          <td style={{ ...s.td, textAlign: 'center', color: '#8fa3b3' }}>{d.id}</td>
                          <td style={{ ...s.td, fontWeight: 500 }}>{d.name}</td>
                          <td style={{ ...s.td, color: '#526070' }}>{d.location}</td>
                          <td style={{ ...s.td, textAlign: 'center', color: ok ? '#2d8a5e' : '#c9d6df', fontSize: 14 }}>{ok ? '✓' : '—'}</td>
                          <td style={{ ...s.td, color: '#2d8a5e', whiteSpace: 'nowrap' }}>{times[d.id] || ''}</td>
                          <td style={{ ...s.td, color: '#526070' }}>{notes[d.id] || ''}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={s.sheetFoot}>
              <button onClick={() => dlPDF(checks, notes, times)}
                style={{ ...s.dlBtnLg, background: '#2c4a6e' }}>
                ↓ Download PDF
              </button>
              <button onClick={() => dlWord(checks, notes, times)}
                style={{ ...s.dlBtnLg, background: '#3b6fa0' }}>
                ↓ Download Word
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const s = {
  header: {
    background: '#dde4eb',
    borderBottom: '1px solid #c8d2db',
    padding: '16px 16px 0',
    position: 'sticky', top: 0, zIndex: 50,
  },
  eyebrow: {
    fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
    color: '#3b6fa0', marginBottom: 4, textTransform: 'uppercase',
  },
  title: { fontSize: 20, fontWeight: 700, color: '#1e2d3d', letterSpacing: '-0.01em' },
  date:  { fontSize: 11, color: '#8fa3b3', marginTop: 2, marginBottom: 14 },
  iconBtn: {
    background: '#cdd6df', border: '1px solid #b8c5d0',
    borderRadius: 8, width: 34, height: 34, cursor: 'pointer',
    fontSize: 15, color: '#526070', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  progressWrap: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 },
  track: { flex: 1, height: 5, background: '#c8d2db', borderRadius: 3, overflow: 'hidden' },
  fill:  { height: '100%', borderRadius: 3, transition: 'width 0.35s ease, background 0.3s' },
  pct:   { fontSize: 12, fontWeight: 700, minWidth: 36, textAlign: 'right' },
  search: {
    width: '100%', padding: '8px 12px',
    border: '1px solid #c8d2db', borderRadius: 8,
    fontSize: 13, outline: 'none',
    background: '#e8edf2', color: '#1e2d3d',
    marginBottom: 10,
  },
  tabs: { display: 'flex', gap: 6, paddingBottom: 12 },
  tab: {
    padding: '5px 14px', borderRadius: 20,
    border: '1px solid #c8d2db', background: '#e0e8ef',
    color: '#526070', fontSize: 12, cursor: 'pointer',
    transition: 'all 0.15s',
  },
  tabOn: {
    background: '#3b6fa0', border: '1px solid #3b6fa0',
    color: '#fff', fontWeight: 600,
  },

  list: { padding: '12px 14px 110px' },

  card: {
    background: '#eef2f6',
    border: '1px solid #d4dce4',
    borderRadius: 10, padding: 13, marginBottom: 8,
    transition: 'border-color 0.2s, background 0.2s',
  },
  cardOk: {
    background: '#e6f4ed',
    border: '1px solid #b6dece',
  },
  box: {
    width: 24, height: 24, borderRadius: 6,
    border: '2px solid #b8c5d0', background: 'transparent',
    cursor: 'pointer', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginTop: 2, transition: 'all 0.15s',
  },
  boxOk: { background: '#2d8a5e', border: '2px solid #2d8a5e' },
  num:   { color: '#aab9c5', fontWeight: 400, fontSize: 12 },
  name:  { fontSize: 13, fontWeight: 600, color: '#1e2d3d', lineHeight: 1.4, marginBottom: 3 },
  nameDone: { color: '#8fa3b3', textDecoration: 'line-through', textDecorationColor: '#b6dece' },
  loc:   { fontSize: 11, color: '#3b6fa0', marginBottom: 3 },
  stamp: { color: '#2d8a5e', fontWeight: 500 },
  desc:  { fontSize: 11, color: '#8fa3b3', lineHeight: 1.5 },
  noteLine: {
    marginTop: 10, paddingTop: 8,
    borderTop: '1px solid #d4dce4',
  },
  noteInput: {
    width: '100%', border: 'none', outline: 'none',
    fontSize: 12, color: '#526070', background: 'transparent',
    fontFamily: 'inherit',
  },

  bar: {
    position: 'fixed', bottom: 0, left: 0, right: 0,
    background: '#dde4eb', borderTop: '1px solid #c8d2db',
    padding: '10px 14px', display: 'flex', gap: 8,
    maxWidth: 600, margin: '0 auto',
  },
  previewBtn: {
    flex: 2, padding: '10px 0', borderRadius: 8,
    border: '1px solid #3b6fa0', background: 'transparent',
    color: '#3b6fa0', fontWeight: 600, fontSize: 13, cursor: 'pointer',
  },
  dlBtn: {
    flex: 1, padding: '10px 0', borderRadius: 8,
    border: '1px solid #c8d2db', background: '#e0e8ef',
    color: '#526070', fontWeight: 600, fontSize: 13, cursor: 'pointer',
  },

  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(18,28,40,0.45)',
    display: 'flex', alignItems: 'flex-end', zIndex: 200,
  },
  sheet: {
    background: '#e8edf2', borderRadius: '14px 14px 0 0',
    width: '100%', maxHeight: '90dvh',
    display: 'flex', flexDirection: 'column',
    maxWidth: 600, margin: '0 auto',
  },
  sheetHead: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '14px 16px', borderBottom: '1px solid #d4dce4', flexShrink: 0,
    background: '#dde4eb', borderRadius: '14px 14px 0 0',
  },
  sheetTitle: { fontSize: 15, fontWeight: 700, color: '#1e2d3d' },
  closeBtn: {
    background: '#cdd6df', border: '1px solid #c0ccd5',
    borderRadius: 6, width: 28, height: 28,
    cursor: 'pointer', fontSize: 12, color: '#526070',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },

  sumRow:  { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 14 },
  sumCard: {
    background: '#dde4eb', border: '1px solid #c8d2db',
    borderRadius: 8, padding: '10px 12px', textAlign: 'center',
  },
  th: {
    background: '#2c4a6e', color: '#c8d8e8',
    padding: '8px 9px', textAlign: 'left',
    fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
  },
  td: { padding: '6px 9px', fontSize: 12, borderBottom: '1px solid #d4dce4' },

  sheetFoot: {
    padding: '12px 16px', borderTop: '1px solid #d4dce4',
    display: 'flex', gap: 8, flexShrink: 0,
    background: '#dde4eb',
  },
  dlBtnLg: {
    flex: 1, padding: '12px', borderRadius: 8, border: 'none',
    color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer',
  },
  empty: { textAlign: 'center', color: '#8fa3b3', padding: '40px 0', fontSize: 13 },
}
