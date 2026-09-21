// ---------- Mobile nav toggle ----------
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('header nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('mobile-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('mobile-open')) {
        nav.classList.remove('mobile-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  // ---------- Personal / Professional tabs (About page only) ----------
  const tabs = document.querySelectorAll('.tab');
  if (tabs.length) {
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => selectTab(tab));
      tab.addEventListener('keydown', (e) => {
        const list = Array.from(tabs);
        const i = list.indexOf(tab);
        if (e.key === 'ArrowRight') { e.preventDefault(); list[(i + 1) % list.length].focus(); selectTab(list[(i + 1) % list.length]); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); list[(i - 1 + list.length) % list.length].focus(); selectTab(list[(i - 1 + list.length) % list.length]); }
      });
    });
    function selectTab(tab) {
      tabs.forEach((t) => {
        const selected = t === tab;
        t.setAttribute('aria-selected', selected ? 'true' : 'false');
        t.setAttribute('tabindex', selected ? '0' : '-1');
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) {
          panel.hidden = !selected;
          if (selected) {
            const pending = panel.querySelectorAll('.reveal:not(.is-visible)');
            pending.forEach((el) => el.classList.add('is-visible'));
          }
        }
      });
      if (tab.dataset.hash) history.replaceState(null, '', '#' + tab.dataset.hash);
    }
    const initial = location.hash ? Array.from(tabs).find((t) => t.dataset.hash === location.hash.slice(1)) : null;
    if (initial) selectTab(initial);
  }

  // ---------- Reveal on scroll (very light) ----------
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      revealEls.forEach((el) => io.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add('is-visible'));
    }
  }

  // ---------- Footer year ----------
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  // ---------- Contact form: no server backend on this static site, so we
  // open the visitor's email client with the fields pre-filled. ----------
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const topic = form.topic.value;
      const message = form.message.value.trim();
      const subject = encodeURIComponent(`[${topic}] Message from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:hani.abikhalil@insead.edu?subject=${subject}&body=${body}`;
    });
  }

  // ---------- World map (About page only) ----------
  const mapEl = document.getElementById('world-map');
  if (mapEl && window.jsVectorMap) {
    const livedIn = ['LB', 'AE', 'IT', 'FR', 'SG'];
    const visitedOnly = [
      'ES', 'GB', 'BE', 'NL', 'DE', 'DK', 'SE', 'CH', 'AT', 'CZ', 'SK', 'HR',
      'TR', 'AM', 'GE', 'AZ', 'QA', 'KW', 'SA', 'IQ', 'OM', 'ID', 'MY', 'KH', 'TH', 'HK'
    ];
    const BEIGE = '#d9b98a';
    const DARK_BROWN = '#4a3018';

    new jsVectorMap({
      selector: '#world-map',
      map: 'world',
      zoomButtons: false,
      zoomOnScroll: false,
      backgroundColor: 'transparent',
      regionStyle: { initial: { fill: '#e6e2da', stroke: '#fafaf8', strokeWidth: 0.6 } },
      onRegionTooltipShow(event, tooltip, code) {
        if (livedIn.includes(code)) tooltip.text(tooltip.text() + ' — lived here', false);
        else if (visitedOnly.includes(code)) tooltip.text(tooltip.text() + ' — visited', false);
      }
    });

    const paintRegion = (path) => {
      const code = (path.getAttribute('data-code') || '').toUpperCase();
      let color = null;
      if (livedIn.includes(code)) color = DARK_BROWN;
      else if (visitedOnly.includes(code)) color = BEIGE;
      if (!color) return;
      if (path.getAttribute('fill') !== color) path.setAttribute('fill', color);
      if (path.style.fill !== color) path.style.fill = color;
    };
    const paintMap = () => {
      const svg = mapEl.querySelector('svg');
      if (!svg) return false;
      svg.querySelectorAll('path.jvm-region').forEach(paintRegion);
      return true;
    };
    const start = performance.now ? performance.now() : Date.now();
    const tick = () => {
      paintMap();
      const now = performance.now ? performance.now() : Date.now();
      if (now - start < 4000) {
        requestAnimationFrame(tick);
      } else {
        const svg = mapEl.querySelector('svg');
        if (svg && window.MutationObserver) {
          const observer = new MutationObserver((mutations) => {
            mutations.forEach((m) => {
              if (m.type === 'attributes' && m.attributeName === 'fill' && m.target.matches && m.target.matches('path.jvm-region')) {
                const code = (m.target.getAttribute('data-code') || '').toUpperCase();
                const wantColor = livedIn.includes(code) ? DARK_BROWN : (visitedOnly.includes(code) ? BEIGE : null);
                if (wantColor && m.target.getAttribute('fill') !== wantColor) {
                  m.target.setAttribute('fill', wantColor);
                  m.target.style.fill = wantColor;
                }
              }
            });
          });
          observer.observe(svg, { attributes: true, attributeFilter: ['fill'], subtree: true });
        }
      }
    };
    tick();
  }
});
