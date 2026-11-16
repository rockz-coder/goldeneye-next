/* Goldeneye v2 — shared behaviour: header, mobile menu, wishlist count, home hero search. */
(() => {
    'use strict';
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];
    const store = {
        get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
        set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } }
    };

    /* ---------- header: solid after scroll ---------- */
    const header = $('#site-header');
    if (header) {
        const onScroll = () => { const on = header.classList.contains('is-scrolled'); if (!on && scrollY > 80) header.classList.add('is-scrolled'); else if (on && scrollY < 10) header.classList.remove('is-scrolled'); };
        onScroll();
        addEventListener('scroll', onScroll, { passive: true });
    }

    /* ---------- projects mega menu ---------- */
    const megaBtn = $('#mega-btn'), mega = $('#mega');
    const setMega = (open, returnFocus) => {
        if (!megaBtn || !mega) return;
        megaBtn.setAttribute('aria-expanded', String(open));
        mega.hidden = !open;
        header.classList.toggle('mega-open', open);
        if (!open && returnFocus) megaBtn.focus();
    };
    if (megaBtn && mega) {
        megaBtn.addEventListener('click', () => setMega(mega.hidden));
        document.addEventListener('click', (e) => { if (!mega.hidden && !header.contains(e.target)) setMega(false); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !mega.hidden) setMega(false, true); });
        mega.addEventListener('focusout', (e) => { if (!mega.hidden && e.relatedTarget && !header.contains(e.relatedTarget)) setMega(false); });
        addEventListener('scroll', () => { if (!mega.hidden && scrollY > 240) setMega(false); }, { passive: true });
    }

    /* ---------- mobile menu (dialog: focus trap, Esc, scroll lock) ---------- */
    const menu = $('#menu'), openBtn = $('#menu-open'), closeBtn = $('#menu-close');
    if (menu && openBtn && closeBtn) {
        const focusables = () => $$('a[href], button', menu).filter(el => !el.disabled);
        const setMenu = (open) => {
            menu.hidden = !open;
            openBtn.setAttribute('aria-expanded', String(open));
            document.body.classList.toggle('no-scroll', open);
            (open ? closeBtn : openBtn).focus();
        };
        openBtn.addEventListener('click', () => setMenu(true));
        closeBtn.addEventListener('click', () => setMenu(false));
        $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
        document.addEventListener('keydown', (e) => {
            if (menu.hidden) return;
            if (e.key === 'Escape') setMenu(false);
            if (e.key === 'Tab') {
                const f = focusables(), first = f[0], last = f[f.length - 1];
                if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
                else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
            }
        });
        matchMedia('(min-width: 1101px)').addEventListener('change', (m) => { if (m.matches && !menu.hidden) setMenu(false); });
    }

    /* ---------- wishlist (shared by every page via localStorage) ---------- */
    const wish = {
        list: () => store.get('gd-wish', []),
        toggle(id) {
            const l = wish.list(), on = !l.includes(id);
            store.set('gd-wish', on ? [...l, id] : l.filter(x => x !== id));
            dispatchEvent(new Event('gd:wish'));
            return on;
        }
    };
    const wishCount = $('#wish-count'), wishLink = $('#wish-link');
    const renderWish = () => {
        if (!wishCount) return;
        const n = wish.list().length;
        wishCount.textContent = n;
        wishCount.hidden = n === 0;
        wishLink.setAttribute('aria-label', n ? `Saved homes, ${n} saved` : 'Saved homes');
    };
    renderWish();
    addEventListener('storage', renderWish);
    addEventListener('gd:wish', renderWish);
    window.GD = { $, $$, store, wish };

    /* ---------- reveal on scroll ---------- */
    const reveals = $$('[data-reveal]');
    if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const io = new IntersectionObserver((es) => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
        reveals.forEach((r, i) => { r.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(r); });
    } else reveals.forEach(r => r.classList.add('in'));

    /* ---------- back to top ---------- */
    const toTop = $('#to-top');
    if (toTop) {
        addEventListener('scroll', () => { toTop.hidden = scrollY < 700; }, { passive: true });
        toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
    }

    /* ---------- newsletter ---------- */
    const nl = $('#newsletter');
    if (nl) nl.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = $('#newsletter-email'), msg = $('#newsletter-msg');
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
        msg.textContent = ok ? 'Thanks — you’re on the list.' : 'Please enter a valid email address.';
        msg.className = 'newsletter-msg ' + (ok ? 'is-ok' : 'is-bad');
        input.setAttribute('aria-invalid', String(!ok));
        if (ok) { window.GD_LEAD && window.GD_LEAD({ type: 'newsletter', email: input.value.trim() }); input.value = ''; } else input.focus();
    });

    /* ---------- language toggle (UI state only; copy translation is a later phase) ---------- */
    const savedLang = store.get('gd-lang', 'en');
    const applyLang = (l) => {
        document.documentElement.lang = l;
        $$('.lang button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === l)));
    };
    applyLang(savedLang);
    $$('.lang button').forEach(b => b.addEventListener('click', () => { store.set('gd-lang', b.dataset.lang); applyLang(b.dataset.lang); }));

    /* ---------- hero: live progress bar ---------- */
    $$('.live__fill').forEach(el => requestAnimationFrame(() => { el.style.width = el.dataset.fill + '%'; }));

    /* ---------- hero: property finder ---------- */
    const tabs = $('#finder-tabs'), form = $('#finder-form');
    if (tabs && form) {
        // project lists come from the CMS (window.__GD.PROJECTS); fall back to the prototype names
        const byType = (types, fb) => {
            const P = window.__GD && window.__GD.PROJECTS;
            const l = P ? P.filter(p => types.includes(p.type)).map(p => p.short || p.name.replace(/^Goldeneye\s+/, '')) : [];
            return l.length ? l : fb;
        };
        const CATS = [
            { key: 'Apartment', plural: 'apartments', sizeLabel: 'Size', sizes: [['', 'Any size'], ['1000-1500', '1,000 – 1,500 sqft'], ['1500-2200', '1,500 – 2,200 sqft'], ['2200+', '2,200+ sqft']], projects: byType(['Apartment', 'Duplex'], ['Heights', 'Riviera', 'Orchid']) },
            { key: 'Plot', plural: 'plots', sizeLabel: 'Plot size', sizes: [['', 'Any katha'], ['3', '3 katha'], ['5', '5 katha'], ['10', '10 katha']], projects: byType(['Plot'], ['Green Valley']) },
            { key: 'Commercial', plural: 'commercial spaces', sizeLabel: 'Floor area', sizes: [['', 'Any area'], ['0-3000', 'Up to 3,000 sqft'], ['3000-6000', '3,000 – 6,000 sqft'], ['6000+', 'Full floor']], projects: byType(['Commercial'], ['Horizon']) }
        ];
        const area = $('#f-area'), project = $('#f-project'), size = $('#f-size'), sizeLabel = $('#f-size-label'), cat = $('#f-cat'), goLabel = $('#finder-go-label');
        const opts = (sel, list) => { sel.innerHTML = list.map(([v, l]) => `<option value="${v}">${l}</option>`).join(''); };
        let active = 0;

        const setCat = (i) => {
            active = i;
            const c = CATS[i];
            $$('.finder__tab', tabs).forEach((t, j) => { t.setAttribute('aria-selected', String(j === i)); t.tabIndex = j === i ? 0 : -1; });
            cat.value = c.key;
            sizeLabel.textContent = c.sizeLabel;
            opts(size, c.sizes);
            opts(project, [['', 'Any project'], ...c.projects.map(p => [p, 'Goldeneye ' + p])]);
            goLabel.textContent = 'Search ' + c.plural;
        };

        tabs.innerHTML = CATS.map((c, i) => `<button type="button" role="tab" class="finder__tab" aria-selected="${i === 0}" data-i="${i}">${c.key}</button>`).join('');
        $$('.finder__tab', tabs).forEach((t, i) => {
            t.addEventListener('click', () => setCat(i));
            t.addEventListener('keydown', (e) => {
                if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
                e.preventDefault();
                const n = (active + (e.key === 'ArrowRight' ? 1 : CATS.length - 1)) % CATS.length;
                setCat(n); $$('.finder__tab', tabs)[n].focus();
            });
        });
        setCat(0);

        // empty fields should not clutter the results URL
        form.addEventListener('submit', () => {
            $$('select', form).forEach(s => { if (!s.value) s.disabled = true; });
            setTimeout(() => $$('select', form).forEach(s => { s.disabled = false; }), 0);
        });
    }
})();
