/* Goldeneye — glue between the static-prototype scripts and the Next.js / Payload app:
   real /en /bn language switch, account state in the header, wishlist sync for signed-in customers. */
(() => {
    'use strict';
    const B = window.GD_BASE || '/en';
    const LOC = window.GD_LOCALE || 'en';
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];

    /* ---------- language: real locale routes ---------- */
    document.documentElement.lang = LOC;
    try { localStorage.setItem('gd-lang', JSON.stringify(LOC)); } catch (e) { /* private mode */ }
    $$('.lang button').forEach((b) => {
        b.setAttribute('aria-pressed', String(b.dataset.lang === LOC));
        b.addEventListener('click', () => {
            if (b.dataset.lang === LOC) return;
            const rest = location.pathname.replace(/^\/(en|bn)(?=\/|$)/, '');
            location.assign('/' + b.dataset.lang + rest + location.search + location.hash);
        });
    });

    /* ---------- lead intake (site visit, callback, reserve, brochure, newsletter) -> /api/lead ---------- */
    const qs = new URLSearchParams(location.search);
    const utm = { source: qs.get('utm_source') || '', medium: qs.get('utm_medium') || '', campaign: qs.get('utm_campaign') || '', page: location.pathname };
    window.GD_LEAD = (lead) => fetch('/api/lead', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...lead, utm }) })
        .then((r) => r.json().catch(() => ({}))).catch(() => ({}));

    /* ---------- account state ---------- */
    const api = (path, opts = {}) => fetch('/api' + path, { credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, ...opts });
    window.GD_API = api;
    const link = $('#acct-link');
    let me = null;
    const syncWish = async () => {
        if (!me) return;
        const server = Array.isArray(me.savedHomes) ? me.savedHomes : [];
        const local = JSON.parse(localStorage.getItem('gd-wish') || '[]');
        const merged = [...new Set([...server, ...local])];
        if (merged.length !== local.length) { localStorage.setItem('gd-wish', JSON.stringify(merged)); dispatchEvent(new Event('gd:wish')); }
        if (merged.length !== server.length) await api('/customers/' + me.id, { method: 'PATCH', body: JSON.stringify({ savedHomes: merged }) });
    };
    api('/customers/me').then((r) => (r.ok ? r.json() : null)).then((j) => {
        me = j && j.user;
        window.GD_ME = me;
        if (link) {
            link.href = me ? B + '/account' : B + '/login?next=' + encodeURIComponent(location.pathname + location.search);
            link.setAttribute('aria-label', me ? 'My account' : 'Sign in');
            link.classList.toggle('is-in', !!me);
            if (me) link.dataset.ini = (me.name || me.email || '?').trim().charAt(0).toUpperCase();
        }
        syncWish();
    }).catch(() => {});
    let t;
    addEventListener('gd:wish', () => {
        if (!me) return;
        clearTimeout(t);
        t = setTimeout(() => api('/customers/' + me.id, { method: 'PATCH', body: JSON.stringify({ savedHomes: JSON.parse(localStorage.getItem('gd-wish') || '[]') }) }), 600);
    });
})();
