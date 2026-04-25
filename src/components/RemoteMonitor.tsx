import { useState } from 'react';

const MY_PROPS = [
  { id: 1, name: 'Skyline Residency 8F', loc: 'Bandra West', status: 'secure', health: 96 },
  { id: 2, name: 'Oberoi Gardens 4F',    loc: 'Khar West',   status: 'alert',  health: 61 },
];

const CAMS = [
  { id: 0, label: 'Front Entrance', status: 'live',    motion: false },
  { id: 1, label: 'Rear Exit',      status: 'live',    motion: true  },
  { id: 2, label: 'Living Room',    status: 'live',    motion: false },
  { id: 3, label: 'Parking Level',  status: 'offline', motion: false },
];

const SENSORS = [
  { label: 'Temperature', val: '26°C',     icon: '🌡', ok: true  },
  { label: 'Humidity',    val: '62%',      icon: '💧', ok: true  },
  { label: 'Motion',      val: 'Detected', icon: '👁', ok: false },
  { label: 'Door Lock',   val: 'Locked',   icon: '🔒', ok: true  },
  { label: 'Smoke',       val: 'Clear',    icon: '💨', ok: true  },
  { label: 'Electricity', val: 'On',       icon: '⚡', ok: true  },
];

const ALERTS = [
  { time: '14:32', msg: 'Motion detected — Rear Exit',  sev: 'high'   },
  { time: '12:10', msg: 'Temperature spike detected',   sev: 'medium' },
  { time: '09:00', msg: 'Daily inspection passed',      sev: 'low'    },
  { time: '08:45', msg: 'Door locked — auto scheduled', sev: 'low'    },
];

const CAM_GRADS = [
  ['#1A6870', '#0E4048'],
  ['#0E1E20', '#1A6870'],
  ['#104E58', '#1A4850'],
  ['#6A9098', '#3A6068'],
];

export default function RemoteMonitor() {
  const [camSel, setCamSel] = useState(0);
  const [selProp, setSelProp] = useState(1);

  return (
    <div className="screen-in" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

      {/* Left sidebar */}
      <div style={{
        width: 256, flexShrink: 0,
        background: 'var(--c-surface)',
        borderRight: '1px solid var(--c-border)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--c-border)' }}>
          <div style={{ fontFamily: 'var(--f-ui)', fontWeight: 700, fontSize: 14, color: 'var(--c-text)', marginBottom: 2 }}>My Properties</div>
          <div style={{ fontSize: 11, color: 'var(--c-text-sm)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="blink" style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#9A2A18' }} />
            Live monitoring active
          </div>
        </div>

        {MY_PROPS.map(p => (
          <div
            key={p.id}
            onClick={() => setSelProp(p.id)}
            style={{
              padding: '14px 16px',
              borderBottom: '1px solid var(--c-border)',
              borderLeft: `3px solid ${selProp === p.id ? 'var(--c-primary)' : 'transparent'}`,
              background: selProp === p.id ? 'var(--c-primary-lt)' : 'var(--c-surface)',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontFamily: 'var(--f-ui)', fontWeight: 600, fontSize: 12, color: 'var(--c-text)' }}>{p.name}</div>
            <div style={{ fontSize: 11, color: 'var(--c-text-sm)', marginTop: 2 }}>{p.loc}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div className="progress-track" style={{ width: 80 }}>
                  <div className="progress-fill" style={{ width: `${p.health}%`, background: p.health > 75 ? '#0E5860' : p.health > 50 ? '#8B6914' : '#9A2A18' }} />
                </div>
                <span style={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: 'var(--c-text-sm)' }}>{p.health}%</span>
              </div>
              <span style={{
                fontSize: 10, fontWeight: 700, borderRadius: 999, padding: '2px 7px',
                background: p.status === 'secure' ? '#D4EFF2' : '#FCEAE4',
                color:      p.status === 'secure' ? '#0E5860'  : '#9A2A18',
              }}>{p.status === 'secure' ? '✓ Secure' : '⚠ Alert'}</span>
            </div>
          </div>
        ))}

        {/* IoT sensors */}
        <div style={{ padding: '12px 16px 8px' }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--c-text-sm)', fontFamily: 'var(--f-ui)', marginBottom: 10 }}>IoT Sensors</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {SENSORS.map(s => (
              <div key={s.label} className="stat-3d" style={{ background: 'var(--c-bg)', border: '1px solid var(--c-border)', borderRadius: 8, padding: 10 }}>
                <div style={{ fontSize: 16, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12, fontWeight: 500, color: s.ok ? 'var(--c-text)' : '#9A2A18' }}>{s.val}</div>
                <div style={{ fontFamily: 'var(--f-ui)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--c-text-sm)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Alert log */}
        <div style={{ padding: '12px 16px', flex: 1, overflowY: 'auto' }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--c-text-sm)', fontFamily: 'var(--f-ui)', marginBottom: 8 }}>Recent Alerts</div>
          {ALERTS.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%', marginTop: 4, flexShrink: 0,
                background: a.sev === 'high' ? '#9A2A18' : a.sev === 'medium' ? '#8B6914' : '#0E5860',
              }} />
              <div>
                <div style={{ fontFamily: 'var(--f-ui)', fontSize: 11, color: 'var(--c-text)' }}>{a.msg}</div>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: 'var(--c-text-sm)', marginTop: 2 }}>{a.time} today</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Camera grid */}
      <div style={{ flex: 1, background: '#0A1E20', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontFamily: 'var(--f-ui)', fontWeight: 700, color: 'white', fontSize: 14 }}>Skyline Residency 8F — CCTV</span>
            <span style={{
              fontSize: 10, fontWeight: 700,
              background: 'rgba(154,42,24,.2)', color: '#E07868',
              border: '1px solid rgba(154,42,24,.3)',
              borderRadius: 999, padding: '2px 10px',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span className="blink" style={{ width: 6, height: 6, borderRadius: '50%', background: '#E07868', display: 'inline-block' }} />
              LIVE
            </span>
          </div>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'rgba(255,255,255,.4)', display: 'flex', gap: 8 }}>
            <span>4 cameras</span><span>·</span><span>Last sync: just now</span>
          </div>
        </div>

        {/* 2×2 camera grid */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 12, padding: 20, perspective: 1200 }}>
          {CAMS.map((cam, i) => (
            <div
              key={cam.id}
              className="cam-card"
              onClick={() => setCamSel(cam.id)}
              style={{
                borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
                position: 'relative',
                background: `linear-gradient(135deg,${CAM_GRADS[i][0]},${CAM_GRADS[i][1]})`,
                outline: camSel === cam.id ? '2.5px solid var(--c-accent)' : '2.5px solid transparent',
                boxShadow: camSel === cam.id ? '0 0 0 4px rgba(160,112,72,.25)' : 'none',
              }}
            >
              {/* Scan line overlay */}
              <div style={{
                position: 'absolute', inset: 0, opacity: 0.18,
                backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,.05) 2px,rgba(255,255,255,.05) 4px)',
              }} />
              {cam.status === 'offline' && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'rgba(255,255,255,.4)', fontFamily: 'var(--f-ui)', fontWeight: 600, fontSize: 13 }}>● OFFLINE</span>
                </div>
              )}
              {cam.motion && cam.status === 'live' && (
                <div style={{
                  position: 'absolute', top: 12, right: 12,
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'rgba(154,42,24,.9)', borderRadius: 999, padding: '4px 10px',
                }}>
                  <span className="blink" style={{ width: 6, height: 6, borderRadius: '50%', background: 'white', display: 'inline-block' }} />
                  <span style={{ color: 'white', fontSize: 10, fontWeight: 700, fontFamily: 'var(--f-ui)' }}>MOTION</span>
                </div>
              )}
              {cam.status === 'live' && !cam.motion && (
                <div style={{
                  position: 'absolute', top: 12, right: 12,
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'rgba(14,88,96,.8)', borderRadius: 999, padding: '4px 10px',
                }}>
                  <span className="blink" style={{ width: 6, height: 6, borderRadius: '50%', background: 'white', display: 'inline-block' }} />
                  <span style={{ color: 'white', fontSize: 10, fontWeight: 700, fontFamily: 'var(--f-ui)' }}>LIVE</span>
                </div>
              )}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', padding: 12 }}>
                <div>
                  <div style={{ fontFamily: 'var(--f-ui)', fontWeight: 700, color: 'white', fontSize: 12 }}>{cam.label}</div>
                  <div style={{ fontFamily: 'var(--f-mono)', color: 'rgba(255,255,255,.45)', fontSize: 10, marginTop: 2 }}>CAM {cam.id + 1} · {cam.status.toUpperCase()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,.1)', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontFamily: 'var(--f-mono)', color: 'rgba(255,255,255,.4)', fontSize: 11 }}>Recording: Cloud · 30-day retention</div>
          <div style={{ flex: 1 }} />
          <button style={{
            background: 'rgba(255,255,255,.1)', color: 'white',
            border: '1px solid rgba(255,255,255,.15)',
            borderRadius: 8, padding: '6px 12px',
            fontSize: 12, fontWeight: 600, fontFamily: 'var(--f-ui)', cursor: 'pointer',
          }}>⬇ Download Clip</button>
          <button style={{
            background: 'var(--c-primary)', color: '#FBF7F0',
            border: 'none', borderRadius: 8, padding: '6px 12px',
            fontSize: 12, fontWeight: 600, fontFamily: 'var(--f-ui)', cursor: 'pointer',
          }}>Report Incident</button>
        </div>
      </div>
    </div>
  );
}
