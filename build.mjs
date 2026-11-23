// Static site generator: node build.mjs  ->  dist/
import fs from 'node:fs';
import path from 'node:path';
import cfg from './site.config.mjs';
import { tools } from './src/tools.mjs';
import { langs, privacyText } from './src/i18n.mjs';

const OUT = 'dist';
const base = new URL(cfg.baseUrl).pathname.replace(/\/$/, ''); // '' or '/calcdock'
const today = new Date().toISOString().slice(0, 10);
const css = fs.readFileSync('src/style.css', 'utf8');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const urls = []; // for sitemap

const langPath = l => (langs[l].dir ? `/${langs[l].dir}` : '');
const href = (l, slug = '') => `${base}${langPath(l)}/${slug ? slug + '/' : ''}`;
const abs = (l, slug) => cfg.baseUrl.replace(base, '') + href(l, slug);

function write(rel, html) {
  const file = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

function runtime(L, cur) {
  return `const LOCALE=${JSON.stringify(L.locale)},CUR=${JSON.stringify(cur || L.currency)};
const $=id=>document.getElementById(id),val=id=>$(id)?$(id).value:'',num=id=>parseFloat(String(val(id)).replace(',','.'))||0,setv=(id,v)=>{if($(id))$(id).value=v};
const fmt=(n,d=2)=>isFinite(n)?n.toLocaleString(LOCALE,{maximumFractionDigits:d,minimumFractionDigits:0}):'–';
const money=n=>isFinite(n)?n.toLocaleString(LOCALE,{style:'currency',currency:CUR}):'–';
const table=(h,rows)=>'<div class="tbl"><table><thead><tr>'+h.map(x=>'<th>'+x+'</th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+r.map(x=>'<td>'+x+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
const out=(rows,extra='')=>{$('res').innerHTML='<dl>'+rows.map(([k,v])=>'<div><dt>'+k+'</dt><dd>'+v+'</dd></div>').join('')+'</dl>'+extra;};`;
}

function layout({ L, lang, title, desc, canonical, alternates = {}, body, jsonld = [] }) {
  const alt = Object.entries(alternates).map(([l, u]) => `<link rel="alternate" hreflang="${l}" href="${u}">`).join('')
    + (alternates.en ? `<link rel="alternate" hreflang="x-default" href="${alternates.en}">` : '');
  const ads = cfg.adsenseClient ? `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${cfg.adsenseClient}" crossorigin="anonymous"></script>` : '';
  const ga = cfg.analytics ? `<script data-goatcounter="https://${cfg.analytics}.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>` : '';
  const gv = cfg.googleVerification ? `<meta name="google-site-verification" content="${cfg.googleVerification}">` : '';
  const langLinks = Object.keys(langs).map(l => `<a href="${alternates[l] ? new URL(alternates[l]).pathname : href(l)}" hreflang="${l}"${l === lang ? ' aria-current="true"' : ''}>${l.toUpperCase()}</a>`).join('');
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${canonical}">${alt}${gv}
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${canonical}"><meta property="og:type" content="website"><meta property="og:site_name" content="${esc(cfg.siteName)}">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%232563eb'/%3E%3Ctext x='16' y='23' font-size='20' text-anchor='middle' fill='white' font-family='Arial' font-weight='700'%3E%3D%3C/text%3E%3C/svg%3E">
<style>${css}</style>${jsonld.map(j => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join('')}${ads}${ga}</head>
<body><header><div class="wrap"><a class="logo" href="${href(lang)}">${esc(cfg.siteName)}</a><nav class="langs">${langLinks}</nav></div></header>
<main class="wrap">${body}</main>
<footer><div class="wrap"><p>${L.disclaimer}</p><p><a href="${href(lang)}">${L.all}</a> · <a href="${href(lang, 'about')}">${L.about}</a> · <a href="${href(lang, 'privacy')}">${L.privacy}</a> · © ${new Date().getFullYear()} ${esc(cfg.siteName)}</p></div></footer>
</body></html>`;
}

function toolPage(tool, lang) {
  const L = langs[lang], t = tool.text[lang];
  const alternates = Object.fromEntries(Object.keys(langs).filter(l => tool.text[l]).map(l => [l, abs(l, tool.text[l].slug)]));
  const canonical = abs(lang, t.slug);
  const related = tools.filter(x => x !== tool && x.text[lang]).sort((a, b) => (b.cat === tool.cat) - (a.cat === tool.cat)).slice(0, 4);
  const jsonld = [
    { '@context': 'https://schema.org', '@type': 'WebApplication', name: t.h1, url: canonical, description: t.desc, applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0' }, inLanguage: lang },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: cfg.siteName, item: abs(lang) },
      { '@type': 'ListItem', position: 2, name: t.h1, item: canonical }] },
  ];
  if (t.faq?.length) jsonld.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: t.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });
  const body = `<nav class="crumbs"><a href="${href(lang)}">${esc(cfg.siteName)}</a> › ${L.cats[tool.cat]}</nav>
<h1>${t.h1}</h1><p class="lead">${t.intro}</p>
<section class="calc"><form id="f" onsubmit="return false">${tool.form(t)}</form>
<div class="result" aria-live="polite"><h2>${L.result}</h2><div id="res"></div><button type="button" id="cp" class="cp">${L.copy}</button></div></section>
<article class="content">${t.body}
${t.faq?.length ? `<h2>${L.faq}</h2>${t.faq.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}` : ''}
<p class="upd">${L.updated}: ${today}</p></article>
<aside><h2>${L.related}</h2><ul class="grid">${related.map(r => `<li><a href="${href(lang, r.text[lang].slug)}"><strong>${r.text[lang].h1}</strong><span>${r.text[lang].intro}</span></a></li>`).join('')}</ul></aside>
<script>${runtime(L, t.cur)}
const O=${JSON.stringify(t.o || {})};
function calc(){try{${tool.js}}catch(e){console.error(e)}}
${tool.init || ''}
$('f').addEventListener('input',calc);$('f').addEventListener('change',calc);calc();
$('cp').onclick=()=>{navigator.clipboard?.writeText($('res').innerText).then(()=>{$('cp').textContent=${JSON.stringify(L.copied)};setTimeout(()=>$('cp').textContent=${JSON.stringify(L.copy)},1500)})};
</script>`;
  write(`${langPath(lang)}/${t.slug}/index.html`, layout({ L, lang, title: `${t.title} | ${cfg.siteName}`, desc: t.desc, canonical, alternates, body, jsonld }));
  urls.push({ loc: canonical, alternates });
}

function homePage(lang) {
  const L = langs[lang];
  const alternates = Object.fromEntries(Object.keys(langs).map(l => [l, abs(l)]));
  const groups = Object.keys(L.cats).map(c => [c, tools.filter(t => t.cat === c && t.text[lang])]).filter(([, a]) => a.length);
  const body = `<h1>${L.tagline}</h1><p class="lead">${L.homeIntro}</p>
${groups.map(([c, list]) => `<h2>${L.cats[c]}</h2><ul class="grid">${list.map(t => `<li><a href="${href(lang, t.text[lang].slug)}"><strong>${t.text[lang].h1}</strong><span>${t.text[lang].intro}</span></a></li>`).join('')}</ul>`).join('')}`;
  const jsonld = [{ '@context': 'https://schema.org', '@type': 'WebSite', name: cfg.siteName, url: abs(lang), inLanguage: lang }];
  write(`${langPath(lang)}/index.html`, layout({ L, lang, title: `${L.homeTitle} | ${cfg.siteName}`, desc: L.homeDesc, canonical: abs(lang), alternates, body, jsonld }));
  urls.push({ loc: abs(lang), alternates });
}

function staticPage(lang, slug, title, html) {
  const L = langs[lang];
  write(`${langPath(lang)}/${slug}/index.html`, layout({ L, lang, title: `${title} | ${cfg.siteName}`, desc: title, canonical: abs(lang, slug), body: `<h1>${title}</h1><article class="content">${html}</article>` }));
  urls.push({ loc: abs(lang, slug), alternates: {} });
}

fs.rmSync(OUT, { recursive: true, force: true });
for (const lang of Object.keys(langs)) {
  homePage(lang);
  for (const tool of tools) if (tool.text[lang]) toolPage(tool, lang);
  const L = langs[lang];
  staticPage(lang, 'about', L.aboutTitle, L.aboutBody + (cfg.contactEmail ? `<p>Contact: <a href="mailto:${cfg.contactEmail}">${cfg.contactEmail}</a></p>` : ''));
  staticPage(lang, 'privacy', L.privacyTitle, privacyText[lang](cfg));
}

write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(u => `<url><loc>${u.loc}</loc><lastmod>${today}</lastmod>${Object.entries(u.alternates).map(([l, h]) => `<xhtml:link rel="alternate" hreflang="${l}" href="${h}"/>`).join('')}</url>`).join('\n')}
</urlset>`);
write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${cfg.baseUrl}/sitemap.xml\n`);
if (cfg.adsenseClient) write('ads.txt', `google.com, ${cfg.adsenseClient.replace('ca-', '')}, DIRECT, f08c47fec0942fa0\n`);
write('404.html', layout({ L: langs.en, lang: 'en', title: 'Page not found', desc: 'Page not found', canonical: abs('en'), body: `<h1>Page not found</h1><p><a href="${href('en')}">Go to all calculators</a></p>` }));
write('.nojekyll', '');
console.log(`Built ${urls.length} pages into ${OUT}/`);
