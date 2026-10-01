import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function NewTopicModal() {
  const { newTopicModalOpen, setNewTopicModalOpen, addTopic } = useApp();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  if (!newTopicModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content) return;
    addTopic(title, content);
    setTitle('');
    setContent('');
  };

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4">
      <div className="bg-surface-bright rounded-lg border border-outline-variant shadow-2xl max-w-lg w-full p-6 relative">
        <button
          onClick={() => setNewTopicModalOpen(false)}
          className="absolute top-4 right-4 text-outline hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[22px]">close</span>
        </button>

        <h4 className="font-headline-sm text-primary font-serif mb-4">Yeni İcma Müzakirəsi Başlat</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-xs font-semibold text-primary mb-1">Mövzu Başlığı</label>
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="məsələn: Daxili tənqidçi ilə barışıq..."
              className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded text-xs text-primary focus:border-secondary"
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-primary mb-1">Fikir və Təcrübəniz</label>
            <textarea
              required
              rows="4"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="İcma ilə bölüşmək istədiyiniz sual və ya müşahidələrinizi yazın..."
              className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded text-xs text-primary focus:border-secondary"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-primary-container text-on-primary hover:bg-[#112240] rounded text-xs font-semibold tracking-wider transition-colors"
          >
            Mövzunu Dərc Et
          </button>
        </form>
      </div>
    </div>
  );
}
