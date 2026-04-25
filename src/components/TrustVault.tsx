import { useState } from 'react';

const STEPS = [
  { id: 0, label: 'KYC Verification',   done: true,  active: false, detail: 'Aadhaar + Passport linked'    },
  { id: 1, label: 'FEMA Compliance',    done: true,  active: false, detail: 'RBI permitted transaction'    },
  { id: 2, label: 'Title Search',       done: false, active: true,  detail: 'Checking last 30 years'      },
  { id: 3, label: 'RERA Verification',  done: false, active: false, detail: 'Maharashtra RERA check'       },
  { id: 4, label: 'Encumbrance Check',  done: false, active: false, detail: 'No pending liabilities'      },
  { id: 5, label: 'Registration Ready', done: false, active: false, detail: 'Sub-registrar booking'       },
];

type DocStatus = 'verified' | 'pending' | 'required';

const DOCS: { name: string; status: DocStatus; date: string }[] = [
  { name: 'Passport (NRI)',         status: 'verified', date: 'Jan 2024' },
  { name: 'Aadhaar Card',           status: 'verified', date: 'Jan 2024' },
  { name: 'PAN Card',               status: 'verified', date: 'Jan 2024' },
  { name: 'NRE/NRO Bank Statement', status: 'verified', date: 'Feb 2024' },
  { name: 'Sale Agreement Draft',   status: 'pending',  date: 'Awaiting' },
  { name: 'POA (Power of Attorney)',status: 'required', date: '—'        },
];

const DOC_ST: Record<DocStatus, { bg: string; c: string; lbl: string }> = {
  verified: { bg: '#D4EFF2', c: '#0E5860', lbl: '✓ Verified' },
  pending:  { bg: '#FEF6E0', c: '#8B6914', lbl: '⏳ Pending'  },
  required: { bg: '#FCEAE4', c: '#9A2A18', lbl: '⚠ Required'  },
};

export default function TrustVault() {
  const [step, setStep] = useState(2);

  return (
    <div className="screen-in" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

      {/* Main */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 24, background: 'var(--c-bg)' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--f-ui)', fontWeight: 700, fontSize: 20, color: 'var(--c-text)' }}>NRI Trust Vault</h1>
            <p style={{ fontSize: 13, color: 'var(--c-text-sm)', marginTop: 4, fontFamily: 'var(--f-body)' }}>End-to-end ownership verification for remote buyers</p>
          </div>
          <div className="nri-glow" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: '#F4EAD8', border: '1px solid #C8A870',
            borderRadius: 12, padding: '10px 16px',
          }}>
            <span style={{ fontSize: 22 }}>✈</span>
            <div>
              <div style={{ fontFamily: 'var(--f-ui)', fontWeight: 700, fontSize: 11, color: '#7A5030', textTransform: 'uppercase', letterSpacing: '0.1em' }}>NRI Buyer</div>
              <div style={{ fontFamily: 'var(--f-ui)', fontWeight: 600, fontSize: 13, color: '#A07048' }}>Arjun K. · UK-based</div>
            </div>
          </div>
        </div>

        {/* Trust score card */}
        <div className="float-3d" style={{
          marginBottom: 24, padding: 20, borderRadius: 20, color: 'white',
          position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(135deg,#1A6870,#0A1E20)',
          boxShadow: '0 16px 48px rgba(26,104,112,.35)',
        }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle at 80% 20%, #A07048 0%, transparent 60%)' }} />
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: 'var(--f-ui)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(255,255,255,.6)', marginBottom: 6 }}>Trust Score</div>
              <div style={{ fontFamily: 'var(--f-display)', fontSize: 48, fontWeight: 700, lineHeight: 1 }}>
                78<span style={{ fontSize: 24, color: 'rgba(255,255,255,.5)' }}>/100</span>
              </div>
              <div style={{ fontFamily: 'var(--f-body)', fontSize: 13, color: 'rgba(255,255,255,.65)', marginTop: 8 }}>2 of 6 verifications complete. Title search in progress.</div>
            </div>
            <svg width="88" height="88" viewBox="0 0 88 88">
              <circle cx="44" cy="44" r="38" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="7"/>
              <circle cx="44" cy="44" r="38" fill="none" stroke="#A07048" strokeWidth="7"
                strokeDasharray="239" strokeDashoffset="52" strokeLinecap="round"
                transform="rotate(-90 44 44)"/>
              <text x="44" y="50" textAnchor="middle" fill="white" fontSize="16" fontWeight="700" fontFamily="'JetBrains Mono',monospace">78%</text>
            </svg>
          </div>
        </div>

        {/* Verification pipeline */}
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--c-text-sm)', fontFamily: 'var(--f-ui)', marginBottom: 12 }}>Verification Pipeline</div>
        <div style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(14,30,32,.04)' }}>
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              onClick={() => setStep(s.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '14px 20px', cursor: 'pointer',
                background: step === s.id ? 'var(--c-primary-lt)' : 'var(--c-surface)',
                borderBottom: i < STEPS.length - 1 ? '1px solid var(--c-bg)' : 'none',
                transition: 'background 120ms',
              }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700,
                background: s.done ? '#0E5860' : s.active ? 'var(--c-primary)' : 'var(--c-surface-alt)',
                color: s.done || s.active ? 'white' : 'var(--c-text-sm)',
              }}>
                {s.done ? '✓' : s.id + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: 'var(--f-ui)', fontWeight: 600, fontSize: 13,
                  color: s.done ? '#0E5860' : s.active ? 'var(--c-primary)' : 'var(--c-text-sm)',
                }}>{s.label}</div>
                <div style={{ fontFamily: 'var(--f-body)', fontSize: 11, color: 'var(--c-text-sm)', marginTop: 2 }}>{s.detail}</div>
              </div>
              <div style={{
                fontSize: 11, fontWeight: 600, fontFamily: 'var(--f-ui)',
                color: s.done ? '#0E5860' : s.active ? '#8B6914' : 'var(--c-text-sm)',
              }}>
                {s.done ? 'Complete' : s.active ? 'In Progress' : 'Pending'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right sidebar — Document Vault */}
      <div style={{
        width: 288, flexShrink: 0,
        background: 'var(--c-surface)',
        borderLeft: '1px solid var(--c-border)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--c-border)' }}>
          <div style={{ fontFamily: 'var(--f-ui)', fontWeight: 700, fontSize: 14, color: 'var(--c-text)' }}>Document Vault</div>
          <div style={{ fontSize: 11, color: 'var(--c-text-sm)', marginTop: 2 }}>
            {DOCS.filter(d => d.status === 'verified').length}/{DOCS.length} documents verified
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {DOCS.map((doc, i) => {
            const st = DOC_ST[doc.status];
            return (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--c-bg)',
                  cursor: 'pointer',
                  transition: 'background 120ms',
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                  background: st.bg,
                }}>📄</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--f-ui)', fontWeight: 600, fontSize: 12, color: 'var(--c-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</div>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: 'var(--c-text-sm)', marginTop: 2 }}>{doc.date}</div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, borderRadius: 999, padding: '2px 8px', background: st.bg, color: st.c, whiteSpace: 'nowrap' }}>{st.lbl}</span>
              </div>
            );
          })}
        </div>

        <div style={{ padding: 16, borderTop: '1px solid var(--c-border)' }}>
          <button style={{
            width: '100%', background: 'var(--c-primary)', color: '#FBF7F0',
            border: 'none', borderRadius: 12, padding: '10px 0',
            fontFamily: 'var(--f-ui)', fontWeight: 600, fontSize: 13, cursor: 'pointer',
          }}>+ Upload Document</button>
          <button style={{
            width: '100%', marginTop: 8,
            background: 'var(--c-bg)', border: '1px solid var(--c-border)',
            color: 'var(--c-text)', borderRadius: 12, padding: '10px 0',
            fontFamily: 'var(--f-ui)', fontWeight: 600, fontSize: 13, cursor: 'pointer',
          }}>Schedule POA Signing</button>
        </div>
      </div>
    </div>
  );
}
