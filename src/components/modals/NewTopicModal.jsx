import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import RichTextEditor from '../RichTextEditor';

export default function NewTopicModal() {
  const { newTopicModalOpen, setNewTopicModalOpen, submitTopicApplication, categoriesList = [], currentUser } = useApp();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('İcma & Bloq');
  const [coverImage, setCoverImage] = useState('');
  const [readTime, setReadTime] = useState('4 dəqiqə');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('published'); // 'published' or 'draft'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  if (!newTopicModalOpen) return null;

  const communityCategories = (categoriesList || []).filter(c => c.type === 'community' || c.type === 'all');

  const handleCoverUpload = async (file) => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api.php?action=upload_image&prefix=blog_cover', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      const data = await res.json().catch(() => null);
      if (data && data.status === 'success' && data.url) {
        setCoverImage(data.url);
      } else {
        const reader = new FileReader();
        reader.onload = (e) => setCoverImage(e.target.result);
        reader.readAsDataURL(file);
      }
    } catch (e) {
      const reader = new FileReader();
      reader.onload = (ev) => setCoverImage(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (submitStatus = 'published') => {
    if (!title.trim()) {
      alert('Zəhmət olmasa başlıq daxil edin.');
      return;
    }
    if (!content.trim()) {
      alert('Zəhmət olmasa məqalə məzmunu daxil edin.');
      return;
    }
    setIsSubmitting(true);
    try {
      await submitTopicApplication(title.trim(), content.trim(), category, {
        coverImage,
        readTime,
        category,
        status: submitStatus
      });
      setTitle('');
      setContent('');
      setCoverImage('');
      setCategory('İcma & Bloq');
      setStatus('published');
      setShowPreview(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-[#c5a059]/40 shadow-2xl max-w-4xl w-full my-auto max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* MODAL HEADER */}
        <div className="bg-gradient-to-r from-[#071326] via-[#0d213f] to-[#040e1c] text-white p-5 sm:p-6 relative shrink-0 flex items-center justify-between border-b border-[#c5a059]/30">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-[#e5c57d] tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-[#c5a059]/20 border border-[#c5a059]/40">
                Bloq & İcma Nəşri
              </span>
              {status === 'draft' && (
                <span className="text-[10px] font-semibold text-slate-300 px-2 py-0.5 rounded-full bg-slate-800">
                  Qaralama
                </span>
              )}
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-medium text-white">Yeni Məqalə / Müzakirə Yarat</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                showPreview
                  ? 'bg-[#c5a059] text-white border-[#c5a059]'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20 border-white/20'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span>{showPreview ? 'Redaktora qayıt' : 'Önizləmə'}</span>
            </button>

            <button
              onClick={() => setNewTopicModalOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 text-[#071326]">
          {showPreview ? (
            /* PREVIEW MODE */
            <div className="space-y-6">
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-amber-700">info</span>
                <span>Bu rejim məqalənin saytda necə görünəcəyinin canlı önizləməsidir.</span>
              </div>

              {coverImage && (
                <div className="w-full h-64 sm:h-80 rounded-3xl overflow-hidden shadow-lg border border-slate-200">
                  <img src={coverImage} alt={title} className="w-full h-full object-cover" />
                </div>
              )}

              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#c5a059]/15 text-[#775a19] uppercase tracking-wider mb-2">
                  #{category}
                </span>
                <h1 className="font-serif text-2xl sm:text-4xl text-[#071326] font-medium leading-tight">
                  {title || 'Başlıq daxil edilməyib'}
                </h1>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
                  <span>Müəllif: <strong>{currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Siz'}</strong></span>
                  <span>•</span>
                  <span>Oxu müddəti: {readTime}</span>
                </div>
              </div>

              <div
                className="prose prose-slate max-w-none text-slate-800 leading-relaxed pt-4 border-t border-slate-200"
                dangerouslySetInnerHTML={{ __html: content || '<p className="italic text-slate-400">Məqalə mətni hələ yazılmayıb...</p>' }}
              />
            </div>
          ) : (
            /* EDIT MODE */
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit('published'); }} className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-[#071326] uppercase tracking-wider mb-1.5">
                  Məqalə / Mövzu Başlığı *
                </label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Məs: Fikirləri İdarə Etmək: Stoik Fəlsəfə və Müasir Psixologiya..."
                  className="w-full px-4 py-3 bg-[#faf8f5] border border-[#c5a059]/30 rounded-2xl text-sm font-medium text-[#071326] focus:border-[#775a19] focus:bg-white focus:outline-none transition-all shadow-xs"
                />
              </div>

              {/* Grid: Category, Read Time, Cover Image */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#071326] uppercase tracking-wider mb-1.5">
                    Bölmə / Kateqoriya
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-[#c5a059]/30 rounded-xl text-xs font-medium text-[#071326] focus:border-[#775a19] focus:outline-none cursor-pointer"
                  >
                    {communityCategories.map(cat => (
                      <option key={cat.key} value={cat.name}>{cat.name}</option>
                    ))}
                    <option value="Fərdi İnkişaf">Fərdi İnkişaf</option>
                    <option value="Psixologiya & Şüur">Psixologiya & Şüur</option>
                    <option value="Fəlsəfi Düşüncələr">Fəlsəfi Düşüncələr</option>
                    <option value="Kouçinq & Mentorluq">Kouçinq & Mentorluq</option>
                    <option value="İcma Müzakirəsi">İcma Müzakirəsi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#071326] uppercase tracking-wider mb-1.5">
                    Oxu Müddəti
                  </label>
                  <input
                    type="text"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    placeholder="Məs: 4 dəqiqə"
                    className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-[#c5a059]/30 rounded-xl text-xs text-[#071326] focus:border-[#775a19] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#071326] uppercase tracking-wider mb-1.5">
                    Kover Görsəli (URL və ya Fayl)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="/images/... və ya https://..."
                      className="w-full px-3 py-2 bg-[#faf8f5] border border-[#c5a059]/30 rounded-xl text-xs text-[#071326] focus:border-[#775a19] focus:outline-none"
                    />
                    <label className="px-3 py-2 bg-gradient-to-r from-[#071326] to-[#0c2242] text-[#e5c57d] rounded-xl text-xs font-bold cursor-pointer shrink-0 hover:opacity-90 transition-opacity" title="Kompüterdən şəkil seç">
                      <span className="material-symbols-outlined text-[16px]">upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) handleCoverUpload(e.target.files[0]);
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {coverImage && (
                <div className="relative w-full h-36 rounded-2xl overflow-hidden border border-slate-200">
                  <img src={coverImage} alt="Kover önizləmə" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setCoverImage('')}
                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black transition-colors"
                    title="Şəkli sil"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
              )}

              {/* Rich Text Editor */}
              <div>
                <label className="block text-xs font-bold text-[#071326] uppercase tracking-wider mb-1.5">
                  Məqalə / Məzmun Mətni (Zəngin Redaktor) *
                </label>
                <RichTextEditor
                  value={content}
                  onChange={(html) => setContent(html)}
                  placeholder="Məqalənizi başlıqlar, paraqraflar, şəkillər və videolarla zənginləşdirərək yazın..."
                />
              </div>

              <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 flex items-start gap-3 text-xs text-slate-700">
                <span className="material-symbols-outlined text-amber-700 text-[20px] shrink-0 mt-0.5">verified_user</span>
                <div>
                  <strong className="text-[#071326]">Yüksək Keyfiyyətli Nəşr Standartı:</strong> Məzmununuz dərc edildikdən sonra həm İcma şəbəkəsində müzakirə kimi təqdim olunacaq, həm də oxucular üçün zəngin blog formatında göstəriləcək.
                </div>
              </div>
            </form>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="bg-[#faf8f5] px-6 py-4 border-t border-[#e2d9c8] flex items-center justify-between shrink-0 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit('draft')}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold cursor-pointer transition-colors"
            >
              Qaralama Kimi Saxla
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setNewTopicModalOpen(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Ləğv et
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSubmit('published')}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#071326] to-[#0c2242] text-[#e5c57d] hover:text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              {isSubmitting ? (
                <span>Göndərilir...</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">publish</span>
                  <span>Məqaləni Nəşr Et</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
