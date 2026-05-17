// LIGHTBOX GALLERY
const gallery = [
  { img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&h=800&fit=crop', title: 'Modern Living', subtitle: 'Hyderabad • ₹75,000' },
  { img: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?w=1200&h=800&fit=crop', title: 'Modular Kitchen', subtitle: 'Hyderabad • ₹50,000' },
  { img: 'https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=1200&h=800&fit=crop', title: 'Bedroom Haven', subtitle: 'Hyderabad • ₹75,000' },
  { img: 'https://images.unsplash.com/photo-1672137233327-37b0c1049e77?w=1200&h=800&fit=crop', title: 'Walk-in Wardrobe', subtitle: 'Hyderabad • ₹50,000' },
  { img: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=1200&h=800&fit=crop', title: 'Contemporary Space', subtitle: 'Hyderabad • ₹75,000' },
  { img: 'https://images.unsplash.com/photo-1628797285815-453c1d0d21e3?w=1200&h=800&fit=crop', title: 'Premium Kitchen', subtitle: 'Hyderabad • ₹50,000' }
];
let currentGalleryIndex = 0;

function openLightbox(index) {
  currentGalleryIndex = index;
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  const title = document.getElementById('lightboxTitle');
  const subtitle = document.getElementById('lightboxSubtitle');

  img.src = gallery[index].img;
  title.textContent = gallery[index].title;
  subtitle.textContent = gallery[index].subtitle;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

function nextLightbox() {
  currentGalleryIndex = (currentGalleryIndex + 1) % gallery.length;
  openLightbox(currentGalleryIndex);
}

function prevLightbox() {
  currentGalleryIndex = (currentGalleryIndex - 1 + gallery.length) % gallery.length;
  openLightbox(currentGalleryIndex);
}

document.addEventListener('keydown', e => {
  if (document.getElementById('lightbox').classList.contains('active')) {
    if (e.key === 'ArrowRight') nextLightbox();
    if (e.key === 'ArrowLeft') prevLightbox();
    if (e.key === 'Escape') closeLightbox();
  }
});

document.getElementById('lightbox').addEventListener('click', e => {
  if (e.target.id === 'lightbox') closeLightbox();
});

// CAROUSEL
let cur = 0, total = 3, timer;

function goTo(n) {
  // Update background carousel only (content is now static)
  const bgSlides = document.querySelectorAll('.hero-bg-slide');
  bgSlides.forEach((s, i) => s.classList.toggle('active', i === n));

  // Update dots
  const dots = document.querySelectorAll('.dot');
  dots.forEach((d, i) => d.classList.toggle('active', i === n));

  cur = n;
}

function nextSlide(offset = 1) {
  if (offset === -1) goTo((cur - 1 + total) % total);
  else if (offset === 1) goTo((cur + 1) % total);
  else goTo(offset);
  resetTimer();
}

function resetTimer() {
  clearInterval(timer);
  timer = setInterval(() => nextSlide(1), 5200);
}

resetTimer();

// TESTIMONIALS
let tc = 0;

function moveTestimonials(n) {
  const track = document.getElementById('testimonial-track');
  if (!track) return;
  const w = track.querySelector('.test-card').offsetWidth + 24;
  track.scrollTo({ left: n * w, behavior: 'smooth' });
  document.querySelectorAll('.test-dot').forEach((d, i) => d.classList.toggle('active', i === n / 3));
  tc = n;
}

setInterval(() => moveTestimonials((tc + 3) % 12), 4200);

// MODAL & FORM HANDLING
const svcMap = {
  hero: '',
  kitchen: 'Kitchen Interiors',
  wardrobe: 'Wardrobe Design',
  home: 'Full Home Design',
  'living-room': 'Living Room Design'
};

function openModal(ctx) {
  const m = document.getElementById('modal');
  const sel = document.getElementById('msel');
  const sub = document.getElementById('msub');
  if (svcMap[ctx]) {
    sel.value = svcMap[ctx];
    sub.textContent = `Book a consultation for ${svcMap[ctx]}.`;
  } else {
    sel.value = '';
    sub.textContent = "Tell us about your space — we'll make it beautiful.";
  }
  m.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('modal').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

async function submitModal(btn) {
  const name = document.getElementById('modal-name').value.trim();
  const phone = document.getElementById('modal-phone').value.trim();
  const email = document.getElementById('modal-email').value.trim();
  const service = document.getElementById('msel').value;
  const budget = document.getElementById('modal-budget').value;
  const city = document.getElementById('modal-city').value.trim();
  const vision = document.getElementById('modal-vision').value.trim();

  if (!name || !phone || !email || !service) {
    alert('Please fill in all required fields');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Submitting...';

  try {
    // Send to Supabase
    const response = await fetch('/.netlify/functions/submit-consultation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, email, service, budget, city, vision })
    });

    if (response.ok) {
      btn.textContent = 'Sent! We\'ll call you soon ✓';
      btn.style.background = '#6a8c5a';
      setTimeout(() => {
        closeModal();
        btn.textContent = 'Send Request →';
        btn.style.background = '';
        btn.disabled = false;
        // Clear form
        document.getElementById('modal-name').value = '';
        document.getElementById('modal-phone').value = '';
        document.getElementById('modal-email').value = '';
        document.getElementById('msel').value = '';
        document.getElementById('modal-budget').value = 'Under ₹10,000';
        document.getElementById('modal-city').value = '';
        document.getElementById('modal-vision').value = '';
      }, 2000);
    } else {
      throw new Error('Submission failed');
    }
  } catch (error) {
    console.error('Error:', error);
    btn.textContent = 'Error! Please try again';
    btn.style.background = '#c85a5a';
    setTimeout(() => {
      btn.textContent = 'Send Request →';
      btn.style.background = '';
      btn.disabled = false;
    }, 2000);
  }
}

async function handleContactForm(e) {
  e.preventDefault();
  const name = document.getElementById('cf-name').value.trim();
  const phone = document.getElementById('cf-phone').value.trim();
  const email = document.getElementById('cf-email').value.trim();
  const subject = document.getElementById('cf-subject').value;
  const message = document.getElementById('cf-message').value.trim();

  if (!name || !phone || !email || !message) {
    alert('Please fill in all required fields');
    return;
  }

  const submitBtn = document.querySelector('.form-sub');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  try {
    const response = await fetch('/.netlify/functions/submit-contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, email, subject, message })
    });

    if (response.ok) {
      submitBtn.textContent = 'Message Sent! We\'ll reply soon ✓';
      submitBtn.style.background = '#6a8c5a';
      setTimeout(() => {
        document.getElementById('contact-form').reset();
        submitBtn.textContent = 'Send Message';
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 2000);
    } else {
      throw new Error('Submission failed');
    }
  } catch (error) {
    console.error('Error:', error);
    submitBtn.textContent = 'Error! Please try again';
    submitBtn.style.background = '#c85a5a';
    setTimeout(() => {
      submitBtn.textContent = 'Send Message';
      submitBtn.style.background = '';
      submitBtn.disabled = false;
    }, 2000);
  }
}

// FILTER PROJECTS
function filterProjects(category) {
  const items = document.querySelectorAll('[data-category]');
  const buttons = document.querySelectorAll('.fil-btn');

  buttons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  items.forEach(item => {
    const show = category === 'all' || item.dataset.category === category;
    item.style.opacity = show ? '1' : '0.22';
    item.style.pointerEvents = show ? 'auto' : 'none';
  });
}

// SCROLL REVEAL
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('shown');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// FLOATING CTA + NAV SHADOW
const floatCta = document.getElementById('floatCta');
window.addEventListener('scroll', () => {
  floatCta.classList.toggle('vis', scrollY > 500);
  document.getElementById('navbar').style.boxShadow = scrollY > 10 ? '0 2px 20px rgba(0,0,0,.08)' : 'none';
});

// MOBILE MENU
function toggleMenu() {
  const ul = document.querySelector('.nav-links');
  const open = ul.style.display === 'flex';
  ul.style.cssText = open ? 'display:none' : 'display:flex;flex-direction:column;position:fixed;top:72px;left:0;right:0;background:white;padding:24px 20px;gap:18px;border-bottom:1px solid #e4dbd0;z-index:190';
}

// SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) {
      e.preventDefault();
      t.scrollIntoView({ behavior: 'smooth' });
      if (window.innerWidth < 900) {
        document.querySelector('.nav-links').style.display = 'none';
      }
    }
  });
});

// Initialize on document ready
document.addEventListener('DOMContentLoaded', () => {
  // Any initialization code here
  console.log('Esha Interiors - Ready');
});
