(function () {
  var body = document.body;

  // Menú móvil
  var btn = document.getElementById('menu-btn');
  var scrim = document.getElementById('scrim');
  function setNav(open) {
    body.classList.toggle('nav-open', open);
    if (btn) btn.setAttribute('aria-expanded', String(open));
  }
  if (btn) btn.addEventListener('click', function () { setNav(!body.classList.contains('nav-open')); });
  if (scrim) scrim.addEventListener('click', function () { setNav(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });
  document.querySelectorAll('.sidebar a').forEach(function (a) {
    a.addEventListener('click', function () { setNav(false); });
  });

  // Tabla de contenido desde los h2 + resaltado de la sección activa
  var toc = document.getElementById('toc-list');
  var heads = [].slice.call(document.querySelectorAll('main h2[id]'));
  var links = {};
  if (toc) {
    heads.forEach(function (h) {
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent;
      toc.appendChild(a);
      links[h.id] = a;
    });
  }
  if (heads.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        Object.keys(links).forEach(function (k) { links[k].classList.remove('active'); });
        if (links[en.target.id]) links[en.target.id].classList.add('active');
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    heads.forEach(function (h) { io.observe(h); });
  }

  // Botones "Copiar"
  document.querySelectorAll('.codeblock').forEach(function (block) {
    var b = block.querySelector('.copy');
    var code = block.querySelector('pre');
    if (!b || !code) return;
    function done(ok) {
      b.textContent = ok ? '¡Copiado!' : 'Selecciona y copia';
      setTimeout(function () { b.textContent = 'Copiar'; }, 1800);
    }
    b.addEventListener('click', function () {
      var text = code.innerText;
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
        return;
      }
      var t = document.createElement('textarea');
      t.value = text; t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(t);
      done(ok);
    });
  });

  // Imágenes opcionales: si faltan, queda visible el espacio reservado
  document.querySelectorAll('figure.image-slot img').forEach(function (img) {
    var empty = img.parentNode.querySelector('.slot-empty');
    function miss() { img.hidden = true; if (empty) empty.hidden = false; }
    function ok() { img.hidden = false; if (empty) empty.hidden = true; }
    img.addEventListener('error', miss);
    img.addEventListener('load', ok);
    if (img.complete) { if (img.naturalWidth) ok(); else miss(); }
  });

  // Mermaid v11 (si no hay red, se queda el código fuente del diagrama)
  var diagrams = document.querySelectorAll('pre.mermaid');
  if (diagrams.length) {
    import('https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs').then(function (m) {
      var mermaid = m.default;
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: 'base',
        themeVariables: {
          primaryColor: '#D5EDFF', primaryBorderColor: '#1769A6', primaryTextColor: '#163B59',
          lineColor: '#52697B', fontFamily: 'Inter, system-ui, sans-serif'
        }
      });
      return mermaid.run({ nodes: diagrams });
    }).catch(function () {
      diagrams.forEach(function (d) {
        d.insertAdjacentHTML('afterend', '<p class="callout warn">No se pudo cargar Mermaid (¿sin conexión?). Arriba se muestra el código fuente del diagrama.</p>');
      });
    });
  }
})();
