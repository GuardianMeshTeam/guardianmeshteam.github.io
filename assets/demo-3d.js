/* Simulación 3D End-to-End de GuardianMesh (Three.js).
   <div class="demo3d" id="demo3d"></div>
   Necesita el importmap de architecture.html (lo usa OrbitControls). */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/* ---------- tiempos (segundos de los videos) ----------
   El reloj maestro es video-victima.mp4. En ese video el semáforo pasa a rojo en el
   segundo 23,0 (el cronómetro de la llamada marca 00:17) y el aviso se confirma en 29,2.
   Si se cambia el video, basta con ajustar estos valores. */
const RISK_AT = 23.0, NOTIFY_AT = 29.2;
const STEPS = [
  { attacker: 0, victim: 2, title: 'Inicio de llamada', state: 'Semáforo Verde', level: 'g',
    text: 'El atacante inicia la llamada; GuardianMesh etiqueta la conexión como protegida y analiza el audio en tiempo real.' },
  { attacker: 10, victim: 10, title: 'Pretexto de emergencia', state: 'Monitoreo activo', level: 'g',
    text: 'El atacante simula un choque y pide 10 millones de pesos con urgencia mientras el motor evalúa el contexto.' },
  { attacker: 23.2, victim: 23.2, title: 'Detección de Riesgo Alto', state: 'Semáforo Rojo', level: 'r',
    text: 'La IA detecta presión financiera y urgencia: la pantalla cambia a Riesgo Alto, avisa por voz, vibra y habilita el botón «Avisar».' },
  { attacker: 30, victim: 30, title: 'Notificación a Persona de Confianza', state: 'Aviso enviado', level: 'r',
    text: "Al pulsar 'Avisar', la persona de confianza recibe la alerta inmediata en su panel de Avisos." }
];
const ASSETS = new URL('demo/', import.meta.url).href;

const C = { navy: 0x071D49, blue: 0x0A4DA2, emerald: 0x00B87C, emeraldD: 0x008256, red: 0xDC2626, orange: 0xEA580C,
  bone: 0xF8FAFC, concrete: 0x64748B, concreteD: 0x475569, bars: 0x1E293B, wood: 0xE7D3B5, woodD: 0xB98B5E,
  skin: 0xE8B48F, skinD: 0xC98B64, white: 0xFFFFFF, black: 0x15171C, leaf: 0x2F9E6B, sky: 0xBFD6F2, gray: 0xB9C1CC };
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const damp = (dt, k) => 1 - Math.exp(-dt * k);

/* ---------- primitivas ---------- */
const mat = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: .78, metalness: .02, ...o });
const flat = (color, o = {}) => new THREE.MeshBasicMaterial({ color, toneMapped: false, ...o });
function mesh(geo, m, x = 0, y = 0, z = 0) {
  const o = new THREE.Mesh(geo, m.isMaterial ? m : mat(m));
  o.position.set(x, y, z); o.castShadow = o.receiveShadow = !o.material.isMeshBasicMaterial;
  return o;
}
const group = (...c) => { const g = new THREE.Group(); if (c.length) g.add(...c); return g; };
const at = (o, x, y, z, ry = 0) => { o.position.set(x, y, z); o.rotation.y = ry; return o; };
const box = (w, h, d, m, x, y, z) => mesh(new THREE.BoxGeometry(w, h, d), m, x, y, z);
const ball = (r, m, x, y, z) => mesh(new THREE.SphereGeometry(r, 26, 18), m, x, y, z);
const cyl = (a, b, h, m, x, y, z, s = 24) => mesh(new THREE.CylinderGeometry(a, b, h, s), m, x, y, z);
/** Cápsula entre dos puntos (extremidades). */
function limb(a, b, r, m) {
  const o = mesh(new THREE.CapsuleGeometry(r, a.distanceTo(b), 5, 12), m);
  o.position.copy(a).add(b).multiplyScalar(.5);
  o.quaternion.setFromUnitVectors(V(0, 1, 0), b.clone().sub(a).normalize());
  return o;
}
function roundedShape(w, h, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
}
/** Bloque redondeado apoyado en y. */
function soft(w, h, d, m, x, y, z, r = .12) {
  const b = Math.min(.05, h / 3), k = Math.min(r, w / 2.2, d / 2.2);
  const g = new THREE.ExtrudeGeometry(roundedShape(w - 2 * b, d - 2 * b, k), { depth: Math.max(h - 2 * b, .01), bevelSize: b, bevelThickness: b, bevelSegments: 2, curveSegments: 6 });
  g.rotateX(-Math.PI / 2); g.translate(0, b, 0);
  return mesh(g, m, x, y, z);
}
const edgeMat = new THREE.LineBasicMaterial({ color: C.navy, transparent: true, opacity: .22 });
function edged(o) { o.add(new THREE.LineSegments(new THREE.EdgesGeometry(o.geometry, 30), edgeMat)); return o; }

/* ---------- personajes ---------- */
/** Mira hacia +z y sostiene un celular iluminado. */
function person({ skin, hair, shirt, pants, seated = false, accent = null, long = false, elder = false, glow = C.emerald }) {
  const g = group(), dy = seated ? -.32 : 0, y = v => v + dy, S = mat(skin), T = mat(shirt), P = mat(pants);
  for (const s of [-1, 1]) {
    const hip = V(s * .19, y(.92), 0);
    if (seated) {
      const knee = V(s * .21, .62, .62);
      g.add(limb(hip, knee, .15, P), limb(knee, V(s * .21, .16, .7), .12, P), soft(.24, .13, .4, C.black, s * .21, 0, .78));
    } else g.add(limb(hip, V(s * .2, .2, 0), .14, P), soft(.24, .13, .4, C.black, s * .2, 0, .06));
  }
  const torso = mesh(new THREE.CapsuleGeometry(.33, .46, 6, 20), T, 0, y(1.26), 0); torso.scale.z = .8; g.add(torso);
  if (accent !== null) {
    for (const s of [-1, 1]) g.add(box(.09, .56, .04, accent, s * .17, y(1.32), .25));
    const belt = mesh(new THREE.TorusGeometry(.32, .05, 8, 28), mat(accent), 0, y(1.0), 0); belt.rotation.x = Math.PI / 2; belt.scale.y = .82; g.add(belt);
  }
  for (const s of [-1, 1]) {
    const sh = V(s * .4, y(1.55), .02), el = V(s * .46, y(1.16), .2), ha = V(s * .13, y(1.32), .6);
    g.add(limb(sh, el, .115, T), limb(el, ha, .1, T), ball(.115, S, ha.x, ha.y, ha.z));
  }
  g.add(cyl(.12, .13, .2, S, 0, y(1.83), 0));
  const head = group(ball(.34, S, 0, 0, 0)); head.position.set(0, y(2.16), .02); head.rotation.x = .2; g.add(head);
  const H = mat(hair);
  const cap = mesh(new THREE.SphereGeometry(.375, 26, 16, 0, Math.PI * 2, 0, Math.PI * .5), H, 0, .04, -.04); cap.rotation.x = -.38; head.add(cap);
  if (long) for (const s of [-1, 1]) head.add(limb(V(s * .28, .06, -.12), V(s * .27, -.42, -.08), .11, H));
  if (long) head.add(limb(V(0, .05, -.22), V(0, -.42, -.2), .2, H));
  for (const s of [-1, 1]) head.add(ball(.036, C.navy, s * .12, .02, .315));
  if (elder) {
    for (const s of [-1, 1]) head.add(mesh(new THREE.TorusGeometry(.085, .015, 8, 22), mat(C.navy), s * .12, .02, .335), ball(.1, H, s * .31, .04, -.02));
    head.add(box(.06, .015, .015, C.navy, 0, .03, .345));
  }
  const ph = group(soft(.36, .05, .66, C.navy, 0, 0, 0, .07)), scr = mesh(new THREE.PlaneGeometry(.3, .58), flat(glow), 0, .056, 0);
  scr.rotation.x = -Math.PI / 2; ph.add(scr); ph.position.set(0, y(1.36), .64); ph.rotation.x = .85; g.add(ph);
  g.userData = { screen: scr, hand: V(0, y(1.45), .68) };
  return g;
}

/* ---------- mobiliario ---------- */
function plant(k = 1) {
  const g = group(cyl(.26, .2, .42, C.bone, 0, .21, 0), cyl(.23, .23, .04, 0x5B4636, 0, .42, 0));
  for (let i = 0; i < 7; i++) {
    const a = i / 7 * Math.PI * 2, r = i % 2 ? .24 : .36;
    const l = ball(.17, i % 2 ? C.leaf : 0x23805A, Math.cos(a) * r * .8, .82 + (i % 3) * .2, Math.sin(a) * r * .8); l.scale.set(.75, 1.75, .75);
    l.rotation.set(Math.sin(a) * .45, 0, -Math.cos(a) * .45); g.add(l);
  }
  const c = ball(.18, C.leaf, 0, 1.2, 0); c.scale.y = 1.9; g.add(c); g.scale.setScalar(k);
  return g;
}
function frameArt(w, h, color) { return group(box(w, h, .07, C.white, 0, 0, 0), box(w - .16, h - .16, .08, color, 0, 0, .005)); }

/** Maqueta de esquina: piso grueso y dos muros a 90°, girada para que la esquina quede al fondo. */
function room(size, h, { floor, walls, base }) {
  const g = group(), t = .18, half = size / 2;
  g.add(edged(box(size + t, .34, size + t, base, -t / 2, -.17, -t / 2)), box(size, .03, size, floor, 0, .015, 0));
  g.add(edged(box(t, h, size + t, walls, -half - t / 2, h / 2, -t / 2)), edged(box(size, h, t, walls, 0, h / 2, -half - t / 2)));
  g.add(box(.05, .16, size, base, -half + .025, .11, 0), box(size, .16, .05, base, 0, .11, -half + .025));
  g.rotation.y = -Math.PI / 4;
  return g;
}

function cellDiorama() {
  const S = 5.6, h = 3.4, g = group(), r = room(S, h, { floor: C.concreteD, walls: C.concrete, base: 0x334155 }), m = S / 2; g.add(r);
  for (let i = 1; i < 4; i++) { // juntas de los bloques de concreto
    r.add(box(.02, .03, S, 0x56657A, -m + .011, i * .85, 0), box(S, .03, .02, 0x56657A, 0, i * .85, -m + .011));
  }
  const metal = mat(C.bars, { metalness: .55, roughness: .42 });
  for (let x = -m + .2; x <= m - .1; x += .56) r.add(cyl(.055, .055, h - .1, metal, x, h / 2, m - .08, 12));
  r.add(box(S, .12, .16, metal, 0, .12, m - .08), box(S, .12, .16, metal, 0, h - .1, m - .08), box(S, .09, .12, metal, 0, 1.55, m - .08));
  // litera contra el muro derecho
  for (const y of [.62, 1.95]) r.add(box(2.7, .09, 1.05, metal, .9, y, -m + .62), soft(2.5, .16, .9, 0x94A3B8, .9, y + .05, -m + .62), soft(.5, .14, .7, 0xCBD5E1, 1.85, y + .2, -m + .62));
  for (const x of [-.4, 2.2]) for (const z of [-m + .14, -m + 1.1]) r.add(cyl(.05, .05, 2.6, metal, x, 1.3, z, 10));
  // ventana enrejada en el muro izquierdo
  r.add(box(.06, .9, 1.2, 0xA9BDD6, -m + .03, 2.5, .6));
  for (let i = -2; i <= 2; i++) r.add(cyl(.03, .03, .9, metal, -m + .08, 2.5, .6 + i * .24, 8));
  const lamp = new THREE.PointLight(0xBFD8FF, 7, 7, 1.8); lamp.position.set(0, 3, 0); g.add(lamp);
  const p = person({ skin: C.skinD, hair: C.black, shirt: 0x374151, pants: 0x1F2937, accent: C.orange, glow: C.orange });
  p.scale.setScalar(1.12); at(p, -.75, .03, 1.05, .5); g.add(p);
  const hand = p.localToWorld.bind(p); p.updateMatrixWorld(true);
  const waves = group(), origin = hand(p.userData.hand.clone());
  for (let i = 0; i < 3; i++) { const w = mesh(new THREE.TorusGeometry(.3, .022, 8, 40), flat(i % 2 ? C.orange : C.red, { transparent: true, opacity: 0, depthWrite: false })); waves.add(w); }
  waves.position.copy(origin); g.add(waves); g.userData = { waves, person: p };
  return g;
}
function homeDiorama() {
  const S = 6.6, h = 3.6, g = group(), r = room(S, h, { floor: C.wood, walls: C.bone, base: 0xD6C3A3 }), m = S / 2; g.add(r);
  r.add(soft(4.3, .05, 3.5, C.blue, .35, .03, .35, .08), soft(4.0, .06, 3.2, C.navy, .35, .035, .35, .08));
  r.add(box(.06, 1.5, 1.9, C.white, -m + .03, 2.1, .9), box(.07, 1.3, 1.7, C.sky, -m + .035, 2.1, .9), box(.09, 1.4, .06, C.white, -m + .04, 2.1, .9));
  r.add(at(frameArt(.95, 1.2, C.emerald), -1.5, 2.3, -m + .05), at(frameArt(.75, .75, C.blue), -.35, 2.45, -m + .05));
  r.add(box(1.9, .9, .6, C.woodD, 1.6, .48, -m + .36), box(2.0, .07, .68, C.woodD, 1.6, .96, -m + .36));
  for (let i = 0; i < 4; i++) r.add(box(.12, .42 + (i % 2) * .1, .3, [C.blue, C.emeraldD, C.orange, C.navy][i], 1.1 + i * .16, 1.2 + (i % 2) * .05, -m + .36));
  r.add(at(plant(1.05), -m + .75, .03, -m + .8));
  // sillón
  const a = group(), cloth = mat(0xD9E3F0), cloth2 = mat(0xC3D2E6);
  a.add(soft(1.75, .42, 1.5, cloth2, 0, .16, 0, .2), soft(1.2, .2, 1.1, cloth, 0, .56, .1, .16));
  const back = soft(1.6, 1.25, .38, cloth, 0, .5, -.62, .16); back.rotation.x = -.1; a.add(back);
  for (const s of [-1, 1]) a.add(soft(.32, .62, 1.4, cloth, s * .78, .36, .02, .14));
  for (const x of [-.7, .7]) for (const z of [-.55, .55]) a.add(cyl(.06, .05, .18, C.woodD, x, .09, z, 10));
  const p = person({ skin: C.skin, hair: 0xF1F5F9, shirt: C.blue, pants: 0x64748B, seated: true, elder: true });
  p.position.set(0, .14, .02); p.scale.setScalar(1.1); a.add(p); at(a, -.15, .06, .5, .32); a.scale.setScalar(1.12); g.add(a);
  // mesita con lámpara
  const t = group(cyl(.5, .5, .07, C.woodD, 0, .78, 0), cyl(.06, .06, .78, C.woodD, 0, .39, 0), cyl(.3, .34, .06, C.woodD, 0, .03, 0));
  t.add(cyl(.17, .2, .06, C.navy, 0, .85, 0), cyl(.03, .03, .5, C.navy, 0, 1.1, 0), mesh(new THREE.CylinderGeometry(.2, .34, .42, 28, 1, true), flat(0xFFE3A8, { side: THREE.DoubleSide }), 0, 1.48, 0));
  at(t, 1.75, .05, .35); g.add(t);
  const warm = new THREE.PointLight(0xFFC977, 9, 6, 1.7); warm.position.set(1.75, 1.65, .55); g.add(warm);
  const alert = new THREE.PointLight(C.emerald, 5, 6, 1.6); alert.position.set(0, 2.6, 1.6); g.add(alert);
  g.userData = { alert, person: p };
  return g;
}
function studyDiorama() {
  const S = 5.6, h = 3.4, g = group(), r = room(S, h, { floor: 0xEADFCB, walls: 0xF1F5F9, base: 0xCBD5E1 }), m = S / 2; g.add(r);
  r.add(soft(3.5, .05, 3.0, 0x9DBDE6, .3, .03, .45, .08), soft(3.2, .06, 2.7, C.sky, .3, .035, .45, .08));
  // escritorio contra el muro derecho
  r.add(box(2.5, .09, 1.05, C.woodD, .75, 1.05, -m + .62));
  for (const x of [-.4, 1.9]) r.add(box(.08, 1.02, .9, C.white, x, .52, -m + .62));
  r.add(box(.8, .04, .52, C.gray, .75, 1.12, -m + .68));
  const lid = box(.8, .54, .04, C.navy, .75, 1.4, -m + .4), glow = mesh(new THREE.PlaneGeometry(.72, .46), flat(0xBFE3FF), 0, 0, .022); lid.rotation.x = -.16; lid.add(glow); r.add(lid);
  r.add(cyl(.09, .08, .18, C.emerald, 1.55, 1.19, -m + .6), at(frameArt(.9, .7, C.blue), 1.2, 2.45, -m + .05), at(frameArt(.6, .85, C.emerald), .1, 2.45, -m + .05));
  // silla
  const ch = group(soft(.8, .12, .8, C.navy, 0, .6, 0), cyl(.05, .05, .5, C.gray, 0, .35, 0), cyl(.38, .38, .06, C.bars, 0, .06, 0));
  const b = soft(.75, .85, .1, C.navy, 0, .75, .38); ch.add(b); r.add(at(ch, .6, .03, -m + 1.75, .25));
  r.add(box(.06, 1.2, 1.6, C.white, -m + .03, 2.05, .5), box(.07, 1.02, 1.42, C.sky, -m + .035, 2.05, .5), box(.09, 1.1, .05, C.white, -m + .04, 2.05, .5));
  r.add(at(plant(.95), -m + .7, .03, -m + .75));
  const p = person({ skin: C.skin, hair: 0x2B1D16, shirt: C.emeraldD, pants: C.navy, long: true, glow: C.sky });
  p.scale.setScalar(1.12); at(p, -.2, .06, 1.05, -.42); g.add(p); g.userData = { person: p };
  return g;
}

/* ---------- celulares flotantes ---------- */
function haloTexture() {
  const c = document.createElement('canvas'); c.width = 128; c.height = 224; const x = c.getContext('2d');
  x.shadowColor = '#fff'; x.shadowBlur = 26; x.fillStyle = '#fff';
  x.beginPath(); x.roundRect(36, 38, 56, 148, 14); x.fill();
  return new THREE.CanvasTexture(c);
}
/** Marco 9:18. `crop` = porción útil de la textura; fuera de ella se extiende el borde. */
function phone(w, { halo = false } = {}) {
  const h = w * 2, b = w * .055, g = group(), tilt = group(); g.add(tilt);
  const body = new THREE.ExtrudeGeometry(roundedShape(w + 2 * b, h + 2 * b, w * .15), { depth: .1, bevelSize: .03, bevelThickness: .03, bevelSegments: 3, curveSegments: 12 });
  body.translate(0, 0, -.13);
  const frame = mesh(body, mat(C.navy, { roughness: .35, metalness: .25 })); frame.castShadow = false; tilt.add(frame);
  const geo = new THREE.ShapeGeometry(roundedShape(w, h, w * .1), 10), p = geo.attributes.position, uv = geo.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / w + .5, p.getY(i) / h + .5);
  const screen = mesh(geo, flat(0xDCEBFA), 0, 0, .012); tilt.add(screen);
  const out = { group: g, tilt, screen, w, h };
  if (halo) {
    const pts = roundedShape(w + 2 * b + .16, h + 2 * b + .16, w * .18).getSpacedPoints(120).map(q => V(q.x, q.y, 0));
    out.ring = mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 160, .055, 8, true), flat(C.emerald), 0, 0, -.04);
    out.aura = mesh(new THREE.PlaneGeometry(w * 2.15, h * 1.5), flat(C.emerald, { map: haloTexture(), transparent: true, opacity: .6, depthWrite: false }), 0, 0, -.22);
    tilt.add(out.ring, out.aura);
  }
  return out;
}
/** Encaja la textura (ancho útil completo) en la pantalla 1:2. x0..x1 / y0..y1 en fracciones desde abajo; align: 0 abajo, 1 arriba. */
function fit(tex, aspect, { x0 = 0, x1 = 1, y0 = 0, y1 = 1, align = .5, stretch = false }) {
  const imgH = (y1 - y0) / ((x1 - x0) * aspect);      // alto útil con ancho 1
  const span = stretch ? (y1 - y0) : (y1 - y0) * 2 / imgH;
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.repeat.set(x1 - x0, span); tex.offset.set(x0, y0 - (span - (y1 - y0)) * (1 - align));
}

function shield() {
  const s = new THREE.Shape();
  s.moveTo(0, 1); s.quadraticCurveTo(.45, .78, .85, .76); s.quadraticCurveTo(.92, -.35, 0, -1.05);
  s.quadraticCurveTo(-.92, -.35, -.85, .76); s.quadraticCurveTo(-.45, .78, 0, 1);
  const ex = d => new THREE.ExtrudeGeometry(s, { depth: d, bevelSize: .04, bevelThickness: .04, bevelSegments: 2, curveSegments: 14 });
  const g = group(), face = mat(C.emerald, { emissive: C.emerald, emissiveIntensity: .18 });
  const n = mesh(ex(.14), C.navy, 0, 0, -.38), bl = mesh(ex(.12), C.blue, 0, 0, -.19); n.scale.setScalar(1.14); bl.scale.setScalar(1.07);
  g.add(n, bl, mesh(ex(.14), face));
  [.22, .42, .7, .95, .6, .34].forEach((h, i) => g.add(mesh(new THREE.CapsuleGeometry(.055, h * .75, 4, 10), flat(C.white), -.4 + i * .16, .05, .21)));
  const ring = mesh(new THREE.TorusGeometry(1.55, .025, 8, 80), flat(C.blue, { transparent: true, opacity: .55 })); ring.rotation.x = 1.25; g.add(ring);
  g.traverse(o => { o.castShadow = false; });
  g.userData = { ring }; return g;
}
function bell() {
  const red = mat(C.red, { emissive: C.red, emissiveIntensity: .35 }), g = group(ball(.4, red, 0, 0, 0)); g.children[0].scale.z = .35;
  const w = flat(C.white), d = mesh(new THREE.SphereGeometry(.16, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), w, 0, 0, .16); d.scale.z = .3;
  const sk = mesh(new THREE.CylinderGeometry(.16, .21, .14, 20), w, 0, -.06, .16); sk.scale.z = .3;
  g.add(d, sk, ball(.05, w, 0, -.17, .17)); g.traverse(o => { o.castShadow = false; });
  return g;
}
function arc(curve, n, radius = .045) {
  const tube = mesh(new THREE.TubeGeometry(curve, 90, radius, 8), flat(C.emerald, { transparent: true, opacity: .55, depthWrite: false }));
  const dots = new THREE.InstancedMesh(new THREE.SphereGeometry(.1, 12, 10), flat(C.emerald), n); dots.frustumCulled = false;
  return { curve, tube, dots, n, m: new THREE.Matrix4() };
}

/* ---------- escena ---------- */
class Demo {
  constructor(root) {
    this.root = root; this.step = -1; this.follow = false; this.playing = false; this.risk = 0; this.notified = 0; this.visible = false;
    this.buildDom(); this.buildScene(); this.buildMedia(); this.bind(); this.resize(); this.view(0, true); this.setStep(0, false);
  }
  buildDom() {
    this.root.innerHTML = `
      <div class="d3-stage"><canvas tabindex="0" aria-label="Escena 3D: un atacante llama a un adulto mayor, GuardianMesh detecta el riesgo y avisa a la persona de confianza"></canvas>
        <div class="d3-labels" aria-hidden="true"></div>
        <div class="d3-tools"><button type="button" data-a="play"></button><button type="button" data-a="audio"></button><button type="button" data-a="view" title="Vista General" aria-label="Vista General">⤢ <span>Vista General</span></button></div>
        <p class="d3-hint">Arrastra para girar</p></div>
      <div class="d3-panel"><p class="d3-caption" aria-live="polite"></p>
        <div class="d3-steps">${STEPS.map((s, i) => `<button type="button" data-step="${i}" class="${s.level}"><b>0${i + 1}</b><span>${s.title}<small>${s.state}</small></span></button>`).join('')}</div></div>`;
    const q = s => this.root.querySelector(s);
    this.stage = q('.d3-stage'); this.canvas = q('canvas'); this.labels = q('.d3-labels'); this.caption = q('.d3-caption');
    this.btn = { play: q('[data-a=play]'), audio: q('[data-a=audio]'), view: q('[data-a=view]') };
    this.stepBtns = [...this.root.querySelectorAll('[data-step]')];
  }
  label(html, cls, obj, dy) {
    const e = document.createElement('div'); e.className = 'd3-label ' + cls; e.innerHTML = html; this.labels.append(e);
    (this.tags ||= []).push({ e, obj, dy });
  }
  buildScene() {
    const small = matchMedia('(max-width:720px)').matches;
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.75 : 2));
    this.renderer.shadowMap.enabled = true; this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.shadowMap.autoUpdate = false; this.renderer.shadowMap.needsUpdate = true; // los dioramas no se mueven
    const sc = this.scene = new THREE.Scene(); this.camera = new THREE.PerspectiveCamera(30, 1, .5, 200);
    sc.add(new THREE.AmbientLight(0xFFFFFF, .85), new THREE.HemisphereLight(0xFFFFFF, 0xDCE5F2, .75));
    const sun = new THREE.DirectionalLight(0xFFFFFF, 2.1); sun.position.set(7, 17, 12); sun.castShadow = true;
    sun.shadow.mapSize.setScalar(small ? 1024 : 2048); Object.assign(sun.shadow.camera, { left: -17, right: 17, top: 12, bottom: -12, near: 1, far: 50 });
    sun.shadow.bias = -.0006; sun.shadow.normalBias = .03; sun.shadow.radius = 5; sc.add(sun);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(90, 60), new THREE.ShadowMaterial({ color: C.navy, opacity: .13 }));
    ground.rotation.x = -Math.PI / 2; ground.position.y = -.35; ground.receiveShadow = true; sc.add(ground);

    this.cell = at(cellDiorama(), -8.7, 0, -1); this.home = at(homeDiorama(), 0, 0, 1.2); this.study = at(studyDiorama(), 8.7, 0, -1);
    sc.add(this.cell, this.home, this.study);

    this.p1 = phone(2.25); this.p2 = phone(2.95, { halo: true }); this.p3 = phone(2.25);
    const place = (p, x, y, z, ry) => { p.group.position.set(x, y, z); p.group.rotation.y = ry; p.y = y; sc.add(p.group); };
    place(this.p1, -8.7, 6.5, -1.6, .16); place(this.p2, 0, 7.5, 0, 0); place(this.p3, 8.7, 6.5, -1.6, -.16);
    this.badge = bell(); this.badge.position.set(1.14, 2.05, .2); this.p3.tilt.add(this.badge);
    this.ai = shield(); this.ai.position.set(0, 12.6, -.6); this.ai.scale.setScalar(.95); sc.add(this.ai);

    const B = (...p) => new THREE.CubicBezierCurve3(...p);
    this.arcs = [
      arc(B(V(-8.5, 8.95, -1.5), V(-7.6, 12.2, -1.4), V(-4.2, 13.4, -1), V(-1.05, 12.75, -.6)), 9),
      arc(B(V(-.75, 11.9, -.5), V(-2.6, 11.4, 0), V(-3.4, 9.6, .3), V(-1.85, 8.3, .1)), 5),
      arc(B(V(1.05, 12.75, -.6), V(4.2, 13.4, -1), V(7.6, 12.2, -1.4), V(8.5, 8.95, -1.5)), 9, .055)
    ];
    this.arcs.forEach(a => sc.add(a.tube, a.dots));

    this.label('01 · ATACANTE <i>(LLAMADA ENTRANTE)</i>', '', this.p1.group, 2.62);
    this.label('02 · ADULTO MAYOR <i>(APP GUARDIANMESH)</i>', 'main', this.p2.group, 3.35);
    this.label('03 · PERSONA DE CONFIANZA <i>(PANEL AVISOS)</i>', '', this.p3.group, 2.62);
    this.label('GuardianMesh AI', 'ai', this.ai, 1.15);

    const ct = this.controls = new OrbitControls(this.camera, this.canvas);
    Object.assign(ct, { enableDamping: !reduced, dampingFactor: .08, enableZoom: false, enablePan: false, rotateSpeed: .55,
      maxPolarAngle: Math.PI / 2.1, minPolarAngle: .75, minAzimuthAngle: -.95, maxAzimuthAngle: .95 });
    this.canvas.style.touchAction = 'pan-y'; // el gesto vertical sigue desplazando la página
    ct.addEventListener('start', () => { this.follow = false; this.goal = null; this.stage.classList.add('touched'); });
  }
  buildMedia() {
    const video = name => {
      const v = document.createElement('video');
      Object.assign(v, { muted: true, loop: true, playsInline: true, preload: 'auto', crossOrigin: 'anonymous', src: ASSETS + name });
      v.setAttribute('playsinline', ''); v.setAttribute('muted', '');
      return v;
    };
    const show = (p, tex, aspect, o) => { tex.colorSpace = THREE.SRGBColorSpace; tex.generateMipmaps = true; tex.minFilter = THREE.LinearMipmapLinearFilter; tex.anisotropy = 8; fit(tex, aspect, o); p.screen.material.map = tex; p.screen.material.color.set(0xFFFFFF); p.screen.material.needsUpdate = true; };
    this.va = video('video-atacante.mp4'); this.vv = video('video-victima.mp4');
    // recortes: márgenes laterales del atacante y franjas negras del video de la víctima
    this.va.addEventListener('loadeddata', () => show(this.p1, new THREE.VideoTexture(this.va), this.va.videoWidth / this.va.videoHeight, { x0: .045, x1: .96, align: .5 }), { once: true });
    this.vv.addEventListener('loadeddata', () => show(this.p2, new THREE.VideoTexture(this.vv), this.vv.videoWidth / this.vv.videoHeight, { x0: .005, x1: .995, y0: .058, y1: .943, stretch: true }), { once: true });
    new THREE.TextureLoader().load(ASSETS + 'avisos-confianza.jpeg', t => {
      show(this.p3, t, t.image.width / t.image.height, { x0: .016, x1: .99, y0: .014, y1: 1, align: 1 });
    });
    this.vv.addEventListener('error', () => { this.noVideo = true; });
  }
  bind() {
    this.btn.play.onclick = () => this.setPlaying(!this.playing);
    this.btn.audio.onclick = () => {
      this.vv.muted = !this.vv.muted; // solo suena un video: el del atacante siempre va en silencio
      if (!this.vv.muted) this.setPlaying(true);
      this.paintButtons();
    };
    this.btn.view.onclick = () => { this.follow = false; this.view(0); };
    this.stepBtns.forEach((b, i) => { b.onclick = () => this.goStep(i); });
    new ResizeObserver(() => this.resize()).observe(this.stage);
    let auto = !reduced;
    new IntersectionObserver(list => {
      const e = list[list.length - 1]; // pueden llegar varias entradas juntas: manda la última
      this.visible = e.isIntersecting;
      if (this.visible) { if (auto && e.intersectionRatio > .3) { auto = false; this.setPlaying(true); } else if (this.playing) this.resume(); this.loop(); }
      else { this.va.pause(); this.vv.pause(); }
    }, { threshold: [0, .35] }).observe(this.stage);
    document.addEventListener('visibilitychange', () => { if (document.hidden) { this.va.pause(); this.vv.pause(); } else if (this.visible && this.playing) this.resume(); });
    this.paintButtons();
  }
  /* --- reproducción --- */
  resume() {
    this.vv.play().catch(() => {
      if (!this.vv.muted) { this.vv.muted = true; this.vv.play().catch(() => this.stopped()); this.paintButtons(); } else this.stopped();
    });
    this.va.play().catch(() => {});
  }
  stopped() { this.playing = false; this.paintButtons(); }
  setPlaying(on) { this.playing = on; if (on && this.visible) this.resume(); else { this.va.pause(); this.vv.pause(); } this.paintButtons(); }
  paintButtons() {
    const set = (b, ic, t) => { b.innerHTML = `${ic} <span>${t}</span>`; b.setAttribute('aria-label', t); b.title = t; };
    set(this.btn.play, this.playing ? '❚❚' : '▶', this.playing ? 'Pausa' : 'Play');
    set(this.btn.audio, this.vv.muted ? '🔇' : '🔊', this.vv.muted ? 'Activar audio' : 'Silenciar audio');
  }
  goStep(i) {
    const s = STEPS[i], seek = (v, t) => { const f = () => { v.currentTime = t; }; if (v.readyState) f(); else v.addEventListener('loadedmetadata', f, { once: true }); };
    seek(this.va, s.attacker); seek(this.vv, s.victim);
    this.pin = i; this.pinUntil = performance.now() + 900; // mientras el salto termina manda el paso elegido
    this.follow = true; this.setStep(i, true); this.setPlaying(true); this.loop();
  }
  setStep(i, move) {
    if (i === this.step) { if (move) this.view(i + 1); return; }
    this.step = i; const s = STEPS[i];
    this.caption.innerHTML = `<b class="${s.level}">0${i + 1} · ${s.title} (${s.state})</b>${s.text}`;
    this.stepBtns.forEach((b, k) => { b.classList.toggle('on', k === i); b.setAttribute('aria-pressed', String(k === i)); });
    this.root.dataset.level = s.level;
    if (i === 3) this.flash = 1;
    if (move) this.view(i + 1);
  }
  sync() {
    const t = this.vv.currentTime, now = performance.now();
    if (this.pin != null && now < this.pinUntil) return;
    this.pin = null;
    if (this.noVideo || this.vv.readyState < 2) return;
    this.setStep(t >= NOTIFY_AT ? 3 : t >= RISK_AT ? 2 : t >= STEPS[1].victim - .05 ? 1 : 0, this.follow && this.stepOf(t) !== this.step);
    if (!this.playing || this.va.readyState < 2 || this.va.seeking || this.vv.seeking) return;
    // el paso 01 arranca con el atacante en 0 s y la víctima en 2 s: la víctima lo espera para quedar en el mismo reloj
    const d = t - this.va.currentTime;
    if (d > .12 && d < 2.3 && t < 3) { if (!this.vv.paused) this.vv.pause(); }
    else {
      if (this.vv.paused && this.visible) this.vv.play().catch(() => {});
      if (Math.abs(d) > .4) this.va.currentTime = Math.min(t, (this.va.duration || t) - .1);
    }
  }
  stepOf(t) { return t >= NOTIFY_AT ? 3 : t >= RISK_AT ? 2 : t >= STEPS[1].victim - .05 ? 1 : 0; }
  /* --- cámara --- */
  view(n, instant = false) {
    const F = [
      [V(0, 6.3, 0), 27.5, 16.4, V(0, .3, 1)],
      [V(this.camera.aspect > 1.2 ? -2.9 : -4.2, 6.5, 0), 18.6, 16.8, V(-.16, .27, 1)],
      [V(0, 5.3, .6), 9.4, 12.6, V(.12, .26, 1)],
      [V(0, 7.5, 0), 4.9, 8.3, V(.06, .12, 1)],
      [V(4.6, 6.4, 0), 18, 15.6, V(.2, .24, 1)]
    ][n], tan = Math.tan(this.camera.fov * Math.PI / 360);
    this.viewN = n;
    const dist = Math.max(F[2] / 2 / tan, F[1] / 2 / (tan * this.camera.aspect)) + 1.5;
    this.goal = { target: F[0].clone(), pos: F[0].clone().add(F[3].clone().normalize().multiplyScalar(dist)) };
    if (instant || reduced) { this.camera.position.copy(this.goal.pos); this.controls.target.copy(this.goal.target); this.goal = null; this.controls.update(); }
  }
  resize() {
    const w = this.stage.clientWidth, h = this.stage.clientHeight; if (!w || !h) return;
    this.renderer.setSize(w, h, false); this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
    if (this.viewN != null) this.view(this.viewN, true);
  }
  loop() {
    if (this.running) return; this.running = true; this.last = performance.now();
    const tick = now => {
      if (!this.visible) { this.running = false; return; }
      const dt = Math.min((now - this.last) / 1000, .05); this.last = now;
      this.update(now / 1000, dt); requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  update(t, dt) {
    this.sync();
    if (this.goal) {
      const k = damp(dt, 2.8); this.camera.position.lerp(this.goal.pos, k); this.controls.target.lerp(this.goal.target, k);
      if (this.camera.position.distanceTo(this.goal.pos) < .02) this.goal = null;
    }
    this.controls.update();
    const red = this.step >= 2, sent = this.step === 3;
    this.risk += ((red ? 1 : 0) - this.risk) * damp(dt, 5); this.notified += ((sent ? 1 : 0) - this.notified) * damp(dt, 4);
    this.flash = Math.max(0, (this.flash || 0) - dt * .35);
    const beat = reduced ? .5 : .5 + .5 * Math.sin(t * (red ? 6.5 : 2.2)), bob = reduced ? 0 : 1;
    const lv = (this.cA ||= new THREE.Color()).set(C.emerald).lerp(this.cB ||= new THREE.Color(C.red), this.risk);

    // celulares
    [this.p1, this.p2, this.p3].forEach((p, i) => { p.group.position.y = p.y + bob * Math.sin(t * 1.1 + i * 1.7) * .07; });
    this.p2.ring.material.color.copy(lv); this.p2.aura.material.color.copy(lv); this.p2.aura.material.opacity = .42 + beat * (.22 + .28 * this.risk);
    this.home.userData.alert.color.copy(lv); this.home.userData.alert.intensity = 4 + this.risk * (5 + beat * 6);
    this.home.userData.person.userData.screen.material.color.copy(lv);
    this.p3.screen.material.color.setScalar(this.p3.screen.material.map ? .5 + .5 * this.notified : .9); // se enciende al llegar el aviso
    this.study.userData.person.userData.screen.material.color.set(C.sky).lerp(this.cB, this.notified);
    this.badge.scale.setScalar(Math.max(.001, this.notified * (1 + beat * .2)));
    this.badge.rotation.z = bob * this.notified * Math.sin(t * 14) * .14;
    this.p3.tilt.rotation.z = bob * this.flash * Math.sin(t * 34) * .03;

    // nodo y ondas de voz
    this.ai.rotation.y = bob * Math.sin(t * .8) * .35; this.ai.position.y = 12.6 + bob * Math.sin(t * 1.3) * .08;
    this.ai.userData.ring.rotation.z = t * .6 * bob; this.ai.userData.ring.material.color.copy(lv);
    this.cell.userData.waves.children.forEach((w, i) => {
      const k = reduced ? (i + 1) / 4 : (t * .55 + i / 3) % 1; w.scale.setScalar(.5 + k * 3.2); w.material.opacity = (1 - k) * .85; w.quaternion.copy(this.camera.quaternion);
    });

    // arcos
    this.arcs.forEach((a, i) => {
      const on = i === 2 ? this.notified : 1, c = i === 2 ? (this.cC ||= new THREE.Color()).set(0x94A3B8).lerp(this.cB, this.notified) : lv;
      a.tube.material.color.copy(c); a.dots.material.color.copy(c);
      a.tube.material.opacity = i === 2 ? .28 + on * (.42 + beat * .3) : .5 + this.risk * beat * .45;
      const sp = i === 2 ? .42 : .2 + this.risk * .18;
      for (let k = 0; k < a.n; k++) {
        const u = reduced ? (k + .5) / a.n : (t * sp * (i === 1 ? 1.6 : 1) + k / a.n) % 1, q = a.curve.getPoint(u);
        const s = on * (.65 + .55 * Math.sin(u * Math.PI)) * (1 + this.risk * .35 + (i === 2 ? this.flash * 1.4 : 0));
        a.m.makeScale(s, s, s).setPosition(q); a.dots.setMatrixAt(k, a.m);
      }
      a.dots.instanceMatrix.needsUpdate = true;
    });
    this.renderer.render(this.scene, this.camera);

    const w = this.stage.clientWidth, h = this.stage.clientHeight, v = this.vTmp ||= V();
    this.tags.forEach(({ e, obj, dy }) => {
      v.copy(obj.position); v.y += dy; v.project(this.camera);
      const x = (v.x * .5 + .5) * w, y = (-v.y * .5 + .5) * h, out = v.z > 1 || x < -40 || x > w + 40 || y < -10 || y > h + 10;
      e.style.opacity = out ? 0 : 1;
      if (out) return;
      const half = e.offsetWidth / 2 + 4, cx = w > 2 * half && x > -10 && x < w + 10 ? Math.min(Math.max(x, half), w - half) : x;
      if (Math.abs(cx - x) > 40) e.style.opacity = 0; // celular casi fuera de cuadro
      e.style.transform = `translate(${cx.toFixed(1)}px,${y.toFixed(1)}px) translate(-50%,-100%)`;
    });
  }
}

/* ---------- arranque diferido: los ~4 MB de video solo se piden al acercarse ---------- */
const root = document.getElementById('demo3d');
if (root) {
  const start = () => {
    try { root.demo = new Demo(root); } catch (err) {
      console.warn('Simulación 3D no disponible:', err);
      root.innerHTML = `<div class="d3-fallback"><p>Tu navegador no pudo iniciar WebGL. Este es el material de la simulación:</p>
        <video src="${ASSETS}video-atacante.mp4" controls muted playsinline preload="metadata"></video><video src="${ASSETS}video-victima.mp4" controls playsinline preload="metadata"></video>
        <img src="${ASSETS}avisos-confianza.jpeg" alt="Panel de avisos de la persona de confianza"></div>`;
    }
  };
  new IntersectionObserver((e, o) => { if (e.some(x => x.isIntersecting)) { o.disconnect(); start(); } }, { rootMargin: '500px' }).observe(root);
}
