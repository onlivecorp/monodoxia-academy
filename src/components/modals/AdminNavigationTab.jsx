import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';

export default function AdminNavigationTab() {
  const {
    homeContent,
    updateNavItems,
    resetNavItems,
    DEFAULT_NAVBAR_ITEMS,
    getPageUrl,
    showToast
  } = useApp();

  const { lang, t } = useLanguage();

  const defaultList = DEFAULT_NAVBAR_ITEMS || [
    { id: 'akademiya', pageId: 'akademiya', label: 'Akademiya', labelKey: 'nav_academy', type: 'internal', href: '/akademiya', icon: 'school', visible: true, openInNewTab: false, order: 1, translations: { az: 'Akademiya', en: 'Academy', tr: 'Akademi', ru: 'Академия' } },
    { id: 'koucinq', pageId: 'koucinq', label: 'Kouçinq', labelKey: 'nav_coaching', type: 'internal', href: '/koucinq', icon: 'psychology', visible: true, openInNewTab: false, order: 2, translations: { az: 'Kouçinq', en: 'Coaching', tr: 'Koçluk', ru: 'Коучинг' } },
    { id: 'club', pageId: 'club', label: 'Coaching Club', labelKey: 'nav_club', type: 'internal', href: '/club', icon: 'diamond', visible: true, openInNewTab: false, order: 3, translations: { az: 'Coaching Club', en: 'Coaching Club', tr: 'Coaching Club', ru: 'Coaching Club' } },
    { id: 'tedbirler', pageId: 'tedbirler', label: 'Tədbirlər', labelKey: 'nav_events', type: 'internal', href: '/tedbirler', icon: 'event', visible: true, openInNewTab: false, order: 4, translations: { az: 'Tədbirlər', en: 'Events', tr: 'Etkinlikler', ru: 'Мероприятия' } },
    { id: 'icma', pageId: 'icma', label: 'İcma', labelKey: 'nav_community', type: 'internal', href: '/icma', icon: 'forum', visible: true, openInNewTab: false, order: 5, translations: { az: 'İcma', en: 'Community', tr: 'Topluluk', ru: 'Сообщество' } },
    { id: 'haqqimizda', pageId: 'haqqimizda', label: 'Haqqımızda', labelKey: 'nav_about', type: 'internal', href: '/haqqimizda', icon: 'info', visible: true, openInNewTab: false, order: 6, translations: { az: 'Haqqımızda', en: 'About Us', tr: 'Hakkımızda', ru: 'О нас' } }
  ];

  const getSourceItems = () => {
    if (homeContent?.navbar?.items && Array.isArray(homeContent.navbar.items) && homeContent.navbar.items.length > 0) {
      return [...homeContent.navbar.items].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
    }
    return defaultList;
  };

  const [items, setItems] = useState(getSourceItems);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);

  // Edit / Create Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    type: 'internal', // 'internal' | 'external'
    pageId: 'akademiya',
    customHref: '',
    labelAz: '',
    labelEn: '',
    labelTr: '',
    labelRu: '',
    icon: 'link',
    openInNewTab: false,
    visible: true
  });

  useEffect(() => {
    setItems(getSourceItems());
    setHasUnsavedChanges(false);
  }, [homeContent?.navbar?.items]);

  const BUILTIN_PAGES = [
    { id: 'home', label: 'Ana Səhifə', defaultUrl: '/', icon: 'home' },
    { id: 'akademiya', label: 'Akademiya (Kurslar)', defaultUrl: '/akademiya', icon: 'school' },
    { id: 'koucinq', label: 'Fərdi Kouçinq', defaultUrl: '/koucinq', icon: 'psychology' },
    { id: 'club', label: 'Coaching Club', defaultUrl: '/club', icon: 'diamond' },
    { id: 'tedbirler', label: 'Tədbirlər & Masterklaslar', defaultUrl: '/tedbirler', icon: 'event' },
    { id: 'icma', label: 'İcma & Müzakirə Forumu', defaultUrl: '/icma', icon: 'forum' },
    { id: 'haqqimizda', label: 'Haqqımızda', defaultUrl: '/haqqimizda', icon: 'info' },
    { id: 'custom', label: 'Xüsusi Daxili Keçid (Custom Path / Anchor)', defaultUrl: '', icon: 'alt_route' }
  ];

  const POPULAR_ICONS = [
    'school', 'psychology', 'diamond', 'event', 'forum', 'info',
    'home', 'link', 'open_in_new', 'verified', 'star', 'groups',
    'menu_book', 'contact_support', 'call', 'mail', 'workspace_premium'
  ];

  // Open modal for creating new item
  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      type: 'internal',
      pageId: 'akademiya',
      customHref: '',
      labelAz: '',
      labelEn: '',
      labelTr: '',
      labelRu: '',
      icon: 'school',
      openInNewTab: false,
      visible: true
    });
    setIsModalOpen(true);
  };

  // Open modal for editing existing item
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    const isCustomInternal = item.type === 'internal' && (!item.pageId || item.pageId === 'custom');
    setFormData({
      type: item.type || 'internal',
      pageId: isCustomInternal ? 'custom' : (item.pageId || 'custom'),
      customHref: item.href || '',
      labelAz: item.translations?.az || item.label || '',
      labelEn: item.translations?.en || '',
      labelTr: item.translations?.tr || '',
      labelRu: item.translations?.ru || '',
      icon: item.icon || 'link',
      openInNewTab: Boolean(item.openInNewTab),
      visible: item.visible !== false
    });
    setIsModalOpen(true);
  };

  // Copy AZ label to other languages if empty
  const handleCopyAzToAll = () => {
    if (!formData.labelAz.trim()) {
      showToast('Əvvəlcə Azərbaycan dilində başlıq daxil edin', 'info');
      return;
    }
    setFormData(prev => ({
      ...prev,
      labelEn: prev.labelEn || prev.labelAz,
      labelTr: prev.labelTr || prev.labelAz,
      labelRu: prev.labelRu || prev.labelAz
    }));
    showToast('Azərbaycan dili mətni digər dillərə kopyalandı', 'success');
  };

  // Save Modal (Create or Edit)
  const handleSaveModal = (e) => {
    e.preventDefault();
    if (!formData.labelAz.trim()) {
      showToast('Link başlığı (AZ) mütləq daxil edilməlidir', 'error');
      return;
    }

    let resolvedHref = '';
    let targetPageId = null;

    if (formData.type === 'external') {
      let extUrl = formData.customHref.trim();
      if (!extUrl) {
        showToast('Xarici link ünvanı (URL) daxil edin', 'error');
        return;
      }
      if (!extUrl.startsWith('http://') && !extUrl.startsWith('https://') && !extUrl.startsWith('//')) {
        extUrl = `https://${extUrl}`;
      }
      resolvedHref = extUrl;
    } else {
      // Internal
      if (formData.pageId === 'custom') {
        let path = formData.customHref.trim();
        if (!path) {
          showToast('Daxili keçid yolunu daxil edin (məs: /elaqe və ya #bolme)', 'error');
          return;
        }
        if (!path.startsWith('/') && !path.startsWith('#')) {
          path = `/${path}`;
        }
        resolvedHref = path;
        targetPageId = null;
      } else {
        targetPageId = formData.pageId;
        resolvedHref = getPageUrl ? getPageUrl(targetPageId) : `/${targetPageId === 'home' ? '' : targetPageId}`;
      }
    }

    const payload = {
      id: editingItem ? editingItem.id : `nav_${Date.now()}`,
      type: formData.type,
      pageId: targetPageId,
      href: resolvedHref,
      icon: formData.icon.trim() || 'link',
      label: formData.labelAz.trim(),
      translations: {
        az: formData.labelAz.trim(),
        en: (formData.labelEn || formData.labelAz).trim(),
        tr: (formData.labelTr || formData.labelAz).trim(),
        ru: (formData.labelRu || formData.labelAz).trim()
      },
      openInNewTab: Boolean(formData.openInNewTab),
      visible: Boolean(formData.visible)
    };

    if (editingItem) {
      setItems(prev => prev.map(it => it.id === editingItem.id ? { ...it, ...payload, order: it.order } : it));
      showToast(`"${payload.label}" linki yeniləndi`, 'success');
    } else {
      setItems(prev => [...prev, { ...payload, order: prev.length + 1 }]);
      showToast(`"${payload.label}" menyuya əlavə edildi`, 'success');
    }

    setHasUnsavedChanges(true);
    setIsModalOpen(false);
  };

  // Reorder: Move Up
  const handleMoveUp = (index) => {
    if (index === 0) return;
    setItems(prev => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy.map((it, idx) => ({ ...it, order: idx + 1 }));
    });
    setHasUnsavedChanges(true);
  };

  // Reorder: Move Down
  const handleMoveDown = (index) => {
    if (index === items.length - 1) return;
    setItems(prev => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy.map((it, idx) => ({ ...it, order: idx + 1 }));
    });
    setHasUnsavedChanges(true);
  };

  // Drag and Drop reordering
  const handleDragStart = (e, idx) => {
    setDraggedIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, idx) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;
    setDragOverIdx(idx);
  };

  const handleDrop = (e, targetIdx) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) {
      setDraggedIdx(null);
      setDragOverIdx(null);
      return;
    }
    setItems(prev => {
      const copy = [...prev];
      const [draggedItem] = copy.splice(draggedIdx, 1);
      copy.splice(targetIdx, 0, draggedItem);
      return copy.map((it, idx) => ({ ...it, order: idx + 1 }));
    });
    setDraggedIdx(null);
    setDragOverIdx(null);
    setHasUnsavedChanges(true);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  // Toggle visible status
  const handleToggleVisible = (itemId) => {
    setItems(prev => prev.map(it => {
      if (it.id === itemId) {
        const nextVis = it.visible === false;
        return { ...it, visible: nextVis };
      }
      return it;
    }));
    setHasUnsavedChanges(true);
  };

  // Delete Item
  const handleConfirmDelete = () => {
    if (!deleteConfirmItem) return;
    setItems(prev => {
      const filtered = prev.filter(it => it.id !== deleteConfirmItem.id);
      return filtered.map((it, idx) => ({ ...it, order: idx + 1 }));
    });
    showToast(`"${deleteConfirmItem.label || deleteConfirmItem.id}" menyudan silindi`, 'info');
    setDeleteConfirmItem(null);
    setHasUnsavedChanges(true);
  };

  // Save changes to database and context
  const handleSaveAll = () => {
    const finalItems = items.map((it, idx) => ({
      ...it,
      order: idx + 1
    }));
    if (updateNavItems) {
      updateNavItems(finalItems);
    }
    setHasUnsavedChanges(false);
    showToast('Naviqasiya menyusu uğurla yadda saxlandı!', 'success');
  };

  // Reset to default
  const handleResetToDefault = () => {
    if (resetNavItems) {
      resetNavItems();
    }
    setItems(defaultList);
    setHasUnsavedChanges(false);
    setResetConfirmOpen(false);
  };

  // Helper to resolve localized label for display
  const getItemLabel = (item) => {
    if (item.translations?.[lang]) return item.translations[lang];
    if (item.labelKey && t) {
      const translated = t(item.labelKey);
      if (translated && translated !== item.labelKey) return translated;
    }
    return item.label || item.id;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      
      {/* HEADER CARD */}
      <div className="bg-gradient-to-r from-[#070f1e] via-[#0d1a30] to-[#112240] rounded-2xl p-6 text-white border border-[#c5a059]/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#c5a059]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#c5a059]/20 text-[#e5c57d] border border-[#c5a059]/30">
                <span className="material-symbols-outlined text-[24px]">menu_open</span>
              </span>
              <div>
                <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  Naviqasiya Menyusu İdarəetməsi
                </h3>
                <p className="text-xs text-slate-300">
                  Saytın menyu ardıcıllığını dəyişin, daxili səhifələr və ya xarici keçidlər əlavə edin
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => setResetConfirmOpen(true)}
              className="px-3.5 py-2 rounded-xl border border-slate-600 hover:border-slate-400 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="İlkin standart menyu elementlərinə qaytar"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>Standarta Qaytar</span>
            </button>

            <button
              type="button"
              onClick={handleOpenCreate}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#9e782f] to-[#c5a059] hover:from-[#8b6826] hover:to-[#b08e48] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Yeni Link Əlavə Et</span>
            </button>

            <button
              type="button"
              onClick={handleSaveAll}
              disabled={!hasUnsavedChanges}
              className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
                hasUnsavedChanges
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse'
                  : 'bg-emerald-950/60 text-emerald-400/80 border border-emerald-800/40 cursor-default'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span>{hasUnsavedChanges ? 'Dəyişiklikləri Yadda Saxla' : 'Yadda Saxlanılıb'}</span>
            </button>
          </div>
        </div>

        {/* LIVE HEADER PREVIEW STRIP */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#c5a059] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              Canlı Menyu İcmalı (Canlı Ziyarətçi Görünüşü)
            </span>
            <span className="text-[10px] text-slate-400">
              {items.filter(i => i.visible !== false).length} görünən / {items.length} ümumi link
            </span>
          </div>

          <div className="bg-[#fcfbf9] rounded-xl p-3 border border-[#c5a059]/40 shadow-inner flex items-center gap-2 overflow-x-auto text-slate-900">
            <span className="text-[11px] font-bold text-[#775a19] px-2.5 py-1 rounded bg-[#c5a059]/15 border border-[#c5a059]/30 shrink-0">
              MONODOXIA
            </span>
            <div className="h-4 w-px bg-slate-300 shrink-0" />
            <div className="flex items-center gap-2 shrink-0">
              {items
                .filter(i => i.visible !== false)
                .map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs hover:border-[#c5a059] transition-all whitespace-nowrap"
                  >
                    <span className="material-symbols-outlined text-[15px] text-[#775a19]">
                      {item.icon || 'link'}
                    </span>
                    <span>{getItemLabel(item)}</span>
                    {item.type === 'external' && (
                      <span className="material-symbols-outlined text-[11px] text-slate-400">open_in_new</span>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* UNSAVED CHANGES WARNING ALERT */}
      {hasUnsavedChanges && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-center justify-between gap-3 text-amber-900 shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="material-symbols-outlined text-[20px] text-amber-600">notification_important</span>
            <span>Menyuda yadda saxlanılmamış dəyişikliklər var! Dəyişikliklərin saytda aktiv olması üçün "Dəyişiklikləri Yadda Saxla" düyməsini sıxın.</span>
          </div>
          <button
            type="button"
            onClick={handleSaveAll}
            className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
          >
            İndi Yadda Saxla
          </button>
        </div>
      )}

      {/* ITEMS LIST */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Naviqasiya Linkləri və Sıralama
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200 font-bold text-slate-700">
              {items.length}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 hidden sm:flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">drag_indicator</span>
            <span>Sıranı dəyişmək üçün blokları sürükləyin və ya ox düymələrindən istifadə edin</span>
          </div>
        </div>

        <div className="divide-y divide-slate-100 p-2">
          {items.map((item, index) => {
            const isFirst = index === 0;
            const isLast = index === items.length - 1;
            const isDragging = draggedIdx === index;
            const isOver = dragOverIdx === index;
            const isVisible = item.visible !== false;

            return (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`p-3.5 rounded-xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                  isDragging ? 'opacity-40 bg-slate-100 scale-98' : ''
                } ${isOver ? 'border-2 border-dashed border-[#c5a059] bg-[#fffbeb]' : 'hover:bg-slate-50/80'} ${
                  !isVisible ? 'opacity-60 bg-slate-50' : ''
                }`}
              >
                {/* LEFT INFO */}
                <div className="flex items-center gap-3 min-w-0">
                  {/* Drag Handle */}
                  <div
                    className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-grab active:cursor-grabbing shrink-0"
                    title="Sürükləyərək yerini dəyişin"
                  >
                    <span className="material-symbols-outlined text-[20px]">drag_indicator</span>
                  </div>

                  {/* Order Number Badge */}
                  <span className="w-6 h-6 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-mono font-bold text-[11px] flex items-center justify-center shrink-0">
                    #{index + 1}
                  </span>

                  {/* Icon badge */}
                  <span className="w-9 h-9 rounded-xl bg-[#c5a059]/15 border border-[#c5a059]/40 text-[#775a19] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">
                      {item.icon || 'link'}
                    </span>
                  </span>

                  {/* Titles and destination */}
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {getItemLabel(item)}
                      </h4>

                      {/* Type Badge */}
                      {item.type === 'external' ? (
                        <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[11px]">open_in_new</span>
                          Xarici Link
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[11px]">home_pin</span>
                          Daxili Səhifə
                        </span>
                      )}

                      {/* Open In New Tab indicator */}
                      {item.openInNewTab && (
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold">
                          _blank (Yeni Pəncərə)
                        </span>
                      )}

                      {/* Visibility Status */}
                      {!isVisible && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-300 text-[10px] font-bold">
                          Gizli (Menyuda yoxdur)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono truncate">
                      <span className="truncate max-w-xs sm:max-w-md">{item.href}</span>
                      {item.translations && (
                        <span className="text-[10px] font-sans font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          AZ: {item.translations.az || item.label} | EN: {item.translations.en || '-'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* RIGHT ACTIONS */}
                <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                  
                  {/* Move Up Button */}
                  <button
                    type="button"
                    onClick={() => handleMoveUp(index)}
                    disabled={isFirst}
                    className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center transition-all ${
                      isFirst
                        ? 'opacity-30 border-slate-200 text-slate-300 cursor-not-allowed'
                        : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-300 cursor-pointer'
                    }`}
                    title="Yuxarı qaldır"
                  >
                    <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                  </button>

                  {/* Move Down Button */}
                  <button
                    type="button"
                    onClick={() => handleMoveDown(index)}
                    disabled={isLast}
                    className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center transition-all ${
                      isLast
                        ? 'opacity-30 border-slate-200 text-slate-300 cursor-not-allowed'
                        : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-300 cursor-pointer'
                    }`}
                    title="Aşağı endir"
                  >
                    <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                  </button>

                  {/* Visibility Switch */}
                  <button
                    type="button"
                    onClick={() => handleToggleVisible(item.id)}
                    className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                      isVisible
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'border-slate-200 bg-slate-100 text-slate-400 hover:bg-slate-200'
                    }`}
                    title={isVisible ? 'Menyudan gizlət' : 'Menyuda göstər'}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isVisible ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>

                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:text-[#775a19] hover:bg-[#c5a059]/10 hover:border-[#c5a059]/50 flex items-center justify-center transition-all cursor-pointer"
                    title="Redaktə et"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmItem(item)}
                    className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 flex items-center justify-center transition-all cursor-pointer"
                    title="Sil"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden animate-scaleUp">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-[#070f1e] to-[#112240] text-white flex items-center justify-between border-b border-[#c5a059]/30">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-[#c5a059]/20 text-[#e5c57d]">
                  <span className="material-symbols-outlined text-[20px]">
                    {editingItem ? 'edit' : 'add_link'}
                  </span>
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingItem ? 'Naviqasiya Linkini Redaktə Et' : 'Yeni Naviqasiya Linki Əlavə Et'}
                  </h3>
                  <p className="text-xs text-slate-300">
                    Menyu elementinin tipini, səhifəsini və tərcümələrini tənzimləyin
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveModal} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              
              {/* LINK TYPE SELECTOR (DAHILI vs XARICI) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Link Tipi (Daxili və ya Harici)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'internal' }))}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                      formData.type === 'internal'
                        ? 'bg-[#c5a059]/10 border-[#c5a059] shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[22px] ${formData.type === 'internal' ? 'text-[#775a19]' : 'text-slate-400'}`}>
                      home_pin
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Daxili Səhifə (Internal)</div>
                      <div className="text-[10px] text-slate-500">Sayt daxili səhifə və ya bölmə</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'external', openInNewTab: true }))}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                      formData.type === 'external'
                        ? 'bg-[#c5a059]/10 border-[#c5a059] shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[22px] ${formData.type === 'external' ? 'text-[#775a19]' : 'text-slate-400'}`}>
                      open_in_new
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Xarici Link (External)</div>
                      <div className="text-[10px] text-slate-500">Instagram, xarici sayt, portal və s.</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* TARGET DESTINATION */}
              {formData.type === 'internal' ? (
                <div className="space-y-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mövcud Səhifəni Seçin:
                    </label>
                    <select
                      value={formData.pageId}
                      onChange={(e) => {
                        const selPage = e.target.value;
                        const pageObj = BUILTIN_PAGES.find(p => p.id === selPage);
                        setFormData(prev => ({
                          ...prev,
                          pageId: selPage,
                          icon: pageObj ? pageObj.icon : prev.icon,
                          labelAz: prev.labelAz || (pageObj && pageObj.id !== 'custom' ? pageObj.label.split(' ')[0] : '')
                        }));
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#c5a059]"
                    >
                      {BUILTIN_PAGES.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.label} {p.defaultUrl ? `(${p.defaultUrl})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formData.pageId === 'custom' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Xüsusi Daxili Yol / Anchor (URL):
                      </label>
                      <input
                        type="text"
                        value={formData.customHref}
                        onChange={e => setFormData(p => ({ ...p, customHref: e.target.value }))}
                        placeholder="/haqqimizda və ya #bolme"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-mono text-slate-800 focus:outline-none focus:border-[#c5a059]"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">
                        Məsələn: /sertifikatlar və ya #haqqimizda
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Xarici Link URL Ünvanı:
                  </label>
                  <input
                    type="text"
                    value={formData.customHref}
                    onChange={e => setFormData(p => ({ ...p, customHref: e.target.value }))}
                    placeholder="https://instagram.com/monodoxia.academy"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-mono text-slate-800 focus:outline-none focus:border-[#c5a059]"
                  />
                  <p className="text-[10px] text-slate-500">
                    İstifadəçi linkə kliklədikdə bu ünvana yönləndiriləcək.
                  </p>
                </div>
              )}

              {/* TITLE & TRANSLATIONS */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Link Başlığı (Çoxdilli)
                  </label>
                  <button
                    type="button"
                    onClick={handleCopyAzToAll}
                    className="text-[11px] text-[#775a19] hover:text-[#c5a059] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">content_copy</span>
                    <span>AZ-dən digər dillərə kopyala</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Azərbaycan dili (Əsas) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.labelAz}
                      onChange={e => setFormData(p => ({ ...p, labelAz: e.target.value }))}
                      placeholder="Məs: Kurslar və ya Haqqımızda"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      İngilis dili (EN)
                    </label>
                    <input
                      type="text"
                      value={formData.labelEn}
                      onChange={e => setFormData(p => ({ ...p, labelEn: e.target.value }))}
                      placeholder="e.g. Courses or About Us"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Türk dili (TR)
                    </label>
                    <input
                      type="text"
                      value={formData.labelTr}
                      onChange={e => setFormData(p => ({ ...p, labelTr: e.target.value }))}
                      placeholder="Örn: Kurslar veya Hakkımızda"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Rus dili (RU)
                    </label>
                    <input
                      type="text"
                      value={formData.labelRu}
                      onChange={e => setFormData(p => ({ ...p, labelRu: e.target.value }))}
                      placeholder="Напр: Курсы или О нас"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>
              </div>

              {/* ICON PICKER */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  İkon (Material Symbol)
                </label>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-[#c5a059]/15 border border-[#c5a059]/40 text-[#775a19] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[24px]">
                      {formData.icon || 'link'}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={e => setFormData(p => ({ ...p, icon: e.target.value }))}
                    placeholder="İkon adı (məs: school, diamond, call)"
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-mono text-slate-900 focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_ICONS.map(ic => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, icon: ic }))}
                      className={`p-1.5 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                        formData.icon === ic
                          ? 'bg-[#c5a059] text-white border-[#c5a059] shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                      title={ic}
                    >
                      <span className="material-symbols-outlined text-[16px]">{ic}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* TOGGLES: OPEN IN NEW TAB & VISIBILITY */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.openInNewTab}
                    onChange={e => setFormData(p => ({ ...p, openInNewTab: e.target.checked }))}
                    className="w-4 h-4 text-[#c5a059] rounded focus:ring-0"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Yeni Pəncərədə Aç</span>
                    <span className="text-[10px] text-slate-500 block">target="_blank" atributu</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.visible}
                    onChange={e => setFormData(p => ({ ...p, visible: e.target.checked }))}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-0"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Menyuda Görünsün</span>
                    <span className="text-[10px] text-slate-500 block">Aktiv/Deaktiv statusu</span>
                  </div>
                </label>
              </div>

              {/* ACTION BUTTONS */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#9e782f] to-[#c5a059] text-white text-xs font-bold shadow-md hover:from-[#8b6826] hover:to-[#b08e48] cursor-pointer"
                >
                  {editingItem ? 'Yenilə və Tətbiq Et' : 'Əlavə Et'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 w-full max-w-md space-y-4 animate-scaleUp">
            <div className="flex items-center gap-3 text-red-600">
              <span className="p-2 rounded-xl bg-red-100">
                <span className="material-symbols-outlined text-[24px]">delete</span>
              </span>
              <div>
                <h4 className="text-base font-bold text-slate-900">Linki Silmək İstəyirsiniz?</h4>
                <p className="text-xs text-slate-500">Bu link naviqasiya menyusundan xaric ediləcək.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
              <strong>{getItemLabel(deleteConfirmItem)}</strong> ({deleteConfirmItem.href})
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmItem(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
              >
                İmtina
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Bəli, Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESET CONFIRMATION MODAL */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 w-full max-w-md space-y-4 animate-scaleUp">
            <div className="flex items-center gap-3 text-amber-600">
              <span className="p-2 rounded-xl bg-amber-100">
                <span className="material-symbols-outlined text-[24px]">restart_alt</span>
              </span>
              <div>
                <h4 className="text-base font-bold text-slate-900">Standart Menyuya Qayıdılsın?</h4>
                <p className="text-xs text-slate-500">Bütün xüsusi əlavələr silinəcək və ilkin 6 səhifəlik standart menyu bərpa olunacaq.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
              >
                İmtina
              </button>
              <button
                type="button"
                onClick={handleResetToDefault}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Bəli, Bərpa Et
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
