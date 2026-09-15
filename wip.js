(() => {
  const pageTitle = document.title.split(' — ')[0].trim() || 'Project';
  const homeLink = new URL('../index.html', document.baseURI).href;

  const escapeHTML = (value) => value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[character]));

  const renderWipPage = () => {
    const style = document.createElement('style');
    style.textContent = `
      body.wip-active {
        overflow: hidden;
      }
      .wip-overlay {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: grid;
        place-items: center;
        padding: 32px;
        background: #020103;
        color: #ede9f7;
        font-family: 'Space Grotesk', sans-serif;
        text-align: center;
      }
      .wip-shell {
        width: min(100%, 620px);
        padding: 64px 32px;
        border: 1px solid rgba(181, 123, 245, 0.3);
        background: linear-gradient(145deg, rgba(147, 51, 234, 0.16), rgba(2, 1, 3, 0.82));
        box-shadow: 0 0 80px rgba(147, 51, 234, 0.16);
      }
      .wip-mark,
      .wip-kicker {
        color: #b57bf5;
        font-family: 'JetBrains Mono', monospace;
        letter-spacing: 0.08em;
      }
      .wip-mark {
        margin-bottom: 56px;
        font-size: 0.8rem;
      }
      .wip-kicker {
        margin-bottom: 16px;
        font-size: 0.72rem;
      }
      .wip-shell h1 {
        margin-bottom: 18px;
        font-size: clamp(2.25rem, 7vw, 4.5rem);
        line-height: 1;
      }
      .wip-message {
        max-width: 470px;
        margin: 0 auto 32px;
        color: #948aae;
        font-size: 1rem;
      }
      .wip-back {
        color: #ede9f7;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.85rem;
        text-decoration: underline;
        text-underline-offset: 5px;
      }
      .wip-back:hover { color: #b57bf5; }
      @media (max-width: 520px) {
        .wip-overlay { padding: 18px; }
        .wip-shell { padding: 48px 22px; }
      }
    `;
    document.head.appendChild(style);
    document.title = `${pageTitle} — In Progress`;
    document.body.classList.add('wip-active');

    const overlay = document.createElement('main');
    overlay.className = 'wip-overlay';
    overlay.setAttribute('aria-label', 'Project in progress');
    overlay.innerHTML = `
      <main class="wip-shell">
        <div class="wip-mark" aria-hidden="true">[ O. L. ]</div>
        <p class="wip-kicker">PROJECT FILE // IN PROGRESS</p>
        <h1>${escapeHTML(pageTitle)}</h1>
        <p class="wip-message">This project page is being assembled. Check back soon for the full build story, process, and results.</p>
        <a class="wip-back" href="${homeLink}">← Back to portfolio</a>
      </main>
    `;
    document.body.appendChild(overlay);
  };

  if (document.body) {
    renderWipPage();
  } else {
    document.addEventListener('DOMContentLoaded', renderWipPage, { once: true });
  }
})();
