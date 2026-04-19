// Biến global để lưu search query từ URL
let urlSearchQuery = null;

window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  const icon = document.getElementById('themeIcon');

  document.documentElement.setAttribute('data-theme', savedTheme);

  if (savedTheme === 'light') {
    icon.className = 'fa-solid fa-sun';
    const sidebarIcon = document.getElementById('themeIconSidebar');
    if (sidebarIcon) sidebarIcon.className = 'fa-solid fa-sun';
  };

  const rankBtn = document.getElementById("btn-ranking");
  if (rankBtn) {
    rankBtn.addEventListener("click", openRankingDialog);
  }

  // Lấy search query từ URL
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('search') || urlParams.get('q');

  if (searchQuery) {
    // Lưu vào biến global để dùng sau khi load songs xong
    urlSearchQuery = decodeURIComponent(searchQuery);

    // Lưu vào sessionStorage để persist
    sessionStorage.setItem('currentSearch', urlSearchQuery);

    // Xóa params khỏi URL (optional - giữ URL sạch)
    const cleanURL = window.location.pathname;
    window.history.replaceState({}, document.title, cleanURL);
  }

  // Gọi loadSongs() SAU KHI đã set urlSearchQuery
  loadSongs();

});

// Import supabase client từ file chung
import { supabase } from './supabase-client.js';

const list = document.getElementById('list'),
  lyricDialog = document.getElementById('lyricDialog'),
  addSongDialog = document.getElementById('addSongDialog'),
  editSongDialog = document.getElementById('editSongDialog'),
  songForm = document.getElementById('songForm'),
  editSongForm = document.getElementById('editSongForm'),
  dTitle = document.getElementById('dTitle'),
  dArtist = document.getElementById('dArtist'),
  dLyric = document.getElementById('dLyric'),
  dAvatar = document.getElementById('dAvatar'),
  lyricCommentForm = document.getElementById('lyricCommentForm'),
  lyricCommentInput = document.getElementById('lyricCommentInput'),
  lyricCommentList = document.getElementById('lyricCommentList'),
  lyricCommentTitle = document.getElementById('lyricCommentsTitle'),
  lyricCommentLoginHint = document.getElementById('lyricCommentLoginHint'),
  lyricCommentMeta = document.getElementById('lyricCommentMeta'),
  lyricCommentSubmitButton = document.getElementById('lyricCommentSubmitButton'),
  lyricCommentError = document.getElementById('lyricCommentError'),
  adminRecommendationCard = document.getElementById('adminRecommendationCard'),
  adminRecommendationIcon = document.getElementById('adminRecommendationIcon'),
  adminRecommendationLabel = document.getElementById('adminRecommendationLabel'),
  adminRecommendationTitle = document.getElementById('adminRecommendationTitle'),
  adminRecommendationMeta = document.getElementById('adminRecommendationMeta'),
  btnAdminRecommendationEdit = document.getElementById('btnAdminRecommendationEdit'),
  adminRecommendationDialog = document.getElementById('adminRecommendationDialog'),
  adminRecommendationForm = document.getElementById('adminRecommendationForm'),
  adminRecommendationType = document.getElementById('adminRecommendationType'),
  adminRecommendationSongGroup = document.getElementById('adminRecommendationSongGroup'),
  adminRecommendationSongId = document.getElementById('adminRecommendationSongId'),
  adminRecommendationUrlGroup = document.getElementById('adminRecommendationUrlGroup'),
  adminRecommendationUrl = document.getElementById('adminRecommendationUrl'),
  adminRecommendationPreviewMedia = document.getElementById('adminRecommendationPreviewMedia'),
  adminRecommendationPreviewLabel = document.getElementById('adminRecommendationPreviewLabel'),
  adminRecommendationPreviewTitle = document.getElementById('adminRecommendationPreviewTitle'),
  adminRecommendationPreviewSubtitle = document.getElementById('adminRecommendationPreviewSubtitle'),
  adminRecommendationTypeLabel = document.getElementById('adminRecommendationTypeLabel'),
  adminRecommendationSongLabel = document.getElementById('adminRecommendationSongLabel'),
  adminRecommendationUrlLabel = document.getElementById('adminRecommendationUrlLabel'),
  adminRecommendationDialogTitle = document.getElementById('adminRecommendationDialogTitle'),
  adminRecommendationCancelButton = document.getElementById('adminRecommendationCancelButton'),
  adminRecommendationSaveButton = document.getElementById('adminRecommendationSaveButton'),
  adminRecommendationError = document.getElementById('adminRecommendationError'),
  searchInput = document.getElementById('searchInput');

let currentEditId = null;
let isSubmittingComment = false;
let isSubmittingAdminRecommendation = false;
let currentAdminRecommendation = null;
const commentAvatarCache = new Map();
const ADMIN_RECOMMENDATION_LOCAL_KEY = 'ntdMusicAdminRecommendation';

function tr(key, variables = {}) {
  if (window.getTranslatedText) {
    return window.getTranslatedText(key, variables);
  }
  return key;
}
window.tr = tr;

function getCurrentLocale() {
  if (window.getCurrentLanguageLocale) {
    return window.getCurrentLanguageLocale();
  }
  return 'vi-VN';
}

function getStreakValueText(count) {
  const language = window.getCurrentLanguage ? window.getCurrentLanguage() : 'vi';
  if (language === 'en') {
    return `${count} ${count === 1 ? 'day' : tr('streakDaySuffix')}`;
  }
  return `${count} ${tr('streakDaySuffix')}`;
}

function buildLyricDialogMeta(song) {
  return {
    albumText: `${tr('albumPrefix')}: ${song['album'] || tr('noAlbum')}`,
    addedByText: song['add_by'] ? `👤 ${tr('addedByPrefix')}: ${song['add_by']}` : ''
  };
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parseSongComments(rawComments) {
  let source = rawComments;

  if (typeof source === 'string') {
    try {
      source = JSON.parse(source);
    } catch {
      source = source.trim()
        ? [{
          id: `legacy-${Date.now()}`,
          displayName: 'Unknown',
          content: source.trim(),
          createdAt: new Date().toISOString()
        }]
        : [];
    }
  }

  if (!Array.isArray(source)) {
    return [];
  }

  return source
    .map((item, index) => {
      if (!item || typeof item !== 'object') return null;

      const content = String(item.content || item.text || '').trim();
      if (!content) return null;

      return {
        id: item.id || `comment-${Date.now()}-${index}`,
        userId: item.userId || item.user_id || null,
        displayName: String(item.displayName || item.display_name || item.name || 'Unknown').trim() || 'Unknown',
        avatar: String(item.avatar || item.avatar_url || '').trim(),
        content,
        createdAt: item.createdAt || item.created_at || new Date().toISOString()
      };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getSongComments(song) {
  return parseSongComments(song?.comment);
}

function updateLocalSongComments(songId, comments) {
  const song = window._songs?.find((item) => item.Id === songId);
  if (song) {
    song.comment = [...comments];
  }
}

async function persistSongComments(songId, comments) {
  const primary = await supabase
    .from('songs')
    .update({ comment: comments })
    .eq('Id', songId);

  if (!primary.error) return;

  const fallback = await supabase
    .from('songs')
    .update({ comment: JSON.stringify(comments) })
    .eq('Id', songId);

  if (fallback.error) {
    throw fallback.error;
  }
}

function formatCommentTime(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleString(getCurrentLocale(), {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function canDeleteComment(comment) {
  if (!currentUser) return false;
  return comment.userId === currentUser.id || window.currentUserRole === 'Admin';
}

function getCommentAvatarUrl(comment) {
  if (comment?.avatar && isValidAvatarUrl(comment.avatar)) {
    return comment.avatar;
  }

  if (comment?.userId && commentAvatarCache.has(comment.userId)) {
    const cachedAvatar = commentAvatarCache.get(comment.userId);
    return cachedAvatar && isValidAvatarUrl(cachedAvatar) ? cachedAvatar : '';
  }

  if (comment?.userId && window.currentUserProfile?.id === comment.userId) {
    const currentAvatar = getProfileAvatarUrl(window.currentUserProfile);
    return isValidAvatarUrl(currentAvatar) ? currentAvatar : '';
  }

  return '';
}

async function preloadCommentAvatars(song, comments) {
  const missingUserIds = [...new Set(
    comments
      .filter((comment) => comment?.userId && !getCommentAvatarUrl(comment) && !commentAvatarCache.has(comment.userId))
      .map((comment) => comment.userId)
  )];

  if (missingUserIds.length === 0) return;

  const { data, error } = await supabase
    .from('profiles')
    .select('id, avatar')
    .in('id', missingUserIds);

  if (error) {
    console.error('Lỗi khi tải avatar comment:', error);
    return;
  }

  const avatarMap = new Map((data || []).map((profile) => [profile.id, String(profile.avatar || '').trim()]));
  let shouldRerender = false;

  missingUserIds.forEach((userId) => {
    const avatarUrl = avatarMap.get(userId) || '';
    commentAvatarCache.set(userId, avatarUrl);
    if (avatarUrl) shouldRerender = true;
  });

  if (shouldRerender && song?.Id === window.currentSongId) {
    renderSongComments(song);
  }
}

function renderSongComments(song) {
  if (!lyricCommentList || !lyricCommentTitle || !lyricCommentForm) return;

  const comments = getSongComments(song);
  lyricCommentTitle.textContent = tr('commentsTitle', { count: comments.length });
  lyricCommentInput.placeholder = tr('commentsPlaceholder');
  lyricCommentMeta.textContent = tr('commentsMeta');
  lyricCommentSubmitButton.textContent = tr('commentsSubmit');

  if (currentUser) {
    lyricCommentForm.style.display = 'flex';
    lyricCommentLoginHint.textContent = '';
  } else {
    lyricCommentForm.style.display = 'none';
    lyricCommentLoginHint.textContent = tr('commentsLoginHint');
  }

  lyricCommentList.innerHTML = comments.length === 0
    ? `<div class="song-comments-empty">${escapeHtml(tr('commentsEmpty'))}</div>`
    : comments.map((comment) => {
      const initial = escapeHtml(comment.displayName.charAt(0).toUpperCase() || '?');
      const commentTime = escapeHtml(formatCommentTime(comment.createdAt));
      const deleteLabel = escapeHtml(tr('commentsDelete'));
      const avatarUrl = getCommentAvatarUrl(comment);
      const avatarMarkup = avatarUrl
        ? `<img class="song-comment-avatar song-comment-avatar-image" src="${escapeHtml(avatarUrl)}" alt="${escapeHtml(comment.displayName)}">`
        : `<span class="song-comment-avatar">${initial}</span>`;
      const deleteButton = canDeleteComment(comment)
        ? `<button type="button" class="song-comment-delete" data-comment-id="${escapeHtml(comment.id)}" aria-label="${deleteLabel}" title="${deleteLabel}">
              <i class="fa-solid fa-trash-can" aria-hidden="true"></i>
            </button>`
        : '';

      return `
          <article class="song-comment-item">
            <div class="song-comment-top">
              <div class="song-comment-author">
                ${avatarMarkup}
                <div>
                  <div class="song-comment-name">${escapeHtml(comment.displayName)}</div>
                </div>
              </div>
              ${deleteButton}
            </div>
            <p class="song-comment-content">${escapeHtml(comment.content)}</p>
            <div class="song-comment-bottom">
              <div class="song-comment-time">${commentTime}</div>
            </div>
          </article>
        `;
    }).join('');

  preloadCommentAvatars(song, comments);
}

async function getCurrentCommentProfile() {
  const cachedName = window.currentUserProfile?.display_name;
  const cachedAvatar = getProfileAvatarUrl(window.currentUserProfile);
  if (cachedName) {
    return {
      displayName: cachedName,
      avatar: cachedAvatar
    };
  }
  if (!currentUser) {
    return {
      displayName: 'Unknown',
      avatar: ''
    };
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('display_name, avatar')
    .eq('id', currentUser.id)
    .single();

  if (error) {
    console.error('Lỗi khi tải display_name để comment:', error);
    return {
      displayName: currentUser.email || 'Unknown',
      avatar: ''
    };
  }

  if (window.currentUserProfile) {
    window.currentUserProfile.display_name = data.display_name;
    window.currentUserProfile.avatar = data.avatar;
  }

  return {
    displayName: data.display_name,
    avatar: String(data.avatar || '').trim()
  };
}

function loadFallbackAdminRecommendation() {
  try {
    const raw = localStorage.getItem(ADMIN_RECOMMENDATION_LOCAL_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Lỗi đọc đề xuất admin từ localStorage:', error);
    return null;
  }
}

function saveFallbackAdminRecommendation(recommendation) {
  localStorage.setItem(ADMIN_RECOMMENDATION_LOCAL_KEY, JSON.stringify(recommendation));
}

function normalizeAdminRecommendation(record) {
  if (!record) return null;

  return {
    id: Number(record.id || 1),
    type: String(record.type || 'song'),
    songId: record.song_id ? Number(record.song_id) : (record.songId ? Number(record.songId) : null),
    url: String(record.url || '').trim(),
    title: String(record.title || '').trim(),
    subtitle: String(record.subtitle || '').trim(),
    thumbnail: String(record.thumbnail || '').trim(),
    updatedAt: record.updated_at || record.updatedAt || new Date().toISOString()
  };
}

function getRecommendationSnippetFromSong(song) {
  const lyric = String(song?.['Lyric'] || '');
  const hotLines = lyric
    .split('\n')
    .filter((line) => line.includes('--hot'))
    .map((line) => line.replace('--hot', '').trim())
    .filter(Boolean);

  if (hotLines.length > 0) {
    return hotLines.slice(0, 2).join(' • ');
  }

  const plainLines = lyric
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return plainLines.slice(0, 2).join(' • ');
}

function resolveAdminRecommendation(record = currentAdminRecommendation) {
  const normalizedRecord = normalizeAdminRecommendation(record);
  if (!normalizedRecord) return null;

  if (normalizedRecord.type === 'song' && normalizedRecord.songId) {
    const song = window._songs?.find((item) => item.Id === normalizedRecord.songId);
    if (song) {
      return {
        type: 'song',
        songId: song.Id,
        url: '',
        title: song['Tên'] || normalizedRecord.title,
        subtitle: song['Ca sĩ'] || normalizedRecord.subtitle,
        thumbnail: song.avatar || normalizedRecord.thumbnail,
        meta: getRecommendationSnippetFromSong(song) || song['Ca sĩ'] || normalizedRecord.subtitle
      };
    }
  }

  return {
    ...normalizedRecord,
    meta: normalizedRecord.subtitle || (normalizedRecord.type === 'spotify' ? 'Spotify' : normalizedRecord.type === 'youtube' ? 'YouTube' : tr('adminRecommendationEmpty'))
  };
}

function renderAdminRecommendationMedia(container, recommendation) {
  if (!container) return;

  if (recommendation?.thumbnail && isValidAvatarUrl(recommendation.thumbnail)) {
    container.innerHTML = `<img src="${escapeHtml(recommendation.thumbnail)}" alt="${escapeHtml(recommendation.title || 'recommendation')}">`;
    return;
  }

  const fallbackIcon = recommendation?.type === 'spotify'
    ? '<i class="fa-brands fa-spotify"></i>'
    : recommendation?.type === 'youtube'
      ? '<i class="fa-brands fa-youtube"></i>'
      : '<i class="fa-solid fa-thumbtack"></i>';
  container.innerHTML = fallbackIcon;
}

function refreshAdminRecommendationTexts() {
  if (adminRecommendationLabel) adminRecommendationLabel.textContent = tr('adminRecommendationLabel');
  if (btnAdminRecommendationEdit) btnAdminRecommendationEdit.title = tr('adminRecommendationManage');
  if (adminRecommendationDialogTitle) adminRecommendationDialogTitle.textContent = tr('adminRecommendationDialogTitle');
  if (adminRecommendationTypeLabel) adminRecommendationTypeLabel.textContent = tr('adminRecommendationTypeLabel');
  if (adminRecommendationSongLabel) adminRecommendationSongLabel.textContent = tr('adminRecommendationSongLabel');
  if (adminRecommendationUrlLabel) adminRecommendationUrlLabel.textContent = tr('adminRecommendationUrlLabel');
  if (adminRecommendationPreviewLabel) adminRecommendationPreviewLabel.textContent = tr('adminRecommendationPreviewLabel');
  if (adminRecommendationCancelButton) adminRecommendationCancelButton.textContent = tr('cancelText');
  if (adminRecommendationSaveButton) adminRecommendationSaveButton.textContent = tr('adminRecommendationSave');
  if (adminRecommendationType) {
    const [songOption, youtubeOption, spotifyOption] = adminRecommendationType.options;
    if (songOption) songOption.textContent = tr('adminRecommendationTypeSong');
    if (youtubeOption) youtubeOption.textContent = tr('adminRecommendationTypeYoutube');
    if (spotifyOption) spotifyOption.textContent = tr('adminRecommendationTypeSpotify');
  }
}

function renderAdminRecommendationCard() {
  refreshAdminRecommendationTexts();

  if (btnAdminRecommendationEdit) {
    btnAdminRecommendationEdit.style.display = window.currentUserRole === 'Admin' ? 'inline-flex' : 'none';
  }

  const recommendation = resolveAdminRecommendation();
  if (!recommendation) {
    if (adminRecommendationTitle) adminRecommendationTitle.textContent = '---';
    if (adminRecommendationMeta) adminRecommendationMeta.textContent = tr('adminRecommendationEmpty');
    renderAdminRecommendationMedia(adminRecommendationIcon, null);
    if (adminRecommendationCard) adminRecommendationCard.style.opacity = '0.85';
    return;
  }

  if (adminRecommendationTitle) adminRecommendationTitle.textContent = recommendation.title || '---';
  if (adminRecommendationMeta) adminRecommendationMeta.textContent = recommendation.meta || tr('adminRecommendationEmpty');
  renderAdminRecommendationMedia(adminRecommendationIcon, recommendation);
  if (adminRecommendationCard) adminRecommendationCard.style.opacity = '1';
}

async function loadAdminRecommendation() {
  let recommendation = null;

  try {
    const { data, error } = await supabase
      .from('admin_recommendation')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (error) throw error;
    recommendation = normalizeAdminRecommendation(data);
    if (recommendation) {
      saveFallbackAdminRecommendation(recommendation);
    }
  } catch (error) {
    console.warn('Không tải được đề xuất admin từ Supabase, dùng local fallback:', error);
    recommendation = normalizeAdminRecommendation(loadFallbackAdminRecommendation());
  }

  currentAdminRecommendation = recommendation;
  renderAdminRecommendationCard();
}

function populateAdminRecommendationSongOptions(selectedSongId = '') {
  if (!adminRecommendationSongId) return;

  const songs = [...(window._songs || [])].sort((a, b) => a['Tên'].localeCompare(b['Tên'], 'vi'));
  adminRecommendationSongId.innerHTML = `<option value="">${tr('adminRecommendationSongPlaceholder')}</option>` +
    songs.map((song) => `<option value="${song.Id}">${escapeHtml(song['Tên'])} - ${escapeHtml(song['Ca sĩ'] || '')}</option>`).join('');

  if (selectedSongId) {
    adminRecommendationSongId.value = String(selectedSongId);
  }
}

function syncAdminRecommendationForm() {
  if (!adminRecommendationType) return;

  const type = adminRecommendationType.value;
  if (adminRecommendationSongGroup) adminRecommendationSongGroup.style.display = type === 'song' ? 'block' : 'none';
  if (adminRecommendationUrlGroup) adminRecommendationUrlGroup.style.display = type === 'song' ? 'none' : 'block';
  if (adminRecommendationUrl) {
    adminRecommendationUrl.placeholder = type === 'spotify'
      ? 'https://open.spotify.com/...'
      : 'https://www.youtube.com/watch?v=...';
  }
}

function updateAdminRecommendationPreview(recommendation) {
  const resolved = resolveAdminRecommendation(recommendation);

  renderAdminRecommendationMedia(adminRecommendationPreviewMedia, resolved);
  if (adminRecommendationPreviewTitle) {
    adminRecommendationPreviewTitle.textContent = resolved?.title || '---';
  }
  if (adminRecommendationPreviewSubtitle) {
    adminRecommendationPreviewSubtitle.textContent = resolved?.meta || tr('adminRecommendationPreviewEmpty');
  }
}

function isValidRecommendationUrl(type, rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    if (type === 'youtube') {
      return parsed.hostname.includes('youtube.com') || parsed.hostname.includes('youtu.be');
    }
    if (type === 'spotify') {
      return parsed.hostname.includes('spotify.com');
    }
    return false;
  } catch (error) {
    return false;
  }
}

async function fetchAdminRecommendationLinkMeta(type, url) {
  const getFallbackMeta = () => {
    let fallbackTitle = url;
    let fallbackThumbnail = '';

    try {
      const parsed = new URL(url);
      const pathParts = parsed.pathname.split('/').filter(Boolean);
      fallbackTitle = pathParts[pathParts.length - 1] || parsed.hostname;

      if (type === 'youtube') {
        const videoId = parsed.hostname.includes('youtu.be')
          ? pathParts[0]
          : parsed.searchParams.get('v') || (pathParts[0] === 'shorts' ? pathParts[1] : '');
        if (videoId) {
          fallbackThumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
        }
      }
    } catch (error) {
      console.warn('Không parse được link recommendation:', error);
    }

    return {
      title: fallbackTitle,
      subtitle: type === 'spotify' ? 'Spotify' : 'YouTube',
      thumbnail: fallbackThumbnail
    };
  };

  try {
    const endpoint = type === 'spotify'
      ? `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`
      : `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;

    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Metadata request failed with ${response.status}`);
    }

    const data = await response.json();
    return {
      title: String(data.title || '').trim() || getFallbackMeta().title,
      subtitle: String(data.author_name || (type === 'spotify' ? 'Spotify' : 'YouTube')).trim(),
      thumbnail: String(data.thumbnail_url || '').trim() || getFallbackMeta().thumbnail
    };
  } catch (error) {
    console.warn('Không lấy được metadata recommendation, dùng fallback:', error);
    return getFallbackMeta();
  }
}

function getAdminRecommendationPayloadFromSong(song) {
  return {
    id: 1,
    type: 'song',
    song_id: song.Id,
    url: null,
    title: song['Tên'] || '',
    subtitle: song['Ca sĩ'] || '',
    thumbnail: song.avatar || '',
    updated_by: currentUser?.id || null,
    updated_at: new Date().toISOString()
  };
}

window.openAdminRecommendation = function () {
  const recommendation = resolveAdminRecommendation();
  if (!recommendation) {
    alert(tr('adminRecommendationEmpty'));
    return;
  }

  if (recommendation.type === 'song' && recommendation.songId) {
    const songExists = window._songs?.some((item) => item.Id === recommendation.songId);
    if (!songExists) {
      alert(tr('adminRecommendationSongMissing'));
      return;
    }
    showLyric(recommendation.songId);
    return;
  }

  if (recommendation.url) {
    window.open(recommendation.url, '_blank', 'noopener,noreferrer');
  }
};

window.openAdminRecommendationDialog = function () {
  if (window.currentUserRole !== 'Admin') {
    alert(tr('adminRecommendationAdminOnly'));
    return;
  }

  refreshAdminRecommendationTexts();
  populateAdminRecommendationSongOptions(currentAdminRecommendation?.songId);

  const currentType = currentAdminRecommendation?.type || 'song';
  adminRecommendationType.value = currentType;
  adminRecommendationSongId.value = currentAdminRecommendation?.songId ? String(currentAdminRecommendation.songId) : '';
  adminRecommendationUrl.value = currentAdminRecommendation?.url || '';
  adminRecommendationError.textContent = '';
  syncAdminRecommendationForm();
  updateAdminRecommendationPreview(currentAdminRecommendation);
  adminRecommendationDialog.showModal();
};

adminRecommendationType?.addEventListener('change', () => {
  syncAdminRecommendationForm();

  if (adminRecommendationType.value === 'song') {
    const song = window._songs?.find((item) => String(item.Id) === adminRecommendationSongId.value);
    updateAdminRecommendationPreview(song ? getAdminRecommendationPayloadFromSong(song) : null);
  } else {
    updateAdminRecommendationPreview({
      type: adminRecommendationType.value,
      title: adminRecommendationUrl.value.trim() || '---',
      subtitle: adminRecommendationType.value === 'spotify' ? 'Spotify' : 'YouTube',
      thumbnail: ''
    });
  }
});

adminRecommendationSongId?.addEventListener('change', () => {
  const song = window._songs?.find((item) => String(item.Id) === adminRecommendationSongId.value);
  updateAdminRecommendationPreview(song ? getAdminRecommendationPayloadFromSong(song) : null);
});

adminRecommendationUrl?.addEventListener('input', () => {
  updateAdminRecommendationPreview({
    type: adminRecommendationType.value,
    title: adminRecommendationUrl.value.trim() || '---',
    subtitle: adminRecommendationType.value === 'spotify' ? 'Spotify' : 'YouTube',
    thumbnail: ''
  });
});

adminRecommendationForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (window.currentUserRole !== 'Admin' || isSubmittingAdminRecommendation) {
    return;
  }

  isSubmittingAdminRecommendation = true;
  adminRecommendationError.textContent = '';
  adminRecommendationSaveButton.disabled = true;

  try {
    let payload;

    if (adminRecommendationType.value === 'song') {
      const song = window._songs?.find((item) => String(item.Id) === adminRecommendationSongId.value);
      if (!song) {
        adminRecommendationError.textContent = tr('adminRecommendationPickSongError');
        return;
      }
      payload = getAdminRecommendationPayloadFromSong(song);
    } else {
      const url = adminRecommendationUrl.value.trim();
      if (!url) {
        adminRecommendationError.textContent = tr('adminRecommendationUrlError');
        return;
      }
      if (!isValidRecommendationUrl(adminRecommendationType.value, url)) {
        adminRecommendationError.textContent = tr('adminRecommendationUrlTypeError');
        return;
      }

      adminRecommendationPreviewTitle.textContent = tr('adminRecommendationLoadingMeta');
      adminRecommendationPreviewSubtitle.textContent = '';

      const meta = await fetchAdminRecommendationLinkMeta(adminRecommendationType.value, url);
      payload = {
        id: 1,
        type: adminRecommendationType.value,
        song_id: null,
        url,
        title: meta.title || url,
        subtitle: meta.subtitle || (adminRecommendationType.value === 'spotify' ? 'Spotify' : 'YouTube'),
        thumbnail: meta.thumbnail || '',
        updated_by: currentUser?.id || null,
        updated_at: new Date().toISOString()
      };
    }

    let savedRecord;

    try {
      const { data, error } = await supabase
        .from('admin_recommendation')
        .upsert(payload, { onConflict: 'id' })
        .select('*')
        .single();

      if (error) throw error;
      savedRecord = normalizeAdminRecommendation(data);
      saveFallbackAdminRecommendation(savedRecord);
    } catch (error) {
      console.warn('Không lưu được đề xuất admin lên Supabase, dùng local fallback:', error);
      savedRecord = normalizeAdminRecommendation(payload);
      saveFallbackAdminRecommendation(savedRecord);
      adminRecommendationError.textContent = tr('adminRecommendationLocalFallback');
    }

    currentAdminRecommendation = savedRecord;
    renderAdminRecommendationCard();
    updateAdminRecommendationPreview(savedRecord);
    adminRecommendationDialog.close();
  } catch (error) {
    console.error('Lỗi khi lưu đề xuất admin:', error);
    adminRecommendationError.textContent = tr('adminRecommendationSaveError');
  } finally {
    isSubmittingAdminRecommendation = false;
    adminRecommendationSaveButton.disabled = false;
  }
});

adminRecommendationDialog?.addEventListener('click', (event) => {
  if (event.target === adminRecommendationDialog) {
    adminRecommendationDialog.close();
  }
});

window.alertLyricVolumeWarning = function () {
  alert(tr('lyricVolumeWarning'));
};

async function loadSongs() {
  const { data, error } = await supabase.from('songs').select('*').eq('Xác minh', true);
  if (error) {
    console.error(error);
    return;
  }
  data.sort((a, b) => a['Tên'].localeCompare(b['Tên'], 'vi'));
  window._songs = data;
  document.dispatchEvent(new CustomEvent('app-songsloaded', {
    detail: {
      count: data.length
    }
  }));
  populateAdminRecommendationSongOptions(currentAdminRecommendation?.songId);
  await loadAdminRecommendation();

  // Xác định search query từ nhiều nguồn (theo thứ tự ưu tiên):
  // 1. URL parameter (urlSearchQuery)
  // 2. Giá trị hiện tại trong search input
  // 3. Session storage (để persist qua các reload)
  let searchQuery = urlSearchQuery;
  const searchInput = document.getElementById('searchInput');

  if (!searchQuery && searchInput) {
    // Kiểm tra giá trị trong search input
    if (searchInput.value.trim()) {
      searchQuery = searchInput.value.trim();
    } else {
      // Kiểm tra session storage
      const savedSearch = sessionStorage.getItem('currentSearch');
      if (savedSearch) {
        searchQuery = savedSearch;
      }
    }
  }

  // Xử lý search query TRƯỚC KHI render
  let songsToRender = data;
  if (searchQuery) {
    if (searchInput) {
      // Điền giá trị vào ô search (nếu chưa có)
      if (!searchInput.value) {
        searchInput.value = searchQuery;
      }

      // Lưu vào session storage
      sessionStorage.setItem('currentSearch', searchQuery);

      // Filter songs
      const query = searchQuery.toLowerCase().trim();
      songsToRender = window._songs.filter(song =>
        removeDiacritics(song['Tên']).includes(removeDiacritics(query)) ||
        removeDiacritics(song['Ca sĩ']).includes(removeDiacritics(query)) ||
        removeDiacritics(song['Sáng tác']).includes(removeDiacritics(query)) ||
        removeDiacritics(song['Lyric'] || '').includes(removeDiacritics(query))
      );

      // Focus vào search input nếu đến từ URL
      if (urlSearchQuery) {
        setTimeout(() => {
          searchInput.focus();
        }, 300);
      }

      // Clear biến global URL search query
      urlSearchQuery = null;
    }
  } else {
    // Không có search query, xóa session storage
    sessionStorage.removeItem('currentSearch');
  }

  // Chỉ render 1 lần với kết quả đã filter (nếu có)
  renderSongs(songsToRender);
  updateStats(songsToRender);

  // Initialize filters
  initializeTagFilter();
  initializeArtistFilter();
}

function renderSongs(songs) {
  const isAdmin = window.currentUserRole === 'Admin';
  const favourites = window.userFavourites || [];

  list.innerHTML = songs.map(song => {
    const hotLines = (song['Lyric'] || '').split('\n').filter(line => line.includes('--hot')).map(line => line.replace('--hot', '').trim());
    const hotText = hotLines.length > 0 ? hotLines.join(' | ') : tr('noHot');
    const isFavourite = favourites.includes(song.Id.toString());

    return `<tr data-song-id="${song.Id}"><td class="song-clickable">${song.avatar ? `<img src="${song.avatar}" loading="lazy" alt="avatar" style="width:60px;
                height:60px;
                object-fit:cover;
                border-radius:8px">`: ''}</td><td class="song-clickable" style="font-weight: bold; font-size: 20px;" title="${song['Tên']}">${song['Tên']}</td><td class="song-clickable" title="${song['Ca sĩ']}">${song['Ca sĩ']}</td><td class="song-clickable" title="${song['Sáng tác'] || ''}">${song['Sáng tác'] || ''}</td><td class="song-clickable" title="${song['Ngày phát hành'] || ''}">${song['Ngày phát hành'] || ''}</td><td class="song-clickable" style="overflow:hidden;
                text-overflow:ellipsis;
                white-space:normal;
                word-break:break-word" title="${hotText}"><span style="color:#fbbf24;
                font-weight:500;
                font-size:17px">🔥 ${hotText}</span></td>
                <td><div class="actions-cell">
  ${isAdmin ? `
    <button class="btn btn-edit" data-action="edit" title="${tr('editTitle')}">
      <i class="fa-solid fa-pen-to-square"></i>
    </button>
    <button class="btn btn-delete" data-action="delete" title="${tr('deleteTitle')}">
      <i class="fa-solid fa-delete-left"></i>
    </button>
  ` : ''}
  <button 
    class="btn btn-favourite ${isFavourite ? 'active' : ''}" 
    data-action="favourite" 
    data-song-id="${song.Id}"
    title="${tr('favouriteTitle')}"
  >
    <i class="fa-solid fa-heart"></i>
  </button>
  <button 
    class="btn" 
    data-action="add-custom-playlist" 
    data-song-id="${song.Id}"
    title="Thêm vào Playlist Tuỳ Chọn"
    style="color: #10b981;"
  >
    <i class="fa-solid fa-layer-group"></i>
  </button>
  <button class="btn btn-lyric" data-action="lyric" title="${tr('lyricTitle')}">
    <i class="fa-solid fa-music"></i>
  </button>
  <button class="btn btn-lyric-visual" onclick="openAudioVisual(${song.Id}); stopNct(); stopYoutube();" title="Audio Visual">
    <i class="fa-solid fa-bars"></i>
  </button>
</div></td>
                
                </tr>`
  }).join('');

  updateStats(songs);
}

// Export renderSongs để các module khác có thể sử dụng
window.renderSongs = renderSongs;


list.addEventListener('click', (e) => {
  const row = e.target.closest('tr');
  if (!row) return;

  const songId = parseInt(row.dataset.songId);
  const button = e.target.closest('button');

  if (button) {
    const action = button.dataset.action;
    if (action === 'edit') openEditDialog(songId);
    else if (action === 'delete') deleteSong(songId);
    else if (action === 'lyric') showLyric(songId);
    else if (action === 'favourite') window.toggleFavourite(songId);
    else if (action === 'add-custom-playlist') window.promptAddCurrentSongToPlaylist(songId);
  } else if (e.target.closest('.song-clickable')) {
    showLyric(songId);
  }
});

let searchTimeout;
searchInput.addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      // Xóa session storage khi search rỗng
      sessionStorage.removeItem('currentSearch');
      renderSongs(window._songs);
      return;
    }

    // Lưu vào session storage
    sessionStorage.setItem('currentSearch', query);

    const filtered = window._songs.filter(song =>
      removeDiacritics(song['Tên']).includes(removeDiacritics(query)) ||
      removeDiacritics(song['Ca sĩ']).includes(removeDiacritics(query)) ||
      removeDiacritics(song['Sáng tác']).includes(removeDiacritics(query)) ||
      removeDiacritics(song['Lyric'] || '').includes(removeDiacritics(query))
    );
    renderSongs(filtered);
  }, 300);
});

window.showLyric = id => {
  window.currentSongId = id;
  const s = window._songs.find(x => x.Id === id);


  const updates = {
    title: s['Tên'],
    artist: `${s['Ca sĩ']}ㅤ`,
    date: `${s['Ngày phát hành'] || ''}`,
    ...buildLyricDialogMeta(s),
    lyric: (s['Lyric'] || '').split('\n').map(line => {
      const cleanLine = line.replace('--hot', '').trim();
      const hasHot = line.includes('--hot');
      return `<span class="motLyric">${cleanLine}${hasHot ? ' 🔥' : ''}</span>`
    }).join('\n') || `<span>${tr('noLyricsYet')}</span>`,
    avatarSrc: s.avatar,
    avatarDisplay: s.avatar ? 'block' : 'none'
  };


  requestAnimationFrame(() => {
    lyricDialog.classList.remove('lyric-embed-active');
    dTitle.textContent = updates.title;
    dArtist.textContent = updates.artist;
    dDate.textContent = updates.date;
    dAlbum.textContent = updates.albumText;
    dAddedBy.textContent = updates.addedByText;
    dLyric.innerHTML = updates.lyric;
    dLyric.style.display = 'block';
    
    // Lưu link youtube vào hidden field để openYoutubeVideoDialog sử dụng
    const dYoutubeLink = document.getElementById('dYoutubeLink');
    if (dYoutubeLink) dYoutubeLink.value = s['Link YouTube'] || '';
    renderSongComments(s);
    lyricCommentInput.value = '';
    lyricCommentError.textContent = '';
    const lyricEmbed = document.getElementById('dLyricEmbed');
    if (lyricEmbed) {
      lyricEmbed.innerHTML = '';
      lyricEmbed.style.display = 'none';
    }
    dAvatar.src = updates.avatarSrc || '';
    dAvatar.style.display = updates.avatarDisplay;

    // Update favourite button
    const btnFav = document.getElementById('btnFavouriteLyric');
    if (btnFav) {
      const favourites = window.userFavourites || [];
      if (favourites.includes(id.toString())) {
        btnFav.classList.add('active');
      } else {
        btnFav.classList.remove('active');
      }
    }

    lyricDialog.showModal();
  });
}

window.openEditDialog = id => {

  if (!currentUser) {
    alert('Vui lòng đăng nhập để chỉnh sửa!');
    return;
  }


  if (window.currentUserRole !== 'Admin') {
    alert('Chỉ Admin mới có quyền chỉnh sửa bài hát!');
    return;
  }
  const s = window._songs.find(x => x.Id === id);
  if (!s) return;
  currentEditId = id;
  document.getElementById('editSongName').value = s['Tên'];
  document.getElementById('editArtist').value = s['Ca sĩ'];
  document.getElementById('editComposer').value = s['Sáng tác'] || '';
  document.getElementById('editReleaseDate').value = s['Ngày phát hành'] || '';
  document.getElementById('editAvatar').value = s.avatar || '';
  document.getElementById('editLyric').value = s['Lyric'] || '';
  const hasAlbum = s.album && s.album.trim() !== '';
  document.getElementById('editHasAlbum').checked = hasAlbum;
  document.getElementById('editAlbum').value = s.album || '';
  document.getElementById('editAlbumGroup').style.display = hasAlbum ? 'block' : 'none';
  document.getElementById('editYoutubeLink').value = s['Link YouTube'] || '';

  clearEditErrors();
  // Set selected tags
  setSelectedTags('editTagSelector', s.tag || []);
  document.getElementById('editSelectedTags').value = s.tag ? JSON.stringify(s.tag) : '[]';
  editSongDialog.showModal()
}
addSongDialog.addEventListener('click', async (e) => {
  if (e.target !== addSongDialog) return;
  addSongDialog.close();
});

window.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('btn-add-sc');
  if (addBtn) {
    addBtn.addEventListener('click', async () => {
      if (currentUser) {
        const {
          data
        } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', currentUser.id)
          .single();

        if (data) {
          document.getElementById('addedBy').value = data.display_name;
        }
      } else {
        document.getElementById('addedBy').value = 'Khách! Đăng nhập để thay đổi';
      }
    });
  }
});
window.deleteSong = async id => {

  if (!currentUser) {
    alert('Vui lòng đăng nhập để xóa!');
    return;
  }


  if (window.currentUserRole !== 'Admin') {
    alert('Chỉ Admin mới có quyền xóa bài hát!');
    return;
  }
  if (!confirm('Bạn chắc chắn muốn xoá bài hát này?')) return;
  const {
    error
  } = await supabase.from('songs').delete().eq('Id', id);
  if (error) {
    console.error(error);
    alert('Lỗi khi xoá bài hát: ' + error.message);
    return
  }
  loadSongs()
}
lyricDialog.addEventListener('click', (e) => {
  if (e.target === lyricDialog) {
    lyricDialog.close()
  }
});

lyricDialog.addEventListener('close', () => {
  lyricDialog.classList.remove('lyric-embed-active');
  dLyric.style.display = 'block';
  lyricCommentInput.value = '';
  lyricCommentError.textContent = '';
  const lyricEmbed = document.getElementById('dLyricEmbed');
  if (lyricEmbed) {
    lyricEmbed.innerHTML = '';
    lyricEmbed.style.display = 'none';
  }
});

editSongDialog.addEventListener('click', (e) => {
  if (e.target === editSongDialog) {
    editSongDialog.close()
  }
});

lyricCommentForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!currentUser || !window.currentSongId || isSubmittingComment) {
    return;
  }

  const content = lyricCommentInput.value.trim();
  if (!content) {
    lyricCommentError.textContent = tr('commentsValidation');
    return;
  }

  isSubmittingComment = true;
  lyricCommentError.textContent = '';
  lyricCommentSubmitButton.disabled = true;

  try {
    const songId = window.currentSongId;
    const authorProfile = await getCurrentCommentProfile();
    const { data, error } = await supabase
      .from('songs')
      .select('comment')
      .eq('Id', songId)
      .single();

    if (error) throw error;

    const latestComments = parseSongComments(data?.comment);
    const newComment = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `comment-${Date.now()}`,
      userId: currentUser.id,
      displayName: authorProfile.displayName,
      avatar: authorProfile.avatar,
      content,
      createdAt: new Date().toISOString()
    };

    const updatedComments = [newComment, ...latestComments];
    await persistSongComments(songId, updatedComments);
    updateLocalSongComments(songId, updatedComments);

    const song = window._songs.find((item) => item.Id === songId);
    if (song) {
      renderSongComments(song);
    }
    lyricCommentInput.value = '';
  } catch (error) {
    console.error('Lỗi khi gửi bình luận:', error);
    lyricCommentError.textContent = tr('commentsSaveError');
  } finally {
    isSubmittingComment = false;
    lyricCommentSubmitButton.disabled = false;
  }
});

lyricCommentList.addEventListener('click', async (event) => {
  const button = event.target.closest('.song-comment-delete');
  if (!button || !window.currentSongId || isSubmittingComment) return;

  const song = window._songs.find((item) => item.Id === window.currentSongId);
  if (!song) return;

  const commentId = button.dataset.commentId;
  const comments = getSongComments(song);
  const targetComment = comments.find((item) => item.id === commentId);
  if (!targetComment || !canDeleteComment(targetComment)) return;

  if (!confirm(tr('commentsDeleteConfirm'))) {
    return;
  }

  isSubmittingComment = true;
  lyricCommentError.textContent = '';

  try {
    const updatedComments = comments.filter((item) => item.id !== commentId);
    await persistSongComments(window.currentSongId, updatedComments);
    updateLocalSongComments(window.currentSongId, updatedComments);
    renderSongComments(song);
  } catch (error) {
    console.error('Lỗi khi xóa bình luận:', error);
    lyricCommentError.textContent = tr('commentsSaveError');
  } finally {
    isSubmittingComment = false;
  }
});

songForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();
  const songName = document.getElementById('songName').value.trim();
  const artist = document.getElementById('artist').value.trim();
  let composer = document.getElementById('composer').value.trim();
  const releaseDate = document.getElementById('releaseDate').value;
  const avatar = document.getElementById('avatar').value.trim();
  const lyric = document.getElementById('lyric').value.trim();
  const adminCode = document.getElementById('adminCode').value.trim();
  const addedBy = document.getElementById('addedBy').value.trim();
  let isValid = true;
  if (!songName) {
    showError('songName', 'Vui lòng nhập tên bài hát');
    isValid = false
  }
  if (!artist) {
    showError('artist', 'Vui lòng nhập tên ca sĩ');
    isValid = false
  }

  // Nếu không có sáng tác, tự động điền ca sĩ
  if (!composer) {
    composer = artist;
    document.getElementById('composer').value = artist;
    alert('ℹ️ Không tìm thấy thông tin sáng tác!\n\nHệ thống đã tự động điền ca sĩ vào mục sáng tác.\nBạn có thể chỉnh sửa nếu cần.');
  }

  if (!releaseDate) {
    showError('releaseDate', 'Vui lòng chọn ngày phát hành');
    isValid = false
  }
  if (!isValid) return;
  const correctAdminCode = 'xm1689';
  const isVerified = adminCode === correctAdminCode;
  const selectedTagsStr = document.getElementById('selectedTags').value;
  const selectedTags = selectedTagsStr ? JSON.parse(selectedTagsStr) : [];

  const {
    error
  } = await supabase.from('songs').insert([{
    'Tên': songName,
    'Ca sĩ': artist,
    'Sáng tác': composer,
    'Ngày phát hành': releaseDate,
    'avatar': avatar || null,
    'Lyric': lyric,
    'Xác minh': isVerified,
    'add_by': addedBy,
    'album': document.getElementById('hasAlbum').checked ? document.getElementById('album').value.trim() : null,
    'tag': selectedTags.length > 0 ? selectedTags : null,
    'Link YouTube': document.getElementById('youtubeLinkAdd').value.trim() || null
  }]);
  if (error) {
    console.error(error);
    alert('Lỗi khi thêm bài hát: ' + error.message);
    return
  }
  songForm.reset();
  addSongDialog.close();
  if (isVerified) {
    alert('Bài hát đã được thêm và xác minh thành công! ✅')
  } else {
    alert('Bài hát đã được thêm!\nVui lòng đợi duyệt trong giây lát!')
  }
  loadSongs()
});

editSongForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearEditErrors();
  const songName = document.getElementById('editSongName').value.trim();
  const artist = document.getElementById('editArtist').value.trim();
  let composer = document.getElementById('editComposer').value.trim();
  const releaseDate = document.getElementById('editReleaseDate').value;
  const avatar = document.getElementById('editAvatar').value.trim();
  const lyric = document.getElementById('editLyric').value.trim();
  let isValid = true;
  if (!songName) {
    showEditError('editSongName', 'Vui lòng nhập tên bài hát');
    isValid = false
  }
  if (!artist) {
    showEditError('editArtist', 'Vui lòng nhập tên ca sĩ');
    isValid = false
  }

  // Nếu không có sáng tác, tự động điền ca sĩ
  if (!composer) {
    composer = artist;
    document.getElementById('editComposer').value = artist;
    alert('ℹ️ Không tìm thấy thông tin sáng tác!\n\nHệ thống đã tự động điền ca sĩ vào mục sáng tác.\nBạn có thể chỉnh sửa nếu cần.');
  }

  if (!releaseDate) {
    showEditError('editReleaseDate', 'Vui lòng chọn ngày phát hành');
    isValid = false
  }
  if (!isValid) return;
  const selectedTagsStr = document.getElementById('editSelectedTags').value;
  const selectedTags = selectedTagsStr ? JSON.parse(selectedTagsStr) : [];

  const {
    error
  } = await supabase.from('songs').update({
    'Tên': songName,
    'Ca sĩ': artist,
    'Sáng tác': composer,
    'Ngày phát hành': releaseDate,
    'avatar': avatar || null,
    'Lyric': lyric,
    'album': document.getElementById('editHasAlbum').checked ? document.getElementById('editAlbum').value.trim() : null,
    'tag': selectedTags.length > 0 ? selectedTags : null,
    'Link YouTube': document.getElementById('editYoutubeLink').value.trim() || null
  }).eq('Id', currentEditId);
  if (error) {
    console.error(error);
    alert('Lỗi khi cập nhật bài hát: ' + error.message);
    return
  }
  editSongDialog.close();
  loadSongs()
});

function showError(fieldId, message) {
  document.getElementById(`error-${fieldId}`).textContent = message
}

function showEditError(fieldId, message) {
  document.getElementById(`error-${fieldId}`).textContent = message
}

function clearErrors() {
  document.querySelectorAll('#songForm .error').forEach(el => el.textContent = '')
}

function clearEditErrors() {
  document.querySelectorAll('#editSongForm .error').forEach(el => el.textContent = '')
}

const diacriticsCache = new Map();

function removeDiacritics(str) {
  if (diacriticsCache.has(str)) {
    return diacriticsCache.get(str);
  }

  const result = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();

  diacriticsCache.set(str, result);
  return result;
}



function buildRanking(songs) {
  const map = {};

  songs.forEach(song => {

    if (!song.add_by) return;

    const name = song.add_by.trim();
    map[name] = (map[name] || 0) + 1;
  });

  return Object.entries(map)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}


window.openRankingDialog = async function () {
  const rankingList = document.getElementById("rankingList");
  const currentUserRank = document.getElementById("currentUserRank");
  const dialog = document.getElementById("rankingDialog");

  if (!rankingList || !currentUserRank || !dialog) {
    console.error('Không tìm thấy elements');
    return;
  }

  rankingList.innerHTML = "<li>Đang tải...</li>";

  try {

    const { data: allSongs, error } = await supabase
      .from('songs')
      .select('*')
      .eq('Xác minh', true);

    if (error) throw error;

    const ranking = buildRanking(allSongs);


    let myName = "Khách";
    if (currentUser) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', currentUser.id)
        .single();

      if (profile) {
        myName = profile.display_name;
      }
    }

    rankingList.innerHTML = "";


    ranking.forEach((u, i) => {
      const li = document.createElement("li");
      li.textContent = `${i + 1}. ${u.name} — ${u.count} bài`;


      li.style.cursor = "pointer";
      li.onclick = () => showUserSongs(u.name);

      if (u.name === myName) {
        li.style.fontWeight = "bold";
        li.style.color = "var(--accent-primary)";
      }
      rankingList.appendChild(li);
    });

    const me = ranking.find(u => u.name === myName);
    currentUserRank.textContent = me
      ? `👤 Bạn (${myName}): đã thêm ${me.count} bài`
      : `👤 Bạn (${myName}): chưa thêm bài nào`;

    dialog.showModal();

  } catch (error) {
    console.error('Lỗi khi tải ranking:', error);
    rankingList.innerHTML = "<li style='color: #ef4444'>Lỗi khi tải dữ liệu</li>";
    dialog.showModal();
  }
};


const YOUTUBE_API_KEY = "AIzaSyAS6c7bto_vvZ60g_FsdA60od3Fgw0y67g";

window.extractVideoId = function (url) {
  const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
  return match ? match[1] : null;
};

let isFetchingYoutube = false;

/** Parse artist và tên bài từ title YouTube (dạng "Artist - Song" hoặc "Song - Artist") */
function parseArtistAndSongFromTitle(title, knownSongName = '') {
  if (!title || typeof title !== 'string') return { artist: '', song: '' };
  const t = title.trim();
  const separators = [' - ', ' – ', ' — ', ' | ', ' • '];
  for (const sep of separators) {
    const idx = t.indexOf(sep);
    if (idx > 0) {
      let part1 = t.substring(0, idx).replace(/\s*\([^)]*\)\s*$|\s*\[[^\]]*\]\s*$/g, '').trim();
      let part2 = t.substring(idx + sep.length).replace(/\s*\([^)]*\)\s*$|\s*\[[^\]]*\]\s*$/g, '').trim();
      if (part1.length > 0 && part2.length > 0) {
        if (knownSongName) {
          const k = removeDiacritics(knownSongName);
          const p1 = removeDiacritics(part1);
          const p2 = removeDiacritics(part2);
          if (p1.includes(k) || k.includes(p1)) return { artist: part2, song: part1 };
          if (p2.includes(k) || k.includes(p2)) return { artist: part1, song: part2 };
        }
        return { artist: part1, song: part2 };
      }
    }
  }
  return { artist: '', song: t };
}

/** Tự động tìm và điền URL ảnh từ các nguồn uy tín */
window.autoFillAvatar = async function (type) {
  const isAdd = type === 'add';
  const songNameInput = document.getElementById(isAdd ? 'songName' : 'editSongName');
  const artistInput = document.getElementById(isAdd ? 'artist' : 'editArtist');
  const avatarInput = document.getElementById(isAdd ? 'avatar' : 'editAvatar');

  const songName = songNameInput.value.trim();
  const artist = artistInput.value.trim();

  if (!songName) {
    alert('Vui lòng nhập tên bài hát trước');
    return;
  }

  // Kiểm tra xem đã có avatar chưa
  if (avatarInput.value.trim()) {
    const confirmOverwrite = confirm(
      'Đã có URL ảnh trong ô Avatar.\n\n' +
      'Bạn có muốn tìm lại và ghi đè không?'
    );
    if (!confirmOverwrite) return;
  }

  // Hiển thị loading
  const originalValue = avatarInput.value;
  avatarInput.value = '⏳ Đang tìm ảnh...';
  avatarInput.disabled = true;

  let imageUrl = null;
  const searchQuery = artist ? `${songName} ${artist}` : songName;

  try {
    // 1. Thử lấy từ iTunes API (chất lượng cao, có ảnh album)
    try {
      const itunesRes = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(searchQuery)}&media=music&limit=5&country=VN`
      );
      const itunesData = await itunesRes.json();

      if (itunesData.results?.length > 0) {
        const q = removeDiacritics(songName);
        const best = itunesData.results.find(r =>
          removeDiacritics(r.trackName || '').includes(q) || q.includes(removeDiacritics(r.trackName || ''))
        ) || itunesData.results[0];

        // iTunes trả về ảnh 100x100, ta thay thế thành 600x600 cho chất lượng cao hơn
        if (best.artworkUrl100) {
          imageUrl = best.artworkUrl100.replace('100x100bb', '600x600bb');
        }
      }
    } catch (e) {
      console.warn('iTunes image search failed:', e);
    }

    // 2. Nếu chưa có, thử lấy từ YouTube (thumbnail của video)
    if (!imageUrl) {
        const searchRes = await fetch(
          `https://www.googleapis.com/youtube/v3/search` +
          `?part=snippet&type=video&maxResults=1` +
          `&q=${encodeURIComponent(searchQuery + ' official')}` +
          `&key=${YOUTUBE_API_KEY}`
        );
        const searchData = await searchRes.json();

        if (searchData.error) {
          if (searchData.error.errors?.some(e => e.reason === 'quotaExceeded')) {
            console.warn('YouTube search quota exceeded for avatar lookup.');
          } else {
            console.warn('YouTube search failed for avatar lookup:', searchData.error.message);
          }
          throw new Error('YouTube Search Unavailable');
        }

        if (searchData.items?.length > 0) {
          const snippet = searchData.items[0].snippet;
          // Ưu tiên maxres (1280x720) > high (480x360) > medium (320x180)
          const thumbnails = snippet.thumbnails;
          if (thumbnails.maxres) {
            imageUrl = thumbnails.maxres.url;
          } else if (thumbnails.high) {
            imageUrl = thumbnails.high.url;
          } else if (thumbnails.medium) {
            imageUrl = thumbnails.medium.url;
          }
        }
    }

    // 3. Cập nhật kết quả
    if (imageUrl) {
      avatarInput.value = imageUrl;
      avatarInput.disabled = false;

      // Hiển thị preview ảnh (nếu có thể)
      showImagePreview(imageUrl, type);
    } else {
      avatarInput.value = originalValue;
      avatarInput.disabled = false;
      alert('Không tìm thấy ảnh phù hợp cho bài hát này.\nBạn có thể thử:\n• Bấm nút "Tìm avatar" để tìm trên Google Images\n• Hoặc tự nhập URL ảnh');
    }

  } catch (error) {
    console.error('Error finding avatar:', error);
    avatarInput.value = originalValue;
    avatarInput.disabled = false;
    alert('Có lỗi xảy ra khi tìm ảnh. Vui lòng thử lại!');
  }
};

/** Hiển thị preview ảnh */
function showImagePreview(imageUrl, type) {
  const isAdd = type === 'add';
  const formId = isAdd ? 'addSongDialog' : 'editSongDialog';
  const avatarInputId = isAdd ? 'avatar' : 'editAvatar';

  // Tìm hoặc tạo preview container
  let previewContainer = document.getElementById(`${avatarInputId}-preview`);

  if (!previewContainer) {
    const avatarInput = document.getElementById(avatarInputId);
    previewContainer = document.createElement('div');
    previewContainer.id = `${avatarInputId}-preview`;
    previewContainer.style.cssText = `
      margin-top: 12px;
      text-align: center;
      padding: 12px;
      background: rgba(99, 102, 241, 0.1);
      border: 1px solid var(--accent-primary);
      border-radius: 12px;
    `;
    avatarInput.parentElement.appendChild(previewContainer);
  }

  previewContainer.innerHTML = `
    <img src="${imageUrl}" 
         alt="Preview" 
         style="max-width: 200px; max-height: 200px; border-radius: 8px; object-fit: cover;"
         onerror="this.parentElement.innerHTML='<p style=color:#ef4444>⚠️ Không thể tải ảnh</p>'"
    >
    <p style="font-size: 13px; color: var(--text-muted); margin-top: 8px;">
      ✅ Đã tìm thấy ảnh!
    </p>
  `;
}

/** Tự động tìm và điền lời bài hát */
/** Tự động điền ca sĩ, sáng tác bằng tìm kiếm theo tên bài hát (iTunes API + YouTube fallback) */
window.autoFillArtistComposer = async function (type) {
  const isAdd = type === 'add';
  const songNameInput = document.getElementById(isAdd ? 'songName' : 'editSongName');
  const artistInput = document.getElementById(isAdd ? 'artist' : 'editArtist');
  const composerInput = document.getElementById(isAdd ? 'composer' : 'editComposer');

  const query = songNameInput.value.trim();
  if (!query) {
    alert('Vui lòng nhập tên bài hát trước');
    return;
  }

  // Kiểm tra xem đã có giá trị chưa
  const hasExistingArtist = artistInput.value.trim();
  const hasExistingComposer = composerInput.value.trim();

  if (hasExistingArtist || hasExistingComposer) {
    const confirmOverwrite = confirm(
      'Đã có thông tin trong ô Ca sĩ hoặc Sáng tác.\n\n' +
      'Bạn có muốn tìm lại và ghi đè không?'
    );
    if (!confirmOverwrite) return;
  }

  let foundArtist = null; // Lưu giá trị tìm được
  let foundComposer = null; // Lưu giá trị tìm được

  // 1. Thử iTunes Search API trước (miễn phí, có artist + composer)
  try {
    const itunesRes = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=5&country=VN`
    );
    const itunesData = await itunesRes.json();
    if (itunesData.results?.length > 0) {
      const q = removeDiacritics(query);
      const best = itunesData.results.find(r =>
        removeDiacritics(r.trackName || '').includes(q) || q.includes(removeDiacritics(r.trackName || ''))
      ) || itunesData.results[0];

      if (best.artistName) {
        foundArtist = best.artistName;
        artistInput.value = best.artistName;
      }
      if (best.composer) {
        foundComposer = best.composer;
        composerInput.value = best.composer;
      }
      if (foundArtist && foundComposer) return;
    }
  } catch (e) {
    console.warn('iTunes search failed:', e);
  }

  // 2. Fallback: YouTube search → parse title (Artist - Song)
  if (!foundArtist) {
    try {
      const searchRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search` +
        `?part=snippet&type=video&maxResults=1` +
        `&q=${encodeURIComponent(query + ' official')}` +
        `&key=${YOUTUBE_API_KEY}`
      );
      const searchData = await searchRes.json();
      if (searchData.items?.length) {
        const videoId = searchData.items[0].id.videoId;
        const videoRes = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`
        );
        const videoData = await videoRes.json();
        const title = videoData.items?.[0]?.snippet?.title;
        if (title) {
          const parsed = parseArtistAndSongFromTitle(title, query);
          if (parsed.artist) {
            foundArtist = parsed.artist;
            artistInput.value = parsed.artist;
          }
        }
      }
    } catch (e) {
      console.warn('YouTube search failed:', e);
    }
  }

  // 3. Xử lý kết quả
  if (foundArtist && !foundComposer) {
    // Tìm được ca sĩ nhưng không tìm được sáng tác
    const useArtistAsComposer = confirm(
      `Đã tìm được ca sĩ: "${foundArtist}"\n\n` +
      `Nhưng không tìm được thông tin sáng tác.\n\n` +
      `Bạn có muốn điền ca sĩ vào ô Sáng tác không?`
    );

    if (useArtistAsComposer) {
      composerInput.value = foundArtist;
    }
  } else if (!foundArtist && !foundComposer) {
    // Không tìm được gì cả
    alert('Không tìm thấy thông tin ca sĩ/sáng tác cho bài hát này');
  }
};

window.fetchYoutubeDate = async function (type) {
  if (isFetchingYoutube) return;
  isFetchingYoutube = true;

  const linkInput =
    type === 'add' ?
      document.getElementById('youtubeLinkAdd') :
      document.getElementById('youtubeLinkEdit');

  const dateInput =
    type === 'add' ?
      document.getElementById('releaseDate') :
      document.getElementById('editReleaseDate');

  const videoId = extractVideoId(linkInput?.value?.trim() || '');
  if (!videoId) {
    isFetchingYoutube = false;
    return alert('Link YouTube không hợp lệ');
  }

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`
  );
  const data = await res.json();

  if (!data.items?.length) {
    alert('Không lấy được dữ liệu video');
    isFetchingYoutube = false;
    return;
  }

  const snippet = data.items[0].snippet;
  const publishedAt = snippet.publishedAt;
  dateInput.value = publishedAt.substring(0, 10);

  // Tự động điền tên bài, ca sĩ từ title video (nếu ô trống)
  const parsed = parseArtistAndSongFromTitle(snippet.title);
  if (type === 'add') {
    const songNameInput = document.getElementById('songName');
    const artistInput = document.getElementById('artist');
    if (parsed.song && !songNameInput.value.trim()) songNameInput.value = parsed.song;
    if (parsed.artist && !artistInput.value.trim()) artistInput.value = parsed.artist;
  } else {
    const songNameInput = document.getElementById('editSongName');
    const artistInput = document.getElementById('editArtist');
    if (songNameInput && parsed.song && !songNameInput.value.trim()) songNameInput.value = parsed.song;
    if (artistInput && parsed.artist && !artistInput.value.trim()) artistInput.value = parsed.artist;
  }

  isFetchingYoutube = false;
};

window.autoFindReleaseDate = async function () {
  const title = document.getElementById('songName').value.trim();
  const artistInput = document.getElementById('artist');
  const artist = artistInput.value.trim();
  const dateInput = document.getElementById('releaseDate');

  if (!title) {
    alert('Vui lòng nhập tên bài hát trước');
    return;
  }

  const keyword = `${title} ${artist}`.trim();

  try {
    const searchRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search` +
      `?part=snippet&type=video&maxResults=1` +
      `&q=${encodeURIComponent(keyword)}` +
      `&key=${YOUTUBE_API_KEY}`
    );
    const searchData = await searchRes.json();

    if (!searchData.items?.length) {
      alert('Không tìm thấy video phù hợp');
      return;
    }

    const videoId = searchData.items[0].id.videoId;

    const videoRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos` +
      `?part=snippet&id=${videoId}` +
      `&key=${YOUTUBE_API_KEY}`
    );
    const videoData = await videoRes.json();

    if (!videoData.items?.length) {
      alert('Không lấy được ngày phát hành');
      return;
    }

    const snippet = videoData.items[0].snippet;
    const publishedAt = snippet.publishedAt;
    dateInput.value = publishedAt.substring(0, 10);

    // Tự động điền ca sĩ nếu ô trống (parse từ title video)
    if (!artist && snippet.title) {
      const parsed = parseArtistAndSongFromTitle(snippet.title, title);
      if (parsed.artist) artistInput.value = parsed.artist;
    }

  } catch (e) {
    console.error(e);
    alert('Lỗi khi tự tìm ngày phát hành');
  }
};

let currentUser = null;
window.currentUser = null;
window.currentUserProfile = null;

function getProfileAvatarUrl(profileData) {
  const profileAvatar = profileData
    ? (profileData.avatar || '')
    : '';
  return profileAvatar.toString().trim();
}

function isValidAvatarUrl(url) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (error) {
    return false;
  }
}

function renderUserDisplay(profileData) {
  const roleColors = {
    'Admin': '#ef4444',
    'Moderator': '#f59e0b',
    'Member': '#3b82f6',
    'Ủa': 'purple',
    'Jack': 'purple',
    'Bố con': 'purple',
    'Skibidi': 'purple',
    'Bồn cầu': 'purple',
    'WTF': 'purple',
    'Admin fake': 'purple',
    'Phép thuật winx enchantix biến hình': 'purple',
  };

  const roleColor = roleColors[profileData.role] || '#6b7280';
  const avatarUrl = getProfileAvatarUrl(profileData);
  const avatarMarkup = avatarUrl && isValidAvatarUrl(avatarUrl)
    ? `<img src="${avatarUrl}" alt="avatar" style="width: 34px; height: 34px; border-radius: 50%; object-fit: cover; border: 1px solid #2a2a33; margin-right: 8px; vertical-align: middle;" />`
    : '';

  document.getElementById('userDisplayName').innerHTML = `
            ${avatarMarkup}${profileData.display_name} 
            <span style="
                background: ${roleColor}; 
                padding: 4px 10px; 
                border-radius: 6px; 
                font-size: 18px; 
                font-weight: 600;
                margin-left: 8px;
                color: white;
            " id="role" onclick="roleCheck()">${profileData.role}</span>
        `;
}

async function checkAuth() {
  const {
    data: {
      session
    }
  } = await supabase.auth.getSession();
  if (session) {
    currentUser = session.user;
    window.currentUser = session.user;
    await loadUserProfile();
    updateAuthUI(true);
  } else {
    updateAuthUI(false);
  }
}

async function loadUserProfile() {
  if (!currentUser) return;

  const {
    data,
    error
  } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', currentUser.id)
    .single();

  if (data) {
    window.currentUserProfile = data;
    commentAvatarCache.set(data.id, getProfileAvatarUrl(data));
    renderUserDisplay(data);
    window.currentUserRole = data.role;

    // Load favourites của user
    if (window.loadUserFavourites) {
      await window.loadUserFavourites();
    }

    if (window._songs && window._songs.length > 0) {
      renderSongs(window._songs);
    }
  }

  renderAdminRecommendationCard();
  await loadStreakCard();
}

function updateAuthUI(isLoggedIn) {
  const authButtons = document.getElementById('authButtons');
  const userInfo = document.getElementById('userInfo');

  if (authButtons && userInfo) {
    if (isLoggedIn) {
      authButtons.style.display = 'none';
      userInfo.style.display = 'flex';
    } else {
      authButtons.style.display = 'flex';
      authButtons.style.alignItems = 'center';
      authButtons.style.gap = '12px';
      userInfo.style.display = 'none';
    }
  }

  renderAdminRecommendationCard();
}

document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  document.querySelectorAll('#registerForm .error').forEach(el => el.textContent = '');

  const displayName = document.getElementById('regDisplayName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirmPassword = document.getElementById('regConfirmPassword').value;

  let isValid = true;

  if (displayName.length < 3) {
    document.getElementById('error-regDisplayName').textContent = 'Tên hiển thị quá ngắn (tối thiểu 3 ký tự)';
    isValid = false;
  }


  const { data: existingUsers, error: checkError } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('display_name', displayName);

  if (checkError) {
    console.error('Lỗi kiểm tra tên:', checkError);
  } else if (existingUsers && existingUsers.length > 0) {
    document.getElementById('error-regDisplayName').textContent = 'Tên này đã được sử dụng! Vui lòng chọn tên khác.';
    isValid = false;
  }

  const phoneRegex = /^0\d{9}$/;
  if (!phoneRegex.test(phone)) {
    document.getElementById('error-regPhone').textContent = 'Số điện thoại không hợp lệ (VD: 0912345678)';
    isValid = false;
  }

  if (password.length < 6) {
    document.getElementById('error-regPassword').textContent = 'Mật khẩu phải có ít nhất 6 ký tự';
    isValid = false;
  }

  if (password !== confirmPassword) {
    document.getElementById('error-regConfirmPassword').textContent = 'Mật khẩu không khớp';
    isValid = false;
  }

  if (!isValid) return;

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          display_name: displayName,
          phone: phone
        },
        emailRedirectTo: window.location.origin
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        alert('Email này đã được đăng ký!');
      } else {
        alert('Lỗi đăng ký: ' + authError.message);
      }
      return;
    }

    if (!authData.user) {
      alert('Lỗi: Không tạo được tài khoản');
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', authData.user.id)
      .single();

    if (!existingProfile) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: authData.user.id,
          display_name: displayName,
          email: email,
          phone: phone,
          role: 'Member'
        }]);

      if (profileError) {
        console.error('Lỗi tạo profile:', profileError);
        alert('Tài khoản đã tạo nhưng có lỗi với profile. Vui lòng đăng nhập và cập nhật thông tin.');
        document.getElementById('registerForm').reset();
        registerDialog.close();
        return;
      }
    }

    currentUser = authData.user;
    window.currentUser = authData.user;
    await loadUserProfile();
    updateAuthUI(true);

    alert('Đăng ký thành công! Chào mừng bạn đến với ntdMUSIC! 🎵');
    document.getElementById('registerForm').reset();
    registerDialog.close();

  } catch (error) {
    console.error('Lỗi:', error);
    alert('Có lỗi xảy ra: ' + error.message);
  }
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  const {
    data,
    error
  } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (error) {
    if (error.message === "Invalid login credentials") {
      alert('Lỗi đăng nhập: Thông tin đăng nhập sai!');
    } else (
      alert('Lỗi đăng nhập: ' + error.messages)
    )
    return;
  }

  currentUser = data.user;
  window.currentUser = data.user;
  await loadUserProfile();
  updateAuthUI(true);

  document.getElementById('loginForm').reset();
  loginDialog.close();

  alert('Đăng nhập thành công!');
  loadSongs();
});

window.handleLogout = async function () {
  if (!confirm('Bạn có chắc muốn đăng xuất?')) return;

  try {
    // Try normal signOut
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.warn('SignOut API failed, clearing local session:', error);

    // Fallback: Clear localStorage tokens
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.includes('supabase') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    sessionStorage.clear();
  }

  // Always clear app state and reload
  currentUser = null;
  window.currentUser = null;
  window.currentUserRole = null;
  updateAuthUI(false);
  updateStreakCard(0);
  location.reload();
};

supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    currentUser = session.user;
    loadUserProfile();
    updateAuthUI(true);
  } else if (event === 'SIGNED_OUT') {
    currentUser = null;
    updateAuthUI(false);
  }
});

let currentmfySong = null;

function updateStats(songs) {

  document.getElementById('totalSongs').textContent = `${songs.length} bài`;
  renderAdminRecommendationCard();


  const now = new Date();
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  const mfyIndex = dayOfYear % songs.length;
  const mfySong = songs[mfyIndex];

  if (mfySong) {
    currentmfySong = mfySong;
    document.getElementById('mfySong').textContent = mfySong['Tên'];


    const iconEl = document.querySelector('.mfy-card .stat-icon');
    if (mfySong.avatar) {
      iconEl.innerHTML = `<img src="${mfySong.avatar}" alt="avatar" style="width: 64px; height: 64px; border-radius: 12px; object-fit: cover; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">`;
    } else {
      iconEl.textContent = '⭐';
    }


    const lyricEl = document.getElementById('mfyLyric');

    if (mfySong['Lyric']) {

      const hotLines = mfySong['Lyric'].split('\n')
        .filter(line => line.includes('--hot'))
        .map(line => line.replace('--hot', '').trim());

      if (hotLines.length > 0) {

        lyricEl.innerHTML = '🔥 ' + hotLines.slice(0, 4).join('<br>🔥 ');
      } else {

        const lines = mfySong['Lyric'].split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .slice(0, 4);
        lyricEl.textContent = lines.join('\n');
      }
    } else {
      lyricEl.textContent = tr('noLyricsYet');
    }
  } else {
    currentmfySong = null;
    document.getElementById('mfySong').textContent = '---';
    document.getElementById('mfyLyric').textContent = '';
    document.querySelector('.mfy-card .stat-icon').textContent = '⭐';
  }
}

window.showmfyDetail = function () {
  if (currentmfySong) {
    showLyric(currentmfySong.Id);
  }
};

window.openGopyDialog = async function () {
  if (!currentUser) {
    alert('Vui lòng đăng nhập để góp ý!');
    return;
  }


  const { data } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', currentUser.id)
    .single();

  if (data) {
    document.getElementById('gopyDisplayName').value = data.display_name;
  }


  document.getElementById('gopyTieude').value = '';
  document.getElementById('gopyNoidung').value = '';
  document.querySelectorAll('#gopyForm .error').forEach(el => el.textContent = '');

  viewProfileDialog.close();

  document.getElementById('gopyWantReply').checked = false;
  document.getElementById('gopyEmailGroup').style.display = 'none';
  document.getElementById('gopyEmail').value = '';
  gopyDialog.showModal();
};


document.getElementById('gopyWantReply').addEventListener('change', async function () {
  const emailGroup = document.getElementById('gopyEmailGroup');
  const emailInput = document.getElementById('gopyEmail');

  emailGroup.style.display = this.checked ? 'block' : 'none';

  if (this.checked) {

    if (currentUser && currentUser.email) {
      emailInput.value = currentUser.email;
    }
  } else {

    emailInput.value = '';
    document.getElementById('error-gopyEmail').textContent = '';
  }
});

document.getElementById('gopyForm').addEventListener('submit', async (e) => {
  e.preventDefault();


  document.querySelectorAll('#gopyForm .error').forEach(el => el.textContent = '');

  const tieude = document.getElementById('gopyTieude').value.trim();
  const noidung = document.getElementById('gopyNoidung').value.trim();
  const displayName = document.getElementById('gopyDisplayName').value;
  const wantReply = document.getElementById('gopyWantReply').checked;
  const email = document.getElementById('gopyEmail').value.trim();

  let isValid = true;

  if (!tieude) {
    document.getElementById('error-gopyTieude').textContent = 'Vui lòng nhập tiêu đề';
    isValid = false;
  }

  if (!noidung) {
    document.getElementById('error-gopyNoidung').textContent = 'Vui lòng nhập nội dung';
    isValid = false;
  }

  if (wantReply && !email) {
    document.getElementById('error-gopyEmail').textContent = 'Vui lòng nhập email để nhận phản hồi';
    isValid = false;
  }

  if (!isValid) return;

  try {
    const { error } = await supabase
      .from('gopy')
      .insert([{
        display_name: displayName,
        tieude: tieude,
        noidung: noidung,
        want_reply: wantReply,
        reply_email: wantReply ? email : null
      }]);

    if (error) throw error;

    alert('Cảm ơn bạn đã góp ý! 💬\nChúng tôi sẽ xem xét và phản hồi sớm nhất.');
    gopyDialog.close();

  } catch (error) {
    console.error('Lỗi khi gửi góp ý:', error);
    alert('Có lỗi xảy ra: ' + error.message);
  }
});


gopyDialog.addEventListener('click', (e) => {
  if (e.target === gopyDialog) {
    gopyDialog.close();
  }
});


window.showUserSongs = async function (userName) {
  const dialog = document.getElementById("userSongsDialog");
  const nameEl = document.getElementById("userSongsName");
  const statsEl = document.getElementById("userSongsStats");
  const listEl = document.getElementById("userSongsList");

  if (!dialog || !nameEl || !statsEl || !listEl) {
    console.error('Không tìm thấy elements');
    return;
  }

  nameEl.textContent = userName;
  listEl.innerHTML = "<div style='text-align: center; padding: 20px; color: var(--text-muted);'>Đang tải...</div>";

  try {

    const { data: userSongs, error } = await supabase
      .from('songs')
      .select('*')
      .eq('add_by', userName)
      .eq('Xác minh', true)
      .order('Ngày phát hành', { ascending: false });

    if (error) throw error;


    statsEl.innerHTML = `📊 Tổng số bài đã thêm: <span style="color: var(--accent-primary); font-size: 20px;">${userSongs.length}</span> bài`;


    if (userSongs.length === 0) {
      listEl.innerHTML = "<div style='text-align: center; padding: 40px; color: var(--text-muted);'>Chưa có bài hát nào được xác minh</div>";
    } else {

      listEl.innerHTML = userSongs.map(song => {

        const addedDate = song['Ngày thêm']
          ? new Date(song['Ngày thêm']).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          })
          : 'N/A';

        return `
    <div class="user-song-item" onclick="showLyric(${song.Id})">
      ${song.avatar ? `<img src="${song.avatar}" alt="avatar">` : '<div style="width: 50px; height: 50px; background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 24px;">🎵</div>'}
      <div class="user-song-info">
        <div class="user-song-title">${song['Tên']}</div>
        <div class="user-song-artist">${song['Ca sĩ']}</div>
      </div>
      <div class="user-song-date">📅 ${addedDate}</div>
    </div>
  `;
      }).join('');
    }

    dialog.showModal();

  } catch (error) {
    console.error('Lỗi khi tải bài hát:', error);
    listEl.innerHTML = "<div style='text-align: center; padding: 20px; color: #ef4444;'>❌ Lỗi khi tải dữ liệu</div>";
    dialog.showModal();
  }
};




function getVietnamDate() {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const vnTime = new Date(utc + (3600000 * 7));
  return vnTime.toISOString().split('T')[0];
}


function daysDifference(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}


window.checkStreak = async function () {
  if (!currentUser) {
    alert('Vui lòng đăng nhập để sử dụng tính năng này!');
    return;
  }

  try {

    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('Streak, "Ngày cuối"')
      .eq('id', currentUser.id)
      .single();

    if (fetchError) throw fetchError;

    const today = getVietnamDate();
    const lastDate = profile['Ngày cuối'];
    let currentStreak = profile.Streak || 0;


    if (!lastDate) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          Streak: 1,
          'Ngày cuối': today
        })
        .eq('id', currentUser.id);

      if (updateError) throw updateError;

      alert('🎉 Chúc mừng!\nBạn đã bắt đầu streak!\n\n🔥 Streak hiện tại: 1 ngày');
      updateStreakCard(1);
      return;
    }


    if (lastDate === today) {
      alert(`✅ Bạn đã điểm danh hôm nay rồi!\n\n🔥 Streak hiện tại: ${currentStreak} ngày\n💪 Hãy quay lại vào ngày mai!`);
      return;
    }


    const daysDiff = daysDifference(lastDate, today);


    if (daysDiff === 1) {
      const newStreak = currentStreak + 1;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          Streak: newStreak,
          'Ngày cuối': today
        })
        .eq('id', currentUser.id);

      if (updateError) throw updateError;

      alert(`🎉 Điểm danh thành công!\n\n🔥 Streak mới: ${newStreak} ngày\n⭐ Tiếp tục phát huy!`);
      updateStreakCard(newStreak);

    } else {

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          Streak: 1,
          'Ngày cuối': today
        })
        .eq('id', currentUser.id);

      if (updateError) throw updateError;

      alert(`😢 Rất tiếc!\nBạn đã bỏ lỡ ${daysDiff - 1} ngày.\n\nStreak đã được reset về 1.\n💪 Hãy cố gắng duy trì streak mới!`);
      updateStreakCard(1);;
    }

  } catch (error) {
    console.error('Lỗi khi cập nhật streak:', error);
    alert('Có lỗi xảy ra: ' + error.message);
  }
};


function updateStreakDisplay(streakCount) {
  const streakText = document.getElementById('streakText');
  if (streakText) {
    streakText.innerHTML = `Điểm danh <span style="color: var(--accent-primary); font-weight: 700;">(${streakCount} 🔥)</span>`;
  }
}



async function loadStreakCard() {
  if (!currentUser) {
    updateStreakCard(0);
    return;
  }

  try {
    const { data } = await supabase
      .from('profiles')
      .select('Streak')
      .eq('id', currentUser.id)
      .single();

    if (data) {
      const streak = data.Streak || 0;
      updateStreakCard(streak);
      updateStreakDisplay(streak);
    } else {
      updateStreakCard(0);
    }
  } catch (error) {
    console.error('Lỗi khi tải streak:', error);
    updateStreakCard(0);
  }
}


function getStreakTitle(streak) {
  if (streak < 0) return tr('streakHack');
  if (streak === 0) return tr('streakChicken');
  if (streak < 7) return tr('streakNoob');
  if (streak < 30) return tr('streakBeginner');
  if (streak < 50) return tr('streakAmateur');
  if (streak < 100) return tr('streakPro');
  if (streak < 150) return tr('streakMaster');
  if (streak < 200) return tr('streakLegend');
  if (streak < 365) return tr('streakMythical');
  return tr('streakGod');
}


function updateStreakCard(streakCount) {
  const streakLabel = document.getElementById('streakLabel');
  const streakValue = document.getElementById('streakValue');
  window.currentStreakCount = streakCount;

  if (streakLabel && streakValue) {
    streakLabel.textContent = getStreakTitle(streakCount);
    streakValue.textContent = getStreakValueText(streakCount);
  }
}

// ===== TAG FILTER FUNCTIONALITY =====
let selectedTags = [];

function initializeTagFilter() {
  if (!window._songs || window._songs.length === 0) return;

  // Lấy tất cả unique tags
  const allTags = new Set();
  window._songs.forEach(song => {
    if (song.tag && Array.isArray(song.tag)) {
      song.tag.forEach(tag => allTags.add(tag));
    }
  });

  // Tạo tag filter buttons
  const container = document.getElementById('tagFilterOptions');
  container.innerHTML = Array.from(allTags)
    .sort()
    .map(tag => `
      <div class="tag-filter-item" data-tag="${tag}">
        ${tag}
      </div>
    `).join('');

  // Add event listeners
  container.querySelectorAll('.tag-filter-item').forEach(item => {
    item.addEventListener('click', () => toggleTagFilter(item));
  });
}

function toggleTagFilter(element) {
  const tag = element.dataset.tag;

  if (selectedTags.includes(tag)) {
    selectedTags = selectedTags.filter(t => t !== tag);
    element.classList.remove('active');
  } else {
    selectedTags.push(tag);
    element.classList.add('active');
  }

  // Show/hide clear button
  document.getElementById('btnClearTagFilter').style.display =
    selectedTags.length > 0 ? 'block' : 'none';

  applyFilters();
}

document.getElementById('btnClearTagFilter').addEventListener('click', () => {
  selectedTags = [];
  document.querySelectorAll('.tag-filter-item').forEach(item => {
    item.classList.remove('active');
  });
  document.getElementById('btnClearTagFilter').style.display = 'none';
  applyFilters();
});

// ===== ARTIST FILTER FUNCTIONALITY =====
function normalizeArtistName(value) {
  return removeDiacritics(String(value || '').replace(/\s+/g, ' ').trim());
}

function extractArtistNames(artistValue) {
  return String(artistValue || '')
    .split(/\s*(?:,|&)\s*/g)
    .map((artist) => artist.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

function getUniqueArtistNames(songs) {
  const artistMap = new Map();

  songs.forEach((song) => {
    extractArtistNames(song?.['Ca sĩ']).forEach((artist) => {
      const key = normalizeArtistName(artist);
      if (key && !artistMap.has(key)) {
        artistMap.set(key, artist);
      }
    });
  });

  return [...artistMap.values()].sort((a, b) => a.localeCompare(b, 'vi', {
    sensitivity: 'base',
    numeric: true
  }));
}

function initializeArtistFilter() {
  if (!window._songs || window._songs.length === 0) return;

  const selectedValue = document.getElementById('artistFilter').value;
  const normalizedSelectedValue = normalizeArtistName(selectedValue);
  const artists = getUniqueArtistNames(window._songs);

  const select = document.getElementById('artistFilter');
  select.innerHTML = `<option value="">${tr('artistAll')}</option>` +
    artists.map(artist => `<option value="${artist}">${artist}</option>`).join('');

  if (normalizedSelectedValue) {
    const matchedArtist = artists.find((artist) => normalizeArtistName(artist) === normalizedSelectedValue);
    if (matchedArtist) {
      select.value = matchedArtist;
    }
  }
}

document.getElementById('artistFilter').addEventListener('change', applyFilters);

// ===== COMBINED FILTER FUNCTION =====
function applyFilters() {
  let filtered = window._songs;

  // Filter by tags
  if (selectedTags.length > 0) {
    filtered = filtered.filter(song => {
      if (!song.tag || !Array.isArray(song.tag)) return false;
      return selectedTags.every(tag => song.tag.includes(tag));
    });
  }

  // Filter by artist
  const selectedArtist = document.getElementById('artistFilter').value;
  if (selectedArtist) {
    const normalizedSelectedArtist = normalizeArtistName(selectedArtist);
    filtered = filtered.filter((song) =>
      extractArtistNames(song['Ca sĩ']).some((artist) => normalizeArtistName(artist) === normalizedSelectedArtist)
    );
  }

  // Filter by search query
  const searchQuery = document.getElementById('searchInput').value.toLowerCase().trim();
  if (searchQuery) {
    filtered = filtered.filter(song =>
      removeDiacritics(song['Tên']).includes(removeDiacritics(searchQuery)) ||
      removeDiacritics(song['Ca sĩ']).includes(removeDiacritics(searchQuery)) ||
      removeDiacritics(song['Sáng tác']).includes(removeDiacritics(searchQuery)) ||
      removeDiacritics(song['Lyric'] || '').includes(removeDiacritics(searchQuery))
    );
  }

  renderSongs(filtered);
}

// Update search input handler
searchInput.addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    applyFilters();
  }, 300);
});

checkAuth();

async function updateProfileAvatarField(avatarUrl) {
  const normalizedAvatar = avatarUrl ? avatarUrl.trim() : '';
  const { data: updatedProfile, error: profileError } = await supabase
    .from('profiles')
    .update({ avatar: normalizedAvatar || null })
    .eq('id', currentUser.id)
    .select('*')
    .maybeSingle();

  const metadataPatch = { ...((currentUser && currentUser.user_metadata) || {}) };
  if (normalizedAvatar) {
    metadataPatch.avatar_url = normalizedAvatar;
  } else {
    delete metadataPatch.avatar_url;
  }

  const { data: authUpdateData, error: authUpdateError } = await supabase.auth.updateUser({
    data: metadataPatch
  });

  if (authUpdateData && authUpdateData.user) {
    currentUser = authUpdateData.user;
    window.currentUser = authUpdateData.user;
  }

  if (authUpdateError && !updatedProfile) {
    throw authUpdateError;
  }

  if (updatedProfile?.id) {
    commentAvatarCache.set(updatedProfile.id, getProfileAvatarUrl(updatedProfile));
  }

  if (profileError && !updatedProfile && !authUpdateError) {
    throw profileError;
  }

  return updatedProfile;
}

function updateViewAvatar(avatarUrl) {
  const avatarImg = document.getElementById('viewAvatarImage');
  const avatarText = document.getElementById('viewAvatarText');
  if (!avatarImg || !avatarText) return;

  if (avatarUrl && isValidAvatarUrl(avatarUrl)) {
    avatarImg.src = avatarUrl;
    avatarImg.style.display = 'inline-block';
    avatarText.textContent = avatarUrl;
  } else {
    avatarImg.removeAttribute('src');
    avatarImg.style.display = 'none';
    avatarText.textContent = 'Chưa cập nhật';
  }
}


window.viewProfileDialog.addEventListener('click', async (e) => {
  if (e.target !== viewProfileDialog) return;
  viewProfileDialog.close();
});

window.showViewProfile = async function () {
  if (!currentUser) return;

  const {
    data
  } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', currentUser.id)
    .single();

  if (data) {
    document.getElementById('viewDisplayName').textContent = data.display_name;
    document.getElementById('viewEmail').textContent = currentUser.email;
    document.getElementById('viewPhone').textContent = data.phone || 'Chưa cập nhật';
    document.getElementById('viewRole').textContent = data.role;
    updateViewAvatar(getProfileAvatarUrl(data));
  } else {
    updateViewAvatar('');
  }

  viewProfileDialog.showModal();
}

window.openEditProfileDialog = async function () {
  viewProfileDialog.close();

  const {
    data
  } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', currentUser.id)
    .single();

  if (data) {
    document.getElementById('editDisplayName').value = data.display_name;
    document.getElementById('editPhone').value = data.phone || '';
    document.getElementById('editAvatarUrl').value = getProfileAvatarUrl(data);
  } else {
    document.getElementById('editAvatarUrl').value = '';
  }

  document.getElementById('oldPassword').value = '';
  document.getElementById('newPassword').value = '';
  document.getElementById('confirmNewPassword').value = '';

  document.querySelectorAll('#editProfileForm .error').forEach(el => el.textContent = '');

  editProfileDialog.showModal();
}

document.getElementById('editProfileForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  document.querySelectorAll('#editProfileForm .error').forEach(el => el.textContent = '');

  const displayName = document.getElementById('editDisplayName').value.trim();
  const phone = document.getElementById('editPhone').value.trim();
  const avatarUrl = document.getElementById('editAvatarUrl').value.trim();
  const oldPassword = document.getElementById('oldPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmNewPassword = document.getElementById('confirmNewPassword').value;

  let isValid = true;

  if (displayName.length < 3) {
    document.getElementById('error-editDisplayName').textContent = 'Tên hiển thị quá ngắn (tối thiểu 3 ký tự)';
    isValid = false;
  }


  const { data: existingUsers, error: checkError } = await supabase
    .from('profiles')
    .select('id, display_name')
    .eq('display_name', displayName);

  if (checkError) {
    console.error('Lỗi kiểm tra tên:', checkError);
  } else if (existingUsers && existingUsers.length > 0) {

    const isDuplicate = existingUsers.some(user => user.id !== currentUser.id);
    if (isDuplicate) {
      document.getElementById('error-editDisplayName').textContent = 'Tên này đã được sử dụng bởi người khác!';
      isValid = false;
    }
  }

  const phoneRegex = /^0\d{9}$/;
  if (!phoneRegex.test(phone)) {
    document.getElementById('error-editPhone').textContent = 'Số điện thoại không hợp lệ (VD: 0912345678)';
    isValid = false;
  }

  if (avatarUrl && !isValidAvatarUrl(avatarUrl)) {
    document.getElementById('error-editAvatarUrl').textContent = 'Avatar phải là URL hợp lệ (http/https)';
    isValid = false;
  }

  if (oldPassword || newPassword || confirmNewPassword) {
    if (!oldPassword) {
      document.getElementById('error-oldPassword').textContent = 'Vui lòng nhập mật khẩu cũ';
      isValid = false;
    }
    if (!newPassword) {
      document.getElementById('error-newPassword').textContent = 'Vui lòng nhập mật khẩu mới';
      isValid = false;
    } else if (newPassword.length < 6) {
      document.getElementById('error-newPassword').textContent = 'Mật khẩu phải có ít nhất 6 ký tự';
      isValid = false;
    }
    if (newPassword !== confirmNewPassword) {
      document.getElementById('error-confirmNewPassword').textContent = 'Mật khẩu không khớp';
      isValid = false;
    }
  }

  if (!isValid) return;

  try {
    const {
      error: updateError
    } = await supabase
      .from('profiles')
      .update({
        display_name: displayName,
        phone: phone
      })
      .eq('id', currentUser.id);

    if (updateError) throw updateError;

    await updateProfileAvatarField(avatarUrl);

    if (oldPassword && newPassword) {
      const {
        error: signInError
      } = await supabase.auth.signInWithPassword({
        email: currentUser.email,
        password: oldPassword
      });

      if (signInError) {
        document.getElementById('error-oldPassword').textContent = 'Mật khẩu cũ không đúng';
        return;
      }

      const {
        error: passwordError
      } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (passwordError) throw passwordError;

      alert('Cập nhật thông tin và mật khẩu thành công! 🎉');
    } else {
      alert('Cập nhật thông tin thành công! ✅');
    }

    await loadUserProfile();
    editProfileDialog.close();

  } catch (error) {
    console.error(error);
    alert('Lỗi khi cập nhật: ' + error.message);
  }
});

function loadTagsFromHTML() {
  // CHỈ LẤY TỪ 1 CHỖ THÔI (chọn cái nào cũng được)
  const tagElements = document.querySelectorAll('#tagSelector .tag-option');
  window.availableTags = Array.from(tagElements).map(el => el.dataset.tag);
}

// Gọi sau khi DOM ready
window.addEventListener('DOMContentLoaded', () => {
  loadTagsFromHTML();
});

// ===== LỊCH SỬ THÊM BÀI HÁT =====

window.openHistoryDialog = async function () {
  const dialog = document.getElementById("historyDialog");
  const listEl = document.getElementById("historyList");
  const statsEl = document.getElementById("historyStats");

  if (!dialog || !listEl || !statsEl) {
    console.error('Không tìm thấy elements');
    return;
  }

  // Hiển thị loading
  listEl.innerHTML = `
    <div style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
      <i class="fa-solid fa-spinner fa-spin" style="font-size: 48px; margin-bottom: 20px;"></i>
      <p>Đang tải lịch sử...</p>
    </div>
  `;

  dialog.showModal();

  try {
    // Lấy TOÀN BỘ bài hát (cả đã xác minh, chờ duyệt và bị từ chối)
    const { data: allSongs, error } = await supabase
      .from('songs')
      .select('*')
      .order('Ngày thêm', { ascending: false });

    if (error) throw error;

    if (!allSongs || allSongs.length === 0) {
      listEl.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <i class="fa-solid fa-circle-exclamation" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i>
          <p>Chưa có bài hát nào được thêm</p>
        </div>
      `;
      statsEl.innerHTML = '📊 Tổng: 0 bài';
      return;
    }

    // Đếm số bài theo trạng thái
    const verifiedCount = allSongs.filter(s => s['Xác minh'] === true).length;
    const rejectedCount = allSongs.filter(s => s['Xác minh'] === false && s.rejection_status === 'rejected').length;
    const pendingCount = allSongs.filter(s => s['Xác minh'] === false && (!s.rejection_status || s.rejection_status === 'pending')).length;

    // Cập nhật thống kê
    statsEl.innerHTML = `
      <div style="display: flex; gap: 24px; flex-wrap: wrap; justify-content: center;">
        <div style="text-align: center;">
          <div style="font-size: 28px; font-weight: 700; color: var(--accent-primary);">${allSongs.length}</div>
          <div style="font-size: 13px; color: var(--text-muted);">Tổng số bài</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 28px; font-weight: 700; color: #10b981;">✅ ${verifiedCount}</div>
          <div style="font-size: 13px; color: var(--text-muted);">Đã duyệt</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 28px; font-weight: 700; color: #f59e0b;">⏳ ${pendingCount}</div>
          <div style="font-size: 13px; color: var(--text-muted);">Chờ duyệt</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 28px; font-weight: 700; color: #ef4444;">❌ ${rejectedCount}</div>
          <div style="font-size: 13px; color: var(--text-muted);">Từ chối</div>
        </div>
      </div>
    `;

    // Render danh sách
    listEl.innerHTML = allSongs.map((song, index) => {
      const addedDate = song['Ngày thêm']
        ? new Date(song['Ngày thêm']).toLocaleString(getCurrentLocale(), {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
        : 'N/A';

      const releaseDate = song['Ngày phát hành'] || 'N/A';
      const isVerified = song['Xác minh'] === true;
      const isRejected = song['Xác minh'] === false && song.rejection_status === 'rejected';
      const addedBy = song['add_by'] || 'Không rõ';

      // Xác định trạng thái
      let statusClass = 'status-pending';
      let statusText = '⏳ Chờ duyệt';
      let itemClass = 'pending';

      if (isVerified) {
        statusClass = 'status-verified';
        statusText = '✅ Đã duyệt';
        itemClass = 'verified';
      } else if (isRejected) {
        statusClass = 'status-rejected';
        statusText = '❌ Từ chối';
        itemClass = 'rejected';
      }

      // Badge cho top 3
      let badge = '';
      if (index === 0) badge = '<span style="background: linear-gradient(135deg, #ffd700, #ffb300); color: white; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; margin-left: 8px;">🥇 MỚI NHẤT</span>';
      else if (index === 1) badge = '<span style="background: linear-gradient(135deg, #c0c0c0, #a9a9a9); color: white; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; margin-left: 8px;">🥈 THỨ 2</span>';
      else if (index === 2) badge = '<span style="background: linear-gradient(135deg, #cd7f32, #b87333); color: white; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; margin-left: 8px;">🥉 THỨ 3</span>';

      // Hiển thị lý do từ chối nếu có
      const rejectionReason = isRejected && song.rejection_reason
        ? `<div class="rejection-reason-history">
             <i class="fa-solid fa-circle-info"></i> 
             <strong>Lý do:</strong> ${song.rejection_reason}
           </div>`
        : '';

      return `
        <div class="history-item ${itemClass}" onclick="showLyric(${song.Id})">
          <div class="history-left">
            ${song.avatar
          ? `<img src="${song.avatar}" alt="avatar">`
          : '<div class="history-no-avatar">🎵</div>'}
            <div class="history-info">
              <div class="history-title">
                ${song['Tên']}
                ${badge}
              </div>
              <div class="history-artist">${song['Ca sĩ']}</div>
              <div class="history-meta">
                <span>👤 ${addedBy}</span>
                <span>•</span>
                <span>📅 Phát hành: ${releaseDate}</span>
              </div>
              ${rejectionReason}
            </div>
          </div>
          <div class="history-right">
  ${window.currentUserRole === 'Admin' && !isVerified && !isRejected ? `
    <div class="admin-actions">
      <button 
        class="btn-approve-history" 
        onclick="event.stopPropagation(); approveSong(${song.Id})"
        title="Duyệt bài này"
      >
        <i class="fa-solid fa-check"></i> Duyệt
      </button>
      <button 
        class="btn-reject-history" 
        onclick="event.stopPropagation(); openRejectDialog(${song.Id})"
        title="Từ chối bài này"
      >
        <i class="fa-solid fa-xmark"></i> Từ chối
      </button>
    </div>
  ` : `
    <div class="history-status ${statusClass}">
      ${statusText}
    </div>
  `}
  <div class="history-date">
    <i class="fa-solid fa-clock"></i>
    ${addedDate}
  </div>
</div>
        </div>
      `;
    }).join('');

  } catch (error) {
    console.error('Lỗi khi tải lịch sử:', error);
    listEl.innerHTML = `
      <div style="text-align: center; padding: 60px 20px; color: #ef4444;">
        <i class="fa-solid fa-triangle-exclamation" style="font-size: 48px; margin-bottom: 20px;"></i>
        <p>Có lỗi xảy ra khi tải lịch sử</p>
      </div>
    `;
  }
};


window.openAlbumDialog = async function () {
  const dialog = document.getElementById("albumDialog");
  const listEl = document.getElementById("albumList");
  const statsEl = document.getElementById("albumStats");

  listEl.innerHTML = `<div style="text-align: center; padding: 60px 20px; color: var(--text-muted);"><i class="fa-solid fa-spinner fa-spin" style="font-size: 48px; margin-bottom: 20px;"></i><p>Đang tải...</p></div>`;
  dialog.showModal();

  try {
    const { data: allSongs, error } = await supabase
      .from('songs')
      .select('*')
      .eq('Xác minh', true)
      .not('album', 'is', null);

    if (error) throw error;

    // Nhóm theo album
    const albumMap = {};
    allSongs.forEach(song => {
      const albumName = song.album.trim();
      if (!albumMap[albumName]) {
        albumMap[albumName] = [];
      }
      albumMap[albumName].push(song);
    });

    const albums = Object.entries(albumMap)
      .map(([name, songs]) => ({ name, songs, count: songs.length }))
      .sort((a, b) => b.count - a.count);

    statsEl.innerHTML = `<div style="text-align: center; padding: 20px; background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.1)); border: 1px solid var(--accent-primary); border-radius: 16px; margin-bottom: 24px;"><div style="font-size: 28px; font-weight: 700; color: var(--accent-primary);">${albums.length}</div><div style="font-size: 13px; color: var(--text-muted);">Tổng số Album</div></div>`;

    if (albums.length === 0) {
      listEl.innerHTML = `<div style="text-align: center; padding: 60px 20px; color: var(--text-muted);"><i class="fa-solid fa-compact-disc" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i><p>Chưa có album nào</p></div>`;
      return;
    }

    listEl.innerHTML = albums.map((album, index) => `
      <div class="history-item" onclick="showAlbumSongs('${album.name.replace(/'/g, "\\'")}')">
        <div class="history-left">
          <div class="history-no-avatar">💿</div>
          <div class="history-info">
            <div class="history-title">${album.name}${index < 3 ? (index === 0 ? ' <span style="background: linear-gradient(135deg, #ffd700, #ffb300); color: white; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; margin-left: 8px;">🥇 TOP 1</span>' : index === 1 ? ' <span style="background: linear-gradient(135deg, #c0c0c0, #a9a9a9); color: white; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; margin-left: 8px;">🥈 TOP 2</span>' : ' <span style="background: linear-gradient(135deg, #cd7f32, #b87333); color: white; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; margin-left: 8px;">🥉 TOP 3</span>') : ''}</div>
            <div class="history-artist">Ca sĩ: ${[...new Set(album.songs.map(s => s['Ca sĩ']))].join(', ')}</div>
          </div>
        </div>
        <div class="history-right">
          <div class="history-status status-verified">🎵 ${album.count} bài</div>
        </div>
      </div>
    `).join('');

  } catch (error) {
    console.error('Lỗi:', error);
    listEl.innerHTML = `<div style="text-align: center; padding: 60px 20px; color: #ef4444;"><p>Có lỗi xảy ra</p></div>`;
  }
};

document.addEventListener('app-languagechange', () => {
  if (window._songs) {
    initializeArtistFilter();
    applyFilters();
  }
  if (lyricDialog.open && window.currentSongId && window._songs) {
    const song = window._songs.find(item => item.Id === window.currentSongId);
    if (song) {
      const meta = buildLyricDialogMeta(song);
      dAlbum.textContent = meta.albumText;
      dAddedBy.textContent = meta.addedByText;
      renderSongComments(song);
    }
  }
  updateStreakCard(window.currentStreakCount || 0);
  renderAdminRecommendationCard();
  refreshAdminRecommendationTexts();
  if (adminRecommendationDialog?.open) {
    populateAdminRecommendationSongOptions(adminRecommendationSongId?.value);
    syncAdminRecommendationForm();
    updateAdminRecommendationPreview(currentAdminRecommendation);
  }
});

window.showAlbumSongs = async function (albumName) {
  const { data: songs, error } = await supabase
    .from('songs')
    .select('*')
    .eq('album', albumName)
    .eq('Xác minh', true);

  if (error) {
    console.error(error);
    return;
  }

  const listHtml = songs.map(song => `
    <div class="user-song-item" onclick="showLyric(${song.Id})">
      ${song.avatar ? `<img src="${song.avatar}" alt="avatar">` : '<div style="width: 50px; height: 50px; background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 24px;">🎵</div>'}
      <div class="user-song-info">
        <div class="user-song-title">${song['Tên']}</div>
        <div class="user-song-artist">${song['Ca sĩ']}</div>
      </div>
    </div>
  `).join('');

  albumDialog.close();

  const tempDialog = document.createElement('dialog');
  tempDialog.style.cssText = document.getElementById('userSongsDialog').style.cssText;
  tempDialog.innerHTML = `
    <button class="btn close" onclick="this.closest('dialog').close(); this.closest('dialog').remove();">
      <span style="font-size: 30px;">+</span>
    </button>
    <h2>💿 ${albumName}</h2>
    <div style="padding: 24px;">
      <div style="padding: 16px 20px; background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.1)); border: 1px solid var(--accent-primary); border-radius: 12px; margin-bottom: 20px; text-align: center; font-weight: 600;">📊 Tổng số bài: <span style="color: var(--accent-primary); font-size: 20px;">${songs.length}</span></div>
      <div style="max-height: 500px; overflow-y: auto;">${listHtml}</div>
    </div>
  `;
  document.body.appendChild(tempDialog);
  tempDialog.showModal();
};

window.rejectSongFromHistory = async function (songId) {
  if (!window.currentUser) {
    alert('Vui lòng đăng nhập!');
    return;
  }

  if (window.currentUserRole !== 'Admin') {
    alert('Chỉ Admin mới có quyền từ chối bài!');
    return;
  }

  const reason = prompt('Nhập lý do từ chối (tối thiểu 10 ký tự):');

  if (!reason) return;

  if (reason.trim().length < 10) {
    alert('Lý do quá ngắn! Vui lòng nhập ít nhất 10 ký tự.');
    return;
  }

  if (!confirm('Bạn chắc chắn muốn từ chối bài hát này?')) return;

  try {
    const { error } = await supabase
      .from('songs')
      .update({
        'Xác minh': false,
        'rejection_status': 'rejected',
        'rejection_reason': reason.trim()
      })
      .eq('Id', songId);

    if (error) throw error;

    alert('✅ Đã từ chối bài hát!');
    openHistoryDialog(); // Reload lịch sử

  } catch (error) {
    console.error('Error:', error);
    alert('❌ Có lỗi xảy ra: ' + error.message);
  }
};