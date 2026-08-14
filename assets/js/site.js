/* Academy — site behaviour.
   Progressive enhancement only: every page works with this file absent.
   The mobile nav is visible by default and only collapses once the `js` class
   is set (in the inline head script), so blocking this file degrades to a
   longer header rather than to no navigation. */

(function () {
  'use strict';

  var root = document.documentElement;

  /* ---- Theme toggle -------------------------------------------------------
     The stored preference is applied in an inline <head> script to avoid a
     flash; this handles switching and announcing it. With nothing stored the
     page follows the system preference, so resolve what is actually showing
     before picking the opposite. */

  var STORAGE_KEY = 'academy-theme';
  var toggle = document.getElementById('theme-toggle');

  function currentTheme() {
    var explicit = root.getAttribute('data-theme');
    if (explicit === 'light' || explicit === 'dark') return explicit;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function labelToggle() {
    if (!toggle) return;
    // Name the destination, not the current state — the icon is aria-hidden,
    // so this label is the only thing a screen reader has to go on.
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    toggle.setAttribute('aria-label', 'Switch to ' + next + ' theme');
  }

  if (toggle) {
    labelToggle();
    toggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (e) { /* storage unavailable — the choice just won't persist */ }
      labelToggle();
      announce(next === 'dark' ? 'Dark theme on' : 'Light theme on');
    });
  }

  /* ---- Live region --------------------------------------------------------
     One shared polite region for transient confirmations. */

  var liveRegion = document.createElement('div');
  liveRegion.setAttribute('role', 'status');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.className = 'visually-hidden';
  document.body.appendChild(liveRegion);

  function announce(message) {
    liveRegion.textContent = '';
    // Re-setting after a tick makes repeat messages announce again.
    window.setTimeout(function () { liveRegion.textContent = message; }, 50);
  }

  /* ---- Mobile navigation ------------------------------------------------- */

  var navToggle = document.getElementById('nav-toggle');
  var navMenu = document.getElementById('nav-menu');

  function closeNav(returnFocus) {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation menu');
    if (returnFocus) navToggle.focus();
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');

      // The panel precedes the button in the DOM, so Tab would skip past it.
      // Move focus in explicitly.
      if (isOpen) {
        var first = navMenu.querySelector('a');
        if (first) first.focus();
      }
    });

    // Following an in-page anchor leaves the menu covering the target.
    navMenu.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeNav(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && navMenu.classList.contains('is-open')) {
        closeNav(true);
      }
    });

    document.addEventListener('click', function (event) {
      if (!navMenu.classList.contains('is-open')) return;
      if (event.target.closest('.site-nav')) return;
      closeNav(false);
    });
  }

  /* ---- Carousel controls -------------------------------------------------
     The track scrolls natively and takes keyboard arrows on its own, so these
     buttons are an enhancement, not the mechanism. Injected rather than
     authored so they never sit inert with JS unavailable. */

  document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
    var track = carousel.querySelector('.carousel__track');
    var slide = track && track.querySelector('.carousel__slide');
    if (!track || !slide) return;

    var controls = document.createElement('div');
    controls.className = 'carousel__controls';

    function makeButton(dir, label, glyph) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'carousel__btn';
      b.setAttribute('aria-label', label);
      b.innerHTML = '<span aria-hidden="true">' + glyph + '</span>';
      b.addEventListener('click', function () {
        var step = slide.getBoundingClientRect().width + 20;
        track.scrollBy({ left: dir * step, behavior: 'smooth' });
      });
      return b;
    }

    var prev = makeButton(-1, 'Previous diagram', '&larr;');
    var next = makeButton(1, 'Next diagram', '&rarr;');
    controls.appendChild(prev);
    controls.appendChild(next);
    carousel.appendChild(controls);

    function syncDisabled() {
      prev.disabled = track.scrollLeft < 8;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
    }

    track.addEventListener('scroll', syncDisabled, { passive: true });
    window.addEventListener('resize', syncDisabled);
    syncDisabled();
  });

  /* ---- Vision figure ------------------------------------------------------
     The "where agents live" diagram. Everything the figure means is already in
     the markup — four identical entities, the Academy agent inside each one,
     all five instrument bubbles with their tethers drawn, the whole wire
     network, and four mailboxes with their flags down — so this file adds no
     content at all. It does exactly one thing: it lets the motion run only
     while the figure is on screen.

     It injects no control. The pause button was removed at the client's
     request; motion still stops entirely for anyone with
     prefers-reduced-motion, and whenever the figure scrolls out of view.

     The motion is gated from here, so with scripting blocked the figure is
     static and complete. */

  var vision = document.querySelector('[data-vision]');

  if (vision && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // No control is injected: the client asked for the pause button to go.
    // Motion still stops entirely for anyone with prefers-reduced-motion, and
    // nothing animates while the figure is off screen.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          vision.classList.toggle('is-running', entry.isIntersecting);
        });
      }, { threshold: 0.2 }).observe(vision);
    } else {
      vision.classList.add('is-running');
    }
  }

  /* ---- Copy buttons -------------------------------------------------------
     Injected rather than authored into the templates: without JS, or on a
     non-secure origin where navigator.clipboard is undefined, a hard-coded
     button would still be focusable and look interactive while doing nothing.
     Building them here means they exist only when they work. */

  if (navigator.clipboard) {
    document.querySelectorAll('.code-block').forEach(function (block) {
      var source = block.querySelector('pre');
      if (!source) return;

      var header = block.querySelector('.code-block__header');
      var label = header && header.querySelector('span');
      // Distinguish the buttons from each other: "Copy" five times over is a
      // useless list for anyone navigating by control.
      var what = label ? label.textContent.trim() : 'this code block';

      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'copy-button';
      button.textContent = 'Copy';
      button.setAttribute('aria-label', 'Copy the code: ' + what);

      button.addEventListener('click', function () {
        navigator.clipboard.writeText(source.innerText.trim()).then(function () {
          button.textContent = 'Copied';
          announce(what + ' copied to clipboard');
          window.setTimeout(function () { button.textContent = 'Copy'; }, 1600);
        }).catch(function () {
          announce('Copy failed');
        });
      });

      if (header) {
        header.appendChild(button);
      } else {
        block.classList.add('code-block--bare');
        block.appendChild(button);
      }
    });
  }
})();
