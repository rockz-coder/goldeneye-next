/* Goldeneye v2 — Properties listing page. Needs main.js (window.GD) and listings.js. */
(() => {
    'use strict';
    const { $, $$, store, wish } = window.GD;
    const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const fmt = (n) => n >= 1e7 ? '৳' + (n / 1e7).toFixed(2).replace(/\.?0+$/, '') + ' Crore' : '৳' + (n / 1e5).toFixed(1).replace(/\.0$/, '') + ' Lakh';
    const B = window.GD_BASE || '/en';
    const img = (n) => (/^(\/|https?:)/.test(n) ? n : `/images/${n}.jpg`);
    const PAGE = 6, MAX_CMP = 3;
    const CATS = ['Apartment', 'Plot', 'Commercial', 'Duplex', 'Penthouse'];
    const AMEN = ['Pool', 'Gym', 'Lake view', 'Corner', 'Parking'];
    const PROJECTS = [...new Set(LISTINGS.map(l => l.project))];
    const AREAS = [...new Set(LISTINGS.map(l => l.area))];
    const SORTS = { new: (a, b) => a.rank - b.rank, plh: (a, b) => a.price - b.price, phl: (a, b) => b.price - a.price, size: (a, b) => (b.unit === 'katha' ? b.size * 720 : b.size) - (a.unit === 'katha' ? a.size * 720 : a.size), hand: (a, b) => a.handover - b.handover };
    const ICON = {
        pin: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>',
        heart: '<svg width="18" height="18" viewBox="0 0 24 24" stroke="#0D1330" stroke-width="2" aria-hidden="true"><path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/></svg>',
        home: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#7A5A1F" stroke-width="1.5" aria-hidden="true"><path d="M3 21V9l9-6 9 6v12"/><path d="M9 21v-6h6v6"/></svg>'
    };

    /* ---------- state (mirrored into the URL so a search can be shared) ---------- */
    const q = new URLSearchParams(location.search);
    const csv = (k) => (q.get(k) || '').split(',').filter(Boolean);
    const S = {
        view: ['grid', 'list', 'map'].includes(q.get('view')) ? q.get('view') : 'grid',
        sort: SORTS[q.get('sort')] ? q.get('sort') : 'new',
        q: q.get('q') || '', cats: csv('cat').filter(c => CATS.includes(c)),
        proj: PROJECTS.includes(q.get('project')) ? q.get('project') : '', area: AREAS.includes(q.get('area')) ? q.get('area') : '',
        budget: BUDGETS[q.get('budget')] ? q.get('budget') : '', size: SIZE_FILTERS[q.get('size')] ? q.get('size') : '',
        beds: [2, 3, 4].includes(+q.get('beds')) ? +q.get('beds') : 0, status: csv('status').filter(s => STATUS_LABEL[s]),
        year: ['2026', '2027', '2028'].includes(q.get('year')) ? q.get('year') : '', facing: ['South', 'North', 'East', 'Lake view'].includes(q.get('facing')) ? q.get('facing') : '',
        amen: csv('amen').filter(a => AMEN.includes(a)), rajuk: q.get('rajuk') === '1',
        saved: q.get('saved') === '1' || location.hash === '#saved',
        shown: PAGE, pin: null, cmp: [], qv: null, cmpOpen: false
    };

    const syncUrl = () => {
        const p = new URLSearchParams();
        if (S.view !== 'grid') p.set('view', S.view);
        if (S.sort !== 'new') p.set('sort', S.sort);
        if (S.q) p.set('q', S.q);
        if (S.cats.length) p.set('cat', S.cats.join(','));
        ['proj:project', 'area:area', 'budget:budget', 'size:size', 'year:year', 'facing:facing'].forEach(pair => { const [k, name] = pair.split(':'); if (S[k]) p.set(name, S[k]); });
        if (S.beds) p.set('beds', S.beds);
        if (S.status.length) p.set('status', S.status.join(','));
        if (S.amen.length) p.set('amen', S.amen.join(','));
        if (S.rajuk) p.set('rajuk', '1');
        if (S.saved) p.set('saved', '1');
        const qs = p.toString();
        history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
        return qs;
    };

    /* ---------- filtering ---------- */
    const match = (p) => {
        if (S.saved && !wish.list().includes('u:' + p.id)) return false;
        if (S.q && !(p.title + p.project + p.area + p.loc + p.cat).toLowerCase().includes(S.q.toLowerCase())) return false;
        if (S.cats.length && !S.cats.includes(p.cat)) return false;
        if (S.proj && p.project !== S.proj) return false;
        if (S.area && p.area !== S.area) return false;
        if (S.budget) { const [lo, hi] = BUDGETS[S.budget]; if (p.price < lo || p.price >= hi) return false; }
        if (S.size) { const f = SIZE_FILTERS[S.size]; if (!f.cats.includes(p.cat) || p.size < f.min || p.size > f.max) return false; }
        if (S.beds && (S.beds === 4 ? p.beds < 4 : p.beds !== S.beds)) return false;
        if (S.status.length && !S.status.includes(p.status)) return false;
        if (S.year && p.handover > +S.year) return false;
        if (S.facing && p.facing !== S.facing) return false;
        if (S.amen.length && !S.amen.every(a => p.amen.includes(a))) return false;
        if (S.rajuk && !p.rajuk) return false;
        return true;
    };
    const results = () => LISTINGS.filter(match).sort(SORTS[S.sort]);
    const per = (p) => p.unit === 'katha' ? fmt(p.price / p.size) + ' / katha' : '৳' + Math.round(p.price / p.size).toLocaleString('en-IN') + ' / sqft';
    const specs = (p) => p.unit === 'katha' ? `${p.size} katha · ${p.amen.includes('Corner') ? 'Corner · ' : ''}RAJUK layout` : (p.beds ? p.beds + ' bed · ' : '') + p.size.toLocaleString('en-IN') + ' sqft' + (p.beds ? ' · ' + Math.min(p.beds, 4) + ' bath' : '');
    const detailHref = (p) => `${B}/property?id=${p.projId}&unit=${p.id}`;
    const by = (id) => LISTINGS.find(p => p.id === id);

    /* ---------- chips for the sidebar ---------- */
    const chipBtn = (label, on, attrs) => `<button type="button" class="chip chip--sm${on ? ' is-on' : ''}" aria-pressed="${on}" ${attrs}>${label}</button>`;
    const toggle = (arr, v) => arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v];

    const buildStatic = () => {
        $('#f-proj').innerHTML = '<option value="">Any</option>' + PROJECTS.map(p => `<option>${p}</option>`).join('');
        $('#f-area').innerHTML = '<option value="">Any</option>' + AREAS.map(p => `<option>${p}</option>`).join('');
        $('#f-budget').innerHTML = '<option value="">Any budget</option>' + Object.entries(BUDGETS).map(([k, v]) => `<option value="${k}">${v[2]}</option>`).join('');
        const groups = {};
        Object.entries(SIZE_FILTERS).forEach(([k, v]) => { (groups[v.group] = groups[v.group] || []).push(`<option value="${k}">${v.label}</option>`); });
        $('#f-size').innerHTML = '<option value="">Any size</option>' + Object.entries(groups).map(([g, o]) => `<optgroup label="${g}">${o.join('')}</optgroup>`).join('');
        $('#f-status').innerHTML = Object.entries(STATUS_LABEL).map(([k, v]) => `<label><input type="checkbox" value="${k}"><span>${v[0]}</span><em class="num">${LISTINGS.filter(p => p.status === k).length}</em></label>`).join('');
    };
    const syncControls = () => {
        $('#f-q').value = S.q;
        $('#f-cats').innerHTML = CATS.map(c => chipBtn(c, S.cats.includes(c), `data-cat="${c}"`)).join('');
        $('#f-beds').innerHTML = [[0, 'Any'], [2, '2'], [3, '3'], [4, '4+']].map(([v, l]) => chipBtn(l, S.beds === v, `data-beds="${v}"`)).join('');
        $('#f-amen').innerHTML = AMEN.map(a => chipBtn(a, S.amen.includes(a), `data-amen="${a}"`)).join('');
        $('#f-proj').value = S.proj; $('#f-area').value = S.area; $('#f-budget').value = S.budget; $('#f-size').value = S.size; $('#f-year').value = S.year; $('#f-facing').value = S.facing;
        $$('#f-status input').forEach(i => { i.checked = S.status.includes(i.value); });
        $('#f-rajuk').checked = S.rajuk;
        $('#sort').value = S.sort;
        $$('#views button').forEach(b => { const on = b.dataset.v === S.view; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', String(on)); });
    };

    /* ---------- active filter chips ---------- */
    const activeChips = () => {
        const c = [];
        const add = (label, undo) => c.push({ label, undo });
        if (S.saved) add('Saved only', () => { S.saved = false; });
        if (S.q) add(`“${S.q}”`, () => { S.q = ''; });
        S.cats.forEach(x => add(x, () => { S.cats = S.cats.filter(y => y !== x); }));
        if (S.proj) add(S.proj, () => { S.proj = ''; });
        if (S.area) add(S.area, () => { S.area = ''; });
        if (S.budget) add(BUDGETS[S.budget][2], () => { S.budget = ''; });
        if (S.size) add(SIZE_FILTERS[S.size].label, () => { S.size = ''; });
        if (S.beds) add(`${S.beds === 4 ? '4+' : S.beds} bed`, () => { S.beds = 0; });
        S.status.forEach(x => add(STATUS_LABEL[x][0], () => { S.status = S.status.filter(y => y !== x); }));
        if (S.year) add('By ' + S.year, () => { S.year = ''; });
        if (S.facing) add(S.facing + ' facing', () => { S.facing = ''; });
        S.amen.forEach(x => add(x, () => { S.amen = S.amen.filter(y => y !== x); }));
        if (S.rajuk) add('RAJUK only', () => { S.rajuk = false; });
        return c;
    };
    let chipUndo = [];

    /* ---------- result templates ---------- */
    const wishOn = (p) => wish.list().includes('u:' + p.id);
    const heart = (p) => { const on = wishOn(p); return `<button type="button" class="pc__heart" data-wish="${p.id}" aria-pressed="${on}" aria-label="Save ${esc(p.title)}"><span class="${on ? 'is-on' : ''}">${ICON.heart}</span></button>`; };
    const status = (p) => `<span class="tag tag--${STATUS_LABEL[p.status][1]}">${STATUS_LABEL[p.status][0]}</span>`;
    const cmpBox = (p) => `<label class="pc__cmp"><input type="checkbox" data-cmp="${p.id}" ${S.cmp.includes(p.id) ? 'checked' : ''}>Compare</label>`;

    const card = (p) => `
        <article class="pc lift">
            <div class="pc__media zoom">
                <div class="pc__imgs noscroll" data-strip>${p.imgs.map(([n, pos], i) => `<img src="${img(n)}" alt="${esc(p.title)} at Goldeneye ${p.project}${p.imgs.length > 1 ? ', photo ' + (i + 1) : ''}" style="object-position:${pos}" loading="lazy">`).join('')}</div>
                <span class="pc__tags">${status(p)}${p.rajuk ? '<span class="tag tag--glass">RAJUK ✓</span>' : ''}</span>
                ${heart(p)}
                ${p.imgs.length > 1 ? `<button type="button" class="pc__nav pc__nav--prev" data-nav="-1" aria-label="Previous photo">‹</button><button type="button" class="pc__nav pc__nav--next" data-nav="1" aria-label="Next photo">›</button>
                <span class="pc__dots" aria-hidden="true">${p.imgs.map((_, i) => `<i class="${i ? '' : 'is-on'}"></i>`).join('')}</span>` : ''}
            </div>
            <div class="pc__body">
                <p class="pc__eyebrow">${p.project} · ${p.cat}</p>
                <h3 class="disp"><a href="${detailHref(p)}" data-recent="${p.id}">${p.title}</a></h3>
                <p class="pc__loc">${p.loc}</p>
                <p class="pc__specs">${specs(p)}</p>
                <div class="pc__price"><div><b class="disp num">${fmt(p.price)}</b><span class="num">${per(p)}</span></div>${cmpBox(p)}</div>
                <div class="pc__btns"><button type="button" class="btn btn--sm btn--line" data-quick="${p.id}">Quick view</button><a href="${detailHref(p)}" class="btn btn--sm btn--ink" data-recent="${p.id}">Details</a></div>
            </div>
        </article>`;

    const row = (p) => `
        <article class="pr lift">
            <div class="pr__media zoom"><img src="${img(p.imgs[0][0])}" alt="${esc(p.title)} at Goldeneye ${p.project}" style="object-position:${p.imgs[0][1]}" loading="lazy"><span class="pc__tags">${status(p)}</span>${heart(p)}</div>
            <div class="pr__main">
                <div class="pr__info">
                    <p class="pc__eyebrow">${p.project} · ${p.cat}</p>
                    <h3 class="disp"><a href="${detailHref(p)}" data-recent="${p.id}">${p.title}</a></h3>
                    <p class="pc__loc">${p.loc} · Handover ${p.handover}</p>
                    <p class="pc__specs">${specs(p)}</p>
                </div>
                <div class="pr__side">
                    <b class="disp num">${fmt(p.price)}</b><span class="num">${per(p)}</span>
                    <div class="pr__act">${cmpBox(p)}<button type="button" class="btn btn--sm btn--line" data-quick="${p.id}">Quick view</button><a href="${detailHref(p)}" class="btn btn--sm btn--ink" data-recent="${p.id}">Details</a></div>
                </div>
            </div>
        </article>`;

    const mapView = (list) => {
        const names = [...new Set(list.map(p => p.project))];
        const pins = names.map(n => { const f = list.find(p => p.project === n); const c = list.filter(p => p.project === n).length; return `<button type="button" class="pin${S.pin === n ? ' is-on' : ''}" style="left:${f.x}%;top:${f.y}%" data-pin="${n}" aria-pressed="${S.pin === n}">${n} · ${c}</button>`; }).join('');
        const side = (S.pin ? list.filter(p => p.project === S.pin) : list).map(p => `
            <a href="${detailHref(p)}" class="mi${S.pin === p.project ? ' is-on' : ''}" data-recent="${p.id}"><img src="${img(p.imgs[0][0])}" alt="" style="object-position:${p.imgs[0][1]}"><span><b>${p.title}</b><small>${p.project} · ${p.area}</small><strong class="num">${fmt(p.price)}</strong></span></a>`).join('');
        return `<div class="map">
            <div class="map__canvas" role="group" aria-label="Map of project locations">
                <i class="m-road" style="left:0;right:0;top:38%;height:14px"></i><i class="m-road" style="top:0;bottom:0;left:44%;width:14px"></i><i class="m-road" style="left:0;right:0;top:72%;height:8px"></i><i class="m-road" style="top:0;bottom:0;left:76%;width:8px"></i>
                <i class="m-water" style="left:58%;top:8%;width:30%;height:24%"></i><i class="m-park" style="left:6%;top:48%;width:26%;height:18%"></i>
                <span class="m-lbl" style="left:47%;top:3%">Airport Rd</span><span class="m-lbl" style="left:3%;top:34%">Kuril–Purbachal 300 ft</span>
                ${pins}
                <span class="map__note">Map preview · live map in build</span>
            </div>
            <div class="map__list">${side}</div></div>`;
    };

    /* ---------- main render ---------- */
    const el = { res: $('#results'), count: $('#count'), more: $('#more'), chips: $('#chips'), sheetCount: $('#sheet-count'), saveBtn: $('#save-search'), savedBtn: $('#saved-toggle') };
    const render = () => {
        const list = results(), page = list.slice(0, S.shown);
        const projCount = new Set(list.map(p => p.project)).size;
        el.count.textContent = list.length;
        $('#count-text').textContent = list.length === 1 ? `home, plot or office in ${projCount} project` : `homes, plots and offices across ${projCount} project${projCount === 1 ? '' : 's'}`;
        el.sheetCount.textContent = list.length;

        if (!list.length) {
            el.res.innerHTML = `<div class="empty">${ICON.home}<h3 class="disp">${S.saved && !wish.list().length ? 'Nothing saved yet.' : 'No homes match all of that — yet.'}</h3>
                <p>${S.saved && !wish.list().length ? 'Tap the heart on any listing to save it here.' : 'Try widening your budget or status. Or save this search and we’ll message you when a match is released.'}</p>
                <div class="btn-row"><button type="button" class="btn btn--ink" data-clear>${S.saved ? 'Show all properties' : 'Clear filters'}</button><button type="button" class="btn btn--line" data-save>Alert me</button></div></div>`;
        } else if (S.view === 'grid') el.res.innerHTML = `<div class="grid">${page.map(card).join('')}</div>`;
        else if (S.view === 'list') el.res.innerHTML = `<div class="rows">${page.map(row).join('')}</div>`;
        else el.res.innerHTML = mapView(list);

        const canMore = S.view !== 'map' && list.length > S.shown;
        el.more.hidden = !canMore;
        if (canMore) { $('#more-text').textContent = `Showing ${page.length} of ${list.length}`; $('#more-bar').style.width = Math.round(page.length / list.length * 100) + '%'; }

        const chips = activeChips();
        chipUndo = chips.map(c => c.undo);
        const chipHtml = chips.map((c, i) => `<button type="button" class="chip chip--sm chip--x" data-undo="${i}" aria-label="Remove filter ${esc(c.label)}">${esc(c.label)} <span aria-hidden="true">×</span></button>`).join('');
        el.chips.innerHTML = chipHtml + (chips.length ? '<button type="button" class="link-btn" data-clear>Clear all</button>' : '');
        $('#filter-badge').textContent = chips.length;
        $('#filter-badge').hidden = !chips.length;
        $('#mobile-chips').innerHTML = chipHtml;

        const qs = syncUrl();
        const saved = store.get('gd-searches', []);
        const isSaved = saved.includes(qs || '(all)');
        el.saveBtn.querySelector('span').textContent = isSaved ? 'Search saved' : 'Save search';
        el.savedBtn.setAttribute('aria-pressed', String(S.saved));
        el.savedBtn.classList.toggle('is-on', S.saved);
        $('#saved-n').textContent = wish.list().filter(id => id.startsWith('u:')).length;
        renderCompareBar();
    };

    const reset = () => {
        Object.assign(S, { q: '', cats: [], proj: '', area: '', budget: '', size: '', beds: 0, status: [], year: '', facing: '', amen: [], rajuk: false, saved: false, shown: PAGE, pin: null });
        syncControls(); render();
    };
    const change = (patch) => { Object.assign(S, patch, { shown: PAGE, pin: null }); render(); };

    /* ---------- toast ---------- */
    let toastT;
    const toast = (msg) => { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 2600); };

    /* ---------- dialogs (quick view, compare, filter sheet) ---------- */
    let lastFocus = null, openDlg = null;
    const openDialog = (dlg, trigger) => {
        lastFocus = trigger || document.activeElement; openDlg = dlg; if (dlg.classList.contains('dlg')) dlg.hidden = false;
        document.body.classList.add('no-scroll');
        const f = $('[data-autofocus]', dlg) || $('button, a[href], input, select', dlg); f && f.focus();
    };
    const closeDialog = () => {
        if (!openDlg) return;
        if (openDlg.classList.contains('dlg')) openDlg.hidden = true; else { openDlg.classList.remove('is-open'); openDlg.removeAttribute('role'); openDlg.removeAttribute('aria-modal'); }
        openDlg = null; document.body.classList.remove('no-scroll');
        if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
    };
    document.addEventListener('keydown', (e) => {
        if (!openDlg) return;
        if (e.key === 'Escape') { closeDialog(); return; }
        if (e.key === 'Tab') {
            const f = $$('button:not([disabled]), a[href], input:not([disabled]), select', openDlg).filter(x => x.offsetParent !== null);
            if (!f.length) return;
            const first = f[0], last = f[f.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    });
    $$('[data-close]').forEach(b => b.addEventListener('click', closeDialog));
    $$('.dlg').forEach(d => d.addEventListener('click', (e) => { if (e.target === d) closeDialog(); }));

    const openQuick = (id, trigger) => {
        const p = by(id);
        $('#qv-img').src = img(p.imgs[0][0]); $('#qv-img').alt = `${p.title} at Goldeneye ${p.project}`; $('#qv-img').style.objectPosition = p.imgs[0][1];
        $('#qv-eyebrow').textContent = `${p.project} · ${p.cat}`;
        $('#qv-h').textContent = p.title; $('#qv-loc').textContent = p.loc;
        $('#qv-price').innerHTML = `${fmt(p.price)} <small>${per(p)}</small>`;
        $('#qv-specs').textContent = specs(p); $('#qv-status').textContent = `${STATUS_LABEL[p.status][0]} · Handover ${p.handover}`;
        $('#qv-link').href = detailHref(p); $('#qv-link').dataset.recent = p.id;
        $('#qv-wa').href = `https://wa.me/8801700000000?text=${encodeURIComponent('Hi, I am interested in ' + p.title + ' (' + p.project + ')')}`;
        openDialog($('#dlg-qv'), trigger);
    };

    /* ---------- compare ---------- */
    const renderCompareBar = () => {
        const bar = $('#cmp-bar');
        bar.hidden = !S.cmp.length;
        $('#cmp-n').textContent = `${S.cmp.length} / ${MAX_CMP}`;
        $('#cmp-imgs').innerHTML = S.cmp.map(id => { const p = by(id); return `<img src="${img(p.imgs[0][0])}" alt="${esc(p.title)}" style="object-position:${p.imgs[0][1]}">`; }).join('');
        $('#cmp-now').disabled = S.cmp.length < 2;
        $('#cmp-now').textContent = S.cmp.length < 2 ? 'Pick one more' : 'Compare now';
    };
    const openCompare = (trigger) => {
        $('#cmp-grid').innerHTML = S.cmp.map(by).map(p => `
            <div class="cmpcard"><img src="${img(p.imgs[0][0])}" alt="${esc(p.title)}" style="object-position:${p.imgs[0][1]}">
            <dl><div><dt>Home</dt><dd class="disp">${p.title}</dd></div><div><dt>Price</dt><dd class="num"><b>${fmt(p.price)}</b> · ${per(p)}</dd></div><div><dt>Size &amp; layout</dt><dd>${specs(p)}</dd></div><div><dt>Location</dt><dd>${p.loc}</dd></div><div><dt>Status · handover</dt><dd>${STATUS_LABEL[p.status][0]} · ${p.handover}</dd></div><div><dt>Facing</dt><dd>${p.facing}</dd></div></dl>
            <a href="${detailHref(p)}" class="btn btn--sm btn--ink">View details</a></div>`).join('');
        openDialog($('#dlg-cmp'), trigger);
    };

    /* ---------- recently viewed ---------- */
    const recent = () => store.get('gd-recent', []).map(by).filter(Boolean);
    const drawRecent = () => {
        const r = recent().slice(0, 3);
        $('#recent').hidden = !r.length;
        $('#recent-list').innerHTML = r.map(p => `<a href="${detailHref(p)}" class="rv lift" data-recent="${p.id}"><img src="${img(p.imgs[0][0])}" alt="" style="object-position:${p.imgs[0][1]}"><span><b>${p.title}</b><small>${p.project} · ${fmt(p.price)}</small></span></a>`).join('');
    };
    document.addEventListener('click', (e) => {
        const a = e.target.closest('[data-recent]');
        if (!a) return;
        const id = a.dataset.recent;
        store.set('gd-recent', [id, ...store.get('gd-recent', []).filter(x => x !== id)].slice(0, 6));
    });

    /* ---------- events ---------- */
    el.res.addEventListener('click', (e) => {
        const t = e.target;
        let b;
        if ((b = t.closest('[data-wish]'))) {
            const on = wish.toggle('u:' + b.dataset.wish);
            b.setAttribute('aria-pressed', String(on)); b.firstElementChild.classList.toggle('is-on', on);
            $('#saved-n').textContent = wish.list().filter(id => id.startsWith('u:')).length;
            if (S.saved && !on) render();
        } else if ((b = t.closest('[data-quick]'))) openQuick(b.dataset.quick, b);
        else if ((b = t.closest('[data-nav]'))) { const s = $('[data-strip]', b.closest('.pc__media')); s.scrollBy({ left: s.clientWidth * +b.dataset.nav, behavior: 'smooth' }); }
        else if ((b = t.closest('[data-pin]'))) { S.pin = S.pin === b.dataset.pin ? null : b.dataset.pin; render(); }
        else if (t.closest('[data-clear]')) reset();
        else if (t.closest('[data-save]')) saveSearch();
    });
    el.res.addEventListener('change', (e) => {
        const c = e.target.closest('[data-cmp]');
        if (!c) return;
        const id = c.dataset.cmp;
        if (c.checked && S.cmp.length >= MAX_CMP) { c.checked = false; toast(`You can compare up to ${MAX_CMP} homes at a time.`); return; }
        S.cmp = c.checked ? [...S.cmp, id] : S.cmp.filter(x => x !== id);
        renderCompareBar();
    });
    // photo dots follow the swipe position (scroll doesn't bubble, so listen in the capture phase)
    el.res.addEventListener('scroll', (e) => {
        const s = e.target;
        if (!s.matches || !s.matches('[data-strip]')) return;
        const i = Math.round(s.scrollLeft / s.clientWidth);
        $$('.pc__dots i', s.parentElement).forEach((d, j) => d.classList.toggle('is-on', j === i));
    }, true);

    const undoClick = (e) => { const b = e.target.closest('[data-undo]'); if (b) { chipUndo[+b.dataset.undo](); S.shown = PAGE; syncControls(); render(); } else if (e.target.closest('[data-clear]')) reset(); };
    el.chips.addEventListener('click', undoClick);
    $('#mobile-chips').addEventListener('click', undoClick);

    $('#f-q').addEventListener('input', (e) => { clearTimeout($('#f-q')._t); $('#f-q')._t = setTimeout(() => change({ q: e.target.value.trim() }), 200); });
    $('#f-cats').addEventListener('click', (e) => { const b = e.target.closest('[data-cat]'); if (!b) return; change({ cats: toggle(S.cats, b.dataset.cat) }); syncControls(); });
    $('#f-beds').addEventListener('click', (e) => { const b = e.target.closest('[data-beds]'); if (!b) return; change({ beds: +b.dataset.beds }); syncControls(); });
    $('#f-amen').addEventListener('click', (e) => { const b = e.target.closest('[data-amen]'); if (!b) return; change({ amen: toggle(S.amen, b.dataset.amen) }); syncControls(); });
    $('#f-status').addEventListener('change', () => change({ status: $$('#f-status input:checked').map(i => i.value) }));
    [['f-proj', 'proj'], ['f-area', 'area'], ['f-budget', 'budget'], ['f-size', 'size'], ['f-year', 'year'], ['f-facing', 'facing']].forEach(([id, k]) => $('#' + id).addEventListener('change', (e) => change({ [k]: e.target.value })));
    $('#f-rajuk').addEventListener('change', (e) => change({ rajuk: e.target.checked }));
    $('#sort').addEventListener('change', (e) => change({ sort: e.target.value }));
    $('#views').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (!b) return; S.view = b.dataset.v; S.pin = null; syncControls(); render(); });
    $('#more-btn').addEventListener('click', () => { S.shown += PAGE; render(); });
    $$('[data-reset]').forEach(b => b.addEventListener('click', reset));
    el.savedBtn.addEventListener('click', () => change({ saved: !S.saved }));

    const saveSearch = () => {
        const qs = syncUrl() || '(all)', all = store.get('gd-searches', []);
        if (all.includes(qs)) { store.set('gd-searches', all.filter(x => x !== qs)); toast('Saved search removed.'); }
        else { store.set('gd-searches', [...all, qs]); toast('Search saved — we’ll alert you about new matches.'); }
        render();
    };
    el.saveBtn.addEventListener('click', saveSearch);

    // filter sheet (tablet / mobile)
    const side = $('#filters');
    $('#open-sheet').addEventListener('click', (e) => { side.classList.add('is-open'); openDialog(side, e.currentTarget); side.setAttribute('role', 'dialog'); side.setAttribute('aria-modal', 'true'); });
    const closeSheet = () => { if (openDlg === side) closeDialog(); else side.classList.remove('is-open'); };
    $('#close-sheet').addEventListener('click', closeSheet); $('#apply-sheet').addEventListener('click', closeSheet);
    $('#sheet-bg').addEventListener('click', closeSheet);
    matchMedia('(min-width: 1101px)').addEventListener('change', (m) => { if (m.matches && side.classList.contains('is-open')) closeSheet(); });

    $('#cmp-now').addEventListener('click', (e) => openCompare(e.currentTarget));
    $('#cmp-clear').addEventListener('click', () => { S.cmp = []; render(); });
    addEventListener('hashchange', () => { S.saved = location.hash === '#saved'; S.shown = PAGE; render(); });
    addEventListener('gd:wish', () => { $('#saved-n').textContent = wish.list().filter(id => id.startsWith('u:')).length; });

    buildStatic(); syncControls(); drawRecent(); render();
})();
