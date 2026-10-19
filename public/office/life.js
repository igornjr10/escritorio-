'use strict';
// Ambient office life: agents type at their desks, walk the aisles to meet in pairs and chat.
// Purely illustrative — no agent work happens here. Maya follows her real session state.
(() => {
  const svg = document.getElementById('office');
  const NS = 'http://www.w3.org/2000/svg';
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const SPEED = 70; // floor units per second

  // Walkable network: each desk exits to the central aisle hub, spots branch off the hub.
  const HUB = { x: 240, y: 255 };
  const homes = Object.fromEntries(agents.map(a => [a.id, { x: a.x, y: a.y + 33 }]));
  const exits = {
    atlas: [{ x: 140, y: 255 }],
    hunter: [{ x: 365, y: 255 }],
    maya: [{ x: 240, y: 383 }],
    pulse: [{ x: 430, y: 383 }, { x: 430, y: 255 }],
    nexus: [{ x: 485, y: 255 }],
  };
  const spots = [
    { id: 'corredor', via: [], seats: [{ x: 255, y: 240 }, { x: 335, y: 270 }] },
    { id: 'lounge', via: [{ x: 240, y: 505 }], seats: [{ x: 175, y: 490 }, { x: 245, y: 520 }] },
    { id: 'cafe', via: [{ x: 445, y: 255 }, { x: 445, y: 72 }], seats: [{ x: 420, y: 64 }, { x: 465, y: 72 }] },
    { id: 'mesa', via: [{ x: 282, y: 200 }], seats: [{ x: 262, y: 142 }, { x: 305, y: 146 }] },
  ];

  // Small talk only — no metrics, clients or results are claimed.
  const dialogs = {
    'atlas-hunter': ['Novidades na prospecção?', 'Separei empresas pra olhar 🔎', 'Prioriza quem atende no WhatsApp', 'Combinado 👍'],
    'atlas-maya': ['Pauta da semana?', 'Roteiro de Reels ✍️', 'Foco em IA no atendimento', 'Perfeito 💡'],
    'atlas-pulse': ['Quais métricas vamos olhar?', 'Custo por lead e CTR 📊', 'Monta a estrutura do teste?', 'Deixa comigo'],
    'atlas-nexus': ['Como está o quadro?', 'Vou revisar as entregas 🗂️', 'Ótimo, segue o plano', '☕ Pausa rápida?'],
    'hunter-maya': ['Precisamos explicar CRM', 'Faço um carrossel 📲', 'Com exemplo hipotético', 'Claro, sem inventar 😉'],
    'hunter-pulse': ['Que perfil de lead buscamos?', 'Empresas com muito atendimento', 'Vou anotar a ideia 🔎', 'Boa!'],
    'hunter-nexus': ['Proposta precisa de revisão', 'Coloco no fluxo 🗂️', 'Valeu!', '👍'],
    'maya-pulse': ['Que formato testar?', 'Reels curto 🎬', 'Faço duas versões de gancho', 'Manda ver ✍️'],
    'maya-nexus': ['Prazo do roteiro?', 'Pode ser sexta?', 'Anotado no quadro 🗂️', 'Valeu!'],
    'pulse-nexus': ['Revisão da semana?', 'Quinta de manhã 📅', 'Levo a estrutura', 'Perfeito'],
  };
  const deskIcons = { atlas: ['📋', '🗓️', '💭'], hunter: ['🔎', '📇', '💭'], maya: ['💡', '✍️', '💭'], pulse: ['📊', '📈', '💭'], nexus: ['🗂️', '✅', '💭'] };
  const mayaBubbles = { submitted: '📨 Recebi!', streaming: '✍️ Escrevendo…', resuming: '↺ Recuperando…', error: '⚠️ Algo falhou' };

  const st = Object.fromEntries(agents.map(a => [a.id, { pos: { ...homes[a.id] }, path: [], mode: 'desk', bubble: '', bubbleUntil: 0, nextIdle: 0 }]));
  let meetings = [], nextPlan = performance.now() + 2500, last = performance.now(), layer = null, order = '';
  const bubbleNodes = {};

  const mayaState = () => (typeof mayaRealState === 'string' ? mayaRealState : 'ready');
  const mayaBusy = () => ['submitted', 'streaming', 'resuming'].includes(mayaState());
  const isFree = id => st[id].mode === 'desk' && !(id === 'maya' && mayaBusy());
  const pick = list => list[Math.floor(Math.random() * list.length)];
  const say = (id, text, ms, now) => { st[id].bubble = text; st[id].bubbleUntil = now + ms; };
  const goTo = (id, spot, seat) => { st[id].path = [...exits[id], HUB, ...spot.via, seat]; st[id].mode = 'walking'; };
  const goHome = id => {
    const m = meetings.find(m => m.ids.includes(id));
    const via = m ? [...m.spot.via].reverse() : [];
    st[id].path = [...via, HUB, ...[...exits[id]].reverse(), homes[id]];
    st[id].mode = 'returning';
  };

  function plan(now) {
    if (reduceMotion.matches) return;
    const max = running ? 2 : 1;
    if (meetings.length >= max) return;
    const used = meetings.map(m => m.spot.id);
    const freeSpots = spots.filter(s => !used.includes(s.id));
    const pool = agents.map(a => a.id).filter(isFree);
    if (!freeSpots.length || !pool.length) return;
    const cafe = freeSpots.find(s => s.id === 'cafe');
    if ((pool.length === 1 || Math.random() < 0.25) && cafe) { // solo coffee break
      const id = pick(pool);
      meetings.push({ ids: [id], spot: cafe, lines: ['☕ Pausa pro café'], idx: 0, nextLine: 0, ending: 0 });
      goTo(id, cafe, cafe.seats[0]);
      return;
    }
    if (pool.length < 2) return;
    const a = pick(pool), b = pick(pool.filter(x => x !== a));
    const ids = agents.map(x => x.id).filter(x => x === a || x === b); // canonical order for dialog keys
    const spot = pick(freeSpots);
    meetings.push({ ids, spot, lines: dialogs[ids.join('-')], idx: 0, nextLine: 0, ending: 0 });
    ids.forEach((id, i) => goTo(id, spot, spot.seats[i]));
  }

  function walk(s, dt) {
    let budget = SPEED * dt;
    while (budget > 0 && s.path.length) {
      const t = s.path[0], dx = t.x - s.pos.x, dy = t.y - s.pos.y, d = Math.hypot(dx, dy);
      if (d <= budget) { s.pos = { ...t }; s.path.shift(); budget -= d; } else { s.pos.x += dx / d * budget; s.pos.y += dy / d * budget; budget = 0; }
    }
    return !s.path.length;
  }

  function update(now, dt) {
    if (now > nextPlan) { plan(now); nextPlan = now + (running ? 3500 : 7000) + Math.random() * 4000; }
    for (const a of agents) {
      const s = st[a.id];
      if (s.mode === 'walking' && walk(s, dt)) s.mode = 'waiting';
      if (s.mode === 'returning' && walk(s, dt)) { s.mode = 'desk'; s.nextIdle = now + 2000 + Math.random() * 6000; }
      if (s.mode === 'desk' && now > s.nextIdle && !(a.id === 'maya' && mayaState() !== 'ready')) {
        if (now > s.nextIdle + 50) say(a.id, pick(deskIcons[a.id]), 2200, now);
        s.nextIdle = now + 9000 + Math.random() * 12000;
      }
    }
    for (const m of [...meetings]) {
      if (m.ids.includes('maya') && mayaBusy() && !m.ending) { m.ending = now; m.ids.forEach(goHome); }
      if (m.ending) { if (m.ids.every(id => st[id].mode === 'desk')) meetings = meetings.filter(x => x !== m); continue; }
      if (!m.ids.every(id => st[id].mode === 'waiting' || st[id].mode === 'talking')) continue;
      if (now < m.nextLine) continue;
      if (m.idx < m.lines.length) {
        const speaker = m.ids[m.idx % m.ids.length];
        m.ids.forEach(id => { st[id].mode = 'talking'; });
        say(speaker, m.lines[m.idx], 2300, now);
        m.idx++; m.nextLine = now + 2500;
      } else { m.ending = now; m.ids.forEach(goHome); }
    }
    // Maya's real state overrides her ambient bubble.
    const ms = mayaState();
    if (mayaBubbles[ms]) say('maya', mayaBubbles[ms], 400, now);
  }

  function ensureLayer() {
    if (layer?.isConnected) return;
    layer = document.createElementNS(NS, 'g');
    layer.setAttribute('class', 'life-bubbles');
    layer.setAttribute('aria-hidden', 'true');
    svg.appendChild(layer);
    for (const k in bubbleNodes) delete bubbleNodes[k];
    order = '';
  }

  function drawBubble(id, text, x, y) {
    let node = bubbleNodes[id];
    if (!node || node.dataset.text !== text) {
      node?.remove();
      node = document.createElementNS(NS, 'g');
      node.dataset.text = text;
      node.innerHTML = `<g class="bubble"><rect rx="9" height="21" y="-21"/><path d="M-5 -1 L0 7 L5 -1Z"/><text y="-6.5" text-anchor="middle"></text></g>`;
      node.querySelector('text').textContent = text;
      layer.appendChild(node);
      const w = Math.max(24, node.querySelector('text').getComputedTextLength() + 18);
      const r = node.querySelector('rect'); r.setAttribute('width', w); r.setAttribute('x', -w / 2);
      bubbleNodes[id] = node;
    }
    node.setAttribute('transform', `translate(${x.toFixed(1)},${(y - 66).toFixed(1)})`);
  }

  function render(now) {
    ensureLayer();
    for (const a of agents) {
      const s = st[a.id], g = svg.querySelector(`.svg-agent[data-agent="${a.id}"]`);
      if (!g) continue;
      const [x, y] = project(s.pos.x, s.pos.y);
      g.setAttribute('transform', `translate(${x.toFixed(1)},${y.toFixed(1)})`);
      const moving = s.mode === 'walking' || s.mode === 'returning';
      g.classList.toggle('walking', moving);
      g.classList.toggle('typing', s.mode === 'desk' && (a.id !== 'maya' || mayaState() !== 'error'));
      g.classList.toggle('talking', s.mode === 'talking' && now < s.bubbleUntil);
      if (now < s.bubbleUntil && s.bubble) drawBubble(a.id, s.bubble, x, y);
      else if (bubbleNodes[a.id]) { bubbleNodes[a.id].remove(); delete bubbleNodes[a.id]; }
    }
    // Paint order by depth so whoever is closer to the viewer is drawn on top.
    const sorted = agents.map(a => a.id).sort((p, q) => (st[p].pos.x + st[p].pos.y) - (st[q].pos.x + st[q].pos.y));
    const key = sorted.join();
    if (key !== order && !document.activeElement?.closest?.('.svg-agent')) {
      for (const id of sorted) { const g = svg.querySelector(`.svg-agent[data-agent="${id}"]`); if (g) svg.appendChild(g); }
      svg.appendChild(layer);
      order = key;
    }
  }

  function frame(now) {
    const dt = Math.min(0.5, (now - last) / 1000); last = now; // tolerate throttled frames
    update(now, dt); render(now);
    requestAnimationFrame(frame);
  }

  // ---------- Decor ----------
  const timeOfDay = () => { const h = new Date().getHours(); return h >= 7 && h < 17 ? 'day' : h >= 17 && h < 19 || h >= 5 && h < 7 ? 'dusk' : 'night'; };
  const clockText = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  window.officeFloorDecor = () => {
    let s = poly([[20, 395, 1.5], [170, 395, 1.5], [170, 560, 1.5], [20, 560, 1.5]], '#3f5b6e', 'opacity=".55"');
    s += poly([[32, 407, 1.6], [158, 407, 1.6], [158, 548, 1.6], [32, 548, 1.6]], 'none', 'stroke="#9fb7c4" stroke-opacity=".35" stroke-width="1.5"');
    s += poly([[215, 225, 1.5], [360, 225, 1.5], [360, 285, 1.5], [215, 285, 1.5]], '#55707a', 'opacity=".35"');
    if (timeOfDay() !== 'day') for (const a of agents.slice(0, 4)) { const [x, y] = project(a.x - 8, a.y - 20); s += `<ellipse class="lamp-glow" cx="${x}" cy="${y}" rx="95" ry="48" fill="url(#lampGlow)"/>`; }
    return `<defs><radialGradient id="lampGlow"><stop offset="0" stop-color="#ffd58a" stop-opacity=".28"/><stop offset="1" stop-color="#ffd58a" stop-opacity="0"/></radialGradient></defs>` + s;
  };

  window.officeDecor = () => {
    const tod = timeOfDay();
    const sky = { day: ['#9fd2e6', '#d9eef4'], dusk: ['#e79a6f', '#6f6a9c'], night: ['#0f1b33', '#24365a'] }[tod];
    let s = `<defs><linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient></defs>`;
    // Window with sky, sun/moon and frame.
    s += poly([[70, 13.2, 29], [185, 13.2, 29], [185, 13.2, 68], [70, 13.2, 68]], 'url(#skyGrad)');
    const [cx, cy] = project(160, 13.4, 58);
    s += tod === 'night' ? `<circle cx="${cx}" cy="${cy}" r="5" fill="#f4f1d6"/><circle cx="${cx - 40}" cy="${cy - 12}" r="1" fill="#fff"/><circle cx="${cx - 62}" cy="${cy - 22}" r="1.2" fill="#fff"/><circle cx="${cx - 25}" cy="${cy - 28}" r=".9" fill="#fff"/>` : `<circle cx="${cx}" cy="${cy}" r="6" fill="${tod === 'day' ? '#fff3c4' : '#ffcf8a'}" opacity=".9"/>`;
    s += poly([[124, 13.6, 29], [128, 13.6, 29], [128, 13.6, 68], [124, 13.6, 68]], '#aabfbf');
    // Wall TV with an animated (illustrative) dashboard.
    s += poly([[238, 11, 40], [322, 11, 40], [322, 11, 80], [238, 11, 80]], '#1d2a35');
    s += poly([[242, 11.3, 44], [318, 11.3, 44], [318, 11.3, 76], [242, 11.3, 76]], '#12202b');
    [14, 20, 11, 24, 17, 27].forEach((h, i) => { const x = 250 + i * 10; s += poly([[x, 11.5, 47], [x + 6, 11.5, 47], [x + 6, 11.5, 47 + h], [x, 11.5, 47 + h]], i % 2 ? '#c4a2f4' : '#b5f477', `class="tv-bar" style="animation-delay:${i * 0.35}s"`); });
    // Coffee corner with steam.
    s += box(400, 14, 58, 26, 30, '#c9b79a', '#a8977c', '#8b8574');
    s += box(408, 18, 16, 14, 20, '#3b4a57', '#2c3944', '#24313b', 30);
    s += box(411, 31, 8, 2, 3, '#b5f477', '#86b85a', '#86b85a', 42);
    s += box(434, 22, 6, 6, 6, '#f4efe2', '#d9d4c8', '#b7baaf', 30) + box(444, 24, 6, 6, 6, '#f4efe2', '#d9d4c8', '#b7baaf', 30);
    const [sx, sy] = project(416, 25, 52);
    s += `<g class="steam" transform="translate(${sx},${sy})"><path d="M-3 0c-4-6 4-9 0-15"/><path d="M3 -2c-4-6 4-9 0-15" style="animation-delay:.9s"/></g>`;
    // Wall clock with the real time.
    s += poly([[350, 11, 58], [392, 11, 58], [392, 11, 76], [350, 11, 76]], '#16222c', 'stroke="#3d4f5e"');
    const [tx, ty] = project(354, 11.4, 62);
    s += `<text id="wall-clock" transform="matrix(.81 .405 0 1 ${tx} ${ty})" fill="#b5f477" font-family="ui-monospace,monospace" font-size="12" font-weight="700">${clockText()}</text>`;
    s += plant(190, 530);
    return s;
  };

  setInterval(() => { const c = document.getElementById('wall-clock'); if (c) c.textContent = clockText(); }, 20000);
  renderOffice();
  requestAnimationFrame(t => { last = t; frame(t); });
})();
