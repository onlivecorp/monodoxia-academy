// Monodoxia Academy - Hero Media Helper (Image & Video Framing, Stroke, Radius, Sizing)

/**
 * Parse any video URL (YouTube, Vimeo, direct MP4/WebM/Data URL)
 */
export function parseVideoUrl(url) {
  if (!url || typeof url !== 'string') {
    return { type: 'none', embedUrl: '', rawUrl: '' };
  }

  const cleanUrl = url.trim();

  // YouTube watch / short / embed
  const ytMatch = cleanUrl.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    const id = ytMatch[1];
    return {
      type: 'youtube',
      videoId: id,
      embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&playsinline=1&rel=0&modestbranding=1`,
      rawUrl: cleanUrl
    };
  }

  // Vimeo
  const vimeoMatch = cleanUrl.match(/(?:vimeo\.com\/)(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    const id = vimeoMatch[1];
    return {
      type: 'vimeo',
      videoId: id,
      embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1&autopause=0&background=1`,
      rawUrl: cleanUrl
    };
  }

  // Direct MP4 / WebM / Data URL / Blob
  return {
    type: 'direct',
    rawUrl: cleanUrl
  };
}

/**
 * Compute style objects and classes for Hero Right Media
 */
export function getHeroMediaStyles(hero = {}) {
  const isFrameless = hero.isFrameless === true || hero.frameStyle === 'none';
  const frameStyle = hero.frameStyle || 'arch';

  // Radius calculation
  let outerRadius = '160px 160px 16px 16px';
  let innerRadius = '152px 152px 10px 10px';

  const radiusMode = hero.borderRadius || (frameStyle === 'arch' ? 'arch' : (frameStyle === 'rectangle' ? 'none' : (frameStyle === 'pill' ? 'full' : 'arch')));

  if (radiusMode === 'none' || frameStyle === 'rectangle') {
    outerRadius = '0px';
    innerRadius = '0px';
  } else if (radiusMode === 'sm') {
    outerRadius = '8px';
    innerRadius = isFrameless ? '8px' : '4px';
  } else if (radiusMode === 'md') {
    outerRadius = '16px';
    innerRadius = isFrameless ? '16px' : '10px';
  } else if (radiusMode === 'lg' || frameStyle === 'rounded') {
    outerRadius = '24px';
    innerRadius = isFrameless ? '24px' : '16px';
  } else if (radiusMode === 'xl') {
    outerRadius = '36px';
    innerRadius = isFrameless ? '36px' : '26px';
  } else if (radiusMode === 'full' || frameStyle === 'pill') {
    outerRadius = '9999px';
    innerRadius = '9999px';
  } else if (frameStyle === 'circle') {
    outerRadius = '50%';
    innerRadius = '50%';
  } else if (radiusMode === 'custom') {
    const customPx = hero.customBorderRadius !== undefined ? Number(hero.customBorderRadius) : 24;
    outerRadius = `${customPx}px`;
    innerRadius = isFrameless ? `${customPx}px` : `${Math.max(0, customPx - 6)}px`;
  } else if (radiusMode === 'arch' || frameStyle === 'arch') {
    outerRadius = '160px 160px 16px 16px';
    innerRadius = isFrameless ? '160px 160px 16px 16px' : '152px 152px 10px 10px';
  }

  // Stroke / Border Thickness
  const strokeWidth = hero.strokeWidth !== undefined ? Number(hero.strokeWidth) : 1;
  const strokeColor = hero.strokeColor || 'rgba(197, 160, 89, 0.5)';

  // Max Width
  let maxWidth = '448px'; // default max-w-md
  if (hero.mediaWidth === 'sm') maxWidth = '384px';
  else if (hero.mediaWidth === 'md') maxWidth = '448px';
  else if (hero.mediaWidth === 'lg') maxWidth = '512px';
  else if (hero.mediaWidth === 'xl') maxWidth = '576px';
  else if (hero.mediaWidth === 'full') maxWidth = '100%';
  else if (hero.mediaWidth === 'custom') {
    maxWidth = hero.customMediaWidth ? `${hero.customMediaWidth}px` : '448px';
  }

  // Aspect ratio
  let aspectRatio = '4/5';
  if (hero.aspectRatio === '1/1' || frameStyle === 'circle') aspectRatio = '1/1';
  else if (hero.aspectRatio === '16/9') aspectRatio = '16/9';
  else if (hero.aspectRatio === '3/4') aspectRatio = '3/4';
  else if (hero.aspectRatio === 'auto') aspectRatio = 'auto';
  else if (hero.aspectRatio) aspectRatio = hero.aspectRatio;

  const objectFit = hero.objectFit || 'cover';
  const mediaType = hero.mediaType || 'image';

  return {
    isFrameless,
    frameStyle,
    outerRadius,
    innerRadius,
    strokeWidth,
    strokeColor,
    maxWidth,
    aspectRatio,
    objectFit,
    mediaType
  };
}
