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

const KEY = 'it_checklist_2026'
const dateKey = () => new Date().toISOString().split('T')[0]
const today   = () => new Date().toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric' })
const nowTime = () => new Date().toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' })

function buildHTML(checks, notes, times) {
  const done = DEVICES.filter(d => checks[d.id]).length
  const rows = DEVICES.map(d => {
    const ok = checks[d.id]
    return `<tr style="background:${ok?'#f0fff4':''};border-bottom:1px solid #e5e7eb">
      <td style="padding:7px 10px;text-align:center;color:#9ca3af;font-size:12px">${d.id}</td>
      <td style="padding:7px 10px;font-size:13px;font-weight:500">${d.name}</td>
      <td style="padding:7px 10px;font-size:12px;color:#6b7280">${d.location}</td>
      <td style="padding:7px 10px;text-align:center;color:${ok?'#16a34a':'#d1d5db'};font-size:15px">${ok?'✓':'—'}</td>
      <td style="padding:7px 10px;font-size:12px;color:#16a34a">${times[d.id]||''}</td>
      <td style="padding:7px 10px;font-size:12px;color:#6b7280">${notes[d.id]||''}</td>
    </tr>`
  }).join('')
  return `<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8">
<title>Laporan Checklist IT</title>
<style>body{font-family:Arial,sans-serif;margin:32px;color:#111}
h2{margin:0 0 4px;font-size:17px}p{margin:0 0 16px;color:#6b7280;font-size:13px}
.badge{display:inline-block;background:#dbeafe;color:#1d4ed8;padding:3px 12px;border-radius:20px;font-size:12px;font-weight:600;margin-bottom:20px}
table{width:100%;border-collapse:collapse}
th{background:#1e3a5f;color:#fff;padding:8px 10px;text-align:left;font-size:12px}
tfoot td{background:#f1f5f9;font-weight:600;padding:8px 10px;font-size:13px;border-top:2px solid #e2e8f0}
@media print{body{margin:16px}}</style></head><body>
<h2>Laporan Checklist Perangkat IT Standby 24 Jam</h2>
<p>${today()}</p>
<div class="badge">Selesai: ${done} / ${DEVICES.length} perangkat (${Math.round(done/DEVICES.length*100)}%)</div>
<table><thead><tr>
<th style="width:36px">No</th><th>Nama Perangkat</th><th>Lokasi</th>
<th style="width:56px;text-align:center">Status</th><th style="width:70px">Waktu</th><th>Catatan</th>
</tr></thead><tbody>${rows}</tbody>
<tfoot><tr><td colspan="3">Total Selesai</td><td colspan="3">${done} / ${DEVICES.length}</td></tr></tfoot>
</table></body></html>`
}

function dlPDF(checks, notes, times) {
  const w = window.open('','_blank')
  w.document.write(buildHTML(checks, notes, times))
  w.document.close()
  w.focus()
  setTimeout(() => w.print(), 500)
}

function dlWord(checks, notes, times) {
  const blob = new Blob(['\ufeff', buildHTML(checks, notes, times)], { type: 'application/msword' })
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `checklist-it-${dateKey()}.doc` })
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
      if (s.date === dateKey()) { setChecks(s.checks||{}); setNotes(s.notes||{}); setTimes(s.times||{}) }
    } catch {}
  }, [])

  const persist = useCallback((c,n,t) => {
    try { localStorage.setItem(KEY, JSON.stringify({ date:dateKey(), checks:c, notes:n, times:t })) } catch {}
  }, [])

  const toggle = id => {
    const nc = { ...checks, [id]: !checks[id] }
    const nt = checks[id] ? { ...times, [id]: undefined } : { ...times, [id]: nowTime() }
    setChecks(nc); setTimes(nt); persist(nc, notes, nt)
  }
  const note = (id, v) => { const nn={...notes,[id]:v}; setNotes(nn); persist(checks,nn,times) }
  const reset = () => {
    if (!confirm('Reset semua checklist?')) return
    setChecks({}); setNotes({}); setTimes({})
    localStorage.removeItem(KEY)
  }

  const done  = DEVICES.filter(d => checks[d.id]).length
  const total = DEVICES.length
  const pct   = Math.round(done/total*100)

  const list = DEVICES.filter(d => {
    const mf = filter==='all' || (filter==='done' ? checks[d.id] : !checks[d.id])
    const q  = search.toLowerCase()
    return mf && (!q || d.name.toLowerCase().includes(q) || d.location.toLowerCase().includes(q))
  })

  if (!ready) return null

  return (
    <div style={{ maxWidth:600, margin:'0 auto', minHeight:'100dvh', background:'#f8fafc' }}>

      {/* ── HEADER ── */}
      <div style={c.header}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <div style={c.title}>IT Standby Checklist</div>
            <div style={c.sub}>{today()}</div>
          </div>
          <button onClick={reset} style={c.iconBtn}>↺</button>
        </div>

        <div style={c.progressWrap}>
          <div style={c.track}><div style={{ ...c.fill, width:`${pct}%`, background: pct===100?'#16a34a':'#2563eb' }} /></div>
          <span style={{ ...c.pctText, color: pct===100?'#16a34a':'#2563eb' }}>{done}/{total}</span>
        </div>

        <input style={c.search} placeholder="Cari perangkat atau lokasi..."
          value={search} onChange={e => setSearch(e.target.value)} />

        <div style={c.tabs}>
          {[['all','Semua'],['pending','Belum'],['done','Selesai']].map(([f,l]) => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ ...c.tab, ...(filter===f ? c.tabOn : {}) }}>{l}</button>
          ))}
        </div>
      </div>

      {/* ── LIST ── */}
      <div style={{ padding:'10px 14px 100px' }}>
        {list.length === 0 && <div style={c.empty}>Tidak ada hasil</div>}
        {list.map(d => {
          const ok = !!checks[d.id]
          return (
            <div key={d.id} style={{ ...c.card, ...(ok ? c.cardOk : {}) }}>
              <div style={{ display:'flex', gap:10 }}>
                <button onClick={() => toggle(d.id)}
                  style={{ ...c.box, ...(ok ? c.boxOk : {}) }}>
                  {ok && '✓'}
                </button>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ ...c.name, ...(ok ? c.nameDone : {}) }}>
                    <span style={c.num}>#{d.id} </span>{d.name}
                  </div>
                  <div style={c.loc}>
                    {d.location}
                    {times[d.id] && <span style={c.stamp}> · {times[d.id]}</span>}
                  </div>
                  <div style={c.desc}>{d.desc}</div>
                </div>
              </div>
              <input style={c.noteInput} placeholder="Catatan..."
                value={notes[d.id]||''} onChange={e => note(d.id, e.target.value)} />
            </div>
          )
        })}
      </div>

      {/* ── BOTTOM BAR ── */}
      <div style={c.bar}>
        <button onClick={() => setPreview(true)} style={c.previewBtn}>Preview Laporan</button>
        <button onClick={() => dlPDF(checks,notes,times)}  style={c.dlBtn}>↓ PDF</button>
        <button onClick={() => dlWord(checks,notes,times)} style={c.dlBtn}>↓ Word</button>
      </div>

      {/* ── PREVIEW MODAL ── */}
      {preview && (
        <div style={c.overlay} onClick={() => setPreview(false)}>
          <div style={c.sheet} onClick={e => e.stopPropagation()}>
            <div style={c.sheetHead}>
              <span style={c.sheetTitle}>Preview Laporan</span>
              <button onClick={() => setPreview(false)} style={c.closeBtn}>✕</button>
            </div>

            <div style={{ overflowY:'auto', flex:1, padding:16 }}>
              {/* Summary cards */}
              <div style={c.sumRow}>
                {[
                  { label:'Selesai',  val:done,       color:'#16a34a' },
                  { label:'Belum',    val:total-done,  color:'#dc2626' },
                  { label:'Progress', val:`${pct}%`,   color:'#2563eb' },
                ].map(item => (
                  <div key={item.label} style={c.sumCard}>
                    <div style={{ fontSize:22, fontWeight:700, color:item.color }}>{item.val}</div>
                    <div style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>{item.label}</div>
                  </div>
                ))}
              </div>

              {/* Preview table */}
              <div style={{ overflowX:'auto', borderRadius:8, border:'1px solid #e2e8f0' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
                  <thead>
                    <tr>{['No','Perangkat','Lokasi','✓','Waktu','Catatan'].map(h => (
                      <th key={h} style={c.th}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {DEVICES.map((d,i) => {
                      const ok = !!checks[d.id]
                      return (
                        <tr key={d.id} style={{ background: ok ? '#f0fff4' : i%2===0 ? '#fff' : '#f9fafb' }}>
                          <td style={{ ...c.td, textAlign:'center', color:'#9ca3af' }}>{d.id}</td>
                          <td style={{ ...c.td, fontWeight:500 }}>{d.name}</td>
                          <td style={{ ...c.td, color:'#6b7280' }}>{d.location}</td>
                          <td style={{ ...c.td, textAlign:'center', color: ok?'#16a34a':'#d1d5db', fontSize:14 }}>{ok?'✓':'—'}</td>
                          <td style={{ ...c.td, color:'#16a34a', whiteSpace:'nowrap' }}>{times[d.id]||''}</td>
                          <td style={{ ...c.td, color:'#6b7280' }}>{notes[d.id]||''}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={c.sheetFoot}>
              <button onClick={() => dlPDF(checks,notes,times)}  style={{ ...c.dlBtnLg, background:'#1e3a5f' }}>↓ Download PDF</button>
              <button onClick={() => dlWord(checks,notes,times)} style={{ ...c.dlBtnLg, background:'#2563eb' }}>↓ Download Word</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const c = {
  header: {
    background:'#fff', borderBottom:'1px solid #e2e8f0',
    padding:'14px 14px 0', position:'sticky', top:0, zIndex:50,
  },
  title: { fontSize:17, fontWeight:700, color:'#0f172a' },
  sub:   { fontSize:11, color:'#94a3b8', marginTop:2, marginBottom:12 },
  iconBtn: {
    background:'#f1f5f9', border:'1px solid #e2e8f0', borderRadius:7,
    width:34, height:34, fontSize:15, cursor:'pointer', color:'#64748b',
  },
  progressWrap: { display:'flex', alignItems:'center', gap:8, marginBottom:10 },
  track: { flex:1, height:4, background:'#e2e8f0', borderRadius:2, overflow:'hidden' },
  fill:  { height:'100%', borderRadius:2, transition:'width 0.3s, background 0.3s' },
  pctText: { fontSize:12, fontWeight:700, minWidth:32, textAlign:'right' },
  search: {
    width:'100%', padding:'7px 11px', border:'1px solid #e2e8f0', borderRadius:7,
    fontSize:13, outline:'none', background:'#f8fafc', color:'#0f172a', marginBottom:8,
  },
  tabs: { display:'flex', gap:6, paddingBottom:10 },
  tab:  { padding:'4px 14px', borderRadius:20, border:'1px solid #e2e8f0', background:'#f8fafc', color:'#64748b', fontSize:12, cursor:'pointer' },
  tabOn:{ background:'#eff6ff', border:'1px solid #bfdbfe', color:'#2563eb', fontWeight:600 },

  card: {
    background:'#fff', border:'1px solid #e2e8f0', borderRadius:10,
    padding:12, marginBottom:8,
  },
  cardOk: { background:'#f0fff4', border:'1px solid #bbf7d0' },
  box: {
    width:24, height:24, borderRadius:6, border:'2px solid #cbd5e1', background:'transparent',
    cursor:'pointer', flexShrink:0, fontSize:12, fontWeight:700, color:'transparent',
    display:'flex', alignItems:'center', justifyContent:'center', marginTop:1,
  },
  boxOk: { background:'#16a34a', border:'2px solid #16a34a', color:'#fff' },
  num:   { color:'#d1d5db', fontWeight:400 },
  name:  { fontSize:13, fontWeight:600, color:'#0f172a', lineHeight:1.4, marginBottom:2 },
  nameDone: { color:'#94a3b8', textDecoration:'line-through' },
  loc:   { fontSize:11, color:'#3b82f6', marginBottom:3 },
  stamp: { color:'#16a34a' },
  desc:  { fontSize:11, color:'#94a3b8', lineHeight:1.5 },
  noteInput: {
    width:'100%', marginTop:8, paddingTop:8,
    borderTop:'1px solid #f1f5f9', border:'none',
    outline:'none', fontSize:12, color:'#64748b',
    background:'transparent', fontFamily:'inherit',
  },

  bar: {
    position:'fixed', bottom:0, left:0, right:0,
    background:'#fff', borderTop:'1px solid #e2e8f0',
    padding:'10px 14px', display:'flex', gap:8,
    maxWidth:600, margin:'0 auto',
  },
  previewBtn: {
    flex:2, padding:'10px 0', borderRadius:8, border:'1px solid #2563eb',
    background:'#fff', color:'#2563eb', fontWeight:600, fontSize:13, cursor:'pointer',
  },
  dlBtn: {
    flex:1, padding:'10px 0', borderRadius:8, border:'none',
    background:'#f1f5f9', color:'#475569', fontWeight:600, fontSize:13, cursor:'pointer',
  },

  overlay: {
    position:'fixed', inset:0, background:'rgba(15,23,42,0.5)',
    display:'flex', alignItems:'flex-end', zIndex:200,
  },
  sheet: {
    background:'#fff', borderRadius:'14px 14px 0 0', width:'100%',
    maxHeight:'90dvh', display:'flex', flexDirection:'column',
    maxWidth:600, margin:'0 auto',
  },
  sheetHead: {
    display:'flex', justifyContent:'space-between', alignItems:'center',
    padding:'14px 16px', borderBottom:'1px solid #e2e8f0', flexShrink:0,
  },
  sheetTitle: { fontSize:15, fontWeight:700, color:'#0f172a' },
  closeBtn: {
    background:'#f1f5f9', border:'none', borderRadius:6,
    width:28, height:28, cursor:'pointer', fontSize:12, color:'#64748b',
  },

  sumRow:  { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:14 },
  sumCard: {
    background:'#f8fafc', border:'1px solid #e2e8f0',
    borderRadius:8, padding:'10px 12px', textAlign:'center',
  },

  th: { background:'#1e3a5f', color:'#fff', padding:'7px 8px', textAlign:'left', fontSize:11, whiteSpace:'nowrap' },
  td: { padding:'6px 8px', fontSize:12, borderBottom:'1px solid #f1f5f9' },

  sheetFoot: {
    padding:'12px 16px', borderTop:'1px solid #e2e8f0',
    display:'flex', gap:8, flexShrink:0,
  },
  dlBtnLg: {
    flex:1, padding:'12px', borderRadius:8, border:'none',
    color:'#fff', fontWeight:600, fontSize:13, cursor:'pointer',
  },
  empty: { textAlign:'center', color:'#94a3b8', padding:'40px 0', fontSize:13 },
}
