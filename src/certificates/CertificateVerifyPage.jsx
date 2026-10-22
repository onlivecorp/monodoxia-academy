/**
 * CertificateVerifyPage.jsx
 * 
 * Herkese açık doğrulama sayfası.
 * URL: /#/certificates/verify/:publicId
 * veya ?certId=MA-000001 ile sorgulama
 * 
 * Login gerektirmez.
 */

import React, { useState, useEffect, useRef } from 'react';
import CertificateTemplate from './CertificateTemplate';
import { useApp } from '../context/AppContext';

const BASE_URL = window.location.origin;

export default function CertificateVerifyPage({ publicId, certId: certIdProp }) {
  const { certificatesList = [] } = useApp();
  const [cert, setCert] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | found | revoked | notfound
  const [searchInput, setSearchInput] = useState(certIdProp || '');
  const [scale, setScale] = useState(0.55);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const updateScale = () => {
      const vw = window.innerWidth;
      if (vw < 640) setScale(0.28);
      else if (vw < 900) setScale(0.42);
      else if (vw < 1200) setScale(0.55);
      else setScale(0.65);
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  useEffect(() => {
    if (!publicId && !certIdProp) { setStatus('idle'); return; }
    const query = publicId || certIdProp;
    setStatus('loading');
    setTimeout(() => {
      const found = certificatesList.find(
        c => c.publicId === query || c.number === query
      );
      if (!found) { setStatus('notfound'); return; }
      setCert(found);
      setStatus(found.status === 'Yayında' ? 'found' : found.status === 'İptal Edilmiş' ? 'revoked' : 'draft');
    }, 400);
  }, [publicId, certIdProp, certificatesList]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const query = searchInput.trim();
    const found = certificatesList.find(
      c => c.publicId === query || c.number === query || c.number?.toLowerCase() === query.toLowerCase()
    );
    if (!found) { setStatus('notfound'); setCert(null); return; }
    setCert(found);
    setStatus(found.status === 'Yayında' ? 'found' : found.status === 'İptal Edilmiş' ? 'revoked' : 'draft');
  };

  const verifyUrl = cert?.publicId ? `${BASE_URL}/#/certificates/verify/${cert.publicId}` : '';

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f5ec 0%, #f0e8d4 50%, #e8dcc4 100%)',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0a192f, #112240)',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/favicon.svg" alt="Monodoxia" style={{ height: 36 }} onError={e => e.target.style.display = 'none'} />
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: '#fff', letterSpacing: '0.05em' }}>
              Monodoxia Academy
            </div>
            <div style={{ fontSize: 10, color: '#b29c75', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Sertifikat Doğrulama Sistemi
            </div>
          </div>
        </div>
        <a href="/" style={{ color: '#b29c75', fontSize: 12, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
          Ana Səhifə
        </a>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px' }}>
        {/* Direct Link: Official Immutable Header. If no direct link: Search Bar */}
        {(publicId || certIdProp) ? (
          <div style={{
            background: 'linear-gradient(135deg, #0a192f, #1e293b)',
            borderRadius: 16,
            padding: '20px 24px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
            border: '1.5px solid #d4af37',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 36, color: '#fbbf24' }}>verified_user</span>
              <div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  Rəsmi Elektron Sertifikat Sənədi
                  <span style={{ fontSize: 10, background: '#10b981', color: '#fff', padding: '2px 8px', borderRadius: 100, fontWeight: 700, letterSpacing: '0.05em' }}>DƏYİŞDİRİLƏ BİLMƏZ</span>
                </h1>
                <p style={{ fontSize: 11, color: '#cbd5e1', margin: '4px 0 0', letterSpacing: '0.02em' }}>
                  Bu sənəd Monodoxia Academy tərəfindən elektron təsdiqlənmişdir. Məlumatlar qorunur və heç bir halda redaktə edilə bilməz.
                </p>
              </div>
            </div>
            <span style={{
              fontSize: 12, fontWeight: 700, fontFamily: 'monospace',
              background: 'rgba(255,255,255,0.08)', color: '#fbbf24',
              padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(251,191,36,0.3)'
            }}>
              KOD: {publicId || certIdProp}
            </span>
          </div>
        ) : (
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: '24px 28px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            border: '1px solid #e6dfc6',
            marginBottom: 28
          }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: '#0a192f', margin: '0 0 6px' }}>
              Sertifikat Doğrulama
            </h1>
            <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 16px' }}>
              Sertifikat nömrəsi (MA-000001) və ya doğrulama kodu ilə axtarış edin.
            </p>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10 }}>
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="MA-000001 və ya Doğrulama Kodu..."
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: 10,
                  border: '1.5px solid #e6dfc6',
                  fontSize: 13,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  outline: 'none',
                  background: '#faf9f6',
                  color: '#0a192f',
                  transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = '#b8903f'}
                onBlur={e => e.target.style.borderColor = '#e6dfc6'}
              />
              <button type="submit" style={{
                padding: '10px 22px',
                background: 'linear-gradient(135deg, #b8903f, #e9cf8e)',
                color: '#0a192f',
                border: 'none',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>search</span>
                Axtar
              </button>
            </form>
          </div>
        )}

        {/* Status Banner */}
        {status === 'loading' && (
          <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>
            <div style={{
              width: 36, height: 36, border: '3px solid #e6dfc6', borderTopColor: '#b8903f',
              borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite'
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            Sertifikat yoxlanılır...
          </div>
        )}

        {status === 'notfound' && (
          <div style={{
            background: '#fff', borderRadius: 16, padding: 32, textAlign: 'center',
            border: '1.5px solid #fca5a5', boxShadow: '0 4px 20px rgba(239,68,68,0.08)'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#ef4444', display: 'block', marginBottom: 12 }}>cancel</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: '#7f1d1d', margin: '0 0 8px' }}>Sertifikat Tapılmadı</h2>
            <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Bu nömrə ilə sertifikat mövcud deyil. Nömrəni yoxlayın.</p>
          </div>
        )}

        {status === 'revoked' && cert && (
          <div style={{
            background: '#fff', borderRadius: 16, padding: 28,
            border: '1.5px solid #fca5a5', marginBottom: 20,
            display: 'flex', alignItems: 'center', gap: 16
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#dc2626' }}>block</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#7f1d1d' }}>Bu sertifikat İptal Edilmişdir</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                {cert.revokedReason && <>Səbəb: {cert.revokedReason} · </>}
                {cert.revokedAt && <>Tarix: {cert.revokedAt}</>}
              </div>
            </div>
          </div>
        )}

        {(status === 'found' || status === 'revoked') && cert && (
          <>
            {/* Verification Badge */}
            {status === 'found' && (
              <div style={{
                background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
                borderRadius: 16, padding: '16px 24px', marginBottom: 20,
                border: '1.5px solid #6ee7b7',
                display: 'flex', alignItems: 'center', gap: 12
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 32, color: '#065f46' }}>verified</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#065f46' }}>✓ Doğrulandı — Sertifikat Etibarlıdır</div>
                  <div style={{ fontSize: 12, color: '#047857', marginTop: 2 }}>
                    № {cert.number} · {cert.fields?.dateValue || cert.issuedAt} · {cert.fields?.recipientName || cert.userName}
                  </div>
                </div>
              </div>
            )}

            {/* Certificate Preview (Protected Read-Only Canvas) */}
            <div style={{
              background: '#fff', borderRadius: 16, padding: 16,
              boxShadow: '0 8px 40px rgba(0,0,0,0.1)', border: '1px solid #e6dfc6',
              overflow: 'hidden', marginBottom: 20,
              userSelect: 'none', WebkitUserSelect: 'none'
            }}>
              <div style={{
                width: '100%',
                maxWidth: 1000,
                aspectRatio: '1491 / 1055',
                overflow: 'hidden',
                margin: '0 auto',
                borderRadius: 8,
                border: '1px solid #e6dfc6',
                pointerEvents: 'none'
              }}>
                <CertificateTemplate
                  data={{ ...(cert.fields || {}), certNumber: cert.number }}
                  verifyUrl={verifyUrl}
                />
              </div>
            </div>

            {/* Details Card */}
            <div style={{
              background: '#fff', borderRadius: 16, padding: 24,
              border: '1px solid #e6dfc6', boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: '#0a192f', margin: '0 0 16px', fontWeight: 700 }}>
                Sertifikat Məlumatları
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                {[
                  { label: 'Alıcı', value: cert.fields?.recipientName || cert.userName || '—' },
                  { label: 'Kurs / Təlim', value: cert.fields?.courseName || '—' },
                  { label: 'Verilmə Tarixi', value: cert.fields?.dateValue || cert.issuedAt || '—' },
                  { label: 'Sertifikat №', value: cert.number || '—' },
                  { label: 'Müddət', value: cert.fields?.durationValue || '—' },
                  { label: 'Doğrulama Linki', value: verifyUrl || '—' },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    padding: '10px 14px',
                    background: '#faf9f6',
                    borderRadius: 10,
                    border: '1px solid #f0ede5'
                  }}>
                    <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#b29c75', marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 12, color: '#0a192f', fontWeight: 600, wordBreak: 'break-all' }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {status === 'idle' && (
          <div style={{
            background: '#fff', borderRadius: 16, padding: 48, textAlign: 'center',
            border: '1px dashed #e6dfc6'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 56, color: '#e6dfc6', display: 'block', marginBottom: 16 }}>workspace_premium</span>
            <p style={{ color: '#94a3b8', fontSize: 14, margin: 0 }}>Sertifikat nömrəsi və ya doğrulama kodu daxil edin</p>
          </div>
        )}
      </div>
    </div>
  );
}
