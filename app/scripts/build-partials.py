"""Extracts shared chrome and page bodies from the static prototype into src/partials/*.html.
Run once (or again if the prototype HTML changes):  python scripts/build-partials.py
Dynamic home sections are replaced by tokens that the server fills from Payload."""
import re, pathlib, json

root = pathlib.Path(__file__).resolve().parents[2]
proto = root / 'prototype'
out = root / 'app' / 'src' / 'partials'
out.mkdir(parents=True, exist_ok=True)


def lines(name):
    return (proto / name).read_text(encoding='utf-8').split('\n')


def split(name):
    L = lines(name)
    start = next(i for i, l in enumerate(L) if 'class="skip-link"' in l)
    foot = next(i for i, l in enumerate(L) if 'menu__foot' in l)
    menu_end = next(i for i in range(foot + 1, len(L)) if L[i] == '    </div>')
    ft = next(i for i, l in enumerate(L) if l.strip().startswith('<footer'))
    ft_end = next(i for i in range(ft, len(L)) if L[i].strip() == '</footer>')
    first_script = next(i for i, l in enumerate(L) if l.strip().startswith('<script src='))
    header = '\n'.join(L[start:menu_end + 1])
    mid = '\n'.join(L[menu_end + 1:ft])
    footer = '\n'.join(L[ft:ft_end + 1])
    tail = '\n'.join(L[ft_end + 1:first_script])
    return header, mid, footer, tail


# shared chrome from the home page
header, mid, footer, tail = split('index.html')
header = header.replace('href="#visit"', 'href="index.html#visit"')
# account icon (login / register / saved homes) next to the wishlist heart; app.js points it at login or account
acct = ('<a href="login.html" class="icon-btn" id="acct-link" aria-label="Sign in"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" '
        'stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg></a>' + chr(10) + ' ' * 20)
header = header.replace('<a href="index.html#visit" class="btn bar__cta">', acct + '<a href="index.html#visit" class="btn bar__cta">', 1)
(out / 'header.html').write_text(header, encoding='utf-8')
(out / 'footer.html').write_text(footer, encoding='utf-8')

# ---- home: replace dynamic sections with tokens
home = mid
m = re.search(r'<div class="stats__grid">.*?\n                </div>', home, re.S)
stats_html = m.group(0)
icons = re.findall(r'<span class="stat__ic">(<svg.*?</svg>)</span>', stats_html, re.S)
# selects fed from the CMS (areas + projects)
home = re.sub(r'(<select id="f-area" name="area">).*?(</select>)', lambda m: m.group(1) + '<!--AREAS-->' + m.group(2), home, flags=re.S)
home = re.sub(r'(<select id="v-proj" name="project">).*?(</select>)', lambda m: m.group(1) + '<!--VISIT_PROJECTS-->' + m.group(2), home, flags=re.S)
home = home.replace(stats_html, '<div class="stats__grid">\n<!--STATS-->\n                </div>')
m = re.search(r'<div class="news">.*?\n            </div>', home, re.S)
home = home.replace(m.group(0), '<div class="news">\n<!--NEWS-->\n            </div>')
m = re.search(r'<div class="faq__list">.*?\n                </div>', home, re.S)
home = home.replace(m.group(0), '<div class="faq__list">\n<!--FAQ-->\n                </div>')
(out / 'home.html').write_text(home + '\n<!--FOOTER-->\n' + tail, encoding='utf-8')
(root / 'app' / 'src' / 'lib').mkdir(exist_ok=True)
(root / 'app' / 'src' / 'lib' / 'statIcons.ts').write_text(
    '// extracted from the prototype by scripts/build-partials.py\nexport const STAT_ICONS: Record<string, string> = ' +
    json.dumps(dict(zip(['calendar', 'home', 'family', 'area'], icons)), indent=2) + '\n', encoding='utf-8')

for page in ('properties', 'property'):
    _, mid, _, tail = split(page + '.html')
    (out / f'{page}.html').write_text(mid + '\n<!--FOOTER-->\n' + tail, encoding='utf-8')

for f in out.glob('*.html'):
    f.write_text(f.read_text(encoding='utf-8').replace(' src=""', ''), encoding='utf-8')
print('partials:', sorted(p.name for p in out.iterdir()), 'icons:', len(icons))
