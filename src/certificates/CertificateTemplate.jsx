/**
 * CertificateTemplate.jsx
 * 
 * Tek kaynak sertifika şablonu.
 * - Admin önizlemede
 * - Kullanıcı profilinde
 * - Herkese açık doğrulama sayfasında
 * - PDF/JPG üretiminde
 * aynı component kullanılır.
 * 
 * Tasarım: Monodoxia_Certificate.svg'den birebir renk ve layout.
 */

import React, { useEffect, useRef, useState } from 'react';
import './CertificateTemplate.css';

/* ── QR Generation (qrcode kütüphanesi) ── */
async function generateQRDataUrl(text, size = 80) {
  try {
    const QRCode = (await import('qrcode')).default;
    return await QRCode.toDataURL(text, {
      width: size,
      margin: 1,
      color: { dark: '#0f1f4a', light: '#ffffff' },
      errorCorrectionLevel: 'M'
    });
  } catch {
    return null;
  }
}

/* ── Top-Left Wave Corner SVG (extracted from certificate SVG) ── */
const CornerTopLeft = () => (
  <svg viewBox="0 0 668 319" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <defs>
      <linearGradient id="ctlg1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#14254b"/>
        <stop offset="30%" stopColor="#132448"/>
        <stop offset="60%" stopColor="#11203a"/>
        <stop offset="100%" stopColor="#0e1c2c"/>
      </linearGradient>
      <linearGradient id="ctlg2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e9cf8e"/>
        <stop offset="30%" stopColor="#b8903f"/>
        <stop offset="70%" stopColor="#d9b96a"/>
        <stop offset="100%" stopColor="#9a7430"/>
      </linearGradient>
    </defs>
    {/* Navy wave fill */}
    <polygon fill="#14254b" points="68,0 0,11 0,0 68,0"/>
    <polygon fill="#132448" points="162,0 0,27 0,11 68,0 162,0"/>
    <polygon fill="#122343" points="256,0 0,42 0,27 162,0 256,0"/>
    <polygon fill="#122242" points="350,0 0,57 0,42 256,0 350,0"/>
    <polygon fill="#122241" points="443,0 0,73 0,57 350,0 443,0"/>
    <polygon fill="#122240" points="537,0 0,88 0,73 443,0 537,0"/>
    <polygon fill="#12213e" points="631,0 0,103 0,88 537,0 631,0"/>
    <polygon fill="#11213d" points="668,9 0,119 0,103 631,0 668,0 668,9"/>
    <polygon fill="#11213c" points="668,25 0,134 0,119 668,9 668,25"/>
    <polygon fill="#11203b" points="668,40 0,150 0,134 668,25 668,40"/>
    <polygon fill="#11203a" points="668,55 0,165 0,150 668,40 668,55"/>
    <polygon fill="#112039" points="668,71 0,180 0,165 668,55 668,71"/>
    <polygon fill="#101f38" points="668,86 0,196 0,180 668,71 668,86"/>
    <polygon fill="#101f37" points="668,102 0,211 0,196 668,86 668,102"/>
    <polygon fill="#101f36" points="668,117 0,226 0,211 668,102 668,117"/>
    <polygon fill="#101f35" points="668,132 0,242 0,226 668,117 668,132"/>
    <polygon fill="#101e34" points="668,148 0,257 0,242 668,132 668,148"/>
    <polygon fill="#0f1e33" points="668,163 0,273 0,257 668,148 668,163"/>
    <polygon fill="#0f1e32" points="668,178 0,288 0,273 668,163 668,178"/>
    <polygon fill="#0f1d31" points="668,194 0,303 0,288 668,178 668,194"/>
    <polygon fill="#0f1d30" points="668,209 0,319 0,303 668,194 668,209"/>
    <polygon fill="#0f1d2f" points="668,224 94,319 0,319 668,209 668,224"/>
    <polygon fill="#0e1d2f" points="668,240 187,319 94,319 668,224 668,240"/>
    <polygon fill="#0e1c2e" points="668,255 281,319 187,319 668,240 668,255"/>
    <polygon fill="#0e1c2d" points="668,270 375,319 281,319 668,255 668,270"/>
    <polygon fill="#0e1c2c" points="668,286 469,319 375,319 668,270 668,286"/>
    <polygon fill="#0e1c2c" points="469,319 668,286 668,319 469,319"/>
    {/* Gold overlay path */}
    <path fill="url(#ctlg2)" opacity="0.9"
      d="M349,0C263,37 190,89 132,156 121,168 111,181 101,194 90,209 79,225 69,242 41,291 18,345 0,404 L0,319 C0,319 0,319 349,0Z"
      transform="scale(1,0.95)"
    />
  </svg>
);

/* ── Bottom-Right Wave Corner SVG ── */
const CornerBottomRight = () => (
  <svg viewBox="0 0 342 243" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <defs>
      <linearGradient id="cbrg1" x1="100%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#14254b"/>
        <stop offset="30%" stopColor="#132448"/>
        <stop offset="60%" stopColor="#11203a"/>
        <stop offset="100%" stopColor="#0e1c2c"/>
      </linearGradient>
      <linearGradient id="cbrg2" x1="100%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#e9cf8e"/>
        <stop offset="30%" stopColor="#b8903f"/>
        <stop offset="70%" stopColor="#d9b96a"/>
        <stop offset="100%" stopColor="#9a7430"/>
      </linearGradient>
    </defs>
    <polygon fill="#14254b" points="307,0 342,56 342,0 307,0"/>
    <polygon fill="#132448" points="298,0 342,71 342,56 307,0 298,0"/>
    <polygon fill="#12223f" points="289,0 342,86 342,71 298,0 289,0"/>
    <polygon fill="#12223f" points="280,0 342,101 342,86 289,0 280,0"/>
    <polygon fill="#122343" points="271,0 342,117 342,101 280,0 271,0"/>
    <polygon fill="#132345" points="262,0 342,132 342,117 271,0 262,0"/>
    <polygon fill="#132448" points="252,0 342,147 342,132 262,0 252,0"/>
    <polygon fill="#132448" points="243,0 342,162 342,147 252,0 243,0"/>
    <polygon fill="#11203a" points="234,0 342,178 342,162 243,0 234,0"/>
    <polygon fill="#11213d" points="225,0 342,193 342,178 234,0 225,0"/>
    <polygon fill="#11213c" points="216,0 342,208 342,193 225,0 216,0"/>
    <polygon fill="#0e1c2c" points="207,0 342,223 342,208 216,0 207,0"/>
    <polygon fill="#0e1c2d" points="198,0 342,243 342,223 207,0 198,0"/>
    <polygon fill="#0e1c2e" points="189,0 342,243 198,0 189,0"/>
    <polygon fill="#0f1d2f" points="180,0 342,243 189,0 180,0"/>
    <polygon fill="#0f1d30" points="171,0 342,243 180,0 171,0"/>
    <polygon fill="#101e34" points="162,0 342,243 171,0 162,0"/>
    <polygon fill="#101f35" points="153,0 342,243 162,0 153,0"/>
    <polygon fill="#101f36" points="144,0 342,243 153,0 144,0"/>
    <polygon fill="#101f37" points="342,243 144,0 342,0 342,243"/>
    {/* Gold overlay */}
    <path fill="url(#cbrg2)" opacity="0.9"
      d="M342,243 C302,224 271,197 248,163 242,157 237,151 232,144 224,136 218,128 212,119 197,94 185,67 176,37 L176,0 C209,35 234,79 248,123 253,139 260,155 268,169 298,207 330,228 342,235 Z"
    />
  </svg>
);

/* ── Filigran (yüz silueti + yıldız SVG, şablondan) ── */
const WatermarkSVG = () => (
  <svg viewBox="0 0 450 600" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    {/* Decorative star */}
    <path fill="#c09a5c" d="M225,10 C225,10 157.5,147.4 225,147.4 C292.5,147.4 225,10 225,10Z M225,10 C225,10 292.5,147.4 225,147.4 C157.5,147.4 225,10 225,10Z"/>
    <path fill="#c09a5c" d="M225,285 C225,285 88,352.5 88,285 C88,217.5 225,285 225,285Z M225,285 C225,285 362,217.5 362,285 C362,352.5 225,285 225,285Z"/>
    <circle fill="none" stroke="#c09a5c" strokeWidth="3" cx="225" cy="147" r="91"/>
    {/* Silhouette placeholder lines */}
    <path fill="#c09a5c" opacity="0.3" d="M180,200 Q225,160 270,200 L290,400 Q225,430 160,400 Z"/>
    <circle fill="#c09a5c" opacity="0.3" cx="225" cy="170" r="40"/>
    {/* Academy text */}
    <text x="225" y="490" fontFamily="'Playfair Display',serif" fontSize="24" fill="#c09a5c" textAnchor="middle" letterSpacing="8">MONODOXIA</text>
    <text x="225" y="520" fontFamily="'Playfair Display',serif" fontSize="14" fill="#c09a5c" textAnchor="middle" letterSpacing="5">ACADEMY</text>
  </svg>
);

/**
 * CertificateTemplate
 * 
 * @param {object}  data          - Sertifika alanları
 * @param {string}  [verifyUrl]   - QR için URL (verilmezse üretilmez)
 * @param {number}  [scale=1]     - Önizleme için ölçek faktörü (0.4 gibi)
 * @param {boolean} [forExport]   - true → print-color-adjust zorla
 * @param {string}  [wrapperRef]  - Ref prop name için pass-through
 */
export default function CertificateTemplate({
  data = {},
  verifyUrl = '',
  scale = 1,
  forExport = false,
  wrapperRef = null
}) {
  const {
    // Header
    headerTitle    = 'CERTIFICATE',
    headerSub      = 'OF COMPLETION',
    // Body
    thisCertifies  = 'THIS CERTIFIES THAT',
    recipientName  = 'Ad Soyad',
    descLine1      = 'Monodoxia Academy tərəfindən təşkil edilən',
    courseName     = 'Kursun / Təlimin Adı',
    descLine2      = 'təlimi başa vurmuşdur.',
    // Bottom labels
    durationLabel  = 'TƏLİMİN MÜDDƏTİ / SAAT',
    durationValue  = '',
    dateLabel      = 'VERİLMƏ TARİXİ',
    dateValue      = '',
    verifyLabel    = 'SERTİFİKATIN TƏSDİQLƏNMƏSİ',
    // Signatures
    sig1Name       = 'TURXAN TƏHMƏZOV',
    sig1Title      = 'Founder & Director',
    sig1Image      = '',
    sig2Name       = 'SƏDAQƏT RZAYEVA',
    sig2Title      = 'Təlimçi',
    sig2Image      = '',
    // Seal
    sealImage      = '',
    // Meta
    certNumber     = '',
    publicId       = '',
  } = data;

  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    if (verifyUrl) {
      generateQRDataUrl(verifyUrl, 80).then(url => {
        if (url) setQrDataUrl(url);
      });
    }
  }, [verifyUrl]);

  const wrapperStyle = {
    transform: scale !== 1 ? `scale(${scale})` : undefined,
    transformOrigin: scale !== 1 ? 'top left' : undefined,
    ...(forExport ? { printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' } : {})
  };

  return (
    <div
      ref={wrapperRef}
      className="cert-wrapper cert-print-region"
      style={wrapperStyle}
      data-cert-number={certNumber}
    >
      {/* ── Cream Background (already in CSS, gradient reinforced) ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, #f8f5ec 0%, #f4efe2 50%, #efe8d6 100%)',
        zIndex: 0
      }}/>

      {/* ── Top-Left Wave Corner ── */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: 420, height: 300, zIndex: 1, overflow: 'hidden' }}>
        <CornerTopLeft />
      </div>

      {/* ── Bottom-Right Wave Corner ── */}
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 360, height: 250, zIndex: 1, overflow: 'hidden' }}>
        <CornerBottomRight />
      </div>

      {/* ── Filigran (right side) ── */}
      <div className="cert-watermark" style={{ width: 180, top: '50%', transform: 'translateY(-50%)' }}>
        <WatermarkSVG />
      </div>

      {/* ── Gold Double Border Frame ── */}
      <div className="cert-border" />
      <div className="cert-border-inner" />

      {/* ── Logo Area (top center) ── */}
      <div className="cert-logo-area">
        <img
          src="/favicon.svg"
          alt="Monodoxia Academy"
          className="cert-logo-img"
          onError={e => { e.target.style.display = 'none'; }}
        />
        <span className="cert-logo-wordmark">MONODOXIA ACADEMY</span>
      </div>

      {/* ── Main Content Area ── */}
      <div className="cert-content">
        {/* CERTIFICATE title */}
        <h1 className="cert-title-main">{headerTitle}</h1>
        <p className="cert-title-sub">{headerSub}</p>

        <div className="cert-divider" style={{ marginTop: 10 }} />

        {/* THIS CERTIFIES THAT */}
        <p className="cert-this-certifies">{thisCertifies}</p>

        {/* Recipient Name */}
        <div className="cert-recipient-name">{recipientName}</div>

        <div className="cert-divider" />

        {/* Description */}
        <p className="cert-description">{descLine1}</p>
        <div className="cert-course-name">"{courseName}"</div>
        <p className="cert-description">{descLine2}</p>
      </div>

      {/* ── Bottom Row ── */}
      <div className="cert-bottom">
        {/* Signature 1 (Left) */}
        <div className="cert-sig-block">
          {sig1Image ? (
            <img src={sig1Image} alt={sig1Name} className="cert-sig-img" />
          ) : (
            <div style={{ height: 48 }} />
          )}
          <div className="cert-sig-line" />
          <div className="cert-sig-name">{sig1Name}</div>
          <div className="cert-sig-title">{sig1Title}</div>
        </div>

        {/* Center: Seal + QR + Details */}
        <div className="cert-center-bottom">
          {/* Seal */}
          {sealImage ? (
            <img src={sealImage} alt="Seal" className="cert-seal-img" />
          ) : (
            <div className="cert-seal-placeholder">
              <span style={{ fontSize: 9, color: '#b8903f', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, letterSpacing: '0.1em', textAlign: 'center', padding: 4 }}>MÖHÜR</span>
            </div>
          )}

          {/* Details Row */}
          <div className="cert-details-row">
            {durationValue && (
              <>
                <div className="cert-detail-item">
                  <span className="cert-detail-label">{durationLabel}</span>
                  <span className="cert-detail-value">{durationValue}</span>
                </div>
                <div className="cert-detail-separator" />
              </>
            )}
            {dateValue && (
              <>
                <div className="cert-detail-item">
                  <span className="cert-detail-label">{dateLabel}</span>
                  <span className="cert-detail-value">{dateValue}</span>
                </div>
              </>
            )}
            {certNumber && (
              <>
                <div className="cert-detail-separator" />
                <div className="cert-detail-item">
                  <span className="cert-detail-label">SERTİFİKAT №</span>
                  <span className="cert-detail-value cert-number">{certNumber}</span>
                </div>
              </>
            )}
          </div>

          {/* QR Code */}
          <div className="cert-qr-container">
            <div className="cert-qr-box">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="QR" style={{ width: 72, height: 72 }} />
              ) : (
                <div style={{
                  width: 72, height: 72,
                  background: 'repeating-linear-gradient(45deg, #e9cf8e22 0px, #e9cf8e22 2px, transparent 2px, transparent 8px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <span style={{ fontSize: 7, color: '#b8903f', textAlign: 'center', fontFamily: 'Plus Jakarta Sans' }}>QR<br/>KOD</span>
                </div>
              )}
            </div>
            <span className="cert-qr-label">{verifyLabel}</span>
          </div>
        </div>

        {/* Signature 2 (Right) */}
        <div className="cert-sig-block">
          {sig2Image ? (
            <img src={sig2Image} alt={sig2Name} className="cert-sig-img" />
          ) : (
            <div style={{ height: 48 }} />
          )}
          <div className="cert-sig-line" />
          <div className="cert-sig-name">{sig2Name}</div>
          <div className="cert-sig-title">{sig2Title}</div>
        </div>
      </div>

      {/* ── Cert Number (bottom left corner) ── */}
      {certNumber && (
        <div style={{
          position: 'absolute', bottom: 30, left: 30, zIndex: 10
        }}>
          <span className="cert-number" style={{ opacity: 0.6 }}>№ {certNumber}</span>
        </div>
      )}
    </div>
  );
}
