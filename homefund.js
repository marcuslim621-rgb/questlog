// Home Fund 2030: forecasts savings toward a house purchase under a few scenarios,
// plus a Monte Carlo run of the base case. Inputs stay in this browser only
// (localStorage) — financial numbers never go to the shared Supabase tables.
(function () {
  const STORE_KEY = 'questlog.homeFund.v1';

  const DEFAULTS = {
    savings: 0,             // cash + investments today
    income: 0,              // monthly take-home pay (after tax)
    spending: 0,            // monthly spending
    price: 2000000,         // house price in today's dollars
    goalType: 'deposit',    // 'deposit' = deposit + buying costs; 'full' = whole price + costs
    depositPct: 20,
    costsPct: 4.5,          // stamp duty, legals, inspections (rough NSW estimate at $2m)
    houseGrowth: 0,         // % per year the house price rises before you buy
    targetDate: '2030-12-31',
    volatility: 10,         // % yearly swing in returns, for the Monte Carlo
    scenarios: {
      cautious:   { label: 'Cautious',   ret: 2.5, incomeGrowth: 0, spendGrowth: 3.5 },
      base:       { label: 'Base',       ret: 4.5, incomeGrowth: 3, spendGrowth: 3 },
      optimistic: { label: 'Optimistic', ret: 7,   incomeGrowth: 5, spendGrowth: 2.5 }
    }
  };
  const SCENARIO_KEYS = ['cautious', 'base', 'optimistic'];
  const SCENARIO_COLORS = { cautious: '#ff8f7a', base: '#ffd75e', optimistic: '#8de08a' };
  const MC_RUNS = 1000;

  // ---- state ----
  function loadState() {
    const s = JSON.parse(JSON.stringify(DEFAULTS));
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
      if (saved && typeof saved === 'object') {
        Object.keys(DEFAULTS).forEach(k => {
          if (k === 'scenarios') return;
          if (saved[k] !== undefined) s[k] = saved[k];
        });
        if (saved.scenarios) {
          SCENARIO_KEYS.forEach(k => { if (saved.scenarios[k]) Object.assign(s.scenarios[k], saved.scenarios[k]); });
        }
      }
    } catch (e) {}
    return s;
  }
  function saveState() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
  }
  let state = loadState();

  // ---- maths ----
  function monthsUntil(dateStr, from) {
    const [y, m] = dateStr.split('-').map(Number);
    return Math.max(1, (y - from.getFullYear()) * 12 + (m - 1 - from.getMonth()));
  }

  function goalAt(month, s) {
    const price = s.price * Math.pow(1 + s.houseGrowth / 100, month / 12);
    const share = s.goalType === 'full' ? 1 : s.depositPct / 100;
    return price * (share + s.costsPct / 100);
  }

  // One deterministic path. `extra` adds a fixed amount saved every month (used to
  // solve for the monthly saving the goal needs).
  function project(s, sc, months, extra) {
    const balances = [s.savings];
    let bal = s.savings;
    let hit = goalAt(0, s) <= bal ? 0 : -1;
    for (let m = 1; m <= months; m++) {
      const t = (m - 1) / 12;
      const income = s.income * Math.pow(1 + sc.incomeGrowth / 100, t);
      const spend = s.spending * Math.pow(1 + sc.spendGrowth / 100, t);
      bal = bal * (1 + sc.ret / 100 / 12) + income - spend + (extra || 0);
      balances.push(bal);
      if (hit < 0 && bal >= goalAt(m, s)) hit = m;
    }
    return { balances, final: bal, hit };
  }

  // Monthly saving (on top of what you save now) for the scenario to just reach the goal.
  function extraNeeded(s, sc, months) {
    if (project(s, sc, months, 0).final >= goalAt(months, s)) return 0;
    let lo = 0, hi = goalAt(months, s);
    for (let i = 0; i < 50; i++) {
      const mid = (lo + hi) / 2;
      if (project(s, sc, months, mid).final >= goalAt(months, s)) hi = mid; else lo = mid;
    }
    return hi;
  }

  // Seeded so the result doesn't jump around every time you type.
  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function normal(rand) {
    let u = 0, v = 0;
    while (u === 0) u = rand();
    while (v === 0) v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  // Base scenario with randomness: monthly returns swing by `volatility`, and each
  // year's pay rise and spending inflation wobble around the base assumptions.
  function monteCarlo(s, months) {
    const sc = s.scenarios.base;
    const rand = rng(20301231);
    const mu = sc.ret / 100 / 12;
    const sigma = s.volatility / 100 / Math.sqrt(12);
    const paths = [];
    let hits = 0;
    for (let r = 0; r < MC_RUNS; r++) {
      const path = new Float64Array(months + 1);
      let bal = s.savings, income = s.income, spend = s.spending;
      path[0] = bal;
      for (let m = 1; m <= months; m++) {
        if (m > 1 && (m - 1) % 12 === 0) {
          income *= 1 + (sc.incomeGrowth + normal(rand) * 2) / 100;
          spend *= 1 + (sc.spendGrowth + normal(rand) * 1) / 100;
        }
        bal = bal * (1 + mu + sigma * normal(rand)) + income - spend;
        path[m] = bal;
      }
      if (bal >= goalAt(months, s)) hits++;
      paths.push(path);
    }
    const pct = (arr, p) => arr[Math.min(arr.length - 1, Math.floor(p * arr.length))];
    const bands = { p10: [], p50: [], p90: [] };
    for (let m = 0; m <= months; m++) {
      const col = paths.map(p => p[m]).sort((a, b) => a - b);
      bands.p10.push(pct(col, 0.1));
      bands.p50.push(pct(col, 0.5));
      bands.p90.push(pct(col, 0.9));
    }
    return { prob: hits / MC_RUNS, bands };
  }

  // ---- formatting ----
  const money = n => (n < 0 ? '-' : '') + '$' + Math.round(Math.abs(n)).toLocaleString('en-AU');
  const moneyShort = n => {
    const a = Math.abs(n), sign = n < 0 ? '-' : '';
    if (a >= 1e6) return sign + '$' + (a / 1e6).toFixed(a >= 1e7 ? 0 : 2).replace(/\.?0+$/, '') + 'M';
    if (a >= 1e3) return sign + '$' + Math.round(a / 1e3) + 'K';
    return sign + '$' + Math.round(a);
  };
  function monthLabel(offset) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() + offset);
    return d.toLocaleDateString('en-AU', { month: 'short', year: 'numeric' });
  }

  // ---- chart ----
  function chartSVG(series, goal, bands, months) {
    const W = 640, H = 260, L = 58, R = 12, T = 12, B = 28;
    const all = [...goal, ...bands.p90, ...bands.p10];
    series.forEach(s => all.push(...s.values));
    const maxV = Math.max(...all, 1);
    const minV = Math.min(0, ...all);
    const x = m => L + (m / months) * (W - L - R);
    const y = v => T + (1 - (v - minV) / (maxV - minV)) * (H - T - B);
    const line = vals => vals.map((v, m) => (m ? 'L' : 'M') + x(m).toFixed(1) + ' ' + y(v).toFixed(1)).join(' ');

    let svg = `<svg viewBox="0 0 ${W} ${H}" class="hf-chart" role="img" aria-label="Projected savings against the house goal">`;
    for (let i = 0; i <= 4; i++) {
      const v = minV + (maxV - minV) * i / 4;
      svg += `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" class="hf-gridline"/>`;
      svg += `<text x="${L - 6}" y="${y(v) + 4}" text-anchor="end" class="hf-axis">${moneyShort(v)}</text>`;
    }
    const startYear = new Date().getFullYear();
    for (let m = 0; m <= months; m++) {
      const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() + m);
      if (d.getMonth() === 0 && d.getFullYear() > startYear) {
        svg += `<text x="${x(m)}" y="${H - 8}" text-anchor="middle" class="hf-axis">${d.getFullYear()}</text>`;
      }
    }
    const band = bands.p90.map((v, m) => (m ? 'L' : 'M') + x(m).toFixed(1) + ' ' + y(v).toFixed(1)).join(' ')
      + ' ' + bands.p10.map((v, m) => 'L' + x(m).toFixed(1) + ' ' + y(v).toFixed(1)).reverse().join(' ') + ' Z';
    svg += `<path d="${band}" class="hf-band"/>`;
    svg += `<path d="${line(goal)}" class="hf-goal"/>`;
    series.forEach(s => { svg += `<path d="${line(s.values)}" fill="none" stroke="${s.color}" stroke-width="3"/>`; });
    svg += '</svg>';
    return svg;
  }

  // ---- UI ----
  const FIELDS = [
    { key: 'savings', label: 'Savings today', prefix: '$' },
    { key: 'income', label: 'Take-home pay / month', prefix: '$' },
    { key: 'spending', label: 'Spending / month', prefix: '$' },
    { key: 'price', label: 'House price', prefix: '$' },
    { key: 'costsPct', label: 'Stamp duty + costs', suffix: '%' },
    { key: 'houseGrowth', label: 'House price growth / yr', suffix: '%' }
  ];

  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function numInput(value, onChange, step) {
    const input = el('input', 'hf-input');
    input.type = 'number';
    input.inputMode = 'decimal';
    input.step = step || 'any';
    input.value = value;
    input.addEventListener('input', () => {
      const v = parseFloat(input.value);
      onChange(isNaN(v) ? 0 : v);
      saveState();
      renderResults();
    });
    return input;
  }

  let resultsEl = null;

  function close() {
    const m = document.getElementById('hf-modal');
    if (m) m.remove();
    resultsEl = null;
    document.removeEventListener('keydown', onKey);
  }
  function onKey(e) { if (e.key === 'Escape') close(); }

  function open() {
    close();
    const modal = el('div', 'stat-modal hf-modal');
    modal.id = 'hf-modal';
    modal.addEventListener('click', e => { if (e.target === modal) close(); });

    const card = el('div', 'stat-modal-card hf-card');
    const closeBtn = el('button', 'stat-modal-close', '×');
    closeBtn.type = 'button';
    closeBtn.addEventListener('click', close);
    card.appendChild(closeBtn);
    card.appendChild(el('div', 'stat-modal-header', 'HOME FUND · 2030'));
    card.appendChild(el('div', 'stat-free-row', 'QUEST: THE HOUSE'));

    // inputs
    const grid = el('div', 'hf-grid');
    FIELDS.forEach(f => {
      const wrap = el('label', 'hf-field');
      wrap.appendChild(el('span', 'hf-label', f.label));
      const row = el('span', 'hf-input-row');
      if (f.prefix) row.appendChild(el('span', 'hf-affix', f.prefix));
      row.appendChild(numInput(state[f.key], v => { state[f.key] = v; }));
      if (f.suffix) row.appendChild(el('span', 'hf-affix', f.suffix));
      wrap.appendChild(row);
      grid.appendChild(wrap);
    });

    const goalWrap = el('label', 'hf-field');
    goalWrap.appendChild(el('span', 'hf-label', 'Goal'));
    const goalRow = el('span', 'hf-input-row');
    const goalSel = el('select', 'hf-input');
    [['deposit', 'Deposit'], ['full', 'Buy outright']].forEach(([v, t]) => {
      const o = el('option', '', t); o.value = v; goalSel.appendChild(o);
    });
    goalSel.value = state.goalType;
    const depInput = numInput(state.depositPct, v => { state.depositPct = v; });
    depInput.classList.add('hf-input-small');
    const depPct = el('span', 'hf-affix', '%');
    const syncDep = () => {
      const show = state.goalType === 'deposit';
      depInput.style.display = show ? '' : 'none';
      depPct.style.display = show ? '' : 'none';
    };
    goalSel.addEventListener('change', () => { state.goalType = goalSel.value; syncDep(); saveState(); renderResults(); });
    goalRow.appendChild(goalSel);
    goalRow.appendChild(depInput);
    goalRow.appendChild(depPct);
    syncDep();
    goalWrap.appendChild(goalRow);
    grid.appendChild(goalWrap);

    const dateWrap = el('label', 'hf-field');
    dateWrap.appendChild(el('span', 'hf-label', 'Buy by'));
    const dateInput = el('input', 'hf-input');
    dateInput.type = 'date';
    dateInput.value = state.targetDate;
    dateInput.addEventListener('change', () => {
      if (!dateInput.value) return;
      state.targetDate = dateInput.value; saveState(); renderResults();
    });
    dateWrap.appendChild(dateInput);
    grid.appendChild(dateWrap);
    card.appendChild(grid);

    // scenario assumptions
    const details = el('details', 'hf-details');
    details.appendChild(el('summary', '', 'SCENARIO ASSUMPTIONS'));
    const table = el('div', 'hf-assume');
    table.appendChild(el('span', 'hf-assume-head', ''));
    ['Return / yr<br><small>after tax</small>', 'Pay rise / yr', 'Spending rise / yr'].forEach(h => table.appendChild(el('span', 'hf-assume-head', h)));
    SCENARIO_KEYS.forEach(k => {
      const sc = state.scenarios[k];
      const name = el('span', 'hf-assume-name', sc.label);
      name.style.color = SCENARIO_COLORS[k];
      table.appendChild(name);
      ['ret', 'incomeGrowth', 'spendGrowth'].forEach(p => {
        const cell = el('span', 'hf-input-row');
        cell.appendChild(numInput(sc[p], v => { sc[p] = v; }, '0.1'));
        cell.appendChild(el('span', 'hf-affix', '%'));
        table.appendChild(cell);
      });
    });
    details.appendChild(table);
    const volRow = el('label', 'hf-field hf-vol');
    volRow.appendChild(el('span', 'hf-label', 'Market swing / yr (simulation)'));
    const volIn = el('span', 'hf-input-row');
    volIn.appendChild(numInput(state.volatility, v => { state.volatility = Math.max(0, v); }, '1'));
    volIn.appendChild(el('span', 'hf-affix', '%'));
    volRow.appendChild(volIn);
    details.appendChild(volRow);
    const reset = el('button', 'hf-reset', 'RESET ASSUMPTIONS');
    reset.type = 'button';
    reset.addEventListener('click', () => {
      state.scenarios = JSON.parse(JSON.stringify(DEFAULTS.scenarios));
      state.volatility = DEFAULTS.volatility;
      saveState();
      open();
      document.querySelector('#hf-modal .hf-details').open = true;
    });
    details.appendChild(reset);
    card.appendChild(details);

    resultsEl = el('div', 'hf-results');
    card.appendChild(resultsEl);

    card.appendChild(el('p', 'hf-footnote',
      'Rough forecast, not financial advice. Numbers are saved only in this browser.'));

    modal.appendChild(card);
    document.body.appendChild(modal);
    document.addEventListener('keydown', onKey);
    renderResults();
  }

  function renderResults() {
    updateButton();
    if (!resultsEl) return;
    const s = state;
    const months = monthsUntil(s.targetDate, new Date());
    const goal = goalAt(months, s);
    const goalSeries = Array.from({ length: months + 1 }, (_, m) => goalAt(m, s));
    const monthlyNow = s.income - s.spending;

    if (!s.income && !s.savings) {
      resultsEl.innerHTML = '<div class="hf-empty">Enter your savings, pay and spending above to run the forecast.</div>';
      return;
    }

    const runs = SCENARIO_KEYS.map(k => ({ key: k, sc: s.scenarios[k], ...project(s, s.scenarios[k], months) }));
    const mc = monteCarlo(s, months);

    let html = `<div class="hf-goal-line">GOAL BY ${monthLabel(months).toUpperCase()}: <b>${money(goal)}</b>`
      + `<small>${s.goalType === 'full' ? 'full price' : s.depositPct + '% deposit'} + ${s.costsPct}% costs`
      + `${s.houseGrowth ? ` on a ${moneyShort(s.price * Math.pow(1 + s.houseGrowth / 100, months / 12))} house` : ''}</small></div>`;

    html += '<div class="hf-scenarios">';
    runs.forEach(r => {
      const diff = r.final - goal;
      const pct = Math.max(0, Math.min(100, (r.final / goal) * 100));
      html += `<div class="hf-sc" style="--sc:${SCENARIO_COLORS[r.key]}">
        <div class="hf-sc-name">${r.sc.label.toUpperCase()}</div>
        <div class="hf-sc-val">${moneyShort(r.final)}</div>
        <div class="hf-bar"><div style="width:${pct}%"></div></div>
        <div class="hf-sc-diff ${diff >= 0 ? 'ok' : 'short'}">${diff >= 0 ? '+' + moneyShort(diff) + ' spare' : moneyShort(-diff) + ' short'}</div>
        <div class="hf-sc-when">${r.hit >= 0 ? 'Goal reached ' + monthLabel(r.hit) : 'Not reached by ' + monthLabel(months)}</div>
      </div>`;
    });
    html += '</div>';

    html += chartSVG(runs.map(r => ({ values: r.balances, color: SCENARIO_COLORS[r.key] })), goalSeries, mc.bands, months);
    html += `<div class="hf-legend">
      ${SCENARIO_KEYS.map(k => `<span><i style="background:${SCENARIO_COLORS[k]}"></i>${s.scenarios[k].label}</span>`).join('')}
      <span><i class="hf-legend-goal"></i>Goal</span>
      <span><i class="hf-legend-band"></i>80% of simulations</span>
    </div>`;

    const probPct = Math.round(mc.prob * 100);
    html += `<div class="hf-mc">
      <div class="hf-mc-big ${probPct >= 50 ? 'ok' : 'short'}">${probPct}%</div>
      <div>of ${MC_RUNS.toLocaleString()} simulated futures (base case with market swings) reach the goal by ${monthLabel(months)}.
      <small>Middle outcome ${moneyShort(mc.bands.p50[months])} · bad luck (1 in 10) ${moneyShort(mc.bands.p10[months])} · good luck (1 in 10) ${moneyShort(mc.bands.p90[months])}</small></div>
    </div>`;

    const extra = extraNeeded(s, s.scenarios.base, months);
    html += `<div class="hf-need">You save <b>${money(monthlyNow)}</b>/month now. `
      + (extra > 0
        ? `In the base case you'd need about <b>${money(monthlyNow + extra)}</b>/month — <b>${money(extra)}</b> more.`
        : `That's enough for the base case. ✓`)
      + '</div>';

    resultsEl.innerHTML = html;
  }

  // Launcher button on the main board shows base-case progress at a glance.
  function updateButton() {
    const btn = document.getElementById('home-fund-btn');
    if (!btn) return;
    const tag = btn.querySelector('.hf-btn-pct');
    if (!state.income && !state.savings) { tag.textContent = 'SET UP'; return; }
    const months = monthsUntil(state.targetDate, new Date());
    const p = project(state, state.scenarios.base, months);
    tag.textContent = Math.round((p.final / goalAt(months, state)) * 100) + '% BY ' + state.targetDate.slice(0, 4);
  }

  const btn = document.getElementById('home-fund-btn');
  if (btn) btn.addEventListener('click', open);
  updateButton();

  // Exposed for quick checks from the console / tests.
  window.homeFund = { project, goalAt, monteCarlo, extraNeeded, monthsUntil, DEFAULTS };
})();
