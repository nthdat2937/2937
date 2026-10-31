/**
 * 🍎 Liquid Glass JS - Bridge & Auto-Initializer
 * High-performance, pure Apple Vision Pro Liquid Glass engine for music-live
 * Provides hardware-accelerated frosted glass & interactive cursor-tracking specular sheen
 */
(function() {
  const LiquidGlass = {
    instances: new Map(),

    attach(element, options = {}) {
      if (!element || this.instances.has(element)) {
        return this.instances.get(element);
      }

      // Ensure base liquid glass classes
      element.classList.add('liquid-glass-btn');

      // Auto-detect & apply shape classes if not present
      if (!element.classList.contains('pill-btn') && !element.classList.contains('circle-btn') && !element.classList.contains('rounded-btn')) {
        let type = options.type;
        if (!type) {
          const comp = window.getComputedStyle(element);
          const br = parseFloat(comp.borderRadius) || 0;
          const w = parseFloat(comp.width) || 0;
          const h = parseFloat(comp.height) || 0;

          if (br >= 20 || (comp.borderRadius && comp.borderRadius.includes('9999px'))) {
            type = 'pill';
          } else if (br > 0 && Math.abs(w - h) < 8 && br >= w * 0.4) {
            type = 'circle';
          } else {
            type = 'rounded';
          }
        }

        if (type === 'circle') {
          element.classList.add('circle-btn');
        } else if (type === 'pill') {
          element.classList.add('pill-btn');
        } else {
          element.classList.add('rounded-btn');
        }
      }

      // Clean up any rogue blocking canvas
      const rogueCanvas = element.querySelector('canvas.glass-canvas');
      if (rogueCanvas) {
        rogueCanvas.remove();
      }

      // Interactive cursor-following specular sheen
      const onPointerMove = (e) => {
        const rect = element.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          element.style.setProperty('--glass-x', `${x.toFixed(1)}%`);
          element.style.setProperty('--glass-y', `${y.toFixed(1)}%`);
        }
      };

      const onPointerLeave = () => {
        element.style.setProperty('--glass-x', '50%');
        element.style.setProperty('--glass-y', '50%');
      };

      element.addEventListener('pointermove', onPointerMove, { passive: true });
      element.addEventListener('pointerleave', onPointerLeave, { passive: true });

      const instance = {
        element: element,
        updateSizeFromDOM: () => {},
        render: () => {}
      };

      this.instances.set(element, instance);
      element.__liquidGlassInstance = instance;

      return instance;
    },

    init(selector = '.liquid-glass-btn, .glass-button, .challenge-btn, .caro-btn, .login-btn, .google-auth-btn, .draw-admin-btn, .draw-random-btn, .draw-close-btn, .lightbox-toolbar button, .top-tab-preset-btn, .settings-btn-save, .settings-btn-cancel, .settings-btn-secondary, .settings-btn') {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => this.attach(el));
      } catch (err) {
        console.warn('LiquidGlass.init error:', err);
      }
    },

    refresh() {
      try {
        this.init();
      } catch (err) {
        console.warn('LiquidGlass.refresh error:', err);
      }
    }
  };

  window.LiquidGlass = LiquidGlass;

  // Auto-init on DOMContentLoaded & load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => LiquidGlass.init(), 40);
    });
  } else {
    setTimeout(() => LiquidGlass.init(), 40);
  }

  window.addEventListener('load', () => {
    setTimeout(() => LiquidGlass.refresh(), 150);
  });
})();
