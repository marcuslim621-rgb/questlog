(function () {
  // ---- Supabase setup ----
  const SUPABASE_URL = 'https://amwralfgyxwnzzsoyfki.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_M40Z1-Ay-tUzsJT8npnPSA_qWR3TtRT';
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  const BUCKET = 'quest-photos';

  const SKY_KEY = 'datingPlanScroll.sky.v1';

  // Level = total completed quests. No XP math — the count IS the level.
  const TIERS = [
    { name: 'Strangers on a Quest', min: 0, max: 5 },
    { name: 'Companions', min: 6, max: 15 },
    { name: 'Trusted Allies', min: 16, max: 30 },
    { name: 'Partners in Crime', min: 31, max: 50 },
    { name: 'Soulbound', min: 51, max: 75 },
    { name: 'Eternal Duo', min: 76, max: Infinity }
  ];

  function tierForLevel(level) {
    return TIERS.find(t => level >= t.min && level <= t.max) || TIERS[TIERS.length - 1];
  }
  function tierIndex(level) {
    return TIERS.findIndex(t => level >= t.min && level <= t.max);
  }

  const CATEGORIES = {
    adventure: { label: 'Adventure', short: 'ADV', color: '#f2b13c' },
    comfort: { label: 'Comfort', short: 'CMF', color: '#8de08a' },
    communication: { label: 'Communication', short: 'COM', color: '#7ec8e3' },
    playfulness: { label: 'Playfulness', short: 'PLY', color: '#d95e9c' }
  };
  const CATEGORY_KEYS = Object.keys(CATEGORIES);

  const SPRITE_1 = 'assets/characters/sprite-1.png';
  const SPRITE_1_B = 'assets/characters/sprite-1-b.png';
  const SPRITE_1_C = 'assets/characters/sprite-1-c.png';
  const SPRITE_1_D = 'assets/characters/sprite-1-d.png';
  const SPRITE_2 = 'assets/characters/sprite-2.png';
  const SPRITE_2_B = 'assets/characters/sprite-2-b.png';
  const SPRITE_3 = 'assets/characters/sprite-3.png';
  const SPRITE_4 = 'assets/characters/sprite-4.png';

  const FLOWERS = [
    { left: '6%', color: '#e8657f', delay: '0.15s' }, { left: '13%', color: '#f2b13c', delay: '0.5s' },
    { left: '19%', color: '#d95e9c', delay: '0.3s' }, { left: '27%', color: '#f6f0d0', delay: '0.75s' },
    { left: '34%', color: '#e8657f', delay: '0.45s' }, { left: '41%', color: '#8f7bd6', delay: '0.9s' },
    { left: '48%', color: '#f2b13c', delay: '0.25s' }, { left: '56%', color: '#e8657f', delay: '0.65s' },
    { left: '63%', color: '#f6f0d0', delay: '1s' }, { left: '70%', color: '#d95e9c', delay: '0.4s' },
    { left: '78%', color: '#8f7bd6', delay: '0.8s' }, { left: '85%', color: '#f2b13c', delay: '0.55s' },
    { left: '92%', color: '#e8657f', delay: '1.05s' }
  ].map((f, i) => ({ ...f, stem: (10 + (i % 4) * 5) + 'px' }));

    const SPRITES = {
    "s/house": "assets/sprites/s/house.png",
    "s/tree-round": "assets/sprites/s/tree-round.png",
    "s/tree-pine": "assets/sprites/s/tree-pine.png",
    "s/tree-oak": "assets/sprites/s/tree-oak.png",
    "s/tree-sapling": "assets/sprites/s/tree-sapling.png",
    "s/tree-cypress": "assets/sprites/s/tree-cypress.png",
    "s/tree-blossom": "assets/sprites/s/tree-blossom.png",
    "s/bush-small": "assets/sprites/s/bush-small.png",
    "s/bush-berry": "assets/sprites/s/bush-berry.png",
    "c/idle-1": "assets/sprites/c/idle-1.png",
    "c/idle-2": "assets/sprites/c/idle-2.png",
    "c/idle-3": "assets/sprites/c/idle-3.png",
    "c/idle-4": "assets/sprites/c/idle-4.png",
    "c/idle-5": "assets/sprites/c/idle-5.png",
    "c/idle-6": "assets/sprites/c/idle-6.png",
    "c/sleep-1": "assets/sprites/c/sleep-1.png",
    "c/sleep-2": "assets/sprites/c/sleep-2.png",
    "c/sleep-3": "assets/sprites/c/sleep-3.png",
    "c/sleep-4": "assets/sprites/c/sleep-4.png",
    "c/look-1": "assets/sprites/c/look-1.png",
    "c/look-2": "assets/sprites/c/look-2.png",
    "c/look-3": "assets/sprites/c/look-3.png",
    "c/look-4": "assets/sprites/c/look-4.png",
    "c/happy-1": "assets/sprites/c/happy-1.png",
    "c/happy-2": "assets/sprites/c/happy-2.png",
    "c/happy-3": "assets/sprites/c/happy-3.png",
    "c/happy-4": "assets/sprites/c/happy-4.png",
    "c/stretch-1": "assets/sprites/c/stretch-1.png",
    "c/stretch-2": "assets/sprites/c/stretch-2.png",
    "c/stretch-3": "assets/sprites/c/stretch-3.png",
    "c/stretch-4": "assets/sprites/c/stretch-4.png",
    "c/jump-1": "assets/sprites/c/jump-1.png",
    "c/jump-2": "assets/sprites/c/jump-2.png",
    "c/jump-3": "assets/sprites/c/jump-3.png",
    "c/jump-4": "assets/sprites/c/jump-4.png",
    "c/jump-5": "assets/sprites/c/jump-5.png",
    "c/walkright-1": "assets/sprites/c/walkright-1.png",
    "c/walkright-2": "assets/sprites/c/walkright-2.png",
    "c/walkright-3": "assets/sprites/c/walkright-3.png",
    "c/walkright-4": "assets/sprites/c/walkright-4.png",
    "c/walkright-5": "assets/sprites/c/walkright-5.png",
    "c/walkright-6": "assets/sprites/c/walkright-6.png",
    "c/walkleft-1": "assets/sprites/c/walkleft-1.png",
    "c/walkleft-2": "assets/sprites/c/walkleft-2.png",
    "c/walkleft-3": "assets/sprites/c/walkleft-3.png",
    "c/walkleft-4": "assets/sprites/c/walkleft-4.png",
    "c/walkleft-5": "assets/sprites/c/walkleft-5.png",
    "c/walkleft-6": "assets/sprites/c/walkleft-6.png"
  };

  const TREE_KINDS = ['tree-round', 'tree-pine', 'tree-oak', 'tree-sapling', 'tree-cypress', 'tree-blossom'];
  const SPRITE_DIM = {
    'tree-round': [181, 294], 'tree-pine': [176, 355], 'tree-oak': [225, 319],
    'tree-sapling': [142, 278], 'tree-cypress': [134, 355], 'tree-blossom': [198, 245],
    'bush-small': [103, 131], 'bush-berry': [131, 125]
  };
  function spriteBox(kind, h) {
    const dim = SPRITE_DIM[kind];
    const w = Math.round(h * dim[0] / dim[1]);
    return `height:${h}px;width:${w}px;background-image:url(${SPRITES['s/' + kind]})`;
  }

  const TREES_BACK = [2, 9, 15, 22, 29, 36, 43, 50, 57, 64, 71, 78, 85, 93].map((left, i) => ({
    left: left + '%', kind: TREE_KINDS[(i * 5 + 1) % TREE_KINDS.length],
    h: 128 + (i % 4) * 20, dur: (7 + (i % 3)) + 's', delay: ((i % 5) * 0.6) + 's'
  }));
  const TREES_FRONT = [1, 8, 17, 26, 35, 44, 53, 62, 88, 96].map((left, i) => ({
    left: left + '%', kind: TREE_KINDS[(i * 3) % TREE_KINDS.length],
    h: 256 + (i % 4) * 44, dur: (6 + (i % 3)) + 's', delay: ((i % 4) * 0.8) + 's'
  }));
  const BUSHES = [
    { kind: 'bush-small', left: '12%', h: 56 },
    { kind: 'bush-berry', left: '21%', h: 60 },
    { kind: 'bush-berry', left: '47%', h: 52 },
    { kind: 'bush-small', left: '70%', h: 58 }
  ];
  const HOUSE_W = 600;

  function buildScene() {
    const scene = document.getElementById('scene');
    let html = '';

    html += `<div class="ground-img"></div>`;
    html += `<div class="bond-path" id="bond-path"></div>`;
    html += `<div class="garden" id="garden"></div>`;

    TREES_BACK.forEach(t => {
      html += `<div class="img-tree img-tree-back" style="left:${t.left};bottom:126px;${spriteBox(t.kind, t.h)};animation-duration:${t.dur};animation-delay:${t.delay};"></div>`;
    });
    TREES_FRONT.forEach(t => {
      html += `<div class="img-tree img-tree-front" style="left:${t.left};bottom:104px;${spriteBox(t.kind, t.h)};animation-duration:${t.dur};animation-delay:${t.delay};"></div>`;
    });

    BUSHES.forEach(b => {
      html += `<div class="img-bush" style="left:${b.left};${spriteBox(b.kind, b.h)}"></div>`;
    });

    html += `
      <div class="house-wrap" style="width:${HOUSE_W}px;">
        <img src="${SPRITES['s/house']}" alt="House">
        <div class="house-glow house-glow-1"></div>
        <div class="house-glow house-glow-2"></div>
        <div class="house-smoke">
          <div class="puff2" style="width:13px;height:13px;"></div>
          <div class="puff2" style="width:11px;height:11px;animation-delay:1.4s;"></div>
          <div class="puff2" style="width:9px;height:9px;animation-delay:2.8s;"></div>
        </div>
      </div>

      <div class="duo">
        <div class="char-wrap boy" id="char-boy">
          <div class="speech-bubble" id="boy-speech">Marcus</div>
          <div class="char-flip"><img id="marcus-img" src="${SPRITE_1}" alt="Marcus"></div>
          <div class="outfit-btns">
            <button type="button" id="marcus-prev" aria-label="Previous outfit"></button>
            <button type="button" id="marcus-next" aria-label="Next outfit"></button>
          </div>
        </div>
        <div class="char-wrap girl" id="char-girl">
          <div class="speech-bubble" id="girl-speech">Momo</div>
          <img id="momo-img" src="${SPRITE_2}" alt="Momo">
          <div class="outfit-btns">
            <button type="button" id="momo-prev" aria-label="Previous outfit"></button>
            <button type="button" id="momo-next" aria-label="Next outfit"></button>
          </div>
        </div>
      </div>

      <div class="cat-sprite" id="cat-sprite" title="click the cat"></div>`;

    scene.innerHTML = html;

    initCat();

    function makeTalker(wrapId, speechId) {
      const wrap = document.getElementById(wrapId);
      const speech = document.getElementById(speechId);
      let timer = null;
      wrap.addEventListener('click', () => {
        wrap.classList.remove('talking');
        void wrap.offsetWidth;
        wrap.classList.add('talking');
        speech.classList.add('show');
        clearTimeout(timer);
        timer = setTimeout(() => speech.classList.remove('show'), 1800);
      });
    }
    makeTalker('char-boy', 'boy-speech');
    makeTalker('char-girl', 'girl-speech');
  }

  // Bond scene: the shared garden/path grows a little with every tier reached.
  // Placeholder blocks for now — swap in real pixel-art frames per tier later.
  function updateSceneTier(tIdx) {
    const scene = document.getElementById('scene');
    if (scene) scene.dataset.tier = String(tIdx);

    const path = document.getElementById('bond-path');
    if (path) {
      const pct = Math.min(100, Math.round((tIdx / (TIERS.length - 1)) * 100));
      path.style.width = pct + '%';
    }

    const garden = document.getElementById('garden');
    if (garden) {
      const count = tIdx * 3;
      if (garden.dataset.count !== String(count)) {
        garden.dataset.count = String(count);
        let html = '';
        for (let i = 0; i < count; i++) {
          const f = FLOWERS[i % FLOWERS.length];
          const left = (4 + (i * 92) / Math.max(count, 1)) + '%';
          html += `<div class="garden-flower" style="left:${left};background:${f.color};animation-delay:${f.delay};"></div>`;
        }
        garden.innerHTML = html;
      }
    }
  }

  // ---- animated cat (scene-standalone sprite set) ----
  const CAT_META = {
    idle: { w: 119, h: 141 }, sleep: { w: 131, h: 142 }, look: { w: 109, h: 145 },
    happy: { w: 147, h: 144 }, stretch: { w: 220, h: 187 }, jump: { w: 162, h: 192 },
    walkright: { w: 143, h: 147 }, walkleft: { w: 142, h: 162 }
  };
  const repeatSeq = (arr, n) => Array.from({ length: n }, () => arr).flat();
  const CAT_SEQ = {
    idle: { frames: [0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 4, 3, 2, 1], ms: 300, loop: true },
    sleep: { frames: [0, 1, 2, 3], ms: 900, loop: true },
    look: { frames: [0, 1, 2, 3, 3, 2, 1, 0], ms: 520, loop: false },
    happy: { frames: [0, 1, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1], ms: 300 },
    stretch: { frames: [0, 0, 1, 1, 2, 2, 3, 3], ms: 440 },
    jump: { frames: [0, 1, 2, 3, 4, 4], ms: 320 },
    walkright: { frames: repeatSeq([0, 1, 2, 3, 4, 5], 3), ms: 220, dx: 130 },
    walkleft: { frames: repeatSeq([0, 1, 2, 3, 4, 5], 3), ms: 220, dx: -130 }
  };
  const CAT_CLICK_ACTIONS = ['look', 'happy', 'stretch', 'jump', 'walkright', 'walkleft'];

  let catState = { anim: 'sleep', step: 0, x: 40, acc: 0 };
  let catTimer = null;

  function catIsNight() { return !day; }

  function catDuoBand() {
    const scene = document.getElementById('scene');
    const w = scene ? scene.clientWidth : window.innerWidth;
    const duoLeft = w * 0.26;
    return [duoLeft - 110, duoLeft + 230];
  }

  function renderCat() {
    const el = document.getElementById('cat-sprite');
    if (!el) return;
    const night = catIsNight();
    const anim = night ? 'sleep' : catState.anim;
    const seq = CAT_SEQ[anim];
    const frame = seq.frames[Math.min(catState.step, seq.frames.length - 1)] + 1;
    const meta = CAT_META[anim];
    const scale = 0.62;
    el.style.width = Math.round(meta.w * scale) + 'px';
    el.style.height = Math.round(meta.h * scale) + 'px';
    el.style.left = Math.round(catState.x) + 'px';
    el.style.backgroundImage = `url("${SPRITES['c/' + anim + '-' + frame]}")`;
    el.title = night ? 'the cat is asleep' : 'click the cat';
  }

  function catTick() {
    const night = catIsNight();
    if (night && catState.anim !== 'sleep') {
      catState.anim = 'sleep'; catState.step = 0; catState.acc = 0; renderCat(); return;
    }
    if (!night && catState.anim === 'sleep') {
      catState.anim = 'idle'; catState.step = 0; catState.acc = 0; renderCat(); return;
    }
    const seq = CAT_SEQ[catState.anim];
    catState.acc += 60;
    if (catState.acc < seq.ms) return;
    catState.acc = 0;
    const next = catState.step + 1;
    if (next >= seq.frames.length) {
      if (seq.loop) { catState.step = 0; }
      else { catState.anim = night ? 'sleep' : 'idle'; catState.step = 0; }
      renderCat();
      return;
    }
    catState.step = next;
    if (seq.dx) {
      const per = seq.dx / seq.frames.length;
      const [bandA, bandB] = catDuoBand();
      let x = Math.max(40, Math.min(window.innerWidth - 260, catState.x + per));
      const left = catState.x <= bandA;
      if (left && x > bandA - 80) x = bandA - 80;
      if (!left && x < bandB + 20) x = bandB + 20;
      catState.x = x;
    }
    renderCat();
  }

  function pokeCat() {
    if (catIsNight()) return;
    if (catState.anim !== 'idle') return;
    let pick = CAT_CLICK_ACTIONS[Math.floor(Math.random() * CAT_CLICK_ACTIONS.length)];
    if (pick === 'walkright' && catState.x > window.innerWidth - 420) pick = 'walkleft';
    if (pick === 'walkleft' && catState.x < 200) pick = 'walkright';
    catState.acc = 0;
    catState.anim = pick;
    catState.step = 0;
    renderCat();
  }

  function initCat() {
    const [bandA] = catDuoBand();
    catState.x = Math.max(40, bandA - 60);
    renderCat();
    const el = document.getElementById('cat-sprite');
    if (el) el.addEventListener('click', pokeCat);
    if (catTimer) clearInterval(catTimer);
    catTimer = setInterval(catTick, 60);
  }

  // ---- state ----
  let items = [];
  let day = false;
  let pendingId = null;
  let loading = true;
  let searchTerm = '';
  let currentTab = 'active';

  const listEl = document.getElementById('quest-list');
  const emptyState = document.getElementById('empty-state');
  const emptyTitle = document.getElementById('empty-title');
  const emptySub = document.getElementById('empty-sub');
  const newItemInput = document.getElementById('new-item');
  const newDateInput = document.getElementById('new-date');
  const newCategoryInput = document.getElementById('new-category');
  const addBtn = document.getElementById('add-btn');
  const proofInput = document.getElementById('proof-input');
  const statusLine = document.getElementById('status-line');
  const moonBtn = document.getElementById('moon-btn');
  const sunBtn = document.getElementById('sun-btn');
  const skyBodyWord = document.getElementById('sky-body-word');
  const searchInput = document.getElementById('search-input');
  const searchClear = document.getElementById('search-clear');

  function setStatus(msg, isError) {
    statusLine.textContent = msg || '';
    statusLine.className = 'status-line' + (isError ? ' error' : '');
  }

  function applySky() {
    document.body.className = day ? 'day' : 'night';
    skyBodyWord.textContent = day ? 'sun' : 'moon';
    moonBtn.title = day ? 'Click the moon to raise the sun' : 'Click to bring back the night';
    sunBtn.title = moonBtn.title;
  }

  function toggleSky() {
    day = !day;
    try { localStorage.setItem(SKY_KEY, day ? 'day' : 'night'); } catch (e) {}
    applySky();
  }

  function todayISO() {
    const d = new Date(), p = n => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
  }

  // ---- data layer ----
  async function loadItems() {
    const { data, error } = await supabase
      .from('quests')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) { setStatus('Could not load the quest board: ' + error.message, true); return; }
    items = data.map(rowToItem);
    loading = false;
    render();
  }

  function rowToItem(row) {
    return {
      id: row.id,
      text: row.text,
      date: row.target_date || '',
      done: row.done,
      completedDate: row.completed_date || '',
      note: row.note || '',
      image: row.image_url || '',
      category: row.category || ''
    };
  }

  async function insertItem(text, date, category) {
    const { data, error } = await supabase
      .from('quests')
      .insert({ text, target_date: date || null, category: category || null })
      .select()
      .single();
    if (error) { setStatus('Could not add that quest: ' + error.message, true); return; }
    items.push(rowToItem(data));
    render();
  }

  async function updateItem(id, changes) {
    const dbChanges = {};
    if ('text' in changes) dbChanges.text = changes.text;
    if ('date' in changes) dbChanges.target_date = changes.date || null;
    if ('done' in changes) dbChanges.done = changes.done;
    if ('completedDate' in changes) dbChanges.completed_date = changes.completedDate || null;
    if ('note' in changes) dbChanges.note = changes.note;
    if ('image' in changes) dbChanges.image_url = changes.image || null;
    if ('category' in changes) dbChanges.category = changes.category || null;

    const item = items.find(i => i.id === id);
    if (item) Object.assign(item, changes);
    render();

    const { error } = await supabase.from('quests').update(dbChanges).eq('id', id);
    if (error) setStatus('A change failed to save: ' + error.message, true);
  }

  async function removeItem(id) {
    items = items.filter(i => i.id !== id);
    render();
    const { error } = await supabase.from('quests').delete().eq('id', id);
    if (error) setStatus('Could not remove that quest: ' + error.message, true);
  }

  async function uploadProof(id, file) {
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const path = `${id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false });
    if (uploadError) { setStatus('Could not upload that photo: ' + uploadError.message, true); return null; }
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }

  // ---- rendering ----
  function matchesSearch(item) {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return item.text.toLowerCase().includes(q) || (item.note || '').toLowerCase().includes(q);
  }

  function render() {
    // update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === currentTab);
    });
    // show/hide add panel based on tab
    const addPanel = document.querySelector('.add-panel');
    if (addPanel) addPanel.style.display = currentTab === 'active' ? '' : 'none';

    let tabItems = items.filter(i => currentTab === 'completed' ? i.done : !i.done);
    if (currentTab === 'active') {
      tabItems = tabItems.slice().sort((a, b) => {
        if (!a.date && !b.date) return 0;
        if (!a.date) return 1;
        if (!b.date) return -1;
        return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
      });
    }
    const visible = tabItems.filter(matchesSearch);

    const showEmpty = !loading && visible.length === 0;
    emptyState.style.display = showEmpty ? 'block' : 'none';
    if (showEmpty) {
      if (searchTerm) {
        emptyTitle.textContent = 'NO QUESTS MATCH';
        emptySub.textContent = 'Try a different search term.';
      } else if (currentTab === 'completed') {
        emptyTitle.textContent = 'NO CLEARED QUESTS YET';
        emptySub.textContent = 'Complete a quest to see it here.';
      } else {
        emptyTitle.textContent = 'NO QUESTS ON THE BOARD';
        emptySub.textContent = 'Add your first one below to begin.';
      }
    }
    listEl.innerHTML = '';

    const doneItems = items.filter(i => i.done);
    const done = doneItems.length;
    const open = items.length - done;
    const level = done;
    const tier = tierForLevel(level);
    const tIdx = tierIndex(level);
    const isMaxTier = tier.max === Infinity;
    const tierSize = tier.max - tier.min + 1;
    const intoTier = level - tier.min;
    const barWidth = isMaxTier ? '100%' : Math.round((intoTier / tierSize) * 100) + '%';

    document.getElementById('level-label').textContent = `LV ${level}  ·  ${tier.name.toUpperCase()}`;
    document.getElementById('xp-label').textContent = isMaxTier
      ? 'MAX BOND'
      : `${intoTier} / ${tierSize} TO ${TIERS[tIdx + 1].name.toUpperCase()}`;
    document.getElementById('xp-fill').style.width = barWidth;
    document.getElementById('done-count').textContent = done;
    document.getElementById('open-count').textContent = open;

    CATEGORY_KEYS.forEach(key => {
      const el = document.getElementById('cat-count-' + key);
      if (el) el.textContent = doneItems.filter(i => i.category === key).length;
    });

    updateSceneTier(tIdx);

    visible.forEach(item => {
      const li = document.createElement('li');
      li.className = 'quest-card';

      const check = document.createElement('button');
      check.type = 'button';
      check.className = 'check-btn' + (item.id === pendingId ? ' pending' : '');
      check.title = item.done ? 'Clear this completion' : 'Upload proof to clear this quest';
      check.textContent = item.done ? '✓' : '';
      check.addEventListener('click', () => onToggle(item));

      const main = document.createElement('div');
      main.className = 'item-main';

      const text = document.createElement('div');
      text.className = 'item-text' + (item.done ? ' done' : '');
      text.contentEditable = 'true';
      text.textContent = item.text;
      text.addEventListener('blur', () => {
        const val = text.textContent.trim();
        if (!val) { removeItem(item.id); return; }
        if (val !== item.text) updateItem(item.id, { text: val });
      });
      text.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); text.blur(); } });

      const dueRow = document.createElement('div');
      dueRow.className = 'due-row';
      const dueLabel = document.createElement('span');
      dueLabel.className = 'due-label';
      dueLabel.textContent = 'DUE';
      const dateInput = document.createElement('input');
      dateInput.type = 'date';
      dateInput.className = 'date-input';
      dateInput.value = item.date || '';
      dateInput.addEventListener('change', () => updateItem(item.id, { date: dateInput.value }));
      dueRow.appendChild(dueLabel);
      dueRow.appendChild(dateInput);

      const catSelect = document.createElement('select');
      catSelect.className = 'category-select' + (item.category ? ' set-' + item.category : '');
      catSelect.title = 'Which closeness stat this quest builds';
      const blankOpt = document.createElement('option');
      blankOpt.value = '';
      blankOpt.textContent = '— stat —';
      catSelect.appendChild(blankOpt);
      CATEGORY_KEYS.forEach(key => {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = CATEGORIES[key].label;
        if (item.category === key) opt.selected = true;
        catSelect.appendChild(opt);
      });
      catSelect.addEventListener('change', () => {
        catSelect.className = 'category-select' + (catSelect.value ? ' set-' + catSelect.value : '');
        updateItem(item.id, { category: catSelect.value });
      });
      dueRow.appendChild(catSelect);

      main.appendChild(text);
      main.appendChild(dueRow);

      if (item.done && item.image) {
        const proofRow = document.createElement('div');
        proofRow.className = 'proof-row';

        const thumbWrap = document.createElement('div');
        thumbWrap.className = 'proof-thumb-wrap';
        const thumb = document.createElement('img');
        thumb.src = item.image;
        thumb.alt = 'Proof';
        thumb.title = 'View full size';
        thumb.addEventListener('click', () => openZoom(item.image));
        thumbWrap.appendChild(thumb);

        const proofCol = document.createElement('div');
        proofCol.className = 'proof-col';
        const clearedLabel = document.createElement('span');
        clearedLabel.className = 'cleared-label';
        clearedLabel.textContent = '★ CLEARED ON';
        const clearedDate = document.createElement('input');
        clearedDate.type = 'date';
        clearedDate.className = 'cleared-date';
        clearedDate.value = item.completedDate || '';
        clearedDate.addEventListener('change', () => updateItem(item.id, { completedDate: clearedDate.value }));
        proofCol.appendChild(clearedLabel);
        proofCol.appendChild(clearedDate);

        proofRow.appendChild(thumbWrap);
        proofRow.appendChild(proofCol);
        main.appendChild(proofRow);
      }

      const noteWrap = document.createElement('div');
      noteWrap.className = 'item-note';
      const noteText = document.createElement('div');
      noteText.className = 'note-text';
      noteText.contentEditable = 'true';
      noteText.textContent = item.note || '';
      noteText.addEventListener('blur', () => {
        const val = noteText.textContent.trim();
        if (val !== item.note) updateItem(item.id, { note: val });
        placeholder.style.display = val ? 'none' : 'block';
      });
      noteText.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); noteText.blur(); } });
      const placeholder = document.createElement('span');
      placeholder.className = 'note-placeholder';
      placeholder.textContent = 'add a note…';
      placeholder.style.display = item.note ? 'none' : 'block';
      noteWrap.appendChild(noteText);
      noteWrap.appendChild(placeholder);

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'remove-btn';
      removeBtn.title = 'Abandon quest';
      removeBtn.textContent = 'X';
      removeBtn.addEventListener('click', () => removeItem(item.id));

      li.appendChild(check);
      li.appendChild(main);
      li.appendChild(noteWrap);
      li.appendChild(removeBtn);
      listEl.appendChild(li);
    });
  }

  function onToggle(item) {
    if (item.done) {
      if (!confirm('Abandon this clear? The proof photo and cleared date will be wiped.')) return;
      updateItem(item.id, { done: false, image: '', completedDate: '' });
      currentTab = 'active';
      render();
    } else {
      pendingId = item.id;
      proofInput.value = '';
      render();
      proofInput.click();
    }
  }

  proofInput.addEventListener('change', async () => {
    const file = proofInput.files && proofInput.files[0];
    const id = pendingId;
    pendingId = null;
    if (!file || !id) { render(); return; }
    setStatus('Uploading proof photo…');
    const url = await uploadProof(id, file);
    if (!url) { render(); return; }
    setStatus('');
    await updateItem(id, { done: true, completedDate: todayISO(), image: url });
    currentTab = 'completed';
    render();
  });

  function openZoom(src) {
    const modal = document.createElement('div');
    modal.className = 'zoom-modal';
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Proof';
    modal.appendChild(img);
    modal.addEventListener('click', () => modal.remove());
    document.body.appendChild(modal);
  }

  async function onAdd() {
    const text = newItemInput.value.trim();
    if (!text) { newItemInput.focus(); return; }
    addBtn.disabled = true;
    await insertItem(text, newDateInput.value, newCategoryInput.value);
    newItemInput.value = '';
    newDateInput.value = '';
    newCategoryInput.value = '';
    addBtn.disabled = false;
    newItemInput.focus();
  }

  addBtn.addEventListener('click', onAdd);
  newItemInput.addEventListener('keydown', e => { if (e.key === 'Enter') onAdd(); });
  moonBtn.addEventListener('click', toggleSky);
  sunBtn.addEventListener('click', toggleSky);

  document.getElementById('tabs').addEventListener('click', e => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    currentTab = btn.dataset.tab;
    render();
  });

  searchInput.addEventListener('input', () => {
    searchTerm = searchInput.value.trim();
    searchClear.style.display = searchTerm ? 'block' : 'none';
    render();
  });
  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchTerm = '';
    searchClear.style.display = 'none';
    render();
    searchInput.focus();
  });

  // ---- init ----
  try {
    const s = localStorage.getItem(SKY_KEY);
    if (s === 'day') day = true;
  } catch (e) {}
  applySky();
  buildScene();

  // ---- outfit switcher ----
  const MOMO_OUTFITS = [SPRITE_2, SPRITE_2_B, SPRITE_3, SPRITE_4];
  const MOMO_OUTFIT_KEY = 'questlog.momoOutfit';
  let momoOutfitIdx = 0;
  try {
    const i = parseInt(localStorage.getItem(MOMO_OUTFIT_KEY) || '0', 10);
    momoOutfitIdx = (isNaN(i) || i < 0) ? 0 : i % MOMO_OUTFITS.length;
  } catch (e) {}

  function setMomoOutfit(idx) {
    momoOutfitIdx = (idx + MOMO_OUTFITS.length) % MOMO_OUTFITS.length;
    const img = document.getElementById('momo-img');
    if (img) img.src = MOMO_OUTFITS[momoOutfitIdx];
    try { localStorage.setItem(MOMO_OUTFIT_KEY, momoOutfitIdx); } catch (e) {}
  }

  const momoImg = document.getElementById('momo-img');
  if (momoImg) momoImg.src = MOMO_OUTFITS[momoOutfitIdx];
  const momoPrev = document.getElementById('momo-prev');
  const momoNext = document.getElementById('momo-next');
  if (momoPrev) momoPrev.addEventListener('click', e => { e.stopPropagation(); setMomoOutfit(momoOutfitIdx - 1); });
  if (momoNext) momoNext.addEventListener('click', e => { e.stopPropagation(); setMomoOutfit(momoOutfitIdx + 1); });

  // Marcus outfits: add more sprite constants above and list them here as they're added
  const MARCUS_OUTFITS = [SPRITE_1, SPRITE_1_B, SPRITE_1_C, SPRITE_1_D];
  const MARCUS_OUTFIT_KEY = 'questlog.marcusOutfit';
  let marcusOutfitIdx = 0;
  try {
    const i = parseInt(localStorage.getItem(MARCUS_OUTFIT_KEY) || '0', 10);
    marcusOutfitIdx = (isNaN(i) || i < 0) ? 0 : i % MARCUS_OUTFITS.length;
  } catch (e) {}

  function setMarcusOutfit(idx) {
    marcusOutfitIdx = (idx + MARCUS_OUTFITS.length) % MARCUS_OUTFITS.length;
    const img = document.getElementById('marcus-img');
    if (img) img.src = MARCUS_OUTFITS[marcusOutfitIdx];
    try { localStorage.setItem(MARCUS_OUTFIT_KEY, marcusOutfitIdx); } catch (e) {}
  }

  const marcusImg = document.getElementById('marcus-img');
  if (marcusImg) marcusImg.src = MARCUS_OUTFITS[marcusOutfitIdx];
  const marcusPrev = document.getElementById('marcus-prev');
  const marcusNext = document.getElementById('marcus-next');
  if (marcusPrev) marcusPrev.addEventListener('click', e => { e.stopPropagation(); setMarcusOutfit(marcusOutfitIdx - 1); });
  if (marcusNext) marcusNext.addEventListener('click', e => { e.stopPropagation(); setMarcusOutfit(marcusOutfitIdx + 1); });

  loadItems();

  supabase
    .channel('quests-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'quests' }, () => { loadItems(); })
    .subscribe();
})();
