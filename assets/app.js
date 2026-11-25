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
  // delegado: los enlaces de "En esta página" se crean después
  var menu = document.getElementById('sidebar');
  if (menu) menu.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });

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
  if (heads.length && toc) {
    var sidebar = document.getElementById('sidebar');
    var current = null;
    var locked = false; // tras un clic manda el enlace elegido hasta que la persona vuelva a desplazarse
    var setActive = function (id) {
      if (!links[id] || id === current) return;
      current = id;
      Object.keys(links).forEach(function (k) {
        var on = k === id;
        links[k].classList.toggle('active', on);
        if (on) links[k].setAttribute('aria-current', 'location'); else links[k].removeAttribute('aria-current');
      });
      // mantiene visible el subítem activo dentro de la barra, sin mover la página
      var r = links[id].getBoundingClientRect(), s = sidebar.getBoundingClientRect();
      if (r.bottom > s.bottom - 16) sidebar.scrollTop += r.bottom - s.bottom + 48;
      else if (r.top < s.top + 16) sidebar.scrollTop -= s.top - r.top + 48;
    };
    var spy = function () {
      if (locked) return;
      var view = window.innerHeight, y = window.scrollY, total = document.body.offsetHeight;
      if (y > 0 && view + y >= total - 40) { setActive(heads[heads.length - 1].id); return; }
      // cerca del final la línea de lectura baja, para que las últimas secciones cortas también se activen
      var left = total - (view + y), zone = view * 0.6, line = 150;
      if (y > 0 && left < zone) line += (1 - left / zone) * (view - 150);
      var id = heads[0].id;
      heads.forEach(function (h) { if (h.getBoundingClientRect().top <= line) id = h.id; });
      setActive(id);
    };
    var queued = false;
    var queue = function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { queued = false; spy(); });
    };
    var unlock = function () { if (locked) { locked = false; queue(); } };
    toc.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (!a) return;
      locked = true;
      setActive(decodeURIComponent(a.hash.slice(1)));
    });
    ['wheel', 'touchmove'].forEach(function (ev) { addEventListener(ev, function (e) { if (!sidebar.contains(e.target)) unlock(); }, { passive: true }); });
    addEventListener('pointerdown', function (e) { if (!sidebar.contains(e.target)) unlock(); });
    addEventListener('keydown', function (e) { if (/^(Arrow|Page|Home|End| )/.test(e.key) && !sidebar.contains(e.target)) unlock(); });
    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', queue);
    if ('ResizeObserver' in window) new ResizeObserver(queue).observe(body);
    var start = location.hash && decodeURIComponent(location.hash.slice(1));
    if (start && links[start]) { locked = true; setActive(start); }
    spy();
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

  // Tablas con scroll horizontal: accesibles con teclado
  document.querySelectorAll('.table-wrap').forEach(function (t) {
    if (t.scrollWidth > t.clientWidth + 1) { t.tabIndex = 0; t.setAttribute('role', 'region'); t.setAttribute('aria-label', 'Tabla desplazable'); }
  });

  // Fotos del equipo: si el archivo no existe se quedan las iniciales
  document.querySelectorAll('.avatar img').forEach(function (img) {
    var initials = img.parentNode.querySelector('.initials');
    function ok() { img.hidden = false; if (initials) initials.hidden = true; }
    function miss() { img.hidden = true; if (initials) initials.hidden = false; }
    img.addEventListener('load', ok);
    img.addEventListener('error', miss);
    if (img.complete && img.naturalWidth) ok();
  });

  // Los diagramas y las escenas crecen al cargar: se reajusta el ancla hasta que la persona interactúe
  var target = location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (target && 'ResizeObserver' in window) {
    var ro = new ResizeObserver(function () { target.scrollIntoView({ behavior: 'instant', block: 'start' }); });
    var stop = function () { ro.disconnect(); };
    ro.observe(document.body);
    ['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach(function (ev) { addEventListener(ev, stop, { once: true, passive: true }); });
    setTimeout(stop, 6000);
  }

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
          primaryColor: '#D6E4F7', primaryBorderColor: '#0A4DA2', primaryTextColor: '#0F172A',
          lineColor: '#475569', fontFamily: 'Inter, system-ui, sans-serif'
        }
      });
      // Uno por uno: si un diagrama falla, los demás no muestran un aviso falso
      return [].slice.call(diagrams).reduce(function (chain, d) {
        return chain.then(function () { return mermaid.run({ nodes: [d] }); }).catch(function (err) {
          console.error(err); d.insertAdjacentHTML('afterend', '<p class="callout warn">No se pudo dibujar este diagrama.</p>');
        });
      }, Promise.resolve());
    }).catch(function () {
      diagrams.forEach(function (d) {
        d.insertAdjacentHTML('afterend', '<p class="callout warn">No se pudo cargar Mermaid (¿sin conexión?). Arriba se muestra el código fuente del diagrama.</p>');
      });
    });
  }
})();
