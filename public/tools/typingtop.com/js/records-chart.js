// Personal Records Chart using ApexCharts
const RecordsChart = (() => {
    function init(containerId, isLoggedIn) {
        if (!isLoggedIn) return;
        const el = document.getElementById(containerId);
        if (!el) return;

        fetch('/api/account/records?days=7')
            .then(r => r.json())
            .then(data => {
                if (!data || data.length === 0) {
                    el.innerHTML = '<p class="text-muted text-center py-3">Chưa có dữ liệu</p>';
                    return;
                }
                const categories = data.map(d => d.date);
                const wpmData = data.map(d => d.maxWpm);
                const accData = data.map(d => d.avgAccuracy);

                const options = {
                    series: [{
                            name: 'WPM cao nhất',
                            data: wpmData,
                            type: 'line'
                        },
                        {
                            name: 'Accuracy TB (%)',
                            data: accData,
                            type: 'line'
                        }
                    ],
                    chart: {
                        height: 250,
                        type: 'line',
                        toolbar: {
                            show: false
                        }
                    },
                    xaxis: {
                        categories
                    },
                    yaxis: [{
                            title: {
                                text: 'WPM'
                            },
                            min: 0
                        },
                        {
                            opposite: true,
                            title: {
                                text: 'Accuracy (%)'
                            },
                            min: 0,
                            max: 100
                        }
                    ],
                    tooltip: {
                        shared: true,
                        intersect: false
                    },
                    stroke: {
                        curve: 'smooth',
                        width: 2
                    },
                    colors: ['#f0a500', '#4285f4'],
                    legend: {
                        position: 'top'
                    }
                };
                new ApexCharts(el, options).render();
            })
            .catch(() => {
                el.innerHTML = '<p class="text-muted text-center py-3">Không thể tải dữ liệu</p>';
            });
    }

    function initMiniSparkline(containerId) {
        const el = document.getElementById(containerId);
        if (!el) return;

        fetch('/api/account/records?days=7')
            .then(r => r.json())
            .then(data => {
                if (!data || data.length === 0) {
                    el.style.display = 'none';
                    return;
                }
                const wpmData = data.map(d => d.maxWpm);
                const best = Math.max(...wpmData);
                const today = wpmData[wpmData.length - 1] || 0;
                const prev = wpmData.length > 1 ? wpmData[wpmData.length - 2] : 0;
                const arrow = today >= prev ? '↑' : '↓';

                const options = {
                    series: [{
                        data: wpmData
                    }],
                    chart: {
                        type: 'line',
                        height: 60,
                        sparkline: {
                            enabled: true
                        }
                    },
                    stroke: {
                        curve: 'smooth',
                        width: 2
                    },
                    colors: ['#f0a500'],
                    tooltip: {
                        fixed: {
                            enabled: false
                        }
                    }
                };
                const sparklineEl = el.querySelector('.sparkline');
                if (!sparklineEl) return;
                new ApexCharts(sparklineEl, options).render();
                const infoEl = el.querySelector('.sparkline-info');
                if (infoEl) infoEl.textContent = `Best: ${best} WPM | Hôm nay: ${today} WPM ${arrow}`;
            })
            .catch(() => {}); // silent fail for mini widget
    }

    return {
        init,
        initMiniSparkline
    };
})();