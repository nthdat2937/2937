// ===== SETTINGS + I18N SYSTEM =====

const defaultSettings = {
  animations: true,
  backgroundEffects: true,
  glowEffects: true,
  backdropBlur: true,
  boxShadows: true,
  imageHoverEffects: true,
  tableHoverEffects: true,
  dialogAnimations: true,
  theme: 'dark',
  language: 'vi'
};

const LANGUAGE_ORDER = ['vi', 'ko', 'en'];

const LANGUAGE_META = {
  vi: { code: 'VI', locale: 'vi-VN' },
  ko: { code: 'KO', locale: 'ko-KR' },
  en: { code: 'EN', locale: 'en-US' }
};

const I18N = {
  vi: {
    languageButtonTitle: 'Đổi ngôn ngữ',
    loginTitle: 'Đăng nhập',
    profileInfoTitle: 'Thông tin tài khoản',
    logoutTitle: 'Đăng xuất',
    menuTitle: 'Menu',
    sidebarSong: 'Bài hát',
    sidebarFeature: 'Tính năng khác',
    sidebarMinigame: 'Minigame',
    sidebarSocial: 'Cộng đồng',
    sidebarAbout: 'Giới thiệu',
    refresh: 'Làm mới',
    addSong: 'Thêm bài hát',
    youtubeSearch: 'Tìm video YouTube',
    askAi: 'Hỏi AI',
    home: 'Trang chủ',
    settings: 'Cài đặt',
    history: 'Lịch sử thêm bài',
    albumList: 'Danh sách Album',
    ranking: 'Bảng xếp hạng',
    streakCheckin: 'Điểm danh hàng ngày',
    favouriteSongs: 'Bài hát yêu thích',
    usersList: 'Danh sách người dùng',
    guide: 'Hướng dẫn sử dụng',
    updates: 'Thông tin cập nhật',
    searchPlaceholder: '🔎 Tìm theo tên, ca sĩ, sáng tác hoặc lời bài hát...',
    artistAll: '-- Tất cả ca sĩ --',
    tagFilterLabel: 'Lọc theo tag:',
    clearFilter: 'Xóa bộ lọc',
    totalSongsLabel: 'Tổng số bài hát',
    streakDefaultLabel: 'Chưa có streak',
    streakHack: 'Hack',
    streakChicken: 'Con gà',
    streakNoob: 'Noob',
    streakBeginner: 'Beginner',
    streakAmateur: 'Amateur',
    streakPro: 'Pro',
    streakMaster: 'Master',
    streakLegend: 'Legend',
    streakMythical: 'Mythical',
    streakGod: 'GOD',
    streakDaySuffix: 'ngày',
    cancelText: 'Hủy',
    mfyLabel: 'Music for YOU',
    adminRecommendationLabel: 'Đề xuất của Admin',
    adminRecommendationEmpty: 'Admin chưa đề xuất gì.',
    adminRecommendationDialogTitle: 'Đề xuất của Admin',
    adminRecommendationManage: 'Chỉnh đề xuất',
    adminRecommendationTypeLabel: 'Loại nội dung',
    adminRecommendationTypeSong: 'Bài hát trong web',
    adminRecommendationTypeYoutube: 'Link YouTube',
    adminRecommendationTypeSpotify: 'Link Spotify',
    adminRecommendationSongLabel: 'Chọn bài hát',
    adminRecommendationSongPlaceholder: '-- Chọn một bài hát --',
    adminRecommendationUrlLabel: 'Dán link',
    adminRecommendationPreviewLabel: 'Xem trước',
    adminRecommendationPreviewEmpty: 'Chưa có dữ liệu.',
    adminRecommendationSave: 'Lưu đề xuất',
    adminRecommendationAdminOnly: 'Chỉ Admin mới có thể chỉnh đề xuất này.',
    adminRecommendationSongMissing: 'Bài hát được đề xuất hiện không còn trong danh sách.',
    adminRecommendationPickSongError: 'Hãy chọn một bài hát trong danh sách.',
    adminRecommendationUrlError: 'Hãy nhập link hợp lệ.',
    adminRecommendationUrlTypeError: 'Link không đúng với loại nội dung đã chọn.',
    adminRecommendationLoadingMeta: 'Đang lấy thông tin...',
    adminRecommendationSaveError: 'Không thể lưu đề xuất lúc này.',
    adminRecommendationLocalFallback: 'Không lưu được lên server, đã lưu tạm trên trình duyệt này.',
    tableAvatar: 'Avatar',
    tableSong: 'Tên bài hát',
    tableArtist: 'Ca sĩ',
    tableComposer: 'Sáng tác',
    tableRelease: 'Ngày phát hành',
    tableHot: 'Hot',
    tableActions: 'Thao tác',
    lyricListenLabel: 'Nghe nhạc',
    lyricOpenWebMusicButton: 'Nghe Nhạc Trên Web',
    lyricVideoLabel: 'Xem MV / Video',
    lyricOpenWebVideoButton: 'Xem Video Trên Web',
    lyricVolumeWarning: 'Chú ý âm lượng khi phát nhạc!',
    audioVisualTitle: 'Lyric',
    albumPrefix: 'Album',
    addedByPrefix: 'Người thêm',
    favouriteTitle: 'Yêu thích',
    lyricTitle: 'Chi tiết',
    editTitle: 'Chỉnh sửa',
    deleteTitle: 'Xóa',
    noHot: 'Không có',
    noAlbum: 'Không có',
    noLyricsYet: 'Chưa có lời bài hát',
    commentsTitle: 'Bình luận ({count})',
    commentsPlaceholder: 'Viết bình luận cho bài hát này...',
    commentsSubmit: 'Gửi bình luận',
    commentsMeta: 'Tối đa 500 ký tự',
    commentsLoginHint: 'Đăng nhập để bình luận về bài hát này.',
    commentsEmpty: 'Chưa có bình luận nào. Bạn mở hàng đi.',
    commentsValidation: 'Nhập bình luận trước khi gửi.',
    commentsDeleteConfirm: 'Bạn có chắc muốn xóa bình luận này?',
    commentsDelete: 'Xóa bình luận',
    commentsLoadError: 'Không thể tải bình luận.',
    commentsSaveError: 'Không thể gửi bình luận.',
    settingsDialogTitle: 'Cài đặt',
    settingsThemeTitle: 'Giao diện',
    settingThemeLabel: 'Theme',
    settingThemeDescription: 'Chọn giao diện sáng hoặc tối',
    themeDark: '🌙 Tối',
    themeLight: '☀️ Sáng',
    settingsLanguageTitle: 'Ngôn ngữ',
    settingLanguageLabel: 'Ngôn ngữ giao diện',
    settingLanguageDescription: 'Đồng bộ với nút đổi ngôn ngữ ở header',
    languageVi: 'Vietnamese (VI)',
    languageKo: 'Korean (KO)',
    languageEn: 'English (EN)',
    settingsPerformanceTitle: 'Hiệu suất',
    settingsPerformanceBadge: 'Giảm lag',
    settingAnimationsLabel: 'Hiệu ứng chuyển động',
    settingAnimationsDescription: 'Animations và transitions (giảm lag ~15%)',
    settingBackgroundEffectsLabel: 'Hiệu ứng nền gradient',
    settingBackgroundEffectsDescription: '4 lớp gradient + SVG noise (giảm lag ~25%)',
    settingGlowEffectsLabel: 'Hiệu ứng phát sáng',
    settingGlowEffectsDescription: 'Glow effects và drop-shadows (giảm lag ~10%)',
    settingBackdropBlurLabel: 'Backdrop Blur',
    settingBackdropBlurDescription: 'Làm mờ nền dialog/header (giảm lag ~30%)',
    settingBoxShadowsLabel: 'Box Shadows',
    settingBoxShadowsDescription: 'Bóng đổ các elements (giảm lag ~15%)',
    settingImageHoverLabel: 'Hiệu ứng hover ảnh',
    settingImageHoverDescription: 'Transform/scale ảnh khi hover (giảm lag ~8%)',
    settingTableHoverLabel: 'Hiệu ứng hover bảng',
    settingTableHoverDescription: 'Gradient/scale rows khi hover (giảm lag ~12%)',
    settingDialogAnimationsLabel: 'Animation dialog',
    settingDialogAnimationsDescription: 'Pop-up effect khi mở dialog (giảm lag ~5%)',
    settingsTipsTitle: 'Gợi ý',
    settingsTipsContent: '💡 <strong>Lag nhẹ:</strong> Tắt Backdrop Blur + Background Effects<br>🚀 <strong>Lag trung bình:</strong> Tắt thêm Box Shadows + Table Hover<br>⚡ <strong>Lag nặng:</strong> Tắt hết tất cả (giảm lag lên đến 95%)<br>📌 Cài đặt tự động lưu và áp dụng mỗi khi mở web',
    settingsReset: 'Đặt lại mặc định',
    settingsSave: 'Lưu cài đặt',
    settingsSaved: '✅ Đã lưu cài đặt!',
    settingsResetConfirm: 'Bạn có chắc muốn đặt lại về mặc định?',
    settingsResetDone: '🔄 Đã đặt lại cài đặt mặc định!',
    rankingDialogTitle: '🏆 Bảng xếp hạng đóng góp',
    userSongsTitlePrefix: 'Bài hát của',
    favouriteDialogTitle: '❤️ Bài Hát Yêu Thích',
    favouriteStatsLabel: 'Tổng số bài yêu thích',
    favouritePlaylistButton: 'Phát playlist',
    favouritePlaylistEmpty: 'Chưa có bài yêu thích để phát.',
    favouritePlaylistStatus: 'Playlist yêu thích {current}/{total}',
    favouritePlaylistCompleted: 'Đã phát hết danh sách yêu thích.',
    youtubePlaylistDialogTitle: 'Playlist yêu thích',
    youtubePlaylistListTitle: 'Các bài trong playlist',
    guideDialogTitle: '📖 Hướng dẫn sử dụng',
    historyDialogTitle: 'Lịch sử thêm bài hát',
    albumDialogTitle: 'Danh sách Album',
    latestBadge: 'MỚI',
    viewAllUpdates: 'Xem tất cả',
    updateHistoryTitle: 'Lịch sử cập nhật',
    newestLabel: 'MỚI NHẤT',
    today: 'Hôm nay',
    yesterday: 'Hôm qua',
    daysAgo: '{count} ngày trước'
  },
  ko: {
    languageButtonTitle: '언어 변경',
    loginTitle: '로그인',
    profileInfoTitle: '계정 정보',
    logoutTitle: '로그아웃',
    menuTitle: '메뉴',
    sidebarSong: '노래',
    sidebarFeature: '기타 기능',
    sidebarMinigame: '미니게임',
    sidebarSocial: '커뮤니티',
    sidebarAbout: '소개',
    refresh: '새로고침',
    addSong: '노래 추가',
    youtubeSearch: 'YouTube 영상 찾기',
    askAi: 'AI에게 묻기',
    home: '홈',
    settings: '설정',
    history: '추가 기록',
    albumList: '앨범 목록',
    ranking: '랭킹',
    streakCheckin: '매일 체크인',
    favouriteSongs: '좋아하는 노래',
    usersList: '사용자 목록',
    guide: '사용 가이드',
    updates: '업데이트 정보',
    searchPlaceholder: '🔎 제목, 가수, 작곡가 또는 가사로 검색...',
    artistAll: '-- 모든 가수 --',
    tagFilterLabel: '태그별 필터:',
    clearFilter: '필터 지우기',
    totalSongsLabel: '총 노래 수',
    streakDefaultLabel: '아직 streak 없음',
    streakHack: '해킹',
    streakChicken: '초보 병아리',
    streakNoob: '초보',
    streakBeginner: '입문자',
    streakAmateur: '아마추어',
    streakPro: '프로',
    streakMaster: '마스터',
    streakLegend: '레전드',
    streakMythical: '신화',
    streakGod: 'GOD',
    streakDaySuffix: '일',
    cancelText: '취소',
    mfyLabel: 'Music for YOU',
    adminRecommendationLabel: '관리자 추천',
    adminRecommendationEmpty: '아직 관리자 추천이 없습니다.',
    adminRecommendationDialogTitle: '관리자 추천',
    adminRecommendationManage: '추천 수정',
    adminRecommendationTypeLabel: '콘텐츠 종류',
    adminRecommendationTypeSong: '웹의 노래',
    adminRecommendationTypeYoutube: 'YouTube 링크',
    adminRecommendationTypeSpotify: 'Spotify 링크',
    adminRecommendationSongLabel: '노래 선택',
    adminRecommendationSongPlaceholder: '-- 노래를 선택하세요 --',
    adminRecommendationUrlLabel: '링크 붙여넣기',
    adminRecommendationPreviewLabel: '미리보기',
    adminRecommendationPreviewEmpty: '데이터가 없습니다.',
    adminRecommendationSave: '추천 저장',
    adminRecommendationAdminOnly: '관리자만 이 추천을 수정할 수 있습니다.',
    adminRecommendationSongMissing: '추천된 노래가 현재 목록에 없습니다.',
    adminRecommendationPickSongError: '목록에서 노래를 선택하세요.',
    adminRecommendationUrlError: '올바른 링크를 입력하세요.',
    adminRecommendationUrlTypeError: '선택한 종류와 맞지 않는 링크입니다.',
    adminRecommendationLoadingMeta: '정보를 불러오는 중...',
    adminRecommendationSaveError: '지금은 추천을 저장할 수 없습니다.',
    adminRecommendationLocalFallback: '서버 저장에 실패해서 현재 브라우저에만 임시 저장했습니다.',
    tableAvatar: '아바타',
    tableSong: '노래 제목',
    tableArtist: '가수',
    tableComposer: '작곡',
    tableRelease: '발매일',
    tableHot: '핫',
    tableActions: '작업',
    lyricListenLabel: '음악 듣기',
    lyricOpenWebMusicButton: '웹에서 음악 듣기',
    lyricVideoLabel: 'MV / 영상 보기',
    lyricOpenWebVideoButton: '웹에서 영상 보기',
    lyricVolumeWarning: '음악 재생 시 볼륨을 확인하세요!',
    audioVisualTitle: '가사',
    albumPrefix: '앨범',
    addedByPrefix: '추가한 사람',
    favouriteTitle: '즐겨찾기',
    lyricTitle: '상세',
    editTitle: '수정',
    deleteTitle: '삭제',
    noHot: '없음',
    noAlbum: '없음',
    noLyricsYet: '가사가 아직 없습니다',
    commentsTitle: '댓글 ({count})',
    commentsPlaceholder: '이 노래에 댓글을 남겨보세요...',
    commentsSubmit: '댓글 작성',
    commentsMeta: '최대 500자',
    commentsLoginHint: '이 노래에 댓글을 남기려면 로그인하세요.',
    commentsEmpty: '아직 댓글이 없습니다. 첫 댓글을 남겨보세요.',
    commentsValidation: '댓글 내용을 입력하세요.',
    commentsDeleteConfirm: '이 댓글을 삭제할까요?',
    commentsDelete: '댓글 삭제',
    commentsLoadError: '댓글을 불러오지 못했습니다.',
    commentsSaveError: '댓글을 저장하지 못했습니다.',
    settingsDialogTitle: '설정',
    settingsThemeTitle: '테마',
    settingThemeLabel: '테마',
    settingThemeDescription: '밝은 테마 또는 어두운 테마를 선택하세요',
    themeDark: '🌙 다크',
    themeLight: '☀️ 라이트',
    settingsLanguageTitle: '언어',
    settingLanguageLabel: '인터페이스 언어',
    settingLanguageDescription: '헤더의 언어 버튼과 동기화됩니다',
    languageVi: 'Vietnamese (VI)',
    languageKo: 'Korean (KO)',
    languageEn: 'English (EN)',
    settingsPerformanceTitle: '성능',
    settingsPerformanceBadge: '렉 줄이기',
    settingAnimationsLabel: '모션 효과',
    settingAnimationsDescription: '애니메이션 및 전환 효과 (렉 약 15% 감소)',
    settingBackgroundEffectsLabel: '그라디언트 배경 효과',
    settingBackgroundEffectsDescription: '4개 그라디언트 레이어 + SVG 노이즈 (렉 약 25% 감소)',
    settingGlowEffectsLabel: '글로우 효과',
    settingGlowEffectsDescription: '글로우 효과와 드롭 섀도우 (렉 약 10% 감소)',
    settingBackdropBlurLabel: '배경 블러',
    settingBackdropBlurDescription: '다이얼로그/헤더 배경 흐림 (렉 약 30% 감소)',
    settingBoxShadowsLabel: '박스 그림자',
    settingBoxShadowsDescription: '요소 그림자 효과 (렉 약 15% 감소)',
    settingImageHoverLabel: '이미지 호버 효과',
    settingImageHoverDescription: '호버 시 이미지 transform/scale (렉 약 8% 감소)',
    settingTableHoverLabel: '테이블 호버 효과',
    settingTableHoverDescription: '행 hover 시 gradient/scale (렉 약 12% 감소)',
    settingDialogAnimationsLabel: '다이얼로그 애니메이션',
    settingDialogAnimationsDescription: '다이얼로그 열릴 때 팝업 효과 (렉 약 5% 감소)',
    settingsTipsTitle: '팁',
    settingsTipsContent: '💡 <strong>가벼운 렉:</strong> Backdrop Blur + Background Effects 끄기<br>🚀 <strong>중간 렉:</strong> Box Shadows + Table Hover도 끄기<br>⚡ <strong>심한 렉:</strong> 전부 끄기 (최대 95% 감소)<br>📌 설정은 자동 저장되며 웹을 열 때마다 적용됩니다',
    settingsReset: '기본값으로 재설정',
    settingsSave: '설정 저장',
    settingsSaved: '✅ 설정이 저장되었습니다!',
    settingsResetConfirm: '기본 설정으로 재설정할까요?',
    settingsResetDone: '🔄 기본 설정으로 재설정했습니다!',
    rankingDialogTitle: '🏆 기여 랭킹',
    userSongsTitlePrefix: '노래 목록:',
    favouriteDialogTitle: '❤️ 좋아하는 노래',
    favouriteStatsLabel: '좋아요한 노래 수',
    favouritePlaylistButton: '플레이리스트 재생',
    favouritePlaylistEmpty: '재생할 좋아요 노래가 없습니다.',
    favouritePlaylistStatus: '좋아요 플레이리스트 {current}/{total}',
    favouritePlaylistCompleted: '좋아요 플레이리스트 재생이 끝났습니다.',
    youtubePlaylistDialogTitle: '좋아요 플레이리스트',
    youtubePlaylistListTitle: '플레이리스트의 곡들',
    guideDialogTitle: '📖 사용 가이드',
    historyDialogTitle: '노래 추가 기록',
    albumDialogTitle: '앨범 목록',
    latestBadge: 'NEW',
    viewAllUpdates: '모두 보기',
    updateHistoryTitle: '업데이트 기록',
    newestLabel: '최신',
    today: '오늘',
    yesterday: '어제',
    daysAgo: '{count}일 전'
  },
  en: {
    languageButtonTitle: 'Change language',
    loginTitle: 'Log in',
    profileInfoTitle: 'Account info',
    logoutTitle: 'Log out',
    menuTitle: 'Menu',
    sidebarSong: 'Songs',
    sidebarFeature: 'Other features',
    sidebarMinigame: 'Minigames',
    sidebarSocial: 'Social',
    sidebarAbout: 'About',
    refresh: 'Refresh',
    addSong: 'Add song',
    youtubeSearch: 'Find YouTube video',
    askAi: 'Ask AI',
    home: 'Home',
    settings: 'Settings',
    history: 'Song history',
    albumList: 'Album list',
    ranking: 'Ranking',
    streakCheckin: 'Daily check-in',
    favouriteSongs: 'Favourite songs',
    usersList: 'User list',
    guide: 'User guide',
    updates: 'Updates',
    searchPlaceholder: '🔎 Search by title, artist, composer, or lyrics...',
    artistAll: '-- All artists --',
    tagFilterLabel: 'Filter by tag:',
    clearFilter: 'Clear filter',
    totalSongsLabel: 'Total songs',
    streakDefaultLabel: 'No streak yet',
    streakHack: 'Hack',
    streakChicken: 'Chicken',
    streakNoob: 'Noob',
    streakBeginner: 'Beginner',
    streakAmateur: 'Amateur',
    streakPro: 'Pro',
    streakMaster: 'Master',
    streakLegend: 'Legend',
    streakMythical: 'Mythical',
    streakGod: 'GOD',
    streakDaySuffix: 'days',
    cancelText: 'Cancel',
    mfyLabel: 'Music for YOU',
    adminRecommendationLabel: 'Admin Recommendation',
    adminRecommendationEmpty: 'No admin recommendation yet.',
    adminRecommendationDialogTitle: 'Admin Recommendation',
    adminRecommendationManage: 'Edit recommendation',
    adminRecommendationTypeLabel: 'Content type',
    adminRecommendationTypeSong: 'Song in database',
    adminRecommendationTypeYoutube: 'YouTube link',
    adminRecommendationTypeSpotify: 'Spotify link',
    adminRecommendationSongLabel: 'Choose song',
    adminRecommendationSongPlaceholder: '-- Choose a song --',
    adminRecommendationUrlLabel: 'Paste URL',
    adminRecommendationPreviewLabel: 'Preview',
    adminRecommendationPreviewEmpty: 'No data yet.',
    adminRecommendationSave: 'Save recommendation',
    adminRecommendationAdminOnly: 'Only admins can edit this recommendation.',
    adminRecommendationSongMissing: 'The recommended song is no longer available in the list.',
    adminRecommendationPickSongError: 'Please choose a song from the list.',
    adminRecommendationUrlError: 'Please enter a valid URL.',
    adminRecommendationUrlTypeError: 'The link does not match the selected content type.',
    adminRecommendationLoadingMeta: 'Loading metadata...',
    adminRecommendationSaveError: 'Could not save the recommendation right now.',
    adminRecommendationLocalFallback: 'Could not save to the server, so it was stored only in this browser.',
    tableAvatar: 'Avatar',
    tableSong: 'Song title',
    tableArtist: 'Artist',
    tableComposer: 'Composer',
    tableRelease: 'Release date',
    tableHot: 'Hot',
    tableActions: 'Actions',
    lyricListenLabel: 'Listen',
    lyricOpenWebMusicButton: 'Listen On Web',
    lyricVideoLabel: 'Watch MV / Video',
    lyricOpenWebVideoButton: 'Watch Video On Web',
    lyricVolumeWarning: 'Check the volume before playing music!',
    audioVisualTitle: 'Lyrics',
    albumPrefix: 'Album',
    addedByPrefix: 'Added by',
    favouriteTitle: 'Favourite',
    lyricTitle: 'Details',
    editTitle: 'Edit',
    deleteTitle: 'Delete',
    noHot: 'None',
    noAlbum: 'None',
    noLyricsYet: 'No lyrics yet',
    commentsTitle: 'Comments ({count})',
    commentsPlaceholder: 'Write a comment about this song...',
    commentsSubmit: 'Post comment',
    commentsMeta: 'Up to 500 characters',
    commentsLoginHint: 'Log in to comment on this song.',
    commentsEmpty: 'No comments yet. Be the first one.',
    commentsValidation: 'Enter a comment before submitting.',
    commentsDeleteConfirm: 'Delete this comment?',
    commentsDelete: 'Delete comment',
    commentsLoadError: 'Could not load comments.',
    commentsSaveError: 'Could not save comment.',
    settingsDialogTitle: 'Settings',
    settingsThemeTitle: 'Appearance',
    settingThemeLabel: 'Theme',
    settingThemeDescription: 'Choose light or dark mode',
    themeDark: '🌙 Dark',
    themeLight: '☀️ Light',
    settingsLanguageTitle: 'Language',
    settingLanguageLabel: 'Interface language',
    settingLanguageDescription: 'Synced with the header language button',
    languageVi: 'Vietnamese (VI)',
    languageKo: 'Korean (KO)',
    languageEn: 'English (EN)',
    settingsPerformanceTitle: 'Performance',
    settingsPerformanceBadge: 'Reduce lag',
    settingAnimationsLabel: 'Motion effects',
    settingAnimationsDescription: 'Animations and transitions (reduce lag by ~15%)',
    settingBackgroundEffectsLabel: 'Gradient background effects',
    settingBackgroundEffectsDescription: '4 gradient layers + SVG noise (reduce lag by ~25%)',
    settingGlowEffectsLabel: 'Glow effects',
    settingGlowEffectsDescription: 'Glow effects and drop shadows (reduce lag by ~10%)',
    settingBackdropBlurLabel: 'Backdrop blur',
    settingBackdropBlurDescription: 'Blur dialog/header backgrounds (reduce lag by ~30%)',
    settingBoxShadowsLabel: 'Box shadows',
    settingBoxShadowsDescription: 'Element shadow effects (reduce lag by ~15%)',
    settingImageHoverLabel: 'Image hover effects',
    settingImageHoverDescription: 'Transform/scale images on hover (reduce lag by ~8%)',
    settingTableHoverLabel: 'Table hover effects',
    settingTableHoverDescription: 'Gradient/scale rows on hover (reduce lag by ~12%)',
    settingDialogAnimationsLabel: 'Dialog animations',
    settingDialogAnimationsDescription: 'Pop-up effect when opening dialogs (reduce lag by ~5%)',
    settingsTipsTitle: 'Tips',
    settingsTipsContent: '💡 <strong>Light lag:</strong> Turn off Backdrop Blur + Background Effects<br>🚀 <strong>Medium lag:</strong> Also turn off Box Shadows + Table Hover<br>⚡ <strong>Heavy lag:</strong> Turn everything off (up to 95% less lag)<br>📌 Settings are saved automatically and applied every time you open the site',
    settingsReset: 'Reset to default',
    settingsSave: 'Save settings',
    settingsSaved: '✅ Settings saved!',
    settingsResetConfirm: 'Reset all settings to default?',
    settingsResetDone: '🔄 Default settings restored!',
    rankingDialogTitle: '🏆 Contribution ranking',
    userSongsTitlePrefix: 'Songs by',
    favouriteDialogTitle: '❤️ Favourite Songs',
    favouriteStatsLabel: 'Total favourite songs',
    favouritePlaylistButton: 'Play playlist',
    favouritePlaylistEmpty: 'No favourite songs to play.',
    favouritePlaylistStatus: 'Favourite playlist {current}/{total}',
    favouritePlaylistCompleted: 'Finished playing your favourite playlist.',
    youtubePlaylistDialogTitle: 'Favourite playlist',
    youtubePlaylistListTitle: 'Songs in this playlist',
    guideDialogTitle: '📖 User guide',
    historyDialogTitle: 'Song submission history',
    albumDialogTitle: 'Album list',
    latestBadge: 'NEW',
    viewAllUpdates: 'View all',
    updateHistoryTitle: 'Update history',
    newestLabel: 'LATEST',
    today: 'Today',
    yesterday: 'Yesterday',
    daysAgo: '{count} days ago'
  }
};

function loadSettings() {
  try {
    const saved = localStorage.getItem('ntdMusicSettings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : { ...defaultSettings };
  } catch (error) {
    console.error('Failed to parse settings:', error);
    return { ...defaultSettings };
  }
}

function saveSettings(settings) {
  localStorage.setItem('ntdMusicSettings', JSON.stringify(settings));
  localStorage.setItem('theme', settings.theme);
}

function getCurrentLanguage() {
  return loadSettings().language || 'vi';
}

function getLanguageMeta(language = getCurrentLanguage()) {
  return LANGUAGE_META[language] || LANGUAGE_META.vi;
}

function getTranslatedText(key, variables = {}, language = getCurrentLanguage()) {
  const dictionary = I18N[language] || I18N.vi;
  const fallback = I18N.vi[key] || key;
  let value = dictionary[key] || fallback;

  Object.entries(variables).forEach(([name, replacement]) => {
    value = value.replaceAll(`{${name}}`, replacement);
  });

  return value;
}

function setText(selector, text) {
  const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (element) element.textContent = text;
}

function setHTML(selector, html) {
  const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (element) element.innerHTML = html;
}

function setAttr(selector, attribute, value) {
  const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (element) element.setAttribute(attribute, value);
}

function updateLanguageButtons(language) {
  const { code } = getLanguageMeta(language);
  document.querySelectorAll('.btn-language').forEach(button => {
    const codeEl = button.querySelector('.language-code');
    if (codeEl) codeEl.textContent = code;
    button.title = getTranslatedText('languageButtonTitle', {}, language);
    button.setAttribute('aria-label', getTranslatedText('languageButtonTitle', {}, language));
  });
}

function updateSettingsSelectLabels(language) {
  const themeSelect = document.getElementById('settingTheme');
  if (themeSelect) {
    const darkOption = themeSelect.querySelector('option[value="dark"]');
    const lightOption = themeSelect.querySelector('option[value="light"]');
    if (darkOption) darkOption.textContent = getTranslatedText('themeDark', {}, language);
    if (lightOption) lightOption.textContent = getTranslatedText('themeLight', {}, language);
  }

  const languageSelect = document.getElementById('settingLanguage');
  if (languageSelect) {
    const viOption = languageSelect.querySelector('option[value="vi"]');
    const koOption = languageSelect.querySelector('option[value="ko"]');
    const enOption = languageSelect.querySelector('option[value="en"]');
    if (viOption) viOption.textContent = getTranslatedText('languageVi', {}, language);
    if (koOption) koOption.textContent = getTranslatedText('languageKo', {}, language);
    if (enOption) enOption.textContent = getTranslatedText('languageEn', {}, language);
  }
}

function translateStaticUI(language) {
  document.documentElement.lang = language;

  setAttr('#btn-login', 'title', getTranslatedText('loginTitle', {}, language));
  setAttr('#btn-info-sc', 'title', getTranslatedText('profileInfoTitle', {}, language));
  setAttr('#btn-logout', 'title', getTranslatedText('logoutTitle', {}, language));
  setAttr('#btn-menu', 'title', getTranslatedText('menuTitle', {}, language));
  setAttr('#btn-menu-guest', 'title', getTranslatedText('menuTitle', {}, language));

  setText('#sidebarTitle', getTranslatedText('menuTitle', {}, language));
  setText('#sidebarSongLabel', getTranslatedText('sidebarSong', {}, language));
  setText('#sidebarFeatureLabel', getTranslatedText('sidebarFeature', {}, language));
  setText('#sidebarMinigameLabel', getTranslatedText('sidebarMinigame', {}, language));
  setText('#sidebarSocialLabel', getTranslatedText('sidebarSocial', {}, language));
  setText('#sidebarAboutLabel', getTranslatedText('sidebarAbout', {}, language));

  setText('#btn-reload-sc span', getTranslatedText('refresh', {}, language));
  setText('#btn-add-sc span', getTranslatedText('addSong', {}, language));
  setText('#btn-youtube-sc span', getTranslatedText('youtubeSearch', {}, language));
  setText('#btn-hoiAI-sc span', getTranslatedText('askAi', {}, language));
  setText('#btn-home-sc span', getTranslatedText('home', {}, language));
  setText('#btn-settings-sc span', getTranslatedText('settings', {}, language));
  setText('#btn-history-sc span', getTranslatedText('history', {}, language));
  setText('#btn-album-sc span', getTranslatedText('albumList', {}, language));
  setText('#btn-rank-sc span', getTranslatedText('ranking', {}, language));
  setText('#btn-streak-sc span', getTranslatedText('streakCheckin', {}, language));
  setText('#btn-favourite-sc span', getTranslatedText('favouriteSongs', {}, language));
  setText('#btn-users-sc span', getTranslatedText('usersList', {}, language));
  setText('#btn-guide-sc span', getTranslatedText('guide', {}, language));
  setText('#btn-updates-sc span', getTranslatedText('updates', {}, language));

  setAttr('#searchInput', 'placeholder', getTranslatedText('searchPlaceholder', {}, language));
  setText('#tagFilterLabelText', getTranslatedText('tagFilterLabel', {}, language));
  setText('#btnClearTagFilterText', getTranslatedText('clearFilter', {}, language));
  setText('#totalSongsLabel', getTranslatedText('totalSongsLabel', {}, language));
  setText('#mfyLabel', getTranslatedText('mfyLabel', {}, language));

  setText('#tableHeaderAvatar', getTranslatedText('tableAvatar', {}, language));
  setText('#tableHeaderSong', getTranslatedText('tableSong', {}, language));
  setText('#tableHeaderArtist', getTranslatedText('tableArtist', {}, language));
  setText('#tableHeaderComposer', getTranslatedText('tableComposer', {}, language));
  setText('#tableHeaderRelease', getTranslatedText('tableRelease', {}, language));
  setText('#tableHeaderHot', getTranslatedText('tableHot', {}, language));
  setText('#tableHeaderActions', getTranslatedText('tableActions', {}, language));
  setText('#lyricListenLabel', getTranslatedText('lyricListenLabel', {}, language));
  setText('#lyricOpenWebMusicButtonText', getTranslatedText('lyricOpenWebMusicButton', {}, language));
  setText('#lyricVideoLabel', getTranslatedText('lyricVideoLabel', {}, language));
  setText('#lyricOpenWebVideoButtonText', getTranslatedText('lyricOpenWebVideoButton', {}, language));
  setAttr('#btnAudioVisualLyric', 'title', getTranslatedText('audioVisualTitle', {}, language));
  setAttr('#btnFavouriteLyric', 'title', getTranslatedText('favouriteTitle', {}, language));

  setText('#rankingDialogTitle', getTranslatedText('rankingDialogTitle', {}, language));
  setText('#userSongsTitlePrefix', getTranslatedText('userSongsTitlePrefix', {}, language));
  setText('#favouriteDialogTitle', getTranslatedText('favouriteDialogTitle', {}, language));
  setText('#favouriteStatsLabel', getTranslatedText('favouriteStatsLabel', {}, language));
  setText('#favouritePlaylistButtonText', getTranslatedText('favouritePlaylistButton', {}, language));
  setText('#youtubePlaylistDialogTitle', getTranslatedText('youtubePlaylistDialogTitle', {}, language));
  setText('#youtubePlaylistListTitle', getTranslatedText('youtubePlaylistListTitle', {}, language));
  setText('#guideDialogTitle', getTranslatedText('guideDialogTitle', {}, language));
  setText('#historyDialogTitle', getTranslatedText('historyDialogTitle', {}, language));
  setText('#albumDialogTitle', getTranslatedText('albumDialogTitle', {}, language));

  setHTML('#settingsDialogTitle', `<i class="fa-solid fa-gear"></i> ${getTranslatedText('settingsDialogTitle', {}, language)}`);
  setHTML('#settingsThemeTitle', `<i class="fa-solid fa-palette"></i> ${getTranslatedText('settingsThemeTitle', {}, language)}`);
  setText('#settingThemeLabel', getTranslatedText('settingThemeLabel', {}, language));
  setText('#settingThemeDescription', getTranslatedText('settingThemeDescription', {}, language));
  setHTML('#settingsLanguageTitle', `<i class="fa-solid fa-language"></i> ${getTranslatedText('settingsLanguageTitle', {}, language)}`);
  setText('#settingLanguageLabel', getTranslatedText('settingLanguageLabel', {}, language));
  setText('#settingLanguageDescription', getTranslatedText('settingLanguageDescription', {}, language));
  setHTML('#settingsPerformanceTitle', `<i class="fa-solid fa-gauge-high"></i> ${getTranslatedText('settingsPerformanceTitle', {}, language)} <span class="performance-badge" id="settingsPerformanceBadge">${getTranslatedText('settingsPerformanceBadge', {}, language)}</span>`);
  setText('#settingAnimationsLabel', getTranslatedText('settingAnimationsLabel', {}, language));
  setText('#settingAnimationsDescription', getTranslatedText('settingAnimationsDescription', {}, language));
  setText('#settingBackgroundEffectsLabel', getTranslatedText('settingBackgroundEffectsLabel', {}, language));
  setText('#settingBackgroundEffectsDescription', getTranslatedText('settingBackgroundEffectsDescription', {}, language));
  setText('#settingGlowEffectsLabel', getTranslatedText('settingGlowEffectsLabel', {}, language));
  setText('#settingGlowEffectsDescription', getTranslatedText('settingGlowEffectsDescription', {}, language));
  setText('#settingBackdropBlurLabel', getTranslatedText('settingBackdropBlurLabel', {}, language));
  setText('#settingBackdropBlurDescription', getTranslatedText('settingBackdropBlurDescription', {}, language));
  setText('#settingBoxShadowsLabel', getTranslatedText('settingBoxShadowsLabel', {}, language));
  setText('#settingBoxShadowsDescription', getTranslatedText('settingBoxShadowsDescription', {}, language));
  setText('#settingImageHoverLabel', getTranslatedText('settingImageHoverLabel', {}, language));
  setText('#settingImageHoverDescription', getTranslatedText('settingImageHoverDescription', {}, language));
  setText('#settingTableHoverLabel', getTranslatedText('settingTableHoverLabel', {}, language));
  setText('#settingTableHoverDescription', getTranslatedText('settingTableHoverDescription', {}, language));
  setText('#settingDialogAnimationsLabel', getTranslatedText('settingDialogAnimationsLabel', {}, language));
  setText('#settingDialogAnimationsDescription', getTranslatedText('settingDialogAnimationsDescription', {}, language));
  setHTML('#settingsTipsTitle', `<i class="fa-solid fa-circle-info"></i> ${getTranslatedText('settingsTipsTitle', {}, language)}`);
  setHTML('#settingsTipsContent', getTranslatedText('settingsTipsContent', {}, language));
  setText('#settingsResetButtonText', getTranslatedText('settingsReset', {}, language));
  setText('#settingsSaveButtonText', getTranslatedText('settingsSave', {}, language));

  updateSettingsSelectLabels(language);
  updateLanguageButtons(language);

  document.dispatchEvent(new CustomEvent('app-languagechange', {
    detail: {
      language,
      locale: getLanguageMeta(language).locale
    }
  }));
}

function applySettings(settings) {
  const root = document.documentElement;

  root.setAttribute('data-theme', settings.theme);
  const themeIcon = document.getElementById('themeIcon');
  const sidebarIcon = document.getElementById('themeIconSidebar');
  if (themeIcon) themeIcon.className = settings.theme === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  if (sidebarIcon) sidebarIcon.className = settings.theme === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';

  if (!settings.animations) {
    root.style.setProperty('--animation-duration', '0s');
    root.style.setProperty('--transition-duration', '0s');
    document.body.classList.add('no-animations');
  } else {
    root.style.removeProperty('--animation-duration');
    root.style.removeProperty('--transition-duration');
    document.body.classList.remove('no-animations');
  }

  document.body.classList.toggle('no-bg-effects', !settings.backgroundEffects);
  document.body.classList.toggle('no-glow', !settings.glowEffects);
  document.body.classList.toggle('no-backdrop-blur', !settings.backdropBlur);
  document.body.classList.toggle('no-box-shadows', !settings.boxShadows);
  document.body.classList.toggle('no-image-hover', !settings.imageHoverEffects);
  document.body.classList.toggle('no-table-hover', !settings.tableHoverEffects);
  document.body.classList.toggle('no-dialog-animations', !settings.dialogAnimations);

  if (!settings.glowEffects) {
    root.style.setProperty('--glow-opacity', '0');
  } else {
    root.style.removeProperty('--glow-opacity');
  }

  translateStaticUI(settings.language);
}

window.getCurrentLanguage = getCurrentLanguage;
window.getCurrentLanguageLocale = () => getLanguageMeta().locale;
window.getTranslatedText = getTranslatedText;
window.t = getTranslatedText;
window.refreshLanguageUI = () => translateStaticUI(getCurrentLanguage());

window.setLanguage = function(language) {
  if (!LANGUAGE_ORDER.includes(language)) return;
  const settings = loadSettings();
  settings.language = language;
  saveSettings(settings);
  applySettings(settings);
};

window.cycleLanguage = function() {
  const settings = loadSettings();
  const currentIndex = LANGUAGE_ORDER.indexOf(settings.language);
  const nextLanguage = LANGUAGE_ORDER[(currentIndex + 1) % LANGUAGE_ORDER.length];
  settings.language = nextLanguage;
  saveSettings(settings);
  applySettings(settings);
};

window.openSettingsDialog = function() {
  const settings = loadSettings();

  document.getElementById('settingAnimations').checked = settings.animations;
  document.getElementById('settingBackgroundEffects').checked = settings.backgroundEffects;
  document.getElementById('settingGlowEffects').checked = settings.glowEffects;
  document.getElementById('settingBackdropBlur').checked = settings.backdropBlur;
  document.getElementById('settingBoxShadows').checked = settings.boxShadows;
  document.getElementById('settingImageHover').checked = settings.imageHoverEffects;
  document.getElementById('settingTableHover').checked = settings.tableHoverEffects;
  document.getElementById('settingDialogAnimations').checked = settings.dialogAnimations;
  document.getElementById('settingTheme').value = settings.theme;
  document.getElementById('settingLanguage').value = settings.language;

  settingsDialog.showModal();
};

document.getElementById('settingsForm').addEventListener('submit', event => {
  event.preventDefault();

  const newSettings = {
    animations: document.getElementById('settingAnimations').checked,
    backgroundEffects: document.getElementById('settingBackgroundEffects').checked,
    glowEffects: document.getElementById('settingGlowEffects').checked,
    backdropBlur: document.getElementById('settingBackdropBlur').checked,
    boxShadows: document.getElementById('settingBoxShadows').checked,
    imageHoverEffects: document.getElementById('settingImageHover').checked,
    tableHoverEffects: document.getElementById('settingTableHover').checked,
    dialogAnimations: document.getElementById('settingDialogAnimations').checked,
    theme: document.getElementById('settingTheme').value,
    language: document.getElementById('settingLanguage').value
  };

  saveSettings(newSettings);
  applySettings(newSettings);

  settingsDialog.close();
  alert(getTranslatedText('settingsSaved', {}, newSettings.language));
});

window.resetSettings = function() {
  const language = getCurrentLanguage();
  if (!confirm(getTranslatedText('settingsResetConfirm', {}, language))) return;

  saveSettings(defaultSettings);
  applySettings(defaultSettings);
  openSettingsDialog();

  alert(getTranslatedText('settingsResetDone', {}, defaultSettings.language));
};

window.toggleTheme = function() {
  const settings = loadSettings();
  settings.theme = settings.theme === 'light' ? 'dark' : 'light';
  saveSettings(settings);
  applySettings(settings);
};

window.addEventListener('DOMContentLoaded', () => {
  const settings = loadSettings();
  saveSettings(settings);
  applySettings(settings);
});
