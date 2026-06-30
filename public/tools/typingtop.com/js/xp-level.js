// XP & Level gamification UI
const XpLevel = (() => {
    function showXpPopup(xpEarned) {
        if (!xpEarned || xpEarned <= 0) return;
        const popup = document.createElement('div');
        popup.className = 'xp-popup';
        popup.textContent = '+' + xpEarned + ' XP';
        document.body.appendChild(popup);
        requestAnimationFrame(() => {
            popup.classList.add('xp-popup--show');
        });
        setTimeout(() => {
            popup.classList.add('xp-popup--hide');
            setTimeout(() => popup.remove(), 500);
        }, 2000);
    }

    function showLevelUpModal(newLevel) {
        const modal = document.getElementById('levelUpModal');
        if (!modal) return;
        const levelEl = modal.querySelector('.level-up-modal__level');
        if (levelEl) levelEl.textContent = newLevel;
        if (window.bootstrap && window.bootstrap.Modal) {
            bootstrap.Modal.getOrCreateInstance(modal).show();
        } else {
            modal.style.display = 'flex';
        }
    }

    function updateStreakDisplay(streakCount) {
        const el = document.getElementById('navbar-streak');
        if (el) el.textContent = streakCount;
    }

    function showStreakResetNotification() {
        const toast = document.createElement('div');
        toast.className = 'xp-popup xp-popup--danger';
        var msg = (document.getElementById('streak-reset-msg') || {}).textContent || 'Streak đã bị gián đoạn';
        toast.textContent = msg;
        document.body.appendChild(toast);
        requestAnimationFrame(() => {
            toast.classList.add('xp-popup--show');
        });
        setTimeout(() => {
            toast.classList.add('xp-popup--hide');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    function handleGamificationResponse(gamif) {
        if (!gamif) return;
        if (gamif.xp_earned > 0) showXpPopup(gamif.xp_earned);
        if (gamif.leveled_up) showLevelUpModal(gamif.level);
        if (gamif.streak_count != null) updateStreakDisplay(gamif.streak_count);
        if (gamif.streak_reset) showStreakResetNotification();
    }

    return {
        handleGamificationResponse
    };
})();