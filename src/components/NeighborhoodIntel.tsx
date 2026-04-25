import { useState, useEffect, useRef } from 'react';
import { apiClient } from '../lib/apiClient';

// ── Types ─────────────────────────────────────────────────────────────────────

interface AmenityCounts {
  school: number;
  hospital: number;
  pharmacy: number;
  supermarket: number;
  shopping_mall: number;
  park: number;
  bank: number;
  transit: number;
}

interface DriveTimes {
  airport?: number;
  gift?: number;
  railway?: number;
  sg_highway?: number;
}

interface NeighborhoodData {
  score: number;
  persona: string;
  subScores: {
    safety: number;
    aqi: number;
    amenity: number;
    connectivity: number;
    futureGrowth: number;
    builder: number;
  };
  sources: {
    safety:       { score: number; source: string; error?: string };
    aqi:          { score: number; value: number; stationName: string; source: string };
    amenity:      { score: number; counts: AmenityCounts; source: string };
    connectivity: { score: number; driveTimes: DriveTimes; city: string; source: string };
    futureGrowth: { score: number; nearestFeature: string; featureType: string; expectedYear: number; distanceKm: number; source: string };
    builder:      { score: number; name: string; projectsDelivered: number; complaintsCount: number; avgDelayMonths: number; source: string };
  };
  weights: Record<string, number>;
  input: { lat: number; lng: number; builderId: string; locality: string };
  computedAt: string;
}

type SubKey = keyof NeighborhoodData['subScores'];

// ── Area presets ──────────────────────────────────────────────────────────────

const AREAS = [
  { label: 'Vastrapur',      lat: 23.0395, lng: 72.5260, builderId: '69ec961a569e44de32952277' },
  { label: 'Bandra West',    lat: 19.0596, lng: 72.8295, builderId: '69ec961a569e44de32952277' },
  { label: 'Khar West',      lat: 19.0728, lng: 72.8369, builderId: '69ec961a569e44de32952277' },
  { label: 'Santacruz West', lat: 19.0820, lng: 72.8360, builderId: '69ec961a569e44de32952277' },
  { label: 'Juhu',           lat: 19.1075, lng: 72.8263, builderId: '69ec961a569e44de32952277' },
  { label: 'Andheri West',   lat: 19.1197, lng: 72.8464, builderId: '69ec961a569e44de32952277' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function scoreColor(val: number): string {
  if (val >= 85) return '#0E5860';
  if (val >= 70) return '#1A6870';
  if (val >= 55) return '#8B6914';
  return '#9A2A18';
}

const SCORE_META: Record<SubKey, { label: string; icon: string; backFn: (d: NeighborhoodData) => string }> = {
  safety:       { label: 'Safety',        icon: '🛡', backFn: d => d.sources.safety.error ? 'News sentiment analysis' : d.sources.safety.source },
  aqi:          { label: 'Air Quality',   icon: '🌿', backFn: d => `AQI ${d.sources.aqi.value} · ${d.sources.aqi.stationName.split(',')[0]}` },
  amenity:      { label: 'Amenities',     icon: '🏪', backFn: d => `${Object.values(d.sources.amenity.counts).reduce((a, b) => a + b, 0)} places nearby` },
  connectivity: { label: 'Connectivity',  icon: '🚇', backFn: d => `Airport ${d.sources.connectivity.driveTimes.airport ?? '—'} min drive` },
  futureGrowth: { label: 'Future Growth', icon: '📈', backFn: d => `${d.sources.futureGrowth.nearestFeature} · ${d.sources.futureGrowth.expectedYear}` },
  builder:      { label: 'Builder Trust', icon: '🏗', backFn: d => `${d.sources.builder.name} · ${d.sources.builder.projectsDelivered} projects` },
};

const SUB_KEYS: SubKey[] = ['safety', 'aqi', 'amenity', 'connectivity', 'futureGrowth', 'builder'];

const AMENITY_META: { key: keyof AmenityCounts; label: string; icon: string }[] = [
  { key: 'hospital',      label: 'Hospitals',    icon: '🏥' },
  { key: 'school',        label: 'Schools',      icon: '🏫' },
  { key: 'park',          label: 'Parks',        icon: '🌳' },
  { key: 'supermarket',   label: 'Supermarkets', icon: '🛒' },
  { key: 'shopping_mall', label: 'Malls',        icon: '🏬' },
  { key: 'transit',       label: 'Transit',      icon: '🚌' },
  { key: 'pharmacy',      label: 'Pharmacies',   icon: '💊' },
  { key: 'bank',          label: 'Banks',        icon: '🏦' },
];

const DRIVE_META: { key: keyof DriveTimes; label: string; icon: string; goodThreshold: number }[] = [
  { key: 'airport',    label: 'Airport',     icon: '✈',  goodThreshold: 30 },
  { key: 'railway',    label: 'Railway Stn', icon: '🚆', goodThreshold: 15 },
  { key: 'sg_highway', label: 'SG Highway',  icon: '🛣', goodThreshold: 10 },
  { key: 'gift',       label: 'GIFT City',   icon: '🏙', goodThreshold: 40 },
];

// ── Skeleton ──────────────────────────────────────────────────────────────────

function Skeleton({ h = 110, r = 14 }: { h?: number; r?: number }) {
  return (
    <div style={{
      height: h, borderRadius: r,
      background: 'var(--c-surface)',
      border: '1px solid var(--c-border)',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(90deg, transparent, rgba(206,191,172,.3), transparent)',
        animation: 'shimmer 1.4s infinite',
      }} />
    </div>
  );
}

// ── Section Label ─────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '0.14em',
      textTransform: 'uppercase', color: 'var(--c-text-sm)',
      fontFamily: 'var(--f-ui)', marginBottom: 12,
    }}>
      {children}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function NeighborhoodIntel() {
  const [selArea, setSelArea] = useState(AREAS[0]);
  const [data, setData]       = useState<NeighborhoodData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const abortRef              = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setLoading(true);
    setError(null);

    apiClient
      .post<NeighborhoodData>(
        '/neighborhood/score',
        { lat: selArea.lat, lng: selArea.lng, builderId: selArea.builderId, locality: selArea.label },
        { signal: ctrl.signal },
      )
      .then(res => { setData(res.data); setLoading(false); })
      .catch(err => {
        if (err.name === 'CanceledError' || err.name === 'AbortError') return;
        setError('Failed to load neighborhood data. Please try again.');
        setLoading(false);
      });

    return () => ctrl.abort();
  }, [selArea]);

  const city = data?.sources.connectivity.city ?? selArea.label;

  return (
    <div className="screen-in" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

      {/* ── shimmer keyframe ── */}
      <style>{`@keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }`}</style>

      {/* ── Area nav ── */}
      <div style={{ width: 192, flexShrink: 0, background: 'var(--c-bg)', borderRight: '1px solid var(--c-border)', paddingTop: 16 }}>
        <div style={{ padding: '0 16px', marginBottom: 8, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--c-text-sm)', fontFamily: 'var(--f-ui)' }}>
          Areas
        </div>

        {AREAS.map(a => (
          <div
            key={a.label}
            onClick={() => setSelArea(a)}
            style={{
              padding: '10px 16px', cursor: 'pointer',
              fontFamily: 'var(--f-ui)', fontWeight: 600, fontSize: 13,
              color:      selArea.label === a.label ? 'var(--c-primary)' : 'var(--c-text-md)',
              background: selArea.label === a.label ? 'var(--c-primary-lt)' : 'transparent',
              borderLeft: `3px solid ${selArea.label === a.label ? 'var(--c-primary)' : 'transparent'}`,
              transition: 'all 120ms',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}
          >
            <span>{a.label}</span>
            {loading && selArea.label === a.label && (
              <span className="blink" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--c-primary)', display: 'inline-block' }} />
            )}
          </div>
        ))}
      </div>

      {/* ── Main content ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 24, background: 'var(--c-bg)' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--f-ui)', fontWeight: 700, fontSize: 20, color: 'var(--c-text)' }}>
              {selArea.label}
            </h1>
            <p style={{ fontSize: 13, color: 'var(--c-text-sm)', marginTop: 4, fontFamily: 'var(--f-body)' }}>
              {city} · Neighborhood Intelligence Report
            </p>
          </div>

          {/* Overall score badge */}
          <div className="nri-glow" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: '#F4EAD8', border: '1px solid #C8A870',
            borderRadius: 12, padding: '10px 16px',
            opacity: loading ? 0.6 : 1, transition: 'opacity 300ms',
          }}>
            <span style={{ fontSize: 20 }}>{data?.persona === 'investor' ? '💼' : '✈'}</span>
            <div>
              <div style={{ fontFamily: 'var(--f-ui)', fontWeight: 700, fontSize: 11, color: '#7A5030', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {data?.persona === 'investor' ? 'Investor Score' : 'NRI Score'}
              </div>
              <div style={{ fontFamily: 'var(--f-mono)', fontWeight: 500, fontSize: 18, color: '#A07048', lineHeight: 1 }}>
                {data ? `${data.score}/100` : '—/100'}
              </div>
            </div>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div style={{
            background: '#FCEAE4', border: '1px solid #F0C0B0', borderRadius: 12,
            padding: '12px 16px', marginBottom: 20,
            display: 'flex', alignItems: 'center', gap: 10,
            fontFamily: 'var(--f-ui)', fontSize: 13, color: '#9A2A18',
          }}>
            <span>⚠</span>
            <span style={{ flex: 1 }}>{error}</span>
            <button
              onClick={() => setSelArea({ ...selArea })}
              style={{
                background: 'none', border: '1px solid #9A2A18', borderRadius: 8,
                padding: '4px 10px', fontSize: 12, color: '#9A2A18',
                cursor: 'pointer', fontFamily: 'var(--f-ui)',
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* ── Intelligence Scores ── */}
        <SectionLabel>Intelligence Scores</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          {loading
            ? SUB_KEYS.map(k => <Skeleton key={k} />)
            : data ? SUB_KEYS.map(key => {
                const val    = data.subScores[key];
                const meta   = SCORE_META[key];
                const color  = scoreColor(val);
                const weight = data.weights[key];
                return (
                  <div key={key} className="scene" style={{ height: 110 }}>
                    <div className="card-3d">
                      {/* Front */}
                      <div className="face" style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', padding: 16, boxShadow: '0 2px 8px rgba(14,30,32,.06)' }}>
                        <div style={{ fontSize: 22, marginBottom: 6 }}>{meta.icon}</div>
                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 8 }}>
                          <div style={{ fontFamily: 'var(--f-ui)', fontWeight: 700, fontSize: 11, color: 'var(--c-text-md)' }}>{meta.label}</div>
                          <div style={{ fontFamily: 'var(--f-mono)', fontWeight: 500, fontSize: 18, color }}>{val}</div>
                        </div>
                        <div className="progress-track">
                          <div className="progress-fill" style={{ width: `${val}%`, background: color }} />
                        </div>
                      </div>
                      {/* Back */}
                      <div className="face face-back" style={{ padding: 14, color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: `linear-gradient(135deg,${color},${color}cc)` }}>
                        <div style={{ fontFamily: 'var(--f-ui)', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{meta.label}</div>
                        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 28, fontWeight: 500, marginBottom: 6 }}>{val}</div>
                        <div style={{ fontSize: 10, opacity: 0.8, marginBottom: 2 }}>{meta.backFn(data)}</div>
                        <div style={{ fontSize: 9, opacity: 0.55 }}>weight {Math.round(weight * 100)}%</div>
                      </div>
                    </div>
                  </div>
                );
              }) : null}
        </div>

        {/* ── Connectivity / Drive Times ── */}
        <SectionLabel>Connectivity · Drive Times</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {loading
            ? DRIVE_META.map(m => <Skeleton key={m.key} h={90} r={12} />)
            : data ? DRIVE_META.map(m => {
                const val    = data.sources.connectivity.driveTimes[m.key];
                const isGood = val !== undefined ? val <= m.goodThreshold : true;
                return (
                  <div key={m.key} className="stat-3d" style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: 12, padding: 16, boxShadow: '0 2px 8px rgba(14,30,32,.04)' }}>
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{m.icon}</div>
                    <div style={{ fontFamily: 'var(--f-mono)', fontSize: 20, fontWeight: 500, color: 'var(--c-text)' }}>
                      {val !== undefined ? val : '—'}
                      <span style={{ fontSize: 10, color: 'var(--c-text-sm)', marginLeft: 2 }}>min</span>
                    </div>
                    <div style={{ fontFamily: 'var(--f-ui)', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--c-text-sm)', marginTop: 2 }}>{m.label}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6, fontSize: 10, fontWeight: 600, color: isGood ? '#0E5860' : '#8B6914' }}>
                      <span>{isGood ? '↑' : '→'}</span>
                      <span>{isGood ? 'Good' : 'Moderate'}</span>
                    </div>
                  </div>
                );
              }) : null}
        </div>

        {/* ── Nearby Amenities ── */}
        <SectionLabel>Nearby Amenities</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {loading
            ? AMENITY_META.map(m => <Skeleton key={m.key} h={80} r={12} />)
            : data ? AMENITY_META.map(m => {
                const count = data.sources.amenity.counts[m.key];
                return (
                  <div key={m.key} className="stat-3d" style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: 12, padding: 14, boxShadow: '0 2px 8px rgba(14,30,32,.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ fontSize: 18 }}>{m.icon}</div>
                      <div style={{ fontFamily: 'var(--f-mono)', fontSize: 18, fontWeight: 500, color: count > 0 ? 'var(--c-primary)' : 'var(--c-text-sm)' }}>{count}</div>
                    </div>
                    <div style={{ fontFamily: 'var(--f-ui)', fontWeight: 700, fontSize: 11, color: 'var(--c-text-md)', marginTop: 8 }}>{m.label}</div>
                    <div style={{ fontSize: 9, fontWeight: 600, marginTop: 4, color: count > 0 ? '#0E5860' : 'var(--c-text-sm)' }}>
                      {count > 0 ? '↑ Available' : '— Not found'}
                    </div>
                  </div>
                );
              }) : null}
        </div>

        {/* ── Future Growth ── */}
        <SectionLabel>Future Growth</SectionLabel>
        <div style={{
          borderRadius: 12, overflow: 'hidden', marginBottom: 24,
          ...( (loading || data) ? {
            background: 'var(--c-surface)',
            border: '1px solid var(--c-border)',
            boxShadow: '0 2px 8px rgba(14,30,32,.04)',
          } : {} )
        }}>
          {loading
            ? <div style={{ padding: 20 }}><Skeleton h={40} r={8} /></div>
            : data ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px' }}>
                <div>
                  <div style={{ fontFamily: 'var(--f-ui)', fontWeight: 600, fontSize: 13, color: 'var(--c-text)' }}>
                    {data.sources.futureGrowth.nearestFeature}
                  </div>
                  <div style={{ fontFamily: 'var(--f-body)', fontSize: 11, color: 'var(--c-text-sm)', marginTop: 3 }}>
                    {data.sources.futureGrowth.distanceKm === 0 ? 'Within locality' : `${data.sources.futureGrowth.distanceKm} km away`}
                    {' · '}{data.sources.futureGrowth.featureType.charAt(0).toUpperCase() + data.sources.futureGrowth.featureType.slice(1)} infrastructure
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--c-text-sm)' }}>
                    {data.sources.futureGrowth.expectedYear}
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 700, borderRadius: 999, padding: '2px 8px', background: '#0E586020', color: '#0E5860' }}>
                    Very High
                  </span>
                </div>
              </div>
            ) : null}
        </div>

        {/* ── Builder Reputation ── */}
        <SectionLabel>Builder Reputation</SectionLabel>
        <div style={{
          borderRadius: 12, overflow: 'hidden', marginBottom: 24,
          ...( (loading || data) ? {
            background: 'var(--c-surface)',
            border: '1px solid var(--c-border)',
            boxShadow: '0 2px 8px rgba(14,30,32,.04)',
          } : {} )
        }}>
          {loading
            ? <div style={{ padding: 20 }}><Skeleton h={60} r={8} /></div>
            : data ? (
              <>
                {/* Builder header row */}
                <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--c-bg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--f-ui)', fontWeight: 700, fontSize: 14, color: 'var(--c-text)' }}>
                      {data.sources.builder.name}
                    </div>
                    <div style={{ fontFamily: 'var(--f-body)', fontSize: 11, color: 'var(--c-text-sm)', marginTop: 2 }}>
                      {data.sources.builder.source}
                    </div>
                  </div>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: 24, fontWeight: 500, color: scoreColor(data.sources.builder.score) }}>
                    {data.sources.builder.score}
                    <span style={{ fontSize: 12, opacity: 0.45 }}>/100</span>
                  </div>
                </div>

                {/* Builder stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  {[
                    { label: 'Projects Delivered', val: data.sources.builder.projectsDelivered, unit: '',    good: true },
                    { label: 'Complaints Filed',   val: data.sources.builder.complaintsCount,   unit: '',    good: data.sources.builder.complaintsCount < 10 },
                    { label: 'Avg Delay',          val: data.sources.builder.avgDelayMonths,    unit: ' mo', good: data.sources.builder.avgDelayMonths < 6 },
                  ].map((item, i, arr) => (
                    <div key={item.label} style={{ padding: '14px 20px', borderRight: i < arr.length - 1 ? '1px solid var(--c-bg)' : 'none' }}>
                      <div style={{ fontFamily: 'var(--f-mono)', fontSize: 22, fontWeight: 500, color: 'var(--c-text)' }}>
                        {item.val}<span style={{ fontSize: 11, color: 'var(--c-text-sm)' }}>{item.unit}</span>
                      </div>
                      <div style={{ fontFamily: 'var(--f-ui)', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--c-text-sm)', marginTop: 4 }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: item.good ? '#0E5860' : '#8B6914', marginTop: 6 }}>
                        {item.good ? '↑ Good' : '→ Moderate'}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : null}
        </div>

        {/* Data freshness */}
        {data && (
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: 'var(--c-text-sm)', textAlign: 'right' }}>
            Computed {new Date(data.computedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
          </div>
        )}
      </div>
    </div>
  );
}
