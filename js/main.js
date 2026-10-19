// Esha Interiors — site behaviour. Safe to load on every page: each block
// checks that its elements exist before wiring anything up.
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// ---------- GALLERY DATA ----------
const gallery = [
  { cat: 'living', id: 'photo-1646987916641-1f3c8992daa2', title: 'Luxury Living Room', subtitle: 'Hyderabad • ₹75,000', ar: '4/5' },
  { cat: 'kitchen', id: 'photo-1628745277862-bc0b2d68c50c', title: 'Modern Kitchen Design', subtitle: 'Hyderabad • ₹50,000', ar: '4/3' },
  { cat: 'bedroom', id: 'premium_photo-1675616563084-63d1f129623d', title: 'Luxury Bedroom', subtitle: 'Hyderabad • ₹75,000', ar: '3/4' },
  { cat: 'wardrobe', id: 'premium_photo-1670076515866-73822a3d610d', title: 'Luxury Wardrobe', subtitle: 'Hyderabad • ₹50,000', ar: '1/1' },
  { cat: 'living', id: 'photo-1720247520862-7e4b14176fa8', title: 'Modern Living Space', subtitle: 'Hyderabad • ₹75,000', ar: '4/3' },
  { cat: 'kitchen', id: 'photo-1639405069836-f82aa6dcb900', title: 'Luxury Kitchen', subtitle: 'Hyderabad • ₹50,000', ar: '4/5' },
  { cat: 'bedroom', id: 'photo-1642541070065-3912f347e7c6', title: 'Modern Bedroom', subtitle: 'Hyderabad • ₹75,000', ar: '4/3' },
  { cat: 'wardrobe', id: 'photo-1774301211236-dab64d553241', title: 'Walk-in Closet', subtitle: 'Hyderabad • ₹50,000', ar: '3/4' },
  { cat: 'living', id: 'photo-1704040686413-2c607dbd2f06', title: 'Contemporary Living', subtitle: 'Hyderabad • ₹75,000', ar: '1/1' },
  { cat: 'kitchen', id: 'photo-1512916194211-3f2b7f5f7de3', title: 'Contemporary Kitchen', subtitle: 'Hyderabad • ₹50,000', ar: '3/4' },
  { cat: 'bedroom', id: 'photo-1696762932825-2737db830bbe', title: 'Contemporary Bedroom', subtitle: 'Hyderabad • ₹75,000', ar: '4/5' },
  { cat: 'wardrobe', id: 'photo-1778731660303-1fa5ede75477', title: 'Modern Wardrobe', subtitle: 'Hyderabad • ₹50,000', ar: '4/3' },
  { cat: 'living', id: 'photo-1648881806148-e5c51179c826', title: 'Elegant Living Room', subtitle: 'Hyderabad • ₹75,000', ar: '3/4' },
  { cat: 'kitchen', id: 'photo-1663811396777-05505d999151', title: 'Modular Kitchen', subtitle: 'Hyderabad • ₹50,000', ar: '1/1' },
  { cat: 'bedroom', id: 'photo-1699869653495-fe26f4c70b3e', title: 'Elegant Bedroom Design', subtitle: 'Hyderabad • ₹75,000', ar: '4/3' },
  { cat: 'wardrobe', id: 'premium_photo-1674815329032-421d305ad589', title: 'Walk-in Wardrobe Design', subtitle: 'Hyderabad • ₹50,000', ar: '4/5' }
];
const catLabel = { living: 'Living Room', kitchen: 'Kitchen', bedroom: 'Bedroom', wardrobe: 'Wardrobe' };
// Unsplash+ (premium_) photos are only served from plus.unsplash.com
const imgUrl = (g, w, h) => `https://${g.id.startsWith('premium_') ? 'plus' : 'images'}.unsplash.com/${g.id}?w=${w}${h ? `&h=${h}` : ''}&fit=crop`;

const grid = $('#projects-grid');
let visible = gallery.map((_, i) => i);

if (grid) {
  grid.innerHTML = gallery.map((g, i) => `
    <button class="m-item" data-category="${g.cat}" data-i="${i}" data-cursor="View" style="--ar:${g.ar}">
      <img src="${imgUrl(g, 700)}" alt="${g.title}" loading="lazy">
      <span class="m-tag">${catLabel[g.cat]}</span>
      <span class="m-over"><span class="m-ot">${g.title}</span><span class="m-os">${g.subtitle}</span></span>
    </button>`).join('');
  grid.addEventListener('click', e => {
    const item = e.target.closest('.m-item');
    if (item) openLightbox(+item.dataset.i);
  });
}

// Shared by the homepage gallery and pages/portfolio.html: toggles every
// [data-category] item and marks the clicked button active within its group.
function filterProjects(category, btn) {
  btn = btn || window.event?.currentTarget;
  if (btn?.parentElement) $$('.fil-btn', btn.parentElement).forEach(b => b.classList.toggle('active', b === btn));
  visible = [];
  $$('[data-category]').forEach(item => {
    const show = category === 'all' || item.dataset.category === category;
    item.classList.toggle('hide', !show);
    if (!show) return;
    if (item.dataset.i) visible.push(+item.dataset.i);
    item.style.animation = 'none';
    item.offsetHeight; // restart entrance animation
    item.style.animation = '';
  });
}
$$('#filters .fil-btn').forEach(b => b.addEventListener('click', () => filterProjects(b.dataset.filter, b)));

// ---------- LIGHTBOX ----------
const lightbox = $('#lightbox');
let lbPos = 0;

function showLightbox() {
  const g = gallery[visible[lbPos]];
  $('#lightboxImg').src = imgUrl(g, 1600);
  $('#lightboxImg').alt = g.title;
  $('#lightboxTitle').textContent = g.title;
  $('#lightboxSubtitle').textContent = g.subtitle;
  $('#lightboxCount').textContent = `${String(lbPos + 1).padStart(2, '0')} / ${String(visible.length).padStart(2, '0')}`;
}
function openLightbox(index) {
  if (!lightbox) return;
  lbPos = Math.max(0, visible.indexOf(index));
  showLightbox();
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox?.classList.remove('active');
  document.body.style.overflow = '';
}
function nextLightbox() { lbPos = (lbPos + 1) % visible.length; showLightbox(); }
function prevLightbox() { lbPos = (lbPos - 1 + visible.length) % visible.length; showLightbox(); }

lightbox?.addEventListener('click', e => { if (e.target === lightbox || e.target.classList.contains('lightbox-content')) closeLightbox(); });

// ---------- HERO CAROUSEL ----------
const slides = $$('.hero-bg-slide');
const slideNames = ['Living', 'Kitchen', 'Bedroom'];
let cur = 0, timer;

function goTo(n) {
  if (!slides.length) return;
  cur = (n + slides.length) % slides.length;
  slides.forEach((s, i) => s.classList.toggle('active', i === cur));
  $$('.dot').forEach((d, i) => d.classList.toggle('active', i === cur));
  const num = $('#slideNum'), name = $('#slideName');
  if (num) num.textContent = String(cur + 1).padStart(2, '0');
  if (name) name.textContent = slideNames[cur] || '';
  clearInterval(timer);
  timer = setInterval(() => goTo(cur + 1), 5600);
}
function nextSlide(offset = 1) { goTo(cur + offset); }
if (slides.length) goTo(0);

// Image ribbon: duplicate the items once so the -50% loop is seamless
const ribbon = $('#ribbonTrack');
if (ribbon) ribbon.innerHTML += ribbon.innerHTML;

// Rotating hero word
const rot = $$('#rotator span');
if (rot.length && !reduceMotion) {
  let r = 0;
  setInterval(() => {
    const prev = rot[r];
    prev.classList.remove('active');
    prev.classList.add('out');
    setTimeout(() => prev.classList.remove('out'), 700);
    r = (r + 1) % rot.length;
    rot[r].classList.add('active');
  }, 2600);
}

// Mouse parallax on hero pieces
const heroVisual = $('#heroVisual');
if (heroVisual && finePointer && !reduceMotion) {
  const layers = $$('[data-depth]', heroVisual);
  $('#hero').addEventListener('mousemove', e => {
    const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
    layers.forEach(l => {
      const d = +l.dataset.depth;
      l.style.translate = `${-x * d}px ${-y * d}px`;
    });
  });
}

// ---------- CUSTOM CURSOR ----------
const cursor = $('#cursor');
if (cursor && finePointer && !reduceMotion) {
  document.addEventListener('mousemove', e => {
    const t = e.target.closest?.('[data-cursor]');
    if (t) $('#cursorLabel').textContent = t.dataset.cursor;
    cursor.classList.toggle('on', !!t);
    cursor.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0) scale(${t ? 1 : 0})`;
  });
}

// ---------- SERVICE STACKING CARDS ----------
// Each card shrinks and dims slightly as the next one slides over it.
const svcCards = $$('.svc-card');
if (svcCards.length && !reduceMotion) {
  const stack = () => {
    const sticky = getComputedStyle(svcCards[0]).position === 'sticky';
    svcCards.forEach((card, i) => {
      const next = svcCards[i + 1];
      if (!sticky || !next) { card.style.transform = ''; card.style.filter = ''; return; }
      const gap = next.getBoundingClientRect().top - card.getBoundingClientRect().top;
      const p = Math.max(0, Math.min(1, 1 - gap / card.offsetHeight));
      card.style.transform = `scale(${1 - p * .05})`;
      card.style.filter = `brightness(${1 - p * .25})`;
    });
  };
  addEventListener('scroll', stack, { passive: true });
  addEventListener('resize', stack);
  stack();
}

// ---------- BEFORE / AFTER ----------
// Each "before" is its "after" photo with the furniture removed, stored as
// images/transform/<key>-before.jpg. Only rooms whose before image exists get a
// tab, so adding kitchen-before.jpg or bedroom-before.jpg brings that tab back.
const baSets = [
  { key: 'living', label: 'Living', after: 'photo-1618221195710-dd6b41faaea6', alt: 'living room' },
  { key: 'kitchen', label: 'Kitchen', after: 'photo-1600489000022-c2086d79f9d4', alt: 'kitchen' },
  { key: 'bedroom', label: 'Bedroom', after: 'photo-1502005097973-6a7082348e28', alt: 'bedroom' }
];
const baUrl = id => `https://images.unsplash.com/${id}?w=1600&h=900&fit=crop`;
const baTabs = $('#baTabs');
if (baTabs) {
  Promise.all(baSets.map(set => new Promise(done => {
    const img = new Image();
    img.onload = () => { set.before = img.src; done(set); };
    img.onerror = () => done(null);
    img.src = `images/transform/${set.key}-before.jpg`;
  }))).then(found => {
    const ready = found.filter(Boolean);
    baTabs.innerHTML = ready.map((set, i) =>
      `<button class="fil-btn${i ? '' : ' active'}" data-i="${baSets.indexOf(set)}">${set.label}</button>`).join('');
    baTabs.hidden = ready.length < 2;
    $$('button', baTabs).forEach(btn => {
      new Image().src = baUrl(baSets[btn.dataset.i].after); // preload so tab switches are instant
      btn.addEventListener('click', () => setBA(+btn.dataset.i, btn));
    });
  });
}
const ba = $('#ba'), baRange = $('#baRange');
if (ba && baRange) {
  baRange.addEventListener('input', () => ba.style.setProperty('--pos', baRange.value + '%'));
  // Gentle teaser sweep the first time the slider comes into view
  new IntersectionObserver((entries, o) => {
    if (!entries[0].isIntersecting || reduceMotion) return;
    o.disconnect();
    let t = 0;
    const sweep = () => {
      t += 0.02;
      const v = 50 + Math.sin(t * Math.PI) * 22;
      ba.style.setProperty('--pos', v + '%');
      baRange.value = v;
      if (t < 2) requestAnimationFrame(sweep); else { ba.style.setProperty('--pos', '50%'); baRange.value = 50; }
    };
    setTimeout(sweep, 400);
  }, { threshold: .5 }).observe(ba);
}
function setBA(i, btn) {
  $$('.ba-tabs .fil-btn').forEach(b => b.classList.toggle('active', b === btn));
  const s = baSets[i];
  $('#baAfter').src = baUrl(s.after); $('#baAfter').alt = `${s.alt} after the Esha makeover`;
  $('#baBefore').src = s.before; $('#baBefore').alt = `${s.alt} before the makeover`;
}

// ---------- PROCESS TIMELINE ----------
const timeline = $('#timeline');
if (timeline) {
  const steps = $$('.tl-step', timeline), fill = $('#tlFill');
  const onScroll = () => {
    const r = timeline.getBoundingClientRect();
    const mid = innerHeight * .6;
    const p = Math.max(0, Math.min(1, (mid - r.top) / r.height));
    fill.style.height = p * 100 + '%';
    steps.forEach(s => s.classList.toggle('lit', s.getBoundingClientRect().top + 32 < mid));
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ---------- STYLE QUIZ ----------
const styles = {
  warm: { name: 'Warm Minimalist', desc: 'You love calm, uncluttered rooms layered with soft textures — linen, light oak and gentle neutrals. We\'d design you a home that exhales.', palette: ['#f2ece2', '#e4dbd0', '#c9b49a', '#9e9488'] },
  luxe: { name: 'Modern Luxe', desc: 'Polished surfaces, rich veneers and a touch of brass. You want rooms that feel like a boutique hotel — refined, glowing and quietly dramatic.', palette: ['#18140e', '#4a4238', '#b87040', '#d4975e'] },
  earthy: { name: 'Earthy Heritage', desc: 'Terracotta, cane, teak and handwoven textiles. You\'re drawn to warmth and craft — Indian roots with a contemporary ease.', palette: ['#b87040', '#8a5a34', '#6a8c5a', '#e9e0d0'] },
  modern: { name: 'Clean Contemporary', desc: 'Crisp lines, hidden storage and nothing out of place. You like spaces that work as hard as you do — smart, sleek and easy to live in.', palette: ['#ffffff', '#e4dbd0', '#4a4238', '#18140e'] }
};
const quiz = { service: '', style: '', budget: '' };
let qStep = 0;

function showQuizStep(n) {
  qStep = n;
  $$('.quiz-step').forEach(s => s.classList.toggle('active', +s.dataset.step === n));
  const bar = $('#quizBar'), label = $('#quizLabel'), back = $('#quizBack');
  if (bar) bar.style.width = Math.min(100, (n + 1) * 33.34) + '%';
  if (label) label.textContent = n < 3 ? `Question ${n + 1} of 3` : 'Your result';
  if (back) back.hidden = n === 0 || n === 3;
  if (n === 3) fillQuizResult(quiz.style);
}
function fillQuizResult(key) {
  const s = styles[key] || styles.warm;
  $('#qrName').textContent = s.name;
  $('#qrDesc').textContent = s.desc;
  $('#qrPalette').innerHTML = s.palette.map(c => `<i style="background:${c}"></i>`).join('');
}
// Pre-render the (hidden) result so the quiz box has its final height from the start
if ($('#qrName')) fillQuizResult('warm');
$$('.quiz-opt').forEach(opt => opt.addEventListener('click', () => {
  quiz[opt.dataset.key] = opt.dataset.val;
  $$('.quiz-opt', opt.parentElement).forEach(o => o.classList.toggle('picked', o === opt));
  setTimeout(() => showQuizStep(qStep + 1), 280);
}));
function quizBack() { if (qStep > 0) showQuizStep(qStep - 1); }
function resetQuiz() {
  Object.keys(quiz).forEach(k => quiz[k] = '');
  $$('.quiz-opt').forEach(o => o.classList.remove('picked'));
  showQuizStep(0);
}
function bookFromQuiz() {
  const s = styles[quiz.style] || styles.warm;
  openModal('hero');
  if (quiz.service) $('#msel').value = quiz.service;
  if (quiz.budget) $('#modal-budget').value = quiz.budget;
  $('#modal-vision').value = `Style quiz result: ${s.name}. `;
  $('#msub').textContent = `You're a ${s.name} — let's design around it.`;
}

// ---------- TESTIMONIALS ----------
const tqs = $$('.tq'), tqBtns = $$('#tqNav button');
let tqi = 0, tqTimer;
function showTestimonial(n) {
  tqi = (n + tqs.length) % tqs.length;
  tqs.forEach((t, i) => t.classList.toggle('active', i === tqi));
  tqBtns.forEach((b, i) => b.classList.toggle('active', i === tqi));
  clearInterval(tqTimer);
  tqTimer = setInterval(() => showTestimonial(tqi + 1), 6000);
}
if (tqs.length) {
  tqBtns.forEach((b, i) => b.addEventListener('click', () => showTestimonial(i)));
  showTestimonial(0);
}

// ---------- COUNTERS ----------
const counters = $$('[data-count]');
if (counters.length) {
  const co = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    co.unobserve(e.target);
    const end = +e.target.dataset.count, start = performance.now(), dur = reduceMotion ? 1 : 1600;
    const tick = now => {
      const p = Math.min(1, (now - start) / dur);
      e.target.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }), { threshold: .6 });
  counters.forEach(c => co.observe(c));
}

// ---------- SCROLL REVEAL + PARALLAX ----------
const obs = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('shown'); obs.unobserve(e.target); }
}), { threshold: .12 });
$$('.reveal').forEach(el => obs.observe(el));

const parallax = $$('.parallax');
if (parallax.length && !reduceMotion) {
  const run = () => parallax.forEach(el => {
    const r = el.getBoundingClientRect();
    const off = (r.top + r.height / 2 - innerHeight / 2) * +el.dataset.speed;
    $('img', el).style.transform = `translateY(${off - 20}px)`;
  });
  addEventListener('scroll', run, { passive: true });
  run();
}

// ---------- MODAL & FORMS ----------
const svcMap = {
  hero: '',
  kitchen: 'Kitchen Interiors',
  wardrobe: 'Wardrobe Design',
  home: 'Full Home Design',
  'living-room': 'Room Makeover'
};

function openModal(ctx) {
  const m = $('#modal');
  if (!m) return;
  const sel = $('#msel'), sub = $('#msub');
  if (svcMap[ctx]) {
    sel.value = svcMap[ctx];
    sub.textContent = `Book a consultation for ${svcMap[ctx]}.`;
  } else {
    sel.value = '';
    sub.textContent = "Tell us about your space — we'll make it beautiful.";
  }
  m.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => $('#modal-name')?.focus(), 300);
}

function closeModal() {
  $('#modal')?.classList.remove('open');
  document.body.style.overflow = '';
}

$('#modal')?.addEventListener('click', function (e) { if (e.target === this) closeModal(); });

document.addEventListener('keydown', e => {
  if (lightbox?.classList.contains('active')) {
    if (e.key === 'ArrowRight') nextLightbox();
    if (e.key === 'ArrowLeft') prevLightbox();
    if (e.key === 'Escape') closeLightbox();
    return;
  }
  if (e.key === 'Escape') { closeModal(); if (document.body.classList.contains('menu-open')) toggleMenu(); }
});

const WHATSAPP_NUMBER = '918341032928';
const openWhatsApp = text => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');

// Every enquiry on the site goes to WhatsApp — the booking form builds a
// pre-filled message instead of emailing. Inner pages share this function,
// so optional fields (phone, email) are read only when present.
function submitModal(btn) {
  const val = id => ($('#' + id)?.value || '').trim();
  const name = val('modal-name'), service = val('msel');
  if (!name || !service) {
    alert('Please add your name and choose a service.');
    return;
  }
  const opt = (label, id) => val(id) ? `${label}: ${val(id)}` : null;
  const lines = [
    `Hi Esha Interiors! I'd like to book a free consultation.`,
    '',
    `Name: ${name}`,
    `Service: ${service}`,
    opt('Budget', 'modal-budget'),
    opt('City', 'modal-city'),
    opt('Phone', 'modal-phone'),
    opt('Email', 'modal-email'),
    val('modal-vision') ? `\nAbout my space: ${val('modal-vision')}` : null
  ].filter(l => l !== null);
  openWhatsApp(lines.join('\n'));
  const label = btn.lastChild;
  const original = label.textContent;
  label.textContent = 'Opening WhatsApp…';
  setTimeout(() => { label.textContent = original; closeModal(); }, 1800);
}

// Contact form opens WhatsApp with the message pre-filled instead of emailing.
function handleContactForm(e) {
  e.preventDefault();
  const name = $('#cf-name').value.trim();
  const message = $('#cf-message').value.trim();
  const topic = $('input[name="cf-topic"]:checked')?.value || 'General question';
  if (!name || !message) {
    alert('Please add your name and a short message.');
    return;
  }
  openWhatsApp(`Hi Esha Interiors! I'm ${name}.\nInterested in: ${topic}\n\n${message}`);
  const btn = $('.wa-sub');
  const label = btn.lastChild;
  label.textContent = 'Opening WhatsApp…';
  setTimeout(() => { label.textContent = 'Send on WhatsApp'; }, 2500);
}

// ---------- NAV / FLOATS / MENU ----------
const navbar = $('#navbar'), floatCta = $('#floatCta');
const onScrollNav = () => {
  navbar?.classList.toggle('scrolled', scrollY > 30);
  floatCta?.classList.toggle('vis', scrollY > innerHeight * .8);
};
addEventListener('scroll', onScrollNav, { passive: true });
onScrollNav();

function toggleMenu() {
  const open = document.body.classList.toggle('menu-open');
  $('#hamburger')?.setAttribute('aria-expanded', open);
}
$$('.nav-links a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('menu-open')));

const year = $('#year');
if (year) year.textContent = new Date().getFullYear();
