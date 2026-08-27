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
    // version (silently mis-assigns colors and drops the max value), so
    // set each region's fill directly on the rendered SVG instead.
    const paintMap = () => {
      const svg = mapEl.querySelector('svg');
      if (!svg) return;
      svg.querySelectorAll('path.jvm-region').forEach(path => {
        const code = (path.getAttribute('data-code') || '').toUpperCase();
        if (livedIn.includes(code)) {
          path.style.fill = DARK_BROWN;
        } else if (visitedOnly.includes(code)) {
          path.style.fill = BEIGE;
        }
      });
    };
    paintMap();
    requestAnimationFrame(paintMap);
  }
});
