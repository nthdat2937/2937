// ThiChungChi/wwwroot/js/certificate-card.js
const CertificateCard = (() => {
    const LEVEL_COLORS = {
        low: ['#43b89c', '#2d8c6e'],
        mid: ['#8b5cf6', '#6d28d9'],
        high: ['#f59e0b', '#d97706'],
        top: ['#ef4444', '#b91c1c']
    };

    function getLevelColors(wpm) {
        if (wpm < 40) return LEVEL_COLORS.low;
        if (wpm < 70) return LEVEL_COLORS.mid;
        if (wpm < 100) return LEVEL_COLORS.high;
        return LEVEL_COLORS.top;
    }

    async function drawCanvas({
        wpm,
        accuracy,
        duration,
        lang,
        username
    }) {
        // Ensure Roboto font is loaded before drawing
        try {
            await document.fonts.load('bold 80px Roboto');
        } catch (e) {}

        const canvas = document.createElement('canvas');
        canvas.width = 900;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');
        const colors = getLevelColors(wpm);

        // Background gradient
        const grad = ctx.createLinearGradient(0, 0, 900, 600);
        grad.addColorStop(0, colors[0]);
        grad.addColorStop(1, colors[1]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 900, 600);

        // Dark overlay for contrast
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.fillRect(0, 0, 900, 600);

        // Header: TypingTop (left)
        ctx.font = 'bold 28px Roboto, "Courier New", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.fillText('TypingTop', 50, 60);

        // Language name (right)
        ctx.textAlign = 'right';
        ctx.font = '22px Roboto, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.fillText(lang || 'English', 850, 60);

        // Title
        ctx.textAlign = 'center';
        ctx.font = 'bold 26px Roboto, "Courier New", sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.fillText('TYPING SPEED CERTIFICATE', 450, 130);

        // Horizontal rule
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(80, 155);
        ctx.lineTo(820, 155);
        ctx.stroke();

        // WPM (large)
        ctx.font = 'bold 80px Roboto, "Courier New", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('\u2605 ' + Math.round(wpm) + ' WPM \u2605', 450, 270);

        // Stats
        ctx.font = '26px Roboto, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.fillText('Accuracy: ' + (accuracy || 0).toFixed(1) + '%', 450, 345);

        if (duration) {
            ctx.fillText('Duration: ' + duration + ' seconds', 450, 390);
        }

        ctx.fillText('Language: ' + (lang || 'English'), 450, 435);

        // Horizontal rule
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(80, 460);
        ctx.lineTo(820, 460);
        ctx.stroke();

        // Username + Date
        const dateStr = new Date().toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        const nameDisplay = (username && username.trim()) ? username.trim() : 'Anonymous';
        ctx.font = '22px Roboto, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.fillText(nameDisplay + '  \u2022  ' + dateStr, 450, 510);

        // Footer
        ctx.textAlign = 'right';
        ctx.font = '18px Roboto, "Courier New", sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.fillText('typingtop.com', 850, 575);

        return canvas;
    }

    async function download(params) {
        try {
            const canvas = await drawCanvas(params);
            canvas.toBlob(blob => {
                if (!blob) {
                    alert('Cannot generate certificate. Please try again.');
                    return;
                }
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'typingtop-certificate.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 'image/png');
        } catch (e) {
            console.error('Certificate download failed:', e);
            alert('Cannot generate certificate. Please try again.');
        }
    }

    async function share(params) {
        const {
            baseUrl,
            ...drawParams
        } = params;
        try {
            const canvas = await drawCanvas(drawParams);
            const blob = await new Promise((resolve, reject) => {
                canvas.toBlob(b => b ? resolve(b) : reject(new Error('toBlob failed')), 'image/png');
            });
            const formData = new FormData();
            formData.append('image', blob, 'certificate.png');
            const res = await fetch('/api/share/upload-image', {
                method: 'POST',
                body: formData
            });
            if (!res.ok) throw new Error('Upload failed: ' + res.status);
            const data = await res.json();
            const base = baseUrl || location.origin;
            const shareUrl = base + '/share/' + data.share_id;
            const fbUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(shareUrl);
            window.open(fbUrl, '_blank', 'width=600,height=400');
        } catch (e) {
            console.error('Certificate share failed:', e);
            alert('Cannot share. Please try again.');
        }
    }

    return {
        download,
        share
    };
})();