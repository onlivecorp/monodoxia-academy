/**
 * CertificateViewModal.jsx
 * 
 * Tam ekran sertifikat önizleme + PDF/JPG indirme + yazdırma.
 * html2canvas + jsPDF ile client-side üretim.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import CertificateTemplate from '../../certificates/CertificateTemplate';
import { useApp } from '../../context/AppContext';

const BASE_URL = window.location.origin;
const CERT_W = 1491;
const CERT_H = 1055;

async function exportToPDF(element, filename = 'sertifikat.pdf') {
  const html2canvas = (await import('html2canvas')).default;
  const { jsPDF } = await import('jspdf');

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#f8f5ec',
    width: CERT_W,
    height: CERT_H,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210);

  pdf.save(filename);
}

async function exportToJPG(element, filename = 'sertifikat.jpg') {
  const html2canvas = (await import('html2canvas')).default;
  const canvas = await html2canvas(element, {
    scale: 2, // ~3000px wide ultra-crisp JPG
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#f8f5ec',
    width: CERT_W,
    height: CERT_H,
    logging: false,
  });

  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/jpeg', 0.95);
  link.click();
}

export default function CertificateViewModal() {
  const { certViewModalOpen, setCertViewModalOpen, activeCertView, showToast } = useApp();
  const [exporting, setExporting] = useState(null); // null | 'pdf' | 'jpg'
  const certRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && certViewModalOpen) setCertViewModalOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [certViewModalOpen, setCertViewModalOpen]);

  if (!certViewModalOpen || !activeCertView) return null;

  const cert = activeCertView;
  const verifyUrl = cert.publicId ? `${BASE_URL}/#/certificates/verify/${cert.publicId}` : '';
  const filename = `MA-${cert.number || cert.id}-${(cert.fields?.recipientName || 'sertifikat').replace(/\s+/g, '_')}`;

  const handlePDF = async () => {
    if (!certRef.current) return;
    setExporting('pdf');
    try {
      await exportToPDF(certRef.current, `${filename}.pdf`);
      showToast('PDF uğurla yükləndi!', 'success');
    } catch (err) {
      showToast('PDF hazırlanarkən xəta baş verdi', 'error');
      console.error(err);
    } finally {
      setExporting(null);
    }
  };

  const handleJPG = async () => {
    if (!certRef.current) return;
    setExporting('jpg');
    try {
      await exportToJPG(certRef.current, `${filename}.jpg`);
      showToast('JPG uğurla yükləndi!', 'success');
    } catch (err) {
      showToast('JPG hazırlanarkən xəta baş verdi', 'error');
      console.error(err);
    } finally {
      setExporting(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    if (!verifyUrl) return;
    navigator.clipboard.writeText(verifyUrl).then(() => {
      showToast('Doğrulama linki kopyalandı!', 'success');
    }).catch(() => {
      showToast('Link kopyalana bilmədi', 'error');
    });
  };

  // Scale for display (modal width is ~95vw max 1200px, cert is 1123px wide)
  const displayScale = Math.min(1, (Math.min(window.innerWidth * 0.85, 1150) - 16) / CERT_W);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999999,
      background: 'rgba(7, 15, 30, 0.88)',
      backdropFilter: 'blur(10px)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'flex-start',
      overflowY: 'auto', padding: '20px 16px'
    }}>
      {/* TOP BAR */}
      <div style={{
        width: '100%', maxWidth: 1200,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 16, flexWrap: 'wrap', gap: 8
      }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: '#fff' }}>
            {cert.fields?.recipientName || 'Sertifikat'}
          </div>
          <div style={{ fontSize: 11, color: '#b29c75', marginTop: 2 }}>
            № {cert.number} · {cert.fields?.courseName}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {/* PDF */}
          <button
            onClick={handlePDF}
            disabled={!!exporting}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px',
              background: 'linear-gradient(135deg, #b8903f, #e9cf8e)',
              color: '#0a192f', border: 'none', borderRadius: 10,
              fontSize: 12, fontWeight: 700, cursor: exporting ? 'not-allowed' : 'pointer',
              opacity: exporting && exporting !== 'pdf' ? 0.5 : 1,
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
          >
            {exporting === 'pdf' ? (
              <><div style={{ width: 14, height: 14, border: '2px solid #0a192f', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />Hazırlanır...</>
            ) : (
              <><span className="material-symbols-outlined" style={{ fontSize: 16 }}>picture_as_pdf</span>PDF Yüklə</>
            )}
          </button>

          {/* JPG */}
          <button
            onClick={handleJPG}
            disabled={!!exporting}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px',
              background: 'rgba(255,255,255,0.1)', color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10,
              fontSize: 12, fontWeight: 600, cursor: exporting ? 'not-allowed' : 'pointer',
              opacity: exporting && exporting !== 'jpg' ? 0.5 : 1,
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
          >
            {exporting === 'jpg' ? (
              <><div style={{ width: 14, height: 14, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />Hazırlanır...</>
            ) : (
              <><span className="material-symbols-outlined" style={{ fontSize: 16 }}>image</span>JPG Yüklə</>
            )}
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px',
              background: 'rgba(255,255,255,0.1)', color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10,
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>print</span>
            Çap Et
          </button>

          {/* Copy Link */}
          {verifyUrl && (
            <button
              onClick={handleCopyLink}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px',
                background: 'rgba(255,255,255,0.1)', color: '#fff',
                border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10,
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif"
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>link</span>
              Link Kopyala
            </button>
          )}

          {/* Close */}
          <button
            onClick={() => setCertViewModalOpen(false)}
            style={{
              width: 36, height: 36,
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 10, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
          </button>
        </div>
      </div>

      {/* CERTIFICATE DISPLAY */}
      <div style={{
        background: '#1e293b',
        borderRadius: 16,
        padding: 20,
        border: '1px solid rgba(255,255,255,0.1)',
        overflow: 'hidden',
        width: '100%',
        maxWidth: 1040,
        boxShadow: '0 25px 80px rgba(0,0,0,0.5)'
      }}>
        {/* Hidden full-scale cert for export (exact 1491x1055) */}
        <div style={{ position: 'fixed', top: -9999, left: -9999, zIndex: -1, width: 1491, height: 1055 }}>
          <div ref={certRef} style={{ width: 1491, height: 1055 }}>
            <CertificateTemplate
              data={cert.fields || {}}
              verifyUrl={verifyUrl}
              forExport={true}
            />
          </div>
        </div>

        {/* Visible preview fitting exact certificate bounds */}
        <div style={{
          width: '100%',
          aspectRatio: '1491 / 1055',
          overflow: 'hidden',
          borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.05)',
          position: 'relative',
          margin: '0 auto'
        }}>
          <CertificateTemplate
            data={cert.fields || {}}
            verifyUrl={verifyUrl}
          />
        </div>
      </div>

      {/* STATUS + META */}
      <div style={{
        width: '100%', maxWidth: 1200,
        display: 'flex', alignItems: 'center', gap: 12,
        marginTop: 16, flexWrap: 'wrap'
      }}>
        <div style={{
          padding: '6px 14px', borderRadius: 100, fontSize: 11, fontWeight: 700,
          ...(cert.status === 'Yayında' ? { background: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7' } :
             cert.status === 'İptal Edilmiş' ? { background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' } :
             { background: '#fef9c3', color: '#854d0e', border: '1px solid #fde047' })
        }}>
          {cert.status === 'Yayında' ? '✓ Yayında' : cert.status === 'İptal Edilmiş' ? '✗ İptal Edilmiş' : '● Qaralama'}
        </div>
        {cert.number && (
          <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'monospace' }}>№ {cert.number}</span>
        )}
        {verifyUrl && (
          <a href={verifyUrl} target="_blank" rel="noreferrer" style={{
            fontSize: 11, color: '#b29c75', textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: 4
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>open_in_new</span>
            Doğrulama Səhifəsi
          </a>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
