// ===== SETTINGS SYSTEM =====

// Khởi tạo settings mặc định
const defaultSettings = {
  // Performance Settings
  animations: true,
  backgroundEffects: true,
  glowEffects: true,
  backdropBlur: true,
  boxShadows: true,
  imageHoverEffects: true,
  tableHoverEffects: true,
  dialogAnimations: true,
  
  // Theme
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
  
  // ===== ANIMATIONS =====
  if (!settings.animations) {
    root.style.setProperty('--animation-duration', '0s');
    root.style.setProperty('--transition-duration', '0s');
    document.body.classList.add('no-animations');
  } else {
    root.style.removeProperty('--animation-duration');
    root.style.removeProperty('--transition-duration');
    document.body.classList.remove('no-animations');
  }
  
  // ===== BACKGROUND EFFECTS =====
  if (!settings.backgroundEffects) {
    document.body.classList.add('no-bg-effects');
  } else {
    document.body.classList.remove('no-bg-effects');
  }
  
  // ===== GLOW EFFECTS =====
  if (!settings.glowEffects) {
    root.style.setProperty('--glow-opacity', '0');
    document.body.classList.add('no-glow');
  } else {
    root.style.removeProperty('--glow-opacity');
    document.body.classList.remove('no-glow');
  }
  
  // ===== BACKDROP BLUR =====
  if (!settings.backdropBlur) {
    document.body.classList.add('no-backdrop-blur');
  } else {
    document.body.classList.remove('no-backdrop-blur');
  }
  
  // ===== BOX SHADOWS =====
  if (!settings.boxShadows) {
    document.body.classList.add('no-box-shadows');
  } else {
    document.body.classList.remove('no-box-shadows');
  }
  
  // ===== IMAGE HOVER EFFECTS =====
  if (!settings.imageHoverEffects) {
    document.body.classList.add('no-image-hover');
  } else {
    document.body.classList.remove('no-image-hover');
  }
  
  // ===== TABLE HOVER EFFECTS =====
  if (!settings.tableHoverEffects) {
    document.body.classList.add('no-table-hover');
  } else {
    document.body.classList.remove('no-table-hover');
  }
  
  // ===== DIALOG ANIMATIONS =====
  if (!settings.dialogAnimations) {
    document.body.classList.add('no-dialog-animations');
  } else {
    document.body.classList.remove('no-dialog-animations');
  }
}

// Mở Settings Dialog
window.openSettingsDialog = function() {
  const settings = loadSettings();
  
  // Update checkbox states
  document.getElementById('settingAnimations').checked = settings.animations;
  document.getElementById('settingBackgroundEffects').checked = settings.backgroundEffects;
  document.getElementById('settingGlowEffects').checked = settings.glowEffects;
  document.getElementById('settingBackdropBlur').checked = settings.backdropBlur;
  document.getElementById('settingBoxShadows').checked = settings.boxShadows;
  document.getElementById('settingImageHover').checked = settings.imageHoverEffects;
  document.getElementById('settingTableHover').checked = settings.tableHoverEffects;
  document.getElementById('settingDialogAnimations').checked = settings.dialogAnimations;
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
    backdropBlur: document.getElementById('settingBackdropBlur').checked,
    boxShadows: document.getElementById('settingBoxShadows').checked,
    imageHoverEffects: document.getElementById('settingImageHover').checked,
    tableHoverEffects: document.getElementById('settingTableHover').checked,
    dialogAnimations: document.getElementById('settingDialogAnimations').checked,
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