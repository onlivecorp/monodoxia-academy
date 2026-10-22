import React from 'react';

/**
 * High-definition Vector Flag Component
 * Works consistently across all OS (Windows, Mac, iOS, Android, Linux)
 * without relying on missing OS emoji fonts.
 */
export default function FlagIcon({ code = 'az', className = 'w-5 h-3.5', round = false }) {
  const norm = String(code || 'az').toLowerCase();

  const containerClasses = `inline-flex shrink-0 items-center justify-center overflow-hidden border border-black/15 shadow-xs ${
    round ? 'rounded-full aspect-square' : 'rounded-[3px] aspect-[4/3]'
  } ${className}`;

  if (norm === 'az') {
    return (
      <span className={containerClasses} title="Azərbaycan">
        <svg viewBox="0 0 1200 600" className="w-full h-full object-cover">
          <rect width="1200" height="200" fill="#00b5e2" />
          <rect y="200" width="1200" height="200" fill="#ef3340" />
          <rect y="400" width="1200" height="200" fill="#509e2f" />
          <circle cx="560" cy="300" r="80" fill="#ffffff" />
          <circle cx="585" cy="300" r="65" fill="#ef3340" />
          <polygon
            points="650,265 658,288 682,288 663,302 670,325 650,311 630,325 637,302 618,288 642,288"
            fill="#ffffff"
          />
        </svg>
      </span>
    );
  }

  if (norm === 'tr') {
    return (
      <span className={containerClasses} title="Türkçe">
        <svg viewBox="0 0 1200 800" className="w-full h-full object-cover">
          <rect width="1200" height="800" fill="#e30a17" />
          <circle cx="450" cy="400" r="200" fill="#ffffff" />
          <circle cx="500" cy="400" r="160" fill="#e30a17" />
          <polygon
            points="670,400 600,378 626,343 596,366 572,333 580,371 545,385 583,397 576,436 599,403 628,426 601,392"
            fill="#ffffff"
          />
        </svg>
      </span>
    );
  }

  if (norm === 'en') {
    return (
      <span className={containerClasses} title="English">
        <svg viewBox="0 0 60 30" className="w-full h-full object-cover">
          <clipPath id="s">
            <path d="M0,0 v30 h60 v-30 z"/>
          </clipPath>
          <clipPath id="t">
            <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/>
          </clipPath>
          <g clipPath="url(#s)">
            <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
            <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#c8102e" strokeWidth="4"/>
            <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
            <path d="M30,0 v30 M0,15 h60" stroke="#c8102e" strokeWidth="6"/>
          </g>
        </svg>
      </span>
    );
  }

  if (norm === 'ru') {
    return (
      <span className={containerClasses} title="Русский">
        <svg viewBox="0 0 900 600" className="w-full h-full object-cover">
          <rect width="900" height="200" fill="#ffffff" />
          <rect y="200" width="900" height="200" fill="#0039a6" />
          <rect y="400" width="900" height="200" fill="#d52b1e" />
        </svg>
      </span>
    );
  }

  // Generic fallback
  return (
    <span className={containerClasses} title={norm.toUpperCase()}>
      <span className="text-[9px] font-bold uppercase">{norm}</span>
    </span>
  );
}
