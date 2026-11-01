import React from 'react';
import { normalizeSearchStr } from '../../utils/searchHelper';
import { useLanguage } from '../../i18n/LanguageContext';

function HighlightText({ text, query }) {
  if (!text) return null;
  if (!query || !query.trim()) return <>{text}</>;

  const tokens = query
    .trim()
    .split(/\s+/)
    .map(t => normalizeSearchStr(t))
    .filter(Boolean);

  if (tokens.length === 0) return <>{text}</>;

  const pattern = new RegExp(`(${tokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  const parts = String(text).split(pattern);

  return (
    <>
      {parts.map((part, i) => {
        const isMatch = tokens.some(tok => normalizeSearchStr(part) === tok);
        return isMatch ? (
          <mark key={i} className="bg-[#c5a059]/25 text-[#775a19] font-bold px-0.5 rounded">
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        );
      })}
    </>
  );
}

export default function SearchResultItem({ item, query, isSelected, onClick }) {
  const { t } = useLanguage();
  const getTypeBadge = () => {
    switch (item.type) {
      case 'courses':
        return {
          icon: 'school',
          label: t('search_cat_courses') || 'Kurs',
          color: 'bg-amber-100 text-amber-800 border-amber-300'
        };
      case 'experts':
        return {
          icon: 'psychology',
          label: t('search_cat_experts') || 'Ekspert',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-300'
        };
      case 'users':
        return {
          icon: 'person',
          label: t('search_cat_users') || 'İstifadəçi',
          color: 'bg-slate-100 text-slate-800 border-slate-300'
        };
      case 'events':
        return {
          icon: 'event',
          label: t('search_cat_events') || 'Tədbir',
          color: 'bg-blue-100 text-blue-800 border-blue-300'
        };
      case 'forum':
        return {
          icon: 'forum',
          label: t('search_cat_forum') || 'Forum',
          color: 'bg-purple-100 text-purple-800 border-purple-300'
        };
      default:
        return {
          icon: 'search',
          label: t('search_cat_all') || 'Məzmun',
          color: 'bg-slate-100 text-slate-800 border-slate-300'
        };
    }
  };

  const badge = getTypeBadge();

  return (
    <div
      role="option"
      aria-selected={isSelected}
      onClick={onClick}
      className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-150 cursor-pointer flex items-start gap-3.5 group ${
        isSelected
          ? 'bg-amber-50/70 border-[#c5a059] shadow-sm translate-x-1'
          : 'bg-white hover:bg-slate-50/80 border-[#e2e8f0] hover:border-[#c5a059]/40'
      }`}
    >
      {/* Icon / Thumbnail / Avatar */}
      <div className="shrink-0 pt-0.5">
        {item.type === 'experts' ? (
          item.avatar ? (
            <img
              src={item.avatar}
              alt={item.title}
              className="w-12 h-12 rounded-xl object-cover border border-[#c5a059]/40 shadow-xs group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#071326] to-[#0c2242] text-[#e5c57d] font-serif font-bold text-lg flex items-center justify-center border border-[#c5a059]/40 shadow-xs">
              {(item.title || 'E')[0]}
            </div>
          )
        ) : item.type === 'users' ? (
          item.avatar ? (
            <img
              src={item.avatar}
              alt={item.title}
              className="w-11 h-11 rounded-full object-cover border border-slate-300 shadow-xs"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center">
              {(item.title || 'U')[0]}
            </div>
          )
        ) : (
          <div className="w-11 h-11 rounded-xl bg-[#faf8f5] border border-[#c5a059]/30 text-[#775a19] flex items-center justify-center shadow-xs group-hover:bg-[#c5a059]/15 transition-colors">
            <span className="material-symbols-outlined text-[22px]">{badge.icon}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider flex items-center gap-1 ${badge.color}`}>
            <span className="material-symbols-outlined text-[12px]">{badge.icon}</span>
            <span>{badge.label}</span>
          </span>

          {item.category && (
            <span className="text-[11px] font-medium text-slate-500 capitalize">
              {item.category}
            </span>
          )}

          {item.duration && (
            <span className="text-[11px] text-slate-400">
              • {item.duration}
            </span>
          )}

          {item.badge && item.type !== 'users' && (
            <span className="text-[10px] font-semibold text-[#775a19] bg-[#c5a059]/10 px-1.5 py-0.5 rounded">
              {item.badge}
            </span>
          )}

          {item.price && (
            <span className="ml-auto text-xs font-bold text-primary font-mono">
              {item.price}
            </span>
          )}
        </div>

        {/* Title */}
        <h4 className="font-serif text-base font-semibold text-[#071326] group-hover:text-[#775a19] transition-colors leading-snug line-clamp-1">
          <HighlightText text={item.title} query={query} />
        </h4>

        {/* Subtitle */}
        {item.subtitle && (
          <p className="text-xs text-[#775a19] font-medium mt-0.5 truncate">
            <HighlightText text={item.subtitle} query={query} />
          </p>
        )}

        {/* Description */}
        {item.description && (
          <p className="text-xs text-[#475569] mt-1 line-clamp-2 leading-relaxed font-light">
            <HighlightText text={item.description} query={query} />
          </p>
        )}

        {/* Extra pill tags for Experts */}
        {item.type === 'experts' && Array.isArray(item.specialties) && item.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.specialties.slice(0, 3).map((s, idx) => (
              <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                {s}
              </span>
            ))}
            {item.specialties.length > 3 && (
              <span className="text-[10px] text-slate-400 self-center">
                +{item.specialties.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Arrow */}
      <div className="shrink-0 self-center pl-2 text-slate-400 group-hover:text-[#775a19] group-hover:translate-x-1 transition-all">
        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
      </div>
    </div>
  );
}
