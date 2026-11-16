/* Goldeneye v2 — home page sections. Needs data.js and main.js (window.GD). */
(() => {
    'use strict';
    const { $, $$, store, wish } = window.GD;
    const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const fmt = (n) => {
        if (n >= 1e7) return '৳' + (n / 1e7).toFixed(2).replace(/\.?0+$/, '') + ' Crore';
        if (n >= 1e5) return '৳' + (n / 1e5).toFixed(1).replace(/\.0$/, '') + ' Lakh';
        return '৳' + Math.round(n).toLocaleString('en-IN');
    };
    const ARROW = '<svg class="arr" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
    const PIN = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>';
    const HEART = '<svg width="18" height="18" viewBox="0 0 24 24" stroke="#0D1330" stroke-width="2" aria-hidden="true"><path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/></svg>';

    /* ---------- flagship projects: filter + rail + wishlist ---------- */
    const filters = $('#proj-filters'), track = $('#proj-track'), count = $('#proj-count'), prev = $('#proj-prev'), next = $('#proj-next');
    let filter = 'all';
    const drawFilters = () => {
        filters.innerHTML = PROJECT_FILTERS.map(([k, label]) => {
            const n = k === 'all' ? PROJECTS.length : PROJECTS.filter(p => p.key === k).length;
            return `<button type="button" class="chip${k === filter ? ' is-on' : ''}" aria-pressed="${k === filter}" data-k="${k}">${label} <span>${n}</span></button>`;
        }).join('');
    };
    const drawCards = () => {
        const list = filter === 'all' ? PROJECTS : PROJECTS.filter(p => p.key === filter);
        const saved = wish.list();
        track.innerHTML = list.map(p => {
            const on = saved.includes('p:' + p.id);
            return `<article class="pcard lift">
                <div class="pcard__img zoom">
                    <a href="${p.href}" tabindex="-1" aria-hidden="true"><img src="${p.img}" alt="${esc(p.alt)}" style="object-position:${p.pos}" loading="lazy"></a>
                    <span class="pcard__tags"><span class="tag tag--${p.badgeCls}">${p.badge}</span><span class="tag tag--glass">${p.type}</span></span>
                    <button type="button" class="pcard__heart" data-wish="p:${p.id}" aria-pressed="${on}" aria-label="Save ${esc(p.name)} to wishlist"><span class="${on ? 'is-on' : ''}">${HEART}</span></button>
                </div>
                <div class="pcard__body">
                    <div><h3 class="disp"><a href="${p.href}">${p.name}</a></h3><p class="pcard__loc">${PIN}${p.loc}</p></div>
                    <p class="pcard__specs">${p.specs.map(s => `<span>${s}</span>`).join('')}</p>
                    <div><div class="pcard__prog"><span>${p.progLabel}</span><b class="num">${p.prog}%</b></div><div class="bar-track"><div style="width:${p.prog}%"></div></div></div>
                    <div class="pcard__foot"><div><span>Starting from</span><b class="disp num">${p.price}</b></div><a href="${p.href}" class="btn btn--ink btn--sm" aria-label="View ${esc(p.name)}">View${ARROW}</a></div>
                </div>
            </article>`;
        }).join('');
        track.scrollTo({ left: 0 });
        count.textContent = `Showing ${list.length} of ${PROJECTS.length} projects`;
        railState();
    };
    const railState = () => {
        const max = track.scrollWidth - track.clientWidth - 2;
        prev.disabled = track.scrollLeft <= 2;
        next.disabled = track.scrollLeft >= max;
        $('.rail__btns').hidden = max <= 0;
    };
    const step = () => (track.firstElementChild?.offsetWidth || 400) + 24;
    prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    track.addEventListener('scroll', railState, { passive: true });
    addEventListener('resize', railState);
    track.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); next.click(); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); prev.click(); }
    });
    track.addEventListener('click', (e) => {
        const b = e.target.closest('[data-wish]');
        if (!b) return;
        const on = wish.toggle(b.dataset.wish);
        b.setAttribute('aria-pressed', String(on));
        b.firstElementChild.classList.toggle('is-on', on);
    });
    filters.addEventListener('click', (e) => {
        const b = e.target.closest('[data-k]');
        if (!b) return;
        filter = b.dataset.k; drawFilters(); drawCards();
    });
    drawFilters(); drawCards();

    /* ---------- stats count-up (runs when scrolled into view) ---------- */
    const counters = $$('[data-count]');
    const runCount = (el) => {
        const to = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), sep = el.dataset.sep;
        const out = (v) => sep ? Math.round(v).toLocaleString('en-IN') : v.toFixed(dec);
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = out(to); return; }
        const t0 = performance.now();
        const tick = (t) => {
            const x = Math.min(1, (t - t0) / 1600), e = 1 - Math.pow(1 - x, 4);
            el.textContent = out(to * e);
            if (x < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((es) => es.forEach(en => { if (en.isIntersecting) { runCount(en.target); io.unobserve(en.target); } }), { threshold: .6 });
        counters.forEach(c => io.observe(c));
    }

    /* ---------- master plan hotspots ---------- */
    const spotsEl = $('#mp-spots'), card = $('#mp-card');
    let spot = 0;
    const drawSpots = () => {
        spotsEl.innerHTML = MP_SPOTS.map((s, i) => `<button type="button" class="mp__spot pulse${i === spot ? ' is-on' : ''}" style="left:${s.x}%;top:${s.y}%" aria-label="${esc(s.tag)}: ${esc(s.label)}" aria-pressed="${i === spot}" data-i="${i}">${s.n}</button>`).join('');
        const s = MP_SPOTS[spot];
        card.innerHTML = `<p>${s.tag}</p><h3 class="disp">${s.label}</h3><span>${s.text}</span>`;
    };
    spotsEl.addEventListener('click', (e) => { const b = e.target.closest('[data-i]'); if (!b) return; spot = +b.dataset.i; drawSpots(); $(`[data-i="${spot}"]`, spotsEl).focus(); });
    drawSpots();

    /* ---------- construction tracker ---------- */
    const tabs = $('#trk-tabs'), panel = $('#trk-panel'), photos = $('#trk-photos');
    let trk = 0;
    const R = 52, C = 2 * Math.PI * R;
    const drawTrk = () => {
        tabs.innerHTML = TRACKER.map((t, i) => `<button type="button" role="tab" class="seg__btn${i === trk ? ' is-on' : ''}" aria-selected="${i === trk}" tabindex="${i === trk ? 0 : -1}" data-i="${i}">${t.label}</button>`).join('');
        const T = TRACKER[trk];
        panel.innerHTML = `
            <div class="trk__top">
                <div class="ring"><svg width="160" height="160" viewBox="0 0 120 120" role="img" aria-label="${T.pct} percent complete"><circle cx="60" cy="60" r="${R}" fill="none" stroke="#EEEAE1" stroke-width="8"/><circle class="ring__arc" cx="60" cy="60" r="${R}" fill="none" stroke="#C9A35C" stroke-width="8" stroke-linecap="round" stroke-dasharray="0 ${C.toFixed(1)}" transform="rotate(-90 60 60)"/></svg><span><b class="disp num">${T.pct}%</b><small>complete</small></span></div>
                <div class="trk__info"><h3 class="disp">${T.name}</h3><p>${T.loc}</p><span class="note"><i></i>${T.note}</span></div>
            </div>
            <ol class="stages">${TRACKER_STAGES.map((s, i) => `<li class="${i < T.stage ? 'done' : i === T.stage ? 'now' : ''}"><span class="stages__bar"></span><b>${s}</b><small>${i < T.stage ? 'Done · ' : i === T.stage ? 'Now · ' : 'Target · '}${T.dates[i]}</small></li>`).join('')}</ol>
            <p class="fine">Site engineer’s report and test certificates are emailed to buyers on the 1st of every month.</p>`;
        panel.setAttribute('aria-label', T.name + ' progress');
        photos.innerHTML = T.photos.map(p => `<figure class="ph lift"><img src="${p.img}" alt="${esc(p.title)}" style="object-position:${p.pos}" loading="lazy"><figcaption><small>${p.date}</small><b>${p.title}</b></figcaption></figure>`).join('');
        requestAnimationFrame(() => requestAnimationFrame(() => { const a = $('.ring__arc', panel); if (a) a.setAttribute('stroke-dasharray', `${(C * T.pct / 100).toFixed(1)} ${C.toFixed(1)}`); }));
    };
    tabs.addEventListener('click', (e) => { const b = e.target.closest('[data-i]'); if (!b) return; trk = +b.dataset.i; drawTrk(); });
    tabs.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault(); trk = (trk + (e.key === 'ArrowRight' ? 1 : TRACKER.length - 1)) % TRACKER.length; drawTrk(); $(`[data-i="${trk}"]`, tabs).focus();
    });
    drawTrk();

    /* ---------- EMI calculator ---------- */
    const el = { price: $('#emi-price'), down: $('#emi-down'), yrs: $('#emi-yrs'), rate: $('#emi-rate') };
    const calc = () => {
        const price = +el.price.value, down = +el.down.value, yrs = +el.yrs.value, rate = +el.rate.value;
        const loan = price * (1 - down / 100), r = rate / 1200, n = yrs * 12;
        const m = loan * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1), tot = m * n;
        $('#o-price').textContent = fmt(price);
        $('#o-down').textContent = `${down}% · ${fmt(price * down / 100)}`;
        $('#o-yrs').textContent = `${yrs} yrs`;
        $('#o-rate').textContent = `${rate}%`;
        $('#o-emi').textContent = '৳' + Math.round(m).toLocaleString('en-IN');
        $('#o-loan').textContent = fmt(loan);
        $('#o-int').textContent = fmt(tot - loan);
        $('#o-tot').textContent = fmt(tot);
        $('#o-bar').style.width = Math.round(loan / tot * 100) + '%';
        Object.values(el).forEach(i => { i.style.setProperty('--p', ((i.value - i.min) / (i.max - i.min) * 100) + '%'); });
    };
    Object.values(el).forEach(i => i.addEventListener('input', calc));
    calc();

    /* ---------- testimonials ---------- */
    const quote = $('#tm-quote'), tlist = $('#tm-list');
    let tq = 0;
    const drawTm = () => {
        const t = TESTIMONIALS[tq];
        quote.innerHTML = `<svg width="56" height="44" viewBox="0 0 56 44" aria-hidden="true"><path d="M0 44V26C0 11 8 2 22 0l2 6c-8 2-12 8-12 16h10v22zm32 0V26c0-15 8-24 22-26l2 6c-8 2-12 8-12 16h10v22z" fill="#C9A35C"/></svg>
            <blockquote class="disp">“${esc(t.quote)}”</blockquote>
            <figcaption><span class="tm__ini disp">${t.ini}</span><span><b>${t.name}</b><small>${t.meta}</small></span></figcaption>`;
        tlist.innerHTML = TESTIMONIALS.map((x, i) => `<button type="button" role="tab" class="tm__tab${i === tq ? ' is-on' : ''}" aria-selected="${i === tq}" tabindex="${i === tq ? 0 : -1}" data-i="${i}"><span class="tm__dot">${x.ini}</span><span><b>${x.name}</b><small>${x.meta}</small></span></button>`).join('');
    };
    tlist.addEventListener('click', (e) => { const b = e.target.closest('[data-i]'); if (!b) return; tq = +b.dataset.i; drawTm(); });
    tlist.addEventListener('keydown', (e) => {
        const k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
        if (!k) return;
        e.preventDefault(); tq = (tq + k + TESTIMONIALS.length) % TESTIMONIALS.length; drawTm(); $(`[data-i="${tq}"]`, tlist).focus();
    });
    drawTm();

    /* ---------- site-visit form ---------- */
    const form = $('#visit-form'), done = $('#visit-done');
    const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    // next six working days from tomorrow (Friday is the weekend)
    const days = [];
    for (let d = new Date(), i = 0; days.length < 6 && i < 14; i++) {
        d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
        if (d.getDay() !== 5) days.push(d);
    }
    const state = { type: 0, day: 0, slot: 2 };
    const drawPickers = () => {
        $('#v-type').innerHTML = VISIT_TYPES.map(([l, s], i) => `<button type="button" class="vt${i === state.type ? ' is-on' : ''}" aria-pressed="${i === state.type}" data-t="${i}"><b>${l}</b><small>${s}</small></button>`).join('');
        $('#v-days').innerHTML = days.map((d, i) => `<button type="button" class="day${i === state.day ? ' is-on' : ''}" aria-pressed="${i === state.day}" data-d="${i}" aria-label="${DOW[d.getDay()]} ${d.getDate()} ${MON[d.getMonth()]}"><small>${DOW[d.getDay()]}</small><b class="disp num">${d.getDate()}</b><small>${MON[d.getMonth()]}</small></button>`).join('');
        $('#v-slots').innerHTML = VISIT_SLOTS.map((s, i) => `<button type="button" class="slot${i === state.slot ? ' is-on' : ''}" aria-pressed="${i === state.slot}" data-s="${i}">${s}</button>`).join('');
    };
    form.addEventListener('click', (e) => {
        const t = e.target.closest('[data-t],[data-d],[data-s]');
        if (!t) return;
        if (t.dataset.t) state.type = +t.dataset.t;
        if (t.dataset.d) state.day = +t.dataset.d;
        if (t.dataset.s) state.slot = +t.dataset.s;
        drawPickers();
    });
    drawPickers();

    const rules = {
        name: (v) => v.trim().length < 2 ? 'Please enter your full name.' : '',
        phone: (v) => /^(\+?88)?01[3-9]\d{8}$/.test(v.replace(/[\s-]/g, '')) ? '' : 'Enter a valid Bangladeshi mobile, e.g. 01712-345678.',
        email: (v) => v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'That email address looks incomplete.' : '',
        consent: () => form.consent.checked ? '' : 'Please agree so we can confirm your visit.'
    };
    const setErr = (k, msg) => {
        const input = form.elements[k], out = $(`#v-${k}-e`);
        out.textContent = msg;
        input.setAttribute('aria-invalid', String(!!msg));
        if (k !== 'consent') input.classList.toggle('is-bad', !!msg);
    };
    ['name', 'phone', 'email'].forEach(k => {
        form.elements[k].addEventListener('blur', () => { if (form.elements[k].value || k !== 'email') setErr(k, rules[k](form.elements[k].value)); });
        form.elements[k].addEventListener('input', () => { if (form.elements[k].classList.contains('is-bad')) setErr(k, rules[k](form.elements[k].value)); });
    });
    form.consent.addEventListener('change', () => setErr('consent', rules.consent()));
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const bad = Object.keys(rules).filter(k => { const m = rules[k](k === 'consent' ? '' : form.elements[k].value); setErr(k, m); return m; });
        if (bad.length) { form.elements[bad[0]].focus(); return; }
        const d = days[state.day];
        $('#done-title').textContent = `Visit requested, ${form.name.value.trim().split(/\s+/)[0]}.`;
        $('#done-text').textContent = `Your relationship manager will call ${form.phone.value.trim()} within 2 hours to confirm ${DOW[d.getDay()]} ${d.getDate()} ${MON[d.getMonth()]}, ${VISIT_SLOTS[state.slot]}. A WhatsApp confirmation follows.`;
        form.hidden = true; done.hidden = false; done.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        $('#visit-reset').focus({ preventScroll: true });
    });
    $('#visit-reset').addEventListener('click', () => {
        form.reset(); Object.assign(state, { type: 0, day: 0, slot: 2 }); drawPickers();
        ['name', 'phone', 'email', 'consent'].forEach(k => setErr(k, ''));
        done.hidden = true; form.hidden = false; form.elements.name.focus();
    });
})();
