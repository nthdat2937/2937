(function () {
  const STORAGE_KEYS = {
    THEME: 'pref_theme', // 'dark' | 'light'
    ANIMATIONS: 'pref_animations', // 'true' | 'false'
    EFFECTS: 'pref_effects', // 'true' | 'false'
    COMPACT: 'pref_compact', // 'true' | 'false'
  };

  const DEFAULTS = {
    theme: 'dark',
    animations: true,
    effects: true,
    compact: false,
  };

  function toBool(val, defVal) {
    if (val === null || val === undefined) return defVal;
    if (typeof val === 'boolean') return val;
    return String(val) === 'true';
  }

  function loadPrefs() {
    return {
      theme: localStorage.getItem(STORAGE_KEYS.THEME) || DEFAULTS.theme,
      animations: toBool(localStorage.getItem(STORAGE_KEYS.ANIMATIONS), DEFAULTS.animations),
      effects: toBool(localStorage.getItem(STORAGE_KEYS.EFFECTS), DEFAULTS.effects),
      compact: toBool(localStorage.getItem(STORAGE_KEYS.COMPACT), DEFAULTS.compact),
    };
  }

  function savePrefs(prefs) {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, prefs.theme);
      localStorage.setItem(STORAGE_KEYS.ANIMATIONS, String(prefs.animations));
      localStorage.setItem(STORAGE_KEYS.EFFECTS, String(prefs.effects));
      localStorage.setItem(STORAGE_KEYS.COMPACT, String(prefs.compact));
    } catch (e) {
      console.warn('Không thể lưu cài đặt vào localStorage:', e);
    }
  }

  function applyPrefs(prefs) {
    const b = document.body;
    // Theme
    b.classList.toggle('theme-dark', prefs.theme === 'dark');
    b.classList.toggle('theme-light', prefs.theme === 'light');
    // Animations
    b.classList.toggle('no-animations', !prefs.animations);
    // Visual effects (blur, shadows, backgrounds)
    b.classList.toggle('no-effects', !prefs.effects);
    // Density / compact mode
    b.classList.toggle('compact', prefs.compact);
  }

  function syncUI(prefs) {
    const themeToggle = document.getElementById('toggleTheme');
    const animToggle = document.getElementById('toggleAnimations');
    const effectsToggle = document.getElementById('toggleEffects');
    const compactToggle = document.getElementById('toggleCompact');

    if (themeToggle) themeToggle.checked = prefs.theme === 'dark';
    if (animToggle) animToggle.checked = prefs.animations === true;
    if (effectsToggle) effectsToggle.checked = prefs.effects === true;
    if (compactToggle) compactToggle.checked = prefs.compact === true;
  }

  function attachHandlers() {
    const themeToggle = document.getElementById('toggleTheme');
    const animToggle = document.getElementById('toggleAnimations');
    const effectsToggle = document.getElementById('toggleEffects');
    const compactToggle = document.getElementById('toggleCompact');

    if (themeToggle) {
      themeToggle.addEventListener('change', (e) => {
        const prefs = loadPrefs();
        prefs.theme = e.target.checked ? 'dark' : 'light';
        savePrefs(prefs);
        applyPrefs(prefs);
      });
    }

    if (animToggle) {
      animToggle.addEventListener('change', (e) => {
        const prefs = loadPrefs();
        prefs.animations = !!e.target.checked;
        savePrefs(prefs);
        applyPrefs(prefs);
      });
    }

    if (effectsToggle) {
      effectsToggle.addEventListener('change', (e) => {
        const prefs = loadPrefs();
        prefs.effects = !!e.target.checked;
        savePrefs(prefs);
        applyPrefs(prefs);
      });
    }

    if (compactToggle) {
      compactToggle.addEventListener('change', (e) => {
        const prefs = loadPrefs();
        prefs.compact = !!e.target.checked;
        savePrefs(prefs);
        applyPrefs(prefs);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const prefs = loadPrefs();
    applyPrefs(prefs);
    syncUI(prefs);
    attachHandlers();
  });
})();
