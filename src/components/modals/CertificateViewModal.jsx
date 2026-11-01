/**
 * CertificateViewModal.jsx
 * 
 * Tam ekran sertifikat önizleme + PDF/JPG indirme + yazdırma.
 * html2canvas + jsPDF ile client-side üretim.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import CertificateTemplate from '../../certificates/CertificateTemplate';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';

const BASE_URL = window.location.origin;
const CERT_W = 1491;
const CERT_H = 1055;

async function ensureFontsLoaded() {
  try {
    if (document.fonts) {
      await Promise.all([
        document.fonts.load("105px 'Alex Brush'"),
        document.fonts.load("105px 'Great Vibes'"),
        document.fonts.load("700 26px 'Playfair Display'"),
        document.fonts.load("600 24px 'Plus Jakarta Sans'")
      ]).catch(() => {});
      await document.fonts.ready;
    }
  } catch (e) {}
  await new Promise(r => setTimeout(r, 150));
}

async function renderSvgToCanvas(svgElement, width = CERT_W, height = CERT_H, scale = 2) {
  const clone = svgElement.cloneNode(true);
  clone.setAttribute('width', String(width));
  clone.setAttribute('height', String(height));
  clone.removeAttribute('style');
  clone.style.width = `${width}px`;
  clone.style.height = `${height}px`;

  const svgString = new XMLSerializer().serializeToString(clone);
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#f8f5ec';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

async function captureCertificateCanvas(element) {
  await ensureFontsLoaded();

  const svgEl = element?.querySelector?.('svg');
  if (svgEl) {
    try {
      const canvas = await renderSvgToCanvas(svgEl, CERT_W, CERT_H, 2);
      if (canvas) return canvas;
    } catch (e) {
      console.warn('SVG direct rasterization failed, falling back to html2canvas', e);
    }
  }

  const html2canvas = (await import('html2canvas')).default;
  return await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#f8f5ec',
    width: CERT_W,
    height: CERT_H,
    windowWidth: CERT_W,
    windowHeight: CERT_H,
    x: 0,
    y: 0,
    scrollX: 0,
    scrollY: 0,
    logging: false
  });
}

async function exportToPDF(element, filename = 'sertifikat.pdf') {
  const { jsPDF } = await import('jspdf');
  const canvas = await captureCertificateCanvas(element);
  const imgData = canvas.toDataURL('image/jpeg', 0.98);
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    compress: true
  });
  pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210, undefined, 'FAST');
  pdf.save(filename);
}

async function exportToJPG(element, filename = 'sertifikat.jpg') {
  const canvas = await captureCertificateCanvas(element);
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/jpeg', 0.98);
  link.click();
}

export default function CertificateViewModal() {
  const { certViewModalOpen, setCertViewModalOpen, activeCertView, showToast } = useApp();
  const { t } = useLanguage();
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
      showToast(t('cert_pdf_success') || 'PDF uğurla yükləndi!', 'success');
    } catch (err) {
      showToast(t('common_error') || 'Xəta baş verdi', 'error');
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
      showToast(t('cert_jpg_success') || 'JPG uğurla yükləndi!', 'success');
    } catch (err) {
      showToast(t('common_error') || 'Xəta baş verdi', 'error');
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
      showToast(t('cert_link_copied') || 'Doğrulama linki kopyalandı!', 'success');
    }).catch(() => {
      showToast(t('common_error') || 'Xəta baş verdi', 'error');
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
              <><div style={{ width: 14, height: 14, border: '2px solid #0a192f', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />{t('cert_preparing') || 'Hazırlanır...'}</>
            ) : (
              <><span className="material-symbols-outlined" style={{ fontSize: 16 }}>picture_as_pdf</span>{t('cert_download_pdf') || 'PDF Yüklə'}</>
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
              <><div style={{ width: 14, height: 14, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />{t('cert_preparing') || 'Hazırlanır...'}</>
            ) : (
              <><span className="material-symbols-outlined" style={{ fontSize: 16 }}>image</span>{t('cert_download_jpg') || 'JPG Yüklə'}</>
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
            {t('cert_print') || 'Çap Et'}
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
              {t('topic_copy_link') || 'Link Kopyala'}
            </button>
          )}

          {/* Close */}
          <button
            onClick={() => setCertViewModalOpen(false)}
            title={t('common_close') || 'Bağla'}
            aria-label={t('common_close') || 'Bağla'}
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
      {(() => {
        const certData = {
          ...(cert.fields || {}),
          certNumber: cert.number,
          number: cert.number,
          publicId: cert.publicId
        };

        return (
          <>
            <div style={{
              background: '#1e293b',
              borderRadius: 16,
              padding: 20,
              border: '1px solid rgba(255,255,255,0.1)',
              width: '100%',
              maxWidth: 1040,
              flexShrink: 0,
              boxShadow: '0 25px 80px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Full-scale cert for export (exact 1491x1055) kept in DOM tree off-screen with full opacity */}
              <div style={{
                position: 'fixed',
                left: '-10000px',
                top: 0,
                width: 1491,
                height: 1055,
                opacity: 1,
                pointerEvents: 'none'
              }}>
                <div ref={certRef} style={{ width: 1491, height: 1055 }}>
                  <CertificateTemplate
                    data={certData}
                    verifyUrl={verifyUrl}
                    forExport={true}
                    idPrefix="cert-export"
                  />
                </div>
              </div>

              {/* Visible preview fitting exact certificate bounds without cutting */}
              <div style={{
                width: '100%',
                aspectRatio: '1491 / 1055',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.05)',
                position: 'relative',
                margin: '0 auto',
                overflow: 'hidden',
                background: '#f8f5ec'
              }}>
                <CertificateTemplate
                  data={certData}
                  verifyUrl={verifyUrl}
                  idPrefix="cert-modal"
                />
              </div>
            </div>

            {/* Print Portal: Exactly 1 A4 Landscape Page */}
            {typeof document !== 'undefined' && createPortal(
              <div id="cert-print-portal">
                <CertificateTemplate
                  data={certData}
                  verifyUrl={verifyUrl}
                  forExport={true}
                  idPrefix="cert-print"
                />
              </div>,
              document.body
            )}
          </>
        );
      })()}

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
