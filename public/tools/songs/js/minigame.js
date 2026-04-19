const HOT_QUOTE_OPTION_COUNT = 4;
const LYRIC_ORDER_LINE_COUNT = 4;
const LYRIC_FILL_MAX_BLANKS = 2;
const INTRO_GUESS_DURATION_SECONDS = 15;
const INTRO_GUESS_OPTION_COUNT = 4;
const MINIGAME_YOUTUBE_API_KEY = 'AIzaSyAS6c7bto_vvZ60g_FsdA60od3Fgw0y67g';
const INTRO_GUESS_LOG_PREFIX = '[IntroMinigame]';

const MINIGAME_TEXT = {
  vi: {
    menuIntroGuess: 'Đoán bài qua intro',
    menuLyricFill: 'Điền từ còn thiếu',
    menuHotQuote: 'Đoán tên bài hát',
    menuLyricOrder: 'Sắp xếp lyric',
    introGuessTitle: 'Đoán bài hát qua 15 giây intro',
    lyricFillTitle: 'Điền từ còn thiếu trong lyric',
    hotQuoteTitle: 'Đoán tên bài hát theo các câu hot',
    lyricOrderTitle: 'Sắp xếp lyric đúng thứ tự',
    solvedLabel: 'Đúng',
    attemptsLabel: 'Lượt chơi',
    attemptsCheckLabel: 'Lượt kiểm tra',
    accuracyLabel: 'Tỉ lệ đúng',
    introGuessPrompt: 'Nghe 15 giây đầu rồi đoán đúng tên bài hát.',
    introGuessLoading: 'Đang chuẩn bị intro...',
    introGuessSearching: 'Đang tìm video phù hợp...',
    introGuessEmpty: 'Chưa tìm được đủ bài có intro để chơi mini game này.',
    introGuessHint: '4 đáp án, bạn có thể nghe lại intro nếu cần.',
    introGuessMetaHidden: 'Tên bài hát đang được ẩn. Nghe intro rồi chọn đáp án đúng.',
    introGuessMetaReady: 'Intro đã sẵn sàng. Bấm phát để nghe 15 giây đầu.',
    introGuessMetaPlaying: 'Đang phát 15 giây intro...',
    introGuessMetaRevealed: 'Đáp án: "{song}" - {artist}',
    introGuessCorrect: 'Chính xác! Đây là "{song}" của {artist}.',
    introGuessWrong: 'Chưa đúng. Đáp án là "{song}" của {artist}.',
    introGuessPlay: 'Phát intro 15s',
    introGuessReplay: 'Nghe lại intro',
    introGuessSearchingStatus: 'Đang tìm intro...',
    introGuessReadyStatus: 'Sẵn sàng phát',
    introGuessPlayingStatus: 'Đang phát 15s intro',
    introGuessStoppedStatus: 'Đã phát xong 15 giây đầu',
    introGuessRetryingStatus: 'Video lỗi, đang thử intro khác...',
    introGuessUnavailableStatus: 'Không phát được intro của bài này',
    introGuessUnavailableMeta: 'Không tìm được video phát được. Bấm "Bài khác" để đổi câu.',
    lyricFillPrompt: 'Điền đúng các từ bị ẩn trong câu lyric.',
    lyricFillLoading: 'Đang tải lyric...',
    lyricFillEmpty: 'Chưa có đủ lyric phù hợp để chơi mini game này.',
    lyricFillHint: 'Điền đủ các ô trống rồi bấm kiểm tra.',
    lyricFillNeedAll: 'Hãy điền đủ tất cả ô trống trước khi kiểm tra.',
    lyricFillCorrect: 'Chuẩn rồi! Đây là "{song}" của {artist}.',
    lyricFillWrong: 'Chưa đúng. Đáp án là: {answers}.',
    lyricFillMetaHidden: 'Tên bài hát đang được ẩn để bạn tự đoán.',
    lyricFillMetaRevealed: 'Đáp án: "{song}" - {artist}\nLyric gốc: {line}',
    lyricFillInputLabel: 'Ô trống {number}',
    lyricFillInputPlaceholder: 'Nhập từ còn thiếu',
    lyricFillInputCorrect: 'Đúng rồi',
    lyricFillInputReveal: 'Đáp án: {answer}',
    hotQuotePrompt: 'Nhìn tất cả câu hot rồi đoán đúng tên bài hát.',
    hotQuoteLoading: 'Đang tải dữ liệu bài hát...',
    hotQuoteEmpty: 'Chưa có đủ bài hát chứa câu hot để chơi mini game này.',
    hotQuoteHint: '4 đáp án, chỉ có 1 đáp án đúng.',
    hotQuoteCorrect: 'Chính xác! Đây là "{song}" của {artist}.',
    hotQuoteWrong: 'Chưa đúng. Đáp án là "{song}" của {artist}.',
    hotQuoteMeta: 'Ca sĩ: {artist}',
    nextQuestion: 'Câu khác',
    openSong: 'Mở bài hát',
    lyricOrderPrompt: 'Chọn các câu theo đúng thứ tự xuất hiện trong bài hát.',
    lyricOrderSelected: 'Thứ tự bạn chọn',
    lyricOrderPool: 'Các câu đang bị xáo trộn',
    lyricOrderLoading: 'Đang tải lyric...',
    lyricOrderEmpty: 'Chưa có đủ bài hát có lyric dài để chơi mini game này.',
    lyricOrderHint: 'Nhấn câu ở cột phải để đưa sang cột trái. Nhấn lại câu ở cột trái để bỏ chọn.',
    lyricOrderNeedAll: 'Hãy chọn đủ 4 câu trước khi kiểm tra.',
    lyricOrderWrong: 'Sai thứ tự rồi. Chỉnh lại và kiểm tra tiếp.',
    lyricOrderCorrect: 'Chuẩn rồi! Đây là "{song}" của {artist}.',
    lyricOrderMetaHidden: 'Tên bài hát đang được ẩn để tăng độ khó.',
    lyricOrderMetaRevealed: 'Đáp án: "{song}" - {artist}',
    lyricOrderEmptySlot: 'Chọn một câu từ cột bên phải',
    lyricOrderNoPool: 'Đã chọn hết 4 câu. Kiểm tra đáp án thôi.',
    resetSelection: 'Làm lại',
    checkAnswer: 'Kiểm tra',
    nextSong: 'Bài khác'
  },
  en: {
    menuIntroGuess: 'Guess by Intro',
    menuLyricFill: 'Fill in the Blanks',
    menuHotQuote: 'Guess Song Title',
    menuLyricOrder: 'Sort Lyrics',
    introGuessTitle: 'Guess the Song from a 15s Intro',
    lyricFillTitle: 'Fill in the Missing Lyrics',
    hotQuoteTitle: 'Guess the Song from Hot Lines',
    lyricOrderTitle: 'Arrange Lyrics in Order',
    solvedLabel: 'Solved',
    attemptsLabel: 'Attempts',
    attemptsCheckLabel: 'Checks',
    accuracyLabel: 'Accuracy',
    introGuessPrompt: 'Listen to the first 15 seconds and guess the song.',
    introGuessLoading: 'Preparing intro...',
    introGuessSearching: 'Searching for a matching video...',
    introGuessEmpty: 'There are not enough playable intros for this mini game yet.',
    introGuessHint: '4 choices. You can replay the intro if needed.',
    introGuessMetaHidden: 'The song title is hidden. Listen to the intro and pick the correct answer.',
    introGuessMetaReady: 'The intro is ready. Press play to hear the first 15 seconds.',
    introGuessMetaPlaying: 'Playing the 15-second intro...',
    introGuessMetaRevealed: 'Answer: "{song}" - {artist}',
    introGuessCorrect: 'Correct! This is "{song}" by {artist}.',
    introGuessWrong: 'Not quite. The answer is "{song}" by {artist}.',
    introGuessPlay: 'Play 15s Intro',
    introGuessReplay: 'Replay Intro',
    introGuessSearchingStatus: 'Searching for intro...',
    introGuessReadyStatus: 'Ready to play',
    introGuessPlayingStatus: 'Playing 15-second intro',
    introGuessStoppedStatus: 'The first 15 seconds finished',
    introGuessRetryingStatus: 'That video failed. Trying another intro...',
    introGuessUnavailableStatus: 'This intro could not be played',
    introGuessUnavailableMeta: 'No playable intro was found. Press "Next song" to switch rounds.',
    lyricFillPrompt: 'Fill in the hidden words in the lyric line.',
    lyricFillLoading: 'Loading lyrics...',
    lyricFillEmpty: 'There are not enough suitable lyric lines for this mini game yet.',
    lyricFillHint: 'Fill every blank, then press check.',
    lyricFillNeedAll: 'Fill every blank before checking.',
    lyricFillCorrect: 'Correct! This is "{song}" by {artist}.',
    lyricFillWrong: 'Not quite. The answers are: {answers}.',
    lyricFillMetaHidden: 'The song title is hidden so you can guess it yourself.',
    lyricFillMetaRevealed: 'Answer: "{song}" - {artist}\nOriginal line: {line}',
    lyricFillInputLabel: 'Blank {number}',
    lyricFillInputPlaceholder: 'Type the missing word',
    lyricFillInputCorrect: 'Correct',
    lyricFillInputReveal: 'Answer: {answer}',
    hotQuotePrompt: 'Read all highlighted lines and guess the correct song title.',
    hotQuoteLoading: 'Loading songs...',
    hotQuoteEmpty: 'There are not enough songs with highlighted lines for this mini game yet.',
    hotQuoteHint: '4 choices. Only 1 is correct.',
    hotQuoteCorrect: 'Correct! This is "{song}" by {artist}.',
    hotQuoteWrong: 'Not quite. The answer is "{song}" by {artist}.',
    hotQuoteMeta: 'Artist: {artist}',
    nextQuestion: 'Next clue',
    openSong: 'Open song',
    lyricOrderPrompt: 'Pick the lines in the correct order they appear in the song.',
    lyricOrderSelected: 'Your order',
    lyricOrderPool: 'Shuffled lines',
    lyricOrderLoading: 'Loading lyrics...',
    lyricOrderEmpty: 'There are not enough songs with long lyrics for this mini game yet.',
    lyricOrderHint: 'Tap a line on the right to move it left. Tap a selected line to remove it.',
    lyricOrderNeedAll: 'Pick all 4 lines before checking.',
    lyricOrderWrong: 'The order is still wrong. Adjust it and try again.',
    lyricOrderCorrect: 'Correct! This is "{song}" by {artist}.',
    lyricOrderMetaHidden: 'The song title is hidden for extra difficulty.',
    lyricOrderMetaRevealed: 'Answer: "{song}" - {artist}',
    lyricOrderEmptySlot: 'Choose a line from the right column',
    lyricOrderNoPool: 'All 4 lines selected. Time to check.',
    resetSelection: 'Reset',
    checkAnswer: 'Check',
    nextSong: 'Next song'
  },
  ko: {
    menuIntroGuess: '인트로 맞히기',
    menuLyricFill: '빈칸 채우기',
    menuHotQuote: '노래 제목 맞히기',
    menuLyricOrder: '가사 순서 맞추기',
    introGuessTitle: '15초 인트로로 노래 맞히기',
    lyricFillTitle: '가사 빈칸 채우기',
    hotQuoteTitle: '핫한 가사들로 노래 맞히기',
    lyricOrderTitle: '가사 순서 맞추기',
    solvedLabel: '정답',
    attemptsLabel: '시도',
    attemptsCheckLabel: '확인 횟수',
    accuracyLabel: '정확도',
    introGuessPrompt: '앞 15초를 듣고 노래를 맞혀보세요.',
    introGuessLoading: '인트로 준비 중...',
    introGuessSearching: '맞는 영상을 찾는 중...',
    introGuessEmpty: '이 미니게임에 사용할 수 있는 인트로가 아직 부족합니다.',
    introGuessHint: '보기는 4개이며, 필요하면 다시 들을 수 있습니다.',
    introGuessMetaHidden: '노래 제목은 숨겨져 있습니다. 인트로를 듣고 정답을 골라보세요.',
    introGuessMetaReady: '인트로가 준비되었습니다. 15초 재생 버튼을 누르세요.',
    introGuessMetaPlaying: '15초 인트로 재생 중...',
    introGuessMetaRevealed: '정답: "{song}" - {artist}',
    introGuessCorrect: '정답! "{song}" - {artist}',
    introGuessWrong: '아쉽네요. 정답은 "{song}" - {artist}',
    introGuessPlay: '15초 인트로 재생',
    introGuessReplay: '다시 듣기',
    introGuessSearchingStatus: '인트로 검색 중...',
    introGuessReadyStatus: '재생 준비 완료',
    introGuessPlayingStatus: '15초 인트로 재생 중',
    introGuessStoppedStatus: '앞 15초 재생 완료',
    introGuessRetryingStatus: '영상 오류, 다른 인트로를 찾는 중...',
    introGuessUnavailableStatus: '이 노래의 인트로를 재생할 수 없습니다',
    introGuessUnavailableMeta: '재생 가능한 영상을 찾지 못했습니다. "다른 노래"를 눌러 바꾸세요.',
    lyricFillPrompt: '가사 문장에서 숨겨진 단어를 채워보세요.',
    lyricFillLoading: '가사를 불러오는 중...',
    lyricFillEmpty: '이 미니게임에 사용할 수 있는 가사가 아직 충분하지 않습니다.',
    lyricFillHint: '빈칸을 모두 채운 뒤 확인을 누르세요.',
    lyricFillNeedAll: '확인하기 전에 모든 빈칸을 채우세요.',
    lyricFillCorrect: '정답! "{song}" - {artist}',
    lyricFillWrong: '아쉽네요. 정답은: {answers}',
    lyricFillMetaHidden: '직접 맞혀볼 수 있도록 노래 제목은 숨겨져 있습니다.',
    lyricFillMetaRevealed: '정답: "{song}" - {artist}\n원래 가사: {line}',
    lyricFillInputLabel: '빈칸 {number}',
    lyricFillInputPlaceholder: '빠진 단어 입력',
    lyricFillInputCorrect: '정답',
    lyricFillInputReveal: '정답: {answer}',
    hotQuotePrompt: '핫한 가사들을 보고 노래 제목을 맞혀보세요.',
    hotQuoteLoading: '노래 데이터를 불러오는 중...',
    hotQuoteEmpty: '이 미니게임에 사용할 핫한 가사가 아직 충분하지 않습니다.',
    hotQuoteHint: '보기는 4개, 정답은 1개입니다.',
    hotQuoteCorrect: '정답! "{song}" - {artist}',
    hotQuoteWrong: '아쉽네요. 정답은 "{song}" - {artist}',
    hotQuoteMeta: '가수: {artist}',
    nextQuestion: '다음 문제',
    openSong: '노래 열기',
    lyricOrderPrompt: '노래에 나오는 순서대로 가사를 선택하세요.',
    lyricOrderSelected: '내가 고른 순서',
    lyricOrderPool: '섞인 가사',
    lyricOrderLoading: '가사를 불러오는 중...',
    lyricOrderEmpty: '이 미니게임을 하기에는 가사가 긴 노래가 아직 부족합니다.',
    lyricOrderHint: '오른쪽 문장을 누르면 왼쪽으로 이동합니다. 왼쪽 문장을 다시 누르면 취소됩니다.',
    lyricOrderNeedAll: '확인하기 전에 4줄을 모두 선택하세요.',
    lyricOrderWrong: '순서가 아직 틀렸습니다. 다시 맞춰보세요.',
    lyricOrderCorrect: '정답! "{song}" - {artist}',
    lyricOrderMetaHidden: '난이도를 위해 노래 제목은 숨겨져 있습니다.',
    lyricOrderMetaRevealed: '정답: "{song}" - {artist}',
    lyricOrderEmptySlot: '오른쪽에서 한 줄을 선택하세요',
    lyricOrderNoPool: '4줄을 모두 골랐습니다. 이제 확인하세요.',
    resetSelection: '초기화',
    checkAnswer: '확인',
    nextSong: '다른 노래'
  }
};

const hotQuoteState = {
  solved: 0,
  attempts: 0,
  currentSong: null,
  currentClue: '',
  currentOptions: [],
  selectedSongId: null,
  answered: false,
  lastSongId: null,
  emptyReasonKey: 'hotQuoteLoading'
};

const lyricOrderState = {
  solved: 0,
  attempts: 0,
  currentSong: null,
  orderedItems: [],
  shuffledItems: [],
  selectedIds: [],
  answered: false,
  messageKey: '',
  lastSongId: null,
  emptyReasonKey: 'lyricOrderLoading'
};

const lyricFillState = {
  solved: 0,
  attempts: 0,
  currentSong: null,
  originalLine: '',
  maskedLine: '',
  blanks: [],
  inputValues: [],
  submittedAnswers: [],
  answered: false,
  messageKey: '',
  lastSongId: null,
  emptyReasonKey: 'lyricFillLoading'
};

const introGuessState = {
  solved: 0,
  attempts: 0,
  currentSong: null,
  currentVideoId: '',
  candidateVideoIds: [],
  currentVideoIndex: 0,
  currentOptions: [],
  selectedSongId: null,
  answered: false,
  loading: false,
  isPlaying: false,
  autoplayAfterLoad: false,
  progressPercent: 0,
  volume: 50,
  statusKey: 'introGuessLoading',
  lastSongId: null,
  emptyReasonKey: 'introGuessLoading'
};

let introGuessPlayer = null;
let introGuessStopTimer = null;
let introGuessYoutubeApiPromise = null;
let introGuessProgressTimer = null;
let introGuessPlayStartedAt = 0;
let introGuessPlaybackToken = 0;
let introGuessPlayRequestToken = 0;
let introGuessPreparedRound = null;
let introGuessNextPreparedRound = null;
let introGuessCurrentPreloadPromise = null;
let introGuessNextPreloadPromise = null;
let introGuessLastBootstrapKey = '';

function getLanguage() {
  return window.getCurrentLanguage ? window.getCurrentLanguage() : 'vi';
}

function t(key, variables = {}) {
  const language = getLanguage();
  const dictionary = MINIGAME_TEXT[language] || MINIGAME_TEXT.vi;
  const template = dictionary[key] || MINIGAME_TEXT.vi[key] || key;
  return template.replace(/\{(\w+)\}/g, (_, name) => variables[name] ?? '');
}

function getSongs() {
  return Array.isArray(window._songs) ? window._songs : [];
}

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

function trimLyricToken(token) {
  return String(token || '').replace(/^[^0-9A-Za-zÀ-ỹ가-힣]+|[^0-9A-Za-zÀ-ỹ가-힣]+$/g, '');
}

function normalizeAnswerToken(value) {
  return normalizeText(trimLyricToken(value)).replace(/[^a-z0-9가-힣]/g, '');
}

function shuffle(items) {
  const cloned = [...items];
  for (let index = cloned.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [cloned[index], cloned[swapIndex]] = [cloned[swapIndex], cloned[index]];
  }
  return cloned;
}

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getIntroSearchQuery(song) {
  return [song?.Tên, song?.['Ca sĩ'], 'official audio']
    .filter(Boolean)
    .join(' ');
}

function logIntroGuess(message, payload) {
  if (payload === undefined) {
    console.info(`${INTRO_GUESS_LOG_PREFIX} ${message}`);
    return;
  }
  console.info(`${INTRO_GUESS_LOG_PREFIX} ${message}`, payload);
}

function isIntroGuessDialogOpen() {
  return Boolean(document.getElementById('introGuessGameDialog')?.open);
}

function clearIntroGuessTimer() {
  if (introGuessStopTimer) {
    clearTimeout(introGuessStopTimer);
    introGuessStopTimer = null;
  }
}

function clearIntroGuessProgressTimer() {
  if (introGuessProgressTimer) {
    clearInterval(introGuessProgressTimer);
    introGuessProgressTimer = null;
  }
}

function resetIntroGuessProgress() {
  clearIntroGuessProgressTimer();
  introGuessPlayStartedAt = 0;
  introGuessState.progressPercent = 0;
}

function startIntroGuessProgress() {
  const playbackToken = introGuessPlaybackToken;
  resetIntroGuessProgress();
  introGuessPlayStartedAt = Date.now();
  introGuessProgressTimer = window.setInterval(() => {
    if (!introGuessPlayStartedAt || playbackToken !== introGuessPlaybackToken || !isIntroGuessDialogOpen()) return;

    const elapsed = Date.now() - introGuessPlayStartedAt;
    introGuessState.progressPercent = Math.min(100, (elapsed / (INTRO_GUESS_DURATION_SECONDS * 1000)) * 100);
    renderIntroGuessGame();

    if (introGuessState.progressPercent >= 100) {
      clearIntroGuessProgressTimer();
    }
  }, 100);
}

function stopIntroGuessPlayback(resetToStart = false, markCompleted = false) {
  introGuessPlaybackToken += 1;
  introGuessPlayRequestToken += 1;
  clearIntroGuessTimer();
  clearIntroGuessProgressTimer();
  introGuessState.isPlaying = false;
  introGuessPlayStartedAt = 0;
  introGuessState.autoplayAfterLoad = false;
  if (resetToStart) {
    introGuessState.progressPercent = 0;
  } else if (markCompleted) {
    introGuessState.progressPercent = 100;
  }

  if (introGuessPlayer) {
    try {
      if (typeof introGuessPlayer.stopVideo === 'function') {
        introGuessPlayer.stopVideo();
      } else if (typeof introGuessPlayer.pauseVideo === 'function') {
        introGuessPlayer.pauseVideo();
      }
      if (resetToStart && typeof introGuessPlayer.seekTo === 'function') {
        introGuessPlayer.seekTo(0, true);
      }
    } catch (error) {
      console.warn('Failed to stop intro preview:', error);
    }
  }

  if (!introGuessState.loading && introGuessState.currentSong) {
    introGuessState.statusKey = 'introGuessStoppedStatus';
  }
}

function ensureIntroGuessYoutubeApi() {
  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }

  if (introGuessYoutubeApiPromise) {
    return introGuessYoutubeApiPromise;
  }

  introGuessYoutubeApiPromise = new Promise((resolve, reject) => {
    const finalize = () => {
      if (window.YT?.Player) {
        resolve(window.YT);
        return true;
      }
      return false;
    };

    if (finalize()) return;

    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof previousReady === 'function') {
        previousReady();
      }
      finalize();
    };

    const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.onerror = () => reject(new Error('Failed to load YouTube IFrame API'));
      document.head.appendChild(script);
    }

    const startedAt = Date.now();
    const poll = window.setInterval(() => {
      if (finalize()) {
        window.clearInterval(poll);
        return;
      }

      if (Date.now() - startedAt > 15000) {
        window.clearInterval(poll);
        reject(new Error('Timed out while loading YouTube IFrame API'));
      }
    }, 250);
  });

  return introGuessYoutubeApiPromise;
}

function isIntroGuessVideoMatch(item, normalizedSong, normalizedArtist) {
  const title = normalizeText(item?.snippet?.title || '');
  const channel = normalizeText(item?.snippet?.channelTitle || '');
  return (
    title.includes(normalizedSong) &&
    (!normalizedArtist || title.includes(normalizedArtist) || channel.includes(normalizedArtist))
  );
}

async function findIntroGuessVideoIds(song) {
  const searchQuery = getIntroSearchQuery(song);
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoEmbeddable=true&maxResults=8&q=${encodeURIComponent(searchQuery)}&key=${MINIGAME_YOUTUBE_API_KEY}`
  );
  const data = await response.json();

  if (data.error) {
    if (data.error.errors?.some(e => e.reason === 'quotaExceeded')) {
      console.warn(`${INTRO_GUESS_LOG_PREFIX} YouTube search quota exceeded.`);
    } else {
      console.warn(`${INTRO_GUESS_LOG_PREFIX} YouTube search failed:`, data.error.message);
    }
    return [];
  }

  const items = Array.isArray(data?.items) ? data.items : [];
  const normalizedSong = normalizeText(song?.Tên || '');
  const normalizedArtist = normalizeText(song?.['Ca sĩ'] || '');

  const prioritizedItems = [
    ...items.filter((item) => isIntroGuessVideoMatch(item, normalizedSong, normalizedArtist)),
    ...items.filter((item) => !isIntroGuessVideoMatch(item, normalizedSong, normalizedArtist))
  ];

  return [...new Set(prioritizedItems.map((item) => item?.id?.videoId).filter(Boolean))];
}

async function buildPreparedIntroGuessRound(excludedSongIds = []) {
  const allSongs = getSongs().filter((song) => song?.Id && song?.Tên);
  const excluded = new Set(excludedSongIds);
  const primaryQueue = shuffle(allSongs.filter((song) => !excluded.has(song.Id)));
  const fallbackQueue = shuffle(allSongs.filter((song) => excluded.has(song.Id)));
  const queue = [...primaryQueue, ...fallbackQueue];

  for (const song of queue) {
    try {
      const videoIds = await findIntroGuessVideoIds(song);
      if (videoIds.length === 0) continue;

      const wrongOptions = shuffle(allSongs.filter((candidate) => candidate.Id !== song.Id))
        .slice(0, INTRO_GUESS_OPTION_COUNT - 1);

      return {
        song,
        candidateVideoIds: videoIds,
        currentVideoId: videoIds[0] || '',
        currentVideoIndex: 0,
        options: shuffle([song, ...wrongOptions])
      };
    } catch (error) {
      console.warn(`${INTRO_GUESS_LOG_PREFIX} Failed to prepare round for song`, song?.Tên, error);
    }
  }

  return null;
}

function applyPreparedIntroGuessRound(preparedRound) {
  if (!preparedRound) return false;

  introGuessState.currentSong = preparedRound.song;
  introGuessState.currentVideoId = preparedRound.currentVideoId;
  introGuessState.candidateVideoIds = [...preparedRound.candidateVideoIds];
  introGuessState.currentVideoIndex = preparedRound.currentVideoIndex ?? 0;
  introGuessState.currentOptions = [...preparedRound.options];
  introGuessState.selectedSongId = null;
  introGuessState.answered = false;
  introGuessState.loading = false;
  introGuessState.autoplayAfterLoad = false;
  introGuessState.statusKey = 'introGuessReadyStatus';
  introGuessState.lastSongId = preparedRound.song.Id;
  introGuessState.emptyReasonKey = '';
  introGuessState.progressPercent = 0;
  return true;
}

async function ensureIntroGuessCurrentRoundReady(forceRefresh = false) {
  if (!forceRefresh && introGuessPreparedRound) {
    return introGuessPreparedRound;
  }

  if (!forceRefresh && introGuessCurrentPreloadPromise) {
    return introGuessCurrentPreloadPromise;
  }

  logIntroGuess('Bat dau preload intro hien tai');
  introGuessCurrentPreloadPromise = buildPreparedIntroGuessRound([introGuessState.lastSongId].filter(Boolean))
    .then((preparedRound) => {
      introGuessPreparedRound = preparedRound;
      if (preparedRound) {
        logIntroGuess('Da preload xong intro hien tai', {
          song: preparedRound.song?.Tên,
          videoId: preparedRound.currentVideoId
        });
      } else {
        logIntroGuess('Khong preload duoc intro hien tai');
      }
      return preparedRound;
    })
    .finally(() => {
      introGuessCurrentPreloadPromise = null;
    });

  return introGuessCurrentPreloadPromise;
}

async function ensureIntroGuessNextRoundReady() {
  const currentSongId = introGuessPreparedRound?.song?.Id || introGuessState.currentSong?.Id || introGuessState.lastSongId;
  if (introGuessNextPreparedRound && introGuessNextPreparedRound.song?.Id !== currentSongId) {
    return introGuessNextPreparedRound;
  }

  if (introGuessNextPreloadPromise) {
    return introGuessNextPreloadPromise;
  }

  logIntroGuess('Bat dau preload intro bai tiep theo');
  introGuessNextPreloadPromise = buildPreparedIntroGuessRound([currentSongId].filter(Boolean))
    .then((preparedRound) => {
      introGuessNextPreparedRound = preparedRound;
      if (preparedRound) {
        logIntroGuess('Da preload xong intro bai tiep theo', {
          song: preparedRound.song?.Tên,
          videoId: preparedRound.currentVideoId
        });
      } else {
        logIntroGuess('Khong preload duoc intro bai tiep theo');
      }
      return preparedRound;
    })
    .finally(() => {
      introGuessNextPreloadPromise = null;
    });

  return introGuessNextPreloadPromise;
}

function ensureIntroGuessPlayerContainer() {
  let playerRoot = document.getElementById('introGuessYoutubePlayer');
  if (!playerRoot) {
    const audioContainer = document.querySelector('.intro-guess-player-audio');
    if (!audioContainer) return null;
    playerRoot = document.createElement('div');
    playerRoot.id = 'introGuessYoutubePlayer';
    audioContainer.appendChild(playerRoot);
  }

  return playerRoot;
}

async function switchIntroGuessVideoByIndex(videoIndex, autoplay = false) {
  const nextVideoId = introGuessState.candidateVideoIds[videoIndex];
  if (!nextVideoId) {
    introGuessState.currentVideoId = '';
    introGuessState.currentVideoIndex = 0;
    introGuessState.autoplayAfterLoad = false;
    introGuessState.progressPercent = 0;
    introGuessState.statusKey = 'introGuessUnavailableStatus';
    return false;
  }

  introGuessState.currentVideoIndex = videoIndex;
  introGuessState.currentVideoId = nextVideoId;
  introGuessState.autoplayAfterLoad = autoplay;
  await loadIntroGuessPlayer(nextVideoId);
  return true;
}

function startIntroGuessPlaybackFromCurrentVideo() {
  if (
    !introGuessPlayer ||
    !isIntroGuessDialogOpen() ||
    introGuessState.answered ||
    introGuessState.loading ||
    !introGuessState.currentSong ||
    !introGuessState.currentVideoId
  ) {
    return;
  }

  introGuessPlaybackToken += 1;
  resetIntroGuessProgress();
  clearIntroGuessTimer();
  introGuessState.isPlaying = true;
  introGuessState.statusKey = 'introGuessPlayingStatus';

  if (typeof introGuessPlayer.setVolume === 'function') {
    introGuessPlayer.setVolume(introGuessState.volume);
  }
  if (typeof introGuessPlayer.seekTo === 'function') {
    introGuessPlayer.seekTo(0, true);
  }
  if (typeof introGuessPlayer.playVideo === 'function') {
    introGuessPlayer.playVideo();
  }
}

async function loadIntroGuessPlayer(videoId) {
  await ensureIntroGuessYoutubeApi();
  const playerRoot = ensureIntroGuessPlayerContainer();
  if (!playerRoot) return;

  if (introGuessPlayer && typeof introGuessPlayer.cueVideoById === 'function') {
    introGuessPlayer.cueVideoById({ videoId, startSeconds: 0 });
    if (typeof introGuessPlayer.pauseVideo === 'function') {
      introGuessPlayer.pauseVideo();
    }
    if (typeof introGuessPlayer.seekTo === 'function') {
      introGuessPlayer.seekTo(0, true);
    }
    if (introGuessState.autoplayAfterLoad) {
      const queuedRequestToken = introGuessPlayRequestToken;
      introGuessState.autoplayAfterLoad = false;
      window.setTimeout(() => {
        if (
          queuedRequestToken !== introGuessPlayRequestToken ||
          introGuessState.answered ||
          !introGuessState.currentVideoId ||
          !isIntroGuessDialogOpen()
        ) {
          return;
        }
        startIntroGuessPlaybackFromCurrentVideo();
        renderIntroGuessGame();
      }, 0);
    }
    return;
  }

  introGuessPlayer = new window.YT.Player('introGuessYoutubePlayer', {
    height: '220',
    width: '100%',
    videoId,
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
      modestbranding: 1,
      playsinline: 1,
      rel: 0
    },
    events: {
      onReady: (event) => {
        if (typeof event.target.setVolume === 'function') {
          event.target.setVolume(introGuessState.volume);
        }
        event.target.pauseVideo();
        event.target.seekTo(0, true);
        if (introGuessState.autoplayAfterLoad) {
          const queuedRequestToken = introGuessPlayRequestToken;
          introGuessState.autoplayAfterLoad = false;
          if (
            queuedRequestToken === introGuessPlayRequestToken &&
            !introGuessState.answered &&
            introGuessState.currentVideoId &&
            isIntroGuessDialogOpen()
          ) {
            startIntroGuessPlaybackFromCurrentVideo();
            renderIntroGuessGame();
          }
        }
      },
      onStateChange: (event) => {
        if (!isIntroGuessDialogOpen()) {
          stopIntroGuessPlayback(true);
          renderIntroGuessGame();
          return;
        }

        if (window.YT?.PlayerState && event.data === window.YT.PlayerState.PLAYING) {
          startIntroGuessProgress();
          clearIntroGuessTimer();
          const playbackToken = introGuessPlaybackToken;
          introGuessStopTimer = window.setTimeout(() => {
            if (playbackToken !== introGuessPlaybackToken || !isIntroGuessDialogOpen()) return;
            stopIntroGuessPlayback(false, true);
            renderIntroGuessGame();
          }, INTRO_GUESS_DURATION_SECONDS * 1000);
        } else if (window.YT?.PlayerState && (
          event.data === window.YT.PlayerState.ENDED ||
          event.data === window.YT.PlayerState.PAUSED
        ) && introGuessState.isPlaying) {
          stopIntroGuessPlayback();
          renderIntroGuessGame();
        }
      },
      onError: () => {
        handleIntroGuessPlaybackError();
      }
    }
  });
}

async function handleIntroGuessPlaybackError() {
  stopIntroGuessPlayback(true);
  if (!introGuessState.currentSong) return;

  const nextIndex = introGuessState.currentVideoIndex + 1;
  if (nextIndex >= introGuessState.candidateVideoIds.length) {
    introGuessState.currentVideoId = '';
    introGuessState.autoplayAfterLoad = false;
    introGuessState.statusKey = 'introGuessUnavailableStatus';
    renderIntroGuessGame();
    return;
  }

  introGuessState.loading = true;
  introGuessState.statusKey = 'introGuessRetryingStatus';
  renderIntroGuessGame();

  try {
    await switchIntroGuessVideoByIndex(nextIndex, true);
  } catch (error) {
    console.warn('Failed to switch intro guess video:', error);
    introGuessState.currentVideoId = '';
    introGuessState.autoplayAfterLoad = false;
    introGuessState.statusKey = 'introGuessUnavailableStatus';
  }

  introGuessState.loading = false;
  renderIntroGuessGame();
}

function cleanLyricLine(line) {
  return String(line || '')
    .replace(/--hot/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function getHotLines(song) {
  const lyric = song?.Lyric || '';
  const unique = new Set();

  lyric.split('\n').forEach((line) => {
    if (!line.includes('--hot')) return;
    const cleaned = cleanLyricLine(line);
    if (cleaned.length >= 6) {
      unique.add(cleaned);
    }
  });

  return [...unique];
}

function formatHotQuoteClue(lines) {
  return lines.join('\n');
}

function getPlainLyricLines(song) {
  const lyric = song?.Lyric || '';
  return lyric
    .split('\n')
    .map(cleanLyricLine)
    .filter((line) => line.length >= 6)
    .filter((line) => !/^\[.*\]$/.test(line));
}

function getLyricOrderSegments(song) {
  const lines = getPlainLyricLines(song);
  const segments = [];

  for (let start = 0; start <= lines.length - LYRIC_ORDER_LINE_COUNT; start += 1) {
    const segment = lines.slice(start, start + LYRIC_ORDER_LINE_COUNT);
    const uniqueCount = new Set(segment.map(normalizeText)).size;
    if (uniqueCount === LYRIC_ORDER_LINE_COUNT) {
      segments.push(segment);
    }
  }

  return segments;
}

function createBlankMarker(answer, order) {
  const blankLength = Math.max(4, Math.min(normalizeAnswerToken(answer).length || answer.length, 10));
  return `${'_'.repeat(blankLength)} (${order + 1})`;
}

function buildLyricFillRound(line) {
  const words = String(line || '').split(/\s+/).filter(Boolean);
  if (words.length < 5) return null;

  const allCandidates = words
    .map((word, index) => ({
      index,
      answer: trimLyricToken(word),
      originalWord: word
    }))
    .filter((item) => normalizeAnswerToken(item.answer).length >= 2);

  if (allCandidates.length === 0) return null;

  let candidatePool = allCandidates.filter((item) => item.index > 0 && item.index < words.length - 1);
  if (candidatePool.length === 0) {
    candidatePool = allCandidates;
  }

  const targetBlankCount = candidatePool.length >= 2 && words.length >= 7 ? LYRIC_FILL_MAX_BLANKS : 1;
  const selected = [];

  shuffle(candidatePool).forEach((candidate) => {
    if (selected.length >= targetBlankCount) return;

    const normalizedCandidate = normalizeAnswerToken(candidate.answer);
    const isTooClose = selected.some((item) => Math.abs(item.index - candidate.index) <= 1);
    const isDuplicate = selected.some((item) => normalizeAnswerToken(item.answer) === normalizedCandidate);

    if (!isTooClose && !isDuplicate) {
      selected.push(candidate);
    }
  });

  if (selected.length === 0) {
    selected.push(candidatePool[0]);
  }

  selected.sort((left, right) => left.index - right.index);

  const maskedWords = [...words];
  const blanks = selected.map((item, order) => ({
    id: `${normalizeText(line)}-${item.index}-${order}`,
    order,
    answer: item.answer,
    normalized: normalizeAnswerToken(item.answer)
  }));

  selected.forEach((item, order) => {
    maskedWords[item.index] = createBlankMarker(item.answer, order);
  });

  return {
    originalLine: line,
    maskedLine: maskedWords.join(' '),
    blanks
  };
}

function updateStats(prefix, state) {
  const solvedEl = document.getElementById(`${prefix}SolvedValue`);
  const attemptsEl = document.getElementById(`${prefix}AttemptsValue`);
  const accuracyEl = document.getElementById(`${prefix}AccuracyValue`);
  const accuracy = state.attempts > 0 ? Math.round((state.solved / state.attempts) * 100) : 0;

  if (solvedEl) solvedEl.textContent = String(state.solved);
  if (attemptsEl) attemptsEl.textContent = String(state.attempts);
  if (accuracyEl) accuracyEl.textContent = `${accuracy}%`;
}

function setResult(element, message, type = '') {
  if (!element) return;
  element.textContent = message;
  element.classList.remove('is-correct', 'is-wrong');
  if (type) {
    element.classList.add(type === 'correct' ? 'is-correct' : 'is-wrong');
  }
}

function attachBackdropClose(dialogId) {
  const dialog = document.getElementById(dialogId);
  if (!dialog) return;

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
}

function renderIntroGuessGame() {
  updateStats('introGuess', introGuessState);

  const placeholderEl = document.getElementById('introGuessPlayerPlaceholder');
  const statusEl = document.getElementById('introGuessStatus');
  const metaEl = document.getElementById('introGuessMeta');
  const optionsEl = document.getElementById('introGuessOptions');
  const resultEl = document.getElementById('introGuessResult');
  const playButton = document.getElementById('introGuessPlayButton');
  const openSongButton = document.getElementById('introGuessOpenSongButton');
  const progressBar = document.getElementById('introGuessProgressBar');
  const volumeSlider = document.getElementById('introGuessVolume');
  const volumeValue = document.getElementById('introGuessVolumeValue');

  if (!statusEl || !metaEl || !optionsEl || !resultEl || !playButton || !openSongButton || !progressBar || !volumeSlider || !volumeValue) return;

  volumeSlider.value = String(introGuessState.volume);
  volumeValue.textContent = `${introGuessState.volume}%`;

  if (!introGuessState.currentSong) {
    if (placeholderEl) {
      placeholderEl.textContent = introGuessState.loading ? t('introGuessSearching') : t(introGuessState.emptyReasonKey);
    }
    statusEl.textContent = introGuessState.loading ? t('introGuessSearchingStatus') : '';
    metaEl.textContent = introGuessState.loading ? t('introGuessSearching') : '';
    optionsEl.innerHTML = '';
    playButton.textContent = t('introGuessPlay');
    playButton.disabled = true;
    progressBar.style.width = '0%';
    setResult(resultEl, '');
    openSongButton.style.display = 'none';
    return;
  }

  if (placeholderEl) {
    placeholderEl.textContent = introGuessState.isPlaying ? t('introGuessMetaPlaying') : t('introGuessMetaReady');
  }

  statusEl.textContent = t(introGuessState.statusKey);
  metaEl.textContent = introGuessState.answered
    ? t('introGuessMetaRevealed', {
        song: introGuessState.currentSong.Tên,
        artist: introGuessState.currentSong['Ca sĩ'] || 'Unknown'
      })
    : (introGuessState.statusKey === 'introGuessUnavailableStatus'
        ? t('introGuessUnavailableMeta')
        : introGuessState.isPlaying
          ? t('introGuessMetaPlaying')
          : t('introGuessMetaHidden'));

  playButton.textContent = introGuessState.statusKey === 'introGuessStoppedStatus' ? t('introGuessReplay') : t('introGuessPlay');
  playButton.disabled =
    introGuessState.answered ||
    introGuessState.loading ||
    !introGuessState.currentVideoId ||
    introGuessState.statusKey === 'introGuessUnavailableStatus';
  progressBar.style.width = `${introGuessState.progressPercent}%`;

  const buttons = introGuessState.currentOptions.map((option) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'minigame-option';
    button.textContent = option.Tên;
    button.disabled = introGuessState.answered;

    if (introGuessState.answered) {
      if (option.Id === introGuessState.currentSong.Id) {
        button.classList.add('is-correct');
      } else if (option.Id === introGuessState.selectedSongId) {
        button.classList.add('is-wrong');
      }
    }

    button.addEventListener('click', () => {
      window.answerIntroGuess(option.Id);
    });

    return button;
  });

  optionsEl.replaceChildren(...buttons);

  if (introGuessState.answered) {
    const isCorrect = introGuessState.selectedSongId === introGuessState.currentSong.Id;
    setResult(resultEl, t(isCorrect ? 'introGuessCorrect' : 'introGuessWrong', {
      song: introGuessState.currentSong.Tên,
      artist: introGuessState.currentSong['Ca sĩ'] || 'Unknown'
    }), isCorrect ? 'correct' : 'wrong');
    openSongButton.style.display = 'inline-flex';
  } else {
    setResult(resultEl, '');
    openSongButton.style.display = 'none';
  }
}

function renderHotQuoteGame() {
  updateStats('hotQuote', hotQuoteState);

  const clueEl = document.getElementById('hotQuoteClue');
  const metaEl = document.getElementById('hotQuoteMeta');
  const optionsEl = document.getElementById('hotQuoteOptions');
  const resultEl = document.getElementById('hotQuoteResult');
  const openSongButton = document.getElementById('hotQuoteOpenSongButton');

  if (!clueEl || !metaEl || !optionsEl || !resultEl || !openSongButton) return;

  if (!hotQuoteState.currentSong) {
    clueEl.textContent = t(hotQuoteState.emptyReasonKey);
    metaEl.textContent = '';
    optionsEl.innerHTML = '';
    setResult(resultEl, '');
    openSongButton.style.display = 'none';
    return;
  }

  clueEl.textContent = hotQuoteState.currentClue;
  metaEl.textContent = hotQuoteState.answered
    ? t('hotQuoteMeta', { artist: hotQuoteState.currentSong['Ca sĩ'] || 'Unknown' })
    : t('hotQuoteHint');

  const buttons = hotQuoteState.currentOptions.map((option) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'minigame-option';
    button.textContent = option.Tên;
    button.disabled = hotQuoteState.answered;

    if (hotQuoteState.answered) {
      if (option.Id === hotQuoteState.currentSong.Id) {
        button.classList.add('is-correct');
      } else if (option.Id === hotQuoteState.selectedSongId) {
        button.classList.add('is-wrong');
      }
    }

    button.addEventListener('click', () => {
      window.answerHotQuote(option.Id);
    });

    return button;
  });

  optionsEl.replaceChildren(...buttons);

  if (hotQuoteState.answered) {
    const key = hotQuoteState.selectedSongId === hotQuoteState.currentSong.Id ? 'hotQuoteCorrect' : 'hotQuoteWrong';
    const type = hotQuoteState.selectedSongId === hotQuoteState.currentSong.Id ? 'correct' : 'wrong';
    setResult(resultEl, t(key, {
      song: hotQuoteState.currentSong.Tên,
      artist: hotQuoteState.currentSong['Ca sĩ'] || 'Unknown'
    }), type);
    openSongButton.style.display = 'inline-flex';
  } else {
    setResult(resultEl, '');
    openSongButton.style.display = 'none';
  }
}

function renderLyricOrderGame() {
  updateStats('lyricOrder', lyricOrderState);

  const targetEl = document.getElementById('lyricOrderTarget');
  const poolEl = document.getElementById('lyricOrderPool');
  const metaEl = document.getElementById('lyricOrderMeta');
  const resultEl = document.getElementById('lyricOrderResult');
  const openSongButton = document.getElementById('lyricOrderOpenSongButton');

  if (!targetEl || !poolEl || !metaEl || !resultEl || !openSongButton) return;

  if (!lyricOrderState.currentSong) {
    targetEl.innerHTML = `<div class="lyric-order-empty">${t(lyricOrderState.emptyReasonKey)}</div>`;
    poolEl.innerHTML = `<div class="lyric-order-empty">${t(lyricOrderState.emptyReasonKey)}</div>`;
    metaEl.textContent = '';
    setResult(resultEl, '');
    openSongButton.style.display = 'none';
    return;
  }

  targetEl.innerHTML = '';
  for (let index = 0; index < LYRIC_ORDER_LINE_COUNT; index += 1) {
    const slot = document.createElement('button');
    slot.type = 'button';
    slot.className = 'lyric-order-slot';

    const orderIndex = document.createElement('span');
    orderIndex.className = 'lyric-order-index';
    orderIndex.textContent = String(index + 1);
    slot.appendChild(orderIndex);

    const chosenId = lyricOrderState.selectedIds[index];
    if (chosenId) {
      const item = lyricOrderState.shuffledItems.find((line) => line.id === chosenId);
      const text = document.createElement('span');
      text.className = 'lyric-order-slot-text';
      text.textContent = item?.text || '';
      slot.classList.add('is-filled');
      slot.appendChild(text);
      slot.addEventListener('click', () => {
        window.removeLyricOrderSelection(index);
      });
    } else {
      const placeholder = document.createElement('span');
      placeholder.className = 'lyric-order-placeholder';
      placeholder.textContent = t('lyricOrderEmptySlot');
      slot.appendChild(placeholder);
      slot.disabled = true;
    }

    targetEl.appendChild(slot);
  }

  poolEl.innerHTML = '';
  const availableItems = lyricOrderState.shuffledItems.filter((line) => !lyricOrderState.selectedIds.includes(line.id));
  if (availableItems.length === 0) {
    poolEl.innerHTML = `<div class="lyric-order-empty">${t('lyricOrderNoPool')}</div>`;
  } else {
    availableItems.forEach((item) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'lyric-order-line';
      button.textContent = item.text;
      button.disabled = lyricOrderState.answered || lyricOrderState.selectedIds.length >= LYRIC_ORDER_LINE_COUNT;
      button.addEventListener('click', () => {
        window.selectLyricOrderLine(item.id);
      });
      poolEl.appendChild(button);
    });
  }

  metaEl.textContent = lyricOrderState.answered
    ? t('lyricOrderMetaRevealed', {
        song: lyricOrderState.currentSong.Tên,
        artist: lyricOrderState.currentSong['Ca sĩ'] || 'Unknown'
      })
    : t('lyricOrderMetaHidden');

  if (lyricOrderState.messageKey) {
    const isCorrect = lyricOrderState.messageKey === 'lyricOrderCorrect';
    setResult(resultEl, t(lyricOrderState.messageKey, {
      song: lyricOrderState.currentSong.Tên,
      artist: lyricOrderState.currentSong['Ca sĩ'] || 'Unknown'
    }), isCorrect ? 'correct' : 'wrong');
  } else {
    setResult(resultEl, '');
  }

  openSongButton.style.display = lyricOrderState.answered ? 'inline-flex' : 'none';
}

function renderLyricFillGame() {
  updateStats('lyricFill', lyricFillState);

  const clueEl = document.getElementById('lyricFillClue');
  const fieldsEl = document.getElementById('lyricFillFields');
  const metaEl = document.getElementById('lyricFillMeta');
  const resultEl = document.getElementById('lyricFillResult');
  const checkButton = document.getElementById('lyricFillCheckButton');
  const openSongButton = document.getElementById('lyricFillOpenSongButton');

  if (!clueEl || !fieldsEl || !metaEl || !resultEl || !checkButton || !openSongButton) return;

  if (!lyricFillState.currentSong) {
    clueEl.textContent = t(lyricFillState.emptyReasonKey);
    fieldsEl.innerHTML = '';
    metaEl.textContent = '';
    setResult(resultEl, '');
    checkButton.disabled = true;
    openSongButton.style.display = 'none';
    return;
  }

  clueEl.textContent = lyricFillState.maskedLine;
  fieldsEl.innerHTML = '';

  lyricFillState.blanks.forEach((blank, index) => {
    const field = document.createElement('label');
    field.className = 'lyric-fill-field';

    const label = document.createElement('span');
    label.className = 'lyric-fill-label';
    label.textContent = t('lyricFillInputLabel', { number: index + 1 });
    field.appendChild(label);

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'lyric-fill-input';
    input.placeholder = t('lyricFillInputPlaceholder');
    input.value = lyricFillState.answered
      ? (lyricFillState.submittedAnswers[index] || '')
      : (lyricFillState.inputValues[index] || '');
    input.disabled = lyricFillState.answered;

    if (lyricFillState.answered) {
      const isCorrect = normalizeAnswerToken(lyricFillState.submittedAnswers[index]) === blank.normalized;
      input.classList.add(isCorrect ? 'is-correct' : 'is-wrong');
    }

    input.addEventListener('input', (event) => {
      lyricFillState.inputValues[index] = event.target.value;
    });

    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        window.checkLyricFillAnswer();
      }
    });

    field.appendChild(input);

    if (lyricFillState.answered) {
      const note = document.createElement('span');
      const isCorrect = normalizeAnswerToken(lyricFillState.submittedAnswers[index]) === blank.normalized;
      note.className = `lyric-fill-feedback ${isCorrect ? 'is-correct' : 'is-wrong'}`;
      note.textContent = isCorrect
        ? t('lyricFillInputCorrect')
        : t('lyricFillInputReveal', { answer: blank.answer });
      field.appendChild(note);
    }

    fieldsEl.appendChild(field);
  });

  metaEl.textContent = lyricFillState.answered
    ? t('lyricFillMetaRevealed', {
        song: lyricFillState.currentSong.Tên,
        artist: lyricFillState.currentSong['Ca sĩ'] || 'Unknown',
        line: lyricFillState.originalLine
      })
    : `${t('lyricFillHint')}\n${t('lyricFillMetaHidden')}`;

  if (lyricFillState.messageKey) {
    const isCorrect = lyricFillState.messageKey === 'lyricFillCorrect';
    setResult(resultEl, t(lyricFillState.messageKey, {
      song: lyricFillState.currentSong.Tên,
      artist: lyricFillState.currentSong['Ca sĩ'] || 'Unknown',
      answers: lyricFillState.blanks.map((blank, index) => `${index + 1}. ${blank.answer}`).join(' | ')
    }), isCorrect ? 'correct' : 'wrong');
  } else {
    setResult(resultEl, '');
  }

  checkButton.disabled = lyricFillState.answered;
  openSongButton.style.display = lyricFillState.answered ? 'inline-flex' : 'none';
}

async function prepareIntroGuessRound() {
  stopIntroGuessPlayback(true);
  resetIntroGuessProgress();
  introGuessState.loading = true;
  introGuessState.currentSong = null;
  introGuessState.currentVideoId = '';
  introGuessState.candidateVideoIds = [];
  introGuessState.currentVideoIndex = 0;
  introGuessState.currentOptions = [];
  introGuessState.selectedSongId = null;
  introGuessState.answered = false;
  introGuessState.autoplayAfterLoad = false;
  introGuessState.statusKey = 'introGuessSearchingStatus';
  introGuessState.emptyReasonKey = getSongs().length > 0 ? 'introGuessEmpty' : 'introGuessLoading';
  renderIntroGuessGame();

  let preparedRound = introGuessNextPreparedRound || introGuessPreparedRound;
  introGuessPreparedRound = null;
  introGuessNextPreparedRound = null;

  if (!preparedRound) {
    preparedRound = await ensureIntroGuessCurrentRoundReady(true);
  }
  logIntroGuess('Dang ap dung round intro da preload', {
    song: preparedRound?.song?.Tên || null
  });

  introGuessState.loading = false;

  if (!preparedRound) {
    introGuessState.currentSong = null;
    introGuessState.emptyReasonKey = getSongs().length > 0 ? 'introGuessEmpty' : 'introGuessLoading';
    renderIntroGuessGame();
    return;
  }

  applyPreparedIntroGuessRound(preparedRound);

  try {
    await switchIntroGuessVideoByIndex(0, false);
  } catch (error) {
    console.warn(`${INTRO_GUESS_LOG_PREFIX} Failed to load intro guess player`, error);
    introGuessState.currentSong = null;
    introGuessState.currentVideoId = '';
    introGuessState.candidateVideoIds = [];
    introGuessState.currentOptions = [];
    introGuessState.emptyReasonKey = 'introGuessEmpty';
  }

  renderIntroGuessGame();
  void ensureIntroGuessNextRoundReady();
}

function prepareHotQuoteRound() {
  const eligibleSongs = getSongs()
    .map((song) => ({ song, clues: getHotLines(song) }))
    .filter((entry) => entry.clues.length > 0);

  if (eligibleSongs.length === 0) {
    hotQuoteState.currentSong = null;
    hotQuoteState.currentClue = '';
    hotQuoteState.currentOptions = [];
    hotQuoteState.answered = false;
    hotQuoteState.selectedSongId = null;
    hotQuoteState.emptyReasonKey = getSongs().length > 0 ? 'hotQuoteEmpty' : 'hotQuoteLoading';
    renderHotQuoteGame();
    return;
  }

  const candidates = eligibleSongs.filter((entry) => entry.song.Id !== hotQuoteState.lastSongId);
  const selectedEntry = pickRandom(candidates.length > 0 ? candidates : eligibleSongs);
  const allSongs = getSongs();
  const wrongOptions = shuffle(allSongs.filter((song) => song.Id !== selectedEntry.song.Id))
    .slice(0, HOT_QUOTE_OPTION_COUNT - 1);

  hotQuoteState.currentSong = selectedEntry.song;
  hotQuoteState.currentClue = formatHotQuoteClue(selectedEntry.clues);
  hotQuoteState.currentOptions = shuffle([selectedEntry.song, ...wrongOptions]);
  hotQuoteState.selectedSongId = null;
  hotQuoteState.answered = false;
  hotQuoteState.lastSongId = selectedEntry.song.Id;
  hotQuoteState.emptyReasonKey = '';

  renderHotQuoteGame();
}

function prepareLyricOrderRound() {
  const eligibleSongs = getSongs()
    .map((song) => ({ song, segments: getLyricOrderSegments(song) }))
    .filter((entry) => entry.segments.length > 0);

  if (eligibleSongs.length === 0) {
    lyricOrderState.currentSong = null;
    lyricOrderState.orderedItems = [];
    lyricOrderState.shuffledItems = [];
    lyricOrderState.selectedIds = [];
    lyricOrderState.answered = false;
    lyricOrderState.messageKey = '';
    lyricOrderState.emptyReasonKey = getSongs().length > 0 ? 'lyricOrderEmpty' : 'lyricOrderLoading';
    renderLyricOrderGame();
    return;
  }

  const candidates = eligibleSongs.filter((entry) => entry.song.Id !== lyricOrderState.lastSongId);
  const selectedEntry = pickRandom(candidates.length > 0 ? candidates : eligibleSongs);
  const segment = pickRandom(selectedEntry.segments);
  const orderedItems = segment.map((text, index) => ({
    id: `${selectedEntry.song.Id}-${index}-${normalizeText(text)}`,
    text
  }));

  lyricOrderState.currentSong = selectedEntry.song;
  lyricOrderState.orderedItems = orderedItems;
  lyricOrderState.shuffledItems = shuffle(orderedItems);
  lyricOrderState.selectedIds = [];
  lyricOrderState.answered = false;
  lyricOrderState.messageKey = '';
  lyricOrderState.lastSongId = selectedEntry.song.Id;
  lyricOrderState.emptyReasonKey = '';

  renderLyricOrderGame();
}

function prepareLyricFillRound() {
  const eligibleSongs = getSongs()
    .map((song) => ({
      song,
      rounds: getPlainLyricLines(song).map(buildLyricFillRound).filter(Boolean)
    }))
    .filter((entry) => entry.rounds.length > 0);

  if (eligibleSongs.length === 0) {
    lyricFillState.currentSong = null;
    lyricFillState.originalLine = '';
    lyricFillState.maskedLine = '';
    lyricFillState.blanks = [];
    lyricFillState.inputValues = [];
    lyricFillState.submittedAnswers = [];
    lyricFillState.answered = false;
    lyricFillState.messageKey = '';
    lyricFillState.emptyReasonKey = getSongs().length > 0 ? 'lyricFillEmpty' : 'lyricFillLoading';
    renderLyricFillGame();
    return;
  }

  const candidates = eligibleSongs.filter((entry) => entry.song.Id !== lyricFillState.lastSongId);
  const selectedEntry = pickRandom(candidates.length > 0 ? candidates : eligibleSongs);
  const selectedRound = pickRandom(selectedEntry.rounds);

  lyricFillState.currentSong = selectedEntry.song;
  lyricFillState.originalLine = selectedRound.originalLine;
  lyricFillState.maskedLine = selectedRound.maskedLine;
  lyricFillState.blanks = selectedRound.blanks;
  lyricFillState.inputValues = Array(selectedRound.blanks.length).fill('');
  lyricFillState.submittedAnswers = [];
  lyricFillState.answered = false;
  lyricFillState.messageKey = '';
  lyricFillState.lastSongId = selectedEntry.song.Id;
  lyricFillState.emptyReasonKey = '';

  renderLyricFillGame();
}

function refreshMinigameLanguage() {
  const introGuessButton = document.querySelector('#btn-intro-guess-game-sc span');
  const lyricFillButton = document.querySelector('#btn-lyric-fill-game-sc span');
  const hotQuoteButton = document.querySelector('#btn-hot-quote-game-sc span');
  const lyricOrderButton = document.querySelector('#btn-lyric-order-game-sc span');

  if (introGuessButton) introGuessButton.textContent = t('menuIntroGuess');
  if (lyricFillButton) lyricFillButton.textContent = t('menuLyricFill');
  if (hotQuoteButton) hotQuoteButton.textContent = t('menuHotQuote');
  if (lyricOrderButton) lyricOrderButton.textContent = t('menuLyricOrder');

  const introGuessButtonRoot = document.getElementById('btn-intro-guess-game-sc');
  const lyricFillButtonRoot = document.getElementById('btn-lyric-fill-game-sc');
  const hotButtonRoot = document.getElementById('btn-hot-quote-game-sc');
  const lyricButtonRoot = document.getElementById('btn-lyric-order-game-sc');
  if (introGuessButtonRoot) introGuessButtonRoot.title = t('menuIntroGuess');
  if (lyricFillButtonRoot) lyricFillButtonRoot.title = t('menuLyricFill');
  if (hotButtonRoot) hotButtonRoot.title = t('menuHotQuote');
  if (lyricButtonRoot) lyricButtonRoot.title = t('menuLyricOrder');

  const mappings = [
    ['introGuessGameDialogTitle', 'introGuessTitle'],
    ['introGuessSolvedLabel', 'solvedLabel'],
    ['introGuessAttemptsLabel', 'attemptsLabel'],
    ['introGuessAccuracyLabel', 'accuracyLabel'],
    ['introGuessPromptLabel', 'introGuessPrompt'],
    ['introGuessPlayButton', 'introGuessPlay'],
    ['introGuessNextButton', 'nextSong'],
    ['introGuessOpenSongButton', 'openSong'],
    ['lyricFillGameDialogTitle', 'lyricFillTitle'],
    ['lyricFillSolvedLabel', 'solvedLabel'],
    ['lyricFillAttemptsLabel', 'attemptsCheckLabel'],
    ['lyricFillAccuracyLabel', 'accuracyLabel'],
    ['lyricFillPromptLabel', 'lyricFillPrompt'],
    ['lyricFillCheckButton', 'checkAnswer'],
    ['lyricFillNextButton', 'nextSong'],
    ['lyricFillOpenSongButton', 'openSong'],
    ['hotQuoteGameDialogTitle', 'hotQuoteTitle'],
    ['lyricOrderGameDialogTitle', 'lyricOrderTitle'],
    ['hotQuoteSolvedLabel', 'solvedLabel'],
    ['hotQuoteAttemptsLabel', 'attemptsLabel'],
    ['hotQuoteAccuracyLabel', 'accuracyLabel'],
    ['hotQuotePromptLabel', 'hotQuotePrompt'],
    ['hotQuoteNextButton', 'nextQuestion'],
    ['hotQuoteOpenSongButton', 'openSong'],
    ['lyricOrderSolvedLabel', 'solvedLabel'],
    ['lyricOrderAttemptsLabel', 'attemptsCheckLabel'],
    ['lyricOrderAccuracyLabel', 'accuracyLabel'],
    ['lyricOrderPromptLabel', 'lyricOrderPrompt'],
    ['lyricOrderSelectedLabel', 'lyricOrderSelected'],
    ['lyricOrderPoolLabel', 'lyricOrderPool'],
    ['lyricOrderResetButton', 'resetSelection'],
    ['lyricOrderCheckButton', 'checkAnswer'],
    ['lyricOrderNextButton', 'nextSong'],
    ['lyricOrderOpenSongButton', 'openSong']
  ];

  mappings.forEach(([id, key]) => {
    const element = document.getElementById(id);
    if (!element) return;

    if (id.endsWith('Title')) {
      const icon = element.querySelector('i');
      const iconHTML = icon ? icon.outerHTML : '';
      element.innerHTML = `${iconHTML} ${t(key)}`;
    } else {
      element.textContent = t(key);
    }
  });

  renderIntroGuessGame();
  renderLyricFillGame();
  renderHotQuoteGame();
  renderLyricOrderGame();
}

window.openIntroGuessGameDialog = function openIntroGuessGameDialog() {
  const dialog = document.getElementById('introGuessGameDialog');
  if (!dialog) return;

  refreshMinigameLanguage();
  if (!introGuessState.currentSong && !introGuessState.loading) {
    prepareIntroGuessRound();
  }
  if (!dialog.open) {
    dialog.showModal();
  }
};

window.nextIntroGuessRound = function nextIntroGuessRound() {
  stopIntroGuessPlayback(true);
  prepareIntroGuessRound();
};

window.playIntroGuessSnippet = async function playIntroGuessSnippet() {
  if (!introGuessState.currentSong || !introGuessState.currentVideoId || introGuessState.loading) return;
  const requestToken = ++introGuessPlayRequestToken;

  try {
    await loadIntroGuessPlayer(introGuessState.currentVideoId);
    if (
      requestToken !== introGuessPlayRequestToken ||
      introGuessState.answered ||
      !isIntroGuessDialogOpen() ||
      introGuessState.loading
    ) {
      return;
    }
    startIntroGuessPlaybackFromCurrentVideo();
  } catch (error) {
    console.warn('Failed to play intro snippet:', error);
    introGuessState.statusKey = 'introGuessUnavailableStatus';
    introGuessState.currentVideoId = '';
  }

  renderIntroGuessGame();
};

window.setIntroGuessVolume = function setIntroGuessVolume(value) {
  const normalized = Math.max(0, Math.min(100, Number(value) || 0));
  introGuessState.volume = normalized;

  if (introGuessPlayer && typeof introGuessPlayer.setVolume === 'function') {
    try {
      introGuessPlayer.setVolume(normalized);
    } catch (error) {
      console.warn('Failed to set intro guess volume:', error);
    }
  }

  renderIntroGuessGame();
};

window.answerIntroGuess = function answerIntroGuess(songId) {
  if (introGuessState.answered || !introGuessState.currentSong) return;

  stopIntroGuessPlayback(true);
  introGuessState.selectedSongId = songId;
  introGuessState.answered = true;
  introGuessState.autoplayAfterLoad = false;
  introGuessState.currentVideoId = '';
  introGuessState.attempts += 1;
  introGuessState.statusKey = 'introGuessStoppedStatus';

  if (songId === introGuessState.currentSong.Id) {
    introGuessState.solved += 1;
  }

  renderIntroGuessGame();
};

window.openIntroGuessSong = function openIntroGuessSong() {
  if (introGuessState.currentSong && typeof window.showLyric === 'function') {
    stopIntroGuessPlayback(true);
    const dialog = document.getElementById('introGuessGameDialog');
    if (dialog?.open) dialog.close();
    window.showLyric(introGuessState.currentSong.Id);
  }
};

window.openLyricFillGameDialog = function openLyricFillGameDialog() {
  const dialog = document.getElementById('lyricFillGameDialog');
  if (!dialog) return;

  refreshMinigameLanguage();
  if (!lyricFillState.currentSong) {
    prepareLyricFillRound();
  }
  if (!dialog.open) {
    dialog.showModal();
  }
};

window.nextLyricFillRound = function nextLyricFillRound() {
  prepareLyricFillRound();
};

window.checkLyricFillAnswer = function checkLyricFillAnswer() {
  if (!lyricFillState.currentSong || lyricFillState.answered) return;

  const answers = lyricFillState.inputValues.map((value) => String(value || '').trim());
  if (answers.some((value) => !value)) {
    lyricFillState.messageKey = 'lyricFillNeedAll';
    renderLyricFillGame();
    return;
  }

  lyricFillState.attempts += 1;
  lyricFillState.submittedAnswers = answers;
  lyricFillState.answered = true;

  const isCorrect = lyricFillState.blanks.every((blank, index) => (
    normalizeAnswerToken(answers[index]) === blank.normalized
  ));

  if (isCorrect) {
    lyricFillState.solved += 1;
    lyricFillState.messageKey = 'lyricFillCorrect';
  } else {
    lyricFillState.messageKey = 'lyricFillWrong';
  }

  renderLyricFillGame();
};

window.openLyricFillSong = function openLyricFillSong() {
  if (lyricFillState.currentSong && typeof window.showLyric === 'function') {
    const dialog = document.getElementById('lyricFillGameDialog');
    if (dialog?.open) dialog.close();
    window.showLyric(lyricFillState.currentSong.Id);
  }
};

window.openHotQuoteGameDialog = function openHotQuoteGameDialog() {
  const dialog = document.getElementById('hotQuoteGameDialog');
  if (!dialog) return;

  refreshMinigameLanguage();
  if (!hotQuoteState.currentSong) {
    prepareHotQuoteRound();
  }
  if (!dialog.open) {
    dialog.showModal();
  }
};

window.nextHotQuoteRound = function nextHotQuoteRound() {
  prepareHotQuoteRound();
};

window.answerHotQuote = function answerHotQuote(songId) {
  if (hotQuoteState.answered || !hotQuoteState.currentSong) return;

  hotQuoteState.selectedSongId = songId;
  hotQuoteState.answered = true;
  hotQuoteState.attempts += 1;

  if (songId === hotQuoteState.currentSong.Id) {
    hotQuoteState.solved += 1;
  }

  renderHotQuoteGame();
};

window.openHotQuoteSong = function openHotQuoteSong() {
  if (hotQuoteState.currentSong && typeof window.showLyric === 'function') {
    const dialog = document.getElementById('hotQuoteGameDialog');
    if (dialog?.open) dialog.close();
    window.showLyric(hotQuoteState.currentSong.Id);
  }
};

window.openLyricOrderGameDialog = function openLyricOrderGameDialog() {
  const dialog = document.getElementById('lyricOrderGameDialog');
  if (!dialog) return;

  refreshMinigameLanguage();
  if (!lyricOrderState.currentSong) {
    prepareLyricOrderRound();
  }
  if (!dialog.open) {
    dialog.showModal();
  }
};

window.nextLyricOrderRound = function nextLyricOrderRound() {
  prepareLyricOrderRound();
};

window.selectLyricOrderLine = function selectLyricOrderLine(lineId) {
  if (lyricOrderState.answered || !lyricOrderState.currentSong) return;
  if (lyricOrderState.selectedIds.includes(lineId)) return;
  if (lyricOrderState.selectedIds.length >= LYRIC_ORDER_LINE_COUNT) return;

  lyricOrderState.selectedIds = [...lyricOrderState.selectedIds, lineId];
  lyricOrderState.messageKey = '';
  renderLyricOrderGame();
};

window.removeLyricOrderSelection = function removeLyricOrderSelection(index) {
  if (lyricOrderState.answered || !lyricOrderState.currentSong) return;
  if (index < 0 || index >= lyricOrderState.selectedIds.length) return;

  lyricOrderState.selectedIds = lyricOrderState.selectedIds.filter((_, itemIndex) => itemIndex !== index);
  lyricOrderState.messageKey = '';
  renderLyricOrderGame();
};

window.resetLyricOrderSelection = function resetLyricOrderSelection() {
  if (lyricOrderState.answered || !lyricOrderState.currentSong) return;
  lyricOrderState.selectedIds = [];
  lyricOrderState.messageKey = '';
  renderLyricOrderGame();
};

window.checkLyricOrderAnswer = function checkLyricOrderAnswer() {
  if (!lyricOrderState.currentSong) return;

  if (lyricOrderState.selectedIds.length < LYRIC_ORDER_LINE_COUNT) {
    lyricOrderState.messageKey = 'lyricOrderNeedAll';
    renderLyricOrderGame();
    return;
  }

  lyricOrderState.attempts += 1;

  const expected = lyricOrderState.orderedItems.map((item) => item.id).join('|');
  const actual = lyricOrderState.selectedIds.join('|');

  if (expected === actual) {
    lyricOrderState.solved += 1;
    lyricOrderState.answered = true;
    lyricOrderState.messageKey = 'lyricOrderCorrect';
  } else {
    lyricOrderState.messageKey = 'lyricOrderWrong';
  }

  renderLyricOrderGame();
};

window.openLyricOrderSong = function openLyricOrderSong() {
  if (lyricOrderState.currentSong && typeof window.showLyric === 'function') {
    const dialog = document.getElementById('lyricOrderGameDialog');
    if (dialog?.open) dialog.close();
    window.showLyric(lyricOrderState.currentSong.Id);
  }
};

async function bootstrapIntroGuessPreload() {
  const songs = getSongs();
  if (!songs.length) {
    logIntroGuess('Chua the preload vi danh sach bai hat chua san sang');
    return;
  }

  const bootstrapKey = songs.map((song) => song.Id).join('|');
  if (bootstrapKey === introGuessLastBootstrapKey && (introGuessPreparedRound || introGuessCurrentPreloadPromise)) {
    return;
  }

  introGuessLastBootstrapKey = bootstrapKey;

  try {
    await ensureIntroGuessCurrentRoundReady();
    void ensureIntroGuessNextRoundReady();
  } catch (error) {
    console.warn(`${INTRO_GUESS_LOG_PREFIX} Loi khi bootstrap preload`, error);
  }
}

attachBackdropClose('introGuessGameDialog');
attachBackdropClose('lyricFillGameDialog');
attachBackdropClose('hotQuoteGameDialog');
attachBackdropClose('lyricOrderGameDialog');
document.getElementById('introGuessGameDialog')?.addEventListener('close', () => {
  stopIntroGuessPlayback(true);
  renderIntroGuessGame();
});
document.addEventListener('app-songsloaded', (event) => {
  logIntroGuess('Nhan su kien songs loaded', event?.detail || {});
  void bootstrapIntroGuessPreload();
});
document.addEventListener('app-languagechange', refreshMinigameLanguage);
refreshMinigameLanguage();
if (getSongs().length) {
  logIntroGuess('Danh sach bai hat da co san khi khoi tao script', { count: getSongs().length });
  void bootstrapIntroGuessPreload();
}
