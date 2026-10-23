(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var cichy = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- menu ---------- */
  var ham = $('.ham'), panel = $('#panel');
  ham.addEventListener('click', function () {
    var o = ham.getAttribute('aria-expanded') === 'true';
    ham.setAttribute('aria-expanded', String(!o));
    ham.setAttribute('aria-label', o ? 'Otwórz menu' : 'Zamknij menu');
    panel.hidden = o;
  });
  $$('#panel a').forEach(function (a) { a.addEventListener('click', function () { ham.setAttribute('aria-expanded', 'false'); panel.hidden = true; }); });

  /* ---------- pasek mobilny po przewinieciu ---------- */
  var mob = $('#mob'), heroCta = $('.hero-cta');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) {
      var r = e[0].boundingClientRect;
      mob.classList.toggle('widac', !e[0].isIntersecting && r.top < 0);
    }).observe(heroCta);
    new IntersectionObserver(function (e) { mob.classList.toggle('wkonf', e[0].isIntersecting); }, { rootMargin: '-30% 0px -30% 0px' }).observe($('#projekt'));
  }

  /* ---------- toast ---------- */
  var toastT;
  function toast(t) { var el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { el.classList.remove('on'); }, 2400); }

  /* ---------- produkty (prawdziwe z synbombkarza.pl, 23.10.2026) ---------- */
  var P = [
    ['Bombka okrągła z ornamentem: Czerwony Wir', '6 sztuk, średnica 10 cm', 219, 'p-czerwony-wir', 'bombka-okragla-z-ornamentem-czerwony-wir'],
    ['Bombka okrągła czerwona: Zimowy Kościółek', '6 sztuk, średnica 10 cm', 239, 'p-zimowy-kosciolek', 'bombka-okragla-czerwona-zimowy-kosciolek'],
    ['Bombka okrągła: Świąteczny Arlekin', '2 sztuki, średnica 10 cm', 199, 'p-swiateczny-arlekin', 'bombka-okragla-swiateczny-arlekin'],
    ['Serce Królewskie: szampańskie złoto', 'Wysokość 11 cm', 89, 'p-serce-krolewskie', 'serce-krolewskie-szampanskie-zloto'],
    ['Bombka Sopel: Czerwony kryształ', '3 sztuki, długość 14 cm', 169, 'p-sopel-czerwony-krysztal', 'bombka-sopel-czerwony-krysztal'],
    ['Bombka reflektor cytrynka: czerwony', '4 sztuki, wysokość 12 cm', 169, 'p-reflektor-cytrynka', 'bombka-reflektor-cytrynka-czerwony'],
    ['Bombka Lampion Szopka Bożonarodzeniowa: złota', 'Szerokość 14 cm', 199, 'p-lampion-szopka', 'bombka-lampion-szopka-bozonarodzeniowa-zlota'],
    ['Fiat 126p Maluch: czerwony', 'Szerokość 11 cm', 69, 'p-fiat-126p', 'fiat-126p-maluch-czerwony-2']
  ];
  $('#produkty').innerHTML = P.map(function (p) {
    return '<a class="prod" href="https://synbombkarza.pl/produkt/' + p[4] + '/"><div class="prod-foto"><img src="img/' + p[3] + '.webp" alt="' + p[0] + '" loading="lazy" decoding="async"></div><h3>' + p[0] + '</h3><p class="prod-det">' + p[1] + '</p><p class="prod-cena">' + p[2] + ' zł</p></a>';
  }).join('');

  /* ---------- tasma realizacji ---------- */
  var tasma = $('#tasma');
  $$('.strz').forEach(function (b) {
    b.addEventListener('click', function () {
      var f = tasma.querySelector('figure');
      tasma.scrollBy({ left: (+b.dataset.d) * (f.offsetWidth + 16) * 2, behavior: cichy ? 'auto' : 'smooth' });
    });
  });

  /* ---------- obrot 360 (prawdziwe klatki bombki Hera) ---------- */
  var scena = $('#obrotScena'), oImg = $('#obrotImg'), N = 18, kl = 0, klatki = [], zaladowane = false, auto = null;
  function pokaz(i) { kl = ((i % N) + N) % N; oImg.src = 'img/360/' + String(kl).padStart(2, '0') + '.webp'; scena.setAttribute('aria-valuenow', kl); }
  function laduj() {
    if (zaladowane) return; zaladowane = true;
    for (var i = 0; i < N; i++) { var im = new Image(); im.src = 'img/360/' + String(i).padStart(2, '0') + '.webp'; klatki.push(im); }
  }
  function stopAuto() { if (auto) { clearInterval(auto); auto = null; } }
  if ('IntersectionObserver' in window) {
    var raz = false;
    new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) {
        laduj();
        if (!raz && !cichy && e[0].intersectionRatio > .5) {
          raz = true; var k = 0;
          setTimeout(function () { auto = setInterval(function () { pokaz(kl + 1); if (++k >= N) stopAuto(); }, 110); }, 500);
        }
      }
    }, { rootMargin: '500px 0px', threshold: [0, .5, .9] }).observe(scena);
  } else laduj();
  var drag = null;
  scena.addEventListener('pointerdown', function (e) { stopAuto(); laduj(); drag = { x: e.clientX, k: kl }; scena.setPointerCapture(e.pointerId); });
  scena.addEventListener('pointermove', function (e) { if (!drag) return; pokaz(drag.k - Math.round((e.clientX - drag.x) / 14)); });
  ['pointerup', 'pointercancel'].forEach(function (t) { scena.addEventListener(t, function () { drag = null; }); });
  scena.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { stopAuto(); pokaz(kl + 1); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { stopAuto(); pokaz(kl - 1); e.preventDefault(); }
  });

  /* ================= KONFIGURATOR ================= */
  var KOLORY = [
    ['czerwony', 'czerwony', '#A3161B'], ['bordo', 'bordowy', '#5C0F1B'], ['zielen', 'butelkowa zieleń', '#1C4A37'],
    ['granat', 'granatowy', '#172B5E'], ['blekit', 'błękitny', '#8FB6DB'], ['roz', 'pudrowy róż', '#E2A3B2'],
    ['zloty', 'złoty', '#C3922F'], ['srebrny', 'srebrny', '#B5B8BD'], ['bialy', 'perłowa biel', '#EEE8DE'], ['czarny', 'czarny', '#151416']
  ];
  var KOL_NAP = [['zloto', 'złoty', 'url(#gZloto)', '#D2A54B'], ['biel', 'biały', '#FFFFFF', '#FFFFFF'], ['czerwien', 'czerwony', '#A3161B', '#A3161B'], ['granat', 'granatowy', '#172B5E', '#172B5E'], ['czern', 'czarny', '#1A1414', '#1A1414']];
  var AUTO_NAP = { czerwony: 'zloto', bordo: 'zloto', zielen: 'zloto', granat: 'biel', blekit: 'biel', roz: 'biel', zloty: 'czerwien', srebrny: 'granat', bialy: 'czerwien', czarny: 'zloto' };
  var SREBRNY_KAP = { srebrny: 1, blekit: 1, granat: 1, bialy: 1, czarny: 1 };
  var ROZ_R = { 8: 112, 10: 126, 12: 138, 15: 150, 20: 162 };
  var NAZWY = {
    ksztalt: { kula: 'Kula', serce: 'Serce', sopel: 'Sopel' },
    wyk: { polysk: 'połysk', mat: 'mat', brokat: 'brokat' },
    zdob: { brak: 'bez zdobień', obwodka: 'złota obwódka', sniezynki: 'śnieżynki', kropki: 'kropki' },
    font: { kalig: 'kaligrafia', pedzel: 'pędzel', klas: 'klasyczny', prosty: 'prosty, wersaliki' }
  };
  var FONTY = {
    kalig: { f: '"Great Vibes", cursive', w: 400, s: 1.18, up: false, ls: 0 },
    pedzel: { f: '"Kaushan Script", cursive', w: 400, s: .9, up: false, ls: 0 },
    klas: { f: '"Cormorant Garamond", serif', w: 600, s: 1, up: false, ls: 0, it: true },
    prosty: { f: 'Figtree, sans-serif', w: 600, s: .62, up: true, ls: .14 }
  };
  var S = { ksztalt: 'kula', rozmiar: '10', kolor: 'czerwony', wyk: 'polysk', zdob: 'obwodka', font: 'kalig', kolNap: 'zloto', dla: 'prywatnie' };
  var napRecznie = false;

  function hex2rgb(h) { h = h.replace('#', ''); return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)]; }
  function mix(h, h2, t) { var a = hex2rgb(h), b = hex2rgb(h2); return 'rgb(' + a.map(function (v, i) { return Math.round(v + (b[i] - v) * t); }).join(',') + ')'; }
  function el(n, at, par) { var e = document.createElementNS(NS, n); for (var k in at) e.setAttribute(k, at[k]); if (par) par.appendChild(e); return e; }
  function kol(id) { return KOLORY.filter(function (k) { return k[0] === id; })[0]; }
  function jasny(id) { return ['blekit', 'roz', 'zloty', 'srebrny', 'bialy'].indexOf(id) > -1; }

  // swatche
  $('#kolory').innerHTML = KOLORY.map(function (k) { return '<button type="button" data-v="' + k[0] + '" aria-pressed="' + (k[0] === S.kolor) + '" aria-label="' + k[1] + '" title="' + k[1] + '" style="--c:' + k[2] + '"></button>'; }).join('');
  $('#kolNap').innerHTML = KOL_NAP.map(function (k) { return '<button type="button" data-v="' + k[0] + '" aria-pressed="' + (k[0] === S.kolNap) + '" aria-label="' + k[1] + '" title="' + k[1] + '" style="--c:' + (k[0] === 'zloto' ? 'linear-gradient(135deg,#F6E3A6,#C79A3E 55%,#8E6420)' : k[3]) + '"></button>'; }).join('');

  // geometria ksztaltow
  function geo() {
    var g = {};
    if (S.ksztalt === 'kula') {
      var r = ROZ_R[S.rozmiar], top = 92, cx = 200, cy = top + r;
      g.d = 'M' + (cx - r) + ',' + cy + 'a' + r + ',' + r + ' 0 1,0 ' + 2 * r + ',0a' + r + ',' + r + ' 0 1,0 ' + (-2 * r) + ',0Z';
      g.top = top; g.cx = cx; g.cy = cy; g.R = r; g.w = 2 * r; g.h = 2 * r; g.minY = top; g.maxY = top + 2 * r;
      g.l1 = { y: cy - .04 * r, w: 1.56 * r, k: .1 * r, fs: .46 * r };
      g.l2 = { y: cy + .34 * r, w: 1.3 * r, k: .12 * r, fs: .2 * r };
      g.b1 = { y: cy - .5 * r, w: 2.4 * r, k: .2 * r }; g.b2 = { y: cy + .62 * r, w: 2.4 * r, k: .22 * r };
      g.odb = { x: cx - .4 * r, y: cy - .44 * r, rx: .2 * r, ry: .12 * r };
    } else if (S.ksztalt === 'serce') {
      var sx = 142, sy = 204, x0 = 200, y0 = 52;
      var pts = 'M0,.13 C-.02,.02 -.25,-.06 -.5,0 C-.86,.07 -1.03,.42 -.95,.64 C-.84,.96 -.36,1.16 0,1.44 C.36,1.16 .84,.96 .95,.64 C1.03,.42 .86,.07 .5,0 C.25,-.06 .02,.02 0,.13Z';
      g.d = pts.replace(/(-?\.?\d*\.?\d+),(-?\.?\d*\.?\d+)/g, function (m, a, b) { return (x0 + a * sx).toFixed(1) + ',' + (y0 + b * sy).toFixed(1); });
      g.top = y0 + .13 * sy + 1; g.cx = 200; g.cy = 196; g.R = 150; g.w = 300; g.h = 290; g.minY = 42; g.maxY = y0 + 1.44 * sy;
      g.l1 = { y: 186, w: 230, k: 10, fs: 66 };
      g.l2 = { y: 238, w: 180, k: 10, fs: 27 };
      g.b1 = { y: 128, w: 320, k: 14 }; g.b2 = { y: 284, w: 240, k: 18 };
      g.odb = { x: 132, y: 96, rx: 34, ry: 18 };
    } else {
      g.d = 'M200,96 C252,96 264,132 260,170 C252,262 224,380 200,488 C176,380 148,262 140,170 C136,132 148,96 200,96Z';
      g.top = 98; g.cx = 200; g.cy = 230; g.R = 60; g.w = 120; g.h = 392; g.minY = 96; g.maxY = 488;
      g.pion = true;
      g.l1 = { x: 196, y1: 400, y2: 128, fs: 44 };
      g.l2 = { x: 228, y1: 360, y2: 150, fs: 17 };
      g.b1 = { y: 150, w: 200, k: 8 }; g.b2 = { y: 412, w: 120, k: 6 };
      g.odb = { x: 172, y: 150, rx: 12, ry: 30 };
    }
    return g;
  }
  function luk(o, cx) { return 'M' + (cx - o.w / 2) + ',' + o.y + ' Q' + cx + ',' + (o.y + 2 * o.k) + ' ' + (cx + o.w / 2) + ',' + o.y; }

  // brokat - wzor kropek (raz)
  var brokatGotowy = '';
  function brokat(baza) {
    if (brokatGotowy === baza) return; brokatGotowy = baza;
    var g = $('#brokatKropki'); g.innerHTML = '';
    var c = [mix(baza, '#ffffff', .75), '#ffffff', mix(baza, '#ffffff', .35), mix(baza, '#000000', .25), mix(baza, '#F2D48A', .5)];
    var seed = 7; function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    for (var i = 0; i < 260; i++) el('circle', { cx: (rnd() * 60).toFixed(1), cy: (rnd() * 60).toFixed(1), r: (.35 + rnd() * .75).toFixed(2), fill: c[Math.floor(rnd() * c.length)], opacity: (.3 + rnd() * .5).toFixed(2) }, g);
    for (var j = 0; j < 6; j++) el('circle', { cx: (rnd() * 60).toFixed(1), cy: (rnd() * 60).toFixed(1), r: (1 + rnd() * .6).toFixed(2), fill: '#fff', opacity: .85 }, g);
  }

  function sniezynka(par, x, y, s, kolor, op) {
    var g = el('g', { transform: 'translate(' + x + ' ' + y + ') scale(' + s + ')', stroke: kolor, 'stroke-width': 1.6 / Math.max(s, .4) * .5 + .9, 'stroke-linecap': 'round', fill: 'none', opacity: op }, par);
    for (var a = 0; a < 6; a++) {
      var r = el('g', { transform: 'rotate(' + a * 60 + ')' }, g);
      el('path', { d: 'M0,0 L0,-12 M0,-6 L-3.6,-9.6 M0,-6 L3.6,-9.6 M0,-9.5 L-2.2,-11.8 M0,-9.5 L2.2,-11.8' }, r);
    }
    el('circle', { r: 1.3, fill: kolor, stroke: 'none' }, g);
  }

  function rysuj() {
    var g = geo(), k = kol(S.kolor), baza = k[2], polysk = S.wyk === 'polysk', mat = S.wyk === 'mat', bro = S.wyk === 'brokat';
    var srebrnyKap = !!SREBRNY_KAP[S.kolor];
    var vy = g.top - 64, vh = (S.ksztalt === 'kula' ? g.top + 2 * ROZ_R[20] : g.maxY) + 40 - vy, vw = Math.max(390, vh * .8);
    $('#bombka').setAttribute('viewBox', (200 - vw / 2).toFixed(0) + ' ' + vy.toFixed(0) + ' ' + vw.toFixed(0) + ' ' + vh.toFixed(0));
    $('#body').setAttribute('d', g.d); $('#clipPath').setAttribute('d', g.d); $('#cien').setAttribute('d', g.d);
    // szklo
    var st = mat ? [mix(baza, '#ffffff', .32), mix(baza, '#ffffff', .1), baza, mix(baza, '#000000', .38)] :
      bro ? [mix(baza, '#ffffff', .4), mix(baza, '#ffffff', .12), baza, mix(baza, '#000000', .45)] :
        [mix(baza, '#ffffff', .72), mix(baza, '#ffffff', .16), baza, mix(baza, '#000000', .6)];
    if (S.kolor === 'czarny' && !mat) st[0] = '#9a9aa0';
    ['s0', 's1', 's2', 's3'].forEach(function (id, i) { $('#' + id).setAttribute('stop-color', st[i]); });
    $('#s1').setAttribute('offset', mat ? '.3' : '.2');
    // brokat
    if (bro) brokat(baza);
    $('#brokatWarstwa').setAttribute('opacity', bro ? '1' : '0');
    // zdobienia
    var z = $('#zdobienia'); z.innerHTML = '';
    var jas = jasny(S.kolor), zlocisty = 'url(#gZloto)';
    if (S.zdob === 'obwodka') {
      [g.b1, g.b2].forEach(function (b) {
        var d = luk(b, g.cx);
        el('path', { d: d, fill: 'none', stroke: zlocisty, 'stroke-width': 3.2 }, z);
        el('path', { d: d, fill: 'none', stroke: '#F7E7B5', 'stroke-width': 3.4, 'stroke-dasharray': '.1 9', 'stroke-linecap': 'round', opacity: .95, transform: 'translate(0 -7)' }, z);
        el('path', { d: d, fill: 'none', stroke: '#E9C877', 'stroke-width': 3.4, 'stroke-dasharray': '.1 9', 'stroke-linecap': 'round', opacity: .95, transform: 'translate(0 7)' }, z);
      });
    } else if (S.zdob === 'sniezynki') {
      var kS = jas ? (S.kolor === 'zloty' ? '#FFFFFF' : '#C79A3E') : '#FFFFFF';
      var poz = S.ksztalt === 'sopel' ? [[176, 134, .9], [226, 120, .7], [212, 444, .55], [160, 214, .55], [245, 300, .5], [184, 300, .45]] :
        S.ksztalt === 'serce' ? [[100, 112, 1.1], [300, 112, 1.1], [200, 300, 1], [150, 268, .7], [252, 270, .7], [62, 168, .7], [338, 168, .7], [200, 130, .6]] :
          [[-.62, -.6, 1.2], [.6, -.62, 1.1], [0, -.78, .8], [-.86, -.18, .7], [.86, -.15, .75], [-.52, .72, 1], [.5, .74, 1], [0, .88, .7], [-.28, -.66, .55], [.3, -.7, .55]].map(function (p) { return [g.cx + p[0] * g.R, g.cy + p[1] * g.R, p[2] * g.R / 120]; });
      poz.forEach(function (p) { sniezynka(z, p[0], p[1], p[2] * 1.6, kS, .92); });
    } else if (S.zdob === 'kropki') {
      var kK = jas ? (S.kolor === 'roz' || S.kolor === 'blekit' ? '#FFFFFF' : '#A3161B') : '#FFFFFF';
      var krok = Math.max(26, g.R * .3), rr = krok * .16;
      for (var y = g.minY + krok * .5; y < g.maxY; y += krok * .86) {
        var rz = Math.round((y - g.minY) / (krok * .86));
        for (var x = 40 + (rz % 2 ? krok / 2 : 0); x < 380; x += krok) {
          var nx = (x - g.cx) / (g.w / 2), ny = (y - g.cy) / (g.h / 2);
          if (S.ksztalt !== 'sopel' && y > g.l1.y - g.l1.fs * .75 && y < g.l2.y + g.l2.fs * .6) continue;
          if (g.pion && x > 172 && x < 240 && y > 118 && y < 410) continue;
          var sk = S.ksztalt === 'kula' ? Math.sqrt(Math.max(0, 1 - nx * nx)) : 1, skY = S.ksztalt === 'kula' ? Math.sqrt(Math.max(0, 1 - ny * ny)) : 1;
          if (sk * skY < .08) continue;
          el('ellipse', { cx: x.toFixed(1), cy: y.toFixed(1), rx: (rr * sk).toFixed(2), ry: (rr * skY).toFixed(2), fill: kK, opacity: (.4 + .55 * Math.min(sk, skY)).toFixed(2) }, z);
        }
      }
    }
    // napis
    var F = FONTY[S.font], kn = KOL_NAP.filter(function (q) { return q[0] === S.kolNap; })[0];
    var t1 = $('#t1'), t2 = $('#t2'), tp1 = $('#tp1'), tp2 = $('#tp2');
    var n1 = $('#n1').value.trim(), n2 = $('#n2').value.trim();
    if (F.up) { n1 = n1.toUpperCase(); n2 = n2.toUpperCase(); }
    tp1.textContent = n1; tp2.textContent = n2;
    var dl1, dl2;
    if (g.pion) {
      $('#luk1').setAttribute('d', 'M' + g.l1.x + ',' + g.l1.y1 + ' L' + g.l1.x + ',' + g.l1.y2); dl1 = g.l1.y1 - g.l1.y2;
      $('#luk2').setAttribute('d', 'M' + g.l2.x + ',' + g.l2.y1 + ' L' + g.l2.x + ',' + g.l2.y2); dl2 = g.l2.y1 - g.l2.y2;
    } else {
      $('#luk1').setAttribute('d', luk(g.l1, g.cx)); dl1 = g.l1.w * 1.02;
      $('#luk2').setAttribute('d', luk(g.l2, g.cx)); dl2 = g.l2.w * 1.02;
    }
    [[t1, g.l1, dl1, 1], [t2, g.l2, dl2, F.up ? 1.25 : (S.font === 'kalig' ? 1.55 : 1.05)]].forEach(function (a) {
      var t = a[0], fs = a[1].fs * F.s * a[3];
      t.setAttribute('font-family', F.f); t.setAttribute('font-weight', F.w);
      t.setAttribute('font-style', F.it ? 'italic' : 'normal');
      t.setAttribute('fill', kn[2]);
      t.setAttribute('letter-spacing', F.ls ? (F.ls + 'em') : '0');
      t.setAttribute('font-size', fs.toFixed(1));
      t.setAttribute('dominant-baseline', 'middle');
      var len = 0; try { len = t.getComputedTextLength(); } catch (e) { }
      var max = a[2] * .9;
      if (len > max && len > 0) t.setAttribute('font-size', (fs * max / len).toFixed(1));
      t.setAttribute('stroke', jas && kn[0] === 'biel' ? 'rgba(0,0,0,.12)' : 'none');
      t.setAttribute('stroke-width', '.6');
    });
    // odbicia
    var o = g.odb, odb = $('#odb1');
    odb.setAttribute('cx', o.x); odb.setAttribute('cy', o.y);
    odb.setAttribute('rx', mat ? o.rx * 2.3 : o.rx); odb.setAttribute('ry', mat ? o.ry * 2.6 : o.ry);
    odb.setAttribute('transform', 'rotate(' + (g.pion ? 8 : -34) + ' ' + o.x + ' ' + o.y + ')');
    odb.setAttribute('opacity', mat ? .34 : bro ? .55 : .92);
    odb.setAttribute('filter', mat ? 'url(#fRozmyjM)' : bro ? 'url(#fRozmyj)' : '');
    var okno = $('#okno'); okno.innerHTML = '';
    if (polysk && !g.pion) {
      var ox = g.cx + (S.ksztalt === 'serce' ? .2 : .26) * g.R, oy = g.cy - .5 * g.R, sc = g.R / 130;
      var og = el('g', { transform: 'translate(' + ox + ' ' + oy + ') scale(' + sc + ') skewY(14) rotate(10)' }, okno);
      [[0, 0], [17, 0], [0, 22], [17, 22]].forEach(function (p) { el('rect', { x: p[0], y: p[1], width: 14, height: 19, rx: 3, fill: '#fff' }, og); });
      okno.setAttribute('opacity', '.42'); okno.setAttribute('filter', 'url(#fRozmyj)');
      el('circle', { cx: o.x + o.rx * .9, cy: o.y + o.ry * 1.5, r: g.R * .025, fill: '#fff', opacity: .9 }, okno);
    }
    var rant = $('#rant'); rant.setAttribute('d', g.d); rant.setAttribute('opacity', mat ? .45 : .85);
    // kapturek
    var kap = $('#kapturek'); kap.innerHTML = '';
    var ty = g.top, kg = srebrnyKap ? 'gKapS' : 'gKap';
    if (srebrnyKap && !$('#gKapS')) {
      var lg = el('linearGradient', { id: 'gKapS', x1: 0, y1: 0, x2: 1, y2: 0 }, $('defs', $('#bombka')));
      [['0', '#6F7377'], ['.3', '#F4F5F6'], ['.55', '#B9BDC2'], ['1', '#5B5F63']].forEach(function (s) { el('stop', { offset: s[0], 'stop-color': s[1] }, lg); });
    }
    el('ellipse', { cx: 200, cy: ty - 33, rx: 6.5, ry: 8, fill: 'none', stroke: srebrnyKap ? '#9DA1A6' : '#B08A45', 'stroke-width': 2 }, kap);
    el('rect', { x: 187, y: ty - 27, width: 26, height: 7, rx: 2, fill: 'url(#' + kg + ')' }, kap);
    var zz = 'M182,' + (ty - 21) + ' L218,' + (ty - 21) + ' L218,' + (ty + 2);
    for (var i = 0; i < 6; i++) { var xx = 218 - i * 6; zz += ' L' + (xx - 3) + ',' + (ty + 7) + ' L' + (xx - 6) + ',' + (ty + 2); }
    zz += ' Z';
    el('path', { d: zz, fill: 'url(#' + kg + ')' }, kap);
    el('rect', { x: 182, y: ty - 21, width: 36, height: 3, fill: '#000', opacity: .15 }, kap);
    $('#nitka').setAttribute('y2', ty - 40);
    // podpis i nazwa koloru
    $('#kolorNazwa').textContent = k[1];
    $('#podgladPod').textContent = NAZWY.ksztalt[S.ksztalt] + (S.ksztalt === 'kula' ? ' ' + S.rozmiar + ' cm' : S.ksztalt === 'serce' ? ' ok. 11 cm' : ' ok. 14 cm') + ', ' + k[1] + ', ' + NAZWY.wyk[S.wyk];
    podsum();
  }

  /* ---------- podsumowanie + mail ---------- */
  function tresc() {
    var k = kol(S.kolor), kn = KOL_NAP.filter(function (q) { return q[0] === S.kolNap; })[0];
    var n1 = $('#n1').value.trim(), n2 = $('#n2').value.trim(), ile = Math.max(1, parseInt($('#ile').value, 10) || 1);
    var firma = S.dla === 'firma', motyw = $('#motyw').checked;
    var ks = NAZWY.ksztalt[S.ksztalt] + (S.ksztalt === 'kula' ? ', średnica ' + S.rozmiar + ' cm' : '');
    var nap = [n1, n2].filter(Boolean).map(function (s) { return '„' + s + '”'; }).join(' / ') || 'bez napisu';
    return {
      ile: ile, firma: firma, motyw: motyw,
      linie: [
        'Kształt: ' + ks,
        'Kolor szkła: ' + k[1] + ', wykończenie: ' + NAZWY.wyk[S.wyk],
        'Zdobienie: ' + NAZWY.zdob[S.zdob],
        'Napis: ' + nap + (n1 || n2 ? ' (krój: ' + NAZWY.font[S.font] + ', kolor: ' + kn[1] + ')' : ''),
        'Malowany motyw: ' + (motyw ? 'tak, opis poniżej' : 'nie'),
        'Liczba sztuk: ' + ile + (firma ? ' (zamówienie firmowe)' : '')
      ]
    };
  }
  function podsum() {
    var t = tresc();
    $('#podsumTekst').innerHTML = t.linie.map(function (l) { return l.replace(/^([^:]+):/, '<span class="pk">$1:</span>'); }).join('<br>');
    var c;
    if (t.firma) c = 'Bombki firmowe wyceniamy indywidualnie, cena zależy od projektu i nakładu. Bombka w indywidualnym kształcie wymaga formy (od 1 500 zł) i zamówienia min. 100 sztuk.';
    else if (t.motyw) c = 'Projekty z malowanym motywem: <strong>od 200 zł</strong> (najtańsze na małych bombkach). Dokładną cenę podamy po wycenie.';
    else c = 'Napis lub dedykacja na bombce: <strong>od 80 zł</strong>' + (t.ile > 1 ? ' za sztukę' : '') + '. Dokładną cenę podamy po wycenie, zależy od rozmiaru i zdobień.';
    $('#cena').innerHTML = c;
    $('#termin').textContent = t.firma ? 'Zamówienia firmowe najlepiej rezerwować 1-3 miesiące przed terminem. Na te Święta napisz do końca października.' : 'Realizacja trwa minimum 2-3 tygodnie. Zamówienia świąteczne przyjmujemy do końca października.';
    $('#firmaInfo').hidden = !t.firma;
    var temat = t.firma ? 'Zapytanie: bombki firmowe (' + t.ile + ' szt.)' : 'Zapytanie: bombka personalizowana';
    var body = 'Dzień dobry,\n\nproszę o wycenę bombki na zamówienie:\n\n- ' + t.linie.join('\n- ') +
      (t.motyw ? '\n\nOpis motywu (np. zdjęcie pupila w załączniku):\n' : '') +
      (t.firma ? '\n\nNazwa firmy i logo (w załączniku):\n' : '') +
      '\n\nNa kiedy potrzebuję bombek:\nImię i telefon:\n\nProjekt przygotowany w konfiguratorze na stronie synbombkarza.pl';
    $('#wyslij').href = 'mailto:kontakt@synbombkarza.pl?subject=' + encodeURIComponent(temat) + '&body=' + encodeURIComponent(body);
    $('#wyslij').dataset.body = body;
  }

  /* ---------- obsluga opcji ---------- */
  function kick() {
    if (cichy || !$('#kick').animate) return;
    $('#kick').animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(2.6deg)' }, { transform: 'rotate(-1.8deg)' }, { transform: 'rotate(.9deg)' }, { transform: 'rotate(0deg)' }], { duration: 1100, easing: 'ease-out' });
  }
  $$('#opcje [data-k]').forEach(function (grp) {
    grp.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-v]'); if (!b) return;
      var key = grp.dataset.k;
      S[key] = b.dataset.v;
      $$('button[data-v]', grp).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      if (key === 'kolNap') napRecznie = true;
      if (key === 'kolor' && !napRecznie) ustawNap(AUTO_NAP[S.kolor]);
      if (key === 'ksztalt') $('#rozmiary').hidden = S.ksztalt !== 'kula';
      if (key === 'dla') {
        var ile = $('#ile');
        if (S.dla === 'firma' && +ile.value < 10) ile.value = 25;
        if (S.dla === 'prywatnie' && +ile.value >= 25) ile.value = 1;
      }
      rysuj(); kick();
    });
  });
  function ustawNap(v) { S.kolNap = v; $$('#kolNap button').forEach(function (x) { x.setAttribute('aria-pressed', String(x.dataset.v === v)); }); }
  function ustaw(key, v) { S[key] = v; $$('[data-k="' + key + '"] button').forEach(function (x) { x.setAttribute('aria-pressed', String(x.dataset.v === v)); }); }
  ['n1', 'n2'].forEach(function (id) { $('#' + id).addEventListener('input', rysuj); });
  $('#ile').addEventListener('input', podsum);
  $('#motyw').addEventListener('change', podsum);
  $('#ileMinus').addEventListener('click', function () { var i = $('#ile'); i.value = Math.max(1, (parseInt(i.value, 10) || 1) - (+i.value > 10 ? 5 : 1)); podsum(); });
  $('#ilePlus').addEventListener('click', function () { var i = $('#ile'); i.value = (parseInt(i.value, 10) || 0) + (+i.value >= 10 ? 5 : 1); podsum(); });
  $$('.podpowiedzi button').forEach(function (b) {
    b.addEventListener('click', function () { if (b.dataset.n1) $('#n1').value = b.dataset.n1; if (b.dataset.n2) $('#n2').value = b.dataset.n2; rysuj(); kick(); });
  });
  $('#kopiuj').addEventListener('click', function () {
    var t = 'Do: kontakt@synbombkarza.pl\n\n' + $('#wyslij').dataset.body;
    if (navigator.clipboard) navigator.clipboard.writeText(t).then(function () { toast('Skopiowano treść zapytania'); }, function () { toast('Nie udało się skopiować'); });
  });
  $('#doFirmy').addEventListener('click', function () {
    ustaw('dla', 'firma'); ustaw('font', 'prosty'); ustaw('zdob', 'obwodka');
    $('#n1').value = 'Twoja Firma'; $('#n2').value = 'Wesołych Świąt';
    if (+$('#ile').value < 10) $('#ile').value = 50;
    rysuj();
  });

  // refleks podaza za kursorem
  var pod = $('#podglad'), ref = $('#refleks');
  if (!cichy) {
    pod.addEventListener('pointermove', function (e) {
      var r = pod.getBoundingClientRect(), dx = (e.clientX - r.left) / r.width - .5, dy = (e.clientY - r.top) / r.height - .5;
      ref.setAttribute('transform', 'translate(' + (-dx * 14).toFixed(1) + ' ' + (-dy * 10).toFixed(1) + ')');
    });
    pod.addEventListener('pointerleave', function () { ref.setAttribute('transform', ''); });
  }

  rysuj();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(rysuj);
  if (document.fonts) document.fonts.addEventListener && document.fonts.addEventListener('loadingdone', rysuj);
})();
