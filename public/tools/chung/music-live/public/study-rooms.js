(() => {
    'use strict';

    // ============================================================
    // GOOGLE MEET STUDY ROOMS CLIENT CONTROLLER (Fixed WebRTC & Screen Sharing)
    // ============================================================

    const byId = id => document.getElementById(id);

    // --- State Variables ---
    let currentStudyState = {
        rooms: [],
        userCounts: {},
        totalLearners: 0,
        activeUsers: [],
        recentVibes: []
    };

    let activeRoomId = localStorage.getItem('musiclive_active_study_room') || 'room_general';
    let myStudyStatus = localStorage.getItem('musiclive_my_study_status') || 'Đang tập trung 🔥';
    let myStudyGoal = localStorage.getItem('musiclive_my_study_goal') || '';

    // Meeting Session Timer
    let meetingSeconds = 0;
    let meetingTimerInterval = null;

    // Local Media State
    // localCamStream: audio (mic) + video (webcam)
    let localCamStream = null;
    // localScreenStream: video (screen share)
    let localScreenStream = null;

    let micEnabled = false;
    let camEnabled = false;
    let handRaised = false;
    let isScreenSharing = false;
    let isSpeaking = false;

    // Web Audio VAD (Voice Activity Detection)
    let audioContext = null;
    let audioAnalyser = null;
    let audioSource = null;
    let vadInterval = null;

    // WebRTC Peer Connections (Mesh architecture)
    // Map: socketId -> {
    //    pc: RTCPeerConnection,
    //    camStream: MediaStream,
    //    screenStream: MediaStream,
    //    pendingCandidates: Array,
    //    senders: Map(kind -> RTCRtpSender),
    //    isMakingOffer: boolean
    // }
    const peerConnections = new Map();

    // Map: socketId -> mediaState { mic, cam, hand, screen, speaking }
    const remoteMediaStates = new Map();

    // Spotlight / Pinned Target: { type: 'screen'|'cam', socketId: string } | null
    let pinnedTarget = null;

    // WebRTC Configuration with Public STUN Servers
    const rtcConfig = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:stun3.l.google.com:19302' },
            { urls: 'stun:stun4.l.google.com:19302' }
        ]
    };

    function getSocket() {
        return (typeof socket !== 'undefined' && socket && socket.connected) ? socket : null;
    }

    function formatTime(totalSeconds) {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    // ============================================================
    // ROOM JOINING & STATE MANAGEMENT
    // ============================================================

    function joinStudyRoom(roomId) {
        if (!roomId) roomId = 'room_general';
        const prevRoom = activeRoomId;
        activeRoomId = roomId;
        try {
            localStorage.setItem('musiclive_active_study_room', activeRoomId);
        } catch (_) {}

        // If changed room, close peers from previous room
        if (prevRoom !== activeRoomId) {
            closeAllPeers();
        }

        const s = getSocket();
        if (s) {
            s.emit('study:joinRoom', {
                roomId: activeRoomId,
                status: myStudyStatus,
                goal: myStudyGoal
            }, (res) => {
                if (res && res.success && res.state) {
                    currentStudyState = res.state;
                    renderMeetUI();
                    initiateWebRtcPeers();
                }
            });
        }

        startMeetingTimer();
        renderMeetUI();
    }
    window.joinStudyRoom = joinStudyRoom;

    window.onEnterStudyWorkspace = function() {
        joinStudyRoom(activeRoomId);
        const goalInput = byId('study-my-goal-input');
        if (goalInput && myStudyGoal) {
            goalInput.value = myStudyGoal;
        }
        updateStatusPillHighlight();
    };

    function startMeetingTimer() {
        if (meetingTimerInterval) return;
        meetingTimerInterval = setInterval(() => {
            meetingSeconds++;
            const clockEl = byId('meet-session-clock');
            if (clockEl) clockEl.textContent = formatTime(meetingSeconds);
        }, 1000);
    }

    function resetMeetingTimer() {
        clearInterval(meetingTimerInterval);
        meetingTimerInterval = null;
        meetingSeconds = 0;
        const clockEl = byId('meet-session-clock');
        if (clockEl) clockEl.textContent = '00:00:00';
    }

    function updateStudyRoomsData(state) {
        if (!state) return;
        currentStudyState = state;

        if (state.rooms && state.rooms.length > 0 && !state.rooms.some(r => r.id === activeRoomId)) {
            activeRoomId = state.rooms[0].id;
            try { localStorage.setItem('musiclive_active_study_room', activeRoomId); } catch (_) {}
        }

        renderMeetUI();
    }

    // ============================================================
    // UI RENDERING (GOOGLE MEET STAGE, GRID & SIDEBAR)
    // ============================================================

    function renderMeetUI() {
        renderTopBar();
        renderVideoGrid();
        renderSidePanel();
        updateAdminControls();
        updateTabBadge();

        if (window.LiquidGlass && typeof window.LiquidGlass.refresh === 'function') {
            window.LiquidGlass.refresh();
        }
    }

    function renderTopBar() {
        const rooms = currentStudyState.rooms || [];
        const activeRoom = rooms.find(r => r.id === activeRoomId) || rooms[0] || {
            name: 'Phòng học chung',
            icon: '📚',
            id: 'room_general'
        };

        const iconEl = byId('meet-active-room-icon');
        if (iconEl) iconEl.textContent = activeRoom.icon || '📚';

        const nameEl = byId('meet-active-room-name');
        if (nameEl) nameEl.textContent = activeRoom.name;

        const codeEl = byId('meet-room-code-text');
        if (codeEl) codeEl.textContent = activeRoom.id;

        const toolbarRoomText = byId('meet-toolbar-room-text');
        if (toolbarRoomText) toolbarRoomText.textContent = `${activeRoom.icon || '📚'} ${activeRoom.name}`;

        const buddies = (currentStudyState.activeUsers || []).filter(u => u.roomId === activeRoomId);
        const countBadge = byId('meet-people-count-badge');
        if (countBadge) countBadge.textContent = buddies.length;

        // Render Room Dropdown
        const dropdownList = byId('meet-dropdown-rooms-list');
        if (dropdownList) {
            const userCounts = currentStudyState.userCounts || {};
            const isAdmin = (typeof myRole !== 'undefined' && myRole === 'admin');

            let html = '';
            rooms.forEach(room => {
                const isActive = (room.id === activeRoomId);
                const count = userCounts[room.id] || 0;
                const canDelete = isAdmin && !room.isDefault;

                html += `
                    <div class="meet-dropdown-item ${isActive ? 'active' : ''}" onclick="selectMeetRoom('${room.id}')">
                        <div class="meet-dropdown-item-left">
                            <span>${room.icon || '📚'}</span>
                            <span class="meet-dropdown-item-name">${escapeHtml(room.name)}</span>
                        </div>
                        <div style="display:flex; align-items:center; gap:6px;">
                            <span class="meet-dropdown-badge">${count}</span>
                            ${canDelete ? `
                                <button type="button" class="study-room-delete-btn" onclick="event.stopPropagation(); deleteStudyRoom('${room.id}', '${escapeHtml(room.name)}')" title="Xóa phòng học">
                                    <span class="material-symbols-outlined">delete</span>
                                </button>
                            ` : ''}
                        </div>
                    </div>
                `;
            });
            dropdownList.innerHTML = html;
        }
    }

    function renderVideoGrid() {
        const grid = byId('meet-video-grid');
        if (!grid) return;

        const allUsers = currentStudyState.activeUsers || [];
        const buddies = allUsers.filter(u => u.roomId === activeRoomId);
        const myId = getSocket() ? getSocket().id : 'local';

        // Set responsive grid class based on member count
        const totalCount = Math.max(1, buddies.length);
        grid.className = 'meet-grid';
        if (totalCount === 1) grid.classList.add('grid-1');
        else if (totalCount === 2) grid.classList.add('grid-2');
        else if (totalCount <= 4) grid.classList.add('grid-4');
        else grid.classList.add('grid-multi');

        // Check if spotlight is active
        const stage = byId('meet-stage');
        const spotlightContainer = byId('meet-spotlight-container');
        if (stage && spotlightContainer) {
            if (pinnedTarget) {
                stage.classList.add('is-spotlight');
                spotlightContainer.classList.remove('hidden');
                renderSpotlightView();
            } else {
                stage.classList.remove('is-spotlight');
                spotlightContainer.classList.add('hidden');
            }
        }

        // Render tiles
        let html = '';
        buddies.forEach(user => {
            const isMe = (user.socketId === myId);
            const mediaState = isMe ? {
                mic: micEnabled,
                cam: camEnabled,
                hand: handRaised,
                screen: isScreenSharing,
                speaking: isSpeaking
            } : (remoteMediaStates.get(user.socketId) || user.mediaState || { mic: false, cam: false, hand: false, screen: false, speaking: false });

            const avatarInitial = (user.username || 'B').trim().charAt(0).toUpperCase();
            const isAdmin = (user.role === 'admin' || (user.username && user.username.includes('😎')));
            const cleanName = escapeHtml((user.username || 'Bạn học').replace(/😎/g, '').trim());

            html += `
                <div class="meet-tile ${isMe ? 'is-local' : ''} ${mediaState.speaking ? 'is-speaking' : ''} ${mediaState.hand ? 'is-hand-raised' : ''}" 
                     id="meet-tile-${user.socketId}" data-socket-id="${user.socketId}">
                    
                    <!-- Video Element (Hidden when cam is off) -->
                    <video class="meet-video ${mediaState.cam ? '' : 'hidden'}" 
                           id="meet-video-${user.socketId}" 
                           autoplay playsinline ${isMe ? 'muted' : ''}></video>

                    <!-- Avatar Box when camera is off -->
                    <div class="meet-avatar-wrap ${mediaState.cam ? 'hidden' : ''}" id="meet-avatar-${user.socketId}">
                        <div class="meet-avatar-circle" style="background-color: ${user.nameColor || '#ff75a0'};">
                            ${user.avatarUrl ? `<img class="meet-avatar-circle-img" referrerpolicy="no-referrer" src="${escapeHtml(user.avatarUrl)}" alt="${avatarInitial}" onerror="if(!this.dataset.p && !this.src.startsWith('/') && !this.src.startsWith('data:')){this.dataset.p='1'; this.src='/api/avatar-proxy?url=' + encodeURIComponent('${escapeHtml(user.avatarUrl)}');}else{this.style.display='none'; this.nextElementSibling.style.display='block';}"><span class="meet-avatar-initial" style="display:none;">${avatarInitial}</span>` : `<span class="meet-avatar-initial">${avatarInitial}</span>`}
                        </div>
                    </div>

                    <!-- Hand Raised Indicator -->
                    ${mediaState.hand ? `
                        <div class="meet-tile-hand" title="${cleanName} đang giơ tay">
                            <span class="material-symbols-outlined">front_hand</span>
                        </div>
                    ` : ''}

                    <!-- Mic Status Corner -->
                    <div class="meet-tile-mic-status ${mediaState.mic ? '' : 'is-muted'}" title="${mediaState.mic ? 'Micro đang mở' : 'Đã tắt micro'}">
                        <span class="material-symbols-outlined">${mediaState.mic ? 'mic' : 'mic_off'}</span>
                    </div>

                    <!-- Name Tag Bottom-Left -->
                    <div class="meet-tile-nametag">
                        <span class="meet-tile-name" style="color: ${user.nameColor || '#fff'};">${cleanName}</span>
                        ${isAdmin ? '<span class="meet-tile-admin-badge">Admin</span>' : ''}
                        ${isMe ? '<span class="meet-tile-you-badge">(Bạn)</span>' : ''}
                    </div>

                    <!-- Hover Actions (Pin) -->
                    <div class="meet-tile-actions">
                        <button type="button" class="meet-tile-action-btn" onclick="pinMeetTile('${user.socketId}', false)" title="Ghim video lên màn hình chính">
                            <span class="material-symbols-outlined">keep</span>
                        </button>
                    </div>
                </div>
            `;
        });

        if (buddies.length === 0) {
            html = `
                <div class="meet-empty-notice">
                    <span class="material-symbols-outlined meet-empty-icon">self_improvement</span>
                    <p style="margin: 0; font-size: 15px; color: #e8eaed; font-weight: 600;">Bạn là người đầu tiên vào phòng học này!</p>
                    <span style="font-size: 12px; color: #9aa0a6;">Bật camera hoặc mic để bắt đầu phiên học tập trung cùng âm nhạc.</span>
                </div>
            `;
        }

        grid.innerHTML = html;

        // Re-attach video streams after re-render
        attachVideoStreams(buddies, myId);
    }

    function attachVideoStreams(buddies, myId) {
        // Local stream
        if (localCamStream && camEnabled) {
            const localVid = byId(`meet-video-${myId}`);
            if (localVid && localVid.srcObject !== localCamStream) {
                localVid.srcObject = localCamStream;
                localVid.play().catch(e => console.log('Local cam play deferred:', e));
            }
        }

        // Remote streams
        buddies.forEach(user => {
            if (user.socketId !== myId) {
                const peerData = peerConnections.get(user.socketId);
                if (peerData && peerData.camStream && peerData.camStream.getVideoTracks().length > 0) {
                    const remoteVid = byId(`meet-video-${user.socketId}`);
                    if (remoteVid && remoteVid.srcObject !== peerData.camStream) {
                        remoteVid.srcObject = peerData.camStream;
                        remoteVid.play().catch(e => console.log('Remote cam play deferred:', e));
                    }
                }
            }
        });

        if (pinnedTarget) {
            renderSpotlightView();
        }
    }

    function renderSpotlightView() {
        const spotlightMedia = byId('meet-spotlight-media');
        const spotlightName = byId('meet-spotlight-name');
        if (!spotlightMedia || !pinnedTarget) return;

        const myId = getSocket() ? getSocket().id : 'local';
        let streamToPlay = null;
        let displayName = 'Màn hình chia sẻ';

        if (pinnedTarget.socketId === myId) {
            if (pinnedTarget.type === 'screen') {
                streamToPlay = localScreenStream;
                displayName = 'Màn hình của bạn (Đang chia sẻ)';
            } else {
                streamToPlay = localCamStream;
                displayName = 'Camera của bạn (Đã ghim)';
            }
        } else {
            const peerData = peerConnections.get(pinnedTarget.socketId);
            const allUsers = currentStudyState.activeUsers || [];
            const targetUser = allUsers.find(u => u.socketId === pinnedTarget.socketId);
            const uName = targetUser ? escapeHtml(targetUser.username).replace(/😎/g, '').trim() : 'Bạn học';

            if (pinnedTarget.type === 'screen') {
                streamToPlay = peerData ? peerData.screenStream : null;
                displayName = `Màn hình của ${uName}`;
            } else {
                streamToPlay = peerData ? peerData.camStream : null;
                displayName = `${uName} (Đã ghim)`;
            }
        }

        if (spotlightName) spotlightName.textContent = displayName;

        let vid = spotlightMedia.querySelector('video');
        if (!vid) {
            vid = document.createElement('video');
            vid.autoplay = true;
            vid.playsInline = true;
            spotlightMedia.innerHTML = '';
            spotlightMedia.appendChild(vid);
        }

        if (pinnedTarget.socketId === myId) {
            vid.muted = true;
        } else {
            vid.muted = false;
        }

        if (streamToPlay && vid.srcObject !== streamToPlay) {
            vid.srcObject = streamToPlay;
        }
        if (vid.srcObject) {
            vid.play().catch(e => console.log('Spotlight play deferred:', e));
        }
    }

    function renderSidePanel() {
        const allUsers = currentStudyState.activeUsers || [];
        const buddies = allUsers.filter(u => u.roomId === activeRoomId);
        const myId = getSocket() ? getSocket().id : 'local';

        // People tab
        const sideCount = byId('meet-side-people-count');
        if (sideCount) sideCount.textContent = buddies.length;

        const peopleList = byId('meet-people-list');
        if (peopleList) {
            let html = '';
            buddies.forEach(user => {
                const isMe = (user.socketId === myId);
                const mediaState = isMe ? {
                    mic: micEnabled,
                    cam: camEnabled,
                    hand: handRaised,
                    screen: isScreenSharing
                } : (remoteMediaStates.get(user.socketId) || user.mediaState || { mic: false, cam: false, hand: false, screen: false });

                const avatarInitial = (user.username || 'B').trim().charAt(0).toUpperCase();
                const cleanName = escapeHtml((user.username || 'Bạn học').replace(/😎/g, '').trim());

                html += `
                    <div class="meet-person-row">
                        <div class="meet-person-left">
                            <div class="meet-person-avatar" style="background-color: ${user.nameColor || '#ff75a0'};">
                                ${user.avatarUrl ? `<img class="meet-person-avatar-img" referrerpolicy="no-referrer" src="${escapeHtml(user.avatarUrl)}" alt="${avatarInitial}" onerror="if(!this.dataset.p && !this.src.startsWith('/') && !this.src.startsWith('data:')){this.dataset.p='1'; this.src='/api/avatar-proxy?url=' + encodeURIComponent('${escapeHtml(user.avatarUrl)}');}else{this.style.display='none'; this.nextElementSibling.style.display='block';}"><span class="meet-avatar-initial" style="display:none;">${avatarInitial}</span>` : `<span class="meet-avatar-initial">${avatarInitial}</span>`}
                            </div>
                            <div class="meet-person-meta">
                                <span class="meet-person-name">
                                    ${cleanName} ${isMe ? '<strong style="color:var(--accent); font-size:11px;">(Bạn)</strong>' : ''}
                                </span>
                                <span class="meet-person-status">${escapeHtml(user.status || 'Đang tập trung 🔥')}</span>
                            </div>
                        </div>
                        <div class="meet-person-badges">
                            ${mediaState.screen ? '<span class="material-symbols-outlined" style="color:#8ab4f8; font-size:18px;" title="Đang chia sẻ màn hình">present_to_all</span>' : ''}
                            ${mediaState.hand ? '<span class="material-symbols-outlined" style="color:#fbbc04; font-size:18px;" title="Đang giơ tay">front_hand</span>' : ''}
                            <span class="material-symbols-outlined meet-person-mic-icon ${mediaState.mic ? '' : 'muted'}" style="font-size:18px;">
                                ${mediaState.mic ? 'mic' : 'mic_off'}
                            </span>
                        </div>
                    </div>
                `;
            });
            peopleList.innerHTML = html;
        }

        // Details tab
        const rooms = currentStudyState.rooms || [];
        const activeRoom = rooms.find(r => r.id === activeRoomId) || rooms[0] || {};
        const detIcon = byId('meet-details-icon');
        if (detIcon) detIcon.textContent = activeRoom.icon || '📚';
        const detName = byId('meet-details-name');
        if (detName) detName.textContent = activeRoom.name || 'Phòng học chung';
        const detTopic = byId('meet-details-topic');
        if (detTopic) detTopic.textContent = activeRoom.topic || 'Tập trung';
        const detDesc = byId('meet-details-desc');
        if (detDesc) detDesc.textContent = activeRoom.desc || 'Học tập cùng nhau mỗi ngày.';
    }

    function updateTabBadge() {
        const badge = byId('study-tab-badge');
        if (!badge) return;
        const count = currentStudyState.totalLearners || 0;
        if (count > 0) {
            badge.textContent = count > 99 ? '99+' : count;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }

    function updateAdminControls() {
        const isAdmin = (typeof myRole !== 'undefined' && myRole === 'admin');
        const adminBtn = byId('btn-admin-add-study-room');
        if (adminBtn) {
            adminBtn.classList.toggle('hidden', !isAdmin);
        }
    }

    // ============================================================
    // MEDIA HARDWARE CONTROLS (MIC, CAM, SCREEN SHARE, VAD)
    // ============================================================

    // --- Microphone Toggle & Voice Activity Detection ---
    window.toggleMeetMic = async function() {
        try {
            if (!micEnabled) {
                // Request audio only if not already having audio track
                if (!localCamStream || localCamStream.getAudioTracks().length === 0) {
                    const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
                    const audioTrack = audioStream.getAudioTracks()[0];
                    if (!localCamStream) localCamStream = new MediaStream();
                    localCamStream.addTrack(audioTrack);

                    audioTrack.onended = () => {
                        if (micEnabled) toggleMeetMic();
                    };

                    // Add or replace track to all peer connections
                    for (const [peerId, peerData] of peerConnections.entries()) {
                        try {
                            const existingSender = peerData.senders.get('audio');
                            if (existingSender) {
                                await existingSender.replaceTrack(audioTrack);
                            } else {
                                const sender = peerData.pc.addTrack(audioTrack, localCamStream);
                                peerData.senders.set('audio', sender);
                                await renegotiateWithPeer(peerId);
                            }
                        } catch (pe) {
                            console.warn('Error adding audio track to peer', peerId, pe);
                        }
                    }
                } else {
                    localCamStream.getAudioTracks().forEach(t => { t.enabled = true; });
                }

                micEnabled = true;
                setupAudioAnalysis();
            } else {
                micEnabled = false;
                if (localCamStream) {
                    localCamStream.getAudioTracks().forEach(t => { t.enabled = false; });
                }
                stopAudioAnalysis();
                isSpeaking = false;
            }

            updateToolbarButtons();
            broadcastMediaState();
            renderMeetUI();

            if (typeof showToastNotification === 'function') {
                showToastNotification(micEnabled ? '🎤 Đã bật micro' : '🔇 Đã tắt micro');
            }
        } catch (err) {
            console.warn('Cannot access microphone:', err);
            micEnabled = false;
            updateToolbarButtons();
            if (typeof showToastNotification === 'function') {
                showToastNotification('⚠️ Không thể truy cập micro. Vui lòng cấp quyền trong trình duyệt.');
            }
        }
    };

    function setupAudioAnalysis() {
        try {
            if (!localCamStream) return;
            const audioTrack = localCamStream.getAudioTracks()[0];
            if (!audioTrack) return;

            if (!audioContext) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (!AudioCtx) return;
                audioContext = new AudioCtx();
            }

            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }

            audioAnalyser = audioContext.createAnalyser();
            audioAnalyser.fftSize = 512;
            audioSource = audioContext.createMediaStreamSource(new MediaStream([audioTrack]));
            audioSource.connect(audioAnalyser);

            const buffer = new Uint8Array(audioAnalyser.frequencyBinCount);

            clearInterval(vadInterval);
            vadInterval = setInterval(() => {
                if (!micEnabled) {
                    if (isSpeaking) {
                        isSpeaking = false;
                        broadcastMediaState();
                    }
                    return;
                }

                audioAnalyser.getByteFrequencyData(buffer);
                let sum = 0;
                for (let i = 0; i < buffer.length; i++) {
                    sum += buffer[i];
                }
                const average = sum / buffer.length;

                // Threshold for speech detection
                const speakingNow = average > 18;
                if (speakingNow !== isSpeaking) {
                    isSpeaking = speakingNow;
                    // Visual highlight on local tile
                    const myId = getSocket() ? getSocket().id : 'local';
                    const localTile = byId(`meet-tile-${myId}`);
                    if (localTile) {
                        localTile.classList.toggle('is-speaking', isSpeaking);
                    }
                    broadcastMediaState();
                }
            }, 250);
        } catch (e) {
            console.warn('VAD setup failed:', e);
        }
    }

    function stopAudioAnalysis() {
        clearInterval(vadInterval);
        vadInterval = null;
        if (audioSource) {
            try { audioSource.disconnect(); } catch (_) {}
            audioSource = null;
        }
    }

    // --- Camera Toggle ---
    window.toggleMeetCam = async function() {
        try {
            if (!camEnabled) {
                // Request video stream
                const videoStream = await navigator.mediaDevices.getUserMedia({
                    video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
                    audio: false
                });
                const videoTrack = videoStream.getVideoTracks()[0];

                if (!localCamStream) {
                    localCamStream = new MediaStream();
                }

                // Stop and remove any stale video tracks
                localCamStream.getVideoTracks().forEach(t => {
                    t.stop();
                    localCamStream.removeTrack(t);
                });
                localCamStream.addTrack(videoTrack);

                videoTrack.onended = () => {
                    if (camEnabled) toggleMeetCam();
                };

                camEnabled = true;

                // Send video track to all peer connections
                for (const [peerId, peerData] of peerConnections.entries()) {
                    try {
                        const existingSender = peerData.senders.get('cam');
                        if (existingSender) {
                            await existingSender.replaceTrack(videoTrack);
                        } else {
                            const sender = peerData.pc.addTrack(videoTrack, localCamStream);
                            peerData.senders.set('cam', sender);
                            await renegotiateWithPeer(peerId);
                        }
                    } catch (pe) {
                        console.warn('Error adding cam track to peer', peerId, pe);
                    }
                }
            } else {
                // Turn off video
                if (localCamStream) {
                    localCamStream.getVideoTracks().forEach(t => {
                        t.stop();
                        localCamStream.removeTrack(t);
                    });
                }
                camEnabled = false;

                // Replace track with null so remote stops receiving video without breaking connection
                for (const [peerId, peerData] of peerConnections.entries()) {
                    try {
                        const existingSender = peerData.senders.get('cam');
                        if (existingSender) {
                            await existingSender.replaceTrack(null);
                        }
                    } catch (pe) {
                        console.warn('Error replacing cam track null for peer', peerId, pe);
                    }
                }
            }

            updateToolbarButtons();
            broadcastMediaState();
            renderMeetUI();

            if (typeof showToastNotification === 'function') {
                showToastNotification(camEnabled ? '📹 Đã bật camera' : '📷 Đã tắt camera');
            }
        } catch (err) {
            console.warn('Cannot access camera:', err);
            camEnabled = false;
            updateToolbarButtons();
            if (typeof showToastNotification === 'function') {
                showToastNotification('⚠️ Không thể truy cập camera. Vui lòng kiểm tra quyền thiết bị.');
            }
        }
    };

    // --- Raise Hand Toggle ---
    window.toggleMeetHand = function() {
        handRaised = !handRaised;
        updateToolbarButtons();
        broadcastMediaState();
        renderMeetUI();

        if (typeof showToastNotification === 'function') {
            showToastNotification(handRaised ? '✋ Bạn đã giơ tay phát biểu' : '✋ Đã hạ tay');
        }
    };

    // --- Screen Sharing Toggle ---
    window.toggleMeetScreenShare = async function() {
        try {
            if (!isScreenSharing) {
                // Request screen display stream
                localScreenStream = await navigator.mediaDevices.getDisplayMedia({
                    video: { cursor: 'always' },
                    audio: false
                });

                const screenTrack = localScreenStream.getVideoTracks()[0];
                screenTrack.onended = () => {
                    stopScreenSharing();
                };

                isScreenSharing = true;

                // Send screen track to all peer connections
                for (const [peerId, peerData] of peerConnections.entries()) {
                    try {
                        const existingSender = peerData.senders.get('screen');
                        if (existingSender) {
                            await existingSender.replaceTrack(screenTrack);
                        } else {
                            const sender = peerData.pc.addTrack(screenTrack, localScreenStream);
                            peerData.senders.set('screen', sender);
                            await renegotiateWithPeer(peerId);
                        }
                    } catch (pe) {
                        console.warn('Error adding screen track to peer', peerId, pe);
                    }
                }

                // Spotlight local screen on user's own stage
                const myId = getSocket() ? getSocket().id : 'local';
                pinMeetTile(myId, true);

                if (typeof showToastNotification === 'function') {
                    showToastNotification('🖥️ Đang chia sẻ màn hình của bạn');
                }
            } else {
                stopScreenSharing();
            }

            updateToolbarButtons();
            broadcastMediaState();
            renderMeetUI();
        } catch (err) {
            console.warn('Screen share canceled or denied:', err);
            isScreenSharing = false;
            updateToolbarButtons();
        }
    };

    function stopScreenSharing() {
        if (localScreenStream) {
            localScreenStream.getTracks().forEach(t => t.stop());
            localScreenStream = null;
        }
        isScreenSharing = false;

        // Remove screen track from peers
        for (const [peerId, peerData] of peerConnections.entries()) {
            try {
                const existingSender = peerData.senders.get('screen');
                if (existingSender) {
                    peerData.pc.removeTrack(existingSender);
                    peerData.senders.delete('screen');
                    renegotiateWithPeer(peerId);
                }
            } catch (pe) {
                console.warn('Error removing screen sender', peerId, pe);
            }
        }

        if (pinnedTarget && pinnedTarget.type === 'screen') {
            unpinMeetTile();
        }

        updateToolbarButtons();
        broadcastMediaState();
        renderMeetUI();
        if (typeof showToastNotification === 'function') {
            showToastNotification('🛑 Đã dừng chia sẻ màn hình');
        }
    }

    // --- Update Toolbar Buttons Styling ---
    function updateToolbarButtons() {
        const btnMic = byId('meet-btn-mic');
        const iconMic = byId('meet-icon-mic');
        if (btnMic && iconMic) {
            btnMic.classList.toggle('is-off', !micEnabled);
            iconMic.textContent = micEnabled ? 'mic' : 'mic_off';
        }

        const btnCam = byId('meet-btn-cam');
        const iconCam = byId('meet-icon-cam');
        if (btnCam && iconCam) {
            btnCam.classList.toggle('is-off', !camEnabled);
            iconCam.textContent = camEnabled ? 'videocam' : 'videocam_off';
        }

        const btnHand = byId('meet-btn-hand');
        if (btnHand) {
            btnHand.classList.toggle('is-active', handRaised);
        }

        const btnScreen = byId('meet-btn-screen');
        if (btnScreen) {
            btnScreen.classList.toggle('is-active', isScreenSharing);
        }
    }

    function broadcastMediaState() {
        const s = getSocket();
        if (!s) return;
        s.emit('study:mediaState', {
            mic: micEnabled,
            cam: camEnabled,
            hand: handRaised,
            screen: isScreenSharing,
            speaking: isSpeaking
        });
    }

    // ============================================================
    // WEBRTC PEER CONNECTION MESH & PERFECT NEGOTIATION
    // ============================================================

    function initiateWebRtcPeers() {
        const s = getSocket();
        if (!s) return;
        const myId = s.id;
        const allUsers = currentStudyState.activeUsers || [];
        const buddies = allUsers.filter(u => u.roomId === activeRoomId && u.socketId !== myId);

        buddies.forEach(peerUser => {
            const peerId = peerUser.socketId;
            if (!peerConnections.has(peerId)) {
                // To avoid Offer Glare: only peer with greater socketId initiates the offer
                const isInitiator = (myId > peerId);
                createPeerConnection(peerId, isInitiator);
            }
        });
    }

    function createPeerConnection(targetSocketId, isInitiator) {
        if (peerConnections.has(targetSocketId)) return peerConnections.get(targetSocketId);

        const pc = new RTCPeerConnection(rtcConfig);
        const peerData = {
            pc,
            camStream: new MediaStream(),
            screenStream: new MediaStream(),
            pendingCandidates: [],
            senders: new Map(),
            isMakingOffer: false
        };

        peerConnections.set(targetSocketId, peerData);

        // Add local cam / mic tracks if available
        if (localCamStream) {
            localCamStream.getTracks().forEach(track => {
                const kind = (track.kind === 'video' ? 'cam' : 'audio');
                const sender = pc.addTrack(track, localCamStream);
                peerData.senders.set(kind, sender);
            });
        }

        // Add local screen track if sharing
        if (localScreenStream && isScreenSharing) {
            const screenTrack = localScreenStream.getVideoTracks()[0];
            if (screenTrack) {
                const sender = pc.addTrack(screenTrack, localScreenStream);
                peerData.senders.set('screen', sender);
            }
        }

        // Handle ICE Candidates
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                const s = getSocket();
                if (s) {
                    s.emit('study:signal', {
                        to: targetSocketId,
                        signal: { candidate: event.candidate.toJSON ? event.candidate.toJSON() : event.candidate },
                        type: 'candidate'
                    });
                }
            }
        };

        // Handle incoming Remote Tracks
        pc.ontrack = (event) => {
            handleRemoteTrack(targetSocketId, event);
        };

        pc.onconnectionstatechange = () => {
            if (['disconnected', 'failed', 'closed'].includes(pc.connectionState)) {
                closePeer(targetSocketId);
            }
        };

        // If designated initiator, start negotiation
        if (isInitiator) {
            renegotiateWithPeer(targetSocketId);
        }

        return peerData;
    }

    async function renegotiateWithPeer(targetSocketId) {
        const peerData = peerConnections.get(targetSocketId);
        if (!peerData || !peerData.pc) return;
        const pc = peerData.pc;
        if (pc.signalingState === 'closed') return;

        try {
            peerData.isMakingOffer = true;
            const offer = await pc.createOffer();
            if (pc.signalingState !== 'stable' && pc.signalingState !== 'have-local-offer') return;
            await pc.setLocalDescription(offer);

            const s = getSocket();
            if (s) {
                s.emit('study:signal', {
                    to: targetSocketId,
                    signal: { sdp: pc.localDescription },
                    type: 'offer'
                });
            }
        } catch (err) {
            console.warn('Renegotiation error with peer:', targetSocketId, err);
        } finally {
            peerData.isMakingOffer = false;
        }
    }

    function handleRemoteTrack(targetSocketId, event) {
        const peerData = peerConnections.get(targetSocketId);
        if (!peerData) return;

        const track = event.track;
        const stream = (event.streams && event.streams[0]) ? event.streams[0] : null;
        const streamId = stream ? stream.id : '';

        // Differentiate screen share vs webcam
        // If track label mentions screen, or streamId contains screen:
        const remoteState = remoteMediaStates.get(targetSocketId) || {};
        const isScreen = streamId.includes('screen') || 
                         (track.label && track.label.toLowerCase().includes('screen')) ||
                         (remoteState.screen && track.kind === 'video' && peerData.camStream.getVideoTracks().length > 0);

        if (isScreen) {
            // Screen track
            if (!peerData.screenStream) peerData.screenStream = new MediaStream();
            // Clear existing video tracks if new screen track arrives
            peerData.screenStream.getVideoTracks().forEach(t => peerData.screenStream.removeTrack(t));
            peerData.screenStream.addTrack(track);

            track.onended = () => {
                if (peerData.screenStream) peerData.screenStream.removeTrack(track);
                if (pinnedTarget && pinnedTarget.socketId === targetSocketId && pinnedTarget.type === 'screen') {
                    unpinMeetTile();
                }
            };
        } else {
            // Webcam or Mic track
            if (!peerData.camStream) peerData.camStream = new MediaStream();
            const existing = (track.kind === 'video') ? peerData.camStream.getVideoTracks() : peerData.camStream.getAudioTracks();
            existing.forEach(t => peerData.camStream.removeTrack(t));
            peerData.camStream.addTrack(track);
        }

        refreshMediaElements(targetSocketId);
    }

    function refreshMediaElements(socketId) {
        const peerData = peerConnections.get(socketId);
        if (!peerData) return;

        // 1. Webcam Video Element in Tile
        const remoteVid = byId(`meet-video-${socketId}`);
        if (remoteVid && peerData.camStream && peerData.camStream.getVideoTracks().length > 0) {
            if (remoteVid.srcObject !== peerData.camStream) {
                remoteVid.srcObject = peerData.camStream;
            }
            remoteVid.play().catch(e => console.log('Remote cam play deferred:', e));
        }

        // 2. Spotlight Video Element (If socketId is currently pinned)
        if (pinnedTarget && pinnedTarget.socketId === socketId) {
            renderSpotlightView();
        }
    }

    async function handleIncomingSignal(data) {
        const { from, signal } = data || {};
        if (!from || !signal) return;

        let peerData = peerConnections.get(from);
        if (!peerData) {
            peerData = createPeerConnection(from, false);
        }
        const pc = peerData.pc;

        try {
            if (signal.sdp) {
                const sdp = new RTCSessionDescription(signal.sdp);
                if (sdp.type === 'offer') {
                    const myId = getSocket() ? getSocket().id : '';
                    // Polite peer pattern: peer with smaller socketId yields on collision
                    const isPolite = (myId < from);

                    if (pc.signalingState !== 'stable') {
                        if (!isPolite) {
                            console.log('Glare collision: ignoring remote offer from', from);
                            return;
                        }
                        await pc.setLocalDescription({ type: 'rollback' });
                    }

                    await pc.setRemoteDescription(sdp);
                    const answer = await pc.createAnswer();
                    await pc.setLocalDescription(answer);

                    const s = getSocket();
                    if (s) {
                        s.emit('study:signal', {
                            to: from,
                            signal: { sdp: pc.localDescription },
                            type: 'answer'
                        });
                    }

                    await flushPendingCandidates(peerData);
                } else if (sdp.type === 'answer') {
                    if (pc.signalingState === 'have-local-offer') {
                        await pc.setRemoteDescription(sdp);
                        await flushPendingCandidates(peerData);
                    }
                }
            } else if (signal.candidate) {
                const cand = new RTCIceCandidate(signal.candidate);
                if (!pc.remoteDescription || !pc.remoteDescription.type) {
                    peerData.pendingCandidates.push(cand);
                } else {
                    await pc.addIceCandidate(cand);
                }
            }
        } catch (err) {
            console.warn('Error in handleIncomingSignal from', from, err);
        }
    }

    async function flushPendingCandidates(peerData) {
        if (!peerData || !peerData.pc) return;
        const pc = peerData.pc;
        if (!pc.remoteDescription || !pc.remoteDescription.type) return;

        if (peerData.pendingCandidates && peerData.pendingCandidates.length > 0) {
            for (const cand of peerData.pendingCandidates) {
                try {
                    await pc.addIceCandidate(cand);
                } catch (e) {
                    console.warn('Error applying queued ICE candidate:', e);
                }
            }
            peerData.pendingCandidates = [];
        }
    }

    function closePeer(socketId) {
        if (peerConnections.has(socketId)) {
            const peerData = peerConnections.get(socketId);
            try { peerData.pc.close(); } catch (_) {}
            peerConnections.delete(socketId);
        }
        remoteMediaStates.delete(socketId);
        if (pinnedTarget && pinnedTarget.socketId === socketId) {
            unpinMeetTile();
        }
        renderMeetUI();
    }

    function closeAllPeers() {
        peerConnections.forEach(peerData => {
            try { peerData.pc.close(); } catch (_) {}
        });
        peerConnections.clear();
        remoteMediaStates.clear();
        unpinMeetTile();
    }

    // ============================================================
    // REACTIONS & FLOATING EMOJIS (GOOGLE MEET EFFECT)
    // ============================================================

    window.toggleMeetReactionsPopover = function() {
        const bar = byId('meet-reactions-bar');
        if (bar) bar.classList.toggle('hidden');
    };

    window.sendMeetReaction = function(emoji) {
        const s = getSocket();
        if (s) {
            s.emit('study:reaction', { emoji, roomId: activeRoomId });
        }
        const myName = (typeof myUsername !== 'undefined' ? myUsername : 'Bạn');
        showFloatingEmoji(emoji, myName);

        const bar = byId('meet-reactions-bar');
        if (bar) bar.classList.add('hidden');
    };

    function showFloatingEmoji(emoji, username) {
        const layer = byId('meet-reactions-layer');
        if (!layer) return;

        const el = document.createElement('div');
        el.className = 'meet-floating-emoji';
        el.innerHTML = `
            <span>${emoji}</span>
            <span class="meet-floating-emoji-user">${escapeHtml(username)}</span>
        `;

        // Random horizontal position (20% to 75%)
        const randomX = Math.floor(Math.random() * 55) + 20;
        el.style.left = `${randomX}%`;

        layer.appendChild(el);

        // Auto remove after animation completes
        setTimeout(() => {
            if (el.parentNode) el.parentNode.removeChild(el);
        }, 3400);
    }

    // ============================================================
    // PINNING & SPOTLIGHT
    // ============================================================

    window.pinMeetTile = function(socketId, isScreen = false) {
        pinnedTarget = {
            type: isScreen ? 'screen' : 'cam',
            socketId
        };
        renderMeetUI();
    };

    window.unpinMeetTile = function() {
        pinnedTarget = null;
        renderMeetUI();
    };

    // ============================================================
    // ROOM SELECTION, SIDE PANEL & ACTIONS
    // ============================================================

    window.toggleMeetRoomDropdown = function() {
        const menu = byId('meet-room-dropdown-menu');
        if (menu) menu.classList.toggle('hidden');
    };

    window.selectMeetRoom = function(roomId) {
        const menu = byId('meet-room-dropdown-menu');
        if (menu) menu.classList.add('hidden');
        joinStudyRoom(roomId);
    };

    window.copyMeetRoomCode = function() {
        const code = activeRoomId;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(code).then(() => {
                if (typeof showToastNotification === 'function') {
                    showToastNotification(`📋 Đã sao chép mã phòng: "${code}"`);
                }
            });
        }
    };

    window.toggleMeetSidePanel = function(preferredTab) {
        const panel = byId('meet-side-panel');
        if (!panel) return;

        if (panel.classList.contains('hidden')) {
            panel.classList.remove('hidden');
            if (preferredTab) switchMeetSideTab(preferredTab);
        } else {
            if (preferredTab && !isTabActive(preferredTab)) {
                switchMeetSideTab(preferredTab);
            } else {
                panel.classList.add('hidden');
            }
        }
    };

    function isTabActive(tab) {
        const tabBtn = byId(`meet-tab-${tab}`);
        return tabBtn && tabBtn.classList.contains('active');
    }

    window.switchMeetSideTab = function(tab) {
        const tabPeople = byId('meet-tab-people');
        const tabDetails = byId('meet-tab-details');
        const contentPeople = byId('meet-side-people-content');
        const contentDetails = byId('meet-side-details-content');

        if (tabPeople) tabPeople.classList.toggle('active', tab === 'people');
        if (tabDetails) tabDetails.classList.toggle('active', tab === 'details');
        if (contentPeople) contentPeople.classList.toggle('hidden', tab !== 'people');
        if (contentDetails) contentDetails.classList.toggle('hidden', tab !== 'details');
    };

    window.leaveMeetRoom = function() {
        if (confirm('Bạn có muốn rời khỏi phòng học Meet này?')) {
            // Stop local media
            if (localCamStream) {
                localCamStream.getTracks().forEach(t => t.stop());
                localCamStream = null;
            }
            if (localScreenStream) {
                localScreenStream.getTracks().forEach(t => t.stop());
                localScreenStream = null;
            }
            stopAudioAnalysis();
            micEnabled = false;
            camEnabled = false;
            handRaised = false;
            isScreenSharing = false;
            isSpeaking = false;
            updateToolbarButtons();

            closeAllPeers();
            resetMeetingTimer();

            const s = getSocket();
            if (s) {
                s.emit('study:leaveRoom');
            }

            // Switch back to video workspace
            if (typeof switchWorkspace === 'function') {
                switchWorkspace('video');
            }
            if (typeof showToastNotification === 'function') {
                showToastNotification('👋 Bạn đã rời phòng học.');
            }
        }
    };

    // Close popovers when clicking outside
    document.addEventListener('click', (e) => {
        const roomSelector = document.querySelector('.meet-room-selector-wrap');
        const roomMenu = byId('meet-room-dropdown-menu');
        if (roomMenu && !roomMenu.classList.contains('hidden') && roomSelector && !roomSelector.contains(e.target)) {
            roomMenu.classList.add('hidden');
        }

        const reactWrap = document.querySelector('.meet-reactions-popover-wrap');
        const reactBar = byId('meet-reactions-bar');
        if (reactBar && !reactBar.classList.contains('hidden') && reactWrap && !reactWrap.contains(e.target)) {
            reactBar.classList.add('hidden');
        }
    });

    // Keyboard Shortcuts (Ctrl+D for Mic, Ctrl+E for Cam like Google Meet)
    document.addEventListener('keydown', (e) => {
        const studyPanel = byId('study-panel');
        if (!studyPanel || studyPanel.hidden) return;

        // Skip if typing in an input
        if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

        if (e.ctrlKey && (e.key === 'd' || e.key === 'D')) {
            e.preventDefault();
            toggleMeetMic();
        } else if (e.ctrlKey && (e.key === 'e' || e.key === 'E')) {
            e.preventDefault();
            toggleMeetCam();
        }
    });

    // --- Personal Goal & Status Handlers ---
    window.saveMyStudyGoal = function() {
        const input = byId('study-my-goal-input');
        if (!input) return;
        myStudyGoal = input.value.trim().substring(0, 80);
        try { localStorage.setItem('musiclive_my_study_goal', myStudyGoal); } catch (_) {}

        const s = getSocket();
        if (s) {
            s.emit('study:updateStatus', {
                status: myStudyStatus,
                goal: myStudyGoal
            });
        }
        if (typeof showToastNotification === 'function') {
            showToastNotification('🎯 Đã lưu mục tiêu phiên học của bạn!');
        }
    };

    window.setMyStudyStatus = function(status) {
        if (!status) return;
        myStudyStatus = status;
        try { localStorage.setItem('musiclive_my_study_status', myStudyStatus); } catch (_) {}

        updateStatusPillHighlight();

        const s = getSocket();
        if (s) {
            s.emit('study:updateStatus', {
                status: myStudyStatus,
                goal: myStudyGoal
            });
        }
    };

    function updateStatusPillHighlight() {
        const pills = document.querySelectorAll('.study-status-pill');
        pills.forEach(p => {
            p.classList.toggle('active', p.dataset.status === myStudyStatus);
        });
    }

    // --- Admin Modal Logic ---
    window.openCreateStudyRoomModal = function() {
        const modal = byId('create-study-room-modal');
        if (modal) {
            modal.classList.remove('hidden');
            const nameInput = byId('new-study-name');
            if (nameInput) {
                nameInput.value = '';
                setTimeout(() => nameInput.focus(), 150);
            }
            const descInput = byId('new-study-desc');
            if (descInput) descInput.value = '';
        }
    };

    window.closeCreateStudyRoomModal = function() {
        const modal = byId('create-study-room-modal');
        if (modal) modal.classList.add('hidden');
    };

    window.selectStudyEmoji = function(el, emoji) {
        document.querySelectorAll('.study-emoji-opt').forEach(opt => opt.classList.remove('active'));
        if (el) el.classList.add('active');
        const input = byId('new-study-icon');
        if (input) input.value = emoji;
    };

    window.handleCreateStudyRoomSubmit = function(e) {
        if (e && e.preventDefault) e.preventDefault();
        const nameInput = byId('new-study-name');
        const iconInput = byId('new-study-icon');
        const topicInput = byId('new-study-topic');
        const descInput = byId('new-study-desc');

        const name = (nameInput ? nameInput.value : '').trim();
        const icon = (iconInput ? iconInput.value : '📚').trim();
        const topic = (topicInput ? topicInput.value : 'Tập trung').trim();
        const desc = (descInput ? descInput.value : '').trim();

        if (!name) {
            if (typeof showToastNotification === 'function') showToastNotification('⚠️ Vui lòng nhập tên phòng học!');
            return;
        }

        const s = getSocket();
        if (!s) {
            if (typeof showToastNotification === 'function') showToastNotification('⚠️ Không có kết nối máy chủ!');
            return;
        }

        s.emit('study:createRoom', { name, icon, topic, desc }, (res) => {
            if (res && res.success) {
                closeCreateStudyRoomModal();
                if (res.room && res.room.id) {
                    joinStudyRoom(res.room.id);
                }
                if (typeof showToastNotification === 'function') {
                    showToastNotification(`🎉 Đã tạo phòng học: "${name}" thành công!`);
                }
            } else {
                if (typeof showToastNotification === 'function') {
                    showToastNotification(`⚠️ ${res && res.message ? res.message : 'Lỗi khi tạo phòng học'}`);
                }
            }
        });
    };

    window.deleteStudyRoom = function(roomId, roomName) {
        if (!confirm(`Bạn có chắc chắn muốn xóa phòng học "${roomName}"?`)) {
            return;
        }
        const s = getSocket();
        if (!s) return;

        s.emit('study:deleteRoom', { roomId }, (res) => {
            if (res && res.success) {
                if (activeRoomId === roomId) {
                    activeRoomId = 'room_general';
                    joinStudyRoom('room_general');
                }
                if (typeof showToastNotification === 'function') {
                    showToastNotification(`🗑️ Đã xóa phòng học "${roomName}".`);
                }
            } else {
                if (typeof showToastNotification === 'function') {
                    showToastNotification(`⚠️ ${res && res.message ? res.message : 'Không thể xóa phòng học'}`);
                }
            }
        });
    };

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // ============================================================
    // SOCKET LISTENERS & SETUP
    // ============================================================

    function setupStudySocket() {
        const s = getSocket();
        if (!s) return;

        s.on('study:update', (state) => {
            updateStudyRoomsData(state);
            initiateWebRtcPeers();
        });

        s.on('study:signal', (data) => {
            handleIncomingSignal(data);
        });

        s.on('study:mediaStateChanged', (data) => {
            const { socketId, mediaState } = data || {};
            if (socketId) {
                remoteMediaStates.set(socketId, mediaState);

                // Auto spotlight when screen share starts, auto unpin when ends
                if (mediaState.screen === true) {
                    pinMeetTile(socketId, true);
                } else if (mediaState.screen === false) {
                    if (pinnedTarget && pinnedTarget.socketId === socketId && pinnedTarget.type === 'screen') {
                        unpinMeetTile();
                    }
                }

                // Update peer tile DOM
                const tile = byId(`meet-tile-${socketId}`);
                if (tile) {
                    tile.classList.toggle('is-speaking', !!mediaState.speaking);
                    tile.classList.toggle('is-hand-raised', !!mediaState.hand);
                    const vid = byId(`meet-video-${socketId}`);
                    const avatar = byId(`meet-avatar-${socketId}`);
                    if (vid) vid.classList.toggle('hidden', !mediaState.cam);
                    if (avatar) avatar.classList.toggle('hidden', !!mediaState.cam);
                    const micIcon = tile.querySelector('.meet-tile-mic-status');
                    if (micIcon) {
                        micIcon.classList.toggle('is-muted', !mediaState.mic);
                        const matIcon = micIcon.querySelector('.material-symbols-outlined');
                        if (matIcon) matIcon.textContent = mediaState.mic ? 'mic' : 'mic_off';
                    }
                }

                renderSidePanel();
                refreshMediaElements(socketId);
            }
        });

        s.on('study:reactionReceived', (data) => {
            if (data && (data.roomId === activeRoomId || !data.roomId)) {
                showFloatingEmoji(data.emoji || '💖', data.username || 'Bạn học');
            }
        });

        s.on('study:peerLeft', (data) => {
            if (data && data.socketId) {
                closePeer(data.socketId);
            }
        });

        // Initial fetch
        s.emit('study:getState', (state) => {
            if (state) updateStudyRoomsData(state);
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        setupStudySocket();
        const goalInput = byId('study-my-goal-input');
        if (goalInput) {
            goalInput.value = myStudyGoal;
            goalInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    saveMyStudyGoal();
                }
            });
        }
    });

    if (typeof socket !== 'undefined' && socket) {
        socket.on('connect', () => {
            setupStudySocket();
            const studyPanel = byId('study-panel');
            if (studyPanel && !studyPanel.hidden) {
                joinStudyRoom(activeRoomId);
            }
        });

        socket.on('authResult', (res) => {
            if (res && res.studyRoomState) {
                updateStudyRoomsData(res.studyRoomState);
            }
            updateAdminControls();
        });
    }

})();
