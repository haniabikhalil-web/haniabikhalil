// ---------- Mobile nav toggle ----------
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('header nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('mobile-open');
    });
  }

  // ---------- Personal / Professional tabs (About page only) ----------
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  if (tabBtns.length && tabPanels.length) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');
        tabBtns.forEach(b => b.classList.toggle('active', b === btn));
        tabPanels.forEach(p => p.classList.toggle('active', p.id === target));
      });
    });
  }

  // ---------- World map (About page only) ----------
  const mapEl = document.getElementById('world-map');
  if (mapEl && window.jsVectorMap) {
    // Countries Hani has lived in
    const livedIn = ['LB', 'AE', 'IT', 'FR', 'SG'];
    // Countries visited but not lived in
    const visitedOnly = [
      'ES', 'GB', 'BE', 'NL', 'DE', 'DK', 'SE', 'CH', 'AT', 'CZ', 'SK', 'HR',
      'TR', 'AM', 'GE', 'AZ', 'QA', 'KW', 'SA', 'IQ', 'OM', 'ID', 'MY', 'KH', 'TH', 'HK'
    ];

    const BEIGE = '#e3c9a0';
    const DARK_BROWN = '#5c3d24';

    const mapInstance = new jsVectorMap({
      selector: '#world-map',
      map: 'world',
      zoomButtons: false,
      zoomOnScroll: false,
      backgroundColor: 'transparent',
      regionStyle: {
        initial: { fill: '#e6e2da', stroke: '#fafaf8', strokeWidth: 0.6 }
      },
      onRegionTooltipShow(event, tooltip, code) {
        if (livedIn.includes(code)) {
          tooltip.text(tooltip.text() + ' — lived here', false);
        } else if (visitedOnly.includes(code)) {
          tooltip.text(tooltip.text() + ' — visited', false);
        }
      }
    });

    // jsVectorMap's built-in series/scale coloring is unreliable in this
    // version (silently mis-assigns colors, and something inside the
    // library keeps re-writing each region's "fill" attribute after our
    // own paint runs). To win reliably regardless of timing, we set the
    // color on both the style AND the attribute, and we keep re-applying
    // it — once per animation frame — for a few seconds after load, plus
    // whenever the library mutates a path's fill attribute again.
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

    // Keep repainting on every animation frame for ~4 seconds, which
    // reliably outlasts whatever async rendering the library does after
    // construction (data load, layout, hover-state resets, etc.).
    const start = performance.now ? performance.now() : Date.now();
    const tick = () => {
      paintMap();
      const now = performance.now ? performance.now() : Date.now();
      if (now - start < 4000) {
        requestAnimationFrame(tick);
      } else {
        // After the initial settle period, keep watching for any further
        // fill changes the library makes on our target regions and
        // correct them immediately.
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
