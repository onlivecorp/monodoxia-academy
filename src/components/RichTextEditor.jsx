import React, { useRef, useState, useEffect } from 'react';

/**
 * RichTextEditor Component
 * Supports:
 * - Headings (H1, H2, H3, P)
 * - Bold, Italic, Underline, Strikethrough
 * - Text color, Background color
 * - Unordered & Ordered Lists
 * - Blockquote
 * - Hyperlink insertion & removal
 * - Table generator (insert table, add row/col)
 * - Media upload (Image to /api.php?action=upload_image)
 * - Video Embed (YouTube, Vimeo, MP4)
 * - Alignment (Left, Center, Right, Justify)
 * - Drag and drop image upload
 */
export default function RichTextEditor({ value = '', onChange, placeholder = 'Məzmununuzu bura yazın...' }) {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [htmlMode, setHtmlMode] = useState(false);

  // Sync initial content
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      if (!isFocused) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value, isFocused]);

  const exec = (command, val = null) => {
    editorRef.current?.focus();
    document.execCommand(command, false, val);
    triggerChange();
  };

  const triggerChange = () => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleLink = () => {
    const url = prompt('Bağlantı URL ünvanını daxil edin (https://...):');
    if (url) {
      exec('createLink', url);
    }
  };

  const handleVideoEmbed = () => {
    const url = prompt('YouTube və ya video embed linkini daxil edin:');
    if (!url) return;

    let embedHtml = '';
    // YouTube detection
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch) {
      const vid = ytMatch[1];
      embedHtml = `<div class="my-4 aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200"><iframe class="w-full h-full" src="https://www.youtube.com/embed/${vid}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div><p><br></p>`;
    } else if (url.endsWith('.mp4') || url.endsWith('.webm')) {
      embedHtml = `<div class="my-4 w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200"><video controls class="w-full max-h-[480px] bg-black"><source src="${url}" type="video/mp4"></video></div><p><br></p>`;
    } else {
      embedHtml = `<div class="my-4 aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200"><iframe class="w-full h-full" src="${url}" frameborder="0" allowfullscreen></iframe></div><p><br></p>`;
    }

    exec('insertHTML', embedHtml);
  };

  const handleInsertTable = () => {
    const rows = parseInt(prompt('Sətir sayı:', '3') || '0', 10);
    const cols = parseInt(prompt('Sütun sayı:', '3') || '0', 10);
    if (!rows || !cols || rows < 1 || cols < 1) return;

    let tableHtml = '<table class="w-full border-collapse border border-slate-300 my-4 text-xs sm:text-sm"><thead><tr>';
    for (let c = 0; c < cols; c++) {
      tableHtml += `<th class="border border-slate-300 bg-amber-500/10 p-2 font-bold text-slate-800 text-left">Başlıq ${c + 1}</th>`;
    }
    tableHtml += '</tr></thead><tbody>';
    for (let r = 0; r < rows; r++) {
      tableHtml += '<tr>';
      for (let c = 0; c < cols; c++) {
        tableHtml += '<td class="border border-slate-300 p-2 text-slate-700">Məlumat</td>';
      }
      tableHtml += '</tr>';
    }
    tableHtml += '</tbody></table><p><br></p>';

    exec('insertHTML', tableHtml);
  };

  const uploadFileAndInsert = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Yalnız şəkil faylı seçə bilərsiniz.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api.php?action=upload_image&prefix=blog_content', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      const data = await res.json().catch(() => null);
      if (data && data.status === 'success' && data.url) {
        const imgHtml = `<figure class="my-4 text-center"><img src="${data.url}" alt="${file.name}" class="rounded-2xl shadow-md max-h-[500px] mx-auto object-cover border border-slate-200" /><figcaption class="text-xs text-slate-400 mt-1 italic">${file.name}</figcaption></figure><p><br></p>`;
        exec('insertHTML', imgHtml);
      } else {
        // Fallback: local reader
        const reader = new FileReader();
        reader.onload = (e) => {
          exec('insertHTML', `<img src="${e.target.result}" class="rounded-2xl max-h-[450px] mx-auto my-3" /><p><br></p>`);
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.warn('Image upload error:', err);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
      uploadFileAndInsert(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="rounded-2xl border border-[#c5a059]/30 bg-white overflow-hidden shadow-sm focus-within:border-[#c5a059] focus-within:ring-2 focus-within:ring-[#c5a059]/20 transition-all flex flex-col">
      {/* TOOLBAR */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-[#faf8f5] border-b border-[#e2d9c8] text-slate-700 text-xs select-none">
        {/* Headings */}
        <select
          onChange={(e) => exec('formatBlock', e.target.value)}
          defaultValue="p"
          className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-700 outline-none cursor-pointer hover:border-amber-500"
          title="Başlıq formatı"
        >
          <option value="p">Normal Mətn (P)</option>
          <option value="h1">Əsas Başlıq (H1)</option>
          <option value="h2">Alt Başlıq (H2)</option>
          <option value="h3">Bölmə Başlığı (H3)</option>
          <option value="blockquote">Sitat (Quote)</option>
          <option value="pre">Kod Bloku</option>
        </select>

        <div className="w-[1px] h-5 bg-slate-200 mx-1" />

        {/* Text Styles */}
        <button
          type="button"
          onClick={() => exec('bold')}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200 font-bold text-slate-800 transition-colors"
          title="Qalın (Ctrl+B)"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => exec('italic')}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200 italic font-serif text-slate-800 transition-colors"
          title="Kursiv (Ctrl+I)"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => exec('underline')}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200 underline text-slate-800 transition-colors"
          title="Altıxətli (Ctrl+U)"
        >
          U
        </button>
        <button
          type="button"
          onClick={() => exec('strikeThrough')}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200 line-through text-slate-800 transition-colors"
          title="Üstüxətli"
        >
          S
        </button>

        <div className="w-[1px] h-5 bg-slate-200 mx-1" />

        {/* Colors */}
        <label className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200 cursor-pointer relative" title="Yazı rəngi">
          <span className="material-symbols-outlined text-[16px] text-amber-700">format_color_text</span>
          <input
            type="color"
            onChange={(e) => exec('foreColor', e.target.value)}
            className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
          />
        </label>
        <label className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200 cursor-pointer relative" title="Arxa fon rəngi (Highlight)">
          <span className="material-symbols-outlined text-[16px] text-amber-500">format_ink_highlighter</span>
          <input
            type="color"
            defaultValue="#fef3c7"
            onChange={(e) => exec('hiliteColor', e.target.value)}
            className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
          />
        </label>

        <div className="w-[1px] h-5 bg-slate-200 mx-1" />

        {/* Alignment */}
        <button
          type="button"
          onClick={() => exec('justifyLeft')}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200 transition-colors"
          title="Sola düzləndir"
        >
          <span className="material-symbols-outlined text-[16px]">format_align_left</span>
        </button>
        <button
          type="button"
          onClick={() => exec('justifyCenter')}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200 transition-colors"
          title="Mərkəzə düzləndir"
        >
          <span className="material-symbols-outlined text-[16px]">format_align_center</span>
        </button>
        <button
          type="button"
          onClick={() => exec('justifyRight')}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200 transition-colors"
          title="Sağa düzləndir"
        >
          <span className="material-symbols-outlined text-[16px]">format_align_right</span>
        </button>
        <button
          type="button"
          onClick={() => exec('justifyFull')}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200 transition-colors"
          title="Hər iki tərəfə bərabərləşdir"
        >
          <span className="material-symbols-outlined text-[16px]">format_align_justify</span>
        </button>

        <div className="w-[1px] h-5 bg-slate-200 mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => exec('insertUnorderedList')}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200 transition-colors"
          title="Sırasız siyahı"
        >
          <span className="material-symbols-outlined text-[16px]">format_list_bulleted</span>
        </button>
        <button
          type="button"
          onClick={() => exec('insertOrderedList')}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200 transition-colors"
          title="Nömrəli siyahı"
        >
          <span className="material-symbols-outlined text-[16px]">format_list_numbered</span>
        </button>
        <button
          type="button"
          onClick={() => exec('formatBlock', 'blockquote')}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200 transition-colors"
          title="Alıntı (Quote)"
        >
          <span className="material-symbols-outlined text-[16px]">format_quote</span>
        </button>

        <div className="w-[1px] h-5 bg-slate-200 mx-1" />

        {/* Media & Embeds */}
        <button
          type="button"
          onClick={handleLink}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200 transition-colors"
          title="Link əlavə et"
        >
          <span className="material-symbols-outlined text-[16px]">link</span>
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200 transition-colors text-amber-700"
          title="Şəkil yüklə"
        >
          <span className="material-symbols-outlined text-[16px]">image</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) uploadFileAndInsert(e.target.files[0]);
          }}
        />

        <button
          type="button"
          onClick={handleVideoEmbed}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200 transition-colors text-rose-600"
          title="Video / YouTube göm (Embed)"
        >
          <span className="material-symbols-outlined text-[16px]">smart_display</span>
        </button>
        <button
          type="button"
          onClick={handleInsertTable}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200 transition-colors"
          title="Cədvəl əlavə et"
        >
          <span className="material-symbols-outlined text-[16px]">table_chart</span>
        </button>
        <button
          type="button"
          onClick={() => exec('insertHorizontalRule')}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200 transition-colors"
          title="Arakəsmə xətti"
        >
          <span className="material-symbols-outlined text-[16px]">horizontal_rule</span>
        </button>

        <div className="w-[1px] h-5 bg-slate-200 mx-1" />

        {/* Clear formatting & Code Toggle */}
        <button
          type="button"
          onClick={() => exec('removeFormat')}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200 transition-colors"
          title="Formatı təmizlə"
        >
          <span className="material-symbols-outlined text-[16px]">format_clear</span>
        </button>
        <button
          type="button"
          onClick={() => setHtmlMode(!htmlMode)}
          className={`px-2 py-1 rounded text-[11px] font-mono transition-colors ${htmlMode ? 'bg-[#071326] text-[#e5c57d]' : 'bg-slate-200 hover:bg-slate-300'}`}
          title="HTML Kodu"
        >
          &lt;/&gt;
        </button>
      </div>

      {/* EDITABLE CONTENT OR HTML SOURCE */}
      {htmlMode ? (
        <textarea
          value={value}
          onChange={(e) => {
            if (onChange) onChange(e.target.value);
            if (editorRef.current) editorRef.current.innerHTML = e.target.value;
          }}
          className="w-full min-h-[280px] p-4 font-mono text-xs text-slate-800 bg-slate-900 text-emerald-400 outline-none resize-y"
          placeholder="HTML kodu bura daxil edin..."
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={triggerChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            triggerChange();
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          data-placeholder={placeholder}
          className="min-h-[280px] p-5 text-sm sm:text-base text-slate-800 outline-none leading-relaxed prose prose-amber max-w-none focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none"
        />
      )}
    </div>
  );
}

