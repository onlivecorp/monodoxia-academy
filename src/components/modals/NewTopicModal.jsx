import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function NewTopicModal() {
  const { newTopicModalOpen, setNewTopicModalOpen, submitTopicApplication, categoriesList = [] } = useApp();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('İcma Müzakirəsi');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!newTopicModalOpen) return null;

  const communityCategories = (categoriesList || []).filter(c => c.type === 'community' || c.type === 'all');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setIsSubmitting(true);
    try {
      await submitTopicApplication(title.trim(), content.trim(), category);
      setTitle('');
      setContent('');
      setCategory('İcma Müzakirəsi');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4">
      <div className="bg-surface-bright rounded-lg border border-outline-variant shadow-2xl max-w-lg w-full p-6 relative">
        <button
          onClick={() => setNewTopicModalOpen(false)}
          className="absolute top-4 right-4 text-outline hover:text-primary transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">close</span>
        </button>

        <div className="mb-4">
          <span className="text-[11px] font-bold text-secondary tracking-widest uppercase block mb-1">
            İcma & Forum Moderasiyası
          </span>
          <h4 className="font-headline-sm text-primary font-serif">Yeni İcma Müzakirəsi Başlat</h4>
          <p className="text-xs text-on-surface-variant mt-1">
            Mövzunuz göndərildikdən sonra Admin tərəfindən təsdiq olunacaq və dərhal saytda yayımlanacaq.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-primary mb-1">Mövzu Başlığı *</label>
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="məsələn: Daxili tənqidçi ilə barışıq..."
              className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded text-xs text-primary focus:border-secondary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary mb-1">Bölmə / Kateqoriya</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded text-xs text-primary focus:border-secondary focus:outline-none"
            >
              {communityCategories.map(cat => (
                <option key={cat.key} value={cat.name}>
                  {cat.name}
                </option>
              ))}
              <option value="İcma Müzakirəsi">İcma Müzakirəsi</option>
              <option value="Sual-Cavab">Sual-Cavab</option>
              <option value="Təcrübə Bölüşümü">Təcrübə Bölüşümü</option>
              <option value="Kitab Klubu">Kitab Klubu</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary mb-1">Fikir və Məzmununuz *</label>
            <textarea
              required
              rows="4"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="İcma ilə bölüşmək istədiyiniz sual və ya müşahidələrinizi yazın..."
              className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded text-xs text-primary focus:border-secondary focus:outline-none"
            ></textarea>
          </div>

          <div className="p-3 bg-secondary/5 rounded-lg border border-secondary/20 flex items-start gap-2 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">verified_user</span>
            <span>
              Göndərdiyiniz mövzu <strong>Admin &gt; Müraciətlər</strong> bölməsində yoxlanılacaq. Təsdiqləndikdə şəxsi kabinetinizə bildiriş gələcək və mövzu saytda görünəcək.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setNewTopicModalOpen(false)}
              className="px-4 py-2 border border-outline-variant rounded text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            >
              Ləğv Et
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-primary-container text-on-primary hover:bg-[#112240] rounded text-xs font-semibold tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              <span>{isSubmitting ? 'Göndərilir...' : 'Təsdiqə Göndər'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
