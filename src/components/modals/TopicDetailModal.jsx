import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { getLocalized } from '../../i18n/localize';

export default function TopicDetailModal() {
  const {
    topicDetailModalOpen,
    closeTopicDetail,
    selectedTopic,
    likeTopic,
    isTopicLiked,
    addCommentToTopic,
    currentUser,
    setAuthModalOpen,
    showToast
  } = useApp();

  const { currentLang, defaultLang } = useLanguage();

  const [commentText, setCommentText] = useState('');
  const [guestName, setGuestName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyGuestName, setReplyGuestName] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  if (!topicDetailModalOpen || !selectedTopic) return null;

  const topic = selectedTopic;
  const isLiked = isTopicLiked(topic.id);
  const likesCount = typeof topic.likes === 'number' ? topic.likes : 0;
  const commentsList = Array.isArray(topic.comments) ? topic.comments : [];
  const commentsCount = commentsList.reduce((acc, c) => acc + 1 + (Array.isArray(c.replies) ? c.replies.length : 0), 0) || topic.repliesCount || 0;

  const title = getLocalized(topic, 'title', currentLang, defaultLang) || topic.title || '';
  const rawContent = topic.content || topic.desc || topic.snippet || '';
  const badgeText = getLocalized(topic, 'badge', currentLang, defaultLang) || topic.badge || 'İcma & Bloq';
  const authorName = topic.author || 'Müəllif';
  const authorRole = topic.authorRole || 'İcma Üzvü';
  const timeText = topic.time || topic.time_ago || 'İndicə';
  const coverImage = topic.coverImage || topic.image || '';
  const readTime = topic.readTime || '3 dəqiqə';

  // Sanitize Rich Text HTML to prevent XSS attacks
  const sanitizedHtml = DOMPurify.sanitize(rawContent, {
    ADD_TAGS: ['iframe', 'video', 'source', 'figure', 'figcaption'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'controls']
  });

  const handleLike = (e) => {
    e.stopPropagation();
    likeTopic(topic.id);
  };

  const handleShare = () => {
    try {
      const url = window.location.origin + window.location.pathname + '#icma';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url);
        showToast('Məqalə linki kopyalandı', 'success');
      } else {
        showToast('Məqalə linki: ' + url, 'info');
      }
    } catch (e) {
      showToast('Məqalə linki kopyalandı', 'success');
    }
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) {
      showToast('Zəhmət olmasa rəyinizi daxil edin', 'warning');
      return;
    }
    setSubmitting(true);
    const success = addCommentToTopic(topic.id, commentText, guestName);
    if (success) {
      setCommentText('');
    }
    setSubmitting(false);
  };

  const handleToggleReply = (commentId) => {
    if (activeReplyId === commentId) {
      setActiveReplyId(null);
      setReplyText('');
    } else {
      setActiveReplyId(commentId);
      setReplyText('');
    }
  };

  const handleSubmitReply = (e, parentCommentId) => {
    e.preventDefault();
    if (!replyText.trim()) {
      showToast('Zəhmət olmasa cavabınızı daxil edin', 'warning');
      return;
    }
    setSubmittingReply(true);
    const success = addCommentToTopic(topic.id, replyText, replyGuestName, parentCommentId);
    if (success) {
      setReplyText('');
      setActiveReplyId(null);
    }
    setSubmittingReply(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onClick={closeTopicDetail}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#c5a059]/40 overflow-hidden my-auto max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* EDITORIAL BLOG HERO HEADER */}
        <div className="bg-gradient-to-br from-[#070f1e] via-[#0d213f] to-[#040e1c] text-white relative shrink-0 border-b border-[#c5a059]/30">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#c5a059]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={closeTopicDetail}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer z-20 shadow-md"
            title="Bağla"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>

          <div className="p-6 sm:p-10 relative z-10 pr-16 sm:pr-20">
            {/* Meta Tags */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {topic.pinned && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40 tracking-wider uppercase">
                  <span className="material-symbols-outlined text-[13px]">push_pin</span>
                  <span>Sabitlənmiş Məqalə</span>
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-[#c5a059]/25 text-[#e5c57d] border border-[#c5a059]/40 shadow-xs">
                <span className="material-symbols-outlined text-[13px]">article</span>
                <span>{badgeText}</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-300 font-mono bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                <span className="material-symbols-outlined text-[13px] text-[#e5c57d]">timer</span>
                <span>{readTime}</span>
              </span>
            </div>

            {/* Article Headline */}
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-[2.6rem] font-medium leading-[1.25] tracking-tight text-white mb-6">
              {title}
            </h1>

            {/* Author Byline Bar */}
            <div className="flex items-center justify-between text-xs text-slate-300 pt-4 border-t border-white/15 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#9e782f] to-[#c5a059] text-white font-serif font-bold text-sm flex items-center justify-center shadow-md border-2 border-white/20 shrink-0">
                  {authorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm leading-tight">{authorName}</p>
                  <p className="text-[11px] text-slate-300 font-light">{authorRole}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-400 text-xs">
                <div className="flex items-center gap-1 font-mono">
                  <span className="material-symbols-outlined text-[15px] text-[#c5a059]">calendar_today</span>
                  <span>{timeText}</span>
                </div>
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Məqalə linkini kopyala"
                >
                  <span className="material-symbols-outlined text-[14px] text-[#e5c57d]">share</span>
                  <span>Paylaş</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SCROLLABLE ARTICLE BODY */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-8 flex-1 text-[#071326] bg-[#faf8f5]">
          
          {/* Cover Image Feature */}
          {coverImage && (
            <div className="w-full max-h-[420px] rounded-3xl overflow-hidden shadow-lg border border-[#c5a059]/25 bg-slate-900">
              <img
                src={coverImage}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Editorial Content Body */}
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#c5a059]/25 shadow-sm">
            <div
              className="prose prose-slate max-w-none text-slate-800 leading-relaxed font-normal text-base sm:text-lg space-y-4"
              dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
            />
          </div>

          {/* Social Interaction Toolbar */}
          <div className="flex items-center justify-between py-4 px-6 rounded-2xl bg-white border border-[#c5a059]/25 shadow-sm flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                  isLiked
                    ? 'bg-rose-50 border border-rose-300 text-rose-600 hover:bg-rose-100 scale-[1.02]'
                    : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'
                }`}
              >
                <span className={`material-symbols-outlined text-[18px] ${isLiked ? 'text-rose-600 fill-current' : 'text-slate-400'}`}>
                  {isLiked ? 'favorite' : 'favorite_border'}
                </span>
                <span>{likesCount} Bəyənmə</span>
              </button>

              <div className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold">
                <span className="material-symbols-outlined text-[18px] text-[#775a19]">comment</span>
                <span>{commentsCount} Şərh</span>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-[#071326] hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-[#c5a059]">content_copy</span>
              <span>Linki Kopyala</span>
            </button>
          </div>

          {/* DISCUSSION & COMMENTS SECTION */}
          <div className="space-y-6 pt-2">
            <div className="flex items-center justify-between border-b border-[#c5a059]/30 pb-3">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#070f1e] flex items-center gap-2">
                <span>Oxucu Şərhləri və Müzakirə</span>
                <span className="text-xs font-sans font-bold px-2.5 py-0.5 rounded-full bg-[#c5a059]/15 text-[#775a19]">
                  {commentsCount}
                </span>
              </h3>
              {!currentUser && (
                <button
                  type="button"
                  onClick={() => setAuthModalOpen(true)}
                  className="text-xs text-[#775a19] hover:underline font-semibold cursor-pointer"
                >
                  Daxil olaraq yazın
                </button>
              )}
            </div>

            {/* Comment Post Form */}
            {topic.allowComments !== false ? (
              <form onSubmit={handleSubmitComment} className="space-y-3 bg-white p-5 sm:p-6 rounded-2xl border border-[#c5a059]/30 shadow-xs">
                {!currentUser && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Adınız və ya Təxəllüsünüz
                    </label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Məs: Rəşad M."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-slate-200 text-xs text-[#071326] focus:outline-none focus:border-[#775a19]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {currentUser ? `Şərh yazırsınız: ${currentUser.firstName || currentUser.name || currentUser.email}` : 'Fikir və Təhliliniz'}
                  </label>
                  <textarea
                    rows="3"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Məqalə haqqında fikir və suallarınızı bölüşün..."
                    className="w-full px-4 py-3 rounded-xl bg-[#faf8f5] border border-slate-200 text-sm text-[#071326] focus:outline-none focus:border-[#775a19] focus:bg-white transition-all shadow-inner"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400 font-light">Etik və konstruktiv dialoqa üstünlük verilir.</span>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#071326] to-[#0c2242] text-[#e5c57d] hover:text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm hover:shadow"
                  >
                    {submitting ? 'Göndərilir...' : 'Şərhi Göndər'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 text-xs text-slate-500 italic text-center">
                Bu məqalə üçün şərhlər müəllif tərəfindən bağlanmışdır.
              </div>
            )}

            {/* Comments List */}
            {commentsList.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-4 bg-white rounded-2xl border border-dashed border-slate-200">
                Hələ heç bir şərh yazılmayıb. İlk şərhi siz yazın!
              </p>
            ) : (
              <div className="space-y-4">
                {commentsList.map((c) => (
                  <div key={c.id || Math.random()} className="bg-white p-5 rounded-2xl border border-[#c5a059]/20 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-[#071326] font-bold text-xs flex items-center justify-center border border-slate-200">
                          {(c.author || 'Q')[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#071326]">{c.author || 'Oxucu'}</p>
                          <p className="text-[10px] text-slate-400">{c.time || 'İndicə'}</p>
                        </div>
                      </div>

                      {topic.allowComments !== false && (
                        <button
                          type="button"
                          onClick={() => handleToggleReply(c.id)}
                          className="text-[11px] font-bold text-[#775a19] hover:text-[#071326] transition-colors cursor-pointer"
                        >
                          Cavab yaz
                        </button>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-10">
                      {c.text || c.content}
                    </p>

                    {/* Replies */}
                    {Array.isArray(c.replies) && c.replies.length > 0 && (
                      <div className="ml-10 pt-2 space-y-2 border-l-2 border-amber-200 pl-4">
                        {c.replies.map((r, rIdx) => (
                          <div key={r.id || rIdx} className="bg-[#faf8f5] p-3 rounded-xl border border-slate-100 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-bold text-[#071326]">{r.author || 'Cavab'}</span>
                              <span className="text-[10px] text-slate-400">{r.time || 'İndicə'}</span>
                            </div>
                            <p className="text-xs text-slate-700">{r.text || r.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Input Form */}
                    {activeReplyId === c.id && (
                      <form onSubmit={(e) => handleSubmitReply(e, c.id)} className="ml-10 pt-2 space-y-2">
                        {!currentUser && (
                          <input
                            type="text"
                            value={replyGuestName}
                            onChange={(e) => setReplyGuestName(e.target.value)}
                            placeholder="Adınız..."
                            className="w-full px-3 py-1.5 rounded-lg bg-[#faf8f5] border border-slate-200 text-xs text-[#071326]"
                          />
                        )}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Cavabınızı yazın..."
                            className="flex-1 px-3 py-2 rounded-xl bg-[#faf8f5] border border-slate-200 text-xs text-[#071326] focus:outline-none focus:border-[#775a19]"
                          />
                          <button
                            type="submit"
                            disabled={submittingReply}
                            className="px-3.5 py-2 rounded-xl bg-[#071326] text-[#e5c57d] text-xs font-bold cursor-pointer hover:bg-black transition-colors"
                          >
                            Cavabla
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
