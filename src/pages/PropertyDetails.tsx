import { Link, Navigate, useParams } from 'react-router-dom';
import Badge from '../components/Badge';
import { PROPS } from '../data';

const SCORES = [
  { label: 'Safety', val: 91, color: '#0E5860', icon: '🛡' },
  { label: 'Infrastructure', val: 80, color: '#1A6870', icon: '🏗' },
  { label: 'Environment', val: 84, color: '#2A8050', icon: '🌿' },
  { label: 'Connectivity', val: 88, color: '#A07048', icon: '🚇' },
  { label: 'Future Growth', val: 76, color: '#104E58', icon: '📈' },
  { label: 'NRI Suitability', val: 94, color: '#7A5030', icon: '✈' },
];

const AMENITIES = [
  { cat: 'Schools', count: 14, items: ['St. Andrews High', 'Holy Family', 'Jamnabai Narsee'] },
  { cat: 'Hospitals', count: 7, items: ['Lilavati Hospital', 'Holy Family Hospital', 'Bandra Maternity'] },
  { cat: 'Transport', count: 8, items: ['Bandra W Station', 'Metro Line 2', 'BEST Bus Depot'] },
];

export default function PropertyDetails() {
  const { propertyId } = useParams();
  const id = Number(propertyId);
  const property = PROPS.find(item => item.id === id);

  if (!property) {
    return <Navigate to="/property-explorer" replace />;
  }

  return (
    <div className="screen-in" style={{ flex: 1, overflowY: 'auto', background: 'var(--c-bg)', padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--f-ui)', fontWeight: 700, fontSize: 22, color: 'var(--c-text)' }}>
            {property.title}
          </h1>
          <p style={{ marginTop: 4, color: 'var(--c-text-sm)', fontFamily: 'var(--f-body)', fontSize: 13 }}>
            {property.loc} · {property.config} · {property.area}
          </p>
        </div>
        <Link
          to={`/neighborhood-intel?name=${encodeURIComponent(property.loc)}&lat=${property.lat}&lon=${property.lng}`}
          style={{
            textDecoration: 'none',
            fontFamily: 'var(--f-ui)',
            fontWeight: 700,
            fontSize: 12,
            color: '#FBF7F0',
            background: 'var(--c-primary)',
            borderRadius: 999,
            padding: '8px 14px',
          }}
        >
          Open Neighborhood Intel
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 12, marginBottom: 20 }}>
        <div className="glass" style={{ borderRadius: 12, padding: 12, border: '1px solid var(--c-border)' }}>
          <div style={{ fontSize: 10, color: 'var(--c-text-sm)', fontFamily: 'var(--f-ui)', marginBottom: 4 }}>Price</div>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 18, color: 'var(--c-primary)' }}>{property.price}</div>
        </div>
        <div className="glass" style={{ borderRadius: 12, padding: 12, border: '1px solid var(--c-border)' }}>
          <div style={{ fontSize: 10, color: 'var(--c-text-sm)', fontFamily: 'var(--f-ui)', marginBottom: 4 }}>Price/sq ft</div>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 18, color: 'var(--c-text)' }}>{property.psf}</div>
        </div>
        <div className="glass" style={{ borderRadius: 12, padding: 12, border: '1px solid var(--c-border)' }}>
          <div style={{ fontSize: 10, color: 'var(--c-text-sm)', fontFamily: 'var(--f-ui)', marginBottom: 4 }}>Floor</div>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 18, color: 'var(--c-text)' }}>{property.floor}</div>
        </div>
        <div className="glass" style={{ borderRadius: 12, padding: 12, border: '1px solid var(--c-border)' }}>
          <div style={{ fontSize: 10, color: 'var(--c-text-sm)', fontFamily: 'var(--f-ui)', marginBottom: 4 }}>Property Age</div>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 18, color: 'var(--c-text)' }}>{property.age}</div>
        </div>
        <div className="glass" style={{ borderRadius: 12, padding: 12, border: '1px solid var(--c-border)' }}>
          <div style={{ fontSize: 10, color: 'var(--c-text-sm)', fontFamily: 'var(--f-ui)', marginBottom: 4 }}>Status</div>
          <div style={{ marginTop: 2 }}>
            <Badge type={property.type} />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 12, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--c-text-sm)', fontFamily: 'var(--f-ui)' }}>
        Neighborhood Intelligence
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12, marginBottom: 20 }}>
        {SCORES.map(score => (
          <div key={score.label} className="stat-3d" style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>{score.icon}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ fontFamily: 'var(--f-ui)', fontWeight: 700, fontSize: 12, color: 'var(--c-text-md)' }}>{score.label}</div>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 16, color: score.color }}>{score.val}</div>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${score.val}%`, background: score.color }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 12, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--c-text-sm)', fontFamily: 'var(--f-ui)' }}>
        Nearby Amenities
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
        {AMENITIES.map(am => (
          <div key={am.cat} className="stat-3d" style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: 12, padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontFamily: 'var(--f-ui)', fontWeight: 700, fontSize: 13, color: 'var(--c-text)' }}>{am.cat}</div>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--c-primary)' }}>{am.count}</div>
            </div>
            {am.items.map(item => (
              <div key={item} style={{ fontFamily: 'var(--f-body)', fontSize: 11, color: 'var(--c-text-sm)' }}>
                · {item}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
