(() => {
    'use strict';

    const STORAGE_KEY = 'musiclive_pomodoro_v1';
    const modes = ['focus', 'short', 'long'];
    const labels = { focus: 'Thời gian tập trung', short: 'Nghỉ ngắn', long: 'Nghỉ dài' };
    const byId = id => document.getElementById(id);
    const column = byId('left-column');
    const panel = byId('pomodoro-panel');
    const tabs = [byId('workspace-video-tab'), byId('workspace-pomodoro-tab'), byId('workspace-study-tab')];
    const modeButtons = [...panel.querySelectorAll('[data-pomodoro-mode]')];
    const fields = Object.fromEntries(modes.map(mode => [mode, byId(`pomodoro-${mode}-minutes`)]));
    let audioContext;
    let lastDisplay = '';

    function defaults() {
        return { version: 1, view: 'video', mode: 'focus', minutes: { focus: 25, short: 5, long: 15 },
            remaining: 25 * 60 * 1000, endsAt: null, completed: 0, sound: true };
    }

    function restore(raw) {
        const initial = defaults();
        try {
            const saved = JSON.parse(raw);
            if (!saved || saved.version !== 1 || !modes.includes(saved.mode)) return initial;
            if (!modes.every(mode => Number.isInteger(saved.minutes?.[mode]) && saved.minutes[mode] >= 1 && saved.minutes[mode] <= 180)) return initial;
            const duration = saved.minutes[saved.mode] * 60000;
            if (!Number.isFinite(saved.remaining) || saved.remaining < 0 || saved.remaining > duration) return initial;
            if (saved.endsAt !== null && (!Number.isFinite(saved.endsAt) || saved.endsAt <= 0 || saved.endsAt > Date.now() + duration + 1000)) return initial;
            const validViews = ['video', 'pomodoro', 'study'];
            return { version: 1, view: validViews.includes(saved.view) ? saved.view : 'video', mode: saved.mode,
                minutes: { ...saved.minutes }, remaining: saved.remaining, endsAt: saved.endsAt,
                completed: Number.isSafeInteger(saved.completed) && saved.completed >= 0 ? saved.completed : 0,
                sound: saved.sound !== false };
        } catch (_) { return initial; }
    }

    let state;
    try { state = restore(localStorage.getItem(STORAGE_KEY)); } catch (_) { state = defaults(); }

    function save() {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) { /* Timer also works without storage. */ }
    }

    function duration() { return state.minutes[state.mode] * 60000; }
    function remaining() { return state.endsAt === null ? state.remaining : Math.max(0, state.endsAt - Date.now()); }
    function announce(message) { byId('pomodoro-status').textContent = message; }

    function renderWorkspace() {
        const view = state.view; // 'video' | 'pomodoro' | 'study'
        column.classList.toggle('pomodoro-view', view === 'pomodoro');
        column.classList.toggle('study-view', view === 'study');
        panel.hidden = view !== 'pomodoro';
        const studyPanel = byId('study-panel');
        if (studyPanel) studyPanel.hidden = view !== 'study';
        const viewNames = ['video', 'pomodoro', 'study'];
        tabs.forEach((tab, index) => {
            if (!tab) return;
            const selected = viewNames[index] === view;
            tab.setAttribute('aria-selected', String(selected));
            tab.tabIndex = selected ? 0 : -1;
        });
        if (view === 'study' && typeof window.onEnterStudyWorkspace === 'function') {
            window.onEnterStudyWorkspace();
        }
    }

    function switchWorkspace(view) {
        state.view = view;
        if ((view === 'pomodoro' || view === 'study') && column.classList.contains('video-info-collapsed')) {
            if (typeof toggleLandscapeVideoInfo === 'function') toggleLandscapeVideoInfo();
        }
        renderWorkspace();
        save();
        if (typeof window.onWorkspaceViewChanged === 'function') {
            window.onWorkspaceViewChanged(view);
        }
    }
    window.switchWorkspace = switchWorkspace;

    function render() {
        const seconds = Math.ceil(remaining() / 1000);
        const text = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
        if (text !== lastDisplay) {
            byId('pomodoro-time').textContent = text;
            byId('pomodoro-tab-time').textContent = text;
            lastDisplay = text;
        }
        const running = state.endsAt !== null;
        const progress = Math.max(0, Math.min(1, 1 - remaining() / duration()));
        byId('pomodoro-clock').style.setProperty('--pomodoro-progress', `${progress * 360}deg`);
        byId('pomodoro-tab-time').hidden = !running && state.remaining === duration();
        byId('pomodoro-phase-label').textContent = labels[state.mode];
        byId('pomodoro-session-count').textContent = `Đã hoàn thành ${state.completed} phiên học`;
        const toggle = byId('pomodoro-toggle');
        toggle.firstElementChild.textContent = running ? 'pause' : 'play_arrow';
        toggle.lastElementChild.textContent = running ? 'Tạm dừng' : state.remaining < duration() ? 'Tiếp tục' : 'Bắt đầu';
        modeButtons.forEach(button => {
            button.disabled = running;
            button.setAttribute('aria-pressed', String(button.dataset.pomodoroMode === state.mode));
        });
        Object.values(fields).forEach(field => { field.disabled = running; });
        byId('pomodoro-save-settings').disabled = running;
    }

    function prepareSound() {
        if (!state.sound) return;
        try {
            const Audio = window.AudioContext || window.webkitAudioContext;
            if (!Audio) return;
            audioContext ||= new Audio();
            if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
        } catch (_) { /* A sound failure must not stop the timer. */ }
    }

    function playBell() {
        if (!state.sound || audioContext?.state !== 'running') return;
        try {
            [660, 880].forEach((frequency, index) => {
                const oscillator = audioContext.createOscillator();
                const gain = audioContext.createGain();
                const start = audioContext.currentTime + index * 0.22;
                oscillator.frequency.value = frequency;
                gain.gain.setValueAtTime(0, start);
                gain.gain.linearRampToValueAtTime(0.12, start + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);
                oscillator.connect(gain);
                gain.connect(audioContext.destination);
                oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
                oscillator.start(start);
                oscillator.stop(start + 0.32);
            });
        } catch (_) { /* Completion is still shown visually. */ }
    }

    function tick() {
        let finished = false;
        if (state.endsAt !== null && remaining() === 0) {
            const finishedFocus = state.mode === 'focus';
            if (finishedFocus) state.completed++;
            state.mode = finishedFocus ? (state.completed % 4 === 0 ? 'long' : 'short') : 'focus';
            state.endsAt = null;
            state.remaining = duration();
            save();
            const message = finishedFocus
                ? `Hoàn thành một phiên học! ${labels[state.mode]} ${state.minutes[state.mode]} phút đang chờ bạn. Nhấn Bắt đầu khi sẵn sàng.`
                : 'Hết giờ nghỉ. Nhấn Bắt đầu khi bạn sẵn sàng cho phiên học mới.';
            announce(message);
            playBell();
            if (typeof showToastNotification === 'function') showToastNotification(message);
            finished = true;
        }
        render();
        return finished;
    }

    const viewNames = ['video', 'pomodoro', 'study'];
    tabs.forEach((tab, index) => {
        if (!tab) return;
        tab.addEventListener('click', () => switchWorkspace(viewNames[index]));
        tab.addEventListener('keydown', event => {
            if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
            event.preventDefault();
            const validTabs = tabs.filter(Boolean);
            let nextIndex = index;
            if (event.key === 'Home') nextIndex = 0;
            else if (event.key === 'End') nextIndex = validTabs.length - 1;
            else if (event.key === 'ArrowRight') nextIndex = (index + 1) % validTabs.length;
            else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + validTabs.length) % validTabs.length;
            switchWorkspace(viewNames[nextIndex]);
            validTabs[nextIndex].focus();
        });
    });

    byId('pomodoro-toggle').addEventListener('click', () => {
        if (tick()) return;
        if (state.endsAt !== null) {
            state.remaining = remaining();
            state.endsAt = null;
            announce('Đã tạm dừng. Tiếp tục khi bạn sẵn sàng.');
        } else {
            prepareSound();
            state.endsAt = Date.now() + state.remaining;
            announce(state.mode === 'focus' ? 'Đang tập trung. Bạn có thể chuyển sang Video mà không dừng đồng hồ.' : 'Đang nghỉ. Thư giãn một chút nhé!');
        }
        save();
        render();
    });

    byId('pomodoro-reset').addEventListener('click', () => {
        tick();
        state.endsAt = null;
        state.remaining = duration();
        save();
        render();
        announce('Đã đặt lại lượt hiện tại. Nhấn Bắt đầu khi sẵn sàng.');
    });

    modeButtons.forEach(button => button.addEventListener('click', () => {
        if (state.endsAt !== null) return;
        state.mode = button.dataset.pomodoroMode;
        state.remaining = duration();
        save();
        render();
        announce(`${labels[state.mode]} ${state.minutes[state.mode]} phút. Nhấn Bắt đầu khi sẵn sàng.`);
    }));

    byId('pomodoro-settings-form').addEventListener('submit', event => {
        event.preventDefault();
        if (state.endsAt !== null || !event.currentTarget.reportValidity()) return;
        const minutes = Object.fromEntries(modes.map(mode => [mode, Number(fields[mode].value)]));
        if (!Object.values(minutes).every(value => Number.isInteger(value) && value >= 1 && value <= 180)) return;
        state.minutes = minutes;
        state.remaining = duration();
        save();
        render();
        announce('Đã lưu thời gian mới và đặt lại lượt hiện tại.');
    });

    byId('pomodoro-sound').addEventListener('change', event => {
        state.sound = event.target.checked;
        if (state.sound) prepareSound();
        save();
    });

    function syncControls() {
        modes.forEach(mode => { fields[mode].value = state.minutes[mode]; });
        byId('pomodoro-sound').checked = state.sound;
        renderWorkspace();
    }

    window.addEventListener('storage', event => {
        if (event.key !== STORAGE_KEY && event.key !== null) return;
        state = restore(event.newValue);
        syncControls();
        if (!tick()) announce('Đã cập nhật đồng hồ từ tab khác.');
    });
    document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
    window.addEventListener('pageshow', tick);
    syncControls();
    if (!tick() && (state.endsAt !== null || state.remaining < duration())) announce('Đã khôi phục phiên học được lưu trên thiết bị này.');
    setInterval(tick, 1000);
})();
