export const getVimeoEmbedUrl = (link?: string): string => {
  if (!link) return '';
  try {
    const url = new URL(link);
    // If already player URL, preserve ?h= if present
    if (url.hostname.includes('player.vimeo.com')) {
      const h = url.searchParams.get('h');
      return h ? `${url.origin}${url.pathname}?h=${h}` : `${url.origin}${url.pathname}`;
    }
    // if vimeo.com with query param h=HASH
    if (url.hostname.includes('vimeo.com')) {
      // try to find id in pathname
      const parts = url.pathname.split('/').filter(Boolean);
      const maybeId = parts.length ? parts[parts.length - 1] : null;
      const h = url.searchParams.get('h') || url.searchParams.get('hash');
      if (maybeId && /^\d+$/.test(maybeId)) {
        return h ? `https://player.vimeo.com/video/${maybeId}?h=${h}` : `https://player.vimeo.com/video/${maybeId}`;
      }
    }
  } catch (e) {
    // not a full URL — fall through to regex
  }

  // fallback regex match (captures optional secret hash in path e.g. /ID/HASH)
  const m = String(link).match(/vimeo\.com\/(?:.*\/)?(\d+)(?:\/([0-9A-Za-z_-]+))?/)
    || String(link).match(/player\.vimeo\.com\/video\/(\d+)(?:\?h=([0-9A-Za-z_-]+))?/);
  if (!m) return link;
  const id = m[1];
  const hash = m[2];
  return hash ? `https://player.vimeo.com/video/${id}?h=${hash}` : `https://player.vimeo.com/video/${id}`;
};