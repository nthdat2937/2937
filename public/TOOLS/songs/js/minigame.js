const HOT_QUOTE_OPTION_COUNT = 4;
const ARTIST_GUESS_OPTION_COUNT = 4;
const LYRIC_ORDER_LINE_COUNT = 4;
const LYRIC_FILL_MAX_BLANKS = 2;
const INTRO_GUESS_DURATION_SECONDS = 15;
const INTRO_GUESS_OPTION_COUNT = 4;
const ARTIST_GUESS_AUDIO_DURATION_SECONDS = 15;
const MINIGAME_YOUTUBE_API_KEY = 'AIzaSyAS6c7bto_vvZ60g_FsdA60od3Fgw0y67g';
const INTRO_GUESS_LOG_PREFIX = '[IntroMinigame]';
const ARTIST_GUESS_LOG_PREFIX = '[ArtistMinigame]';
const ARTIST_GUESS_MODES = ['title', 'hot', 'audio'];
const USE_LUCKY_AUDIO_SOURCE = false;
const INTRO_GUESS_LUCKY_WINDOW_NAME = 'ntdLuckyIntroWindow';
const ARTIST_GUESS_LUCKY_WINDOW_NAME = 'ntdLuckyArtistWindow';
const LUCKY_WINDOW_FEATURES = 'width=480,height=220';
const LUCKY_STOP_PAGE_URL = new URL('../lucky-stop.html', import.meta.url).href;

const MINIGAME_TEXT = {
  vi: {
    menuIntroGuess: 'Đoán bài qua intro',
    menuLyricFill: 'Điền từ còn thiếu',
    menuHotQuote: 'Đoán tên bài hát',
    menuArtistGuess: 'Đoán tên ca sĩ',
    menuLyricOrder: 'Sắp xếp lyric',
    introGuessTitle: 'Đoán bài hát qua 15 giây intro',
    lyricFillTitle: 'Điền từ còn thiếu trong lyric',
    hotQuoteTitle: 'Đoán tên bài hát theo các câu hot',
    artistGuessTitle: 'Đoán tên ca sĩ qua gợi ý',
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
    introGuessMetaReadyLucky: 'Intro sẽ tự mở ở tab mới. Nếu chưa nghe được, bấm "Nghe lại intro".',
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
    artistGuessPrompt: 'Đoán đúng ca sĩ qua tên bài, hot lyric hoặc audio.',
    artistGuessTitlePrompt: 'Nhìn tên bài hát rồi đoán ca sĩ.',
    artistGuessHotPrompt: 'Đọc hot lyric rồi đoán ca sĩ.',
    artistGuessAudioPrompt: 'Nghe 15 giây rồi đoán ca sĩ.',
    artistGuessModeTitle: 'Theo tên bài',
    artistGuessModeHot: 'Theo hot lyric',
    artistGuessModeAudio: 'Theo audio',
    artistGuessLoading: 'Đang chuẩn bị câu hỏi...',
    artistGuessEmpty: 'Chưa có đủ dữ liệu để chơi mini game này.',
    artistGuessHotEmpty: 'Chưa có đủ bài có hot lyric để chơi mode này.',
    artistGuessAudioEmpty: 'Chưa có đủ bài có audio để chơi mode này.',
    artistGuessHint: 'Chọn đúng ca sĩ từ các đáp án bên dưới.',
    artistGuessCorrect: 'Chính xác! Ca sĩ là {artist}.',
    artistGuessWrong: 'Chưa đúng. Đáp án là {artist}.',
    artistGuessMetaHidden: 'Tên ca sĩ đang được ẩn. Dựa vào gợi ý để chọn đáp án đúng.',
    artistGuessMetaRevealed: 'Đáp án: {artist}\nBài hát: "{song}"',
    artistGuessClueTypeLabel: 'Gợi ý hiện tại',
    artistGuessClueTypeTitle: 'Tên bài hát',
    artistGuessClueTypeHot: 'Hot lyric',
    artistGuessClueTypeAudio: 'Nghe intro',
    artistGuessAudioClue: 'Bấm phát để nghe đoạn intro 15 giây của bài hát này.',
    artistGuessAudioClueLucky: 'Audio sẽ tự mở ở tab mới. Nếu chưa nghe được, bấm "Nghe lại".',
    artistGuessAudioLoading: 'Đang chuẩn bị audio...',
    artistGuessAudioReady: 'Audio đã sẵn sàng. Bấm phát để nghe 15 giây.',
    artistGuessAudioReadyLucky: 'Audio đã sẵn sàng và đang tự mở ở tab mới.',
    artistGuessAudioPlaying: 'Đang phát 15 giây audio...',
    artistGuessAudioSearchingStatus: 'Đang tìm audio...',
    artistGuessAudioReadyStatus: 'Sẵn sàng phát',
    artistGuessAudioPlayingStatus: 'Đang phát 15 giây audio',
    artistGuessAudioStoppedStatus: 'Đã phát xong 15 giây',
    artistGuessAudioRetryingStatus: 'Audio lỗi, đang thử nguồn khác...',
    artistGuessAudioUnavailableStatus: 'Không phát được audio cho câu này',
    artistGuessAudioUnavailableMeta: 'Không tìm được audio phát được. Bấm "Câu khác" để đổi câu.',
    artistGuessPlay: 'Phát gợi ý',
    artistGuessReplay: 'Nghe lại',
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
    menuArtistGuess: 'Guess Artist',
    menuLyricOrder: 'Sort Lyrics',
    introGuessTitle: 'Guess the Song from a 15s Intro',
    lyricFillTitle: 'Fill in the Missing Lyrics',
    hotQuoteTitle: 'Guess the Song from Hot Lines',
    artistGuessTitle: 'Guess the Artist from Clues',
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
    introGuessMetaReadyLucky: 'The intro will open in a new tab automatically. If nothing plays, press "Replay Intro".',
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
    artistGuessPrompt: 'Guess the artist from the song title, hot lyrics, or audio.',
    artistGuessTitlePrompt: 'Read the song title and guess the artist.',
    artistGuessHotPrompt: 'Read the highlighted lyrics and guess the artist.',
    artistGuessAudioPrompt: 'Listen to 15 seconds and guess the artist.',
    artistGuessModeTitle: 'By title',
    artistGuessModeHot: 'By hot lyric',
    artistGuessModeAudio: 'By audio',
    artistGuessLoading: 'Preparing the next clue...',
    artistGuessEmpty: 'There is not enough data to play this mini game yet.',
    artistGuessHotEmpty: 'There are not enough songs with hot lyrics for this mode yet.',
    artistGuessAudioEmpty: 'There are not enough songs with audio clues for this mode yet.',
    artistGuessHint: 'Pick the correct artist from the options below.',
    artistGuessCorrect: 'Correct! The artist is {artist}.',
    artistGuessWrong: 'Not quite. The answer is {artist}.',
    artistGuessMetaHidden: 'The artist name is hidden. Use the clue to choose the right answer.',
    artistGuessMetaRevealed: 'Answer: {artist}\nSong: "{song}"',
    artistGuessClueTypeLabel: 'Current clue',
    artistGuessClueTypeTitle: 'Song title',
    artistGuessClueTypeHot: 'Hot lyric',
    artistGuessClueTypeAudio: 'Audio intro',
    artistGuessAudioClue: 'Press play to hear a 15-second intro from this song.',
    artistGuessAudioClueLucky: 'The audio will open in a new tab automatically. If nothing plays, press "Replay".',
    artistGuessAudioLoading: 'Preparing audio...',
    artistGuessAudioReady: 'The audio is ready. Press play to hear 15 seconds.',
    artistGuessAudioReadyLucky: 'The audio is ready and opening in a new tab automatically.',
    artistGuessAudioPlaying: 'Playing the 15-second audio clue...',
    artistGuessAudioSearchingStatus: 'Searching for audio...',
    artistGuessAudioReadyStatus: 'Ready to play',
    artistGuessAudioPlayingStatus: 'Playing 15-second audio',
    artistGuessAudioStoppedStatus: 'The 15 seconds finished',
    artistGuessAudioRetryingStatus: 'That source failed. Trying another one...',
    artistGuessAudioUnavailableStatus: 'This audio clue could not be played',
    artistGuessAudioUnavailableMeta: 'No playable audio was found. Press "Next clue" to switch rounds.',
    artistGuessPlay: 'Play clue',
    artistGuessReplay: 'Replay',
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
    menuArtistGuess: '가수 맞히기',
    menuLyricOrder: '가사 순서 맞추기',
    introGuessTitle: '15초 인트로로 노래 맞히기',
    lyricFillTitle: '가사 빈칸 채우기',
    hotQuoteTitle: '핫한 가사들로 노래 맞히기',
    artistGuessTitle: '힌트로 가수 맞히기',
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
    introGuessMetaReadyLucky: '인트로가 새 탭에서 자동으로 열립니다. 들리지 않으면 "다시 듣기"를 누르세요.',
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
    artistGuessPrompt: '노래 제목, 핫한 가사, 또는 오디오로 가수를 맞혀보세요.',
    artistGuessTitlePrompt: '노래 제목을 보고 가수를 맞혀보세요.',
    artistGuessHotPrompt: '핫한 가사를 보고 가수를 맞혀보세요.',
    artistGuessAudioPrompt: '15초를 듣고 가수를 맞혀보세요.',
    artistGuessModeTitle: '제목으로',
    artistGuessModeHot: '핫한 가사로',
    artistGuessModeAudio: '오디오로',
    artistGuessLoading: '문제를 준비하는 중...',
    artistGuessEmpty: '이 미니게임에 사용할 데이터가 아직 충분하지 않습니다.',
    artistGuessHotEmpty: '이 모드에 사용할 핫한 가사가 아직 충분하지 않습니다.',
    artistGuessAudioEmpty: '이 모드에 사용할 오디오 힌트가 아직 충분하지 않습니다.',
    artistGuessHint: '아래 보기에서 맞는 가수를 골라보세요.',
    artistGuessCorrect: '정답! 가수는 {artist}입니다.',
    artistGuessWrong: '아쉽네요. 정답은 {artist}입니다.',
    artistGuessMetaHidden: '가수 이름은 숨겨져 있습니다. 힌트를 보고 정답을 고르세요.',
    artistGuessMetaRevealed: '정답: {artist}\n노래: "{song}"',
    artistGuessClueTypeLabel: '현재 힌트',
    artistGuessClueTypeTitle: '노래 제목',
    artistGuessClueTypeHot: '핫한 가사',
    artistGuessClueTypeAudio: '오디오 인트로',
    artistGuessAudioClue: '재생 버튼을 눌러 15초 인트로를 들어보세요.',
    artistGuessAudioClueLucky: '오디오가 새 탭에서 자동으로 열립니다. 들리지 않으면 "다시 듣기"를 누르세요.',
    artistGuessAudioLoading: '오디오 준비 중...',
    artistGuessAudioReady: '오디오가 준비되었습니다. 15초 재생 버튼을 누르세요.',
    artistGuessAudioReadyLucky: '오디오가 준비되었고 새 탭에서 자동으로 열리는 중입니다.',
    artistGuessAudioPlaying: '15초 오디오 힌트 재생 중...',
    artistGuessAudioSearchingStatus: '오디오 검색 중...',
    artistGuessAudioReadyStatus: '재생 준비 완료',
    artistGuessAudioPlayingStatus: '15초 오디오 재생 중',
    artistGuessAudioStoppedStatus: '15초 재생 완료',
    artistGuessAudioRetryingStatus: '오디오 오류, 다른 소스를 찾는 중...',
    artistGuessAudioUnavailableStatus: '이 오디오 힌트를 재생할 수 없습니다',
    artistGuessAudioUnavailableMeta: '재생 가능한 오디오를 찾지 못했습니다. "다음 문제"를 눌러 바꾸세요.',
    artistGuessPlay: '힌트 재생',
    artistGuessReplay: '다시 듣기',
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

const artistGuessState = {
  currentMode: 'title',
  modeStats: {
    title: { solved: 0, attempts: 0, lastSongId: null },
    hot: { solved: 0, attempts: 0, lastSongId: null },
    audio: { solved: 0, attempts: 0, lastSongId: null }
  },
  currentSong: null,
  currentClueType: '',
  currentClueText: '',
  currentPromptKey: 'artistGuessPrompt',
  currentOptions: [],
  currentArtistLabel: '',
  currentArtistKey: '',
  selectedArtistKey: '',
  answered: false,
  loading: false,
  emptyReasonKey: 'artistGuessLoading',
  currentVideoId: '',
  candidateVideoIds: [],
  currentVideoIndex: 0,
  autoplayAfterLoad: false,
  isPlaying: false,
  progressPercent: 0,
  statusKey: 'artistGuessAudioLoading'
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
let introGuessRecentSongIds = [];
let introGuessCyclePlayedSongIds = [];
let introGuessYoutubeLookupDisabled = false;
const introGuessVideoCache = new Map();
let introGuessLuckyWindow = null;
let artistGuessPlayer = null;
let artistGuessStopTimer = null;
let artistGuessProgressTimer = null;
let artistGuessPlayStartedAt = 0;
let artistGuessPlaybackToken = 0;
let artistGuessPlayRequestToken = 0;
let artistGuessRoundRequestToken = 0;
let artistGuessLuckyWindow = null;
const luckyWindowCloseTimers = new Map();

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

function normalizeArtistOption(value) {
  return normalizeText(String(value || '').replace(/\s+/g, ' '));
}

function getArtistGuessLabel(song) {
  return String(song?.['Ca sĩ'] || '').replace(/\s+/g, ' ').trim();
}

function buildArtistGuessOptionPool() {
  const artistMap = new Map();

  getSongs().forEach((song) => {
    const label = getArtistGuessLabel(song);
    const key = normalizeArtistOption(label);
    if (key && !artistMap.has(key)) {
      artistMap.set(key, label);
    }
  });

  return [...artistMap.entries()].map(([key, label]) => ({ key, label }));
}

function getArtistGuessModeStats(mode = artistGuessState.currentMode) {
  return artistGuessState.modeStats[mode] || artistGuessState.modeStats.title;
}

function getArtistGuessEmptyReasonKey(mode = artistGuessState.currentMode) {
  if (mode === 'audio') return 'artistGuessAudioEmpty';
  if (mode === 'hot') return 'artistGuessHotEmpty';
  return 'artistGuessEmpty';
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

function buildSongQueue(songs, excludedSongIds = []) {
  const excluded = new Set(excludedSongIds.filter(Boolean));
  const primaryQueue = shuffle(songs.filter((song) => !excluded.has(song.Id)));
  const fallbackQueue = shuffle(songs.filter((song) => excluded.has(song.Id)));
  return [...primaryQueue, ...fallbackQueue];
}

function logArtistGuess(message, payload) {
  if (payload === undefined) {
    console.info(`${ARTIST_GUESS_LOG_PREFIX} ${message}`);
    return;
  }
  console.info(`${ARTIST_GUESS_LOG_PREFIX} ${message}`, payload);
}

function getIntroSearchQuery(song) {
  return [song?.Tên, song?.['Ca sĩ'], 'official audio']
    .filter(Boolean)
    .join(' ');
}

function getLuckyAudioSearchQuery(song) {
  return [song?.Tên, song?.['Ca sĩ'], 'official audio site:youtube.com/watch']
    .filter(Boolean)
    .join(' ');
}

function buildLuckyAudioUrl(song) {
  const searchQuery = getLuckyAudioSearchQuery(song);
  if (!searchQuery) return '';
  return `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&btnI=1`;
}

function updateLuckyWindowPlaceholder(windowHandle, message) {
  if (!windowHandle || windowHandle.closed) return null;

  try {
    const doc = windowHandle.document;
    if (!doc?.body) return windowHandle;

    doc.title = message || 'Preparing audio...';
    doc.body.innerHTML = '';
    doc.body.style.margin = '0';
    doc.body.style.minHeight = '100vh';
    doc.body.style.display = 'grid';
    doc.body.style.placeItems = 'center';
    doc.body.style.padding = '24px';
    doc.body.style.background = '#050816';
    doc.body.style.color = '#e5eefc';
    doc.body.style.font = '600 16px/1.5 system-ui, sans-serif';
    doc.body.style.textAlign = 'center';

    const label = doc.createElement('div');
    label.textContent = message || '';
    label.style.maxWidth = '320px';
    doc.body.appendChild(label);
  } catch (_) { }

  return windowHandle;
}

function reserveLuckyAudioWindow(windowName, windowHandle, message) {
  const closeTimer = luckyWindowCloseTimers.get(windowName);
  if (closeTimer) {
    clearTimeout(closeTimer);
    luckyWindowCloseTimers.delete(windowName);
  }

  let popup = windowHandle && !windowHandle.closed ? windowHandle : null;

  if (!popup) {
    try {
      popup = window.open('', windowName, LUCKY_WINDOW_FEATURES);
    } catch (_) {
      popup = null;
    }
  }

  if (!popup) return null;

  updateLuckyWindowPlaceholder(popup, message);

  try {
    popup.focus();
  } catch (_) { }

  return popup;
}

function closeLuckyWindow(windowHandle) {
  if (!windowHandle || windowHandle.closed) return null;
  try {
    windowHandle.close();
  } catch (_) {
    return windowHandle;
  }
  return null;
}

function openLuckyAudioWindow(url, windowName, windowHandle = null) {
  if (!url) return null;

  const closeTimer = luckyWindowCloseTimers.get(windowName);
  if (closeTimer) {
    clearTimeout(closeTimer);
    luckyWindowCloseTimers.delete(windowName);
  }

  let popup = windowHandle && !windowHandle.closed
    ? windowHandle
    : reserveLuckyAudioWindow(windowName, null, '');

  if (!popup) return null;

  try {
    popup.location.replace(url);
  } catch (_) {
    try {
      popup.location.href = url;
    } catch (_) {
      return null;
    }
  }

  try {
    popup.focus();
  } catch (_) { }

  return popup;
}

function forceStopLuckyWindow(windowName, windowHandle) {
  const closeTimer = luckyWindowCloseTimers.get(windowName);
  if (closeTimer) {
    clearTimeout(closeTimer);
    luckyWindowCloseTimers.delete(windowName);
  }

  if (!windowHandle || windowHandle.closed) {
    return null;
  }

  let activeHandle = null;
  try {
    activeHandle = window.open(LUCKY_STOP_PAGE_URL, windowName, LUCKY_WINDOW_FEATURES);
  } catch (_) {
    activeHandle = null;
  }

  if (!activeHandle) {
    try {
      windowHandle.location.replace(LUCKY_STOP_PAGE_URL);
      activeHandle = windowHandle;
    } catch (_) {
      activeHandle = closeLuckyWindow(windowHandle);
    }
  }

  if (activeHandle && !activeHandle.closed) {
    const timerId = window.setTimeout(() => {
      try {
        activeHandle.close();
      } catch (_) { }
      luckyWindowCloseTimers.delete(windowName);
    }, 80);
    luckyWindowCloseTimers.set(windowName, timerId);
  }

  return activeHandle && !activeHandle.closed ? activeHandle : null;
}

function extractYoutubeVideoId(value, allowBareId = false) {
  if (typeof value !== 'string') return '';
  const text = value.trim();
  if (!text) return '';

  if (allowBareId && /^[a-zA-Z0-9_-]{11}$/.test(text)) {
    return text;
  }

  const thumbnailMatch = text.match(/(?:ytimg\.com|youtube\.com)\/(?:vi|vi_webp)\/([a-zA-Z0-9_-]{11})\//i);
  if (thumbnailMatch?.[1]) {
    return thumbnailMatch[1];
  }

  const inlineMatch = text.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
  if (inlineMatch?.[1]) {
    return inlineMatch[1];
  }

  try {
    const url = new URL(text);
    const host = url.hostname.toLowerCase();

    if (host.includes('youtu.be')) {
      const id = url.pathname.split('/').filter(Boolean)[0] || '';
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : '';
    }

    if (host.includes('youtube.com') || host.includes('youtube-nocookie.com')) {
      const fromQuery = url.searchParams.get('v') || '';
      if (/^[a-zA-Z0-9_-]{11}$/.test(fromQuery)) {
        return fromQuery;
      }

      const segments = url.pathname.split('/').filter(Boolean);
      const markerIndex = segments.findIndex((segment) => ['embed', 'shorts', 'live', 'v'].includes(segment));
      const fromPath = markerIndex >= 0 ? segments[markerIndex + 1] : '';
      if (/^[a-zA-Z0-9_-]{11}$/.test(fromPath || '')) {
        return fromPath;
      }
    }
  } catch (_) {
    return '';
  }

  return '';
}

function getIntroGuessVideoIdsFromSong(song) {
  if (!song || typeof song !== 'object') return [];

  const preferredKeys = [
    'intro',
    'Intro',
    'intro_url',
    'introUrl',
    'intro_link',
    'introLink',
    'intro_video',
    'introVideo',
    'youtube',
    'youtube_url',
    'youtubeUrl',
    'youtube_link',
    'youtubeLink',
    'video',
    'video_url',
    'videoUrl',
    'video_link',
    'videoLink',
    'yt',
    'yt_url',
    'ytUrl',
    'yt_link',
    'ytLink',
    'video_id',
    'videoId',
    'youtube_id',
    'youtubeId',
    'avatar'
  ];

  const values = [];
  preferredKeys.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(song, key)) {
      values.push({
        key,
        value: song[key]
      });
    }
  });

  Object.values(song).forEach((value) => {
    if (typeof value === 'string' && value.trim()) {
      values.push({
        key: '',
        value
      });
    }
  });

  const ids = values
    .map((entry) => {
      const allowBareId = /(video.?id|youtube.?id|yt.?id)$/i.test(entry.key || '');
      return extractYoutubeVideoId(entry.value, allowBareId);
    })
    .filter(Boolean);

  return [...new Set(ids)];
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

function getIntroGuessRecentLimit(songCount = getSongs().length) {
  if (songCount <= 1) return 0;
  return Math.min(10, Math.max(3, Math.floor(songCount / 4)));
}

function pruneIntroGuessRecentSongIds() {
  const existingIds = new Set(getSongs().map((song) => song?.Id).filter(Boolean));
  introGuessRecentSongIds = introGuessRecentSongIds.filter((songId) => existingIds.has(songId));
  const limit = getIntroGuessRecentLimit(existingIds.size);
  if (introGuessRecentSongIds.length > limit) {
    introGuessRecentSongIds = introGuessRecentSongIds.slice(0, limit);
  }
}

function pruneIntroGuessCyclePlayedSongIds() {
  const existingIds = new Set(getSongs().map((song) => song?.Id).filter(Boolean));
  introGuessCyclePlayedSongIds = introGuessCyclePlayedSongIds.filter((songId) => existingIds.has(songId));
}

function rememberIntroGuessSong(songId) {
  if (!songId) return;
  introGuessRecentSongIds = [
    songId,
    ...introGuessRecentSongIds.filter((item) => item !== songId)
  ];
  introGuessCyclePlayedSongIds = [
    songId,
    ...introGuessCyclePlayedSongIds.filter((item) => item !== songId)
  ];
  const limit = getIntroGuessRecentLimit();
  if (introGuessRecentSongIds.length > limit) {
    introGuessRecentSongIds = introGuessRecentSongIds.slice(0, limit);
  }
}

function buildIntroGuessExcludedSongIds(extraSongIds = [], includeCyclePlayed = true) {
  pruneIntroGuessRecentSongIds();
  pruneIntroGuessCyclePlayedSongIds();
  const cycleIds = includeCyclePlayed ? introGuessCyclePlayedSongIds : [];
  return [...new Set([...extraSongIds.filter(Boolean), ...introGuessRecentSongIds, ...cycleIds])];
}

async function buildPreparedIntroGuessRoundWithCycle(extraExcludedSongIds = []) {
  let preparedRound = await buildPreparedIntroGuessRound(
    buildIntroGuessExcludedSongIds(extraExcludedSongIds, true),
    false
  );
  if (preparedRound) return preparedRound;

  if (introGuessCyclePlayedSongIds.length === 0) {
    return null;
  }

  // Reset vong choi de mo lai pool bai hat da dung.
  introGuessCyclePlayedSongIds = [];
  preparedRound = await buildPreparedIntroGuessRound(
    buildIntroGuessExcludedSongIds(extraExcludedSongIds, false),
    true
  );
  return preparedRound;
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
    if (
      !introGuessState.isPlaying ||
      introGuessState.loading ||
      introGuessState.answered ||
      !introGuessState.currentSong ||
      !introGuessState.currentVideoId ||
      introGuessState.statusKey === 'introGuessUnavailableStatus'
    ) {
      clearIntroGuessProgressTimer();
      return;
    }

    let elapsedSeconds = 0;
    if (USE_LUCKY_AUDIO_SOURCE) {
      elapsedSeconds = (Date.now() - introGuessPlayStartedAt) / 1000;
    } else {
      if (!introGuessPlayer || typeof introGuessPlayer.getCurrentTime !== 'function') {
        clearIntroGuessProgressTimer();
        return;
      }

      try {
        elapsedSeconds = Number(introGuessPlayer.getCurrentTime()) || 0;
      } catch (_) {
        elapsedSeconds = 0;
      }
    }

    if (!Number.isFinite(elapsedSeconds) || elapsedSeconds < 0) {
      elapsedSeconds = 0;
    }

    introGuessState.progressPercent = Math.min(100, (elapsedSeconds / INTRO_GUESS_DURATION_SECONDS) * 100);

    const progressBar = document.getElementById('introGuessProgressBar');
    if (progressBar) progressBar.style.width = `${introGuessState.progressPercent}%`;

    if (elapsedSeconds >= INTRO_GUESS_DURATION_SECONDS) {
      clearIntroGuessProgressTimer();
      stopIntroGuessPlayback(false, true);
      renderIntroGuessGame();
    }
  }, 100);
}

function stopIntroGuessPlayback(resetToStart = false, markCompleted = false) {
  introGuessPlaybackToken += 1;
  introGuessPlayRequestToken += 1;
  clearIntroGuessTimer();
  clearIntroGuessProgressTimer();
  introGuessLuckyWindow = forceStopLuckyWindow(INTRO_GUESS_LUCKY_WINDOW_NAME, introGuessLuckyWindow);
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

function isIntroGuessYoutubeLimitError(error) {
  const message = String(error?.message || '').toLowerCase();
  return (
    message.includes('quota') ||
    message.includes('api error') ||
    message.includes('http 403') ||
    message.includes('http 429')
  );
}

function cacheIntroGuessVideoIds(song, videoIds) {
  if (!song?.Id || !Array.isArray(videoIds) || videoIds.length === 0) return;
  introGuessVideoCache.set(song.Id, [...new Set(videoIds.filter(Boolean))]);
}

function getCachedIntroGuessVideoIds(song) {
  if (!song?.Id) return [];
  const cached = introGuessVideoCache.get(song.Id);
  return Array.isArray(cached) ? [...cached] : [];
}

async function findIntroGuessVideoIdsFromSearchFallback(searchQuery) {
  const response = await fetch(
    `https://r.jina.ai/http://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`
  );
  if (!response.ok) {
    throw new Error(`Search fallback HTTP ${response.status}`);
  }
  const text = await response.text();
  const ids = [];

  const patterns = [
    /\/watch\?v=([a-zA-Z0-9_-]{11})/g,
    /"videoId":"([a-zA-Z0-9_-]{11})"/g
  ];

  patterns.forEach((pattern) => {
    let match = pattern.exec(text);
    while (match) {
      if (match[1]) ids.push(match[1]);
      match = pattern.exec(text);
    }
  });

  return [...new Set(ids)].slice(0, 8);
}

function getIntroGuessLocalPlayableSongCount() {
  return getSongs().filter((song) => song?.Id && getIntroGuessVideoIdsFromSong(song).length > 0).length;
}

function getIntroGuessAvailabilityNotice() {
  if (!introGuessYoutubeLookupDisabled) return '';

  const localPlayable = getIntroGuessLocalPlayableSongCount();
  const totalSongs = getSongs().filter((song) => song?.Id && song?.['Tên']).length;
  const language = getLanguage();

  if (language === 'en') {
    return `YouTube API is currently limited (403). Only ${localPlayable}/${totalSongs} songs have built-in intro links, so repeats can happen.`;
  }

  if (language === 'ko') {
    return `YouTube API 제한(403)으로 인해 현재 DB에 인트로 링크가 있는 곡 ${localPlayable}/${totalSongs}개만 사용됩니다. 반복이 발생할 수 있습니다.`;
  }

  return `YouTube API đang bị giới hạn (403). Hiện chỉ có ${localPlayable}/${totalSongs} bài có link intro sẵn trong DB nên sẽ bị lặp.`;
}

async function findIntroGuessVideoIds(song, options = {}) {
  const { allowYoutubeApi = true } = options;

  const localVideoIds = getIntroGuessVideoIdsFromSong(song);
  if (localVideoIds.length > 0) {
    cacheIntroGuessVideoIds(song, localVideoIds);
    return localVideoIds;
  }

  const cachedVideoIds = getCachedIntroGuessVideoIds(song);
  if (cachedVideoIds.length > 0) {
    return cachedVideoIds;
  }

  const searchQuery = getIntroSearchQuery(song);
  let latestError = null;

  try {
    const fallbackVideoIds = await findIntroGuessVideoIdsFromSearchFallback(searchQuery);
    if (fallbackVideoIds.length > 0) {
      cacheIntroGuessVideoIds(song, fallbackVideoIds);
      return fallbackVideoIds;
    }
  } catch (error) {
    latestError = error;
  }

  if (allowYoutubeApi) {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoEmbeddable=true&maxResults=8&q=${encodeURIComponent(searchQuery)}&key=${MINIGAME_YOUTUBE_API_KEY}`
      );
      if (!response.ok) {
        throw new Error(`YouTube API HTTP ${response.status}`);
      }
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message || 'YouTube API Error');
      }

      const items = Array.isArray(data?.items) ? data.items : [];
      const normalizedSong = normalizeText(song?.['Tên'] || '');
      const normalizedArtist = normalizeText(song?.['Ca sĩ'] || '');

      const prioritizedItems = [
        ...items.filter((item) => isIntroGuessVideoMatch(item, normalizedSong, normalizedArtist)),
        ...items.filter((item) => !isIntroGuessVideoMatch(item, normalizedSong, normalizedArtist))
      ];

      const apiVideoIds = [...new Set(prioritizedItems.map((item) => item?.id?.videoId).filter(Boolean))];
      if (apiVideoIds.length > 0) {
        cacheIntroGuessVideoIds(song, apiVideoIds);
        return apiVideoIds;
      }
    } catch (error) {
      latestError = error;
      if (isIntroGuessYoutubeLimitError(error) && !introGuessYoutubeLookupDisabled) {
        introGuessYoutubeLookupDisabled = true;
        logIntroGuess('YouTube API bi gioi han (403/quota). Tam dung Data API trong phien nay, chuyen sang fallback.', {
          localPlayable: getIntroGuessLocalPlayableSongCount(),
          totalSongs: getSongs().filter((candidate) => candidate?.Id && candidate?.['Tên']).length
        });
      }
    }
  }

  if (latestError) {
    throw latestError;
  }

  return [];
}

async function buildPreparedIntroGuessRound(excludedSongIds = [], allowFallback = true) {
  const allSongs = getSongs().filter((song) => song?.Id && song?.['Tên']);
  const excluded = new Set(excludedSongIds);
  const primaryQueue = shuffle(allSongs.filter((song) => !excluded.has(song.Id)));
  const fallbackQueue = shuffle(allSongs.filter((song) => excluded.has(song.Id)));
  const queue = allowFallback ? [...primaryQueue, ...fallbackQueue] : [...primaryQueue];

  for (const song of queue) {
    try {
      let videoIds = USE_LUCKY_AUDIO_SOURCE ? [buildLuckyAudioUrl(song)] : getIntroGuessVideoIdsFromSong(song);

      if (!videoIds.length && !USE_LUCKY_AUDIO_SOURCE) {
        videoIds = await findIntroGuessVideoIds(song, {
          allowYoutubeApi: !introGuessYoutubeLookupDisabled
        });
      }

      if (!videoIds || videoIds.length === 0) continue;

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
      console.warn(`${INTRO_GUESS_LOG_PREFIX} Failed to prepare round for song`, song?.['Tên'], error);
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
  rememberIntroGuessSong(preparedRound.song.Id);
  introGuessState.emptyReasonKey = '';
  introGuessState.progressPercent = 0;
  return true;
}

function consumePreparedIntroGuessRound() {
  const round = introGuessPreparedRound;
  introGuessPreparedRound = introGuessNextPreparedRound;
  introGuessNextPreparedRound = null;
  return round || null;
}

async function ensureIntroGuessCurrentRoundReady(forceRefresh = false) {
  if (forceRefresh) {
    introGuessPreparedRound = null;
  }

  if (!forceRefresh && introGuessPreparedRound) {
    return introGuessPreparedRound;
  }

  if (!forceRefresh && introGuessCurrentPreloadPromise) {
    return introGuessCurrentPreloadPromise;
  }

  logIntroGuess('Bat dau preload intro hien tai');
  const excludedSongIds = [
    introGuessState.currentSong?.Id,
    introGuessState.lastSongId,
    introGuessNextPreparedRound?.song?.Id
  ].filter(Boolean);

  introGuessCurrentPreloadPromise = buildPreparedIntroGuessRoundWithCycle(excludedSongIds)
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

async function ensureIntroGuessNextRoundReady(forceRefresh = false) {
  if (forceRefresh) {
    introGuessNextPreparedRound = null;
  }

  const currentSongId = introGuessState.currentSong?.Id || introGuessState.lastSongId;
  const preparedSongId = introGuessPreparedRound?.song?.Id;
  const anchorSongId = preparedSongId || currentSongId;

  if (
    !forceRefresh &&
    introGuessNextPreparedRound &&
    introGuessNextPreparedRound.song?.Id !== anchorSongId &&
    introGuessNextPreparedRound.song?.Id !== currentSongId
  ) {
    return introGuessNextPreparedRound;
  }

  if (introGuessNextPreloadPromise) {
    return introGuessNextPreloadPromise;
  }

  logIntroGuess('Bat dau preload intro bai tiep theo');
  const excludedSongIds = [currentSongId, preparedSongId, introGuessState.lastSongId].filter(Boolean);
  introGuessNextPreloadPromise = buildPreparedIntroGuessRoundWithCycle(excludedSongIds)
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

function startIntroGuessLuckyPlayback() {
  if (
    !USE_LUCKY_AUDIO_SOURCE ||
    !introGuessState.currentSong ||
    !introGuessState.currentVideoId ||
    introGuessState.loading ||
    introGuessState.answered
  ) {
    return false;
  }

  introGuessPlayRequestToken += 1;
  introGuessPlaybackToken += 1;
  clearIntroGuessTimer();
  clearIntroGuessProgressTimer();
  introGuessState.autoplayAfterLoad = false;
  introGuessState.progressPercent = 0;
  introGuessState.isPlaying = false;

  const popup = openLuckyAudioWindow(
    introGuessState.currentVideoId,
    INTRO_GUESS_LUCKY_WINDOW_NAME,
    introGuessLuckyWindow
  );

  if (!popup) {
    introGuessState.statusKey = 'introGuessUnavailableStatus';
    renderIntroGuessGame();
    return false;
  }

  introGuessLuckyWindow = popup;
  introGuessState.isPlaying = true;
  introGuessState.statusKey = 'introGuessPlayingStatus';
  startIntroGuessProgress();
  renderIntroGuessGame();
  return true;
}

function queueIntroGuessLuckyAutoplay(songId, videoId) {
  if (!USE_LUCKY_AUDIO_SOURCE || !songId || !videoId) return;

  const queuedRequestToken = ++introGuessPlayRequestToken;
  window.setTimeout(() => {
    if (
      queuedRequestToken !== introGuessPlayRequestToken ||
      !isIntroGuessDialogOpen() ||
      introGuessState.loading ||
      introGuessState.answered ||
      introGuessState.currentSong?.Id !== songId ||
      introGuessState.currentVideoId !== videoId
    ) {
      return;
    }

    startIntroGuessLuckyPlayback();
  }, 0);
}

async function loadIntroGuessPlayer(videoId) {
  await ensureIntroGuessYoutubeApi();
  const playerRoot = ensureIntroGuessPlayerContainer();
  if (!playerRoot) return;

  const isSameVideo = introGuessPlayer && typeof introGuessPlayer.getVideoData === 'function'
    ? introGuessPlayer.getVideoData()?.video_id === videoId
    : false;

  if (introGuessPlayer && typeof introGuessPlayer.cueVideoById === 'function') {
    if (introGuessState.autoplayAfterLoad) {
      introGuessState.autoplayAfterLoad = false;
      introGuessPlaybackToken += 1;
      resetIntroGuessProgress();
      clearIntroGuessTimer();
      introGuessState.isPlaying = true;
      introGuessState.statusKey = 'introGuessPlayingStatus';
      if (typeof introGuessPlayer.setVolume === 'function') {
        introGuessPlayer.setVolume(introGuessState.volume);
      }
      introGuessPlayer.loadVideoById({ videoId, startSeconds: 0, endSeconds: INTRO_GUESS_DURATION_SECONDS });
    } else {
      if (!isSameVideo) {
        introGuessPlayer.cueVideoById({ videoId, startSeconds: 0 });
      }
      if (typeof introGuessPlayer.pauseVideo === 'function') {
        introGuessPlayer.pauseVideo();
      }
      if (typeof introGuessPlayer.seekTo === 'function') {
        introGuessPlayer.seekTo(0, true);
      }
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
          const activeVideoId = typeof event.target?.getVideoData === 'function'
            ? event.target.getVideoData()?.video_id
            : '';

          if (
            !introGuessState.isPlaying ||
            introGuessState.loading ||
            introGuessState.answered ||
            !introGuessState.currentSong ||
            !introGuessState.currentVideoId ||
            (activeVideoId && activeVideoId !== introGuessState.currentVideoId)
          ) {
            return;
          }

          if (!introGuessProgressTimer) {
            startIntroGuessProgress();
          }
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

function getArtistGuessClueTypeKey(clueType) {
  if (clueType === 'audio') return 'artistGuessClueTypeAudio';
  if (clueType === 'hot') return 'artistGuessClueTypeHot';
  return 'artistGuessClueTypeTitle';
}

function getArtistGuessPromptKey(clueType) {
  if (clueType === 'audio') return 'artistGuessAudioPrompt';
  if (clueType === 'hot') return 'artistGuessHotPrompt';
  if (clueType === 'title') return 'artistGuessTitlePrompt';
  return 'artistGuessPrompt';
}

function isArtistGuessDialogOpen() {
  return Boolean(document.getElementById('artistGuessGameDialog')?.open);
}

function clearArtistGuessTimer() {
  if (artistGuessStopTimer) {
    clearTimeout(artistGuessStopTimer);
    artistGuessStopTimer = null;
  }
}

function clearArtistGuessProgressTimer() {
  if (artistGuessProgressTimer) {
    clearInterval(artistGuessProgressTimer);
    artistGuessProgressTimer = null;
  }
}

function resetArtistGuessProgress() {
  clearArtistGuessProgressTimer();
  artistGuessPlayStartedAt = 0;
  artistGuessState.progressPercent = 0;
}

function startArtistGuessProgress() {
  const playbackToken = artistGuessPlaybackToken;
  resetArtistGuessProgress();
  artistGuessPlayStartedAt = Date.now();
  artistGuessProgressTimer = window.setInterval(() => {
    if (!artistGuessPlayStartedAt || playbackToken !== artistGuessPlaybackToken || !isArtistGuessDialogOpen()) return;
    if (
      !artistGuessState.isPlaying ||
      artistGuessState.loading ||
      artistGuessState.answered ||
      !artistGuessState.currentSong ||
      !artistGuessState.currentVideoId ||
      artistGuessState.statusKey === 'artistGuessAudioUnavailableStatus'
    ) {
      clearArtistGuessProgressTimer();
      return;
    }

    let elapsedSeconds = 0;
    if (USE_LUCKY_AUDIO_SOURCE) {
      elapsedSeconds = (Date.now() - artistGuessPlayStartedAt) / 1000;
    } else {
      if (!artistGuessPlayer || typeof artistGuessPlayer.getCurrentTime !== 'function') {
        clearArtistGuessProgressTimer();
        return;
      }

      try {
        elapsedSeconds = Number(artistGuessPlayer.getCurrentTime()) || 0;
      } catch (_) {
        elapsedSeconds = 0;
      }
    }

    if (!Number.isFinite(elapsedSeconds) || elapsedSeconds < 0) {
      elapsedSeconds = 0;
    }

    artistGuessState.progressPercent = Math.min(100, (elapsedSeconds / ARTIST_GUESS_AUDIO_DURATION_SECONDS) * 100);

    const progressBar = document.getElementById('artistGuessProgressBar');
    if (progressBar) progressBar.style.width = `${artistGuessState.progressPercent}%`;

    if (elapsedSeconds >= ARTIST_GUESS_AUDIO_DURATION_SECONDS) {
      clearArtistGuessProgressTimer();
      stopArtistGuessPlayback(false, true);
      renderArtistGuessGame();
    }
  }, 100);
}

function stopArtistGuessPlayback(resetToStart = false, markCompleted = false) {
  artistGuessPlaybackToken += 1;
  artistGuessPlayRequestToken += 1;
  clearArtistGuessTimer();
  clearArtistGuessProgressTimer();
  artistGuessLuckyWindow = forceStopLuckyWindow(ARTIST_GUESS_LUCKY_WINDOW_NAME, artistGuessLuckyWindow);
  artistGuessState.isPlaying = false;
  artistGuessPlayStartedAt = 0;
  artistGuessState.autoplayAfterLoad = false;

  if (resetToStart) {
    artistGuessState.progressPercent = 0;
  } else if (markCompleted) {
    artistGuessState.progressPercent = 100;
  }

  if (artistGuessPlayer) {
    try {
      if (typeof artistGuessPlayer.stopVideo === 'function') {
        artistGuessPlayer.stopVideo();
      } else if (typeof artistGuessPlayer.pauseVideo === 'function') {
        artistGuessPlayer.pauseVideo();
      }
      if (resetToStart && typeof artistGuessPlayer.seekTo === 'function') {
        artistGuessPlayer.seekTo(0, true);
      }
    } catch (error) {
      console.warn('Failed to stop artist preview:', error);
    }
  }

  if (!artistGuessState.loading && artistGuessState.currentSong && artistGuessState.currentClueType === 'audio') {
    artistGuessState.statusKey = 'artistGuessAudioStoppedStatus';
  }
}

function ensureArtistGuessPlayerContainer() {
  let playerRoot = document.getElementById('artistGuessYoutubePlayer');
  if (!playerRoot) {
    const audioContainer = document.querySelector('.artist-guess-player-audio');
    if (!audioContainer) return null;
    playerRoot = document.createElement('div');
    playerRoot.id = 'artistGuessYoutubePlayer';
    audioContainer.appendChild(playerRoot);
  }

  return playerRoot;
}

async function switchArtistGuessVideoByIndex(videoIndex, autoplay = false) {
  const nextVideoId = artistGuessState.candidateVideoIds[videoIndex];
  if (!nextVideoId) {
    artistGuessState.currentVideoId = '';
    artistGuessState.currentVideoIndex = 0;
    artistGuessState.autoplayAfterLoad = false;
    artistGuessState.progressPercent = 0;
    artistGuessState.statusKey = 'artistGuessAudioUnavailableStatus';
    return false;
  }

  artistGuessState.currentVideoIndex = videoIndex;
  artistGuessState.currentVideoId = nextVideoId;
  artistGuessState.autoplayAfterLoad = autoplay;
  await loadArtistGuessPlayer(nextVideoId);
  return true;
}

function startArtistGuessPlaybackFromCurrentVideo() {
  if (
    !artistGuessPlayer ||
    !isArtistGuessDialogOpen() ||
    artistGuessState.answered ||
    artistGuessState.loading ||
    !artistGuessState.currentSong ||
    !artistGuessState.currentVideoId
  ) {
    return;
  }

  artistGuessPlaybackToken += 1;
  resetArtistGuessProgress();
  clearArtistGuessTimer();
  artistGuessState.isPlaying = true;
  artistGuessState.statusKey = 'artistGuessAudioPlayingStatus';

  if (typeof artistGuessPlayer.seekTo === 'function') {
    artistGuessPlayer.seekTo(0, true);
  }
  if (typeof artistGuessPlayer.playVideo === 'function') {
    artistGuessPlayer.playVideo();
  }
}

function startArtistGuessLuckyPlayback() {
  if (
    !USE_LUCKY_AUDIO_SOURCE ||
    !artistGuessState.currentSong ||
    artistGuessState.currentClueType !== 'audio' ||
    !artistGuessState.currentVideoId ||
    artistGuessState.loading ||
    artistGuessState.answered
  ) {
    return false;
  }

  artistGuessPlayRequestToken += 1;
  artistGuessPlaybackToken += 1;
  clearArtistGuessTimer();
  clearArtistGuessProgressTimer();
  artistGuessState.autoplayAfterLoad = false;
  artistGuessState.progressPercent = 0;
  artistGuessState.isPlaying = false;

  const popup = openLuckyAudioWindow(
    artistGuessState.currentVideoId,
    ARTIST_GUESS_LUCKY_WINDOW_NAME,
    artistGuessLuckyWindow
  );

  if (!popup) {
    artistGuessState.statusKey = 'artistGuessAudioUnavailableStatus';
    renderArtistGuessGame();
    return false;
  }

  artistGuessLuckyWindow = popup;
  artistGuessState.isPlaying = true;
  artistGuessState.statusKey = 'artistGuessAudioPlayingStatus';
  startArtistGuessProgress();
  renderArtistGuessGame();
  return true;
}

function queueArtistGuessLuckyAutoplay(songId, videoId) {
  if (!USE_LUCKY_AUDIO_SOURCE || !songId || !videoId) return;

  const queuedRequestToken = ++artistGuessPlayRequestToken;
  window.setTimeout(() => {
    if (
      queuedRequestToken !== artistGuessPlayRequestToken ||
      !isArtistGuessDialogOpen() ||
      artistGuessState.loading ||
      artistGuessState.answered ||
      artistGuessState.currentClueType !== 'audio' ||
      artistGuessState.currentSong?.Id !== songId ||
      artistGuessState.currentVideoId !== videoId
    ) {
      return;
    }

    startArtistGuessLuckyPlayback();
  }, 0);
}

async function loadArtistGuessPlayer(videoId) {
  await ensureIntroGuessYoutubeApi();
  const playerRoot = ensureArtistGuessPlayerContainer();
  if (!playerRoot) return;

  const isSameVideo = artistGuessPlayer && typeof artistGuessPlayer.getVideoData === 'function'
    ? artistGuessPlayer.getVideoData()?.video_id === videoId
    : false;

  if (artistGuessPlayer && typeof artistGuessPlayer.cueVideoById === 'function') {
    if (artistGuessState.autoplayAfterLoad) {
      artistGuessState.autoplayAfterLoad = false;
      artistGuessPlaybackToken += 1;
      resetArtistGuessProgress();
      clearArtistGuessTimer();
      artistGuessState.isPlaying = true;
      artistGuessState.statusKey = 'artistGuessAudioPlayingStatus';
      artistGuessPlayer.loadVideoById({ videoId, startSeconds: 0, endSeconds: ARTIST_GUESS_AUDIO_DURATION_SECONDS });
    } else {
      if (!isSameVideo) {
        artistGuessPlayer.cueVideoById({ videoId, startSeconds: 0 });
      }
      if (typeof artistGuessPlayer.pauseVideo === 'function') {
        artistGuessPlayer.pauseVideo();
      }
      if (typeof artistGuessPlayer.seekTo === 'function') {
        artistGuessPlayer.seekTo(0, true);
      }
    }
    return;
  }

  artistGuessPlayer = new window.YT.Player('artistGuessYoutubePlayer', {
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
        event.target.pauseVideo();
        event.target.seekTo(0, true);
        if (artistGuessState.autoplayAfterLoad) {
          const queuedRequestToken = artistGuessPlayRequestToken;
          artistGuessState.autoplayAfterLoad = false;
          if (
            queuedRequestToken === artistGuessPlayRequestToken &&
            !artistGuessState.answered &&
            artistGuessState.currentVideoId &&
            isArtistGuessDialogOpen()
          ) {
            startArtistGuessPlaybackFromCurrentVideo();
            renderArtistGuessGame();
          }
        }
      },
      onStateChange: (event) => {
        if (!isArtistGuessDialogOpen()) {
          stopArtistGuessPlayback(true);
          renderArtistGuessGame();
          return;
        }

        if (window.YT?.PlayerState && event.data === window.YT.PlayerState.PLAYING) {
          const activeVideoId = typeof event.target?.getVideoData === 'function'
            ? event.target.getVideoData()?.video_id
            : '';

          if (
            !artistGuessState.isPlaying ||
            artistGuessState.loading ||
            artistGuessState.answered ||
            !artistGuessState.currentSong ||
            !artistGuessState.currentVideoId ||
            (activeVideoId && activeVideoId !== artistGuessState.currentVideoId)
          ) {
            return;
          }

          if (!artistGuessProgressTimer) {
            startArtistGuessProgress();
          }
        } else if (window.YT?.PlayerState && (
          event.data === window.YT.PlayerState.ENDED ||
          event.data === window.YT.PlayerState.PAUSED
        ) && artistGuessState.isPlaying) {
          stopArtistGuessPlayback();
          renderArtistGuessGame();
        }
      },
      onError: () => {
        handleArtistGuessPlaybackError();
      }
    }
  });
}

async function handleArtistGuessPlaybackError() {
  stopArtistGuessPlayback(true);
  if (!artistGuessState.currentSong) return;

  const nextIndex = artistGuessState.currentVideoIndex + 1;
  if (nextIndex >= artistGuessState.candidateVideoIds.length) {
    artistGuessState.currentVideoId = '';
    artistGuessState.autoplayAfterLoad = false;
    artistGuessState.statusKey = 'artistGuessAudioUnavailableStatus';
    renderArtistGuessGame();
    return;
  }

  artistGuessState.loading = true;
  artistGuessState.statusKey = 'artistGuessAudioRetryingStatus';
  renderArtistGuessGame();

  try {
    await switchArtistGuessVideoByIndex(nextIndex, true);
  } catch (error) {
    console.warn('Failed to switch artist guess video:', error);
    artistGuessState.currentVideoId = '';
    artistGuessState.autoplayAfterLoad = false;
    artistGuessState.statusKey = 'artistGuessAudioUnavailableStatus';
  }

  artistGuessState.loading = false;
  renderArtistGuessGame();
}

function renderArtistGuessGame() {
  updateStats('artistGuess', getArtistGuessModeStats());

  const modeTitleButton = document.getElementById('artistGuessModeTitleButton');
  const modeHotButton = document.getElementById('artistGuessModeHotButton');
  const modeAudioButton = document.getElementById('artistGuessModeAudioButton');
  const promptEl = document.getElementById('artistGuessPromptLabel');
  const clueTypeValueEl = document.getElementById('artistGuessClueTypeValue');
  const clueEl = document.getElementById('artistGuessClue');
  const audioShell = document.getElementById('artistGuessAudioShell');
  const placeholderEl = document.getElementById('artistGuessPlayerPlaceholder');
  const statusEl = document.getElementById('artistGuessStatus');
  const metaEl = document.getElementById('artistGuessMeta');
  const optionsEl = document.getElementById('artistGuessOptions');
  const resultEl = document.getElementById('artistGuessResult');
  const playButton = document.getElementById('artistGuessPlayButton');
  const openSongButton = document.getElementById('artistGuessOpenSongButton');
  const progressBar = document.getElementById('artistGuessProgressBar');

  if (
    !modeTitleButton ||
    !modeHotButton ||
    !modeAudioButton ||
    !promptEl ||
    !clueTypeValueEl ||
    !clueEl ||
    !audioShell ||
    !placeholderEl ||
    !statusEl ||
    !metaEl ||
    !optionsEl ||
    !resultEl ||
    !playButton ||
    !openSongButton ||
    !progressBar
  ) {
    return;
  }

  [
    [modeTitleButton, 'title'],
    [modeHotButton, 'hot'],
    [modeAudioButton, 'audio']
  ].forEach(([button, mode]) => {
    button.classList.toggle('is-active', artistGuessState.currentMode === mode);
  });

  const isAudioClue = artistGuessState.currentClueType === 'audio';
  promptEl.textContent = t(
    artistGuessState.currentSong
      ? (artistGuessState.currentPromptKey || 'artistGuessPrompt')
      : getArtistGuessPromptKey(artistGuessState.currentMode)
  );
  clueTypeValueEl.textContent = t(getArtistGuessClueTypeKey(
    artistGuessState.currentSong ? artistGuessState.currentClueType : artistGuessState.currentMode
  ));
  audioShell.style.display = isAudioClue && artistGuessState.currentSong ? 'block' : 'none';
  playButton.style.display = isAudioClue && artistGuessState.currentSong ? 'inline-flex' : 'none';

  if (!artistGuessState.currentSong) {
    clueEl.textContent = artistGuessState.loading ? t('artistGuessLoading') : t(artistGuessState.emptyReasonKey);
    placeholderEl.textContent = t('artistGuessAudioLoading');
    statusEl.textContent = '';
    metaEl.textContent = '';
    optionsEl.innerHTML = '';
    playButton.disabled = true;
    progressBar.style.width = '0%';
    setResult(resultEl, '');
    openSongButton.style.display = 'none';
    return;
  }

  clueEl.textContent = isAudioClue
    ? t(USE_LUCKY_AUDIO_SOURCE ? 'artistGuessAudioClueLucky' : 'artistGuessAudioClue')
    : artistGuessState.currentClueText;
  placeholderEl.textContent = artistGuessState.loading
    ? t('artistGuessAudioLoading')
    : artistGuessState.isPlaying
      ? t('artistGuessAudioPlaying')
      : (artistGuessState.statusKey === 'artistGuessAudioUnavailableStatus'
        ? t('artistGuessAudioUnavailableStatus')
        : t(USE_LUCKY_AUDIO_SOURCE ? 'artistGuessAudioReadyLucky' : 'artistGuessAudioReady'));
  statusEl.textContent = isAudioClue ? t(artistGuessState.statusKey) : '';
  progressBar.style.width = `${artistGuessState.progressPercent}%`;
  playButton.textContent = artistGuessState.statusKey === 'artistGuessAudioStoppedStatus'
    ? t('artistGuessReplay')
    : t('artistGuessPlay');
  playButton.disabled =
    !isAudioClue ||
    artistGuessState.answered ||
    artistGuessState.loading ||
    !artistGuessState.currentVideoId ||
    artistGuessState.statusKey === 'artistGuessAudioUnavailableStatus';

  metaEl.textContent = artistGuessState.answered
    ? t('artistGuessMetaRevealed', {
      artist: artistGuessState.currentArtistLabel,
      song: artistGuessState.currentSong.Tên
    })
    : (isAudioClue && artistGuessState.statusKey === 'artistGuessAudioUnavailableStatus'
      ? t('artistGuessAudioUnavailableMeta')
      : `${t('artistGuessHint')}\n${t('artistGuessMetaHidden')}`);

  const buttons = artistGuessState.currentOptions.map((option) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'minigame-option';
    button.textContent = option.label;
    button.disabled = artistGuessState.answered;

    if (artistGuessState.answered) {
      if (option.key === artistGuessState.currentArtistKey) {
        button.classList.add('is-correct');
      } else if (option.key === artistGuessState.selectedArtistKey) {
        button.classList.add('is-wrong');
      }
    }

    button.addEventListener('click', () => {
      window.answerArtistGuess(option.key);
    });

    return button;
  });

  optionsEl.replaceChildren(...buttons);

  if (artistGuessState.answered) {
    const isCorrect = artistGuessState.selectedArtistKey === artistGuessState.currentArtistKey;
    setResult(resultEl, t(isCorrect ? 'artistGuessCorrect' : 'artistGuessWrong', {
      artist: artistGuessState.currentArtistLabel
    }), isCorrect ? 'correct' : 'wrong');
    openSongButton.style.display = 'inline-flex';
  } else {
    setResult(resultEl, '');
    openSongButton.style.display = 'none';
  }
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
  const volumeContainer = volumeSlider?.closest('.intro-guess-volume');

  if (!statusEl || !metaEl || !optionsEl || !resultEl || !playButton || !openSongButton || !progressBar || !volumeSlider || !volumeValue) return;
  if (volumeContainer) {
    volumeContainer.style.display = USE_LUCKY_AUDIO_SOURCE ? 'none' : 'grid';
  }

  volumeSlider.value = String(introGuessState.volume);
  volumeValue.textContent = `${introGuessState.volume}%`;

  if (!introGuessState.currentSong) {
    const availabilityNotice = getIntroGuessAvailabilityNotice();
    if (placeholderEl) {
      placeholderEl.textContent = introGuessState.loading ? t('introGuessSearching') : t(introGuessState.emptyReasonKey);
    }
    statusEl.textContent = introGuessState.loading
      ? t('introGuessSearchingStatus')
      : (availabilityNotice || '');
    metaEl.textContent = introGuessState.loading
      ? t('introGuessSearching')
      : (availabilityNotice || '');
    optionsEl.innerHTML = '';
    playButton.textContent = t('introGuessPlay');
    playButton.disabled = true;
    progressBar.style.width = '0%';
    setResult(resultEl, '');
    openSongButton.style.display = 'none';
    return;
  }

  if (placeholderEl) {
    placeholderEl.textContent = introGuessState.isPlaying
      ? t('introGuessMetaPlaying')
      : (introGuessState.statusKey === 'introGuessUnavailableStatus'
        ? t('introGuessUnavailableStatus')
        : t(USE_LUCKY_AUDIO_SOURCE ? 'introGuessMetaReadyLucky' : 'introGuessMetaReady'));
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
  if (USE_LUCKY_AUDIO_SOURCE) {
    introGuessLuckyWindow = null;
    introGuessLuckyWindow = reserveLuckyAudioWindow(
      INTRO_GUESS_LUCKY_WINDOW_NAME,
      introGuessLuckyWindow,
      t('introGuessLoading')
    );
  }
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

  let preparedRound = consumePreparedIntroGuessRound();

  if (!preparedRound) {
    await ensureIntroGuessCurrentRoundReady(true);
    await ensureIntroGuessNextRoundReady(true);
    preparedRound = consumePreparedIntroGuessRound();
  }
  logIntroGuess('Dang ap dung round intro da preload', {
    song: preparedRound?.song?.Tên || null
  });

  introGuessState.loading = false;

  if (!preparedRound) {
    if (USE_LUCKY_AUDIO_SOURCE) {
      introGuessLuckyWindow = forceStopLuckyWindow(INTRO_GUESS_LUCKY_WINDOW_NAME, introGuessLuckyWindow);
    }
    introGuessState.currentSong = null;
    introGuessState.emptyReasonKey = getSongs().length > 0 ? 'introGuessEmpty' : 'introGuessLoading';
    renderIntroGuessGame();
    return;
  }

  applyPreparedIntroGuessRound(preparedRound);

  if (!USE_LUCKY_AUDIO_SOURCE) {
    try {
      await switchIntroGuessVideoByIndex(0, true);
    } catch (error) {
      console.warn(`${INTRO_GUESS_LOG_PREFIX} Failed to load intro guess player`, error);
      introGuessState.currentSong = null;
      introGuessState.currentVideoId = '';
      introGuessState.candidateVideoIds = [];
      introGuessState.currentOptions = [];
      introGuessState.emptyReasonKey = 'introGuessEmpty';
    }
  }

  renderIntroGuessGame();
  if (USE_LUCKY_AUDIO_SOURCE && introGuessState.currentSong && introGuessState.currentVideoId) {
    queueIntroGuessLuckyAutoplay(introGuessState.currentSong.Id, introGuessState.currentVideoId);
  }
  void ensureIntroGuessCurrentRoundReady();
  void ensureIntroGuessNextRoundReady();
}

function buildArtistGuessOptions(correctArtistLabel, correctArtistKey) {
  const allOptions = buildArtistGuessOptionPool();
  if (allOptions.length < 2) return [];

  const wrongOptions = shuffle(allOptions.filter((option) => option.key !== correctArtistKey))
    .slice(0, ARTIST_GUESS_OPTION_COUNT - 1);

  return shuffle([
    { key: correctArtistKey, label: correctArtistLabel },
    ...wrongOptions
  ]);
}

function createArtistGuessRound(song, clueType, clueText, extras = {}) {
  const artistLabel = getArtistGuessLabel(song);
  const artistKey = normalizeArtistOption(artistLabel);
  if (!artistLabel || !artistKey) return null;

  const options = buildArtistGuessOptions(artistLabel, artistKey);
  if (options.length < 2) return null;

  return {
    song,
    clueType,
    clueText,
    promptKey: getArtistGuessPromptKey(clueType),
    artistLabel,
    artistKey,
    options,
    currentVideoId: '',
    candidateVideoIds: [],
    currentVideoIndex: 0,
    statusKey: 'artistGuessAudioReadyStatus',
    ...extras
  };
}

function buildArtistGuessTitleRound(songs, excludedSongIds = []) {
  const queue = buildSongQueue(songs, excludedSongIds);

  for (const song of queue) {
    const title = String(song?.['Tên'] || '').trim();
    if (!title) continue;

    const round = createArtistGuessRound(song, 'title', title, {
      statusKey: 'artistGuessAudioReadyStatus'
    });
    if (round) return round;
  }

  return null;
}

function buildArtistGuessHotRound(songs, excludedSongIds = []) {
  const queue = buildSongQueue(songs, excludedSongIds);

  for (const song of queue) {
    const hotLines = getHotLines(song);
    if (!hotLines.length) continue;

    const round = createArtistGuessRound(song, 'hot', formatHotQuoteClue(hotLines), {
      statusKey: 'artistGuessAudioReadyStatus'
    });
    if (round) return round;
  }

  return null;
}

async function buildArtistGuessAudioRound(songs, excludedSongIds = []) {
  const queue = buildSongQueue(songs, excludedSongIds);

  for (const song of queue) {
    try {
      let videoIds = USE_LUCKY_AUDIO_SOURCE ? [buildLuckyAudioUrl(song)] : getIntroGuessVideoIdsFromSong(song);

      if (!videoIds.length && !USE_LUCKY_AUDIO_SOURCE) {
        videoIds = await findIntroGuessVideoIds(song, {
          allowYoutubeApi: !introGuessYoutubeLookupDisabled
        });
      }

      if (!videoIds.length) continue;

      const round = createArtistGuessRound(song, 'audio', t('artistGuessAudioClue'), {
        currentVideoId: videoIds[0] || '',
        candidateVideoIds: videoIds,
        currentVideoIndex: 0,
        statusKey: 'artistGuessAudioReadyStatus'
      });

      if (round) return round;
    } catch (error) {
      console.warn(`${ARTIST_GUESS_LOG_PREFIX} Failed to prepare audio round`, song?.['Tên'], error);
    }
  }

  return null;
}

function applyArtistGuessRound(round) {
  artistGuessState.currentSong = round.song;
  artistGuessState.currentClueType = round.clueType;
  artistGuessState.currentClueText = round.clueText;
  artistGuessState.currentPromptKey = round.promptKey || getArtistGuessPromptKey(round.clueType);
  artistGuessState.currentOptions = [...round.options];
  artistGuessState.currentArtistLabel = round.artistLabel;
  artistGuessState.currentArtistKey = round.artistKey;
  artistGuessState.selectedArtistKey = '';
  artistGuessState.answered = false;
  artistGuessState.loading = false;
  getArtistGuessModeStats().lastSongId = round.song.Id;
  artistGuessState.emptyReasonKey = '';
  artistGuessState.currentVideoId = round.currentVideoId || '';
  artistGuessState.candidateVideoIds = [...(round.candidateVideoIds || [])];
  artistGuessState.currentVideoIndex = round.currentVideoIndex || 0;
  artistGuessState.autoplayAfterLoad = false;
  artistGuessState.isPlaying = false;
  artistGuessState.progressPercent = 0;
  artistGuessState.statusKey = round.statusKey || 'artistGuessAudioReadyStatus';
}

async function prepareArtistGuessRound(mode = artistGuessState.currentMode) {
  if (!ARTIST_GUESS_MODES.includes(mode)) {
    mode = 'title';
  }

  const requestToken = ++artistGuessRoundRequestToken;
  artistGuessState.currentMode = mode;
  stopArtistGuessPlayback(true);
  if (USE_LUCKY_AUDIO_SOURCE && mode === 'audio') {
    artistGuessLuckyWindow = null;
    artistGuessLuckyWindow = reserveLuckyAudioWindow(
      ARTIST_GUESS_LUCKY_WINDOW_NAME,
      artistGuessLuckyWindow,
      t('artistGuessAudioLoading')
    );
  }
  resetArtistGuessProgress();
  artistGuessState.loading = true;
  artistGuessState.currentSong = null;
  artistGuessState.currentClueType = '';
  artistGuessState.currentClueText = '';
  artistGuessState.currentPromptKey = getArtistGuessPromptKey(mode);
  artistGuessState.currentOptions = [];
  artistGuessState.currentArtistLabel = '';
  artistGuessState.currentArtistKey = '';
  artistGuessState.selectedArtistKey = '';
  artistGuessState.answered = false;
  artistGuessState.currentVideoId = '';
  artistGuessState.candidateVideoIds = [];
  artistGuessState.currentVideoIndex = 0;
  artistGuessState.autoplayAfterLoad = false;
  artistGuessState.isPlaying = false;
  artistGuessState.progressPercent = 0;
  artistGuessState.statusKey = mode === 'audio' ? 'artistGuessAudioSearchingStatus' : 'artistGuessAudioReadyStatus';
  artistGuessState.emptyReasonKey = getSongs().length > 0 ? getArtistGuessEmptyReasonKey(mode) : 'artistGuessLoading';
  renderArtistGuessGame();

  const songs = getSongs().filter((song) => song?.Id && song?.['Tên'] && getArtistGuessLabel(song));
  const optionPool = buildArtistGuessOptionPool();
  if (songs.length === 0 || optionPool.length < 2) {
    if (requestToken !== artistGuessRoundRequestToken) return;
    if (USE_LUCKY_AUDIO_SOURCE && mode === 'audio') {
      artistGuessLuckyWindow = forceStopLuckyWindow(ARTIST_GUESS_LUCKY_WINDOW_NAME, artistGuessLuckyWindow);
    }
    artistGuessState.loading = false;
    artistGuessState.currentSong = null;
    artistGuessState.emptyReasonKey = getSongs().length > 0 ? getArtistGuessEmptyReasonKey(mode) : 'artistGuessLoading';
    renderArtistGuessGame();
    return;
  }

  const excludedSongIds = [getArtistGuessModeStats(mode).lastSongId].filter(Boolean);
  let preparedRound = null;

  if (mode === 'audio') {
    preparedRound = await buildArtistGuessAudioRound(songs, excludedSongIds);
  } else if (mode === 'hot') {
    preparedRound = buildArtistGuessHotRound(songs, excludedSongIds);
  } else {
    preparedRound = buildArtistGuessTitleRound(songs, excludedSongIds);
  }

  if (requestToken !== artistGuessRoundRequestToken) return;
  artistGuessState.loading = false;

  if (!preparedRound) {
    if (USE_LUCKY_AUDIO_SOURCE && mode === 'audio') {
      artistGuessLuckyWindow = forceStopLuckyWindow(ARTIST_GUESS_LUCKY_WINDOW_NAME, artistGuessLuckyWindow);
    }
    artistGuessState.currentSong = null;
    artistGuessState.emptyReasonKey = getArtistGuessEmptyReasonKey(mode);
    renderArtistGuessGame();
    return;
  }

  logArtistGuess('Prepared round', {
    clueType: mode,
    song: preparedRound.song?.Tên
  });

  applyArtistGuessRound(preparedRound);

  if (!USE_LUCKY_AUDIO_SOURCE && artistGuessState.currentClueType === 'audio' && artistGuessState.currentVideoId) {
    try {
      await switchArtistGuessVideoByIndex(0, false);
      if (requestToken !== artistGuessRoundRequestToken) return;
    } catch (error) {
      if (requestToken !== artistGuessRoundRequestToken) return;
      console.warn(`${ARTIST_GUESS_LOG_PREFIX} Failed to load artist guess player`, error);
      artistGuessState.currentVideoId = '';
      artistGuessState.candidateVideoIds = [];
      artistGuessState.statusKey = 'artistGuessAudioUnavailableStatus';
    }
  }

  if (requestToken !== artistGuessRoundRequestToken) return;
  renderArtistGuessGame();
  if (
    USE_LUCKY_AUDIO_SOURCE &&
    artistGuessState.currentClueType === 'audio' &&
    artistGuessState.currentSong &&
    artistGuessState.currentVideoId
  ) {
    queueArtistGuessLuckyAutoplay(artistGuessState.currentSong.Id, artistGuessState.currentVideoId);
  }
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
  const artistGuessButton = document.querySelector('#btn-artist-guess-game-sc span');
  const lyricOrderButton = document.querySelector('#btn-lyric-order-game-sc span');

  if (introGuessButton) introGuessButton.textContent = t('menuIntroGuess');
  if (lyricFillButton) lyricFillButton.textContent = t('menuLyricFill');
  if (hotQuoteButton) hotQuoteButton.textContent = t('menuHotQuote');
  if (artistGuessButton) artistGuessButton.textContent = t('menuArtistGuess');
  if (lyricOrderButton) lyricOrderButton.textContent = t('menuLyricOrder');

  const introGuessButtonRoot = document.getElementById('btn-intro-guess-game-sc');
  const lyricFillButtonRoot = document.getElementById('btn-lyric-fill-game-sc');
  const hotButtonRoot = document.getElementById('btn-hot-quote-game-sc');
  const artistButtonRoot = document.getElementById('btn-artist-guess-game-sc');
  const lyricButtonRoot = document.getElementById('btn-lyric-order-game-sc');
  if (introGuessButtonRoot) introGuessButtonRoot.title = t('menuIntroGuess');
  if (lyricFillButtonRoot) lyricFillButtonRoot.title = t('menuLyricFill');
  if (hotButtonRoot) hotButtonRoot.title = t('menuHotQuote');
  if (artistButtonRoot) artistButtonRoot.title = t('menuArtistGuess');
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
    ['artistGuessGameDialogTitle', 'artistGuessTitle'],
    ['artistGuessSolvedLabel', 'solvedLabel'],
    ['artistGuessAttemptsLabel', 'attemptsLabel'],
    ['artistGuessAccuracyLabel', 'accuracyLabel'],
    ['artistGuessModeTitleButton', 'artistGuessModeTitle'],
    ['artistGuessModeHotButton', 'artistGuessModeHot'],
    ['artistGuessModeAudioButton', 'artistGuessModeAudio'],
    ['artistGuessClueTypeLabel', 'artistGuessClueTypeLabel'],
    ['artistGuessPlayButton', 'artistGuessPlay'],
    ['artistGuessNextButton', 'nextQuestion'],
    ['artistGuessOpenSongButton', 'openSong'],
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

  renderArtistGuessGame();
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
  if (USE_LUCKY_AUDIO_SOURCE) {
    startIntroGuessLuckyPlayback();
    return;
  }

  const requestToken = ++introGuessPlayRequestToken;

  try {
    const isSameVideo = introGuessPlayer && typeof introGuessPlayer.getVideoData === 'function'
      ? introGuessPlayer.getVideoData()?.video_id === introGuessState.currentVideoId
      : false;

    if (!isSameVideo) {
      await loadIntroGuessPlayer(introGuessState.currentVideoId);
    }

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

window.openArtistGuessGameDialog = function openArtistGuessGameDialog() {
  const dialog = document.getElementById('artistGuessGameDialog');
  if (!dialog) return;

  refreshMinigameLanguage();
  if (!artistGuessState.currentSong && !artistGuessState.loading) {
    void prepareArtistGuessRound(artistGuessState.currentMode);
  }
  if (!dialog.open) {
    dialog.showModal();
  }
};

window.setArtistGuessMode = function setArtistGuessMode(mode) {
  if (!ARTIST_GUESS_MODES.includes(mode)) return;
  if (artistGuessState.currentMode === mode && artistGuessState.currentSong && !artistGuessState.loading) return;
  if (artistGuessState.loading && artistGuessState.currentMode === mode) return;

  artistGuessState.currentMode = mode;
  artistGuessState.currentSong = null;
  artistGuessState.currentClueType = '';
  artistGuessState.currentClueText = '';
  artistGuessState.currentPromptKey = getArtistGuessPromptKey(mode);
  artistGuessState.currentOptions = [];
  artistGuessState.selectedArtistKey = '';
  artistGuessState.answered = false;
  artistGuessState.emptyReasonKey = getSongs().length > 0 ? getArtistGuessEmptyReasonKey(mode) : 'artistGuessLoading';
  renderArtistGuessGame();
  void prepareArtistGuessRound(mode);
};

window.nextArtistGuessRound = function nextArtistGuessRound() {
  void prepareArtistGuessRound(artistGuessState.currentMode);
};

window.playArtistGuessSnippet = async function playArtistGuessSnippet() {
  if (
    !artistGuessState.currentSong ||
    artistGuessState.currentClueType !== 'audio' ||
    !artistGuessState.currentVideoId ||
    artistGuessState.loading
  ) {
    return;
  }

  if (USE_LUCKY_AUDIO_SOURCE) {
    startArtistGuessLuckyPlayback();
    return;
  }

  const requestToken = ++artistGuessPlayRequestToken;

  try {
    const isSameVideo = artistGuessPlayer && typeof artistGuessPlayer.getVideoData === 'function'
      ? artistGuessPlayer.getVideoData()?.video_id === artistGuessState.currentVideoId
      : false;

    if (!isSameVideo) {
      await loadArtistGuessPlayer(artistGuessState.currentVideoId);
    }

    if (
      requestToken !== artistGuessPlayRequestToken ||
      artistGuessState.answered ||
      !isArtistGuessDialogOpen() ||
      artistGuessState.loading
    ) {
      return;
    }

    startArtistGuessPlaybackFromCurrentVideo();
  } catch (error) {
    console.warn('Failed to play artist clue snippet:', error);
    artistGuessState.statusKey = 'artistGuessAudioUnavailableStatus';
    artistGuessState.currentVideoId = '';
  }

  renderArtistGuessGame();
};

window.answerArtistGuess = function answerArtistGuess(artistKey) {
  if (artistGuessState.answered || !artistGuessState.currentSong) return;

  const currentModeStats = getArtistGuessModeStats();
  stopArtistGuessPlayback(true);
  artistGuessState.selectedArtistKey = artistKey;
  artistGuessState.answered = true;
  artistGuessState.autoplayAfterLoad = false;
  currentModeStats.attempts += 1;

  if (artistKey === artistGuessState.currentArtistKey) {
    currentModeStats.solved += 1;
  }

  renderArtistGuessGame();
};

window.openArtistGuessSong = function openArtistGuessSong() {
  if (artistGuessState.currentSong && typeof window.showLyric === 'function') {
    stopArtistGuessPlayback(true);
    const dialog = document.getElementById('artistGuessGameDialog');
    if (dialog?.open) dialog.close();
    window.showLyric(artistGuessState.currentSong.Id);
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
  pruneIntroGuessRecentSongIds();
  pruneIntroGuessCyclePlayedSongIds();

  const bootstrapKey = songs.map((song) => song.Id).join('|');
  if (
    bootstrapKey === introGuessLastBootstrapKey &&
    (introGuessPreparedRound || introGuessNextPreparedRound || introGuessCurrentPreloadPromise || introGuessNextPreloadPromise)
  ) {
    return;
  }

  introGuessLastBootstrapKey = bootstrapKey;

  try {
    await ensureIntroGuessCurrentRoundReady();
    await ensureIntroGuessNextRoundReady();
  } catch (error) {
    console.warn(`${INTRO_GUESS_LOG_PREFIX} Loi khi bootstrap preload`, error);
  }
}

attachBackdropClose('introGuessGameDialog');
attachBackdropClose('lyricFillGameDialog');
attachBackdropClose('hotQuoteGameDialog');
attachBackdropClose('artistGuessGameDialog');
attachBackdropClose('lyricOrderGameDialog');
document.getElementById('introGuessGameDialog')?.addEventListener('close', () => {
  stopIntroGuessPlayback(true);
  renderIntroGuessGame();
});
document.getElementById('artistGuessGameDialog')?.addEventListener('close', () => {
  stopArtistGuessPlayback(true);
  renderArtistGuessGame();
});
document.addEventListener('keydown', (event) => {
  if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.tagName === 'SELECT') return;

  if (isIntroGuessDialogOpen()) {
    if (event.key >= '1' && event.key <= '4') {
      event.preventDefault();
      const index = Number(event.key) - 1;
      const option = introGuessState.currentOptions[index];
      if (option && !introGuessState.answered && introGuessState.currentSong) {
        window.answerIntroGuess(option.Id);
      }
    } else if (event.key === 'Enter') {
      event.preventDefault();
      window.nextIntroGuessRound();
    } else if (event.key === ' ') {
      event.preventDefault();
      if (introGuessState.answered && introGuessState.currentSong) {
        window.openIntroGuessSong();
      } else if (!introGuessState.answered && introGuessState.currentSong && introGuessState.currentVideoId) {
        void window.playIntroGuessSnippet();
      }
    }
    return;
  }

  if (!isArtistGuessDialogOpen()) return;

  if (event.key >= '1' && event.key <= '4') {
    event.preventDefault();
    const index = Number(event.key) - 1;
    const option = artistGuessState.currentOptions[index];
    if (option && !artistGuessState.answered && artistGuessState.currentSong) {
      window.answerArtistGuess(option.key);
    }
  } else if (event.key === 'Enter') {
    event.preventDefault();
    void window.nextArtistGuessRound();
  } else if (event.key === ' ') {
    event.preventDefault();
    if (artistGuessState.answered && artistGuessState.currentSong) {
      window.openArtistGuessSong();
    } else if (
      !artistGuessState.answered &&
      artistGuessState.currentSong &&
      artistGuessState.currentClueType === 'audio' &&
      artistGuessState.currentVideoId
    ) {
      void window.playArtistGuessSnippet();
    }
  }
});
document.addEventListener('app-songsloaded', (event) => {
  logIntroGuess('Nhan su kien songs loaded', event?.detail || {});
  introGuessPreparedRound = null;
  introGuessNextPreparedRound = null;
  introGuessCurrentPreloadPromise = null;
  introGuessNextPreloadPromise = null;
  introGuessRecentSongIds = [];
  introGuessCyclePlayedSongIds = [];
  introGuessYoutubeLookupDisabled = false;
  introGuessVideoCache.clear();
  void bootstrapIntroGuessPreload();
});
document.addEventListener('app-languagechange', refreshMinigameLanguage);
refreshMinigameLanguage();
if (getSongs().length) {
  logIntroGuess('Danh sach bai hat da co san khi khoi tao script', { count: getSongs().length });
  void bootstrapIntroGuessPreload();
}
