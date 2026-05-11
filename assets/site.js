(function () {
  const storageKey = 'guitar-site-theme';
  const legacyKeys = [
    'guitar-course-theme',
    'improv-course-theme',
    'arijit-songbook-theme',
    'kishore-songbook-theme'
  ];
  const validThemes = new Set(['light', 'dark']);

  function storedTheme(key) {
    try {
      const saved = localStorage.getItem(key);
      if (validThemes.has(saved)) return saved;
    } catch (error) {}
    return null;
  }

  function preferredTheme() {
    const saved = storedTheme(storageKey);
    if (saved) return saved;

    for (const key of legacyKeys) {
      const legacyTheme = storedTheme(key);
      if (legacyTheme) {
        try {
          localStorage.setItem(storageKey, legacyTheme);
          legacyKeys.forEach((legacyKey) => localStorage.removeItem(legacyKey));
        } catch (error) {}
        return legacyTheme;
      }
    }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function updateThemeLabels(theme) {
    const nextLabel = theme === 'light' ? 'Dark' : 'Light';
    document.querySelectorAll('#theme-label, [data-theme-label]').forEach((label) => {
      label.textContent = nextLabel;
    });

    document.querySelectorAll('.theme-toggle, [data-theme-toggle]').forEach((button) => {
      button.setAttribute('aria-label', `Switch to ${nextLabel.toLowerCase()} mode`);
      button.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    });
  }

  function applyTheme(theme, persist) {
    const nextTheme = validThemes.has(theme) ? theme : 'light';
    document.documentElement.setAttribute('data-theme', nextTheme);
    document.documentElement.style.colorScheme = nextTheme;
    updateThemeLabels(nextTheme);

    if (persist) {
      try {
        localStorage.setItem(storageKey, nextTheme);
      } catch (error) {}
    }
  }

  window.toggleTheme = function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark', true);
  };

  function initNavigation() {
    document.querySelectorAll('.site-header').forEach((header) => {
      const toggle = header.querySelector('.nav-toggle');
      const menu = header.querySelector('.site-menu');
      if (!toggle || !menu) return;

      function setOpen(isOpen) {
        header.classList.toggle('is-open', isOpen);
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        toggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
      }

      toggle.addEventListener('click', () => {
        setOpen(!header.classList.contains('is-open'));
      });

      menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => setOpen(false));
      });

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') setOpen(false);
      });

      document.addEventListener('click', (event) => {
        if (!header.contains(event.target)) setOpen(false);
      });
    });
  }

  function initThemeButtons() {
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        window.toggleTheme();
      });
    });
  }

  function init() {
    applyTheme(preferredTheme(), false);
    initThemeButtons();
    initNavigation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
