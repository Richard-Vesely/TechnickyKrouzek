document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear().toString();

  // Copy buttons
  document.querySelectorAll('[data-copy-target]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const targetSelector = btn.getAttribute('data-copy-target');
      if (!targetSelector) return;
      const targetEl = document.querySelector(targetSelector);
      if (!targetEl) return;
      const text = targetEl.innerText;
      try {
        await navigator.clipboard.writeText(text);
        const original = btn.textContent;
        btn.textContent = 'Zkopírováno!';
        setTimeout(() => (btn.textContent = original), 1200);
      } catch (e) {
        console.error('Copy failed', e);
      }
    });
  });

  // Project page dynamic content
  if (window.PROJECT_CONFIG) {
    const { youtubeUrl, codeUrl } = window.PROJECT_CONFIG;

    // Setup YouTube iframe if URL provided
    const embed = document.getElementById('video-embed');
    if (embed) {
      const frame = embed.querySelector('iframe');
      if (frame && youtubeUrl) {
        const videoId = extractYouTubeId(youtubeUrl);
        if (videoId) {
          frame.src = `https://www.youtube.com/embed/${videoId}?rel=0`;
        }
      }
    }

    // Setup code link
    const codeLink = document.getElementById('code-link');
    if (codeLink) {
      if (codeUrl) {
        codeLink.href = codeUrl;
        codeLink.setAttribute('target', '_blank');
        codeLink.textContent = 'Otevřít zdrojový kód';
      } else {
        codeLink.removeAttribute('href');
        codeLink.textContent = 'URL na kód doplníme později';
      }
    }
  }
});

function extractYouTubeId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) {
      return u.pathname.slice(1);
    }
    if (u.searchParams.has('v')) {
      return u.searchParams.get('v');
    }
    const parts = u.pathname.split('/');
    const shortsIdx = parts.indexOf('shorts');
    if (shortsIdx >= 0 && parts[shortsIdx + 1]) return parts[shortsIdx + 1];
    const idx = parts.indexOf('embed');
    if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
    return null;
  } catch {
    return null;
  }
}

// Global config fallback to avoid ReferenceErrors if not defined in page
window.PROJECT_CONFIG = window.PROJECT_CONFIG || null;


