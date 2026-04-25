import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { PROPS, PIN_COLOR, STS, type PropType } from '../data';
import Badge from './Badge';

type FilterType = 'all' | PropType;

export default function PropertyExplorer() {
  const mapRef  = useRef<HTMLDivElement>(null);
  const mapInst = useRef<L.Map | null>(null);
  const [selId,      setSelId]      = useState(1);
  const [filterType, setFilterType] = useState<FilterType>('all');

  const filtered = filterType === 'all' ? PROPS : PROPS.filter(p => p.type === filterType);
  const sel = PROPS.find(p => p.id === selId);

  useEffect(() => {
    if (mapInst.current || !mapRef.current) return;

    const map = L.map(mapRef.current, { zoomControl: false, attributionControl: true })
      .setView([19.0760, 72.8500], 13);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a> © <a href="https://carto.com">CARTO</a>',
      subdomains: 'abcd', maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    PROPS.forEach(prop => {
      const color = PIN_COLOR[prop.type];
      const icon = L.divIcon({
        className: '',
        html: `<div style="position:relative;cursor:pointer">
          <div style="position:absolute;top:-22px;left:50%;transform:translateX(-50%);background:#FBF7F0;border-radius:5px;padding:2px 7px;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,.14);color:#0E1E20;border:1px solid #CEBFAC">${prop.price}</div>
          <div style="width:30px;height:38px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${color};border:2.5px solid #FBF7F0;box-shadow:0 3px 12px ${color}66;display:flex;align-items:center;justify-content:center">
            <div style="transform:rotate(45deg);width:9px;height:9px;border-radius:50%;background:#FBF7F0"></div>
          </div>
        </div>`,
        iconSize:     [30, 38],
        iconAnchor:   [15, 38],
        popupAnchor:  [0, -44],
      });

      const st = STS[prop.type];
      const popupHtml = `<div style="font-family:'DM Sans',sans-serif">
        <div style="background:linear-gradient(135deg,#1A6870,#104E58);padding:14px 16px">
          <div style="font-weight:700;font-size:13px;color:white;margin-bottom:2px">${prop.title}, ${prop.config}</div>
          <div style="font-size:11px;color:rgba(255,255,255,.7)">${prop.loc} · Mumbai</div>
          <div style="background:#FBF7F0;border-radius:7px;padding:5px 10px;display:inline-block;margin-top:9px">
            <div style="font-family:'JetBrains Mono',monospace;font-size:17px;font-weight:500;color:#1A6870">${prop.price}</div>
          </div>
        </div>
        <div style="padding:12px 14px">
          ${[['Area', prop.area], ['Floor', prop.floor], ['Age', prop.age], ['₹/sq ft', prop.psf]].map(([k, v]) => `
            <div style="display:flex;justify-content:space-between;margin-bottom:6px">
              <span style="font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#6A9098">${k}</span>
              <span style="font-size:12px;font-weight:500;color:#0E1E20">${v}</span>
            </div>`).join('')}
          <span style="background:${st.bg};color:${st.c};font-size:11px;font-weight:600;border-radius:999px;padding:3px 9px">${st.lbl}</span>
          <button style="width:100%;background:#1A6870;color:white;border:none;border-radius:8px;padding:9px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;cursor:pointer;margin-top:10px">View Full Details</button>
        </div>
      </div>`;

      const marker = L.marker([prop.lat, prop.lng], { icon }).addTo(map);
      marker.bindPopup(L.popup({ closeButton: false }).setContent(popupHtml));
      marker.on('click', () => setSelId(prop.id));
    });

    mapInst.current = map;
  }, []);

  const tabs: [FilterType, string][] = [['all', 'All'], ['verified', 'Verified'], ['alert', 'Alerts'], ['premium', 'Premium']];

  return (
    <div className="screen-in" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

      {/* ── Sidebar ── */}
      <div style={{
        width: 300, flexShrink: 0,
        background: 'var(--c-surface)',
        borderRight: '1px solid var(--c-border)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: '12px 16px 0', borderBottom: '1px solid var(--c-border)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontFamily: 'var(--f-ui)', fontWeight: 600, fontSize: 13, color: 'var(--c-text)' }}>
              <span style={{ fontFamily: 'var(--f-mono)', color: 'var(--c-primary)' }}>{filtered.length}</span> properties
            </div>
            <div style={{ fontSize: 11, color: 'var(--c-text-sm)', fontFamily: 'var(--f-ui)' }}>Mumbai</div>
          </div>
          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 10 }}>
            <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--c-text-sm)' }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              style={{
                width: '100%',
                background: 'var(--c-bg)',
                border: '1px solid var(--c-border)',
                borderRadius: 8, padding: '6px 12px 6px 30px',
                fontFamily: 'var(--f-body)', fontSize: 13,
                color: 'var(--c-text)', outline: 'none',
              }}
              placeholder="Search properties, areas…"
            />
          </div>
          {/* Tabs */}
          <div style={{ display: 'flex' }}>
            {tabs.map(([id, lbl]) => (
              <button
                key={id}
                onClick={() => setFilterType(id)}
                style={{
                  padding: '7px 10px',
                  fontSize: 11, fontWeight: 600,
                  fontFamily: 'var(--f-ui)',
                  color: filterType === id ? 'var(--c-primary)' : 'var(--c-text-sm)',
                  borderBottom: filterType === id ? '2px solid var(--c-primary)' : '2px solid transparent',
                  background: 'none', border: 'none', cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >{lbl}</button>
            ))}
          </div>
        </div>

        {/* Sort row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 16px',
          background: 'var(--c-bg)',
          borderBottom: '1px solid var(--c-border)',
          fontSize: 11, flexShrink: 0,
        }}>
          <span style={{ color: 'var(--c-text-sm)', fontFamily: 'var(--f-ui)' }}>Sort:</span>
          <span style={{ color: 'var(--c-primary)', fontWeight: 600, fontFamily: 'var(--f-ui)', cursor: 'pointer' }}>Price ↓</span>
          <span style={{ flex: 1 }} />
          <span style={{ color: 'var(--c-text-sm)', fontFamily: 'var(--f-ui)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="9" y2="18"/>
            </svg>
            Filter
          </span>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filtered.map(p => {
            const isActive = p.id === selId;
            return (
              <div
                key={p.id}
                onClick={() => setSelId(p.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px',
                  cursor: 'pointer',
                  borderBottom: '1px solid var(--c-border)',
                  borderLeft: `3px solid ${isActive ? 'var(--c-primary)' : 'transparent'}`,
                  background: isActive ? 'var(--c-primary-lt)' : 'var(--c-surface)',
                  transition: 'background 120ms',
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20,
                  background: isActive ? '#B8DDE0' : 'var(--c-surface-alt)',
                }}>🏢</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--f-ui)', fontWeight: 600, fontSize: 13, color: 'var(--c-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--c-text-sm)', marginTop: 2 }}>{p.loc} · {p.area}</div>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: 13, fontWeight: 500, color: 'var(--c-primary)', marginTop: 2 }}>{p.price}</div>
                </div>
                <Badge type={p.type} sm />
              </div>
            );
          })}
        </div>

        {/* Selected detail strip */}
        {sel && (
          <div style={{
            borderTop: '1px solid var(--c-border)',
            background: 'var(--c-surface)',
            padding: 16, flexShrink: 0,
          }}>
            <div style={{ fontFamily: 'var(--f-ui)', fontWeight: 600, fontSize: 13, color: 'var(--c-text)', marginBottom: 8 }}>
              {sel.title}, {sel.config}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px', marginBottom: 12 }}>
              {[['Price', sel.price], ['Area', sel.area], ['Floor', sel.floor], ['₹/sq ft', sel.psf]].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--c-text-sm)', fontFamily: 'var(--f-ui)' }}>{k}</div>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--c-text)', marginTop: 1 }}>{v}</div>
                </div>
              ))}
            </div>
            <button style={{
              width: '100%', background: 'var(--c-primary)', color: '#FBF7F0',
              border: 'none', borderRadius: 8, padding: '8px 0',
              fontSize: 13, fontWeight: 600, fontFamily: 'var(--f-ui)', cursor: 'pointer',
            }}>View Details</button>
          </div>
        )}
      </div>

      {/* ── Map ── */}
      <div style={{ flex: 1, position: 'relative' }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

        {/* Glass search bar */}
        <div className="glass" style={{
          position: 'absolute', top: 16, left: 16, right: 80,
          zIndex: 1000, borderRadius: 12,
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '10px 16px',
          boxShadow: '0 2px 14px rgba(0,0,0,.1)',
        }}>
          <svg style={{ color: 'var(--c-text-sm)', flexShrink: 0 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            style={{
              flex: 1, background: 'transparent',
              fontFamily: 'var(--f-body)', fontSize: 14,
              color: 'var(--c-text)', outline: 'none',
              border: 'none',
            }}
            placeholder="Search areas, landmarks, pin codes…"
          />
          <span style={{
            fontFamily: 'var(--f-mono)', fontSize: 10,
            background: 'var(--c-bg)', border: '1px solid var(--c-border)',
            borderRadius: 4, padding: '2px 5px', color: 'var(--c-text-sm)',
          }}>⌘K</span>
        </div>

        {/* Filter pills */}
        <div style={{ position: 'absolute', top: 66, left: 16, zIndex: 1000, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {([['All', 'var(--c-primary)', true], ['✓ Verified', '#0E5860', false], ['★ Premium', '#7A5030', false], ['⚠ Alert', '#9A2A18', false], ['2–3 BHK', 'var(--c-text-md)', false]] as [string, string, boolean][]).map(([lbl, c, active]) => (
            <button
              key={lbl}
              className="glass"
              style={{
                borderRadius: 999, padding: '6px 12px',
                fontSize: 12, fontWeight: 600,
                fontFamily: 'var(--f-ui)',
                color:      active ? '#FBF7F0' : 'var(--c-text-md)',
                background: active ? c : 'rgba(251,247,240,.82)',
                border: `1.5px solid ${active ? c : 'rgba(251,247,240,.6)'}`,
                cursor: 'pointer',
              }}
            >{lbl}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
