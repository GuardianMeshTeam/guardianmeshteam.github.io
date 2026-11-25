/* Visor de los SVG C4 exportados de draw.io: zoom, arrastre y resaltado de relaciones. */
(function () {
  document.querySelectorAll('figure.c4').forEach(function (fig) {
    var view = fig.querySelector('.c4-view');
    fetch(fig.dataset.src).then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); }).then(function (txt) {
      var svg = new DOMParser().parseFromString(txt, 'image/svg+xml').documentElement;
      if (svg.nodeName !== 'svg') return;
      var alt = view.querySelector('img').alt, b = svg.getAttribute('viewBox').split(/\s+/).map(Number), v = b.slice();
      svg.removeAttribute('width'); svg.removeAttribute('height'); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', alt);
      view.replaceChildren(document.importNode(svg, true)); svg = view.firstElementChild;
      function set() { svg.setAttribute('viewBox', v.join(' ')); }
      function zoom(k) {
        var w = Math.min(b[2], Math.max(b[2] / 6, v[2] * k)), h = w * b[3] / b[2];
        v = [v[0] + (v[2] - w) / 2, v[1] + (v[3] - h) / 2, w, h]; clamp(); set();
      }
      function clamp() { v[0] = Math.max(b[0], Math.min(b[0] + b[2] - v[2], v[0])); v[1] = Math.max(b[1], Math.min(b[1] + b[3] - v[3], v[1])); }
      fig.querySelector('.c4-bar').addEventListener('click', function (e) {
        var z = e.target.dataset && e.target.dataset.z;
        if (z === '+') zoom(.7); else if (z === '-') zoom(1 / .7); else if (z === '0') { v = b.slice(); set(); }
        else if (z === 'full') { if (document.fullscreenElement) document.exitFullscreen(); else if (fig.requestFullscreen) fig.requestFullscreen(); }
      });
      var p = null;
      view.addEventListener('pointerdown', function (e) { if (e.pointerType === 'touch' && v[2] >= b[2]) return; p = [e.clientX, e.clientY]; });
      window.addEventListener('pointermove', function (e) {
        if (!p) return; var k = v[2] / svg.clientWidth; v[0] -= (e.clientX - p[0]) * k; v[1] -= (e.clientY - p[1]) * k; p = [e.clientX, e.clientY]; clamp(); set();
      });
      window.addEventListener('pointerup', function () { p = null; });
      window.addEventListener('pointercancel', function () { p = null; });
      // Resaltado: las aristas se llaman e_<origen>_<destino>
      var cells = [].slice.call(svg.querySelectorAll('[data-cell-id]')).filter(function (c) { return !/^(0|1|title|lg\d|aws|api)$/.test(c.dataset.cellId); });
      var edges = cells.filter(function (c) { return /^e_/.test(c.dataset.cellId); }).map(function (c) { var q = c.dataset.cellId.split('_'); return { el: c, a: q[1], b: q[2] }; });
      function focus(id) {
        var keep = {}; if (id) keep[id] = 1;
        edges.forEach(function (e) { if (id && (e.a === id || e.b === id)) { keep[e.a] = keep[e.b] = keep[e.el.dataset.cellId] = 1; } });
        cells.forEach(function (c) { c.classList.toggle('dim', !!id && !keep[c.dataset.cellId]); });
      }
      svg.addEventListener('pointerover', function (e) { var c = e.target.closest('[data-cell-id]'), id = c && c.dataset.cellId; focus(id && !/^(0|1|title|lg\d|aws|api|e_.*)$/.test(id) ? id : null); });
      svg.addEventListener('pointerleave', function () { focus(null); });
    }).catch(function () { /* queda el <img> */ });
  });
})();
