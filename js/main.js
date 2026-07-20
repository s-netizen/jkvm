/* JKVM — redesign interactions */
(function () {
  'use strict';

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  document.addEventListener('DOMContentLoaded', function () {
    initHeaderScroll();
    initMobileDrawer();
    initDrawerSubmenus();
    initAnnouncement();
    initScrollReveal();
    initReadMore();
    initHorizontalCarousel('highlightsTrack', 'highlightsPrev', 'highlightsNext');
    initLightbox();
    initTeamFilter();
    initVideoModal();
    initNewsletter();
    initBackToTop();
    initYear();
  });

  /* ---------- Sticky header shrink ---------- */
  function initHeaderScroll() {
    var header = $('#siteHeader');
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile drawer ---------- */
  function initMobileDrawer() {
    var btn = $('#hamburgerBtn'), drawer = $('#mobileDrawer'), backdrop = $('#drawerBackdrop'), closeBtn = $('#drawerCloseBtn');
    if (!btn || !drawer) return;

    function open() {
      drawer.classList.add('is-open');
      backdrop.classList.add('is-open');
      btn.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      drawer.classList.remove('is-open');
      backdrop.classList.remove('is-open');
      btn.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
    btn.addEventListener('click', function () {
      drawer.classList.contains('is-open') ? close() : open();
    });
    closeBtn && closeBtn.addEventListener('click', close);
    backdrop && backdrop.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  function initDrawerSubmenus() {
    $$('.drawer-item').forEach(function (item) {
      var toggle = $('.drawer-link', item);
      var sub = $('.drawer-sub', item);
      if (!toggle || !sub) return;
      toggle.addEventListener('click', function () {
        var isOpen = sub.classList.toggle('is-open');
        item.classList.toggle('is-open', isOpen);
      });
    });
  }

  /* ---------- Announcement bar (dismissible, persisted) ---------- */
  function initAnnouncement() {
    var bar = $('#announceBar'), closeBtn = $('#announceClose');
    if (!bar || !closeBtn) return;
    var KEY = 'jkvm-announce-dismissed';
    try {
      if (localStorage.getItem(KEY) === '1') bar.classList.add('is-dismissed');
    } catch (e) {}
    closeBtn.addEventListener('click', function () {
      bar.classList.add('is-dismissed');
      try { localStorage.setItem(KEY, '1'); } catch (e) {}
    });
  }

  /* ---------- Scroll reveal ---------- */
  function initScrollReveal() {
    var items = $$('.reveal');
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Read more (Our Story) ---------- */
  function initReadMore() {
    var btn = $('#readMoreBtn'), panel = $('#storyMore');
    if (!btn || !panel) return;
    btn.addEventListener('click', function () {
      var isOpen = panel.classList.toggle('is-open');
      btn.classList.toggle('is-open', isOpen);
      btn.setAttribute('aria-expanded', String(isOpen));
      $('span', btn).textContent = isOpen ? 'Read less' : 'Read more';
    });
  }

  /* ---------- Generic horizontal scroll-snap carousel controls ---------- */
  function initHorizontalCarousel(trackId, prevId, nextId) {
    var track = document.getElementById(trackId);
    var prev = document.getElementById(prevId);
    var next = document.getElementById(nextId);
    if (!track) return;
    function step() {
      var card = track.querySelector(':scope > *');
      return card ? card.getBoundingClientRect().width + 20 : 300;
    }
    prev && prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    next && next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
  }

  /* ---------- Gallery lightbox ---------- */
  function initLightbox() {
    var grid = $('#masonryGrid');
    var lightbox = $('#lightbox');
    if (!grid || !lightbox) return;
    var imgs = $$('.masonry-item img', grid);
    var imgEl = $('#lightboxImg'), captionEl = $('#lightboxCaption');
    var current = 0;

    function show(i) {
      current = (i + imgs.length) % imgs.length;
      var src = imgs[current].getAttribute('src');
      imgEl.src = src;
      imgEl.alt = imgs[current].alt;
      captionEl.textContent = imgs[current].alt;
    }
    function open(i) {
      show(i);
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    imgs.forEach(function (img, i) {
      img.closest('.masonry-item').addEventListener('click', function () { open(i); });
    });
    $('#lightboxClose').addEventListener('click', close);
    $('#lightboxPrev').addEventListener('click', function () { show(current - 1); });
    $('#lightboxNext').addEventListener('click', function () { show(current + 1); });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
    });
  }

  /* ---------- Executive team filter ---------- */
  function initTeamFilter() {
    var tabs = $$('.team-filters .gallery-tab');
    if (!tabs.length) return;
    var cards = $$('.team-card, .member-avatar');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('is-active'); });
        tab.classList.add('is-active');
        var filter = tab.getAttribute('data-filter');
        cards.forEach(function (card) {
          var role = card.getAttribute('data-role');
          var match = filter === 'all' || role === filter;
          card.classList.toggle('is-hidden', !match);
        });
      });
    });
  }

  /* ---------- Video modal (YouTube embed / placeholder) ---------- */
  function initVideoModal() {
    var cards = $$('.video-card');
    var modal = $('#videoModal'), inner = $('#videoModalInner'), closeBtn = $('#videoModalClose');
    if (!cards.length || !modal) return;

    function open(card) {
      var videoId = card.getAttribute('data-video-id');
      var title = $('.video-info h3', card);
      title = title ? title.textContent : 'JKVM video';
      inner.innerHTML = '';

      if (videoId) {
        var iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube.com/embed/' + encodeURIComponent(videoId) + '?autoplay=1&rel=0';
        iframe.title = title;
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        inner.appendChild(iframe);
      } else {
        var placeholder = document.createElement('div');
        placeholder.className = 'video-modal-placeholder';
        placeholder.innerHTML = '<strong>' + title + '</strong><span>Video embed goes here — add the YouTube video ID to <code>data-video-id</code> on this card.</span>';
        inner.appendChild(placeholder);
      }
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function shut() {
      modal.classList.remove('is-open');
      inner.innerHTML = '';
      document.body.style.overflow = '';
    }
    cards.forEach(function (card) {
      card.addEventListener('click', function () { open(card); });
    });
    closeBtn && closeBtn.addEventListener('click', shut);
    modal.addEventListener('click', function (e) { if (e.target === modal) shut(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) shut();
    });
  }

  /* ---------- Newsletter (client-side demo) ---------- */
  function initNewsletter() {
    var form = $('#newsletterForm'), note = $('#newsletterNote');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = $('input', form);
      if (!input.value) return;
      note.textContent = 'Thanks — you’re on the list!';
      note.classList.add('success');
      form.reset();
    });
  }

  /* ---------- Back to top ---------- */
  function initBackToTop() {
    var btn = $('#backToTop');
    if (!btn) return;
    window.addEventListener('scroll', function () {
      btn.classList.toggle('is-visible', window.scrollY > 600);
    }, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function initYear() {
    var el = $('#year');
    if (el) el.textContent = new Date().getFullYear();
  }
})();
