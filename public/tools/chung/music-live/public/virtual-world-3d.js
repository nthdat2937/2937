/* ==========================================================================
   3D VIRTUAL CAMPUS ENGINE (PHÒNG NGHE NHẠC 3D & PHÒNG HỌC TẬP 3D - 2937.ML)
   ========================================================================== */
(function () {
    'use strict';

    // --- CONSTANTS & CAMPUS SEATS (AUTHENTIC PLAY TOGETHER PROPORTIONS) ---
    const AVATAR_COLORS = ['#ffffff', '#38bdf8', '#f472b6', '#1e293b', '#fde047', '#a855f7', '#34d399', '#fb923c'];
    const SHORTS_COLORS = ['#228be6', '#1e293b', '#64748b', '#ec4899', '#10b981', '#e2e8f0'];
    const TOP_STYLES = ['sleeveless', 'tee', 'hoodie'];
    const TOP_LABELS = {
        sleeveless: '🎽 Áo Ba Lỗ',
        tee: '👕 Áo Thun',
        hoodie: '🧥 Áo Hoodie'
    };
    const SHOES_STYLES = ['slippers', 'sneakers'];
    const SHOES_LABELS = {
        slippers: '🩴 Dép Quai Trắng',
        sneakers: '👟 Giày Sneaker'
    };
    const FACE_STYLES = ['basic', 'happy', 'wink', 'shy'];
    const FACE_LABELS = {
        basic: '🙂 Basic Face',
        happy: '😄 Vui Tươi',
        wink: '😉 Nháy Mắt',
        shy: '🌸 Má Hồng'
    };
    const AVATAR_HATS = ['none', 'duck', 'headphones', 'cat', 'bunny', 'crown', 'cap'];
    const HAT_LABELS = {
        none: '✨ Không Đội Mũ',
        duck: '🐥 Mũ Vịt Vàng',
        headphones: '🎧 Tai Nghe',
        cat: '🐱 Tai Mèo',
        bunny: '🐰 Tai Thỏ',
        crown: '👑 Vương Miện',
        cap: '🧢 Mũ Lưỡi Trai'
    };
    const AVATAR_HAIRS = ['messy', 'bob', 'spiky', 'ponytail', 'twintails'];
    const HAIR_LABELS = {
        messy: '🌪️ Tóc Rối Messy',
        bob: '💇 Tóc Bob',
        spiky: '⚡ Layer Ngầu',
        ponytail: '🎀 Đuôi Ngựa',
        twintails: '🧸 Hai Chỏm'
    };
    const HAIR_COLORS = ['#38302e', '#111827', '#f472b6', '#38bdf8', '#fbbf24', '#a78bfa', '#e2e8f0'];
    const SKIN_COLORS = ['#ffe2c6', '#ffd1b3', '#e8b48a', '#c68b59'];
    const QUICK_PHRASES = [
        'Chào cả nhà! 👋',
        'Ngồi học chung nhé! 📖',
        'Bài này hay quá! 🎵',
        'Cho mình ngồi với 🪑',
        'Nghỉ giải lao xíu ☕',
        'Cố lên nào! 💪'
    ];

    // All interactive seats across Music Room, Courtyard, and Study Room
    // Hip pivot is at local y = 0.72 with thigh radius 0.105 (seated underside at ~0.615)
    const CAMPUS_SEATS = [
        // Study Room Desks & Chairs (chair cushion top = 0.59 -> sitY = -0.02)
        { id: 'study-desk-1', room: 'study', type: 'desk', label: 'Bàn Học #1 (Hàng đầu - Trái)', x: 18.2, z: -5.2, chairX: 16.85, chairZ: -5.2, sitY: -0.02, rotY: Math.PI / 2 },
        { id: 'study-desk-2', room: 'study', type: 'desk', label: 'Bàn Học #2 (Hàng đầu - Giữa)', x: 18.2, z: 0.0,  chairX: 16.85, chairZ: 0.0,  sitY: -0.02, rotY: Math.PI / 2 },
        { id: 'study-desk-3', room: 'study', type: 'desk', label: 'Bàn Học #3 (Hàng đầu - Phải)', x: 18.2, z: 5.2,  chairX: 16.85, chairZ: 5.2,  sitY: -0.02, rotY: Math.PI / 2 },
        { id: 'study-desk-4', room: 'study', type: 'desk', label: 'Bàn Học #4 (Hàng sau - Trái)', x: 12.4, z: -5.2, chairX: 11.05, chairZ: -5.2, sitY: -0.02, rotY: Math.PI / 2 },
        { id: 'study-desk-5', room: 'study', type: 'desk', label: 'Bàn Học #5 (Hàng sau - Giữa)', x: 12.4, z: 0.0,  chairX: 11.05, chairZ: 0.0,  sitY: -0.02, rotY: Math.PI / 2 },
        { id: 'study-desk-6', room: 'study', type: 'desk', label: 'Bàn Học #6 (Hàng sau - Phải)', x: 12.4, z: 5.2,  chairX: 11.05, chairZ: 5.2,  sitY: -0.02, rotY: Math.PI / 2 },

        // Music Room Lounge Sofas (sofa top = 0.475 -> sitY = -0.12)
        { id: 'music-sofa-1', room: 'music', type: 'sofa', label: 'Sofa Phòng Nhạc #1 (Giữa Trái)', x: -16.2, z: -2.0, chairX: -16.2, chairZ: -2.0, sitY: -0.12, rotY: -Math.PI / 2 },
        { id: 'music-sofa-2', room: 'music', type: 'sofa', label: 'Sofa Phòng Nhạc #2 (Giữa Phải)', x: -16.2, z: 2.0,  chairX: -16.2, chairZ: 2.0,  sitY: -0.12, rotY: -Math.PI / 2 },
        { id: 'music-sofa-3', room: 'music', type: 'sofa', label: 'Ghế Lười Chill #3 (Cạnh Loa Trái)', x: -19.5, z: -5.2, chairX: -19.5, chairZ: -5.2, sitY: -0.08, rotY: -Math.PI / 2 + 0.35 },
        { id: 'music-sofa-4', room: 'music', type: 'sofa', label: 'Ghế Lười Chill #4 (Cạnh Loa Phải)', x: -19.5, z: 5.2,  chairX: -19.5, chairZ: 5.2,  sitY: -0.08, rotY: -Math.PI / 2 - 0.35 },

        // Courtyard Garden Bench (bench top = 0.54 -> sitY = -0.07)
        { id: 'yard-bench-1', room: 'yard', type: 'bench', label: 'Ghế Đá Sân Khuôn Viên', x: 0.0, z: -6.2, chairX: 0.0, chairZ: -6.2, sitY: -0.07, rotY: 0 }
    ];

    // --- STATE ---
    let isActive = false;
    let scene = null;
    let camera = null;
    let renderer = null;
    let clock = null;
    let animFrameId = null;
    let raycaster = null;
    let mouseVec = null;

    // Local Player State (Defaults match the Play Together Starter Avatar!)
    let localPlayer = {
        x: -12.5,
        y: 0,
        z: 0,
        vy: 0,
        rotY: -Math.PI / 2,
        colorIndex: 0,      // #ffffff White Sleeveless
        shortsColorIndex: 0,// #228be6 Sky Blue Shorts
        topStyleIndex: 0,   // sleeveless
        shoesStyleIndex: 0, // slippers (White Striped Slippers)
        faceIndex: 0,       // basic (Basic Face)
        hatIndex: 0,        // none
        hairIndex: 0,       // messy (Brown Messy Hair)
        hairColorIndex: 0,  // #38302e Brown
        skinIndex: 0,       // #ffe2c6 Peach
        seatId: null,
        zone: 'music',
        isMoving: false,
        walkTime: 0,
        squashTimer: 0,
        meshGroup: null
    };

    // Camera Orbit State
    let camYaw = -Math.PI / 2; // Behind player looking toward -X (TV)
    let camPitch = 0.08;
    let camDist = 7.6;
    let isDraggingCam = false;
    let prevPointerX = 0;
    let prevPointerY = 0;
    let pointerDownX = 0;
    let pointerDownY = 0;
    let isTheaterTVMode = false;
    let isMiniTVPinned = false;
    let isRealVideoOnTV = true;

    // Input State
    const keysPressed = {};
    let joyDX = 0;
    let joyDZ = 0;
    let nearestSeat = null;

    // Play Together In-World Chat State
    const chatFeedBuffer = [];
    let playChatMode = 'compact'; // 'compact' | 'expanded' | 'minimized'
    let playChatUnread = 0;
    let socketListenersBound = false;
    let uiEventsBound = false;
    let djNpcGroup = null;

    // 3D Scene References
    const seatMeshes = new Map(); // seatId -> { ringMesh, lampLight, hitMeshes[] }
    const clickableSeatMeshes = [];
    const remotePlayers = new Map(); // socketId -> { data, group, walkTime }
    let tvScreenMesh = null;
    let tvCanvas = null;
    let tvCtx = null;
    let tvTexture = null;
    let tvThumbnailImg = null;
    let lastTvVideoId = '';
    let tvAmbilight = null;
    let speakerCones = [];
    let danceFloorTiles = [];
    let firefliesMesh = null;

    let studyBoardCanvas = null;
    let studyBoardCtx = null;
    let studyBoardTexture = null;
    let lastCanvasDrawTime = 0;
    let lastNetSyncTime = 0;

    // Load saved customization (fresh v2 key so Starter avatar defaults take effect immediately)
    try {
        const saved = JSON.parse(localStorage.getItem('musiclive_v3d_pt_prefs_v2') || '{}');
        if (Number.isInteger(saved.colorIndex)) localPlayer.colorIndex = Math.abs(saved.colorIndex) % AVATAR_COLORS.length;
        if (Number.isInteger(saved.shortsColorIndex)) localPlayer.shortsColorIndex = Math.abs(saved.shortsColorIndex) % SHORTS_COLORS.length;
        if (Number.isInteger(saved.topStyleIndex)) localPlayer.topStyleIndex = Math.abs(saved.topStyleIndex) % TOP_STYLES.length;
        if (Number.isInteger(saved.shoesStyleIndex)) localPlayer.shoesStyleIndex = Math.abs(saved.shoesStyleIndex) % SHOES_STYLES.length;
        if (Number.isInteger(saved.faceIndex)) localPlayer.faceIndex = Math.abs(saved.faceIndex) % FACE_STYLES.length;
        if (Number.isInteger(saved.hatIndex)) localPlayer.hatIndex = Math.abs(saved.hatIndex) % AVATAR_HATS.length;
        if (Number.isInteger(saved.hairIndex)) localPlayer.hairIndex = Math.abs(saved.hairIndex) % AVATAR_HAIRS.length;
        if (Number.isInteger(saved.hairColorIndex)) localPlayer.hairColorIndex = Math.abs(saved.hairColorIndex) % HAIR_COLORS.length;
        if (Number.isInteger(saved.skinIndex)) localPlayer.skinIndex = Math.abs(saved.skinIndex) % SKIN_COLORS.length;
    } catch (_) {}

    function savePrefs() {
        try {
            localStorage.setItem('musiclive_v3d_pt_prefs_v2', JSON.stringify({
                colorIndex: localPlayer.colorIndex,
                shortsColorIndex: localPlayer.shortsColorIndex,
                topStyleIndex: localPlayer.topStyleIndex,
                shoesStyleIndex: localPlayer.shoesStyleIndex,
                faceIndex: localPlayer.faceIndex,
                hatIndex: localPlayer.hatIndex,
                hairIndex: localPlayer.hairIndex,
                hairColorIndex: localPlayer.hairColorIndex,
                skinIndex: localPlayer.skinIndex
            }));
        } catch (_) {}
    }

    function getLocalAppearance() {
        return {
            color: AVATAR_COLORS[localPlayer.colorIndex],
            shortsColor: SHORTS_COLORS[localPlayer.shortsColorIndex],
            topStyle: TOP_STYLES[localPlayer.topStyleIndex],
            shoesStyle: SHOES_STYLES[localPlayer.shoesStyleIndex],
            face: FACE_STYLES[localPlayer.faceIndex],
            hat: AVATAR_HATS[localPlayer.hatIndex],
            hair: AVATAR_HAIRS[localPlayer.hairIndex],
            hairColor: HAIR_COLORS[localPlayer.hairColorIndex],
            skinColor: SKIN_COLORS[localPlayer.skinIndex]
        };
    }

    function hashStringIndex(str, mod) {
        let h = 0;
        const s = String(str || '');
        for (let i = 0; i < s.length; i++) {
            h = (h * 31 + s.charCodeAt(i)) >>> 0;
        }
        return h % Math.max(1, mod);
    }

    // =========================================================================
    // 1. INITIALIZE 3D SCENE & CAMPUS ARCHITECTURE
    // =========================================================================
    function initThreeWorld() {
        if (scene || typeof THREE === 'undefined') return;

        const container = document.getElementById('virtual3d-canvas-wrap');
        if (!container) return;

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x060913);
        scene.fog = new THREE.FogExp2(0x060913, 0.014);

        camera = new THREE.PerspectiveCamera(58, container.clientWidth / Math.max(1, container.clientHeight), 0.1, 140);
        renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.innerHTML = '';
        container.appendChild(renderer.domElement);

        clock = new THREE.Clock();
        raycaster = new THREE.Raycaster();
        mouseVec = new THREE.Vector2();

        // --- LIGHTING ---
        const hemiLight = new THREE.HemisphereLight(0x93c5fd, 0x1e1b4b, 0.55);
        hemiLight.position.set(0, 25, 0);
        scene.add(hemiLight);

        const moonLight = new THREE.DirectionalLight(0xc7d2fe, 0.5);
        moonLight.position.set(8, 28, -16);
        moonLight.castShadow = true;
        moonLight.shadow.mapSize.width = 1024;
        moonLight.shadow.mapSize.height = 1024;
        scene.add(moonLight);

        buildSkyAndCourtyard();
        buildMusicLoungeRoom();
        buildStudyLibraryRoom();

        // Create Local Player Play Together 3D Avatar
        const app = getLocalAppearance();
        localPlayer.meshGroup = createAvatarMesh({
            username: getMyUsername(),
            role: getMyRole(),
            isPremium: getMyPremium(),
            ...app,
            statusText: '🎵 Phòng Nhạc'
        }, true);
        scene.add(localPlayer.meshGroup);

        bindControls(container);
        window.addEventListener('resize', onWindowResize);
    }

    // --- BUILD COURTYARD (SÂN KHUÔN VIÊN GIỮA 2 PHÒNG) ---
    function buildSkyAndCourtyard() {
        // Outer Campus Ground
        const groundGeo = new THREE.PlaneGeometry(90, 50);
        const groundMat = new THREE.MeshStandardMaterial({ color: 0x0b1320, roughness: 0.9 });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.02;
        ground.receiveShadow = true;
        scene.add(ground);

        // Courtyard Grass Lawn (x: -6 to +6, z: -11 to +11)
        const lawnGeo = new THREE.PlaneGeometry(12, 22);
        const lawnMat = new THREE.MeshStandardMaterial({ color: 0x112a26, roughness: 0.85 });
        const lawn = new THREE.Mesh(lawnGeo, lawnMat);
        lawn.rotation.x = -Math.PI / 2;
        lawn.position.set(0, 0.01, 0);
        scene.add(lawn);

        // Stone Walkway connecting Music Room (x: -6) and Study Room (x: +6)
        for (let x = -5.2; x <= 5.2; x += 1.3) {
            const tileGeo = new THREE.BoxGeometry(1.05, 0.05, 2.8);
            const tileMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });
            const tile = new THREE.Mesh(tileGeo, tileMat);
            tile.position.set(x, 0.025, 0);
            scene.add(tile);
        }

        // Glowing Moon in the Sky
        const moonGeo = new THREE.SphereGeometry(2.4, 24, 24);
        const moonMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
        const moon = new THREE.Mesh(moonGeo, moonMat);
        moon.position.set(0, 22, -28);
        scene.add(moon);

        // Directional Campus Signpost at Courtyard Center (x: 0, z: -2.6)
        const pole = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.12, 3.2, 12),
            new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.6 })
        );
        pole.position.set(0, 1.6, -2.6);
        scene.add(pole);

        const signMusic = createSignBoardMesh('◄ PHÒNG NGHE NHẠC (TV LIVE)', '#38bdf8', '#0f172a');
        signMusic.position.set(-0.9, 2.75, -2.5);
        scene.add(signMusic);

        const signStudy = createSignBoardMesh('PHÒNG HỌC TẬP (BÀN GHẾ) ►', '#fbbf24', '#0f172a');
        signStudy.position.set(0.9, 2.25, -2.5);
        scene.add(signStudy);

        // Courtyard Garden Bench (seat-yard-1 at x: 0, z: -6.2)
        const benchGroup = new THREE.Group();
        benchGroup.position.set(0, 0, -6.2);
        const benchSeat = new THREE.Mesh(
            new THREE.BoxGeometry(2.4, 0.12, 0.7),
            new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 })
        );
        benchSeat.position.y = 0.48;
        const benchBack = new THREE.Mesh(
            new THREE.BoxGeometry(2.4, 0.55, 0.1),
            new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 })
        );
        benchBack.position.set(0, 0.78, -0.3);
        benchGroup.add(benchSeat, benchBack);
        scene.add(benchGroup);
        registerSeatMesh('yard-bench-1', [benchSeat, benchBack], 0, -6.2, null);

        // Decorative Cherry Blossom Trees in Courtyard
        createTree(-3.8, -7.8, 0xf472b6);
        createTree(3.8, -7.8, 0xf472b6);
        createTree(-3.8, 7.5, 0x38bdf8);
        createTree(3.8, 7.5, 0x34d399);

        // Courtyard Lantern Lights
        createGardenLantern(-2.8, -2.5);
        createGardenLantern(2.8, -2.5);
        createGardenLantern(-2.8, 2.5);
        createGardenLantern(2.8, 2.5);

        // Drifting Fireflies / Star Particles across Campus
        const pCount = 180;
        const pGeo = new THREE.BufferGeometry();
        const pPos = new Float32Array(pCount * 3);
        for (let i = 0; i < pCount; i++) {
            pPos[i * 3] = (Math.random() - 0.5) * 65;
            pPos[i * 3 + 1] = 0.6 + Math.random() * 12;
            pPos[i * 3 + 2] = (Math.random() - 0.5) * 26;
        }
        pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
        const pMat = new THREE.PointsMaterial({ color: 0x87cefa, size: 0.16, transparent: true, opacity: 0.8 });
        firefliesMesh = new THREE.Points(pGeo, pMat);
        scene.add(firefliesMesh);
    }

    function createTree(x, z, crownColor) {
        const g = new THREE.Group();
        g.position.set(x, 0, z);
        const trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.22, 0.32, 2.2, 8),
            new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 })
        );
        trunk.position.y = 1.1;
        g.add(trunk);

        const foliageMat = new THREE.MeshStandardMaterial({
            color: crownColor,
            emissive: crownColor,
            emissiveIntensity: 0.18,
            roughness: 0.6
        });
        const c1 = new THREE.Mesh(new THREE.SphereGeometry(1.35, 12, 12), foliageMat);
        c1.position.set(0, 2.7, 0);
        const c2 = new THREE.Mesh(new THREE.SphereGeometry(0.95, 10, 10), foliageMat);
        c2.position.set(0.65, 2.3, 0.4);
        const c3 = new THREE.Mesh(new THREE.SphereGeometry(0.95, 10, 10), foliageMat);
        c3.position.set(-0.6, 2.35, -0.35);
        g.add(c1, c2, c3);
        scene.add(g);
    }

    function createGardenLantern(x, z) {
        const post = new THREE.Mesh(
            new THREE.CylinderGeometry(0.06, 0.08, 2.1, 8),
            new THREE.MeshStandardMaterial({ color: 0x1e293b })
        );
        post.position.set(x, 1.05, z);
        const bulb = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 10, 10),
            new THREE.MeshBasicMaterial({ color: 0xfde047 })
        );
        bulb.position.set(x, 2.15, z);
        scene.add(post, bulb);
    }

    // =========================================================================
    // 2. ROOM 1: PHÒNG NGHE NHẠC 3D (WEST WING: x = -28 to -6, z = -11 to +11)
    // =========================================================================
    function buildMusicLoungeRoom() {
        // Music Room Floor
        const floorGeo = new THREE.BoxGeometry(22, 0.1, 22);
        const floorMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.35, metalness: 0.25 });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.position.set(-17, 0, 0);
        floor.receiveShadow = true;
        scene.add(floor);

        // Music Room Walls (West Wall at x=-28, North Wall at z=-11, South Wall at z=+11, East Wall at x=-6 with doorway)
        const wallMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.65 });
        const westWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 9.0, 22), wallMat);
        westWall.position.set(-28, 4.5, 0);
        const northWall = new THREE.Mesh(new THREE.BoxGeometry(22, 9.0, 0.4), wallMat);
        northWall.position.set(-17, 4.5, -11);
        const southWall = new THREE.Mesh(new THREE.BoxGeometry(22, 9.0, 0.4), wallMat);
        southWall.position.set(-17, 4.5, 11);

        // East Wall with open doorway (z: -3.2 to +3.2 is open)
        const eastWallLeft = new THREE.Mesh(new THREE.BoxGeometry(0.4, 9.0, 7.8), wallMat);
        eastWallLeft.position.set(-6, 4.5, -7.1);
        const eastWallRight = new THREE.Mesh(new THREE.BoxGeometry(0.4, 9.0, 7.8), wallMat);
        eastWallRight.position.set(-6, 4.5, 7.1);
        const eastWallTop = new THREE.Mesh(new THREE.BoxGeometry(0.4, 3.0, 6.4), wallMat);
        eastWallTop.position.set(-6, 7.5, 0);
        scene.add(westWall, northWall, southWall, eastWallLeft, eastWallRight, eastWallTop);

        // Neon Doorway Header Sign: "PHÒNG NGHE NHẠC 3D"
        const doorSign = createSignBoardMesh('🎵 PHÒNG NGHE NHẠC 3D', '#38bdf8', '#090d16', 4.6, 0.85);
        doorSign.rotation.y = Math.PI / 2;
        doorSign.position.set(-5.72, 6.5, 0);
        scene.add(doorSign);

        // Neon Trim Strips along West & Side Walls
        const neonStripMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
        const stripTop = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 21.4), neonStripMat);
        stripTop.position.set(-27.7, 8.3, 0);
        scene.add(stripTop);

        // --- THE GIANT 3D SMART TV (Video Transforms into this TV!) ---
        const tvGroup = new THREE.Group();
        tvGroup.position.set(-27.55, 4.65, 0);
        tvGroup.rotation.y = Math.PI / 2; // Facing +X into the Music Room

        // Outer metallic TV Bezel (16:9 ratio, 9.3m wide x 5.35m tall)
        const bezelGeo = new THREE.BoxGeometry(9.3, 5.35, 0.25);
        const bezelMat = new THREE.MeshStandardMaterial({ color: 0x090d16, metalness: 0.8, roughness: 0.2 });
        const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
        tvGroup.add(bezelMesh);

        // Glowing Cyan Frame Border around the TV Screen
        const borderEdges = new THREE.EdgesGeometry(bezelGeo);
        const borderLine = new THREE.LineSegments(
            borderEdges,
            new THREE.LineBasicMaterial({ color: 0x38bdf8 })
        );
        tvGroup.add(borderLine);

        // Neon Ambilight Frame behind TV
        const ambiGeo = new THREE.PlaneGeometry(10.1, 6.0);
        const ambiMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.32 });
        const ambiMesh = new THREE.Mesh(ambiGeo, ambiMat);
        ambiMesh.position.z = -0.14;
        tvGroup.add(ambiMesh);

        // Dynamic 3D CanvasTexture for the TV Screen
        tvCanvas = document.createElement('canvas');
        tvCanvas.width = 1024;
        tvCanvas.height = 576;
        tvCtx = tvCanvas.getContext('2d');
        tvTexture = new THREE.CanvasTexture(tvCanvas);
        tvTexture.minFilter = THREE.LinearFilter;

        const screenGeo = new THREE.PlaneGeometry(8.8, 4.95);
        const screenMat = new THREE.MeshBasicMaterial({ map: tvTexture });
        tvScreenMesh = new THREE.Mesh(screenGeo, screenMat);
        tvScreenMesh.position.z = 0.14;
        tvScreenMesh.userData = { isTVScreen: true };
        tvGroup.add(tvScreenMesh);
        scene.add(tvGroup);

        // TV Ambient PointLight illuminating the Music Lounge
        tvAmbilight = new THREE.PointLight(0x38bdf8, 1.35, 22);
        tvAmbilight.position.set(-24.5, 4.5, 0);
        scene.add(tvAmbilight);

        // Stage Platform under the Giant TV
        const stageMesh = new THREE.Mesh(
            new THREE.BoxGeometry(3.4, 0.35, 15.5),
            new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.3 })
        );
        stageMesh.position.set(-26.1, 0.175, 0);
        scene.add(stageMesh);

        // --- TWIN CONCERT SPEAKER TOWERS (LEFT & RIGHT OF TV) ---
        speakerCones = [];
        [-6.3, 6.3].forEach((zPos) => {
            const spkGroup = new THREE.Group();
            spkGroup.position.set(-26.3, 0.35, zPos);
            const cabinet = new THREE.Mesh(
                new THREE.BoxGeometry(1.5, 3.8, 1.6),
                new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.5 })
            );
            cabinet.position.y = 1.9;
            spkGroup.add(cabinet);

            [1.1, 2.6].forEach((coneY) => {
                const ring = new THREE.Mesh(
                    new THREE.TorusGeometry(0.48, 0.06, 12, 24),
                    new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
                );
                ring.rotation.y = Math.PI / 2;
                ring.position.set(0.76, coneY, 0);
                spkGroup.add(ring);

                const cone = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.42, 0.18, 0.16, 20),
                    new THREE.MeshStandardMaterial({ color: 0xbae6fd, emissive: 0x0284c7, emissiveIntensity: 0.5 })
                );
                cone.rotation.z = -Math.PI / 2;
                cone.position.set(0.74, coneY, 0);
                spkGroup.add(cone);
                speakerCones.push(cone);
            });
            scene.add(spkGroup);
        });

        // --- REACTIVE NEON DANCE FLOOR IN MUSIC ROOM ---
        danceFloorTiles = [];
        for (let ix = -1; ix <= 1; ix++) {
            for (let iz = -1; iz <= 1; iz++) {
                const tile = new THREE.Mesh(
                    new THREE.PlaneGeometry(1.9, 1.9),
                    new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.22 })
                );
                tile.rotation.x = -Math.PI / 2;
                tile.position.set(-21.2 + ix * 2.05, 0.06, iz * 2.05);
                scene.add(tile);
                danceFloorTiles.push(tile);
            }
        }

        // --- LOUNGE SOFAS & COFFEE TABLE IN MUSIC ROOM ---
        // Coffee Table
        const coffeeTable = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 0.42, 4.2),
            new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.4 })
        );
        coffeeTable.position.set(-18.2, 0.21, 0);
        scene.add(coffeeTable);

        // Main Plush Sofa facing the Giant TV (seats: music-sofa-1 and music-sofa-2)
        const sofaGroup = new THREE.Group();
        sofaGroup.position.set(-16.0, 0, 0);
        const sofaBase = new THREE.Mesh(
            new THREE.BoxGeometry(1.3, 0.45, 5.8),
            new THREE.MeshStandardMaterial({ color: 0x312e81, roughness: 0.6 })
        );
        sofaBase.position.y = 0.25;
        const sofaBack = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 0.95, 5.8),
            new THREE.MeshStandardMaterial({ color: 0x3730a3, roughness: 0.6 })
        );
        sofaBack.position.set(0.52, 0.62, 0);
        sofaGroup.add(sofaBase, sofaBack);
        scene.add(sofaGroup);

        registerSeatMesh('music-sofa-1', [sofaBase, sofaBack], -16.2, -2.0, null);
        registerSeatMesh('music-sofa-2', [sofaBase, sofaBack], -16.2, 2.0, null);

        // Beanbag Chill Seats (music-sofa-3 & music-sofa-4)
        [-5.2, 5.2].forEach((zVal, idx) => {
            const seatId = idx === 0 ? 'music-sofa-3' : 'music-sofa-4';
            const bag = new THREE.Mesh(
                new THREE.SphereGeometry(0.75, 16, 12),
                new THREE.MeshStandardMaterial({ color: idx === 0 ? 0xdb2777 : 0x7c3aed, roughness: 0.7 })
            );
            bag.scale.set(1.1, 0.6, 1.1);
            bag.position.set(-19.5, 0.32, zVal);
            scene.add(bag);
            registerSeatMesh(seatId, [bag], -19.5, zVal, null);
        });

        // DJ Booth & Ambient DJ NPC in Music Room Corner (x: -22.5, z: -8.6)
        const djDesk = new THREE.Mesh(
            new THREE.BoxGeometry(3.2, 1.05, 1.2),
            new THREE.MeshStandardMaterial({ color: 0x0f172a, emissive: 0x1e3a8a, emissiveIntensity: 0.25 })
        );
        djDesk.position.set(-22.5, 0.52, -8.4);
        scene.add(djDesk);

        djNpcGroup = createAvatarMesh({
            username: '🎧 DJ Bot 2937',
            role: 'admin',
            isPremium: true,
            color: '#f472b6',
            hat: 'headphones',
            hair: 'spiky',
            hairColor: '#38bdf8',
            skinColor: '#ffe0c8',
            statusText: '🔥 Mix Nhạc Live'
        }, false);
        djNpcGroup.position.set(-22.5, 0, -9.4);
        djNpcGroup.rotation.y = 0;
        scene.add(djNpcGroup);
    }

    // =========================================================================
    // 3. ROOM 2: PHÒNG HỌC TẬP 3D (EAST WING: x = +6 to +28, z = -11 to +11)
    // =========================================================================
    function buildStudyLibraryRoom() {
        // Warm Wood Flooring
        const floorGeo = new THREE.BoxGeometry(22, 0.1, 22);
        const floorMat = new THREE.MeshStandardMaterial({ color: 0x3b2618, roughness: 0.65 });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.position.set(17, 0, 0);
        floor.receiveShadow = true;
        scene.add(floor);

        // Study Room Warm Lighting
        const studyLight1 = new THREE.PointLight(0xfef3c7, 1.05, 22);
        studyLight1.position.set(15, 6.8, -4);
        const studyLight2 = new THREE.PointLight(0xfef3c7, 1.05, 22);
        studyLight2.position.set(15, 6.8, 4);
        scene.add(studyLight1, studyLight2);

        // Study Room Walls (East Wall at x=+28, North Wall z=-11, South Wall z=+11, West Wall x=+6 with open doorway)
        const wallMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.75 });
        const eastWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 8.2, 22), wallMat);
        eastWall.position.set(28, 4.1, 0);
        const northWall = new THREE.Mesh(new THREE.BoxGeometry(22, 8.2, 0.4), wallMat);
        northWall.position.set(17, 4.1, -11);
        const southWall = new THREE.Mesh(new THREE.BoxGeometry(22, 8.2, 0.4), wallMat);
        southWall.position.set(17, 4.1, 11);

        const westWallLeft = new THREE.Mesh(new THREE.BoxGeometry(0.4, 8.2, 7.8), wallMat);
        westWallLeft.position.set(6, 4.1, -7.1);
        const westWallRight = new THREE.Mesh(new THREE.BoxGeometry(0.4, 8.2, 7.8), wallMat);
        westWallRight.position.set(6, 4.1, 7.1);
        const westWallTop = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.4, 6.4), wallMat);
        westWallTop.position.set(6, 7.0, 0);
        scene.add(eastWall, northWall, southWall, westWallLeft, westWallRight, westWallTop);

        // Doorway Header Sign: "PHÒNG HỌC TẬP 3D"
        const doorSign = createSignBoardMesh('📖 PHÒNG HỌC TẬP 3D', '#4ade80', '#090d16', 4.6, 0.85);
        doorSign.rotation.y = -Math.PI / 2;
        doorSign.position.set(5.72, 6.3, 0);
        scene.add(doorSign);

        // --- 3D SMART CHALKBOARD / POMODORO BOARD ON EAST WALL (x = 27.6) ---
        studyBoardCanvas = document.createElement('canvas');
        studyBoardCanvas.width = 1024;
        studyBoardCanvas.height = 512;
        studyBoardCtx = studyBoardCanvas.getContext('2d');
        studyBoardTexture = new THREE.CanvasTexture(studyBoardCanvas);

        const boardFrame = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 4.6, 9.2),
            new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 })
        );
        boardFrame.position.set(27.65, 4.1, 0);
        scene.add(boardFrame);

        const boardScreen = new THREE.Mesh(
            new THREE.PlaneGeometry(8.8, 4.2),
            new THREE.MeshBasicMaterial({ map: studyBoardTexture })
        );
        boardScreen.rotation.y = -Math.PI / 2;
        boardScreen.position.set(27.52, 4.1, 0);
        scene.add(boardScreen);

        // --- TALL 3D BOOKSHELVES ALONG NORTH & SOUTH WALLS ---
        [-10.1, 10.1].forEach((zSide) => {
            for (let bx = 9.5; bx <= 24.5; bx += 5.0) {
                createBookshelf(bx, zSide);
            }
        });

        // --- 6 INTERACTIVE STUDY DESKS & CHAIRS (BÀN GHẾ HỌC TẬP) ---
        CAMPUS_SEATS.filter(s => s.room === 'study').forEach((seat, idx) => {
            createStudyDeskAndChair(seat, idx + 1);
        });
    }

    function createStudyDeskAndChair(seat, deskNum) {
        const group = new THREE.Group();
        group.position.set(seat.x, 0, seat.z);

        // Wooden Desk Top
        const topMesh = new THREE.Mesh(
            new THREE.BoxGeometry(1.35, 0.1, 2.2),
            new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.55 })
        );
        topMesh.position.y = 1.05;
        topMesh.castShadow = true;
        group.add(topMesh);

        // Desk Legs
        const legMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6 });
        [[-0.55, -0.95], [0.55, -0.95], [-0.55, 0.95], [0.55, 0.95]].forEach(([lx, lz]) => {
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.05, 8), legMat);
            leg.position.set(lx, 0.525, lz);
            group.add(leg);
        });

        // 3D Laptop on Desk
        const laptopBase = new THREE.Mesh(
            new THREE.BoxGeometry(0.45, 0.03, 0.62),
            new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.7 })
        );
        laptopBase.position.set(-0.1, 1.12, 0);
        const laptopScreen = new THREE.Mesh(
            new THREE.BoxGeometry(0.03, 0.38, 0.62),
            new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
        );
        laptopScreen.position.set(0.12, 1.3, 0);
        laptopScreen.rotation.z = -0.22;
        group.add(laptopBase, laptopScreen);

        // Stack of Books on Desk
        const book1 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.07, 0.48), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
        book1.position.set(0.1, 1.14, -0.68);
        const book2 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.07, 0.45), new THREE.MeshStandardMaterial({ color: 0x3b82f6 }));
        book2.position.set(0.1, 1.21, -0.68);
        group.add(book1, book2);

        // Warm Study Lamp on Desk
        const lampStand = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.08, 0.5, 8), legMat);
        lampStand.position.set(0.32, 1.32, 0.72);
        const lampShade = new THREE.Mesh(
            new THREE.ConeGeometry(0.2, 0.22, 12),
            new THREE.MeshStandardMaterial({ color: 0xfde047, emissive: 0xfacc15, emissiveIntensity: 0.8 })
        );
        lampShade.position.set(0.26, 1.56, 0.72);
        group.add(lampStand, lampShade);

        const deskLight = new THREE.PointLight(0xfde047, 0.35, 4.5);
        deskLight.position.set(seat.x, 1.75, seat.z + 0.6);
        scene.add(deskLight);

        // Desk Number Floating Plaque
        const badge = createSignBoardMesh(`Bàn #${deskNum}`, '#fde047', '#1e293b', 0.95, 0.34);
        badge.rotation.y = -Math.PI / 2;
        badge.position.set(-0.68, 1.48, 0.72);
        group.add(badge);

        // --- ERGONOMIC STUDY CHAIR (Positioned at seat.chairX, seat.chairZ) ---
        const chairGroup = new THREE.Group();
        chairGroup.position.set(seat.chairX - seat.x, 0, 0);

        const seatCushion = new THREE.Mesh(
            new THREE.BoxGeometry(0.75, 0.1, 0.75),
            new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.5 })
        );
        seatCushion.position.y = 0.54;
        const chairBack = new THREE.Mesh(
            new THREE.BoxGeometry(0.12, 0.72, 0.72),
            new THREE.MeshStandardMaterial({ color: 0x0369a1, roughness: 0.5 })
        );
        chairBack.position.set(-0.34, 0.92, 0);
        const chairPedestal = new THREE.Mesh(
            new THREE.CylinderGeometry(0.06, 0.28, 0.54, 10),
            legMat
        );
        chairPedestal.position.y = 0.27;
        chairGroup.add(seatCushion, chairBack, chairPedestal);
        group.add(chairGroup);

        scene.add(group);
        registerSeatMesh(seat.id, [topMesh, seatCushion, chairBack], seat.chairX, seat.chairZ, deskLight);
    }

    function createBookshelf(x, z) {
        const shelfGroup = new THREE.Group();
        shelfGroup.position.set(x, 0, z);
        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(3.6, 4.8, 0.7),
            new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.8 })
        );
        frame.position.y = 2.4;
        shelfGroup.add(frame);

        const bookColors = [0xef4444, 0x38bdf8, 0x10b981, 0xf59e0b, 0xa855f7, 0xec4899];
        for (let row = 0; row < 4; row++) {
            for (let b = -1.3; b <= 1.3; b += 0.32) {
                const book = new THREE.Mesh(
                    new THREE.BoxGeometry(0.24, 0.65, 0.76),
                    new THREE.MeshStandardMaterial({ color: bookColors[Math.abs(Math.round((row * 7 + b * 10))) % bookColors.length] })
                );
                book.position.set(b, 0.9 + row * 1.05, 0);
                shelfGroup.add(book);
            }
        }
        scene.add(shelfGroup);
    }

    function registerSeatMesh(seatId, hitMeshes, ringX, ringZ, lampLight) {
        const ringGeo = new THREE.RingGeometry(0.55, 0.72, 24);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.5
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = -Math.PI / 2;
        ringMesh.position.set(ringX, 0.05, ringZ);
        scene.add(ringMesh);

        hitMeshes.forEach(m => {
            m.userData = { seatId };
            clickableSeatMeshes.push(m);
        });
        seatMeshes.set(seatId, { ringMesh, lampLight, hitMeshes });
    }

    function createSignBoardMesh(text, fgColor, bgColor, w = 3.6, h = 0.68) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 112;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, 512, 112);
        ctx.strokeStyle = fgColor;
        ctx.lineWidth = 6;
        ctx.strokeRect(4, 4, 504, 104);
        ctx.fillStyle = fgColor;
        ctx.font = 'bold 28px "Nunito", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 256, 56);

        const tex = new THREE.CanvasTexture(canvas);
        return new THREE.Mesh(
            new THREE.PlaneGeometry(w, h),
            new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide })
        );
    }

    // =========================================================================
    // 4. PLAY TOGETHER CHIBI 3D CHARACTER BUILDER, OVERHEAD BUBBLES & POSES
    // =========================================================================
    function clearThreeGroup(grp) {
        while (grp.children.length > 0) {
            const child = grp.children[grp.children.length - 1];
            grp.remove(child);
            if (child.children && child.children.length) clearThreeGroup(child);
            if (child.geometry) child.geometry.dispose();
        }
    }

    function resolveAvatarInfo(rawInfo) {
        const nameSeed = rawInfo.username || 'player';
        const isDefaultStarter = !rawInfo.hair && !rawInfo.topStyle && !rawInfo.shoesStyle && !rawInfo.hat;
        return {
            username: rawInfo.username || 'Thành viên',
            role: rawInfo.role || 'member',
            isPremium: !!rawInfo.isPremium,
            color: rawInfo.color || (isDefaultStarter ? '#ffffff' : AVATAR_COLORS[hashStringIndex(nameSeed, AVATAR_COLORS.length)]),
            shortsColor: rawInfo.shortsColor || SHORTS_COLORS[0],
            topStyle: rawInfo.topStyle || 'sleeveless',
            shoesStyle: rawInfo.shoesStyle || 'slippers',
            face: rawInfo.face || 'basic',
            hat: rawInfo.hat || 'none',
            hair: rawInfo.hair || 'messy',
            hairColor: rawInfo.hairColor || HAIR_COLORS[0],
            skinColor: rawInfo.skinColor || SKIN_COLORS[0],
            statusText: rawInfo.statusText || '',
            seatId: rawInfo.seatId || null
        };
    }

    function makeToonMat(colorHex, extra = {}) {
        const c = new THREE.Color(colorHex);
        return new THREE.MeshLambertMaterial({
            color: c,
            emissive: c,
            emissiveIntensity: extra.emissiveIntensity ?? 0.24,
            ...extra
        });
    }

    function drawPlayTogetherFaceCanvas(canvas, skinHex, faceStyle, isBlink) {
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        ctx.fillStyle = skinHex || '#ffe2c6';
        ctx.fillRect(0, 0, w, h);

        // Front vertex (+Z) of SphereGeometry maps to u=0.25 (cx=128), v=0.50 (cy=128)
        const cx = 128;
        const cy = 128;
        const ink = '#1e1918';

        // Soft warm cheek blush (subtle on basic, brighter on shy/happy)
        const blushAlpha = faceStyle === 'shy' ? 0.48 : (faceStyle === 'happy' ? 0.28 : 0.14);
        ctx.fillStyle = `rgba(251, 146, 158, ${blushAlpha})`;
        ctx.beginPath();
        ctx.ellipse(cx - 38, cy + 16, 11, 6.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx + 38, cy + 16, 11, 6.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eyebrows (arched Play Together brows cleanly above eyes)
        ctx.strokeStyle = ink;
        ctx.lineCap = 'round';
        ctx.lineWidth = 3.8;
        ctx.beginPath();
        ctx.arc(cx - 25, cy - 11, 11, Math.PI * 1.24, Math.PI * 1.72);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx + 25, cy - 11, 11, Math.PI * 1.28, Math.PI * 1.76);
        ctx.stroke();

        // Eyes (Open / Happy / Wink / Blinking)
        const eyeOffsets = [-25, 25];
        eyeOffsets.forEach((dx, idx) => {
            const ex = cx + dx;
            const ey = cy + 1;
            if (isBlink) {
                ctx.lineWidth = 3.6;
                ctx.beginPath();
                ctx.moveTo(ex - 6, ey + 1);
                ctx.quadraticCurveTo(ex, ey + 4, ex + 6, ey + 1);
                ctx.stroke();
            } else if (faceStyle === 'happy') {
                ctx.lineWidth = 4.2;
                ctx.beginPath();
                ctx.arc(ex, ey + 5, 7, Math.PI * 1.15, Math.PI * 1.85);
                ctx.stroke();
            } else if (faceStyle === 'wink' && idx === 1) {
                ctx.lineWidth = 4.0;
                ctx.beginPath();
                ctx.moveTo(ex - 6, ey - 2);
                ctx.lineTo(ex + 5, ey + 1);
                ctx.lineTo(ex - 6, ey + 4);
                ctx.stroke();
            } else {
                // Classic Play Together Basic Face crisp black dot eyes
                ctx.fillStyle = ink;
                ctx.beginPath();
                ctx.ellipse(ex, ey, 5.2, 6.0, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        // Tiny soft pink/peach nose mark just below eye line
        ctx.fillStyle = '#f3a69e';
        ctx.beginPath();
        ctx.ellipse(cx, cy + 10, 4.2, 2.8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Cute smiling mouth directly below nose
        ctx.strokeStyle = ink;
        ctx.lineWidth = 3.6;
        if (faceStyle === 'happy') {
            ctx.fillStyle = '#f43f5e';
            ctx.beginPath();
            ctx.arc(cx, cy + 16, 10, 0.05 * Math.PI, 0.95 * Math.PI);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.arc(cx, cy + 14, 9.5, 0.2 * Math.PI, 0.8 * Math.PI);
            ctx.stroke();
        }
    }

    function refreshAvatarFaceTextures(ud) {
        if (!ud || !ud.faceCanvasOpen || !ud.faceCanvasBlink) return;
        const skinHex = ud.info.skinColor || '#ffe2c6';
        const faceStyle = ud.info.face || 'basic';
        drawPlayTogetherFaceCanvas(ud.faceCanvasOpen, skinHex, faceStyle, false);
        drawPlayTogetherFaceCanvas(ud.faceCanvasBlink, skinHex, faceStyle, true);
        ud.faceTexOpen.needsUpdate = true;
        ud.faceTexBlink.needsUpdate = true;
    }

    function createAvatarMesh(rawInfo, isSelf) {
        const info = resolveAvatarInfo(rawInfo);
        const group = new THREE.Group();
        const bodyRoot = new THREE.Group();
        group.add(bodyRoot);

        const skinMat = makeToonMat(info.skinColor, { emissiveIntensity: 0.28 });
        const shirtMat = makeToonMat(info.color, { emissiveIntensity: 0.30 });
        const shortsC = new THREE.Color(info.shortsColor);
        const shortsMat = makeToonMat(shortsC, { emissiveIntensity: 0.24 });
        const shortsCuffColor = shortsC.clone().lerp(new THREE.Color('#ffffff'), 0.28);
        const shortsCuffMat = makeToonMat(shortsCuffColor, { emissiveIntensity: 0.26 });

        // Soft Ground Shadow Disc
        const shadow = new THREE.Mesh(
            new THREE.CircleGeometry(0.36, 20),
            new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.34 })
        );
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.y = 0.025;
        group.add(shadow);

        // Two-Joint Play Together Legs (Hip at y = 0.72, Knee at y = -0.30 inside hip -> Floor at y = 0)
        const shoesGroups = [];
        const kneePivots = [];
        const buildLeg = (xOffset, sideSign) => {
            const hipPivot = new THREE.Group();
            hipPivot.position.set(xOffset, 0.72, 0);

            // Upper shorts thigh leg
            const shortsLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.102, 0.096, 0.27, 14), shortsMat);
            shortsLeg.position.y = -0.145;
            hipPivot.add(shortsLeg);

            // Light cyan shorts folded cuff hem
            const shortsCuff = new THREE.Mesh(new THREE.CylinderGeometry(0.103, 0.105, 0.06, 14), shortsCuffMat);
            shortsCuff.position.y = -0.275;
            hipPivot.add(shortsCuff);

            // Knee Joint (bends cleanly 90° downward when sitting on Study Desks / Sofas!)
            const kneePivot = new THREE.Group();
            kneePivot.position.set(0, -0.30, 0);
            hipPivot.add(kneePivot);
            kneePivots.push(kneePivot);

            // Slim bare peach calf (0 -> -0.37)
            const calf = new THREE.Mesh(new THREE.CylinderGeometry(0.064, 0.056, 0.37, 12), skinMat);
            calf.position.y = -0.185;
            kneePivot.add(calf);

            // Footwear Container (Slippers or Sneakers anchored at ankle -0.37 down to -0.42)
            const shoesGrp = new THREE.Group();
            shoesGrp.position.set(0, -0.37, 0);
            kneePivot.add(shoesGrp);
            shoesGroups.push({ grp: shoesGrp, side: sideSign });

            return hipPivot;
        };

        const leftLegPivot = buildLeg(-0.112, -1);
        const rightLegPivot = buildLeg(0.112, 1);
        bodyRoot.add(leftLegPivot, rightLegPivot);

        // Shorts Waistband & Pelvis connecting torso smoothly to legs
        const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(0.195, 0.205, 0.17, 18), shortsMat);
        pelvis.scale.set(1.06, 1.0, 0.72);
        pelvis.position.y = 0.77;
        bodyRoot.add(pelvis);

        // Clean Play Together Slim Slightly-Tapered Torso (y = 0.84 -> 1.36)
        const torsoPts = [
            new THREE.Vector2(0.00, 0.00),
            new THREE.Vector2(0.192, 0.02),
            new THREE.Vector2(0.188, 0.16),
            new THREE.Vector2(0.212, 0.34),
            new THREE.Vector2(0.202, 0.49),
            new THREE.Vector2(0.112, 0.54),
            new THREE.Vector2(0.00, 0.54)
        ];
        const torsoGeo = new THREE.LatheGeometry(torsoPts, 20);
        const torso = new THREE.Mesh(torsoGeo, shirtMat);
        torso.scale.set(1.06, 1.0, 0.70);
        torso.position.y = 0.83;
        torso.castShadow = true;
        bodyRoot.add(torso);

        // Top Extras Group (hoodie pocket / collar trim depending on topStyle)
        const topExtrasGroup = new THREE.Group();
        bodyRoot.add(topExtrasGroup);

        // Long Slim Play Together Arms & Splayed Hands (pivots at shoulders x = ±0.222, y = 1.30)
        const armSleeveGroups = [];
        const buildArm = (xOffset, sideSign) => {
            const pivot = new THREE.Group();
            pivot.position.set(xOffset, 1.30, 0);
            pivot.rotation.z = sideSign * 0.30; // Iconic relaxed Play Together A-frame arm pose!

            // Slim bare upper-to-forearm peach limb (0 -> -0.45)
            const shoulderCap = new THREE.Mesh(new THREE.SphereGeometry(0.056, 12, 10), skinMat);
            pivot.add(shoulderCap);

            const armTube = new THREE.Mesh(new THREE.CylinderGeometry(0.054, 0.048, 0.45, 12), skinMat);
            armTube.position.y = -0.225;
            pivot.add(armTube);

            // Sleeve overlay group (empty for sleeveless, short sleeve for tee, full sleeve for hoodie)
            const sleeveGrp = new THREE.Group();
            pivot.add(sleeveGrp);
            armSleeveGroups.push(sleeveGrp);

            // Cute Play Together Flattened Palm + Inner Thumb
            const handGrp = new THREE.Group();
            handGrp.position.set(0, -0.48, 0);
            const palm = new THREE.Mesh(new THREE.SphereGeometry(0.062, 12, 10), skinMat);
            palm.scale.set(0.88, 1.25, 0.52);
            handGrp.add(palm);

            const thumb = new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.020, 0.075, 8), skinMat);
            thumb.position.set(-sideSign * 0.048, 0.005, 0.015);
            thumb.rotation.z = sideSign * 0.65;
            handGrp.add(thumb);

            pivot.add(handGrp);
            return pivot;
        };

        const leftArmPivot = buildArm(-0.222, -1);
        const rightArmPivot = buildArm(0.222, 1);
        bodyRoot.add(leftArmPivot, rightArmPivot);

        // Slim Neck + Wide Rounded Chibi Head with Play Together Basic Face CanvasTexture
        const headGroup = new THREE.Group();
        headGroup.position.y = 1.71;

        const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.076, 0.16, 12), skinMat);
        neck.position.y = -0.32;
        headGroup.add(neck);

        const faceCanvasOpen = document.createElement('canvas');
        faceCanvasOpen.width = 512;
        faceCanvasOpen.height = 256;
        const faceTexOpen = new THREE.CanvasTexture(faceCanvasOpen);

        const faceCanvasBlink = document.createElement('canvas');
        faceCanvasBlink.width = 512;
        faceCanvasBlink.height = 256;
        const faceTexBlink = new THREE.CanvasTexture(faceCanvasBlink);

        const headMat = new THREE.MeshLambertMaterial({
            map: faceTexOpen,
            emissive: 0xffffff,
            emissiveMap: faceTexOpen,
            emissiveIntensity: 0.28
        });

        const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.35, 32, 24), headMat);
        headMesh.scale.set(1.10, 0.94, 0.96);
        headMesh.castShadow = true;
        headGroup.add(headMesh);

        // Prominent Cute Rounded Ears (like Play Together reference!)
        [-1, 1].forEach((side) => {
            const ear = new THREE.Mesh(new THREE.SphereGeometry(0.080, 12, 10), skinMat);
            ear.scale.set(0.46, 0.95, 0.65);
            ear.position.set(side * 0.375, -0.03, 0.0);
            headGroup.add(ear);
        });

        // Hair & Hat Groups
        const hairGroup = new THREE.Group();
        const hatGroup = new THREE.Group();
        headGroup.add(hairGroup, hatGroup);
        bodyRoot.add(headGroup);

        // Sprite 1: Compact Play Together Nameplate Tag
        const npCanvas = document.createElement('canvas');
        npCanvas.width = 512;
        npCanvas.height = 96;
        const npTex = new THREE.CanvasTexture(npCanvas);
        const npSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: npTex, transparent: true, depthTest: false }));
        npSprite.scale.set(2.35, 0.44, 1);
        npSprite.position.y = 2.52;
        npSprite.renderOrder = 10;
        group.add(npSprite);

        // Sprite 2: Play Together Overhead White Cartoon Speech Bubble (Hidden until chatting!)
        const bubbleCanvas = document.createElement('canvas');
        bubbleCanvas.width = 640;
        bubbleCanvas.height = 256;
        const bubbleTex = new THREE.CanvasTexture(bubbleCanvas);
        const bubbleMat = new THREE.SpriteMaterial({ map: bubbleTex, transparent: true, depthTest: false });
        const bubbleSprite = new THREE.Sprite(bubbleMat);
        bubbleSprite.scale.set(3.25, 1.30, 1);
        bubbleSprite.position.y = 3.24;
        bubbleSprite.visible = false;
        bubbleSprite.renderOrder = 12;
        group.add(bubbleSprite);

        group.userData = {
            bodyRoot,
            shadow,
            torso,
            topExtrasGroup,
            armSleeveGroups,
            shoesGroups,
            kneePivots,
            skinMat,
            shirtMat,
            shortsMat,
            shortsCuffMat,
            headMat,
            faceCanvasOpen,
            faceTexOpen,
            faceCanvasBlink,
            faceTexBlink,
            isCurrentlyBlinking: false,
            headGroup,
            hairGroup,
            hatGroup,
            leftLegPivot,
            rightLegPivot,
            leftArmPivot,
            rightArmPivot,
            npCanvas,
            npTex,
            npSprite,
            bubbleCanvas,
            bubbleTex,
            bubbleMat,
            bubbleSprite,
            bubbleBornAt: 0,
            bubbleExpireAt: 0,
            emoteAction: '',
            emoteUntil: 0,
            blinkPhase: Math.random() * 4.5,
            info,
            isSelf
        };

        applyAvatarAppearanceToMesh(group, info);
        return group;
    }

    function buildShoesStyle(shoesGroups, shoesStyle, skinMat, shirtColorHex) {
        const soleMat = makeToonMat('#262629', { emissiveIntensity: 0.16 });
        const strapMat = makeToonMat('#ffffff', { emissiveIntensity: 0.35 });
        const shoeColorMat = makeToonMat(shirtColorHex === '#ffffff' ? '#38bdf8' : shirtColorHex, { emissiveIntensity: 0.25 });

        shoesGroups.forEach(({ grp }) => {
            clearThreeGroup(grp);
            if (shoesStyle === 'sneakers') {
                const body = new THREE.Mesh(new THREE.SphereGeometry(0.088, 12, 10), shoeColorMat);
                body.scale.set(0.95, 0.72, 1.45);
                body.position.set(0, -0.015, 0.035);
                const sole = new THREE.Mesh(new THREE.CylinderGeometry(0.086, 0.090, 0.032, 12), strapMat);
                sole.scale.set(0.95, 1, 1.45);
                sole.position.set(0, -0.036, 0.035);
                grp.add(body, sole);
            } else {
                // Play Together "White Striped Slippers": flat dark sole + visible peach toes + white strap!
                const sole = new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.074, 0.024, 14), soleMat);
                sole.scale.set(1.0, 1.0, 1.62);
                sole.position.set(0, -0.038, 0.035);

                const foot = new THREE.Mesh(new THREE.SphereGeometry(0.056, 12, 10), skinMat);
                foot.scale.set(0.92, 0.45, 1.38);
                foot.position.set(0, -0.016, 0.038);

                // White strap across the instep (like White Striped Slippers icon!)
                const strap = new THREE.Mesh(new THREE.TorusGeometry(0.054, 0.015, 8, 14, Math.PI), strapMat);
                strap.scale.set(1.02, 0.88, 1.15);
                strap.position.set(0, -0.014, 0.048);
                strap.rotation.x = 0.25;

                grp.add(sole, foot, strap);
            }
        });
    }

    function buildTopStyleExtras(ud) {
        clearThreeGroup(ud.topExtrasGroup);
        ud.armSleeveGroups.forEach(sg => clearThreeGroup(sg));

        const topStyle = ud.info.topStyle || 'sleeveless';
        const whiteTrimMat = makeToonMat('#ffffff', { emissiveIntensity: 0.30 });

        if (topStyle === 'tee') {
            ud.armSleeveGroups.forEach(sg => {
                const cap = new THREE.Mesh(new THREE.SphereGeometry(0.068, 12, 10), ud.shirtMat);
                const slv = new THREE.Mesh(new THREE.CylinderGeometry(0.066, 0.070, 0.16, 12), ud.shirtMat);
                slv.position.y = -0.08;
                sg.add(cap, slv);
            });
        } else if (topStyle === 'hoodie') {
            ud.armSleeveGroups.forEach(sg => {
                const cap = new THREE.Mesh(new THREE.SphereGeometry(0.070, 12, 10), ud.shirtMat);
                const slv = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.072, 0.40, 12), ud.shirtMat);
                slv.position.y = -0.20;
                sg.add(cap, slv);
            });
            const pocket = new THREE.Mesh(new THREE.SphereGeometry(0.115, 12, 10), whiteTrimMat);
            pocket.scale.set(1.18, 0.65, 0.30);
            pocket.position.set(0, 0.96, 0.145);
            const collar = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.032, 8, 18), ud.shirtMat);
            collar.rotation.x = Math.PI / 2;
            collar.position.set(0, 1.36, -0.01);
            ud.topExtrasGroup.add(pocket, collar);
        } else {
            // 'sleeveless': clean tank neckline trim
            const scoop = new THREE.Mesh(new THREE.TorusGeometry(0.095, 0.016, 8, 18), ud.shirtMat);
            scoop.rotation.x = Math.PI / 2 + 0.18;
            scoop.position.set(0, 1.365, 0.01);
            ud.topExtrasGroup.add(scoop);
        }
    }

    function applyAvatarAppearanceToMesh(group, patch) {
        const ud = group?.userData;
        if (!ud) return;
        const info = { ...ud.info, ...patch };
        ud.info = info;

        const c = new THREE.Color(info.color || '#ffffff');
        ud.shirtMat.color.copy(c);
        ud.shirtMat.emissive.copy(c);

        const sc = new THREE.Color(info.shortsColor || '#228be6');
        ud.shortsMat.color.copy(sc);
        ud.shortsMat.emissive.copy(sc);
        const cuffC = sc.clone().lerp(new THREE.Color('#ffffff'), 0.28);
        ud.shortsCuffMat.color.copy(cuffC);
        ud.shortsCuffMat.emissive.copy(cuffC);

        const skinC = new THREE.Color(info.skinColor || '#ffe2c6');
        ud.skinMat.color.copy(skinC);
        ud.skinMat.emissive.copy(skinC);

        refreshAvatarFaceTextures(ud);
        buildTopStyleExtras(ud);
        buildShoesStyle(ud.shoesGroups, info.shoesStyle, ud.skinMat, info.color);
        buildHairStyle(ud.hairGroup, info.hair, info.hairColor);
        buildHatAccessory(ud.hatGroup, info.hat, sc);
        drawAvatarNameplate(group);
    }

    function buildHairStyle(hairGroup, hairType, hairColorHex) {
        clearThreeGroup(hairGroup);
        const hairMat = makeToonMat(hairColorHex || '#38302e', { emissiveIntensity: 0.22 });

        // Base crown dome fitting outside headMesh (r=0.35 -> r=0.366) while leaving forehead eyebrows clear
        const cap = new THREE.Mesh(
            new THREE.SphereGeometry(0.366, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.50),
            hairMat
        );
        cap.scale.set(1.12, 0.96, 0.99);
        cap.position.y = 0.032;
        hairGroup.add(cap);

        if (hairType === 'bob') {
            const backBob = new THREE.Mesh(
                new THREE.SphereGeometry(0.372, 22, 16, Math.PI * 0.62, Math.PI * 1.76, Math.PI * 0.25, Math.PI * 0.56),
                hairMat
            );
            backBob.scale.set(1.11, 0.97, 1.00);
            hairGroup.add(backBob);

            [-0.14, 0, 0.14].forEach((bx) => {
                const bang = new THREE.Mesh(new THREE.SphereGeometry(0.115, 12, 10), hairMat);
                bang.scale.set(1.25, 0.72, 0.65);
                bang.position.set(bx, 0.21, 0.27 - Math.abs(bx) * 0.14);
                hairGroup.add(bang);
            });
        } else if (hairType === 'spiky') {
            const backHair = new THREE.Mesh(
                new THREE.SphereGeometry(0.370, 18, 14, Math.PI * 0.70, Math.PI * 1.60, Math.PI * 0.30, Math.PI * 0.44),
                hairMat
            );
            backHair.scale.set(1.10, 0.96, 1.00);
            hairGroup.add(backHair);

            [
                { x: -0.17, y: 0.23, z: 0.26, rz: 0.45, rx: 0.55 },
                { x: -0.05, y: 0.27, z: 0.28, rz: 0.16, rx: 0.62 },
                { x: 0.08, y: 0.27, z: 0.28, rz: -0.16, rx: 0.60 },
                { x: 0.19, y: 0.22, z: 0.25, rz: -0.45, rx: 0.55 }
            ].forEach(sp => {
                const cone = new THREE.Mesh(new THREE.ConeGeometry(0.088, 0.21, 8), hairMat);
                cone.position.set(sp.x, sp.y, sp.z);
                cone.rotation.set(sp.rx, 0, sp.rz);
                hairGroup.add(cone);
            });
        } else if (hairType === 'ponytail') {
            [-0.12, 0.12].forEach((bx) => {
                const bang = new THREE.Mesh(new THREE.SphereGeometry(0.135, 12, 10), hairMat);
                bang.scale.set(1.28, 0.62, 0.62);
                bang.position.set(bx, 0.22, 0.27);
                hairGroup.add(bang);
            });
            const tie = new THREE.Mesh(
                new THREE.TorusGeometry(0.072, 0.025, 8, 14),
                new THREE.MeshBasicMaterial({ color: 0xf472b6 })
            );
            tie.position.set(0, 0.14, -0.37);
            tie.rotation.x = 0.4;
            const tail = new THREE.Mesh(new THREE.ConeGeometry(0.145, 0.46, 12), hairMat);
            tail.position.set(0, -0.02, -0.45);
            tail.rotation.x = -2.65;
            hairGroup.add(tie, tail);
        } else if (hairType === 'twintails') {
            const fringe = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.28, 0.12, 16, 1, false, -0.8, 1.6), hairMat);
            fringe.position.set(0, 0.20, 0.12);
            hairGroup.add(fringe);

            [-1, 1].forEach((side) => {
                const ribbon = new THREE.Mesh(
                    new THREE.TorusGeometry(0.088, 0.025, 8, 14),
                    new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
                );
                ribbon.position.set(side * 0.34, 0.23, -0.03);
                ribbon.rotation.z = side * -0.7;
                const bun = new THREE.Mesh(new THREE.SphereGeometry(0.155, 14, 12), hairMat);
                bun.position.set(side * 0.39, 0.29, -0.03);
                hairGroup.add(ribbon, bun);
            });
        } else {
            // 'messy' (Play Together "Brown Messy Hair" from exact reference!)
            // Full back hair down to nape with V-notched twin tails
            const backSkirt = new THREE.Mesh(
                new THREE.SphereGeometry(0.370, 22, 14, Math.PI * 0.72, Math.PI * 1.56, Math.PI * 0.34, Math.PI * 0.42),
                hairMat
            );
            backSkirt.scale.set(1.12, 0.99, 1.02);
            hairGroup.add(backSkirt);

            // Two pointed nape tails at the back (visible clearly in rear view!)
            [-1, 1].forEach((side) => {
                const napeLock = new THREE.Mesh(new THREE.ConeGeometry(0.105, 0.25, 7), hairMat);
                napeLock.scale.set(1.0, 1.0, 0.45);
                napeLock.position.set(side * 0.18, -0.23, -0.21);
                napeLock.rotation.set(Math.PI - 0.24, 0, side * 0.36);
                hairGroup.add(napeLock);
            });

            // Asymmetric swept front bangs cleanly above eyebrows
            const bangLeft = new THREE.Mesh(new THREE.SphereGeometry(0.145, 12, 10), hairMat);
            bangLeft.scale.set(1.42, 0.65, 0.62);
            bangLeft.position.set(-0.14, 0.21, 0.25);
            bangLeft.rotation.z = -0.22;

            const bangRight = new THREE.Mesh(new THREE.SphereGeometry(0.132, 12, 10), hairMat);
            bangRight.scale.set(1.35, 0.62, 0.60);
            bangRight.position.set(0.16, 0.22, 0.23);
            bangRight.rotation.z = 0.28;

            const sweepTip = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.21, 7), hairMat);
            sweepTip.scale.set(1.0, 1.0, 0.42);
            sweepTip.position.set(-0.04, 0.175, 0.315);
            sweepTip.rotation.set(0.25, 0, 1.05);
            hairGroup.add(bangLeft, bangRight, sweepTip);

            // Signature outward spiky tufts above ears & messy crown puffs (visible from front & back!)
            const messyTufts = [
                { pos: [-0.36, 0.15, 0.00], rot: [0.0, 0.0,  1.05], r: 0.088, h: 0.21 },
                { pos: [-0.39, 0.04, -0.04], rot: [0.0, 0.0,  1.45], r: 0.082, h: 0.19 },
                { pos: [ 0.39, 0.09, -0.02], rot: [0.0, 0.0, -1.38], r: 0.094, h: 0.23 },
                { pos: [ 0.29, 0.23, -0.04], rot: [0.0, 0.0, -0.82], r: 0.082, h: 0.19 },
                { pos: [-0.14, 0.33, -0.05], rot: [0.0, 0.0,  0.42], r: 0.080, h: 0.17 }
            ];
            messyTufts.forEach(tf => {
                const tMesh = new THREE.Mesh(new THREE.ConeGeometry(tf.r, tf.h, 7), hairMat);
                tMesh.scale.set(1.0, 1.0, 0.58);
                tMesh.position.set(tf.pos[0], tf.pos[1], tf.pos[2]);
                tMesh.rotation.set(tf.rot[0], tf.rot[1], tf.rot[2]);
                hairGroup.add(tMesh);
            });
        }
    }

    function buildHatAccessory(hatGroup, hatType, mainColor) {
        clearThreeGroup(hatGroup);
        if (hatType === 'none') return;

        if (hatType === 'duck') {
            const yellowMat = makeToonMat(0xfacc15);
            const billMat = makeToonMat(0xf97316);
            const capTop = new THREE.Mesh(
                new THREE.SphereGeometry(0.386, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.45),
                yellowMat
            );
            capTop.scale.set(1.10, 0.92, 1.02);
            capTop.position.y = 0.075;
            const bill = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 10), billMat);
            bill.scale.set(1.35, 0.42, 1.15);
            bill.position.set(0, 0.19, 0.38);
            const crest = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.13, 8), yellowMat);
            crest.position.set(0, 0.44, 0.03);
            crest.rotation.x = -0.2;
            const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
            [-0.10, 0.10].forEach(ex => {
                const e = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 8), eyeMat);
                e.position.set(ex, 0.27, 0.33);
                hatGroup.add(e);
            });
            hatGroup.add(capTop, bill, crest);
        } else if (hatType === 'cat') {
            const earMat = makeToonMat(mainColor);
            const innerMat = new THREE.MeshBasicMaterial({ color: 0xf9a8d4 });
            [-1, 1].forEach(side => {
                const outer = new THREE.Mesh(new THREE.ConeGeometry(0.115, 0.23, 10), earMat);
                outer.position.set(side * 0.21, 0.37, 0.01);
                outer.rotation.z = side * -0.26;
                const inner = new THREE.Mesh(new THREE.ConeGeometry(0.065, 0.145, 8), innerMat);
                inner.position.set(side * 0.21, 0.35, 0.045);
                inner.rotation.z = side * -0.26;
                hatGroup.add(outer, inner);
            });
        } else if (hatType === 'bunny') {
            const earMat = makeToonMat(0xf8fafc);
            const innerMat = new THREE.MeshBasicMaterial({ color: 0xf9a8d4 });
            [-1, 1].forEach(side => {
                const outer = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 12), earMat);
                outer.scale.set(0.85, 2.6, 0.55);
                outer.position.set(side * 0.16, 0.50, 0);
                outer.rotation.z = side * -0.18;
                const inner = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 10), innerMat);
                inner.scale.set(0.75, 2.1, 0.45);
                inner.position.set(side * 0.16, 0.48, 0.025);
                inner.rotation.z = side * -0.18;
                hatGroup.add(outer, inner);
            });
        } else if (hatType === 'crown') {
            const crownMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xeab308, emissiveIntensity: 0.35, metalness: 0.7, roughness: 0.25 });
            const gemMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
            const band = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.13, 10), crownMat);
            band.position.set(0.04, 0.39, 0.02);
            band.rotation.z = -0.14;
            const gem = new THREE.Mesh(new THREE.SphereGeometry(0.036, 8, 8), gemMat);
            gem.position.set(0.04, 0.40, 0.16);
            hatGroup.add(band, gem);
        } else if (hatType === 'cap') {
            const capMat = makeToonMat(mainColor);
            const brimMat = makeToonMat(0xf8fafc);
            const dome = new THREE.Mesh(
                new THREE.SphereGeometry(0.386, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.46),
                capMat
            );
            dome.scale.set(1.10, 0.92, 1.02);
            dome.position.y = 0.075;
            const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.27, 0.032, 16, 1, false, Math.PI * 0.65, Math.PI * 0.7), brimMat);
            brim.position.set(0, 0.19, -0.27);
            brim.rotation.x = 0.22;
            hatGroup.add(dome, brim);
        } else {
            // 'headphones'
            const hpMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.3, roughness: 0.35 });
            const padMat = makeToonMat(0x0f172a);
            [-1, 1].forEach(side => {
                const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.115, 0.075, 14), hpMat);
                cup.rotation.z = Math.PI / 2;
                cup.position.set(side * 0.41, 0.01, 0);
                const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.098, 0.098, 0.042, 14), padMat);
                pad.rotation.z = Math.PI / 2;
                pad.position.set(side * 0.38, 0.01, 0);
                hatGroup.add(cup, pad);
            });
            const band = new THREE.Mesh(new THREE.TorusGeometry(0.385, 0.036, 8, 22, Math.PI), hpMat);
            band.position.y = 0.05;
            hatGroup.add(band);
        }
    }

    function drawAvatarNameplate(group) {
        const ud = group?.userData;
        if (!ud || !ud.npCanvas) return;
        const ctx = ud.npCanvas.getContext('2d');
        const info = ud.info;
        ctx.clearRect(0, 0, 512, 96);

        const badgePrefix = info.role === 'admin' ? '👑 ' : (info.isPremium ? '💎 ' : '');
        const seatTag = info.seatId ? ' 🪑' : '';
        const label = (badgePrefix + (info.username || 'Thành viên') + seatTag).slice(0, 24);

        ctx.font = '800 32px "Nunito", sans-serif';
        const measured = Math.min(440, Math.max(150, ctx.measureText(label).width + 44));
        const x = (512 - measured) / 2;

        // Clean Play Together Translucent Pill NameTag
        ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
        roundRect(ctx, x, 18, measured, 60, 30);
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = info.role === 'admin' ? '#facc15' : (info.isPremium ? '#c084fc' : 'rgba(125, 211, 252, 0.75)');
        ctx.stroke();

        ctx.fillStyle = info.role === 'admin' ? '#fef08a' : '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, 256, 49);

        ud.npTex.needsUpdate = true;
    }

    function wrapCanvasTextLines(ctx, text, maxWidth, maxLines) {
        const words = String(text || '').trim().split(/\s+/);
        const lines = [];
        let cur = '';
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const test = cur ? cur + ' ' + word : word;
            if (ctx.measureText(test).width <= maxWidth) {
                cur = test;
            } else {
                if (cur) {
                    lines.push(cur);
                    cur = word;
                } else {
                    lines.push(word.slice(0, 18) + '…');
                    cur = '';
                }
                if (lines.length === maxLines - 1) break;
            }
        }
        if (cur && lines.length < maxLines) lines.push(cur);
        const usedWordCount = lines.join(' ').split(/\s+/).length;
        if (usedWordCount < words.length && lines.length > 0) {
            lines[lines.length - 1] = lines[lines.length - 1].slice(0, Math.max(1, lines[lines.length - 1].length - 2)) + '…';
        }
        return lines.length ? lines : ['...'];
    }

    function showCharacterSpeechBubble(group, text, opts = {}) {
        const ud = group?.userData;
        if (!ud || !ud.bubbleCanvas || !text) return;
        const ctx = ud.bubbleCanvas.getContext('2d');
        const cw = 640, ch = 256;
        ctx.clearRect(0, 0, cw, ch);

        ctx.font = '800 32px "Nunito", sans-serif';
        const lines = wrapCanvasTextLines(ctx, text, 490, 3);
        const lineH = 42;
        const maxLineW = lines.reduce((acc, l) => Math.max(acc, ctx.measureText(l).width), 60);
        const boxW = Math.min(580, Math.max(160, maxLineW + 64));
        const boxH = lines.length * lineH + 38;
        const bx = (cw - boxW) / 2;
        const by = ch - 34 - boxH;

        ctx.save();
        ctx.shadowColor = 'rgba(15, 23, 42, 0.42)';
        ctx.shadowBlur = 16;
        ctx.shadowOffsetY = 6;

        ctx.fillStyle = opts.isEmote ? '#fef9c3' : '#ffffff';
        roundRect(ctx, bx, by, boxW, boxH, 32);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(cw / 2 - 16, by + boxH - 2);
        ctx.lineTo(cw / 2, ch - 8);
        ctx.lineTo(cw / 2 + 16, by + boxH - 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        ctx.lineWidth = 4;
        ctx.strokeStyle = opts.isEmote ? '#facc15' : '#7dd3fc';
        roundRect(ctx, bx, by, boxW, boxH, 32);
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const startY = by + 22 + lineH / 2;
        lines.forEach((line, idx) => {
            ctx.fillText(line, cw / 2, startY + idx * lineH);
        });

        ud.bubbleTex.needsUpdate = true;
        ud.bubbleMat.opacity = 1;
        ud.bubbleSprite.visible = true;
        const now = performance.now();
        ud.bubbleBornAt = now;
        const holdMs = Math.min(8000, 4800 + text.length * 42);
        ud.bubbleExpireAt = now + holdMs;
    }

    function triggerAvatarEmoteAction(group, actionName) {
        const ud = group?.userData;
        if (!ud || !actionName) return;
        ud.emoteAction = actionName;
        ud.emoteUntil = performance.now() + 1850;
    }

    function animateAvatarPose(group, isMoving, isSeated, isStudyDesk, walkTime, dt, airHeight = 0) {
        const ud = group?.userData;
        if (!ud) return;
        const now = performance.now();

        if (ud.bubbleSprite && ud.bubbleSprite.visible) {
            if (now >= ud.bubbleExpireAt) {
                ud.bubbleSprite.visible = false;
            } else {
                const age = now - ud.bubbleBornAt;
                const rem = ud.bubbleExpireAt - now;
                const pop = age < 180 ? 0.72 + Math.sin((age / 180) * Math.PI * 0.75) * 0.42 : 1.0;
                ud.bubbleSprite.scale.set(3.25 * pop, 1.30 * pop, 1);
                ud.bubbleMat.opacity = rem < 450 ? Math.max(0, rem / 450) : 1.0;
            }
        }

        // Play Together Periodic Eye Blink (Texture swap between cached Open / Blink canvases!)
        const blinkCycle = ((walkTime + ud.blinkPhase) % 4.3);
        const shouldBlink = blinkCycle < 0.13;
        if (shouldBlink !== ud.isCurrentlyBlinking && ud.headMat) {
            ud.isCurrentlyBlinking = shouldBlink;
            const activeTex = shouldBlink ? ud.faceTexBlink : ud.faceTexOpen;
            ud.headMat.map = activeTex;
            ud.headMat.emissiveMap = activeTex;
            ud.headMat.needsUpdate = true;
        }

        // Shrink shadow smoothly while jumping in air
        if (ud.shadow) {
            const shadowScale = Math.max(0.45, 1.0 - airHeight * 0.22);
            ud.shadow.scale.set(shadowScale, shadowScale, 1);
            ud.shadow.material.opacity = Math.max(0.14, 0.34 - airHeight * 0.08);
        }

        ud.bodyRoot.rotation.x = 0;
        ud.bodyRoot.rotation.y = 0;
        ud.bodyRoot.position.y = 0;
        if (ud.kneePivots) {
            ud.kneePivots[0].rotation.x = 0;
            ud.kneePivots[1].rotation.x = 0;
        }

        const hasEmote = ud.emoteAction && now < ud.emoteUntil;
        if (hasEmote) {
            if (ud.emoteAction === 'wave') {
                ud.rightArmPivot.rotation.x = -2.45;
                ud.rightArmPivot.rotation.z = 0.42 + Math.sin(now * 0.016) * 0.42;
                ud.leftArmPivot.rotation.x = 0;
                ud.leftArmPivot.rotation.z = -0.30;
                ud.headGroup.rotation.z = Math.sin(now * 0.008) * 0.1;
                return;
            }
            if (ud.emoteAction === 'clap') {
                const clap = Math.abs(Math.sin(now * 0.018)) * 0.28;
                ud.leftArmPivot.rotation.x = -1.25;
                ud.rightArmPivot.rotation.x = -1.25;
                ud.leftArmPivot.rotation.z = -0.45 + clap;
                ud.rightArmPivot.rotation.z = 0.45 - clap;
                ud.bodyRoot.position.y = Math.abs(Math.sin(now * 0.012)) * 0.06;
                return;
            }
            if (ud.emoteAction === 'dance') {
                ud.bodyRoot.position.y = Math.abs(Math.sin(now * 0.015)) * 0.14;
                ud.bodyRoot.rotation.y = Math.sin(now * 0.008) * 0.45;
                ud.leftArmPivot.rotation.x = -1.4 + Math.sin(now * 0.015) * 0.6;
                ud.rightArmPivot.rotation.x = -1.4 - Math.sin(now * 0.015) * 0.6;
                ud.leftArmPivot.rotation.z = -0.45;
                ud.rightArmPivot.rotation.z = 0.45;
                return;
            }
            if (ud.emoteAction === 'heart' || ud.emoteAction === 'jump') {
                ud.bodyRoot.position.y = Math.abs(Math.sin(now * 0.014)) * 0.18;
                ud.leftArmPivot.rotation.x = -2.35;
                ud.rightArmPivot.rotation.x = -2.35;
                ud.leftArmPivot.rotation.z = 0.28;
                ud.rightArmPivot.rotation.z = -0.28;
                return;
            }
        } else {
            ud.headGroup.rotation.z = 0;
        }

        if (isSeated) {
            // Natural seated 90° thigh + 90° knee bend so bare legs drop cleanly off seat front!
            ud.leftLegPivot.rotation.x = -Math.PI / 2;
            ud.rightLegPivot.rotation.x = -Math.PI / 2;
            if (ud.kneePivots) {
                ud.kneePivots[0].rotation.x = Math.PI / 2;
                ud.kneePivots[1].rotation.x = Math.PI / 2;
            }
            ud.leftArmPivot.rotation.z = -0.22;
            ud.rightArmPivot.rotation.z = 0.22;
            ud.leftArmPivot.rotation.x = isStudyDesk ? -0.78 + Math.sin(walkTime * 6) * 0.08 : -0.40;
            ud.rightArmPivot.rotation.x = isStudyDesk ? -0.78 + Math.cos(walkTime * 6) * 0.08 : -0.40;
            ud.headGroup.position.y = 1.70 + Math.sin(walkTime * 2) * 0.015;
        } else if (airHeight > 0.05) {
            ud.leftLegPivot.rotation.x = -0.35;
            ud.rightLegPivot.rotation.x = 0.25;
            if (ud.kneePivots) {
                ud.kneePivots[0].rotation.x = 0.45;
                ud.kneePivots[1].rotation.x = 0.25;
            }
            ud.leftArmPivot.rotation.x = -2.1;
            ud.rightArmPivot.rotation.x = -2.1;
            ud.leftArmPivot.rotation.z = -0.35;
            ud.rightArmPivot.rotation.z = 0.35;
            ud.headGroup.position.y = 1.71;
        } else if (isMoving) {
            const swing = Math.sin(walkTime * 11.5) * 0.68;
            ud.leftLegPivot.rotation.x = swing;
            ud.rightLegPivot.rotation.x = -swing;
            if (ud.kneePivots) {
                ud.kneePivots[0].rotation.x = Math.max(0, -swing * 0.55);
                ud.kneePivots[1].rotation.x = Math.max(0, swing * 0.55);
            }
            ud.leftArmPivot.rotation.x = -swing * 0.85;
            ud.rightArmPivot.rotation.x = swing * 0.85;
            ud.leftArmPivot.rotation.z = -0.30;
            ud.rightArmPivot.rotation.z = 0.30;
            ud.bodyRoot.position.y = Math.abs(Math.sin(walkTime * 11.5)) * 0.075;
            ud.bodyRoot.rotation.x = 0.07;
            ud.headGroup.position.y = 1.71;
        } else {
            ud.leftLegPivot.rotation.x *= 0.8;
            ud.rightLegPivot.rotation.x *= 0.8;
            ud.leftArmPivot.rotation.z = -0.30;
            ud.rightArmPivot.rotation.z = 0.30;
            ud.leftArmPivot.rotation.x = Math.sin(walkTime * 2.2) * 0.04;
            ud.rightArmPivot.rotation.x = -Math.sin(walkTime * 2.2) * 0.04;
            ud.headGroup.position.y = 1.71 + Math.sin(walkTime * 2.4) * 0.015;
        }
    }

    // =========================================================================
    // 5. DYNAMIC 3D TV TEXTURE & REAL YOUTUBE VIDEO PROJECTION ONTO 3D TV
    // =========================================================================
    function update3DTVAndStudyBoards(now) {
        const vid = window.currentVideoId || '';
        if (vid && vid !== lastTvVideoId) {
            lastTvVideoId = vid;
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => { tvThumbnailImg = img; };
            img.src = `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`;
        }

        // Project Real Live #player-container onto the 3D TV Screen FIRST so isTVCurrentlyProjected is updated!
        syncRealVideoContainerTo3DTV();

        // Throttle 2D Canvas redraws to ~15 FPS for crisp performance
        if (now - lastCanvasDrawTime > 65) {
            lastCanvasDrawTime = now;
            draw3DMusicTVCanvas(now);
            draw3DStudyChalkboardCanvas();
        }

        // Pulse Music Room Speakers & Dance Floor to music
        const t = now * 0.001;
        const beat = 0.5 + 0.5 * Math.sin(t * 7.5) * Math.cos(t * 3.2);
        speakerCones.forEach(c => {
            c.scale.set(1 + beat * 0.16, 1, 1 + beat * 0.16);
        });
        danceFloorTiles.forEach((tile, i) => {
            const wave = 0.18 + 0.25 * Math.abs(Math.sin(t * 3.5 + i * 0.7));
            tile.material.opacity = wave;
        });
    }

    function draw3DMusicTVCanvas(now) {
        if (!tvCtx || !tvTexture) return;
        const ctx = tvCtx;
        const w = 1024, h = 576;

        // When the real live YouTube video (#player-container) is projected onto the 3D TV,
        // keep the WebGL screen backing pure black so there is NO duplicate thumbnail behind it!
        if (isTVCurrentlyProjected) {
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, w, h);
            tvTexture.needsUpdate = true;
            return;
        }

        // Background Gradient (shown when viewing TV from afar in Courtyard/Study Room)
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#090d16');
        grad.addColorStop(0.5, '#0f172a');
        grad.addColorStop(1, '#1e1b4b');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Draw YouTube Thumbnail if loaded
        if (tvThumbnailImg) {
            ctx.save();
            ctx.globalAlpha = 0.55;
            ctx.drawImage(tvThumbnailImg, 0, 0, w, h);
            ctx.restore();
        }

        // Dark Glass Vignette Overlay
        const vig = ctx.createLinearGradient(0, 0, 0, h);
        vig.addColorStop(0, 'rgba(6, 9, 19, 0.65)');
        vig.addColorStop(0.5, 'rgba(6, 9, 19, 0.35)');
        vig.addColorStop(1, 'rgba(6, 9, 19, 0.92)');
        ctx.fillStyle = vig;
        ctx.fillRect(0, 0, w, h);

        // Header Badge
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 24px "Nunito", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('📺 2937.ML SMART TV 3D • PHÒNG NGHE NHẠC LIVE', 42, 48);

        // Current Song Title
        const title = window.currentVideoTitle || 'Đang phát nhạc trực tuyến trên 2937.ML';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 34px "Nunito", sans-serif';
        ctx.fillText(title.slice(0, 48), 42, 102);

        // Live Karaoke Lyric Line (if available)
        const lyricEl = document.querySelector('.lyric-line.active');
        const lyricLine = lyricEl ? lyricEl.textContent.trim() : '';
        if (lyricLine) {
            ctx.fillStyle = '#fde047';
            ctx.font = 'bold 30px "Nunito", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`♪ ${lyricLine.slice(0, 56)} ♪`, w / 2, h / 2 + 20);
        }

        // 32-Band Animated Audio Visualizer Bars
        const bars = 32;
        const barW = (w - 84) / bars;
        const t = now * 0.005;
        for (let i = 0; i < bars; i++) {
            const amp = Math.abs(Math.sin(t + i * 0.45) * Math.cos(t * 0.7 - i * 0.2)) * 130 + 18;
            ctx.fillStyle = i % 2 === 0 ? '#38bdf8' : '#a855f7';
            ctx.fillRect(42 + i * barW, h - 55 - amp, barW - 6, amp);
        }

        tvTexture.needsUpdate = true;
    }

    function draw3DStudyChalkboardCanvas() {
        if (!studyBoardCtx || !studyBoardTexture) return;
        const ctx = studyBoardCtx;
        const w = 1024, h = 512;

        // Chalkboard Slate Background
        ctx.fillStyle = '#0f291e';
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 6;
        ctx.strokeRect(16, 16, w - 32, h - 32);

        // Title
        ctx.fillStyle = '#6ee7b7';
        ctx.font = 'bold 30px "Nunito", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('📖 PHÒNG HỌC TẬP 3D • BẢNG ĐỒNG HỒ POMODORO', w / 2, 68);

        // Read live Pomodoro timer from DOM
        const timeEl = document.getElementById('pomodoro-time');
        const phaseEl = document.getElementById('pomodoro-phase-label');
        const countEl = document.getElementById('pomodoro-session-count');
        const timeStr = timeEl ? timeEl.textContent.trim() : '25:00';
        const phaseStr = phaseEl ? phaseEl.textContent.trim() : 'Thời gian tập trung';
        const countStr = countEl ? countEl.textContent.trim() : 'Đã hoàn thành 0 phiên học';

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 112px "JetBrains Mono", monospace';
        ctx.fillText(timeStr, w / 2, 225);

        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 32px "Nunito", sans-serif';
        ctx.fillText(phaseStr, w / 2, 305);

        ctx.fillStyle = '#cbd5e1';
        ctx.font = '26px "Nunito", sans-serif';
        ctx.fillText(countStr, w / 2, 358);

        // Count how many study desks are occupied
        let studyingCount = localPlayer.seatId && localPlayer.seatId.startsWith('study-desk-') ? 1 : 0;
        remotePlayers.forEach(rp => {
            if (rp.data.seatId && rp.data.seatId.startsWith('study-desk-')) studyingCount++;
        });
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 26px "Nunito", sans-serif';
        ctx.fillText(`🪑 Đang có ${studyingCount}/6 bàn học có người ngồi • Chạm vào ghế hoặc nhấn [F] để ngồi học`, w / 2, 438);

        studyBoardTexture.needsUpdate = true;
    }

    // --- PROJECT REAL #player-container ONTO THE 3D TV SCREEN VIA EXACT 4-CORNER HOMOGRAPHY ---
    const TV_BASE_PX_W = 640;
    const TV_BASE_PX_H = 360;
    let isTVCurrentlyProjected = false;

    function clearProjectedPlayerStyles(playerEl) {
        [
            'left', 'top', 'right', 'bottom',
            'width', 'height', 'max-width', 'max-height',
            'transform', 'transform-origin',
            'display', 'position', 'z-index',
            'opacity', 'pointer-events'
        ].forEach(p => playerEl.style.removeProperty(p));
    }

    function setPlayerOccluded(playerEl) {
        isTVCurrentlyProjected = false;
        playerEl.classList.remove('v3d-tv-projected', 'v3d-tv-pinned-corner', 'v3d-tv-interactive');
        playerEl.classList.add('v3d-tv-occluded');
        clearProjectedPlayerStyles(playerEl);
    }

    function computeHomographyMatrix3d(w, h, p0, p1, p2, p3) {
        const x0 = p0.x, y0 = p0.y;
        const x1 = p1.x, y1 = p1.y;
        const x2 = p2.x, y2 = p2.y;
        const x3 = p3.x, y3 = p3.y;

        const dx1 = x1 - x2, dy1 = y1 - y2;
        const dx2 = x3 - x2, dy2 = y3 - y2;
        const sx = x0 - x1 + x2 - x3;
        const sy = y0 - y1 + y2 - y3;

        const det = dx1 * dy2 - dx2 * dy1;
        if (Math.abs(det) < 1e-6) return null;

        const g = (sx * dy2 - sy * dx2) / det;
        const hVal = (dx1 * sy - dy1 * sx) / det;

        const a = x1 - x0 + g * x1;
        const b = x3 - x0 + hVal * x3;
        const c = x0;
        const d = y1 - y0 + g * y1;
        const e = y3 - y0 + hVal * y3;
        const f = y0;

        const H00 = a / w, H01 = b / h, H02 = c;
        const H10 = d / w, H11 = e / h, H12 = f;
        const H20 = g / w, H21 = hVal / h, H22 = 1;

        return `matrix3d(${H00.toFixed(7)},${H10.toFixed(7)},0,${H20.toFixed(8)},${H01.toFixed(7)},${H11.toFixed(7)},0,${H21.toFixed(8)},0,0,1,0,${H02.toFixed(2)},${H12.toFixed(2)},0,${H22})`;
    }

    function syncRealVideoContainerTo3DTV() {
        const playerEl = document.getElementById('player-container');
        const wrap = document.getElementById('virtual3d-canvas-wrap');
        if (!playerEl || !wrap || !camera || !tvScreenMesh || !isActive) return;

        // Mode 1: Pinned Mini TV in Corner (useful when studying in the Study Room)
        if (isMiniTVPinned) {
            isTVCurrentlyProjected = false;
            playerEl.classList.remove('v3d-tv-projected', 'v3d-tv-occluded', 'v3d-tv-interactive');
            playerEl.classList.add('v3d-tv-pinned-corner');
            clearProjectedPlayerStyles(playerEl);
            return;
        }

        // Hide overlay if user walked outside the Music Room (dividing wall at x = -6 blocks TV except through doorway)
        const blockedByMusicWall = !isTheaterTVMode && (
            localPlayer.x > 4.5 ||
            (localPlayer.x > -5.8 && Math.abs(localPlayer.z) > 2.8)
        );
        if (!isRealVideoOnTV || blockedByMusicWall || camera.position.x <= -27.0) {
            setPlayerOccluded(playerEl);
            return;
        }

        // Ensure camera and TV screen world matrices are 100% up-to-date for this exact frame
        camera.updateMatrixWorld(true);
        tvScreenMesh.updateWorldMatrix(true, false);

        // Compute the 4 corners of tvScreenMesh (PlaneGeometry 8.8 x 4.95) in 3D World Space
        const halfW = 4.4;
        const halfH = 2.475;
        const cornersWorld = [
            tvScreenMesh.localToWorld(new THREE.Vector3(-halfW,  halfH, 0)), // Top-Left
            tvScreenMesh.localToWorld(new THREE.Vector3( halfW,  halfH, 0)), // Top-Right
            tvScreenMesh.localToWorld(new THREE.Vector3( halfW, -halfH, 0)), // Bottom-Right
            tvScreenMesh.localToWorld(new THREE.Vector3(-halfW, -halfH, 0))  // Bottom-Left
        ];

        // Verify all 4 corners are in front of the camera near plane in camera view space (z < -0.35)
        for (let i = 0; i < 4; i++) {
            const viewPt = cornersWorld[i].clone().applyMatrix4(camera.matrixWorldInverse);
            if (viewPt.z >= -0.35) {
                setPlayerOccluded(playerEl);
                return;
            }
        }

        const rect = wrap.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        // Project all 4 3D corners to 2D viewport pixel coordinates
        const cornersScreen = cornersWorld.map(wPt => {
            const ndc = wPt.clone().project(camera);
            return {
                x: (ndc.x * 0.5 + 0.5) * rect.width + rect.left,
                y: (-ndc.y * 0.5 + 0.5) * rect.height + rect.top
            };
        });

        const xs = cornersScreen.map(p => p.x);
        const ys = cornersScreen.map(p => p.y);
        const minX = Math.min(...xs), maxX = Math.max(...xs);
        const minY = Math.min(...ys), maxY = Math.max(...ys);

        // If projected TV quadrilateral is outside the visible viewport, hide cleanly
        if (maxX < rect.left + 24 || minX > rect.right - 24 || maxY < rect.top + 24 || minY > rect.bottom - 24) {
            setPlayerOccluded(playerEl);
            return;
        }

        const mat3d = computeHomographyMatrix3d(
            TV_BASE_PX_W,
            TV_BASE_PX_H,
            cornersScreen[0],
            cornersScreen[1],
            cornersScreen[2],
            cornersScreen[3]
        );
        if (!mat3d) {
            setPlayerOccluded(playerEl);
            return;
        }

        isTVCurrentlyProjected = true;
        playerEl.classList.remove('v3d-tv-occluded', 'v3d-tv-pinned-corner');
        playerEl.classList.add('v3d-tv-projected');
        playerEl.classList.toggle('v3d-tv-interactive', !!(isTheaterTVMode || localPlayer.seatId));

        playerEl.style.setProperty('display', 'block', 'important');
        playerEl.style.setProperty('position', 'fixed', 'important');
        playerEl.style.setProperty('z-index', '928', 'important');
        playerEl.style.setProperty('left', '0px', 'important');
        playerEl.style.setProperty('top', '0px', 'important');
        playerEl.style.setProperty('width', `${TV_BASE_PX_W}px`, 'important');
        playerEl.style.setProperty('height', `${TV_BASE_PX_H}px`, 'important');
        playerEl.style.setProperty('transform-origin', '0 0', 'important');
        playerEl.style.setProperty('transform', mat3d, 'important');
    }

    // =========================================================================
    // 6. MOVEMENT, COLLISION & INTERACTIVE SITTING (BÀN GHẾ HỌC TẬP & SOFA)
    // =========================================================================
    function updateLocalPlayerPhysics(dt) {
        let moveForward = 0;
        let moveRight = 0;

        const activeTag = document.activeElement ? document.activeElement.tagName : '';
        const isTyping = activeTag === 'INPUT' || activeTag === 'TEXTAREA';

        if (!isTyping) {
            if (keysPressed['KeyW'] || keysPressed['ArrowUp']) moveForward += 1;
            if (keysPressed['KeyS'] || keysPressed['ArrowDown']) moveForward -= 1;
            if (keysPressed['KeyD'] || keysPressed['ArrowRight']) moveRight += 1;
            if (keysPressed['KeyA'] || keysPressed['ArrowLeft']) moveRight -= 1;
        }

        if (Math.abs(joyDZ) > 0.08 || Math.abs(joyDX) > 0.08) {
            moveForward -= joyDZ;
            moveRight += joyDX;
        }

        const hasMovementInput = Math.abs(moveForward) > 0.05 || Math.abs(moveRight) > 0.05;

        // If player is currently seated and presses movement keys beyond a brief tap, stand up
        if (localPlayer.seatId && hasMovementInput && !isTheaterTVMode) {
            standUpFromSeat();
        }

        if (!localPlayer.seatId && hasMovementInput) {
            isTheaterTVMode = false;
            updateHUDButtons();

            // Calculate movement vector relative to camera yaw
            const forwardX = Math.sin(camYaw);
            const forwardZ = Math.cos(camYaw);
            const rightX = -Math.cos(camYaw);
            const rightZ = Math.sin(camYaw);

            let vx = forwardX * moveForward + rightX * moveRight;
            let vz = forwardZ * moveForward + rightZ * moveRight;
            const len = Math.hypot(vx, vz) || 1;
            vx /= len;
            vz /= len;

            const speed = (keysPressed['ShiftLeft'] || keysPressed['ShiftRight']) ? 9.5 : 6.4;
            const nextX = localPlayer.x + vx * speed * dt;
            const nextZ = localPlayer.z + vz * speed * dt;

            // Campus Boundary & Dividing Wall Collision (Doorways at x = -6 and x = +6 have opening z in [-2.9, +2.9])
            const resolved = resolveCampusCollision(localPlayer.x, localPlayer.z, nextX, nextZ);
            localPlayer.x = resolved.x;
            localPlayer.z = resolved.z;
            localPlayer.rotY = Math.atan2(vx, vz);
            localPlayer.isMoving = true;
            localPlayer.walkTime += dt;
        } else {
            localPlayer.isMoving = false;
            localPlayer.walkTime += dt;
        }

        // Jump & Gravity Physics (Play Together Bouncy Jump!)
        if (!localPlayer.seatId && (localPlayer.y > 0 || localPlayer.vy > 0)) {
            localPlayer.vy -= 22.0 * dt;
            localPlayer.y += localPlayer.vy * dt;
            if (localPlayer.y <= 0) {
                localPlayer.y = 0;
                localPlayer.vy = 0;
            }
        } else if (localPlayer.seatId) {
            localPlayer.y = 0;
            localPlayer.vy = 0;
        }

        // Update current Zone (music / yard / study)
        const prevZone = localPlayer.zone;
        if (localPlayer.x < -6.0) localPlayer.zone = 'music';
        else if (localPlayer.x > 6.0) localPlayer.zone = 'study';
        else localPlayer.zone = 'yard';

        if (prevZone !== localPlayer.zone && !localPlayer.seatId) {
            onZoneChanged(localPlayer.zone);
        }

        // Position Local 3D Avatar Mesh
        if (localPlayer.meshGroup) {
            const seatObj = localPlayer.seatId ? CAMPUS_SEATS.find(s => s.id === localPlayer.seatId) : null;
            if (seatObj) {
                localPlayer.meshGroup.position.set(seatObj.chairX, seatObj.sitY, seatObj.chairZ);
                localPlayer.meshGroup.rotation.y = seatObj.rotY;
                animateAvatarPose(localPlayer.meshGroup, false, true, seatObj.type === 'desk', localPlayer.walkTime, dt, 0);
            } else {
                localPlayer.meshGroup.position.set(localPlayer.x, localPlayer.y, localPlayer.z);
                localPlayer.meshGroup.rotation.y = localPlayer.rotY;
                animateAvatarPose(localPlayer.meshGroup, localPlayer.isMoving, false, false, localPlayer.walkTime, dt, localPlayer.y);
            }
        }

        // Check proximity to interactive seats (Study Desks & Music Sofas)
        checkSeatProximity();

        // Update 3D Camera Position
        updateCameraRig(dt);

        // Broadcast movement to Socket.IO peers (throttled ~10 times/sec)
        const now = performance.now();
        if (now - lastNetSyncTime > 100 && typeof socket !== 'undefined' && socket.connected) {
            lastNetSyncTime = now;
            socket.emit('virtual3d:move', {
                x: Number(localPlayer.x.toFixed(2)),
                y: Number(localPlayer.y.toFixed(2)),
                z: Number(localPlayer.z.toFixed(2)),
                rotY: Number(localPlayer.rotY.toFixed(2)),
                zone: localPlayer.zone,
                seatId: localPlayer.seatId,
                isMoving: localPlayer.isMoving
            });
        }
    }

    function resolveCampusCollision(oldX, oldZ, newX, newZ) {
        let x = Math.max(-26.8, Math.min(26.8, newX));
        let z = Math.max(-10.0, Math.min(10.0, newZ));

        // Dividing wall at x = -6 (Music Room <-> Courtyard) and x = +6 (Courtyard <-> Study Room)
        // Doorway opening is z between -2.85 and +2.85
        const inDoorwayZ = Math.abs(z) < 2.85;
        if (!inDoorwayZ) {
            if (oldX < -6.35 && x > -6.35) x = -6.35;
            if (oldX > -5.65 && x < -5.65) x = -5.65;
            if (oldX < 5.65 && x > 5.65) x = 5.65;
            if (oldX > 6.35 && x < 6.35) x = 6.35;
        }
        return { x, z };
    }

    function updateCameraRig(dt) {
        if (!camera) return;

        if (isTheaterTVMode) {
            // Smoothly position camera right in front of the Giant 3D TV in the Music Room
            const targetPos = new THREE.Vector3(-17.8, 4.65, 0);
            const lookTarget = new THREE.Vector3(-27.4, 4.65, 0);
            camera.position.lerp(targetPos, Math.min(1, dt * 6));
            camera.lookAt(lookTarget);
            return;
        }

        const focusY = localPlayer.seatId ? 2.15 : 2.35;
        const focusPoint = new THREE.Vector3(localPlayer.x, focusY, localPlayer.z);

        const desiredX = focusPoint.x - Math.sin(camYaw) * Math.cos(camPitch) * camDist;
        const desiredY = Math.max(0.8, focusPoint.y + Math.sin(camPitch) * camDist);
        const desiredZ = focusPoint.z - Math.cos(camYaw) * Math.cos(camPitch) * camDist;

        camera.position.set(
            Math.max(-27.3, Math.min(27.3, desiredX)),
            desiredY,
            Math.max(-10.4, Math.min(10.4, desiredZ))
        );
        camera.lookAt(focusPoint);
    }

    function checkSeatProximity() {
        let bestSeat = null;
        let bestDist = 2.65;

        CAMPUS_SEATS.forEach(s => {
            const d = Math.hypot(localPlayer.x - s.chairX, localPlayer.z - s.chairZ);
            if (d < bestDist) {
                bestDist = d;
                bestSeat = s;
            }
            // Highlight floor ring of nearby or occupied seats
            const mObj = seatMeshes.get(s.id);
            if (mObj && mObj.ringMesh) {
                const isMine = localPlayer.seatId === s.id;
                mObj.ringMesh.material.color.setHex(isMine ? 0x4ade80 : (d < 2.65 ? 0xfde047 : 0x38bdf8));
                mObj.ringMesh.material.opacity = isMine ? 0.85 : (d < 2.65 ? 0.8 : 0.35);
            }
        });

        nearestSeat = bestSeat;
        const promptEl = document.getElementById('v3d-interact-prompt');
        const promptTextEl = document.getElementById('v3d-interact-text');

        if (!localPlayer.seatId && nearestSeat && promptEl && promptTextEl) {
            const icon = nearestSeat.type === 'desk' ? '🪑' : '🛋️';
            promptTextEl.textContent = `${icon} Ngồi vào ${nearestSeat.label}`;
            promptEl.classList.remove('hidden');
        } else if (promptEl) {
            promptEl.classList.add('hidden');
        }
    }

    // --- SIT DOWN ON A CHAIR / STUDY DESK / SOFA ---
    function sitOnSeat(seatId) {
        const seat = CAMPUS_SEATS.find(s => s.id === seatId);
        if (!seat) return;

        // Check if occupied by another online player
        for (const [, rp] of remotePlayers.entries()) {
            if (rp.data.seatId === seat.id) {
                if (typeof showToastNotification === 'function') {
                    showToastNotification(`🪑 ${seat.label} đang có ${rp.data.username} ngồi rồi!`);
                }
                return;
            }
        }

        // Clear old desk lamp boost
        if (localPlayer.seatId) {
            const oldM = seatMeshes.get(localPlayer.seatId);
            if (oldM && oldM.lampLight) oldM.lampLight.intensity = 0.35;
        }

        localPlayer.seatId = seat.id;
        localPlayer.x = seat.chairX;
        localPlayer.z = seat.chairZ;
        localPlayer.rotY = seat.rotY;
        localPlayer.isMoving = false;

        // Align camera nicely behind the character facing the desk or TV
        camYaw = seat.rotY;
        camPitch = seat.type === 'desk' ? 0.30 : 0.06;

        // Boost study desk lamp when sitting at a desk
        const newM = seatMeshes.get(seat.id);
        if (newM && newM.lampLight) newM.lampLight.intensity = 1.35;

        const statusStr = seat.type === 'desk'
            ? `📖 Ngồi học (${seat.label.split('(')[0].trim()})`
            : `🛋️ Ngồi nghe nhạc`;

        if (localPlayer.meshGroup) {
            localPlayer.meshGroup.userData.info.seatId = seat.id;
            localPlayer.meshGroup.userData.info.statusText = statusStr;
            drawAvatarNameplate(localPlayer.meshGroup);
        }

        if (typeof socket !== 'undefined' && socket.connected) {
            socket.emit('virtual3d:sit', {
                seatId: seat.id,
                x: seat.chairX,
                y: seat.sitY,
                z: seat.chairZ,
                rotY: seat.rotY,
                statusText: statusStr
            });
        }

        updateSeatedHUD(seat);
        renderSeatDrawerList();
    }

    function standUpFromSeat() {
        if (!localPlayer.seatId) return;
        const oldSeat = CAMPUS_SEATS.find(s => s.id === localPlayer.seatId);
        const oldM = seatMeshes.get(localPlayer.seatId);
        if (oldM && oldM.lampLight) oldM.lampLight.intensity = 0.35;

        localPlayer.seatId = null;
        if (oldSeat) {
            // Step slightly back from chair when standing up
            localPlayer.x = oldSeat.chairX - Math.sin(oldSeat.rotY) * 0.75;
            localPlayer.z = oldSeat.chairZ - Math.cos(oldSeat.rotY) * 0.75;
        }

        const zoneStatus = localPlayer.zone === 'study'
            ? '📖 Phòng Học 3D'
            : (localPlayer.zone === 'music' ? '🎵 Phòng Nhạc 3D' : '🌳 Khuôn Viên');

        if (localPlayer.meshGroup) {
            localPlayer.meshGroup.userData.info.seatId = null;
            localPlayer.meshGroup.userData.info.statusText = zoneStatus;
            drawAvatarNameplate(localPlayer.meshGroup);
        }

        if (typeof socket !== 'undefined' && socket.connected) {
            socket.emit('virtual3d:sit', {
                seatId: null,
                x: localPlayer.x,
                z: localPlayer.z,
                statusText: zoneStatus
            });
        }

        updateSeatedHUD(null);
        renderSeatDrawerList();
    }

    function updateSeatedHUD(seat) {
        const seatedBar = document.getElementById('v3d-seated-bar');
        const seatedLabel = document.getElementById('v3d-seated-label');
        const pomoBtn = document.getElementById('v3d-seated-pomo-btn');
        const tvBtn = document.getElementById('v3d-seated-tv-btn');
        const promptEl = document.getElementById('v3d-interact-prompt');

        if (!seatedBar) return;
        if (!seat) {
            seatedBar.classList.add('hidden');
            return;
        }

        if (promptEl) promptEl.classList.add('hidden');
        seatedBar.classList.remove('hidden');

        if (seat.type === 'desk') {
            const pTime = document.getElementById('pomodoro-time')?.textContent || '25:00';
            seatedLabel.innerHTML = `📖 Đang ngồi học tại <strong>${seat.label}</strong> • ⏱️ Pomodoro: <span id="v3d-hud-pomo-live">${pTime}</span>`;
            if (pomoBtn) pomoBtn.classList.remove('hidden');
            if (tvBtn) tvBtn.classList.add('hidden');
        } else {
            seatedLabel.innerHTML = `🛋️ Đang ngồi tại <strong>${seat.label}</strong> hướng về Màn Hình TV 3D`;
            if (pomoBtn) pomoBtn.classList.add('hidden');
            if (tvBtn) tvBtn.classList.remove('hidden');
        }
    }

    function onZoneChanged(zone) {
        const badgeEl = document.getElementById('v3d-zone-badge-text');
        const navMusic = document.getElementById('v3d-nav-music');
        const navYard = document.getElementById('v3d-nav-yard');
        const navStudy = document.getElementById('v3d-nav-study');

        if (navMusic) navMusic.classList.toggle('active', zone === 'music');
        if (navYard) navYard.classList.toggle('active', zone === 'yard');
        if (navStudy) navStudy.classList.toggle('active', zone === 'study');

        let label = '🌳 Khuôn Viên Trung Tâm';
        if (zone === 'music') label = '🎵 Phòng Nghe Nhạc 3D (Smart TV)';
        else if (zone === 'study') label = '📖 Phòng Học Tập 3D (6 Bàn Học)';

        if (badgeEl) badgeEl.textContent = label;

        if (!localPlayer.seatId && localPlayer.meshGroup) {
            localPlayer.meshGroup.userData.info.statusText = label;
            drawAvatarNameplate(localPlayer.meshGroup);
        }
    }

    // =========================================================================
    // 7. INPUT CONTROLS (KEYBOARD, JUMP, ENTER-TO-CHAT, ORBIT, RAYCAST SEAT)
    // =========================================================================
    function triggerVirtual3DJump() {
        if (!isActive || localPlayer.seatId) return;
        if (localPlayer.y <= 0.03 && localPlayer.vy <= 0.1) {
            localPlayer.vy = 7.4;
        }
    }

    function bindControls(container) {
        window.addEventListener('keydown', (e) => {
            if (!isActive) return;
            const activeEl = document.activeElement;
            const tag = activeEl ? activeEl.tagName : '';
            const isTyping = tag === 'INPUT' || tag === 'TEXTAREA';

            if (isTyping) {
                if (e.code === 'Escape') {
                    activeEl.blur();
                }
                return;
            }

            keysPressed[e.code] = true;

            if (e.code === 'Space') {
                e.preventDefault();
                triggerVirtual3DJump();
            } else if (e.code === 'Enter') {
                const ptInput = document.getElementById('v3d-pt-chat-input');
                if (ptInput) {
                    e.preventDefault();
                    if (playChatMode === 'minimized') setPlayChatMode('compact');
                    ptInput.focus();
                }
            } else if (e.code === 'KeyF' || e.code === 'KeyE') {
                e.preventDefault();
                if (localPlayer.seatId) {
                    standUpFromSeat();
                } else if (nearestSeat) {
                    sitOnSeat(nearestSeat.id);
                }
            } else if (e.code === 'Escape') {
                const quickPop = document.getElementById('v3d-pt-quick-popover');
                const wardrobe = document.getElementById('v3d-avatar-drawer');
                const seatDrawer = document.getElementById('v3d-seat-drawer');
                if (quickPop && !quickPop.classList.contains('hidden')) {
                    togglePlayChatQuickPopover(false);
                } else if (wardrobe && !wardrobe.classList.contains('hidden')) {
                    toggleAvatarWardrobeDrawer(false);
                } else if (seatDrawer && !seatDrawer.classList.contains('hidden')) {
                    seatDrawer.classList.add('hidden');
                } else if (document.body.classList.contains('v3d-chat-open')) {
                    closeVirtual3DChatDrawer();
                } else if (isTheaterTVMode) {
                    isTheaterTVMode = false;
                    updateHUDButtons();
                }
            }
        });

        window.addEventListener('keyup', (e) => {
            keysPressed[e.code] = false;
        });

        // Mouse & Touch Camera Orbit + Click-on-Chair Raycasting
        let camPointerId = null;
        container.addEventListener('pointerdown', (e) => {
            if (!isActive || e.target.closest('.v3d-joystick-zone')) return;
            if (camPointerId !== null) return;
            camPointerId = e.pointerId;
            isDraggingCam = true;
            prevPointerX = e.clientX;
            prevPointerY = e.clientY;
            pointerDownX = e.clientX;
            pointerDownY = e.clientY;
            try {
                container.setPointerCapture(e.pointerId);
            } catch (_) {}
        });

        window.addEventListener('pointermove', (e) => {
            if (!isActive || !isDraggingCam || e.pointerId !== camPointerId) return;
            const dx = e.clientX - prevPointerX;
            const dy = e.clientY - prevPointerY;
            prevPointerX = e.clientX;
            prevPointerY = e.clientY;

            if (isTheaterTVMode && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
                isTheaterTVMode = false;
                updateHUDButtons();
            }

            camYaw -= dx * 0.0065;
            camPitch = Math.max(0.08, Math.min(1.15, camPitch + dy * 0.0055));
        });

        const endCamDrag = (e, allowClick) => {
            if (!isDraggingCam || e.pointerId !== camPointerId) return;
            isDraggingCam = false;
            camPointerId = null;

            if (!allowClick) return;
            // Detect clean Click / Tap on a 3D Chair, Desk, or TV Screen
            const moveDist = Math.hypot(e.clientX - pointerDownX, e.clientY - pointerDownY);
            if (moveDist < 6 && renderer && camera) {
                const rect = renderer.domElement.getBoundingClientRect();
                mouseVec.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
                mouseVec.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
                raycaster.setFromCamera(mouseVec, camera);

                // Check click on TV screen
                if (tvScreenMesh) {
                    const tvHit = raycaster.intersectObject(tvScreenMesh);
                    if (tvHit.length > 0) {
                        toggleTheaterTVView();
                        return;
                    }
                }

                // Check click on any Chair or Study Desk
                const hits = raycaster.intersectObjects(clickableSeatMeshes, false);
                if (hits.length > 0 && hits[0].object.userData?.seatId) {
                    sitOnSeat(hits[0].object.userData.seatId);
                }
            }
        };

        window.addEventListener('pointerup', (e) => endCamDrag(e, true));
        window.addEventListener('pointercancel', (e) => endCamDrag(e, false));

        container.addEventListener('wheel', (e) => {
            if (!isActive) return;
            e.preventDefault();
            camDist = Math.max(3.5, Math.min(14.5, camDist + e.deltaY * 0.006));
        }, { passive: false });

        // Mobile Virtual Joystick
        const joyZone = document.getElementById('v3d-joystick-zone');
        const joyKnob = document.getElementById('v3d-joystick-knob');
        if (joyZone && joyKnob) {
            let joyActive = false;
            const maxR = 36;
            const updateJoy = (clientX, clientY) => {
                const r = joyZone.getBoundingClientRect();
                const cx = r.left + r.width / 2;
                const cy = r.top + r.height / 2;
                let dx = clientX - cx;
                let dy = clientY - cy;
                const dist = Math.hypot(dx, dy);
                if (dist > maxR) {
                    dx = (dx / dist) * maxR;
                    dy = (dy / dist) * maxR;
                }
                joyKnob.style.transform = `translate(${dx}px, ${dy}px)`;
                joyDX = dx / maxR;
                joyDZ = dy / maxR;
            };
            joyZone.addEventListener('pointerdown', (e) => {
                e.stopPropagation();
                joyActive = true;
                joyZone.setPointerCapture(e.pointerId);
                updateJoy(e.clientX, e.clientY);
            });
            joyZone.addEventListener('pointermove', (e) => {
                if (!joyActive) return;
                e.stopPropagation();
                updateJoy(e.clientX, e.clientY);
            });
            const endJoy = () => {
                joyActive = false;
                joyDX = 0;
                joyDZ = 0;
                joyKnob.style.transform = 'translate(0px, 0px)';
            };
            joyZone.addEventListener('pointerup', endJoy);
            joyZone.addEventListener('pointercancel', endJoy);
        }
    }

    // =========================================================================
    // 8. MULTIPLAYER SOCKET.IO SYNC & PLAY TOGETHER SPEECH BUBBLES
    // =========================================================================
    function findAvatarGroupForChatMessage(msg) {
        const mySockId = (typeof socket !== 'undefined' && socket) ? socket.id : '';
        const myUid = (typeof currentUserId !== 'undefined' && currentUserId) ? String(currentUserId) : '';

        if (
            (msg.senderId && mySockId && msg.senderId === mySockId) ||
            (msg.userId && myUid && String(msg.userId) === myUid) ||
            (!msg.senderId && !msg.userId && msg.name === getMyUsername())
        ) {
            return localPlayer.meshGroup;
        }

        if (msg.senderId && remotePlayers.has(msg.senderId)) {
            return remotePlayers.get(msg.senderId).group;
        }

        for (const [, rp] of remotePlayers.entries()) {
            if (msg.userId && rp.data.userId && String(rp.data.userId) === String(msg.userId)) {
                return rp.group;
            }
            if (rp.data.username && msg.name && rp.data.username === msg.name) {
                return rp.group;
            }
        }
        return null;
    }

    function setupSocketListeners() {
        if (socketListenersBound || typeof socket === 'undefined' || !socket) return;
        socketListenersBound = true;

        socket.on('virtual3d:state', (state) => {
            if (!state || !Array.isArray(state.users)) return;
            syncRemotePlayersList(state.users);
        });

        socket.on('virtual3d:playerMoved', (u) => {
            if (!u || !u.socketId || u.socketId === socket.id) return;
            const rp = remotePlayers.get(u.socketId);
            if (rp) {
                rp.data = { ...rp.data, ...u };
            }
        });

        socket.on('virtual3d:emote', (payload) => {
            if (!payload || !payload.socketId) return;
            const bubbleText = payload.text || payload.emote;
            const targetGroup = payload.socketId === socket.id
                ? localPlayer.meshGroup
                : remotePlayers.get(payload.socketId)?.group;

            if (targetGroup && isActive) {
                showCharacterSpeechBubble(targetGroup, bubbleText, { isEmote: true });
                if (payload.action) {
                    triggerAvatarEmoteAction(targetGroup, payload.action);
                }
            }
        });

        socket.on('newMessage', (msg) => {
            if (!msg || msg.role === 'system') return;
            appendPlayChatMessage(msg);

            const isHistorical = Boolean(msg.isHistory || (typeof isLoadingChatHistory !== 'undefined' && isLoadingChatHistory));
            if (!isActive || isHistorical || !msg.text) return;

            const avatarGroup = findAvatarGroupForChatMessage(msg);
            if (avatarGroup) {
                showCharacterSpeechBubble(avatarGroup, msg.text, { isEmote: false });
            }
        });
    }

    function syncRemotePlayersList(users) {
        const myId = typeof socket !== 'undefined' ? socket.id : '';
        const countEl = document.getElementById('v3d-online-count');
        const tabBadge = document.getElementById('virtual3d-tab-badge');

        if (countEl) countEl.textContent = `${Math.max(1, users.length)} người trong 3D`;
        if (tabBadge) {
            tabBadge.textContent = String(users.length);
            tabBadge.classList.toggle('hidden', users.length === 0);
        }

        if (!scene) return;

        const seenIds = new Set();
        users.forEach(u => {
            if (!u || u.socketId === myId) return;
            seenIds.add(u.socketId);

            let rp = remotePlayers.get(u.socketId);
            if (!rp) {
                const grp = createAvatarMesh(u, false);
                grp.position.set(u.x || 0, u.y || 0, u.z || 0);
                scene.add(grp);
                rp = { data: u, group: grp, walkTime: 0 };
                remotePlayers.set(u.socketId, rp);
            } else {
                const changedAppearance =
                    rp.data.color !== u.color ||
                    rp.data.shortsColor !== u.shortsColor ||
                    rp.data.topStyle !== u.topStyle ||
                    rp.data.shoesStyle !== u.shoesStyle ||
                    rp.data.face !== u.face ||
                    rp.data.hat !== u.hat ||
                    rp.data.hair !== u.hair ||
                    rp.data.hairColor !== u.hairColor ||
                    rp.data.skinColor !== u.skinColor ||
                    rp.data.seatId !== u.seatId ||
                    rp.data.statusText !== u.statusText;
                rp.data = { ...rp.data, ...u };
                if (changedAppearance) {
                    applyAvatarAppearanceToMesh(rp.group, resolveAvatarInfo(rp.data));
                }
            }
        });

        // Remove disconnected players
        for (const [sid, rp] of remotePlayers.entries()) {
            if (!seenIds.has(sid)) {
                scene.remove(rp.group);
                remotePlayers.delete(sid);
            }
        }

        renderSeatDrawerList();
    }

    function updateRemotePlayers(dt) {
        remotePlayers.forEach(rp => {
            const u = rp.data;
            const seat = u.seatId ? CAMPUS_SEATS.find(s => s.id === u.seatId) : null;
            rp.walkTime += dt;

            if (seat) {
                rp.group.position.set(seat.chairX, seat.sitY, seat.chairZ);
                rp.group.rotation.y = seat.rotY;
                animateAvatarPose(rp.group, false, true, seat.type === 'desk', rp.walkTime, dt, 0);
            } else {
                const airH = Math.max(0, u.y || 0);
                const targetPos = new THREE.Vector3(u.x || 0, airH, u.z || 0);
                rp.group.position.lerp(targetPos, Math.min(1, dt * 10));
                rp.group.rotation.y = u.rotY || 0;
                animateAvatarPose(rp.group, !!u.isMoving, false, false, rp.walkTime, dt, airH);
            }
        });

        if (djNpcGroup) {
            animateAvatarPose(djNpcGroup, false, false, false, performance.now() * 0.001, dt, 0);
        }
    }

    // =========================================================================
    // 9. MAIN ANIMATION LOOP & PUBLIC API
    // =========================================================================
    function animateLoop() {
        if (!isActive) return;
        animFrameId = requestAnimationFrame(animateLoop);

        const dt = Math.min(0.1, clock ? clock.getDelta() : 0.016);
        const now = performance.now();

        updateLocalPlayerPhysics(dt);
        updateRemotePlayers(dt);
        update3DTVAndStudyBoards(now);

        if (firefliesMesh) {
            firefliesMesh.rotation.y += dt * 0.03;
        }

        // Update live Pomodoro timer readout in Seated HUD if sitting at a desk
        const hudPomo = document.getElementById('v3d-hud-pomo-live');
        const mainPomo = document.getElementById('pomodoro-time');
        if (hudPomo && mainPomo) {
            hudPomo.textContent = mainPomo.textContent;
        }

        if (renderer && scene && camera) {
            renderer.render(scene, camera);
        }
    }

    function onWindowResize() {
        if (!isActive || !renderer || !camera) return;
        const container = document.getElementById('virtual3d-canvas-wrap');
        if (!container) return;
        const w = Math.max(1, container.clientWidth);
        const h = Math.max(1, container.clientHeight);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }

    // --- TELEPORT & HUD ACTIONS ---
    function teleportVirtual3D(targetZone) {
        standUpFromSeat();
        isTheaterTVMode = false;

        if (targetZone === 'music') {
            localPlayer.x = -12.5;
            localPlayer.z = 0;
            localPlayer.rotY = -Math.PI / 2;
            camYaw = -Math.PI / 2;
        } else if (targetZone === 'study') {
            localPlayer.x = 13.5;
            localPlayer.z = 0;
            localPlayer.rotY = Math.PI / 2;
            camYaw = Math.PI / 2;
        } else {
            localPlayer.x = 0;
            localPlayer.z = 1.5;
            localPlayer.rotY = Math.PI;
            camYaw = Math.PI;
        }
        onZoneChanged(targetZone);
        updateHUDButtons();
    }

    function toggleTheaterTVView() {
        if (!isTheaterTVMode && localPlayer.x > -6) {
            // Teleport into Music Room if currently outside
            localPlayer.x = -15.5;
            localPlayer.z = 0;
            localPlayer.rotY = -Math.PI / 2;
            onZoneChanged('music');
        }
        isTheaterTVMode = !isTheaterTVMode;
        if (isTheaterTVMode) {
            isMiniTVPinned = false;
            isRealVideoOnTV = true;
        }
        updateHUDButtons();
    }

    function togglePinMiniTV() {
        isMiniTVPinned = !isMiniTVPinned;
        if (isMiniTVPinned) isTheaterTVMode = false;
        updateHUDButtons();
    }

    // =========================================================================
    // 10. PLAY TOGETHER WARDROBE CUSTOMIZER & IN-WORLD CHAT SYSTEM
    // =========================================================================
    function syncLocalAppearanceToMeshAndServer(bubbleNote) {
        savePrefs();
        const app = getLocalAppearance();
        if (localPlayer.meshGroup) {
            applyAvatarAppearanceToMesh(localPlayer.meshGroup, app);
            if (bubbleNote) {
                showCharacterSpeechBubble(localPlayer.meshGroup, bubbleNote, { isEmote: true });
            }
        }
        if (typeof socket !== 'undefined' && socket.connected) {
            socket.emit('virtual3d:customize', app);
        }
    }

    function selectAvatarOption(type, idx) {
        if (type === 'hair') localPlayer.hairIndex = idx % AVATAR_HAIRS.length;
        else if (type === 'hairColor') localPlayer.hairColorIndex = idx % HAIR_COLORS.length;
        else if (type === 'face') localPlayer.faceIndex = idx % FACE_STYLES.length;
        else if (type === 'topStyle') localPlayer.topStyleIndex = idx % TOP_STYLES.length;
        else if (type === 'color') localPlayer.colorIndex = idx % AVATAR_COLORS.length;
        else if (type === 'shortsColor') localPlayer.shortsColorIndex = idx % SHORTS_COLORS.length;
        else if (type === 'shoesStyle') localPlayer.shoesStyleIndex = idx % SHOES_STYLES.length;
        else if (type === 'hat') localPlayer.hatIndex = idx % AVATAR_HATS.length;
        else if (type === 'skin') localPlayer.skinIndex = idx % SKIN_COLORS.length;

        const note =
            type === 'hat' ? HAT_LABELS[AVATAR_HATS[localPlayer.hatIndex]] :
            type === 'hair' ? HAIR_LABELS[AVATAR_HAIRS[localPlayer.hairIndex]] :
            type === 'face' ? FACE_LABELS[FACE_STYLES[localPlayer.faceIndex]] :
            type === 'topStyle' ? TOP_LABELS[TOP_STYLES[localPlayer.topStyleIndex]] :
            type === 'shoesStyle' ? SHOES_LABELS[SHOES_STYLES[localPlayer.shoesStyleIndex]] :
            '✨ Đã đổi trang phục!';
        syncLocalAppearanceToMeshAndServer(note);
        renderWardrobeDrawer();
    }

    function renderWardrobeDrawer() {
        const hairWrap = document.getElementById('v3d-hair-options');
        const hairColorWrap = document.getElementById('v3d-haircolor-options');
        const faceWrap = document.getElementById('v3d-face-options');
        const topWrap = document.getElementById('v3d-top-options');
        const colorWrap = document.getElementById('v3d-color-options');
        const shortsColorWrap = document.getElementById('v3d-shortscolor-options');
        const shoesWrap = document.getElementById('v3d-shoes-options');
        const hatWrap = document.getElementById('v3d-hat-options');
        const skinWrap = document.getElementById('v3d-skin-options');
        if (!hairWrap || !hatWrap) return;

        hairWrap.innerHTML = AVATAR_HAIRS.map((h, i) => `
            <button type="button" class="v3d-wardrobe-chip ${i === localPlayer.hairIndex ? 'active' : ''}" onclick="window.selectVirtualAvatarOption('hair', ${i})">${HAIR_LABELS[h]}</button>
        `).join('');

        if (hairColorWrap) {
            hairColorWrap.innerHTML = HAIR_COLORS.map((hex, i) => `
                <button type="button" class="v3d-swatch-btn ${i === localPlayer.hairColorIndex ? 'active' : ''}" style="background:${hex};" title="Màu tóc ${i + 1}" onclick="window.selectVirtualAvatarOption('hairColor', ${i})"></button>
            `).join('');
        }

        if (faceWrap) {
            faceWrap.innerHTML = FACE_STYLES.map((f, i) => `
                <button type="button" class="v3d-wardrobe-chip ${i === localPlayer.faceIndex ? 'active' : ''}" onclick="window.selectVirtualAvatarOption('face', ${i})">${FACE_LABELS[f]}</button>
            `).join('');
        }

        if (topWrap) {
            topWrap.innerHTML = TOP_STYLES.map((t, i) => `
                <button type="button" class="v3d-wardrobe-chip ${i === localPlayer.topStyleIndex ? 'active' : ''}" onclick="window.selectVirtualAvatarOption('topStyle', ${i})">${TOP_LABELS[t]}</button>
            `).join('');
        }

        if (colorWrap) {
            colorWrap.innerHTML = AVATAR_COLORS.map((hex, i) => `
                <button type="button" class="v3d-swatch-btn ${i === localPlayer.colorIndex ? 'active' : ''}" style="background:${hex};" title="Màu áo ${i + 1}" onclick="window.selectVirtualAvatarOption('color', ${i})"></button>
            `).join('');
        }

        if (shortsColorWrap) {
            shortsColorWrap.innerHTML = SHORTS_COLORS.map((hex, i) => `
                <button type="button" class="v3d-swatch-btn ${i === localPlayer.shortsColorIndex ? 'active' : ''}" style="background:${hex};" title="Màu quần ${i + 1}" onclick="window.selectVirtualAvatarOption('shortsColor', ${i})"></button>
            `).join('');
        }

        if (shoesWrap) {
            shoesWrap.innerHTML = SHOES_STYLES.map((s, i) => `
                <button type="button" class="v3d-wardrobe-chip ${i === localPlayer.shoesStyleIndex ? 'active' : ''}" onclick="window.selectVirtualAvatarOption('shoesStyle', ${i})">${SHOES_LABELS[s]}</button>
            `).join('');
        }

        hatWrap.innerHTML = AVATAR_HATS.map((hat, i) => `
            <button type="button" class="v3d-wardrobe-chip ${i === localPlayer.hatIndex ? 'active' : ''}" onclick="window.selectVirtualAvatarOption('hat', ${i})">${HAT_LABELS[hat]}</button>
        `).join('');

        if (skinWrap) {
            skinWrap.innerHTML = SKIN_COLORS.map((hex, i) => `
                <button type="button" class="v3d-swatch-btn ${i === localPlayer.skinIndex ? 'active' : ''}" style="background:${hex};" title="Màu da ${i + 1}" onclick="window.selectVirtualAvatarOption('skin', ${i})"></button>
            `).join('');
        }
    }

    function toggleAvatarWardrobeDrawer(forceState) {
        const drawer = document.getElementById('v3d-avatar-drawer');
        if (!drawer) return;
        const willOpen = typeof forceState === 'boolean' ? forceState : drawer.classList.contains('hidden');
        drawer.classList.toggle('hidden', !willOpen);
        if (willOpen) {
            document.getElementById('v3d-seat-drawer')?.classList.add('hidden');
            renderWardrobeDrawer();
        }
        updateHUDButtons();
    }

    function cycleAvatarStyle() {
        toggleAvatarWardrobeDrawer();
    }

    function toggleSeatSelectorDrawer() {
        const drawer = document.getElementById('v3d-seat-drawer');
        if (!drawer) return;
        const willOpen = drawer.classList.contains('hidden');
        drawer.classList.toggle('hidden', !willOpen);
        if (willOpen) {
            document.getElementById('v3d-avatar-drawer')?.classList.add('hidden');
            renderSeatDrawerList();
        }
        updateHUDButtons();
    }

    function renderSeatDrawerList() {
        const studyGrid = document.getElementById('v3d-study-seats-grid');
        const musicGrid = document.getElementById('v3d-music-seats-grid');
        if (!studyGrid || !musicGrid) return;

        const buildItemHTML = (s) => {
            const isMine = localPlayer.seatId === s.id;
            let occupiedBy = null;
            remotePlayers.forEach(rp => {
                if (rp.data.seatId === s.id) occupiedBy = rp.data.username;
            });
            const statusLabel = isMine
                ? '✅ Bạn đang ngồi đây'
                : (occupiedBy ? `🔒 ${occupiedBy} đang ngồi` : '🟢 Còn trống - Bấm để ngồi');
            const cls = isMine ? 'mine' : (occupiedBy ? 'occupied' : '');
            return `
                <button type="button" class="v3d-seat-item ${cls}" ${occupiedBy ? 'disabled' : ''} onclick="window.sitOnVirtualSeat('${s.id}')">
                    <span>${s.type === 'desk' ? '🪑' : '🛋️'} ${s.label.split('(')[0].trim()}</span>
                    <span class="v3d-seat-sub">${statusLabel}</span>
                </button>
            `;
        };

        studyGrid.innerHTML = CAMPUS_SEATS.filter(s => s.room === 'study').map(buildItemHTML).join('');
        musicGrid.innerHTML = CAMPUS_SEATS.filter(s => s.room !== 'study').map(buildItemHTML).join('');
    }

    function sendVirtual3DEmote(emote, actionName) {
        const detectedAction = actionName || (
            emote.includes('👋') ? 'wave' :
            emote.includes('❤️') ? 'heart' :
            emote.includes('🔥') ? 'dance' :
            emote.includes('👏') ? 'clap' : 'jump'
        );
        if (localPlayer.meshGroup) {
            showCharacterSpeechBubble(localPlayer.meshGroup, emote, { isEmote: true });
            triggerAvatarEmoteAction(localPlayer.meshGroup, detectedAction);
        }
        if (typeof socket !== 'undefined' && socket.connected) {
            socket.emit('virtual3d:emote', { emote, action: detectedAction });
        }
        togglePlayChatQuickPopover(false);
    }

    function sendPlayTogetherChatMessage(rawText) {
        const text = String(rawText || '').trim();
        if (!text) return;
        if (typeof socket !== 'undefined' && socket.connected) {
            socket.emit('sendMessage', text);
        }
        togglePlayChatQuickPopover(false);
    }

    function buildPlayChatRowNode(item) {
        const row = document.createElement('div');
        row.className = 'v3d-pt-msg-row';

        if (item.role === 'admin' || item.isPremium) {
            const badge = document.createElement('span');
            badge.className = 'v3d-pt-msg-badge';
            badge.textContent = item.role === 'admin' ? '👑' : '💎';
            row.appendChild(badge);
        }

        const author = document.createElement('span');
        author.className = 'v3d-pt-msg-author';
        author.style.color = item.nameColor || '#7dd3fc';
        author.textContent = (item.name || 'Thành viên').replace(' 😎', '').trim() + ':';
        row.appendChild(author);

        const body = document.createElement('span');
        body.className = item.isMedia ? 'v3d-pt-msg-media' : '';
        body.textContent = ' ' + (item.text || '');
        row.appendChild(body);
        return row;
    }

    function appendPlayChatMessage(msg) {
        const entry = {
            id: msg.id || ('pt-' + Date.now() + Math.random()),
            name: msg.name || 'Thành viên',
            nameColor: msg.nameColor || '#7dd3fc',
            role: msg.role || 'member',
            isPremium: !!(msg.isPremium || msg.role === 'premium'),
            text: msg.type === 'gif' ? '[GIF]' : (msg.type === 'image' ? '[Hình ảnh]' : (msg.type === 'voice' ? '🎤 [Tin nhắn thoại]' : (msg.text || ''))),
            isMedia: !!(msg.gifUrl || msg.fileUrl || msg.audioUrl)
        };
        if (chatFeedBuffer.some(x => x.id === entry.id)) return;
        chatFeedBuffer.push(entry);
        if (chatFeedBuffer.length > 45) chatFeedBuffer.shift();

        const listEl = document.getElementById('v3d-pt-chat-list');
        if (listEl) {
            listEl.appendChild(buildPlayChatRowNode(entry));
            while (listEl.children.length > 45) {
                listEl.removeChild(listEl.firstElementChild);
            }
            listEl.scrollTop = listEl.scrollHeight;
        }

        const isHist = Boolean(msg.isHistory || (typeof isLoadingChatHistory !== 'undefined' && isLoadingChatHistory));
        if (isActive && !isHist && playChatMode === 'minimized') {
            playChatUnread++;
            updatePlayChatUnreadBadge();
        }
    }

    function renderPlayChatList() {
        const listEl = document.getElementById('v3d-pt-chat-list');
        if (!listEl) return;
        listEl.innerHTML = '';
        if (chatFeedBuffer.length === 0) {
            const hint = document.createElement('div');
            hint.className = 'v3d-pt-msg-row';
            hint.style.color = '#94a3b8';
            hint.textContent = '💬 Nhấn Enter hoặc dùng ⚡ Câu nhanh để trò chuyện ngay trên đầu nhân vật!';
            listEl.appendChild(hint);
        } else {
            chatFeedBuffer.forEach(item => listEl.appendChild(buildPlayChatRowNode(item)));
            listEl.scrollTop = listEl.scrollHeight;
        }
    }

    function updatePlayChatUnreadBadge() {
        const pill = document.getElementById('v3d-pt-unread-pill');
        if (!pill) return;
        pill.textContent = playChatUnread > 9 ? '9+' : String(playChatUnread);
        pill.classList.toggle('hidden', playChatUnread <= 0 || playChatMode !== 'minimized');
    }

    function setPlayChatMode(mode) {
        playChatMode = mode;
        const dock = document.getElementById('v3d-play-chat-dock');
        const expandIcon = document.querySelector('#v3d-pt-expand-btn .material-symbols-outlined');
        if (dock) {
            dock.classList.toggle('is-compact', mode === 'compact');
            dock.classList.toggle('is-expanded', mode === 'expanded');
            dock.classList.toggle('is-minimized', mode === 'minimized');
        }
        if (expandIcon) {
            expandIcon.textContent = mode === 'expanded' ? 'close_fullscreen' : 'open_in_full';
        }
        if (mode !== 'minimized') {
            playChatUnread = 0;
            const listEl = document.getElementById('v3d-pt-chat-list');
            if (listEl) listEl.scrollTop = listEl.scrollHeight;
        } else {
            togglePlayChatQuickPopover(false);
        }
        updatePlayChatUnreadBadge();
    }

    function togglePlayChatExpand() {
        setPlayChatMode(playChatMode === 'expanded' ? 'compact' : 'expanded');
    }

    function togglePlayChatQuickPopover(forceState) {
        const pop = document.getElementById('v3d-pt-quick-popover');
        const trigger = document.getElementById('v3d-pt-quick-btn');
        if (!pop) return;
        const willOpen = typeof forceState === 'boolean' ? forceState : pop.classList.contains('hidden');
        pop.classList.toggle('hidden', !willOpen);
        if (trigger) trigger.classList.toggle('active', willOpen);
        if (willOpen) {
            const phraseWrap = document.getElementById('v3d-pt-quick-phrases');
            if (phraseWrap && !phraseWrap.dataset.populated) {
                phraseWrap.dataset.populated = '1';
                phraseWrap.innerHTML = QUICK_PHRASES.map(txt =>
                    `<button type="button" class="v3d-pt-phrase-chip">${txt}</button>`
                ).join('');
                phraseWrap.querySelectorAll('.v3d-pt-phrase-chip').forEach((btn, idx) => {
                    btn.addEventListener('click', () => sendPlayTogetherChatMessage(QUICK_PHRASES[idx]));
                });
            }
        }
    }

    function bindPlayChatUI() {
        if (uiEventsBound) return;
        uiEventsBound = true;

        const form = document.getElementById('v3d-pt-chat-form');
        const input = document.getElementById('v3d-pt-chat-input');
        if (form && input) {
            // IME-safe Enter submit per modern-web-guidance (handles Vietnamese Telex/VNI & CJK IME)
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (e.isComposing || e.keyCode === 229) return;
                    if (input.value.trim()) {
                        form.requestSubmit();
                    } else {
                        input.blur();
                    }
                }
            });

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const val = input.value.trim();
                if (!val) {
                    input.blur();
                    return;
                }
                sendPlayTogetherChatMessage(val);
                input.value = '';
                input.focus();
            });
        }
    }

    function closeVirtual3DChatDrawer() {
        document.body.classList.remove('v3d-chat-open');
        const rightCol = document.querySelector('.right-column');
        if (rightCol) rightCol.classList.remove('chat-open');
        const leftCol = document.getElementById('left-column');
        if (leftCol) leftCol.classList.remove('mobile-mini');
        if (typeof chatBubbleOpen !== 'undefined') {
            try { chatBubbleOpen = false; } catch (_) {}
        }
        updateHUDButtons();
    }

    function toggleVirtual3DChatDrawer(forceState) {
        const willOpen = typeof forceState === 'boolean'
            ? forceState
            : !document.body.classList.contains('v3d-chat-open');
        if (willOpen) {
            document.getElementById('v3d-avatar-drawer')?.classList.add('hidden');
            document.getElementById('v3d-seat-drawer')?.classList.add('hidden');
            document.body.classList.add('v3d-chat-open');
            const rightCol = document.querySelector('.right-column');
            if (rightCol) rightCol.classList.remove('hidden');
            const chatBox = document.getElementById('chat-box-ui');
            if (chatBox) setTimeout(() => { chatBox.scrollTop = chatBox.scrollHeight; }, 60);
            updateHUDButtons();
        } else {
            closeVirtual3DChatDrawer();
        }
    }

    function bindChatCloseIntegration() {
        const closeBtn = document.querySelector('.right-column .chat-close-btn');
        if (closeBtn && !closeBtn.dataset.v3dBound) {
            closeBtn.dataset.v3dBound = '1';
            closeBtn.addEventListener('click', (e) => {
                if (isActive || document.body.classList.contains('virtual3d-mode-active')) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    closeVirtual3DChatDrawer();
                }
            }, true);
        }

        const mobChatBtn = document.getElementById('sp-mobile-chat-btn');
        if (mobChatBtn && !mobChatBtn.dataset.v3dBound) {
            mobChatBtn.dataset.v3dBound = '1';
            mobChatBtn.addEventListener('click', (e) => {
                if (isActive || document.body.classList.contains('virtual3d-mode-active')) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    if (typeof switchRightTab === 'function') switchRightTab('chat');
                    toggleVirtual3DChatDrawer();
                }
            }, true);
        }

        const mobLyricBtn = document.getElementById('sp-mobile-lyric-btn');
        if (mobLyricBtn && !mobLyricBtn.dataset.v3dBound) {
            mobLyricBtn.dataset.v3dBound = '1';
            mobLyricBtn.addEventListener('click', (e) => {
                if (isActive || document.body.classList.contains('virtual3d-mode-active')) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    if (typeof switchRightTab === 'function') switchRightTab('lyric');
                    toggleVirtual3DChatDrawer();
                }
            }, true);
        }
    }

    function updateHUDButtons() {
        const btnTheater = document.getElementById('v3d-btn-theater');
        const btnPin = document.getElementById('v3d-btn-pin-tv');
        const btnChat = document.getElementById('v3d-btn-chat');
        const btnWardrobe = document.getElementById('v3d-btn-wardrobe');
        const wardrobeOpen = !document.getElementById('v3d-avatar-drawer')?.classList.contains('hidden');

        if (btnTheater) btnTheater.classList.toggle('active', isTheaterTVMode);
        if (btnPin) btnPin.classList.toggle('active', isMiniTVPinned);
        if (btnChat) btnChat.classList.toggle('active', document.body.classList.contains('v3d-chat-open'));
        if (btnWardrobe) btnWardrobe.classList.toggle('active', !!wardrobeOpen);
    }

    // --- OPEN / CLOSE 3D VIRTUAL CAMPUS ---
    function openVirtual3DWorld(initialRoom) {
        const overlay = document.getElementById('virtual3d-stage-overlay');
        const canvasWrap = document.getElementById('virtual3d-canvas-wrap');
        const playerEl = document.getElementById('player-container');
        if (!overlay) return;

        // Ensure we are on Home tab and clear any 2D mini-player / mobile-mini state
        const leftCol = document.getElementById('left-column');
        if (leftCol) {
            if (leftCol.classList.contains('not-home') && typeof showTab === 'function') {
                showTab('home');
            }
            leftCol.classList.remove('not-home', 'mobile-mini', 'pomodoro-view', 'study-view');
        }
        if (playerEl) {
            playerEl.classList.remove('is-mini-player');
        }

        isActive = true;
        overlay.classList.remove('hidden');
        if (canvasWrap) canvasWrap.classList.remove('hidden');
        document.body.classList.add('virtual3d-mode-active');
        closeVirtual3DChatDrawer();
        bindChatCloseIntegration();
        bindPlayChatUI();
        renderPlayChatList();
        setPlayChatMode('compact');

        initThreeWorld();
        onWindowResize();

        const app = getLocalAppearance();
        if (localPlayer.meshGroup) {
            applyAvatarAppearanceToMesh(localPlayer.meshGroup, {
                username: getMyUsername(),
                role: getMyRole(),
                isPremium: getMyPremium(),
                ...app
            });
        }

        if (initialRoom === 'study' || initialRoom === 'music' || initialRoom === 'yard') {
            teleportVirtual3D(initialRoom);
        } else {
            onZoneChanged(localPlayer.zone);
        }

        if (typeof socket !== 'undefined' && socket.connected) {
            socket.emit('virtual3d:join', {
                username: getMyUsername(),
                role: getMyRole(),
                isPremium: getMyPremium(),
                ...app,
                x: localPlayer.x,
                y: localPlayer.y,
                z: localPlayer.z,
                rotY: localPlayer.rotY,
                seatId: localPlayer.seatId,
                zone: localPlayer.zone
            });
        }

        if (clock) clock.start();
        if (animFrameId) cancelAnimationFrame(animFrameId);
        animateLoop();

        // Ensure YouTube video is playing when entering 3D TV mode
        try {
            if (typeof player !== 'undefined' && player && typeof player.getPlayerState === 'function') {
                if (player.getPlayerState() !== 1 && typeof player.playVideo === 'function') {
                    player.playVideo();
                }
            }
        } catch (_) {}

        if (playerEl) {
            syncRealVideoContainerTo3DTV();
        }
    }

    function closeVirtual3DWorld() {
        isActive = false;
        isTheaterTVMode = false;
        isMiniTVPinned = false;
        if (animFrameId) {
            cancelAnimationFrame(animFrameId);
            animFrameId = null;
        }

        const overlay = document.getElementById('virtual3d-stage-overlay');
        if (overlay) overlay.classList.add('hidden');
        const canvasWrap = document.getElementById('virtual3d-canvas-wrap');
        if (canvasWrap) canvasWrap.classList.add('hidden');
        document.getElementById('v3d-avatar-drawer')?.classList.add('hidden');
        document.getElementById('v3d-seat-drawer')?.classList.add('hidden');
        togglePlayChatQuickPopover(false);
        document.body.classList.remove('virtual3d-mode-active', 'v3d-chat-open');

        // Restore #player-container to normal 2D layout without interrupting playback
        const playerEl = document.getElementById('player-container');
        if (playerEl) {
            isTVCurrentlyProjected = false;
            playerEl.classList.remove('v3d-tv-projected', 'v3d-tv-occluded', 'v3d-tv-pinned-corner', 'v3d-tv-interactive');
            clearProjectedPlayerStyles(playerEl);
        }

        if (typeof socket !== 'undefined' && socket.connected) {
            socket.emit('virtual3d:leave');
        }
    }

    // Helpers
    function getMyUsername() {
        return (typeof myUsername !== 'undefined' && myUsername) ? myUsername : 'Thành viên';
    }
    function getMyRole() {
        return (typeof myRole !== 'undefined' && myRole) ? myRole : 'member';
    }
    function getMyPremium() {
        return !!(typeof isMyAccountPremium !== 'undefined' && isMyAccountPremium);
    }
    function roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    }

    // Expose Global Functions for HTML onclick handlers
    window.openVirtual3DWorld = openVirtual3DWorld;
    window.closeVirtual3DWorld = closeVirtual3DWorld;
    window.teleportVirtual3D = teleportVirtual3D;
    window.toggleTheaterTVView = toggleTheaterTVView;
    window.togglePinMiniTV = togglePinMiniTV;
    window.cycleAvatarStyle = cycleAvatarStyle;
    window.toggleAvatarWardrobeDrawer = toggleAvatarWardrobeDrawer;
    window.selectVirtualAvatarOption = selectAvatarOption;
    window.toggleSeatSelectorDrawer = toggleSeatSelectorDrawer;
    window.sitOnVirtualSeat = (id) => {
        sitOnSeat(id);
        document.getElementById('v3d-seat-drawer')?.classList.add('hidden');
    };
    window.standUpFromVirtualSeat = standUpFromSeat;
    window.triggerNearestVirtualSeat = () => {
        if (localPlayer.seatId) standUpFromSeat();
        else if (nearestSeat) sitOnSeat(nearestSeat.id);
    };
    window.triggerVirtual3DJump = triggerVirtual3DJump;
    window.sendVirtual3DEmote = sendVirtual3DEmote;
    window.setPlayChatMode = setPlayChatMode;
    window.togglePlayChatExpand = togglePlayChatExpand;
    window.togglePlayChatQuickPopover = togglePlayChatQuickPopover;
    window.toggleVirtual3DChatDrawer = toggleVirtual3DChatDrawer;
    window.closeVirtual3DChatDrawer = closeVirtual3DChatDrawer;
    window.toggleVirtualPomodoroAction = () => {
        const toggleBtn = document.getElementById('pomodoro-toggle');
        if (toggleBtn) toggleBtn.click();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setupSocketListeners();
            bindChatCloseIntegration();
            bindPlayChatUI();
        });
    } else {
        setupSocketListeners();
        bindChatCloseIntegration();
        bindPlayChatUI();
    }
})();
