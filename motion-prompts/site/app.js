const CATEGORIES = [
  'Interface utilisateur du produit', 'Téléphone', 'Graphiques', 'Diagrammes', 'Type cinétique', 'Formes',
  'Particules', 'Personnages', 'Photos', 'Musique', 'Code',
];
const STORE_KEY = 'motion-prompts-code';

const $ = (id) => document.getElementById(id);
const state = { templates: [], coffre: null, prompts: null, type: 'Tous', cat: null, q: '', sort: 'recent', paused: false };

const store = {
  get: () => { try { return localStorage.getItem(STORE_KEY); } catch { return null; } },
  set: (v) => { try { localStorage.setItem(STORE_KEY, v); } catch {} },
  clear: () => { try { localStorage.removeItem(STORE_KEY); } catch {} },
};

const fromB64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

async function decrypt(code) {
  const { salt, iv, iterations, data } = state.coffre;
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey('raw', enc.encode(code.trim()), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: fromB64(salt), iterations, hash: 'SHA-256' },
    baseKey, { name: 'AES-GCM', length: 256 }, false, ['decrypt'],
  );
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromB64(iv) }, key, fromB64(data));
  return JSON.parse(new TextDecoder().decode(plain));
}

async function tryUnlock(code, silent) {
  const msg = $('unlock-msg');
  if (!silent) { msg.textContent = 'Vérification…'; msg.className = 'msg'; }
  try {
    state.prompts = await decrypt(code);
    store.set(code);
    msg.textContent = '';
  } catch {
    state.prompts = null;
    if (silent) store.clear();
    else { msg.textContent = 'Code incorrect.'; msg.className = 'msg err'; }
  }
  renderAccess();
}

function renderAccess() {
  const ok = Boolean(state.prompts);
  $('unlock').hidden = ok;
  $('unlocked').hidden = !ok;
  if ($('modal').open) renderPrompt();
}

function filtered() {
  const q = state.q.toLowerCase();
  const list = state.templates.filter((t) =>
    (state.type === 'Tous' || t.type === state.type)
    && (!state.cat || t.categories.includes(state.cat))
    && (!q || [t.titre, t.auteur, ...t.categories].join(' ').toLowerCase().includes(q)));
  return list.sort(state.sort === 'az'
    ? (a, b) => a.titre.localeCompare(b.titre, 'fr')
    : (a, b) => b.ajoute.localeCompare(a.ajoute) || a.titre.localeCompare(b.titre, 'fr'));
}

function pill(label, pressed, onClick, n) {
  const b = document.createElement('button');
  b.className = 'pill';
  b.setAttribute('aria-pressed', String(pressed));
  b.textContent = label;
  if (n !== undefined) {
    const s = document.createElement('span');
    s.className = 'n';
    s.textContent = n;
    b.append(s);
  }
  b.onclick = onClick;
  return b;
}

function renderFilters() {
  $('type-pills').replaceChildren(...['Tous', 'Rapide', 'Détaillé'].map((t) =>
    pill(t, state.type === t, () => { state.type = t; render(); })));
  const used = CATEGORIES.concat(state.templates.flatMap((t) => t.categories).filter((c) => !CATEGORIES.includes(c)));
  const counts = [...new Set(used)]
    .map((c) => [c, state.templates.filter((t) => t.categories.includes(c)).length])
    .filter(([, n]) => n > 0);
  $('cat-pills').replaceChildren(...counts.map(([c, n]) =>
    pill(c, state.cat === c, () => { state.cat = state.cat === c ? null : c; render(); }, n)));
}

const observer = new IntersectionObserver((entries) => {
  for (const e of entries) {
    const v = e.target;
    if (e.isIntersecting && !state.paused) {
      if (!v.src) v.src = v.dataset.src;
      v.play().catch(() => {});
    } else v.pause();
  }
}, { threshold: 0.35 });

function renderGrid() {
  observer.disconnect();
  const list = filtered();
  $('empty').hidden = list.length > 0;
  $('grid').replaceChildren(...list.map((t) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.tabIndex = 0;
    card.innerHTML = `
      <div class="thumb">
        <img alt="" loading="lazy" src="posters/${t.slug}.jpg">
        <video muted loop playsinline preload="none" data-src="videos/${t.slug}.mp4" poster="posters/${t.slug}.jpg"></video>
      </div>
      <div class="card-foot">
        <span class="card-title"></span>
        ${t.aVersionDetaillee ? '<span class="badge plus" title="Prompt détaillé ajouté">+ détaillé</span>' : ''}
        <span class="badge">${t.type}</span>
      </div>`;
    card.querySelector('.card-title').textContent = t.titre;
    card.onclick = () => openModal(t);
    card.onkeydown = (e) => { if (e.key === 'Enter') openModal(t); };
    observer.observe(card.querySelector('video'));
    return card;
  }));
}

function render() {
  renderFilters();
  renderGrid();
}

let current = null;
let currentTab = 'original';

function openModal(t) {
  current = t;
  currentTab = t.aVersionDetaillee && t.type === 'Rapide' ? 'detaille' : 'original';
  $('m-title').textContent = t.titre;
  $('m-meta').textContent = [t.auteur, `${t.duree} s`, ...t.categories].filter(Boolean).join(' · ');
  const v = $('m-video');
  v.src = `videos/${t.slug}.mp4`;
  v.poster = `posters/${t.slug}.jpg`;
  renderPrompt();
  $('modal').showModal();
  v.play().catch(() => {});
}

function renderPrompt() {
  const t = current;
  const tabs = [['original', "Prompt d'origine"]];
  if (t.aVersionDetaillee) tabs.push(['detaille', 'Prompt détaillé (analyse de la vidéo)']);
  $('m-tabs').replaceChildren(...(tabs.length > 1 ? tabs.map(([k, label]) =>
    pill(label, currentTab === k, () => { currentTab = k; renderPrompt(); })) : []));
  const p = state.prompts?.[t.slug];
  $('m-locked').hidden = Boolean(p);
  $('m-prompt').hidden = !p;
  $('m-prompt').textContent = p ? p[currentTab] : '';
  $('copy').disabled = !p;
  $('copy-msg').textContent = '';
}

$('copy').onclick = async () => {
  try {
    await navigator.clipboard.writeText($('m-prompt').textContent);
    $('copy-msg').textContent = 'Copié ✓';
  } catch {
    $('copy-msg').textContent = 'Sélectionne le texte et copie-le manuellement.';
  }
};
$('close').onclick = () => $('modal').close();
$('modal').addEventListener('close', () => $('m-video').pause());
$('modal').addEventListener('click', (e) => { if (e.target === $('modal')) $('modal').close(); });
$('unlock').onsubmit = (e) => { e.preventDefault(); const c = $('code').value; if (c.trim()) tryUnlock(c, false); };
$('logout').onclick = () => { store.clear(); state.prompts = null; $('code').value = ''; renderAccess(); };
$('search').oninput = (e) => { state.q = e.target.value; renderGrid(); };
$('sort').onchange = (e) => { state.sort = e.target.value; renderGrid(); };
$('pause').onclick = () => {
  state.paused = !state.paused;
  $('pause').setAttribute('aria-pressed', String(state.paused));
  $('pause').textContent = state.paused ? '▶ Relancer les aperçus' : '❚❚ Mettre en pause les aperçus';
  renderGrid();
};

(async () => {
  const res = await fetch('data.json', { cache: 'no-cache' });
  const data = await res.json();
  state.templates = data.templates;
  state.coffre = data.coffre;
  $('total').textContent = `${data.templates.length} modèles`;
  render();
  const saved = store.get();
  if (saved) tryUnlock(saved, true);
})();
