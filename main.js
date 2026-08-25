// ---------- Mobile nav toggle ----------
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('header nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('mobile-open');
    });
  }

  // ---------- World map (About page only) ----------
  const mapEl = document.getElementById('world-map');
  if (mapEl && window.jsVectorMap) {
    // Countries Hani has lived in
    const livedIn = ['LB', 'IT', 'AE', 'QA', 'SG', 'FR'];

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
          values: Object.fromEntries(livedIn.map(code => [code, 1])),
          scale: ['#d9b98a', '#d9b98a'],
          normalizeFunction: 'linear'
        }]
      },
      onRegionTooltipShow(event, tooltip, code) {
        if (livedIn.includes(code)) {
          tooltip.text(tooltip.text() + ' — lived here', false);
        }
      }
    });
  }
});
