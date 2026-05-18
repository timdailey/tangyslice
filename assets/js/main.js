/* ==========================================================================
   TANGYSLICE COLLECTIVE — main.js
   ========================================================================== */


/* ── Mobile nav toggle ────────────────────────────────────────────────────── */

(function () {
  const toggle = document.querySelector('.nav__mobile-toggle');
  const drawer = document.querySelector('.nav__drawer');

  if (!toggle || !drawer) return;

  toggle.addEventListener('click', function () {
    const isOpen = drawer.classList.contains('is-open');
    drawer.classList.toggle('is-open', !isOpen);
    toggle.setAttribute('aria-expanded', String(!isOpen));
  });

  drawer.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      drawer.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      drawer.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });

  document.addEventListener('click', function (e) {
    if (
      drawer.classList.contains('is-open') &&
      !drawer.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      drawer.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();


/* ── Table of contents ────────────────────────────────────────────────────── */

(function () {
  const postContent   = document.getElementById('post-content');
  const sidebarList   = document.getElementById('sidebar-toc-list');
  const mobileDrawer  = document.getElementById('toc-mobile-drawer');
  const mobileBtn     = document.getElementById('toc-mobile-btn');
  const mobileChevron = mobileBtn && mobileBtn.querySelector('.toc-mobile__chevron');

  if (!postContent) return;

  const headings = Array.from(postContent.querySelectorAll('h2'));

  if (!headings.length) {
    const tocMobile = document.getElementById('toc-mobile');
    if (tocMobile) tocMobile.style.display = 'none';
    const sidebar = document.getElementById('post-sidebar');
    if (sidebar) sidebar.style.display = 'none';
    return;
  }

  headings.forEach(function (h) {
    if (!h.id) {
      h.id = h.textContent
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }
  });

  if (sidebarList) {
    headings.forEach(function (h) {
      const li = document.createElement('li');
      li.className = 'sidebar-toc__item';
      const a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent;
      a.className = 'sidebar-toc__link';
      li.appendChild(a);
      sidebarList.appendChild(li);
    });
  }

  if (mobileDrawer) {
    headings.forEach(function (h) {
      const a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent;
      a.className = 'toc-mobile__link';
      a.addEventListener('click', function () {
        mobileDrawer.classList.remove('is-open');
        if (mobileChevron) mobileChevron.classList.remove('is-open');
        if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'false');
      });
      mobileDrawer.appendChild(a);
    });
  }

  if (mobileBtn) {
    mobileBtn.addEventListener('click', function () {
      const isOpen = mobileDrawer.classList.contains('is-open');
      mobileDrawer.classList.toggle('is-open', !isOpen);
      if (mobileChevron) mobileChevron.classList.toggle('is-open', !isOpen);
      mobileBtn.setAttribute('aria-expanded', String(!isOpen));
    });
  }

  if (sidebarList && 'IntersectionObserver' in window) {
    const sidebarLinks = sidebarList.querySelectorAll('.sidebar-toc__link');

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          const id = entry.target.id;
          const link = sidebarList.querySelector('a[href="#' + id + '"]');
          if (!link) return;

          if (entry.isIntersecting) {
            sidebarLinks.forEach(function (l) { l.classList.remove('is-active'); });
            link.classList.add('is-active');
          }
        });
      },
      {
        rootMargin: '-72px 0px -70% 0px',
        threshold: 0
      }
    );

    headings.forEach(function (h) { observer.observe(h); });
  }
})();


/* ── Smooth scroll for anchor links ──────────────────────────────────────── */

(function () {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();


/* ── Scroll-triggered fade-in ────────────────────────────────────────────── */

(function () {
  const elements = document.querySelectorAll('.js-fade');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  elements.forEach(function (el) { observer.observe(el); });
})();


/* ── Active nav link ─────────────────────────────────────────────────────── */

(function () {
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav__links a, .nav__drawer a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (!href) return;
    if (href === currentPath || (href !== '/' && currentPath.startsWith(href))) {
      link.setAttribute('aria-current', 'page');
    }
  });
})();


/* ── Services jump nav scroll spy ───────────────────────────────────────── */

(function () {
  const navLinks = document.querySelectorAll('.svc-nav__link');
  if (!navLinks.length) return;

  const sections = Array.from(navLinks).map(function (link) {
    const id = link.getAttribute('href').replace('#', '');
    return document.getElementById(id);
  }).filter(Boolean);

  if (!sections.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.remove('is-active'); });
          const active = document.querySelector('.svc-nav__link[href="#' + entry.target.id + '"]');
          if (active) active.classList.add('is-active');
        }
      });
    },
    { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
  );

  sections.forEach(function (s) { observer.observe(s); });
})();
