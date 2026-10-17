/* TableSizer sizing engine. All internal units are inches.
 Rules (see methodology): 30in/person standard, 36in comfortable, 42in generous (Paul Downs, OFW);
 rectangle/boat seat 1 per end; round & racetrack ends use perimeter / spacing;
 U & V seat the outside edge only; 42-48in clearance from table edge to wall (OFW, OfficeSimpli). */
(function (root) {
  var PI = Math.PI;
  var SHAPES = ['rectangle', 'boat', 'racetrack', 'round', 'u', 'v'];
  var LABEL = { rectangle: 'Rectangle', boat: 'Boat', racetrack: 'Racetrack', round: 'Round', u: 'U-shape', v: 'V-shape' };
  var ARM = 24; // depth of each U/V table run (training/presentation tables)

  function round6(x) { return Math.ceil(x / 6) * 6; }
  function widthFor(len) { if (len <= 72) return [36, 42]; if (len <= 120) return [42, 48]; if (len <= 192) return [48, 54]; if (len <= 264) return [54, 60]; return [60, 66]; }
  function seatsFor(len, s) { return 2 * Math.floor(len / s) + 2; }          // legacy rectangle
  function lengthFor(n, s) { return round6(Math.max(1, Math.ceil((n - 2) / 2)) * s); }

  // seats for a given table footprint
  function seatsOn(shape, L, W, s) {
    switch (shape) {
      case 'rectangle': case 'boat': return 2 * Math.floor(L / s) + 2;
      case 'racetrack': return 2 * Math.floor(Math.max(0, L - W) / s) + 2 * Math.floor((PI * W / 2) / s);
      case 'round': return Math.floor(PI * L / s);
      case 'u': return 2 * Math.floor(L / s) + Math.floor(W / s);           // L = leg length, W = head length
      case 'v': return 2 * Math.floor(L / s);                                  // L = leg length
    }
    return 0;
  }
  // smallest standard footprint seating n
  function tableFor(shape, n, s) {
    var L, W;
    if (shape === 'round') { L = round6(n * s / PI); return { L: Math.max(L, 36), W: Math.max(L, 36) }; }
    if (shape === 'u') { W = round6(Math.max(2, Math.round(n / 3)) * s); L = round6(Math.ceil((n - Math.floor(W / s)) / 2) * s);
      while (seatsOn('u', L, W, s) < n) L += 6; return { L: L, W: W }; }
    if (shape === 'v') { L = round6(Math.ceil(n / 2) * s); return { L: L, W: L }; }
    L = lengthFor(n, s); W = widthFor(L)[1];
    if (shape === 'racetrack') { while (seatsOn('racetrack', L, W, s) < n) L += 6; }
    while (seatsOn(shape, L, W, s) < n) L += 6;
    return { L: L, W: W };
  }
  // overall bounding box of the table (inches)
  function footprint(shape, t) {
    if (shape === 'u') return { x: t.L, y: t.W };                 // legs run along room length, head across
    if (shape === 'v') { var a = 30 * PI / 180; return { x: t.L * Math.cos(a / 1) , y: 2 * t.L * Math.sin(a) + ARM }; }
    if (shape === 'boat') return { x: t.L, y: t.W + 6 };          // belly adds ~6in at center
    return { x: t.L, y: t.W };
  }
  function usable(o) { // room box available to the table
    var RL = Math.max(o.roomL, o.roomW), RW = Math.min(o.roomL, o.roomW), c = o.clearance || 48;
    var wall = o.wall ? (o.wallDepth || 20) : 0;  // credenza/TV wall at one short end
    return { x: RL - 2 * c - wall, y: RW - 2 * c, RL: RL, RW: RW, wall: wall, c: c };
  }
  function fits(shape, t, u) { var f = footprint(shape, t); return f.x <= u.x && f.y <= u.y; }
  // biggest table of a shape that fits room
  function maxFor(shape, u, s) {
    if (u.x < 36 || u.y < 36) return null;
    var t;
    if (shape === 'round') { var d = Math.floor(Math.min(u.x, u.y, 120) / 6) * 6; t = { L: d, W: d }; }
    else if (shape === 'u') { t = { L: Math.floor(u.x / 6) * 6, W: Math.floor(u.y / 6) * 6 }; }
    else if (shape === 'v') { var L = Math.floor(Math.min(u.x / Math.cos(PI / 6), (u.y - ARM) / (2 * Math.sin(PI / 6))) / 6) * 6; t = { L: L, W: L }; }
    else { var len = Math.floor(u.x / 6) * 6, w = Math.min(widthFor(len)[1], Math.floor((u.y - (shape === 'boat' ? 6 : 0)) / 6) * 6);
      if (w < 36) return null; t = { L: len, W: w }; }
    if (t.L < 36) return null;
    t.seats = seatsOn(shape, t.L, t.W, s); return t;
  }
  function plan(o) {
    var s = o.spacing || 30, shape = o.shape || 'rectangle', u = usable(o), r = { shape: shape, warnings: [], usable: u };
    var m = maxFor(shape, u, s); r.max = m; r.maxSeats = m ? m.seats : 0;
    // legacy fields
    r.maxLength = m ? m.L : 0; r.maxWidth = m ? m.W : 0;
    if (!m) { r.fits = false; r.warnings.push('Room too small for a conference table with this clearance.'); return r; }
    if (o.seats) { var t = tableFor(shape, o.seats, s); r.table = t; r.fits = fits(shape, t, u);
      r.length = [t.L, t.L + (shape === 'round' ? 0 : 12)]; r.width = shape === 'rectangle' || shape === 'boat' || shape === 'racetrack' ? widthFor(t.L) : [t.W, t.W];
      if (!r.fits) r.warnings.push(o.seats + ' seats need a ' + t.L + ' in ' + LABEL[shape].toLowerCase() + ' table; this room fits up to ' + m.seats + ' on this shape.');
    } else { r.table = { L: m.L, W: m.W }; r.fits = true; r.length = [m.L, m.L]; r.width = [m.W, m.W]; }
    r.seats = o.seats && r.fits ? o.seats : seatsOn(shape, (r.fits ? r.table : m).L, (r.fits ? r.table : m).W, s);
    r.shapes = [LABEL.rectangle]; if (r.table.L >= 96) r.shapes.push('Boat'); if (r.table.L >= 144) r.shapes.push('Racetrack'); if ((o.seats || r.maxSeats) >= 16 || o.wall) r.shapes.push('U or V (open to screen)');
    r.options = whatFits(o); return r;
  }
  // 2-3 recommended configurations for the room (and headcount if given)
  function whatFits(o) {
    var s = o.spacing || 30, u = usable(o), out = [];
    SHAPES.forEach(function (sh) {
      var m = maxFor(sh, u, s); if (!m) return;
      var t = m;
      if (o.seats) { var need = tableFor(sh, o.seats, s); if (!fits(sh, need, u)) return; t = { L: need.L, W: need.W, seats: seatsOn(sh, need.L, need.W, s) }; }
      if ((sh === 'u' || sh === 'v') && !o.wall && !o.seats) return; // only suggest U/V when presenting
      out.push({ shape: sh, label: LABEL[sh], L: t.L, W: t.W, seats: t.seats });
    });
    out.sort(function (a, b) { return o.seats ? (a.L * a.W) - (b.L * b.W) : b.seats - a.seats; });
    return out.slice(0, 3);
  }
  // chair centers [{x,y,a}] in table-local coords (origin = table top-left of bounding box)
  function chairs(shape, t, s) {
    var c = [], i, n, off = 14;
    if (shape === 'rectangle' || shape === 'boat') {
      n = Math.floor(t.L / s); var start = (t.L - n * s) / 2 + s / 2, bw = shape === 'boat' ? 6 : 0;
      for (i = 0; i < n; i++) { var x = start + i * s, bulge = bw * Math.sin(PI * x / t.L) / 2;
        c.push({ x: x, y: -off - bulge + bw / 2, a: 0 }, { x: x, y: t.W + bw / 2 + off + bulge, a: 180 }); }
      c.push({ x: -off, y: (t.W + bw) / 2, a: 270 }, { x: t.L + off, y: (t.W + bw) / 2, a: 90 });
    } else if (shape === 'round') {
      n = seatsOn('round', t.L, t.W, s); var R = t.L / 2 + off;
      for (i = 0; i < n; i++) { var th = 2 * PI * i / n; c.push({ x: t.L / 2 + R * Math.cos(th), y: t.L / 2 + R * Math.sin(th), a: th * 180 / PI + 90 }); }
    } else if (shape === 'racetrack') {
      var r = t.W / 2, st = t.L - t.W; n = Math.floor(st / s); var e = Math.floor(PI * r / s), st0 = r + (st - n * s) / 2 + s / 2;
      for (i = 0; i < n; i++) c.push({ x: st0 + i * s, y: -off, a: 0 }, { x: st0 + i * s, y: t.W + off, a: 180 });
      for (i = 0; i < e; i++) { var ph = PI / 2 + PI * (i + .5) / e; c.push({ x: r + (r + off) * Math.cos(ph), y: r + (r + off) * Math.sin(ph), a: ph * 180 / PI + 90 });
        c.push({ x: t.L - r - (r + off) * Math.cos(ph), y: r + (r + off) * Math.sin(ph), a: 90 - ph * 180 / PI }); }
    } else if (shape === 'u') { // head along x=0 edge (left), legs along y=0 and y=W
      n = Math.floor(t.L / s);
      for (i = 0; i < n; i++) { var lx = (t.L - n * s) / 2 + s / 2 + i * s; c.push({ x: lx, y: -off, a: 0 }, { x: lx, y: t.W + off, a: 180 }); }
      var h = Math.floor(t.W / s); for (i = 0; i < h; i++) c.push({ x: -off, y: (t.W - h * s) / 2 + s / 2 + i * s, a: 270 });
    } else if (shape === 'v') {
      n = Math.floor(t.L / s); var a = PI / 6, f = footprint('v', t), cy = f.y / 2;
      for (i = 0; i < n; i++) { var d = (t.L - n * s) / 2 + s / 2 + i * s;
        c.push({ x: d * Math.cos(a), y: cy - ARM / 2 - d * Math.sin(a) - off, a: 0 }, { x: d * Math.cos(a), y: cy + ARM / 2 + d * Math.sin(a) + off, a: 180 }); }
    }
    return c;
  }
  var api = { SHAPES: SHAPES, LABEL: LABEL, ARM: ARM, widthFor: widthFor, seatsFor: seatsFor, lengthFor: lengthFor, seatsOn: seatsOn,
    tableFor: tableFor, footprint: footprint, usable: usable, fits: fits, maxFor: maxFor, plan: plan, whatFits: whatFits, chairs: chairs };
  root.TP = api;
})(typeof module !== 'undefined' ? module.exports : window);
