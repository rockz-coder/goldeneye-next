/* Goldeneye v2 — custom dropdowns (Chosen-style) that wrap every native <select>.
   The native select stays in the DOM as the source of truth (forms, labels, change events keep working);
   this only draws the button and the list. Searchable once a list has more than SEARCH_MIN options. */
(() => {
    'use strict';
    const SEARCH_MIN = 8;
    let uid = 0, openInst = null;
    const CHEV = '<svg class="sel2__chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
    const TICK = '<svg class="sel2__tick" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>';
    const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const valueDesc = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    const idxDesc = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'selectedIndex');

    function enhance(sel) {
        if (sel.dataset.sel2 || sel.multiple) return;
        sel.dataset.sel2 = '1';
        const id = 'sel2-' + (++uid);
        const wrap = document.createElement('div');
        wrap.className = 'sel2';
        sel.parentNode.insertBefore(wrap, sel);
        wrap.appendChild(sel);
        sel.classList.add('sel2__native');
        sel.tabIndex = -1;
        sel.setAttribute('aria-hidden', 'true');

        const btn = document.createElement('button');
        btn.type = 'button'; btn.className = 'sel2__btn'; btn.id = id + '-btn';
        btn.setAttribute('role', 'combobox');
        btn.setAttribute('aria-haspopup', 'listbox'); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', id + '-list');
        const lbl = sel.id && document.querySelector(`label[for="${sel.id}"]`);
        if (lbl) { lbl.id = lbl.id || id + '-lbl'; btn.setAttribute('aria-labelledby', lbl.id + ' ' + btn.id); }
        else if (sel.getAttribute('aria-label')) btn.setAttribute('aria-label', sel.getAttribute('aria-label'));
        btn.innerHTML = '<span class="sel2__val"></span>' + CHEV;
        wrap.appendChild(btn);

        const pop = document.createElement('div');
        pop.className = 'sel2__pop'; pop.hidden = true;
        pop.innerHTML = `<div class="sel2__search"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input type="text" autocomplete="off" spellcheck="false" aria-label="Search options" placeholder="Search…"></div><ul role="listbox" id="${id}-list" tabindex="-1"></ul><p class="sel2__none" hidden>No matches</p>`;
        document.body.appendChild(pop);
        const list = pop.querySelector('ul'), search = pop.querySelector('input'), none = pop.querySelector('.sel2__none'), val = btn.querySelector('.sel2__val');

        let items = [], act = -1, typed = '', typedT;

        const build = () => {
            const rows = []; let n = 0;
            const add = (o, g = '') => rows.push(`<li role="option" id="${id}-o${n}" data-g="${esc(g)}" data-i="${o.index}" aria-selected="${o.selected}"${o.disabled ? ' aria-disabled="true"' : ''}><span>${esc(o.textContent)}</span>${TICK}</li>`) && n++;
            [...sel.children].forEach(ch => {
                if (ch.tagName === 'OPTGROUP') { rows.push(`<li role="presentation" class="sel2__grp">${esc(ch.label)}</li>`); [...ch.children].forEach(o => add(o, ch.label)); }
                else add(ch);
            });
            list.innerHTML = rows.join('');
            items = [...list.querySelectorAll('[role=option]')];
            pop.classList.toggle('has-search', sel.options.length > SEARCH_MIN);
        };
        const sync = () => {
            const o = sel.options[sel.selectedIndex];
            val.textContent = o ? o.textContent : '';
            btn.classList.toggle('is-placeholder', !sel.value);
            btn.disabled = sel.disabled;
            wrap.classList.toggle('is-disabled', sel.disabled);
            items.forEach(li => li.setAttribute('aria-selected', String(+li.dataset.i === sel.selectedIndex)));
        };
        const refresh = () => { build(); sync(); };

        // programmatic `select.value = x` / selectedIndex must redraw the button too
        Object.defineProperty(sel, 'value', { get() { return valueDesc.get.call(this); }, set(v) { valueDesc.set.call(this, v); sync(); }, configurable: true });
        Object.defineProperty(sel, 'selectedIndex', { get() { return idxDesc.get.call(this); }, set(v) { idxDesc.set.call(this, v); sync(); }, configurable: true });
        new MutationObserver(refresh).observe(sel, { childList: true, subtree: true, characterData: true });
        new MutationObserver(sync).observe(sel, { attributes: true, attributeFilter: ['disabled'] });
        sel.addEventListener('change', sync);
        sel.form && sel.form.addEventListener('reset', () => setTimeout(sync, 0));
        sel.addEventListener('focus', () => btn.focus());   // <label for> still lands on the visible control

        const visible = () => items.filter(li => !li.hidden && li.getAttribute('aria-disabled') !== 'true');
        const setActive = (li, scroll = true) => {
            items.forEach(x => x.classList.remove('is-act'));
            if (!li) { act = -1; btn.removeAttribute('aria-activedescendant'); search.removeAttribute('aria-activedescendant'); return; }
            li.classList.add('is-act'); act = items.indexOf(li);
            (pop.classList.contains('has-search') ? search : btn).setAttribute('aria-activedescendant', li.id);
            if (scroll) li.scrollIntoView({ block: 'nearest' });
        };
        const move = (d) => {
            const v = visible(); if (!v.length) return;
            const cur = v.indexOf(items[act]);
            setActive(v[cur < 0 ? (d > 0 ? 0 : v.length - 1) : (cur + d + v.length) % v.length]);
        };
        const choose = (li) => {
            if (!li || li.getAttribute('aria-disabled') === 'true') return;
            const i = +li.dataset.i;
            if (i !== sel.selectedIndex) { idxDesc.set.call(sel, i); sync(); sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); }
            close(true);
        };

        const place = () => {
            const r = btn.getBoundingClientRect(), vh = innerHeight, below = vh - r.bottom - 12, above = r.top - 12;
            const need = Math.min(pop.scrollHeight || 280, 320);
            const up = below < need && above > below;
            pop.style.left = Math.max(8, Math.min(r.left, innerWidth - Math.max(r.width, 200) - 8)) + 'px';
            pop.style.minWidth = r.width + 'px';
            pop.style.maxHeight = Math.max(160, Math.min(340, up ? above : below)) + 'px';
            pop.classList.toggle('is-up', up);
            if (up) { pop.style.top = 'auto'; pop.style.bottom = (vh - r.top + 6) + 'px'; }
            else { pop.style.bottom = 'auto'; pop.style.top = (r.bottom + 6) + 'px'; }
        };
        const open = () => {
            if (openInst && openInst !== inst) openInst.close();
            if (sel.disabled) return;
            refresh(); search.value = ''; filter('');
            pop.hidden = false; btn.setAttribute('aria-expanded', 'true'); wrap.classList.add('is-open');
            place(); openInst = inst;
            const cur = items[sel.selectedIndex] || visible()[0];
            setActive(cur);
            if (pop.classList.contains('has-search')) search.focus({ preventScroll: true });
        };
        function close(refocus) {
            if (pop.hidden) return;
            pop.hidden = true; btn.setAttribute('aria-expanded', 'false'); wrap.classList.remove('is-open');
            setActive(null); if (openInst === inst) openInst = null;
            if (refocus) btn.focus({ preventScroll: true });
        }
        const filter = (q) => {
            q = q.trim().toLowerCase(); let any = false;
            items.forEach(li => { const hit = !q || (li.textContent + ' ' + li.dataset.g).toLowerCase().includes(q); li.hidden = !hit; any = any || hit; });
            [...list.querySelectorAll('.sel2__grp')].forEach(g => { let n = g.nextElementSibling, shown = false; while (n && n.getAttribute('role') === 'option') { if (!n.hidden) shown = true; n = n.nextElementSibling; } g.hidden = !shown; });
            none.hidden = any;
            setActive(visible().find(li => li.getAttribute('aria-selected') === 'true') || visible()[0], false);
        };

        btn.addEventListener('click', () => (pop.hidden ? open() : close(true)));
        btn.addEventListener('keydown', (e) => {
            if (pop.hidden) {
                if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) { e.preventDefault(); open(); }
                else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) { typeahead(e.key, true); }
                return;
            }
            if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
            else if (e.key === 'Home') { e.preventDefault(); setActive(visible()[0]); }
            else if (e.key === 'End') { e.preventDefault(); const v = visible(); setActive(v[v.length - 1]); }
            else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(items[act]); }
            else if (e.key === 'Tab') close(false);
            else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) typeahead(e.key, false);
        });
        // without a search box, typing jumps to the matching option
        const typeahead = (ch, closed) => {
            typed += ch.toLowerCase(); clearTimeout(typedT); typedT = setTimeout(() => { typed = ''; }, 700);
            const m = [...sel.options].findIndex(o => !o.disabled && o.textContent.trim().toLowerCase().startsWith(typed));
            if (m < 0) return;
            if (closed) { idxDesc.set.call(sel, m); sync(); sel.dispatchEvent(new Event('change', { bubbles: true })); }
            else setActive(items[m]);
        };
        search.addEventListener('input', () => filter(search.value));
        search.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
            else if (e.key === 'Enter') { e.preventDefault(); choose(items[act]); }
            else if (e.key === 'Tab') close(false);
        });
        list.addEventListener('mousemove', (e) => { const li = e.target.closest('[role=option]'); if (li && !li.classList.contains('is-act') && li.getAttribute('aria-disabled') !== 'true') setActive(li, false); });
        list.addEventListener('mousedown', (e) => e.preventDefault());   // keep focus where it is until we choose
        list.addEventListener('click', (e) => choose(e.target.closest('[role=option]')));

        const inst = { close, place, pop, btn };
        wrap._sel2 = inst;
        refresh();
    }

    // one set of global listeners for whichever dropdown is open
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && openInst) { e.stopPropagation(); e.preventDefault(); openInst.close(true); }
    }, true);
    document.addEventListener('mousedown', (e) => { if (openInst && !openInst.pop.contains(e.target) && !openInst.btn.contains(e.target)) openInst.close(false); });
    addEventListener('resize', () => { if (openInst) openInst.place(); });
    document.addEventListener('scroll', (e) => { if (openInst && !openInst.pop.contains(e.target)) openInst.place(); }, true);

    const run = () => document.querySelectorAll('select').forEach(enhance);
    run();
    window.GD && (window.GD.enhanceSelects = run);
})();
