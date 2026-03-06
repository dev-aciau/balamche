/* ============================================================
   BALAMCHE PARK – Main JavaScript
   All interactive behaviour for the landing page.
   Loaded with `defer` so the DOM is always ready on execution.
   ============================================================ */


/* ─── 1. Navbar: transparent → solid background on scroll ────────────── */

const navbar = document.getElementById('navbar');

/**
 * Adds/removes Tailwind classes to turn the navbar from transparent
 * to a blurred forest-green background once the user scrolls past 60px.
 */
function updateNavbar() {
  if (window.scrollY > 60) {
    navbar.classList.add('bg-forest/95', 'backdrop-blur-md', 'shadow-lg');
    navbar.classList.remove('text-white');
  } else {
    navbar.classList.remove('bg-forest/95', 'backdrop-blur-md', 'shadow-lg');
  }
}

// Bind scroll listener and run once immediately to set the initial state.
window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();


/* ─── 2. Mobile menu toggle ───────────────────────────────────────────── */

const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const iconOpen   = document.getElementById('icon-open');
const iconClose  = document.getElementById('icon-close');

/** Opens / closes the mobile navigation drawer. */
menuToggle.addEventListener('click', () => {
  const isOpen = !mobileMenu.classList.contains('hidden');

  mobileMenu.classList.toggle('hidden', isOpen);
  mobileMenu.classList.toggle('flex', !isOpen);
  iconOpen.classList.toggle('hidden', !isOpen);
  iconClose.classList.toggle('hidden', isOpen);
});

/** Collapses the mobile menu automatically when any link inside it is clicked. */
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    mobileMenu.classList.remove('flex');
    iconOpen.classList.remove('hidden');
    iconClose.classList.add('hidden');
  });
});


/* ─── 3. Scroll-reveal via IntersectionObserver ──────────────────────── */
/* Every element with class `.reveal` starts invisible (see main.css) and  */
/* gets the `.visible` class added once it enters the viewport.            */

const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Unobserve after the first trigger so the animation runs only once.
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));


/* ─── 4. Smooth scroll for internal anchor links ─────────────────────── */
/* Overrides the browser's default jump-to, accounting for the fixed
   navbar height so content isn't hidden underneath it.                   */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = navbar.offsetHeight + 8;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


/* ─── 5. Active nav-link highlight on scroll ─────────────────────────── */
/* Uses a second IntersectionObserver to detect which section is in view
   and applies the `text-leaf` Tailwind colour to the matching nav link.  */

const sections = document.querySelectorAll('section[id], div[id]');
const navLinks = document.querySelectorAll('#navbar a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        const isActive = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('text-leaf',    isActive);
        link.classList.toggle('text-white/90', !isActive);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));


/* ─── 6. Hero entrance animation ─────────────────────────────────────── */
/* Fades-in and slides up the hero content block on first load.           */

window.addEventListener('DOMContentLoaded', () => {
  const heroContent = document.querySelector('#hero > div');
  if (heroContent) {
    heroContent.style.opacity    = '0';
    heroContent.style.transform  = 'translateY(30px)';
    heroContent.style.transition = 'opacity 1s ease 0.2s, transform 1s ease 0.2s';

    // Trigger on the next animation frame so the initial hidden state is painted first.
    requestAnimationFrame(() => {
      heroContent.style.opacity   = '1';
      heroContent.style.transform = 'none';
    });
  }
});
