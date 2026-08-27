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

    const values = {};
    visitedOnly.forEach(code => { values[code] = 1; });
    livedIn.forEach(code => { values[code] = 2; });

    new jsVectorMap({
      selector: '#world-map',
      map: 'world',
      zoomButtons: false,
      zoomOnScroll: false,
      backgroundColor: 'transparent',
      regionStyle: {
        initial: { fill: '#e6e2da', stroke: '#fafaf8', strokeWidth: 0.6 },
        hover: { fill: '#c9c2b4', cursorPointer: true }
      },
      series: {
        regions: [{
          attribute: 'fill',
          values: values,
          scale: ['#e3c9a0', '#5c3d24'],
          normalizeFunction: 'linear',
          min: 1,
          max: 2
        }]
      },
      onRegionTooltipShow(event, tooltip, code) {
        if (livedIn.includes(code)) {
          tooltip.text(tooltip.text() + ' — lived here', false);
        } else if (visitedOnly.includes(code)) {
          tooltip.text(tooltip.text() + ' — visited', false);
        }
      }
    });
  }
});
