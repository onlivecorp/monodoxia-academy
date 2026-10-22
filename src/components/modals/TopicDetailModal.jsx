import React, { useState } from 'react';
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
  const fullContent = topic.content || topic.desc || topic.snippet || '';
  const badgeText = getLocalized(topic, 'badge', currentLang, defaultLang) || topic.badge || 'İcma Müzakirəsi';
  const authorName = topic.author || 'Müəllif';
  const authorRole = topic.authorRole || 'İcma Üzvü';
  const timeText = topic.time || topic.time_ago || 'İndicə';

  const handleLike = (e) => {
    e.stopPropagation();
    likeTopic(topic.id);
  };

  const handleShare = () => {
    try {
      const url = window.location.origin + window.location.pathname + '#icma';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url);
        showToast('Mövzu linki kopyalandı', 'success');
      } else {
        showToast('Mövzu linki: ' + url, 'info');
      }
    } catch (e) {
      showToast('Mövzu linki kopyalandı', 'success');
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
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onClick={closeTopicDetail}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#c5a059]/30 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP LUXURY HEADER */}
        <div className="bg-gradient-to-br from-[#070f1e] via-[#0d213f] to-[#040e1c] text-white p-6 sm:p-8 relative shrink-0 border-b border-[#c5a059]/30">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#c5a059]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={closeTopicDetail}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center transition-all cursor-pointer z-10"
            title="Bağla"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>

          {/* Badge & Pinned tag */}
          <div className="flex items-center gap-2 mb-3 flex-wrap pr-10">
            {topic.pinned && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40 tracking-wider uppercase">
                <span className="material-symbols-outlined text-[13px]">push_pin</span>
                <span>Sabit</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-[#c5a059]/20 text-[#e5c57d] border border-[#c5a059]/40">
              <span className="material-symbols-outlined text-[12px]">forum</span>
              <span>{badgeText}</span>
            </span>
          </div>

          {/* Full Title */}
          <h2 className="font-serif text-2xl sm:text-3xl font-normal leading-snug tracking-tight text-white mb-4">
            "{title}"
          </h2>

          {/* Author & Timestamp Bar */}
          <div className="flex items-center justify-between text-xs text-slate-300 pt-3 border-t border-white/10 flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#9e782f] to-[#c5a059] text-white font-serif font-bold text-xs flex items-center justify-center shadow-sm">
                {authorName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-white leading-tight">{authorName}</p>
                <p className="text-[11px] text-slate-400 font-light">{authorRole}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
              <span className="material-symbols-outlined text-[15px] text-[#c5a059]">schedule</span>
              <span>{timeText}</span>
            </div>
          </div>
        </div>

        {/* SCROLLABLE CONTENT BODY */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-[#071326]">
          {/* Main Post Content */}
          <div className="prose prose-slate max-w-none">
            <div className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal whitespace-pre-line bg-[#faf8f5] p-5 sm:p-6 rounded-2xl border border-[#e2d9c8]/70 shadow-inner">
              {fullContent}
            </div>
          </div>

          {/* Interaction Bar (Like, Comment Count, Share) */}
          <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white border border-[#e2d9c8] shadow-sm flex-wrap gap-3">
            <div className="flex items-center gap-3">
              {/* Like / Unlike Button */}
              <button
                onClick={handleLike}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm ${
                  isLiked
                    ? 'bg-rose-50 border border-rose-300 text-rose-600 hover:bg-rose-100 scale-[1.02]'
                    : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'
                }`}
                title={isLiked ? 'Bəyənməni geri götür' : 'Bəyən'}
              >
                <span className={`material-symbols-outlined text-[18px] transition-transform ${isLiked ? 'text-rose-600 fill-current scale-110' : 'text-slate-400'}`}>
                  {isLiked ? 'favorite' : 'favorite_border'}
                </span>
                <span>{likesCount} {likesCount === 1 ? 'Bəyənmə' : 'Bəyənmə'}</span>
                {isLiked && <span className="text-[10px] text-rose-500 font-bold ml-1">(Bəyəndiniz)</span>}
              </button>

              {/* Comment Count Tag */}
              <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 font-medium">
                <span className="material-symbols-outlined text-[17px] text-[#775a19]">chat_bubble</span>
                <span>{commentsCount} Rəy</span>
              </div>
            </div>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-[#071326] hover:bg-slate-100 transition-colors cursor-pointer"
              title="Linki kopyala"
            >
              <span className="material-symbols-outlined text-[16px] text-[#c5a059]">share</span>
              <span>Paylaş</span>
            </button>
          </div>

          {/* COMMENTS SECTION */}
          <div className="pt-2 space-y-5">
            <div className="flex items-center justify-between border-b border-[#e2d9c8]/70 pb-3">
              <h3 className="font-serif text-lg font-bold text-[#070f1e] flex items-center gap-2">
                <span>Müzakirə və Şərhlər</span>
                <span className="text-xs font-sans font-bold px-2 py-0.5 rounded-full bg-[#c5a059]/15 text-[#775a19]">
                  {commentsCount}
                </span>
              </h3>
              {!currentUser && (
                <button
                  type="button"
                  onClick={() => setAuthModalOpen(true)}
                  className="text-xs text-[#775a19] hover:underline font-medium cursor-pointer"
                >
                  Hesabla daxil ol
                </button>
              )}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSubmitComment} className="space-y-3 bg-[#faf8f5] p-4 sm:p-5 rounded-2xl border border-[#e2d9c8]">
              {!currentUser && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Adınız və ya Təxəllüsünüz (opsional)
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Məs: Kənan M."
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#c5a059]/30 text-xs text-[#071326] focus:outline-none focus:border-[#c5a059] shadow-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  {currentUser ? `Rəy yazırsınız: ${currentUser.firstName || currentUser.email}` : 'Rəyiniz'}
                </label>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Bu mövzu ilə bağlı fikir, təcrübə və ya sualınızı qeyd edin..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#c5a059]/30 text-xs sm:text-sm text-[#071326] focus:outline-none focus:border-[#c5a059] shadow-sm placeholder-slate-400 resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400 italic">
                  İntellektual hörmət və etika qaydalarına riayət edin
                </span>
                <button
                  type="submit"
                  disabled={submitting || !commentText.trim()}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-[#070f1e] to-[#0c2242] hover:from-[#0c2242] hover:to-[#112d55] text-[#e5c57d] text-xs font-semibold tracking-wider uppercase shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  <span>Şərh Yaz</span>
                  <span className="material-symbols-outlined text-[15px]">send</span>
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-3 pt-2">
              {commentsList.length > 0 ? (
                commentsList.map((c, idx) => (
                  <div
                    key={c.id || idx}
                    className="p-4 rounded-2xl bg-white border border-[#e2d9c8]/70 shadow-sm space-y-2 hover:border-[#c5a059]/50 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#c5a059]/20 text-[#775a19] font-bold text-[11px] flex items-center justify-center">
                          {(c.author || 'Q').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-semibold text-[#070f1e]">{c.author || 'Anonim'}</span>
                          {c.authorRole && (
                            <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                              {c.authorRole}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">{c.time || 'İndicə'}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-9 whitespace-pre-line font-normal">
                      {c.text}
                    </p>

                    {/* Action Bar for Comment (Reply trigger) */}
                    <div className="flex items-center justify-between pl-9 pt-1">
                      <button
                        type="button"
                        onClick={() => handleToggleReply(c.id)}
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                          activeReplyId === c.id
                            ? 'text-[#775a19] underline'
                            : 'text-slate-500 hover:text-[#775a19]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[15px]">reply</span>
                        <span>{activeReplyId === c.id ? 'Ləğv et' : 'Cavab yaz'}</span>
                      </button>

                      {Array.isArray(c.replies) && c.replies.length > 0 && (
                        <span className="text-[11px] text-slate-400 font-mono">
                          {c.replies.length} {c.replies.length === 1 ? 'cavab' : 'cavab'}
                        </span>
                      )}
                    </div>

                    {/* Inline Reply Form */}
                    {activeReplyId === c.id && (
                      <form
                        onSubmit={(e) => handleSubmitReply(e, c.id)}
                        className="ml-9 mt-2 p-3 sm:p-4 rounded-xl bg-[#faf8f5] border border-[#c5a059]/40 space-y-2.5 animate-fadeIn"
                      >
                        <div className="flex items-center justify-between text-[11px] text-[#775a19] font-semibold">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">reply</span>
                            <span>{c.author} şəxsinə cavab yazırsınız</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setActiveReplyId(null)}
                            className="text-slate-400 hover:text-slate-600 text-[10px] cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>

                        {!currentUser && (
                          <input
                            type="text"
                            value={replyGuestName}
                            onChange={(e) => setReplyGuestName(e.target.value)}
                            placeholder="Adınız və ya Təxəllüsünüz (opsional)"
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#c5a059]/30 text-xs text-[#071326] focus:outline-none focus:border-[#c5a059]"
                          />
                        )}

                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Cavabınızı bura daxil edin..."
                          rows={2}
                          autoFocus
                          className="w-full px-3 py-2 rounded-lg bg-white border border-[#c5a059]/30 text-xs text-[#071326] focus:outline-none focus:border-[#c5a059] shadow-inner resize-none"
                          required
                        />

                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveReplyId(null)}
                            className="px-3 py-1 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-200/60 cursor-pointer"
                          >
                            Bağla
                          </button>
                          <button
                            type="submit"
                            disabled={submittingReply || !replyText.trim()}
                            className="inline-flex items-center gap-1 px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#070f1e] to-[#0c2242] text-[#e5c57d] text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                          >
                            <span>Cavabla</span>
                            <span className="material-symbols-outlined text-[13px]">send</span>
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Nested Replies List */}
                    {Array.isArray(c.replies) && c.replies.length > 0 && (
                      <div className="ml-9 mt-3 pt-3 border-l-2 border-[#c5a059]/30 pl-3 sm:pl-4 space-y-2.5">
                        {c.replies.map((reply, rIdx) => (
                          <div
                            key={reply.id || rIdx}
                            className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1.5"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-[#070f1e] text-[#e5c57d] font-bold text-[9px] flex items-center justify-center">
                                  {(reply.author || 'Q').charAt(0).toUpperCase()}
                                </div>
                                <span className="font-semibold text-[#070f1e] text-xs">
                                  {reply.author || 'Anonim'}
                                </span>
                                {reply.authorRole && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-200/70 text-slate-600 font-medium">
                                    {reply.authorRole}
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {reply.time || 'İndicə'}
                              </span>
                            </div>

                            <p className="text-xs text-slate-700 pl-7 leading-relaxed whitespace-pre-line font-normal">
                              {reply.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200">
                  <span className="material-symbols-outlined text-3xl text-slate-400 mb-2">chat_bubble_outline</span>
                  <p className="text-xs text-slate-500 font-medium">Hələ ki heç bir şərh yazılmayıb.</p>
                  <p className="text-[11px] text-slate-400 mt-1">Bu mövzu haqqında ilk fikri siz bildirin!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
