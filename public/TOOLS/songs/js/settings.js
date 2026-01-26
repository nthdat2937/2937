// ===== SETTINGS SYSTEM =====

// Khởi tạo settings mặc định
const defaultSettings = {
    animations: true,
    backgroundEffects: true,
    glowEffects: true,
    theme: 'dark'
  };
  
  // Load settings từ localStorage
  function loadSettings() {
    const saved = localStorage.getItem('ntdMusicSettings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  }
  
  // Save settings vào localStorage
  function saveSettings(settings) {
    localStorage.setItem('ntdMusicSettings', JSON.stringify(settings));
  }
  
  // Apply settings vào document
  function applySettings(settings) {
    const root = document.documentElement;
    
    // Theme
    root.setAttribute('data-theme', settings.theme);
    const themeIcon = document.getElementById('themeIcon');
    const sidebarIcon = document.getElementById('themeIconSidebar');
    if (themeIcon) themeIcon.className = settings.theme === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    if (sidebarIcon) sidebarIcon.className = settings.theme === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    
    // Animations
    if (!settings.animations) {
      root.style.setProperty('--animation-duration', '0s');
      root.style.setProperty('--transition-duration', '0s');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }
    
    // Background Effects
    if (!settings.backgroundEffects) {
      document.body.classList.add('no-bg-effects');
    } else {
      document.body.classList.remove('no-bg-effects');
    }
    
    // Glow Effects
    if (!settings.glowEffects) {
      root.style.setProperty('--glow-opacity', '0');
    } else {
      root.style.removeProperty('--glow-opacity');
    }
  }
  
  // Mở Settings Dialog
  window.openSettingsDialog = function() {
    const settings = loadSettings();
    
    // Update checkbox states
    document.getElementById('settingAnimations').checked = settings.animations;
    document.getElementById('settingBackgroundEffects').checked = settings.backgroundEffects;
    document.getElementById('settingGlowEffects').checked = settings.glowEffects;
    document.getElementById('settingTheme').value = settings.theme;
    
    settingsDialog.showModal();
  };
  
  // Save Settings
  document.getElementById('settingsForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newSettings = {
      animations: document.getElementById('settingAnimations').checked,
      backgroundEffects: document.getElementById('settingBackgroundEffects').checked,
      glowEffects: document.getElementById('settingGlowEffects').checked,
      theme: document.getElementById('settingTheme').value
    };
    
    saveSettings(newSettings);
    applySettings(newSettings);
    
    settingsDialog.close();
    alert('✅ Đã lưu cài đặt!');
  });
  
  // Reset Settings
  window.resetSettings = function() {
    if (!confirm('Bạn có chắc muốn đặt lại về mặc định?')) return;
    
    saveSettings(defaultSettings);
    applySettings(defaultSettings);
    openSettingsDialog(); // Refresh dialog
    
    alert('🔄 Đã đặt lại cài đặt mặc định!');
  };
  
  // Apply settings on page load
  window.addEventListener('DOMContentLoaded', () => {
    const settings = loadSettings();
    applySettings(settings);
  });
  
  // Override toggleTheme function
  window.toggleTheme = function() {
    const settings = loadSettings();
    settings.theme = settings.theme === 'light' ? 'dark' : 'light';
    saveSettings(settings);
    applySettings(settings);
  };