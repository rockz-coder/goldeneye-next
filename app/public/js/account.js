/* Customer login / register / account pages (Payload `customers` auth over REST). */
(() => {
    'use strict';
    const B = window.GD_BASE || '/en';
    const $ = (s, r = document) => r.querySelector(s);
    const api = (path, opts = {}) => fetch('/api' + path, { credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, ...opts });
    const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const next = () => { const n = new URLSearchParams(location.search).get('next'); return n && n.startsWith('/') && !n.startsWith('//') ? n : B + '/account'; };
    const errMsg = async (r) => {
        try { const j = await r.json(); return (j.errors && j.errors[0] && (j.errors[0].data?.errors?.[0]?.message || j.errors[0].message)) || 'Something went wrong'; }
        catch { return 'Something went wrong'; }
    };
    const show = (form, msg) => { const e = $('.auth__err', form); e.textContent = msg; e.hidden = !msg; };
    const busy = (form, on) => { const b = $('button[type=submit]', form); b.disabled = on; b.dataset.t = b.dataset.t || b.textContent; b.textContent = on ? 'Please wait…' : b.dataset.t; };

    const login = $('#auth-login');
    if (login) login.addEventListener('submit', async (e) => {
        e.preventDefault(); show(login, ''); busy(login, true);
        const r = await api('/customers/login', { method: 'POST', body: JSON.stringify({ email: login.email.value.trim(), password: login.password.value }) });
        if (r.ok) location.assign(next()); else { busy(login, false); show(login, r.status === 401 ? 'Email or password is incorrect.' : await errMsg(r)); }
    });

    const reg = $('#auth-register');
    if (reg) reg.addEventListener('submit', async (e) => {
        e.preventDefault(); show(reg, '');
        const phone = reg.phone.value.trim();
        if (phone && !/^(?:\+?88)?01[3-9]\d{8}$/.test(phone)) return show(reg, 'Enter a valid Bangladeshi mobile number, e.g. 01712345678.');
        if (reg.password.value.length < 8) return show(reg, 'Use at least 8 characters for the password.');
        if (reg.password.value !== reg.confirm.value) return show(reg, 'Passwords do not match.');
        busy(reg, true);
        const body = { name: reg.name.value.trim(), email: reg.email.value.trim(), password: reg.password.value, phone: phone || undefined, isNRB: reg.nrb.checked, preferredLanguage: window.GD_LOCALE || 'en', savedHomes: JSON.parse(localStorage.getItem('gd-wish') || '[]') };
        const r = await api('/customers', { method: 'POST', body: JSON.stringify(body) });
        if (!r.ok) { busy(reg, false); return show(reg, await errMsg(r)); }
        const l = await api('/customers/login', { method: 'POST', body: JSON.stringify({ email: body.email, password: body.password }) });
        if (l.ok) location.assign(next()); else location.assign(B + '/login');
    });

    const acct = $('#account');
    if (acct) (async () => {
        const r = await api('/customers/me');
        const me = r.ok ? (await r.json()).user : null;
        if (!me) return location.replace(B + '/login?next=' + encodeURIComponent(B + '/account'));
        $('#acct-name').textContent = me.name || me.email;
        $('#acct-email').textContent = me.email + (me.phone ? ' · ' + me.phone : '');
        $('#acct-loading').hidden = true; $('#acct-body').hidden = false;
        $('#acct-logout').addEventListener('click', async () => { await api('/customers/logout', { method: 'POST' }); localStorage.removeItem('gd-wish'); location.assign(B); });

        const lj = await (await api('/leads?depth=1&limit=20&sort=-createdAt&where[customer][equals]=' + me.id)).json();
        const eh = $('#acct-enq');
        const LBL = { enquiry: 'Enquiry', visit: 'Site visit', reserve: '72-hour hold', callback: 'Callback request', newsletter: 'Newsletter' };
        eh.innerHTML = (lj.docs || []).length ? lj.docs.map((l) => `<li><b>${esc(LBL[l.type] || l.type)}</b>${l.project ? ' · ' + esc(l.project.name) : ''}<small>${new Date(l.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · ${esc(l.status)}</small></li>`).join('') : '<li class="auth__muted">No enquiries yet.</li>';

        const saved = Array.isArray(me.savedHomes) ? me.savedHomes : [];
        const unitIds = saved.filter((s) => s.startsWith('u:')).map((s) => s.slice(2));
        const projIds = saved.filter((s) => s.startsWith('p:')).map((s) => s.slice(2));
        const list = $('#acct-saved'), cards = [];
        if (unitIds.length) {
            const j = await (await api('/listings?depth=2&limit=50&where[id][in]=' + unitIds.join(','))).json();
            (j.docs || []).forEach((l) => cards.push(`<a class="acard" href="${B}/property?id=${esc(l.project?.slug)}&unit=${l.id}"><span class="zoom"><img src="${esc(l.images?.[0]?.image?.sizes?.card?.url || l.images?.[0]?.image?.url || '')}" alt="" loading="lazy"></span><b>${esc(l.title)}</b><small>${esc(l.project?.name || '')}</small></a>`));
        }
        if (projIds.length) {
            const j = await (await api('/projects?depth=1&limit=20&where[slug][in]=' + projIds.join(','))).json();
            (j.docs || []).forEach((p) => cards.push(`<a class="acard" href="${B}/property?id=${esc(p.slug)}"><span class="zoom"><img src="${esc(p.heroImage?.sizes?.card?.url || p.heroImage?.url || '')}" alt="" loading="lazy"></span><b>${esc(p.name)}</b><small>${esc(p.location)}</small></a>`));
        }
        list.innerHTML = cards.length ? cards.join('') : `<p class="auth__muted">No saved homes yet. Tap the heart on any home to keep it here.</p>`;
    })();
})();
