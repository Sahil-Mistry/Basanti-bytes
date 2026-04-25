import { useState } from 'react';

const AREAS = ['Bandra West', 'Khar West', 'Santacruz West', 'Juhu', 'Andheri West'];

const SCORES = [
  { label: 'Safety',          val: 92, color: '#0E5860', icon: '🛡' },
  { label: 'Infrastructure',  val: 78, color: '#1A6870', icon: '🏗' },
  { label: 'Environment',     val: 84, color: '#2A8050', icon: '🌿' },
  { label: 'Connectivity',    val: 88, color: '#A07048', icon: '🚇' },
  { label: 'Future Growth',   val: 73, color: '#104E58', icon: '📈' },
  { label: 'NRI Suitability', val: 96, color: '#7A5030', icon: '✈' },
];

const AMENITIES = [
  { cat: 'Schools',     count: 14,    items: ['St. Andrews High', 'Holy Family', 'Jamnabai Narsee'] },
  { cat: 'Hospitals',   count: 7,     items: ['Lilavati Hospital', 'Holy Family Hospital', 'Bandra Maternity'] },
  { cat: 'Transport',   count: 8,     items: ['Bandra W Station', 'Metro Line 2', 'BEST Bus Depot'] },
  { cat: 'Markets',     count: 11,    items: ['Linking Road', 'Hill Road', 'Turner Road'] },
  { cat: 'Parks',       count: 5,     items: ['Carter Road', 'Bandstand Promenade', 'Joggers Park'] },
  { cat: 'Restaurants', count: '100+',items: ['Pali Village Café', 'Bastian', 'The Table'] },
];

const INFRA = [
  { label: 'Power Cuts/Mo', val: '1.2', good: true,  unit: 'avg'      },
  { label: 'Water Supply',  val: '18',  good: true,  unit: 'hrs/day'  },
  { label: 'Road Quality',  val: '7.4', good: true,  unit: '/10'      },
  { label: 'Flooding Risk', val: 'Low', good: true,  unit: ''         },
];

export default function NeighborhoodIntel() {
  const [area, setArea] = useState('Bandra West');

  return (
    <div className="screen-in" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

      {/* Area nav */}
      <div style={{
        width: 192, flexShrink: 0,
        background: 'var(--c-bg)',
        borderRight: '1px solid var(--c-border)',
        paddingTop: 16,
      }}>
        <div style={{ padding: '0 16px', marginBottom: 8, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--c-text-sm)', fontFamily: 'var(--f-ui)' }}>Areas</div>
        {AREAS.map(a => (
          <div
            key={a}
            onClick={() => setArea(a)}
            style={{
              padding: '10px 16px', cursor: 'pointer',
              fontFamily: 'var(--f-ui)', fontWeight: 600, fontSize: 13,
              color: area === a ? 'var(--c-primary)' : 'var(--c-text-md)',
              background: area === a ? 'var(--c-primary-lt)' : 'transparent',
              borderLeft: `3px solid ${area === a ? 'var(--c-primary)' : 'transparent'}`,
              transition: 'all 120ms',
            }}
          >{a}</div>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 24, background: 'var(--c-bg)' }}>

        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--f-ui)', fontWeight: 700, fontSize: 20, color: 'var(--c-text)' }}>{area}</h1>
            <p style={{ fontSize: 13, color: 'var(--c-text-sm)', marginTop: 4, fontFamily: 'var(--f-body)' }}>Mumbai · Neighborhood Intelligence Report</p>
          </div>
          <div className="nri-glow" style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#F4EAD8', border: '1px solid #C8A870',
            borderRadius: 12, padding: '10px 16px',
          }}>
            <span style={{ fontSize: 18 }}>✈</span>
            <div>
              <div style={{ fontFamily: 'var(--f-ui)', fontWeight: 700, fontSize: 11, color: '#7A5030', textTransform: 'uppercase', letterSpacing: '0.08em' }}>NRI Score</div>
              <div style={{ fontFamily: 'var(--f-mono)', fontWeight: 500, fontSize: 18, color: '#A07048', lineHeight: 1 }}>96/100</div>
            </div>
          </div>
        </div>

        {/* Intelligence scores */}
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--c-text-sm)', fontFamily: 'var(--f-ui)', marginBottom: 12 }}>Intelligence Scores</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          {SCORES.map(s => (
            <div key={s.label} className="scene" style={{ height: 110 }}>
              <div className="card-3d">
                {/* Front */}
                <div className="face" style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', padding: 16, boxShadow: '0 2px 8px rgba(14,30,32,.06)' }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ fontFamily: 'var(--f-ui)', fontWeight: 700, fontSize: 12, color: 'var(--c-text-md)' }}>{s.label}</div>
                    <div style={{ fontFamily: 'var(--f-mono)', fontWeight: 500, fontSize: 18, color: s.color }}>{s.val}</div>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${s.val}%`, background: s.color }} />
                  </div>
                </div>
                {/* Back */}
                <div className="face face-back" style={{ padding: 16, color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: `linear-gradient(135deg,${s.color},${s.color}cc)` }}>
                  <div style={{ fontFamily: 'var(--f-ui)', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: 30, fontWeight: 500, marginBottom: 4 }}>{s.val}</div>
                  <div style={{ fontSize: 10, opacity: 0.8 }}>vs city avg: {Math.max(s.val - 12, 40)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Infrastructure */}
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--c-text-sm)', fontFamily: 'var(--f-ui)', marginBottom: 12 }}>Infrastructure Quality</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {INFRA.map(item => (
            <div key={item.label} className="stat-3d" style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: 12, padding: 16, boxShadow: '0 2px 8px rgba(14,30,32,.04)' }}>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 22, fontWeight: 500, color: 'var(--c-text)' }}>
                {item.val}<span style={{ fontSize: 11, color: 'var(--c-text-sm)', marginLeft: 2 }}>{item.unit}</span>
              </div>
              <div style={{ fontFamily: 'var(--f-ui)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--c-text-sm)', marginTop: 4 }}>{item.label}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8, fontSize: 10, fontWeight: 600, color: item.good ? '#0E5860' : '#9A2A18' }}>
                <span>{item.good ? '↑' : '↓'}</span><span>{item.good ? 'Good' : 'Concern'}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Amenities */}
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--c-text-sm)', fontFamily: 'var(--f-ui)', marginBottom: 12 }}>Nearby Amenities</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
          {AMENITIES.map(am => (
            <div key={am.cat} className="stat-3d" style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: 12, padding: 16, boxShadow: '0 2px 8px rgba(14,30,32,.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontFamily: 'var(--f-ui)', fontWeight: 700, fontSize: 13, color: 'var(--c-text)' }}>{am.cat}</div>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 13, fontWeight: 500, color: 'var(--c-primary)' }}>{am.count}</div>
              </div>
              {am.items.map(n => (
                <div key={n} style={{ fontSize: 11, color: 'var(--c-text-sm)', fontFamily: 'var(--f-body)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>· {n}</div>
              ))}
            </div>
          ))}
        </div>

        {/* Upcoming development */}
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--c-text-sm)', fontFamily: 'var(--f-ui)', marginBottom: 12 }}>Upcoming Development</div>
        <div style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(14,30,32,.04)' }}>
          {[
            { proj: 'Metro Line 3 Extension',   eta: '2026', impact: 'High',      color: '#0E5860' },
            { proj: 'BKC–Bandra Tunnel Road',   eta: '2027', impact: 'Very High', color: '#1A6870' },
            { proj: 'Coastal Road Phase 2',      eta: '2025', impact: 'High',      color: '#2A8050' },
            { proj: 'New Commercial Hub, BKC',  eta: '2028', impact: 'Medium',    color: '#8B6914' },
          ].map((d, i, arr) => (
            <div
              key={d.proj}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 20px',
                borderBottom: i < arr.length - 1 ? '1px solid var(--c-bg)' : 'none',
              }}
            >
              <div style={{ fontFamily: 'var(--f-ui)', fontWeight: 500, fontSize: 13, color: 'var(--c-text)' }}>{d.proj}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--c-text-sm)' }}>{d.eta}</span>
                <span style={{ fontSize: 10, fontWeight: 700, borderRadius: 999, padding: '2px 8px', background: d.color + '20', color: d.color }}>{d.impact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
