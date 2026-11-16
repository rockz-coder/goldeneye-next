/* Goldeneye v2 — single property page. Content comes from property-data.js (DETAILS) and listings.js (LISTINGS). */
(() => {
    'use strict';
    const { $, $$, wish } = window.GD;
    const params = new URLSearchParams(location.search);
    const D = DETAILS[params.get('id')];
    if (!D) { location.replace('properties.html'); return; }

    const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const fmt = (n) => n >= 1e7 ? '৳' + (n / 1e7).toFixed(2).replace(/\.?0+$/, '') + ' Crore' : n >= 1e5 ? '৳' + (n / 1e5).toFixed(1).replace(/\.0$/, '') + ' Lakh' : '৳' + Math.round(n).toLocaleString('en-IN');
    const img = (n) => `images/${n}.jpg`;
    const isPlot = D.kind === 'plot';
    const units = LISTINGS.filter(p => p.projId === D.id);
    const set = (id, v) => { $('#' + id).textContent = v; };
    const html = (id, v) => { $('#' + id).innerHTML = v; };

    document.title = `${D.name} — ${D.loc} · Goldeneye Developers`;
    $('meta[name=description]').content = D.overview[1].slice(0, 155);

    /* ---------- toast + dialogs ---------- */
    let toastT;
    const toast = (m) => { const t = $('#toast'); t.textContent = m; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 2600); };
    let openDlg = null, lastFocus = null;
    const openDialog = (dlg, trigger) => { lastFocus = trigger || document.activeElement; openDlg = dlg; dlg.hidden = false; document.body.classList.add('no-scroll'); const f = $('[data-autofocus]', dlg); f && f.focus(); };
    const closeDialog = () => { if (!openDlg) return; openDlg.hidden = true; openDlg = null; document.body.classList.remove('no-scroll'); if (lastFocus && document.contains(lastFocus)) lastFocus.focus(); };
    document.addEventListener('keydown', (e) => {
        if (!openDlg) return;
        if (e.key === 'Escape') return closeDialog();
        if (openDlg.id === 'lb' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) return lbStep(e.key === 'ArrowRight' ? 1 : -1);
        if (e.key === 'Tab') {
            const f = $$('button:not([disabled]), a[href], input, textarea', openDlg).filter(x => x.offsetParent !== null || x === document.activeElement);
            if (!f.length) return;
            const a = f[0], z = f[f.length - 1];
            if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
            else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
        }
    });
    $$('[data-close]').forEach(b => b.addEventListener('click', closeDialog));
    $$('.dlg').forEach(d => d.addEventListener('click', (e) => { if (e.target === d) closeDialog(); }));

    /* ---------- hero ---------- */
    const heroImg = $('#h-img'); heroImg.src = img(D.hero[0]); heroImg.style.objectPosition = D.hero[1]; heroImg.alt = `${D.name}, ${D.loc}`;
    set('h-crumb', D.name);
    html('h-tags', D.tags.map(t => `<span>${esc(t)}</span>`).join(''));
    const words = D.name.split(' ');
    html('p-title', `<span class="ln"><span>${words[0]}</span></span><span class="ln d1"><span>${words.slice(1).join(' ')}</span></span>`);
    set('h-loc', D.locLine);
    $('#h-cta').firstChild.textContent = D.cta[0];
    $('#t-compare').href = `properties.html?project=${encodeURIComponent(D.short)}`;
    const saveBtn = $('#t-save'), wid = 'p:' + D.id;
    const drawSave = () => { const on = wish.list().includes(wid); saveBtn.setAttribute('aria-pressed', String(on)); saveBtn.setAttribute('aria-label', on ? 'Remove from saved' : 'Save project'); };
    saveBtn.addEventListener('click', () => { const on = wish.toggle(wid); drawSave(); toast(on ? 'Saved to your list.' : 'Removed from your list.'); });
    addEventListener('gd:wish', drawSave); drawSave();
    $('#t-print').addEventListener('click', () => print());
    $('#t-share').addEventListener('click', async () => {
        const data = { title: D.name, text: `${D.name} — ${D.loc}`, url: location.href };
        try { if (navigator.share) { await navigator.share(data); return; } await navigator.clipboard.writeText(location.href); toast('Link copied.'); }
        catch (e) { if (e && e.name !== 'AbortError') toast('Copy the link from the address bar.'); }
    });

    /* ---------- key facts, overview ---------- */
    html('facts', D.facts.map(([k, v, s]) => `<div><dt>${k}</dt><dd class="disp num">${v}${s ? `<small>${s}</small>` : ''}</dd></div>`).join(''));
    set('ov-h', D.overview[0]); set('ov-p', D.overview[1]);
    html('ov-stats', D.stats.map(([k, v]) => `<div><p>${k}</p><p class="disp num">${v}</p></div>`).join(''));
    html('ov-amen', D.amenities.map(a => `<li>${esc(a)}</li>`).join(''));

    /* ---------- explorer: plots (Green Valley) or homes (everything else) ---------- */
    const BLOCKS = ['A', 'B', 'C', 'D'], RATE = { A: 4500000, B: 4200000, C: 4000000, D: 4000000 }, SQFT = 720;
    const plotsOf = (block) => {
        const bi = BLOCKS.indexOf(block);
        return Array.from({ length: 24 }, (_, j) => {
            const i = j + 1, k = i % 6 === 0 || i % 6 === 1 ? 5 : (i === 9 || i === 16) ? 10 : 3, h = (i * 7 + bi * 13 + (i % 4) * 3) % 10;
            return { id: `${block}-${String(i).padStart(2, '0')}`, n: String(i).padStart(2, '0'), block, k, status: h < 6 ? 'sold' : h < 8 ? 'reserved' : 'available', corner: [1, 6, 19, 24].includes(i), facing: i <= 12 ? 'South' : 'North', road: (i <= 6 || (i >= 13 && i <= 18)) ? '40 ft avenue' : '25 ft road', rate: RATE[block] };
        });
    };
    const ALL_PLOTS = isPlot ? BLOCKS.flatMap(plotsOf) : [];
    const priceOf = (p) => p.k * p.rate * (p.corner ? 1.1 : 1);
    const STATUS = { available: 'Available', reserved: 'Reserved', sold: 'Sold' };
    const S = { block: 'A', size: 0, sel: null, unit: null };

    // read ?unit= (a listing id from the Properties page) and ?plot= (our own deep link)
    if (isPlot) {
        const L = LISTINGS.find(p => p.id === params.get('unit')), want = ALL_PLOTS.find(p => p.id === params.get('plot'));
        S.sel = want && want.status === 'available' ? want : ALL_PLOTS.find(p => p.status === 'available' && (!L || p.k === L.size));
        S.sel = S.sel || ALL_PLOTS.find(p => p.status === 'available');
        S.block = S.sel.block;
    } else S.unit = units.find(p => p.id === params.get('unit')) || units[0];

    const selInfo = () => isPlot
        ? { code: S.sel.id, title: `Plot ${S.sel.id}`, price: priceOf(S.sel), status: S.sel.status, corner: S.sel.corner, meta: `${S.sel.k} katha at ${fmt(S.sel.rate)} / katha${S.sel.corner ? ' + 10% corner premium' : ''}`, blurb: `plot ${S.sel.id} (${S.sel.k} katha)` }
        : { code: S.unit.title, title: S.unit.title, price: S.unit.price, status: 'available', corner: false, meta: `${S.unit.size.toLocaleString('en-IN')} sqft at ৳${Math.round(S.unit.price / S.unit.size).toLocaleString('en-IN')} / sqft`, blurb: `${S.unit.title} at ${D.short}` };

    const plotBtn = (p) => {
        const dim = S.size && p.k !== S.size, off = p.status !== 'available' || dim;
        return `<button type="button" class="plot" data-plot="${p.id}" data-s="${p.status}" ${off ? 'disabled' : ''} aria-pressed="${S.sel && S.sel.id === p.id}" aria-label="Plot ${p.id}, ${p.k} katha, ${STATUS[p.status]}${p.corner ? ', corner' : ''}${dim && p.status === 'available' ? ', hidden by size filter' : ''}" ${dim ? 'style="opacity:.3"' : ''}><span class="num">${p.n}</span><small>${p.k}K</small>${p.corner ? '<i aria-hidden="true"></i>' : ''}</button>`;
    };
    const drawExplorer = () => {
        if (isPlot) {
            set('pl-h', 'Pick your plot.');
            const ps = plotsOf(S.block), left = ps.filter(p => p.status === 'available' && (!S.size || p.k === S.size)).length;
            html('pl-avail', `<strong class="num">${left}</strong> available in Block ${S.block}${S.size ? ` · ${S.size} katha` : ''}`);
            html('pl-blocks', BLOCKS.map(b => `<button type="button" role="tab" class="chip chip--sm${b === S.block ? ' is-on' : ''}" aria-selected="${b === S.block}" data-block="${b}">Block ${b}</button>`).join(''));
            html('pl-sizes', [0, 3, 5, 10].map(z => `<button type="button" class="chip chip--sm${z === S.size ? ' is-on' : ''}" aria-pressed="${z === S.size}" data-size="${z}">${z ? z + ' katha' : 'All sizes'}</button>`).join(''));
            html('pl-map', `<div class="plotrow">${ps.slice(0, 12).map(plotBtn).join('')}</div><div class="avenue" aria-hidden="true">40 FT AVENUE</div><div class="plotrow">${ps.slice(12).map(plotBtn).join('')}</div>
                <ul class="legend"><li><i style="background:var(--ok-bg)"></i>Available</li><li><i style="background:var(--warn-bg)"></i>Reserved</li><li><i style="background:var(--sold-bg)"></i>Sold</li><li><i style="background:var(--ink)"></i>Selected</li><li><i style="background:var(--gold)"></i>Corner (+10%)</li></ul>`);
        } else {
            set('pl-eyebrow', D.kind === 'unit' && D.id === 'horizon' ? 'Floors & units' : 'Home explorer');
            set('pl-h', 'Choose your home.');
            html('pl-avail', `<strong class="num">${units.length}</strong> layout${units.length === 1 ? '' : 's'} available`);
            $('#pl-blocks').hidden = $('#pl-sizes').hidden = true;
            html('pl-map', `<div class="unitgrid">${units.map(u => `<button type="button" class="unit" data-unit="${u.id}" aria-pressed="${S.unit.id === u.id}"><img src="${img(u.imgs[0][0])}" alt="" style="object-position:${u.imgs[0][1]}" loading="lazy"><b>${esc(u.title)}</b><small>${u.size.toLocaleString('en-IN')} sqft${u.beds ? ' · ' + u.beds + ' bed' : ''} · ${u.facing}</small><strong class="num">${fmt(u.price)}</strong></button>`).join('')}</div>`);
        }
        drawSel(); drawCalc();
    };
    const drawSel = () => {
        const s = selInfo();
        const rows = isPlot
            ? [['Size', `${S.sel.k} katha · ${(S.sel.k * SQFT).toLocaleString('en-IN')} sqft`], ['Facing', S.sel.facing], ['Road', S.sel.road], ['Rate', `${fmt(S.sel.rate)} / katha`]]
            : [['Size', `${S.unit.size.toLocaleString('en-IN')} sqft`], ['Facing', S.unit.facing], ['Handover', S.unit.handover], ['Rate', `৳${Math.round(S.unit.price / S.unit.size).toLocaleString('en-IN')} / sqft`]];
        html('sel', `<div class="sel__top"><div><p class="sel__k">Selected ${isPlot ? 'plot' : 'home'}</p><p class="disp num sel__code">${esc(s.code)}</p></div><span class="tag tag--${s.status === 'available' ? 'ok' : 'warn'}">${STATUS[s.status]}${s.corner ? ' · Corner' : ''}</span></div>
            <dl>${rows.map(([k, v]) => `<div><dt>${k}</dt><dd class="num">${v}</dd></div>`).join('')}</dl>
            <div class="sel__price"><p>${isPlot ? 'Plot' : 'Home'} price</p><p class="disp num">${fmt(s.price)}</p><p class="num">Booking money ${fmt(s.price * .1)} (10%)</p></div>
            <div class="btn-row"><a href="#enquire" class="btn btn--gold" data-enq>Enquire</a><a href="#calc" class="btn btn--line">Instalments</a></div>`);
        // keep the enquiry message in step with the selection until the visitor writes their own
        const m = $('#eq-form [name=msg]');
        if (!m.dataset.dirty) m.value = `I’m interested in ${s.blurb}.`;
        $('#rs-btn').textContent = isPlot ? `Hold ${S.sel.id}` : 'Hold this home';
        if (isPlot) { const u = new URL(location.href); u.searchParams.set('plot', S.sel.id); u.searchParams.delete('unit'); history.replaceState(null, '', u); }
        else { const u = new URL(location.href); u.searchParams.set('unit', S.unit.id); history.replaceState(null, '', u); }
    };
    $('#eq-form [name=msg]').addEventListener('input', (e) => { e.target.dataset.dirty = '1'; });
    $('#pl-blocks').addEventListener('click', (e) => { const b = e.target.closest('[data-block]'); if (b) { S.block = b.dataset.block; drawExplorer(); $(`#pl-blocks [data-block=${S.block}]`).focus(); } });
    $('#pl-sizes').addEventListener('click', (e) => { const b = e.target.closest('[data-size]'); if (b) { S.size = +b.dataset.size; drawExplorer(); $(`#pl-sizes [data-size="${S.size}"]`).focus(); } });
    $('#pl-map').addEventListener('click', (e) => {
        const p = e.target.closest('[data-plot]'), u = e.target.closest('[data-unit]');
        if (p) { S.sel = ALL_PLOTS.find(x => x.id === p.dataset.plot); drawExplorer(); $(`[data-plot="${S.sel.id}"]`).focus(); }
        else if (u) { S.unit = units.find(x => x.id === u.dataset.unit); drawExplorer(); $(`[data-unit="${S.unit.id}"]`).focus(); }
    });

    /* ---------- calculator ---------- */
    const down = $('#c-down'), months = $('#c-months');
    const fill = (r) => r.style.setProperty('--p', ((r.value - r.min) / (r.max - r.min) * 100) + '%');
    $('#c-cornerwrap').hidden = true;
    const drawCalc = () => {
        const s = selInfo(), total = s.price, book = total * .1, dp = total * (+down.value / 100), bal = Math.max(total - book - dp, 0);
        set('cl-h', `${s.title}, paid your way.`); set('c-meta', s.meta);
        set('o-down', down.value + '%'); set('o-months', months.value + ' months'); fill(down); fill(months);
        set('c-monthly', fmt(bal / +months.value));
        html('c-dl', `<div><dt>Total price</dt><dd class="num">${fmt(total)}</dd></div><div><dt>Booking (10%, at signing)</dt><dd class="num">${fmt(book)}</dd></div><div><dt>Down payment (within 30 days)</dt><dd class="num">${fmt(dp)}</dd></div><div><dt>Balance over ${months.value} months</dt><dd class="num">${fmt(bal)}</dd></div>`);
    };
    down.addEventListener('input', drawCalc); months.addEventListener('input', drawCalc);

    /* ---------- master plan (zoom + hotspots) ---------- */
    if (D.masterplan) {
        const M = D.masterplan; let zoom = 1, spot = 0;
        $('#masterplan').hidden = false;
        const mi = $('#mp-img'); mi.src = img(M.img[0]); mi.alt = M.alt; mi.style.objectPosition = M.img[1];
        const stage = $('#mp-stage');
        stage.insertAdjacentHTML('beforeend', M.spots.map((s, i) => `<button type="button" class="spot pulse" data-spot="${i}" style="left:${s[0]}%;top:${s[1]}%" aria-label="${esc(s[2])}" aria-pressed="${i === 0}">${i + 1}</button>`).join(''));
        const draw = () => {
            stage.style.width = stage.style.height = zoom * 100 + '%';
            $$('.spot', stage).forEach((b, i) => b.setAttribute('aria-pressed', String(i === spot)));
            set('mp-t', M.spots[spot][2]); set('mp-d', M.spots[spot][3]);
            $('#mp-in').disabled = zoom >= 2.5; $('#mp-out').disabled = zoom <= 1;
        };
        $('#mp-in').addEventListener('click', () => { zoom = Math.min(2.5, zoom + .5); draw(); });
        $('#mp-out').addEventListener('click', () => { zoom = Math.max(1, zoom - .5); draw(); });
        stage.addEventListener('click', (e) => { const b = e.target.closest('[data-spot]'); if (b) { spot = +b.dataset.spot; draw(); } });
        draw();
    }

    /* ---------- plot layouts (Green Valley) ---------- */
    if (D.layouts) {
        let cur = 0;
        $('#layouts').hidden = false;
        const draw = () => {
            html('ly-tabs', D.layouts.map((l, i) => `<button type="button" role="tab" class="chip chip--sm${i === cur ? ' is-on' : ''}" aria-selected="${i === cur}" data-lay="${i}">${l[0]} katha</button>`).join(''));
            const [k, , home, far, typ] = D.layouts[cur], m = typ.match(/(\d+) ft × (\d+) ft/), f = +m[1], d = +m[2], w = { 3: 360, 5: 420, 10: 480 }[k] || 400;
            const left = ALL_PLOTS.filter(p => p.k === k && p.status === 'available').length;
            const draw2 = $('#ly-draw'); draw2.setAttribute('aria-label', `${k} katha plot, ${f} by ${d} feet`);
            draw2.innerHTML = `<div class="lay__plot" style="--w:${w}px;--r:${d}/${f}"><em class="f num">${d} ft</em><em class="d num">${f} ft front</em><span><b>Buildable area</b><br><span class="num">${Math.round(k * SQFT * .6).toLocaleString('en-IN')} sqft at 60%</span></span><em class="rd">${S.sel && S.sel.road ? S.sel.road : '25 ft road'} side</em></div>`;
            html('ly-dl', [['Area', `${k} katha · ${(k * SQFT).toLocaleString('en-IN')} sqft`], ['Typical home', `${home} (${typ.replace('Typical: ', '')})`], ['FAR / ground coverage', far], ['Available now', `${left} plots`]].map(([a, b]) => `<div><dt>${a}</dt><dd class="num">${b}</dd></div>`).join(''));
        };
        $('#ly-tabs').addEventListener('click', (e) => { const b = e.target.closest('[data-lay]'); if (b) { cur = +b.dataset.lay; draw(); $(`#ly-tabs [data-lay="${cur}"]`).focus(); } });
        draw();
    }

    /* ---------- gallery + lightbox ---------- */
    let gcat = 'All', glist = [], gi = 0;
    const drawGallery = () => {
        const cats = GALLERY_CATS.filter(c => c === 'All' || D.gallery.some(g => g[3] === c));
        html('gl-tabs', cats.map(c => `<button type="button" class="chip chip--sm${c === gcat ? ' is-on' : ''}" aria-pressed="${c === gcat}" data-gcat="${c}">${c}</button>`).join(''));
        glist = D.gallery.filter(g => gcat === 'All' || g[3] === gcat);
        html('gal', glist.map((g, i) => `<button type="button" class="zoom" data-g="${i}" aria-label="Open photo: ${esc(g[2])}"><img src="${img(g[0])}" alt="${esc(g[2])}" style="object-position:${g[1]}" loading="lazy"><span>${g[3]}</span></button>`).join(''));
    };
    $('#gl-tabs').addEventListener('click', (e) => { const b = e.target.closest('[data-gcat]'); if (b) { gcat = b.dataset.gcat; drawGallery(); $(`#gl-tabs [data-gcat="${gcat}"]`).focus(); } });
    const lbDraw = () => { const g = glist[gi], i = $('#lb-img'); i.src = img(g[0]); i.alt = g[2]; i.style.objectPosition = g[1]; set('lb-cap', `${gi + 1} / ${glist.length} · ${g[2]}`); };
    function lbStep(d) { gi = (gi + d + glist.length) % glist.length; lbDraw(); }
    $('#gal').addEventListener('click', (e) => { const b = e.target.closest('[data-g]'); if (!b) return; gi = +b.dataset.g; lbDraw(); openDialog($('#lb'), b); });
    $('#lb-prev').addEventListener('click', () => lbStep(-1)); $('#lb-next').addEventListener('click', () => lbStep(1));
    const dr = $('#dr-img'); dr.src = img(D.hero[0]); dr.alt = `Drone film still over ${D.short}`; dr.style.objectPosition = D.hero[1];

    /* ---------- progress, location, documents, plans, why, FAQ ---------- */
    set('pg-pct', D.progress + '%'); set('pg-note', D.progressNote);
    const bar = $('#pg-bar'); bar.setAttribute('aria-valuenow', D.progress); bar.setAttribute('aria-label', 'Construction progress');
    new IntersectionObserver((en, ob) => { if (en[0].isIntersecting) { $('i', bar).style.width = D.progress + '%'; ob.disconnect(); } }, { threshold: .4 }).observe(bar);
    $('i', bar).style.width = '0%';
    html('pg-tl', D.timeline.map(t => `<li><div><p class="k">${t[0]}</p><p class="disp">${t[1]}</p><p class="d">${t[2]}</p></div>${t[3] ? `<img src="${img(t[3][0])}" alt="${esc(t[1])}" style="object-position:${t[3][1]}" loading="lazy">` : ''}</li>`).join(''));
    set('lc-road', D.roadLbl); set('lc-pin', D.short);
    $('#lc-dir').href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(`${D.name} ${D.loc}`);
    html('lc-near', D.nearby.map(n => `<li><span><span>${n[0]}</span><small>${n[1]}</small></span><span class="num"><strong>${n[2]}</strong><small>${n[3]}</small></span></li>`).join(''));
    html('dc-list', D.docs.map(d => `<li><span><span>${d[0]}</span><small>✓ ${d[1]}</small></span><a href="coming-soon.html?page=${encodeURIComponent(d[0])}" aria-label="View ${esc(d[0])}">View</a></li>`).join(''));
    html('pp-plans', PLANS.map((p, i) => `<article class="${i === 1 ? 'is-hot' : ''}"><p class="k">${p[0]}</p><p class="disp">${p[1]}</p><p class="d">${p[2]}</p></article>`).join(''));
    set('wb-h', D.why[0]); html('wb-list', D.why[1].map(w => `<li><span>→</span>${esc(w)}</li>`).join(''));
    set('wb-q', D.quote[0]); set('wb-by', D.quote[1]);
    html('fq-list', D.faq.map((f, i) => `<details name="pfaq"${i === 0 ? ' open' : ''}><summary>${f[0]}<span class="plus" aria-hidden="true">+</span></summary><p>${f[1]}</p></details>`).join(''));

    /* ---------- enquiry, hold form, brochure (shared validation) ---------- */
    const PHONE = /^(?:\+?88)?01[3-9]\d{8}$/;
    const check = (form, err) => {
        const n = form.elements.name, p = form.elements.phone; let msg = '';
        [n, p].forEach(x => x.removeAttribute('aria-invalid'));
        if (n.value.trim().length < 2) { msg = 'Please enter your name.'; n.setAttribute('aria-invalid', 'true'); n.focus(); }
        else if (!PHONE.test(p.value.replace(/[\s-]/g, ''))) { msg = 'Enter a valid mobile number, e.g. 01712-345678.'; p.setAttribute('aria-invalid', 'true'); p.focus(); }
        $('#' + err).textContent = msg; return !msg;
    };
    const total = D.sold[1], sold = D.sold[0], left = total - sold;
    $('#eq-bar').style.width = Math.round(sold / total * 100) + '%';
    set('eq-n', sold ? `${sold} of ${total} sold · ${left} left` : 'Pre-launch · register your interest');
    set('rs-n', D.deal);
    $('#eq-form').addEventListener('submit', (e) => { e.preventDefault(); if (!check(e.target, 'eq-err')) return; e.target.hidden = true; const ok = $('#eq-ok'); ok.hidden = false; ok.textContent = `Thank you — we’ll call you about ${selInfo().blurb} within 2 hours.`; });
    $('#rs-form').addEventListener('submit', (e) => { e.preventDefault(); if (!check(e.target, 'rs-err')) return; e.target.hidden = true; const ok = $('#rs-ok'); ok.hidden = false; ok.textContent = `Thanks — ${selInfo().blurb} is on hold for 72 hours. We’ll call you shortly.`; });
    set('br-h', `Get the ${D.short} brochure`);
    $$('[data-brochure]').forEach(b => b.addEventListener('click', () => openDialog($('#brochure'), b)));
    $('#br-form').addEventListener('submit', (e) => { e.preventDefault(); if (!check(e.target, 'br-err')) return; e.target.reset(); closeDialog(); toast('Brochure on its way to your WhatsApp.'); });
    $('.sel', document).addEventListener('click', (e) => { if (e.target.closest('[data-enq]')) setTimeout(() => $('#eq-form [name=name]').focus({ preventScroll: true }), 400); });

    /* ---------- related projects + mobile bar ---------- */
    html('ym', Object.values(DETAILS).filter(x => x.id !== D.id).slice(0, 3).map(x => `<a href="property.html?id=${x.id}" class="lift"><span class="zoom"><img src="${img(x.hero[0])}" alt="${esc(x.name)}" style="object-position:${x.hero[1]}" loading="lazy"></span><span class="t"><span class="disp">${x.name}</span><small>${x.area} · ${x.tags[2]}</small><span class="num">From ${x.from}</span></span></a>`).join(''));
    set('pb-from', D.from);

    /* ---------- sticky in-page nav with scroll-spy ---------- */
    const TABS = [['overview', 'Overview'], ['plots', isPlot ? 'Plots' : 'Homes'], ['calc', 'Calculator'], ['masterplan', 'Master plan'], ['layouts', 'Layouts'], ['gallery', 'Gallery'], ['progress', 'Progress'], ['location', 'Location'], ['documents', 'Documents'], ['payment', 'Payment'], ['faq', 'FAQ']].filter(([id]) => !$('#' + id).hidden);
    html('subnav', TABS.map(([id, l]) => `<a href="#${id}" data-tab="${id}">${l}</a>`).join(''));
    const mark = (id) => $$('#subnav a').forEach(a => { const on = a.dataset.tab === id; a.setAttribute('aria-current', String(on)); if (on) { const box = a.parentElement, l = a.offsetLeft - 20; if (box.scrollWidth > box.clientWidth) box.scrollTo({ left: l, behavior: 'smooth' }); } });
    const secs = TABS.map(([id]) => $('#' + id));
    const spy = new IntersectionObserver((en) => { en.forEach(x => { if (x.isIntersecting) mark(x.target.id); }); }, { rootMargin: '-30% 0px -60% 0px' });
    secs.forEach(s => spy.observe(s)); mark('overview');

    drawGallery(); drawExplorer();
})();
