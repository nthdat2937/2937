// ThiChungChi/wwwroot/js/time-test.js
const TimeTest = (() => {
    // ── State ────────────────────────────────────────────────────────────────
    let sentences = []; // array of word-arrays, one per quote
    let sentPool = []; // shuffled queue of sentence indices
    let sentPoolIdx = 0;
    let shuffled = [];
    let wordIndex = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let backspaceCount = 0;
    let presentedWords = []; // full presented sequence (for wordlist POST field)
    let typedCorrect = []; // correctly typed words (for user_input POST field)
    let timerInterval = null;
    let liveWpmInterval = null;
    let timeLeft = 60;
    let selectedDuration = 60;
    let started = false;
    let finished = false;
    let ngonNgu = -2; // NgonNgu.ENGLISH default

    const WORD_BUFFER = 80;

    // ── Render state ─────────────────────────────────────────────────────────
    let renderStartIdx = 0; // value of wordIndex when renderWords() was last called
    let wordSpans = []; // .time-word span elements for the current batch
    let lineH = 0; // height of one text line (px), measured after layout
    let prevLineTop = 0; // offsetTop of the last line boundary we scrolled past
    let rowOffset = 0; // how many lines we have scrolled up so far

    // ── Sentence loading from quotes.json ────────────────────────────────────
    const wordCache = {};
    async function loadWords(lang) {
        const fileMap = {
            english: 'en',
            vietnamese: 'vi',
            indonesian: 'id',
            thai: 'th',
            albanian: 'sq',
            armenian: 'hy',
            azerbaijani: 'az',
            bengali: 'bn',
            bulgarian: 'bg',
            catalan: 'ca',
            'chinese traditional': 'zh-Hant',
            croatian: 'hr',
            danish: 'da',
            dutch: 'nl',
            esperanto: 'eo',
            estonian: 'et',
            filipino: 'fil',
            finnish: 'fi',
            galician: 'gl',
            georgian: 'ka',
            greek: 'el',
            hebrew: 'he',
            hindi: 'hi',
            hungarian: 'hu',
            icelandic: 'is',
            italian: 'it',
            japanese: 'ja',
            korean: 'ko',
            kurdish: 'ku',
            latvian: 'lv',
            lithuanian: 'lt',
            macedonian: 'mk',
            malagasy: 'mg',
            malaysian: 'ms',
            norwegian: 'no',
            pashto: 'ps',
            persian: 'fa',
            polish: 'pl',
            portuguese: 'pt',
            romanian: 'ro',
            russian: 'ru',
            serbian: 'sr',
            slovak: 'sk',
            slovenian: 'sl',
            spanish: 'es',
            swedish: 'sv',
            turkish: 'tr',
            ukrainian: 'uk',
            urdu: 'ur',
            arabic: 'ar',
            french: 'fr',
            german: 'de',
            czech: 'cs',
            'chinese simplified': 'zh-Hans',
            argentina: 'es'
        };
        const code = fileMap[lang] || lang || 'en';
        if (wordCache[code]) return wordCache[code];
        try {
            const res = await fetch('../data/quotes.json');
            if (!res.ok) throw new Error('fetch failed');
            const data = await res.json();
            const qs = (data[code] && data[code].length > 0) ? data[code] : (data['en'] || []);
            // Each sentence becomes an array of words (preserving punctuation)
            const result = qs.map(q => q.text.split(/\s+/).filter(w => w.length > 0));
            wordCache[code] = result;
            return result;
        } catch (e) {
            console.error('Failed to load quotes for ' + code);
            return [
                ['practice', 'makes', 'perfect']
            ];
        }
    }

    function shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function ensureWords(n) {
        while (shuffled.length - wordIndex < n) {
            if (sentPoolIdx >= sentPool.length) {
                sentPool = shuffle(sentences);
                sentPoolIdx = 0;
            }
            shuffled = shuffled.concat(sentPool[sentPoolIdx++]);
        }
    }

    // ── DOM helpers ──────────────────────────────────────────────────────────
    function getRow() {
        return document.getElementById('time-words-row');
    }

    function getInput() {
        return document.getElementById('time-input');
    }

    function getTimerEl() {
        return document.getElementById('time-timer');
    }

    function getLiveWpm() {
        return document.getElementById('time-live-wpm');
    }

    function getLiveAcc() {
        return document.getElementById('time-live-acc');
    }

    function getResultBox() {
        return document.getElementById('time-result-box');
    }

    function formatTime(s) {
        return (s < 10 ? '0' : '') + s;
    }

    // ── Rendering ────────────────────────────────────────────────────────────
    // Build a .time-word span that contains one .char span per character
    function createWordSpan(word, globalIdx) {
        const ws = document.createElement('span');
        ws.className = 'time-word';
        ws.dataset.idx = globalIdx;
        for (const ch of word) {
            const c = document.createElement('span');
            c.className = 'char';
            c.textContent = ch;
            ws.appendChild(c);
        }
        return ws;
    }

    function renderWords() {
        ensureWords(WORD_BUFFER);
        const row = getRow();
        if (!row) return;

        // Full rebuild
        row.innerHTML = '';
        row.style.transform = '';
        wordSpans = [];
        renderStartIdx = wordIndex;
        rowOffset = 0;
        prevLineTop = 0;

        const frag = document.createDocumentFragment();
        for (let i = wordIndex; i < wordIndex + WORD_BUFFER && i < shuffled.length; i++) {
            const ws = createWordSpan(shuffled[i], i);
            frag.appendChild(ws);
            wordSpans.push(ws);
        }
        row.appendChild(frag);

        // Measure line height from the first word (triggers layout flush)
        const first = wordSpans[0];
        if (first) {
            lineH = first.offsetHeight || 46;
            prevLineTop = first.offsetTop;
        }

        // Put the blinking cursor on the first character of the current word
        refreshCursor('');

        // Track presented words for the POST payload
        for (let i = presentedWords.length; i < wordIndex + WORD_BUFFER && i < shuffled.length; i++) {
            presentedWords.push(shuffled[i]);
        }
    }

    // Returns the index of wordIndex within the current wordSpans array
    function localIdx() {
        return wordIndex - renderStartIdx;
    }

    // Update per-character colouring and cursor position for the current word
    function refreshCursor(typedSoFar) {
        const li = localIdx();
        const ws = wordSpans[li];
        if (!ws) return;

        const typed = typedSoFar.normalize('NFC');
        const expected = (shuffled[wordIndex] || '').normalize('NFC');
        const chars = ws.querySelectorAll('.char');

        chars.forEach((c, i) => {
            c.classList.remove('correct', 'wrong', 'cursor');
            if (i < typed.length) {
                // already typed — colour by correctness
                c.classList.add(i < expected.length && typed[i] === expected[i] ? 'correct' : 'wrong');
            } else if (i === typed.length) {
                // next character to type — show cursor here
                c.classList.add('cursor');
            }
            // characters beyond typed.length: uncoloured (grey)
        });

        // If user typed past the end of the word, mark the last char wrong
        if (typed.length > 0 && typed.length > chars.length && chars.length > 0) {
            chars[chars.length - 1].classList.add('wrong');
        }
    }

    // Lock in correct/wrong styling when the user finishes a word
    function completeWord(isCorrect) {
        const li = localIdx();
        const ws = wordSpans[li];
        if (!ws) return;
        // Remove the cursor from all chars
        ws.querySelectorAll('.char').forEach(c => c.classList.remove('cursor'));
        ws.classList.add(isCorrect ? 'correct-word' : 'wrong-word');
    }

    // Scroll the row up if the new current word is on a line below the last visible one
    function scrollIfNeeded() {
        const li = localIdx();
        const ws = wordSpans[li];
        if (!ws) return;
        const top = ws.offsetTop;
        if (top > prevLineTop) {
            rowOffset++;
            prevLineTop = top;
            const row = getRow();
            if (row) row.style.transform = `translateY(${-rowOffset * lineH}px)`;
        }
    }

    // ── Live stats ────────────────────────────────────────────────────────────
    function updateLiveStats() {
        if (!started || finished) return;
        const elapsed = selectedDuration - timeLeft;
        const mins = elapsed > 0 ? elapsed / 60 : 1 / 60;
        const wpm = Math.round(correctCount / mins);
        const total = correctCount + wrongCount;
        const acc = total > 0 ? Math.round(correctCount * 100 / total) : 100;
        const wpmEl = getLiveWpm();
        const accEl = getLiveAcc();
        if (wpmEl) wpmEl.textContent = wpm;
        if (accEl) accEl.textContent = acc + '%';
    }

    // ── Timer ─────────────────────────────────────────────────────────────────
    function startTimer() {
        if (started) return;
        started = true;
        timeLeft = selectedDuration;
        const timerEl = getTimerEl();
        if (timerEl) timerEl.textContent = '00:' + formatTime(timeLeft);

        timerInterval = setInterval(() => {
            timeLeft--;
            if (timerEl) timerEl.textContent = '00:' + formatTime(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                clearInterval(liveWpmInterval);
                finishTest();
            }
        }, 1000);

        liveWpmInterval = setInterval(updateLiveStats, 500);
    }

    // ── Input handling ────────────────────────────────────────────────────────
    let composing = false;

    function onKeyDown(e) {
        if (finished) return;
        if (e.key === 'Backspace') backspaceCount++;
    }

    function onInput(e) {
        if (finished || composing) return;
        const input = getInput();
        if (!input) return;
        const val = input.value;

        // Start timer on first real keystroke
        if (!started && val.trim().length > 0) startTimer();

        if (val.endsWith(' ')) {
            // ── Word submitted ────────────────────────────────────────────────
            const typed = val.trim().normalize('NFC');
            const expected = shuffled[wordIndex].normalize('NFC');
            const isCorrect = typed === expected;

            completeWord(isCorrect);
            if (isCorrect) {
                correctCount++;
                typedCorrect.push(typed);
            } else {
                wrongCount++;
            }

            wordIndex++;
            input.value = '';

            ensureWords(WORD_BUFFER);

            // Re-render when the visible batch is nearly exhausted
            if (localIdx() >= wordSpans.length - 15) {
                renderWords();
                return;
            }

            scrollIfNeeded();
            refreshCursor(''); // cursor on first char of the new word
            return;
        }

        // ── Still typing ──────────────────────────────────────────────────────
        refreshCursor(val.trim());
    }

    // ── Finish ────────────────────────────────────────────────────────────────
    function finishTest() {
        finished = true;
        const input = getInput();
        if (input) input.disabled = true;

        const elapsed = selectedDuration;
        const mins = elapsed / 60;
        const wpm = Math.round(correctCount / mins);
        const total = correctCount + wrongCount;
        const acc = total > 0 ? parseFloat((correctCount * 100 / total).toFixed(1)) : 100.0;

        showResult(wpm, acc);
        saveResult(wpm, acc, elapsed);
    }

    function showResult(wpm, acc) {
        const box = getResultBox();
        if (!box) return;
        const el = id => box.querySelector('#' + id);
        if (el('time-result-wpm')) el('time-result-wpm').textContent = wpm;
        if (el('time-result-acc')) el('time-result-acc').textContent = acc.toFixed(1) + '%';
        if (el('time-result-correct')) el('time-result-correct').textContent = correctCount;
        if (el('time-result-total')) el('time-result-total').textContent = correctCount + wrongCount;
        box.style.display = 'block';
        const area = document.getElementById('time-test-area');
        if (area) area.style.display = 'none';
    }

    async function saveResult(wpm, acc, elapsed) {
        const postData = {
            typing_mode: 12,
            ngon_ngu: ngonNgu,
            wordlist: presentedWords.join(' '),
            user_input: typedCorrect.join(' '),
            word_wrong: wrongCount,
            word_correct: correctCount,
            time_complete: elapsed,
            backspace_counter: backspaceCount
        };
        try {
            let data = { success: false, data: { wpm: wpm } };
            if (typeof window.sp !== 'undefined') {
                const session = await window.sp.auth.getSession();
                const user = session.data.session?.user;
                if (user) {
                    const insertData = {
                        user_id: user.id,
                        typing_mode: postData.typing_mode || 12,
                        ngon_ngu: postData.ngon_ngu,
                        word_wrong: postData.word_wrong,
                        word_correct: postData.word_correct,
                        time_complete: postData.time_complete,
                        wpm: wpm,
                        accuracy: acc
                    };
                    const { error } = await window.sp.from('typing_results').insert([insertData]);
                    if (!error) {
                        data.success = true;
                    } else {
                        console.error('Supabase save failed:', error);
                    }
                }
            }

            // Always read WPM/accuracy from server response (present even for anon users)
            const box = getResultBox();
            if (box && data.data && data.data.wpm) {
                const el = id => box.querySelector('#' + id);
                if (el('time-result-wpm')) el('time-result-wpm').textContent = data.data.wpm;
            }

            // Show gamification popup if available
            if (data.gamification && typeof XpLevel !== 'undefined') {
                XpLevel.handleGamificationResponse(data.gamification);
            }

            // Show login nudge for anonymous users.
            // Key off !data.success only — for Time Mode the only reason success=false while data.wpm
            // is still present is that the user is not authenticated. Do NOT check msg text: the
            // server returns a localized string that may not contain "login" in Indonesian/Thai.
            if (!data.success) {
                const nudge = document.getElementById('time-login-nudge');
                if (nudge) nudge.style.display = 'block';
            }

            // Enable certificate buttons with result data
            enableCertButtons(wpm, acc, elapsed);

        } catch (e) {
            console.error('Save result failed:', e);
            enableCertButtons(wpm, acc, elapsed);
        }
    }

    function enableCertButtons(wpm, acc, elapsed) {
        const certActions = document.getElementById('cert-actions');
        if (!certActions) return;
        certActions.style.display = 'flex';

        const certUsernameEl = document.getElementById('cert-username');
        const username = (certUsernameEl && certUsernameEl.dataset.username) ? certUsernameEl.dataset.username : '';
        const langEl = document.getElementById('time-lang-val');
        const lang = (langEl && langEl.dataset.val) ? langEl.dataset.val : 'english';
        const langMap = {
            english: 'English',
            vietnamese: 'Tiếng Việt',
            indonesian: 'Bahasa Indonesia',
            thai: 'ภาษาไทย'
        };
        const langName = langMap[lang] || 'English';

        const params = {
            wpm,
            accuracy: acc,
            duration: elapsed,
            lang: langName,
            username: username || 'Anonymous'
        };

        const dlBtn = document.getElementById('btn-cert-download');
        if (dlBtn) dlBtn.onclick = () => {
            if (typeof CertificateCard !== 'undefined') CertificateCard.download(params);
        };

        const shareBtn = document.getElementById('btn-cert-share-fb');
        if (shareBtn) shareBtn.onclick = () => {
            const baseUrl = shareBtn.dataset.baseUrl || location.origin;
            if (typeof CertificateCard !== 'undefined') CertificateCard.share(Object.assign({}, params, {
                baseUrl
            }));
        };
    }

    // ── Duration selector ─────────────────────────────────────────────────────
    function selectDuration(d) {
        selectedDuration = d;
        timeLeft = d;
        const timerEl = getTimerEl();
        if (timerEl) timerEl.textContent = '00:' + formatTime(d);
        document.querySelectorAll('.tm-dur-pill').forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.duration) === d);
        });
    }

    // ── Reset ─────────────────────────────────────────────────────────────────
    function resetTest() {
        clearInterval(timerInterval);
        clearInterval(liveWpmInterval);
        sentPool = shuffle(sentences);
        sentPoolIdx = 0;
        shuffled = [];
        wordIndex = 0;
        correctCount = 0;
        wrongCount = 0;
        backspaceCount = 0;
        presentedWords = [];
        typedCorrect = [];
        started = false;
        finished = false;
        timeLeft = selectedDuration;

        const input = getInput();
        if (input) {
            input.disabled = false;
            input.value = '';
            input.focus();
        }

        const box = getResultBox();
        if (box) box.style.display = 'none';

        const area = document.getElementById('time-test-area');
        if (area) area.style.display = 'block';

        const timerEl = getTimerEl();
        if (timerEl) timerEl.textContent = '00:' + formatTime(selectedDuration);

        const certActions = document.getElementById('cert-actions');
        if (certActions) certActions.style.display = 'none';

        renderWords();
    }

    // ── Init ──────────────────────────────────────────────────────────────────
    async function init() {
        const ngNguEl = document.getElementById('ngon-ngu-val');
        if (ngNguEl) ngonNgu = parseInt(ngNguEl.dataset.val) || -2;

        const langEl = document.getElementById('time-lang-val');
        const lang = (langEl && langEl.dataset.val) ? langEl.dataset.val : 'english';

        sentences = await loadWords(lang);
        sentPool = shuffle(sentences);
        sentPoolIdx = 0;
        shuffled = [];
        ensureWords(WORD_BUFFER);
        presentedWords = shuffled.slice(0, WORD_BUFFER);
        renderWords();

        const input = getInput();
        if (input) {
            input.addEventListener('keydown', onKeyDown);
            input.addEventListener('compositionstart', () => {
                composing = true;
            });
            input.addEventListener('compositionend', () => {
                composing = false;
                onInput({});
            });
            input.addEventListener('input', onInput);
            input.focus();
        }

        // Duration buttons
        document.querySelectorAll('.tm-dur-pill').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!started) selectDuration(parseInt(btn.dataset.duration));
            });
        });

        // Reset button (in test area) and Retry button (in result overlay)
        const resetBtn = document.getElementById('btn-time-reset');
        if (resetBtn) resetBtn.addEventListener('click', resetTest);
        const retryBtn = document.getElementById('btn-time-retry');
        if (retryBtn) retryBtn.addEventListener('click', resetTest);

        // Default duration
        selectDuration(15);
    }

    return {
        init
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('time-words-row')) {
        TimeTest.init();
    }
});