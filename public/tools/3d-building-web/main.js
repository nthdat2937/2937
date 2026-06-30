import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

let camera, scene, renderer, controls;
let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

// Multiplayer variables
let socket;
const otherPlayers = {};

// UI Elements
const instructions = document.getElementById('instructions');
const mainTitle = document.getElementById('main-title');
const subTitle = document.getElementById('sub-title');
const crosshair = document.getElementById('crosshair');

// Interaction System
const raycaster = new THREE.Raycaster();
const centerMouse = new THREE.Vector2(0, 0);
let interactableObjects = [];

// Elevator System Variables
let currentFloorIndex = 3;
const floorHeight = 15;
const floorNames = ["B3", "B2", "B1", "1", "2", "3", "4", "5", "6", "7", "8"];
const elevatorPosition = new THREE.Vector3(0, 3 * floorHeight, -24);
let elevatorGroup;
let leftDoor, rightDoor;
let doorOpenness = 0; // 0 = closed, 1 = open
let doorState = 'closed'; // closed, opening, open, closing
let elevatorState = 'idle'; // idle, waiting_to_move, moving
let targetElevatorY = 0;
let movingSpeed = 8; // units per second

// NEW VARIABLES for Elevator Queue
const requestedFloors = new Set();
let currentDirection = 'idle';
const elevatorButtons = [];
const floorDoorsArray = [];

function updateButtonColors() {
    for (let btn of elevatorButtons) {
        if (requestedFloors.has(btn.userData.floorIndex)) {
            btn.material.color.setHex(btn.userData.neonColor);
        } else {
            btn.material.color.setHex(btn.userData.defaultColor);
        }
    }
}

let inElevatorZone = false;
let nearElevatorZone = false;
const displayCanvas = document.createElement('canvas');
displayCanvas.width = 256;
displayCanvas.height = 128;
const displayCtx = displayCanvas.getContext('2d');
const displayTexture = new THREE.CanvasTexture(displayCanvas);
let lastDisplayState = "";

init();
animate();

function init() {
    // 1. Scene Setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    scene.fog = new THREE.FogExp2(0x050505, 0.02);

    // 2. Camera Setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = 4 + 3 * floorHeight;
    camera.position.z = 10;

    // 3. Renderer Setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    const elevatorLight = new THREE.PointLight(0x00f0ff, 1, 10);
    elevatorLight.position.set(0, 10, -20);
    scene.add(elevatorLight);

    // 5. Controls
    controls = new PointerLockControls(camera, document.body);

    instructions.addEventListener('click', function () {
        controls.lock();
    });

    controls.addEventListener('lock', function () {
        instructions.style.display = 'none';
        crosshair.style.display = 'block';
    });

    controls.addEventListener('unlock', function () {
        instructions.style.display = 'block';
        mainTitle.innerText = 'Virtual Company';
        subTitle.innerText = 'Nhấp chuột trái để tiếp tục';
        crosshair.style.display = 'none';
    });

    scene.add(controls.getObject());

    // 6. Interaction (Mouse Click)
    document.addEventListener('mousedown', (event) => {
        if (!controls.isLocked) return;
        if (event.button !== 0) return; // Only left click

        raycaster.setFromCamera(centerMouse, camera);
        const intersects = raycaster.intersectObjects(interactableObjects, false); // false = not recursive here, we only add the buttons themselves

        if (intersects.length > 0 && intersects[0].distance < 4) {
            const object = intersects[0].object;
            const action = object.userData.action;
            
            if (action === 'callElevator') {
                onCallButtonPressed();
            } else if (action === 'goToFloor') {
                const floorIndex = object.userData.floorIndex;
                requestFloor(floorIndex);
            }
        }
    });

    // 7. Keyboard Input
    const onKeyDown = function (event) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW': moveForward = true; break;
            case 'ArrowLeft':
            case 'KeyA': moveLeft = true; break;
            case 'ArrowDown':
            case 'KeyS': moveBackward = true; break;
            case 'ArrowRight':
            case 'KeyD': moveRight = true; break;
            case 'Space':
                if (canJump === true && elevatorState === 'idle') velocity.y += 10;
                canJump = false;
                break;
        }
    };

    const onKeyUp = function (event) {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW': moveForward = false; break;
            case 'ArrowLeft':
            case 'KeyA': moveLeft = false; break;
            case 'ArrowDown':
            case 'KeyS': moveBackward = false; break;
            case 'ArrowRight':
            case 'KeyD': moveRight = false; break;
        }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    // 8. Building Generation
    buildEnvironment();

    // 9. Event Listeners
    window.addEventListener('resize', onWindowResize);
    
    // 10. Init Multiplayer
    initMultiplayer();
}

function onCallButtonPressed() {
    const playerPos = controls.getObject().position;
    const playerFloorIndex = Math.max(0, Math.floor(playerPos.y / floorHeight));
    requestFloor(playerFloorIndex);
}

function requestFloor(floorIndex, fromNetwork = false) {
    if (!fromNetwork && typeof io !== 'undefined' && socket && socket.connected) {
        socket.emit('callElevator', floorIndex);
    }

    if (floorIndex !== currentFloorIndex || elevatorState === 'moving') {
        requestedFloors.add(floorIndex);
        updateButtonColors();
    } else if (floorIndex === currentFloorIndex && elevatorState === 'idle' && doorState !== 'open') {
        doorState = 'opening';
    }
}

function getNextFloor() {
    if (requestedFloors.size === 0) return currentFloorIndex;
    const reqs = Array.from(requestedFloors);
    
    if (currentDirection === 'up') {
        const above = reqs.filter(f => f > currentFloorIndex).sort((a,b) => a - b);
        if (above.length > 0) return above[0];
        currentDirection = 'down';
        const below = reqs.filter(f => f < currentFloorIndex).sort((a,b) => b - a);
        if (below.length > 0) return below[0];
    } else if (currentDirection === 'down') {
        const below = reqs.filter(f => f < currentFloorIndex).sort((a,b) => b - a);
        if (below.length > 0) return below[0];
        currentDirection = 'up';
        const above = reqs.filter(f => f > currentFloorIndex).sort((a,b) => a - b);
        if (above.length > 0) return above[0];
    }
    
    reqs.sort((a,b) => Math.abs(a - currentFloorIndex) - Math.abs(b - currentFloorIndex));
    currentDirection = reqs[0] > currentFloorIndex ? 'up' : (reqs[0] < currentFloorIndex ? 'down' : 'idle');
    return reqs[0];
}

function buildEnvironment() {
    // Shared materials
    const floorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x111111,
        roughness: 0.1,
        metalness: 0.8
    });
    
    const wallMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xeeeeee,
        roughness: 0.8,
        metalness: 0.1,
        side: THREE.DoubleSide
    });

    // Generate an array of 11 colors dynamically based on HSL to get distinct neon colors
    const neonColors = [];
    for (let c = 0; c < 11; c++) {
        const color = new THREE.Color();
        color.setHSL(c / 11, 1.0, 0.5);
        neonColors.push(color.getHex());
    }
    
    const gridHelper = new THREE.GridHelper(100, 25, 0x00f0ff, 0x003344);
    gridHelper.position.y = -0.1;
    scene.add(gridHelper);

    // Generate 11 Floors
    for(let i = 0; i < 11; i++) {
        const yOffset = i * floorHeight;
        const colorMat = new THREE.MeshBasicMaterial({ color: neonColors[i] });

        const shape = new THREE.Shape();
        shape.moveTo(-4, 20); 
        shape.quadraticCurveTo(-15, 35, -25, 15); 
        shape.lineTo(-35, -15); 
        shape.quadraticCurveTo(-38, -25, -25, -25); 
        shape.lineTo(25, -25); 
        shape.quadraticCurveTo(38, -25, 35, -15); 
        shape.lineTo(25, 15); 
        shape.quadraticCurveTo(15, 35, 4, 20); 
        shape.lineTo(-4, 20); 

        const hole = new THREE.Path();
        hole.moveTo(-10, 5);
        hole.lineTo(10, 5);
        hole.lineTo(16, -5);
        hole.lineTo(16, -15);
        hole.lineTo(-16, -15);
        hole.lineTo(-16, -5);
        hole.lineTo(-10, 5);
        shape.holes.push(hole);

        const floorGeo = new THREE.ShapeGeometry(shape);
        const floor = new THREE.Mesh(floorGeo, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = yOffset;
        scene.add(floor);

        if(i < 10) {
            const ceilingGeo = new THREE.ShapeGeometry(shape);
            const ceilingMat = floorMaterial.clone();
            ceilingMat.side = THREE.BackSide;
            const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
            ceiling.rotation.x = -Math.PI / 2;
            ceiling.position.y = yOffset + floorHeight;
            scene.add(ceiling);
        }

        const outerPoints = shape.getPoints(10);
        buildWallsFromPoints(outerPoints, yOffset, floorHeight, wallMaterial, scene, colorMat, false);
        
        const holePoints = hole.getPoints();
        buildWallsFromPoints(holePoints, yOffset, floorHeight, wallMaterial, scene, colorMat, true);

        // --- Floor Doors ---
        const doorMatFloor = new THREE.MeshStandardMaterial({color: 0x111122, metalness: 0.9, roughness: 0.2, side: THREE.DoubleSide});
        const leftFloorDoor = new THREE.Mesh(new THREE.PlaneGeometry(2, 10), doorMatFloor);
        leftFloorDoor.position.set(-1, yOffset + 5, -20.02);
        scene.add(leftFloorDoor);
        
        const rightFloorDoor = new THREE.Mesh(new THREE.PlaneGeometry(2, 10), doorMatFloor);
        rightFloorDoor.position.set(1, yOffset + 5, -20.02);
        scene.add(rightFloorDoor);
        
        floorDoorsArray.push({ left: leftFloorDoor, right: rightFloorDoor });
        
        const pillarGeo = new THREE.CylinderGeometry(0.5, 0.5, floorHeight, 16);
        const pillar1 = new THREE.Mesh(pillarGeo, colorMat);
        pillar1.position.set(-15, yOffset + floorHeight/2, -15);
        scene.add(pillar1);
        
        const pillar2 = new THREE.Mesh(pillarGeo, colorMat);
        pillar2.position.set(15, yOffset + floorHeight/2, -15);
        scene.add(pillar2);

        // --- Outside Elevator Display ---
        const displayGeo = new THREE.PlaneGeometry(3, 1.5);
        const displayMat = new THREE.MeshBasicMaterial({ map: displayTexture, side: THREE.DoubleSide });
        const outsideDisplay = new THREE.Mesh(displayGeo, displayMat);
        outsideDisplay.position.set(0, yOffset + 11.5, -19.9); // Above the door
        scene.add(outsideDisplay);

        // --- Call Button (Outside Elevator) ---
        const callPanelGeo = new THREE.BoxGeometry(0.6, 1.2, 0.2);
        const callPanelMat = new THREE.MeshStandardMaterial({color: 0x333333});
        const callPanel = new THREE.Mesh(callPanelGeo, callPanelMat);
        callPanel.position.set(3, yOffset + 4, -19.9); // Right of the elevator door
        scene.add(callPanel);

        // Call Button Base
        const callBaseGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.05, 32);
        const callBaseMat = new THREE.MeshStandardMaterial({color: 0x111111});
        const callBase = new THREE.Mesh(callBaseGeo, callBaseMat);
        callBase.rotation.x = Math.PI / 2;
        callBase.position.set(0, 0, 0.125);
        callPanel.add(callBase);

        // Call Button Ring (Border)
        const callRingGeo = new THREE.TorusGeometry(0.18, 0.03, 16, 32);
        const callRingMat = new THREE.MeshStandardMaterial({color: 0xaaaaaa, metalness: 0.9, roughness: 0.1});
        const callRing = new THREE.Mesh(callRingGeo, callRingMat);
        callRing.position.set(0, 0, 0.15);
        callPanel.add(callRing);

        // Call Button Face (Interactive)
        const callFaceGeo = new THREE.CircleGeometry(0.16, 32);
        const callFaceMat = new THREE.MeshBasicMaterial({color: 0x555555});
        const callBtn = new THREE.Mesh(callFaceGeo, callFaceMat);
        callBtn.position.set(0, 0, 0.151);
        callBtn.userData = { 
            action: 'callElevator', 
            floorIndex: i, 
            neonColor: 0xff0055, 
            defaultColor: 0x555555 
        };
        
        callPanel.add(callBtn);
        interactableObjects.push(callBtn);
        elevatorButtons.push(callBtn);
    }
    
    // --- ELEVATOR CAR ---
    elevatorGroup = new THREE.Group();
    scene.add(elevatorGroup);
    
    const elFloorGeo = new THREE.PlaneGeometry(8, 8);
    const elFloor = new THREE.Mesh(elFloorGeo, new THREE.MeshStandardMaterial({color: 0x222222, roughness: 0.5}));
    elFloor.rotation.x = -Math.PI / 2;
    elFloor.position.set(0, 0, 0);
    elevatorGroup.add(elFloor);
    
    const elCeil = new THREE.Mesh(elFloorGeo, new THREE.MeshStandardMaterial({color: 0xffffff, emissive: 0x222222}));
    elCeil.rotation.x = Math.PI / 2;
    elCeil.position.set(0, 10, 0);
    elevatorGroup.add(elCeil);
    
    const elevatorWallMat = new THREE.MeshStandardMaterial({
        color: 0x8899aa,
        roughness: 0.5,
        metalness: 0.5,
        side: THREE.DoubleSide
    });
    
    const elBack = new THREE.Mesh(new THREE.PlaneGeometry(8, 10), elevatorWallMat);
    elBack.position.set(0, 5, -4);
    elevatorGroup.add(elBack);
    
    const elLeft = new THREE.Mesh(new THREE.PlaneGeometry(8, 10), elevatorWallMat);
    elLeft.rotation.y = Math.PI / 2;
    elLeft.position.set(-4, 5, 0);
    elevatorGroup.add(elLeft);
    
    const elRight = new THREE.Mesh(new THREE.PlaneGeometry(8, 10), elevatorWallMat);
    elRight.rotation.y = -Math.PI / 2;
    elRight.position.set(4, 5, 0);
    elevatorGroup.add(elRight);
    
    // --- Inside Elevator Control Panel ---
    const insidePanelGeo = new THREE.BoxGeometry(1.2, 5.0, 0.2);
    const insidePanelMat = new THREE.MeshStandardMaterial({color: 0x333333});
    const insidePanel = new THREE.Mesh(insidePanelGeo, insidePanelMat);
    insidePanel.position.set(-3, 4, 3.8); // On the left front wall
    insidePanel.rotation.y = Math.PI; // Face +z towards the player
    elevatorGroup.add(insidePanel);

    const insideDisplayGeo = new THREE.PlaneGeometry(0.8, 0.4);
    const insideDisplayMat = new THREE.MeshBasicMaterial({ map: displayTexture });
    const insideDisplay = new THREE.Mesh(insideDisplayGeo, insideDisplayMat);
    insideDisplay.position.set(0, 2.1, 0.11); // Placed at the very top of the panel
    insidePanel.add(insideDisplay);

    // 11 Buttons for 11 Floors
    for(let i = 0; i < 11; i++) {
        const fName = floorNames[i];
        const col = i % 2; // 0 or 1
        const rowFromBottom = Math.floor(i / 2); // 0 to 5
        
        const xPos = (col === 0) ? -0.25 : 0.25;
        const yPos = (rowFromBottom - 2.5) * 0.65;
        
        // Base Cylinder
        const baseGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.05, 32);
        const baseMat = new THREE.MeshStandardMaterial({color: 0x111111});
        const base = new THREE.Mesh(baseGeo, baseMat);
        base.rotation.x = Math.PI / 2;
        base.position.set(xPos, yPos, 0.125); 
        insidePanel.add(base);

        // Border Ring
        const ringGeo = new THREE.TorusGeometry(0.18, 0.03, 16, 32);
        const ringMat = new THREE.MeshStandardMaterial({color: 0xaaaaaa, metalness: 0.9, roughness: 0.1});
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.set(xPos, yPos, 0.15);
        insidePanel.add(ring);

        // Number Face (Circle)
        const btnCanvas = document.createElement('canvas');
        btnCanvas.width = 128;
        btnCanvas.height = 128;
        const btnCtx = btnCanvas.getContext('2d');
        btnCtx.clearRect(0, 0, 128, 128); // Transparent background!
        
        btnCtx.font = fName.length > 1 ? 'bold 60px Courier New' : 'bold 80px Courier New';
        btnCtx.textAlign = 'center';
        btnCtx.textBaseline = 'middle';
        btnCtx.fillStyle = '#ffffff'; // White text
        btnCtx.fillText(fName, 64, 64);
        
        const btnTexture = new THREE.CanvasTexture(btnCanvas);
        const faceGeo = new THREE.CircleGeometry(0.16, 32);
        const faceMat = new THREE.MeshBasicMaterial({
            map: btnTexture,
            transparent: true,
            color: 0x555555
        });
        
        const btn = new THREE.Mesh(faceGeo, faceMat);
        btn.position.set(xPos, yPos, 0.151);
        btn.userData = { 
            action: 'goToFloor', 
            floorIndex: i, 
            neonColor: neonColors[i],
            defaultColor: 0x555555
        };
        
        insidePanel.add(btn);
        interactableObjects.push(btn);
        elevatorButtons.push(btn);
    }

    // Elevator Front Walls & Doors
    const elFrontGeo = new THREE.PlaneGeometry(2, 10);
    const elFrontLeft = new THREE.Mesh(elFrontGeo, elevatorWallMat);
    elFrontLeft.position.set(-3, 5, 3.9); 
    elevatorGroup.add(elFrontLeft);
    
    const elFrontRight = new THREE.Mesh(elFrontGeo, elevatorWallMat);
    elFrontRight.position.set(3, 5, 3.9);
    elevatorGroup.add(elFrontRight);

    const doorGeo = new THREE.PlaneGeometry(2, 10);
    const doorMat = new THREE.MeshStandardMaterial({color: 0x111122, metalness: 0.9, roughness: 0.2, side: THREE.DoubleSide});
    
    leftDoor = new THREE.Mesh(doorGeo, doorMat);
    leftDoor.position.set(-1, 5, 3.96); // slides slightly behind front wall
    elevatorGroup.add(leftDoor);
    
    rightDoor = new THREE.Mesh(doorGeo, doorMat);
    rightDoor.position.set(1, 5, 3.96);
    elevatorGroup.add(rightDoor);
    
    // Inner light
    const innerLight = new THREE.PointLight(0xffffff, 0.6, 10);
    innerLight.position.set(0, 8, 0);
    elevatorGroup.add(innerLight);

    elevatorGroup.position.copy(elevatorPosition);
    
    const shaftGeo = new THREE.BoxGeometry(8.2, floorHeight * 11, 8.2);
    const shaftMat = new THREE.MeshStandardMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.05,
        side: THREE.BackSide,
        depthWrite: false
    });
    const shaft = new THREE.Mesh(shaftGeo, shaftMat);
    shaft.position.set(0, floorHeight * 5.5, -24);
    scene.add(shaft);
}

function buildWallsFromPoints(points, yOffset, height, wallMat, scene, frameMat, isHole) {
    for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i+1];
        const x1 = p1.x, z1 = -p1.y;
        const x2 = p2.x, z2 = -p2.y;
        
        if (!isHole && Math.abs(z1 + 20) < 0.1 && Math.abs(z2 + 20) < 0.1 && Math.max(x1, x2) <= 4.1 && Math.min(x1, x2) >= -4.1) {
            continue;
        }

        const dx = x2 - x1;
        const dz = z2 - z1;
        const length = Math.sqrt(dx*dx + dz*dz);
        if (length < 0.001) continue;

        const wallGeo = new THREE.PlaneGeometry(length, height);
        const wall = new THREE.Mesh(wallGeo, wallMat);
        wall.position.set((x1 + x2)/2, yOffset + height/2, (z1 + z2)/2);
        wall.rotation.y = Math.atan2(dx, dz) - Math.PI/2;
        scene.add(wall);
    }

    if (!isHole) {
        const doorWidth = 4;
        const doorHeight = 10;
        const totalWidth = 8;
        const sideWidth = (totalWidth - doorWidth) / 2;
        const z1 = -20;
        
        const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(sideWidth, height), wallMat);
        leftWall.position.set(-doorWidth/2 - sideWidth/2, yOffset + height/2, z1);
        scene.add(leftWall);

        const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(sideWidth, height), wallMat);
        rightWall.position.set(doorWidth/2 + sideWidth/2, yOffset + height/2, z1);
        scene.add(rightWall);

        if (height > doorHeight) {
            const topWall = new THREE.Mesh(new THREE.PlaneGeometry(doorWidth, height - doorHeight), wallMat);
            topWall.position.set(0, yOffset + doorHeight + (height - doorHeight)/2, z1);
            scene.add(topWall);
        }
    }

    const borderPoints = points.map(p => new THREE.Vector3(p.x, 0, -p.y));
    const borderGeoFloor = new THREE.BufferGeometry().setFromPoints(borderPoints);
    const borderLineFloor = new THREE.Line(borderGeoFloor, frameMat);
    borderLineFloor.position.y = yOffset + 0.1;
    scene.add(borderLineFloor);

    const borderGeoCeil = new THREE.BufferGeometry().setFromPoints(borderPoints);
    const borderLineCeil = new THREE.Line(borderGeoCeil, frameMat);
    borderLineCeil.position.y = yOffset + height - 0.1;
    scene.add(borderLineCeil);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    const time = performance.now();
    const delta = (time - prevTime) / 1000;
    
    // --- RAYCASTING (Crosshair Highlight) ---
    if (controls.isLocked) {
        raycaster.setFromCamera(centerMouse, camera);
        const intersects = raycaster.intersectObjects(interactableObjects, false);
        
        if (intersects.length > 0 && intersects[0].distance < 4) {
            // Hover effect on crosshair
            crosshair.style.backgroundColor = '#ff0055';
            crosshair.style.boxShadow = '0 0 15px #ff0055';
            crosshair.style.transform = 'translate(-50%, -50%) scale(1.5)';
        } else {
            // Reset crosshair
            crosshair.style.backgroundColor = 'var(--primary-color)';
            crosshair.style.boxShadow = '0 0 10px var(--primary-color)';
            crosshair.style.transform = 'translate(-50%, -50%) scale(1)';
        }
    }

    // --- UPDATE ELEVATOR DISPLAYS ---
    const displayFloorIndex = Math.max(0, Math.round(elevatorGroup.position.y / floorHeight));
    const displayFloor = floorNames[displayFloorIndex];
    let displayArrow = "";
    if (currentDirection === 'up') displayArrow = "UP";
    else if (currentDirection === 'down') displayArrow = "DN";
    const currentStateStr = `${displayFloor}_${displayArrow}`;
    
    if (currentStateStr !== lastDisplayState) {
        lastDisplayState = currentStateStr;
        displayCtx.fillStyle = '#0a0a0a';
        displayCtx.fillRect(0, 0, 256, 128);
        
        displayCtx.textAlign = 'center';
        displayCtx.textBaseline = 'middle';
        displayCtx.fillStyle = '#00f0ff'; // Neon blue text
        
        let text = displayFloor;
        if (displayArrow === "UP") text += " ▲";
        if (displayArrow === "DN") text += " ▼";
        
        displayCtx.font = text.length > 4 ? 'bold 60px Courier New' : 'bold 80px Courier New';
        displayCtx.fillText(text, 128, 64);
        displayTexture.needsUpdate = true;
    }

    // --- ELEVATOR ANIMATIONS ---
    if (doorState === 'opening') {
        doorOpenness += delta * 1.2;
        if (doorOpenness >= 1) {
            doorOpenness = 1;
            doorState = 'open';
            
            // Auto close after 3 seconds
            setTimeout(() => {
                if (doorState === 'open' && elevatorState === 'idle') {
                    doorState = 'closing';
                }
            }, 3000);
        }
    } else if (doorState === 'closing') {
        doorOpenness -= delta * 1.2;
        if (doorOpenness <= 0) {
            doorOpenness = 0;
            doorState = 'closed';
        }
    }
    
    if (leftDoor && rightDoor) {
        leftDoor.position.x = -1 - (doorOpenness * 2);
        rightDoor.position.x = 1 + (doorOpenness * 2);
    }

    // Update floor doors
    for (let i = 0; i < floorDoorsArray.length; i++) {
        const fDoor = floorDoorsArray[i];
        if (i === currentFloorIndex) {
             fDoor.left.position.x = -1 - (doorOpenness * 2);
             fDoor.right.position.x = 1 + (doorOpenness * 2);
        } else {
             fDoor.left.position.x = -1;
             fDoor.right.position.x = 1;
        }
    }
    
    // --- ELEVATOR QUEUE DISPATCHER ---
    if (elevatorState === 'idle' && doorState === 'closed' && requestedFloors.size > 0) {
        const nextTarget = getNextFloor();
        if (nextTarget !== currentFloorIndex) {
            targetElevatorY = nextTarget * floorHeight;
            elevatorState = 'moving';
            currentDirection = targetElevatorY > elevatorGroup.position.y ? 'up' : 'down';
        } else {
            requestedFloors.delete(nextTarget);
            updateButtonColors();
            doorState = 'opening';
        }
    }
    
    // --- ELEVATOR MOVEMENT & INTERCEPT ---
    if (elevatorState === 'moving') {
        const moveDelta = movingSpeed * delta;
        const currentY = elevatorGroup.position.y;
        
        let nextY = currentY;
        const dir = Math.sign(targetElevatorY - currentY);
        nextY += dir * moveDelta;
        
        // Prevent overshooting final target
        if (dir > 0 && nextY >= targetElevatorY) nextY = targetElevatorY;
        if (dir < 0 && nextY <= targetElevatorY) nextY = targetElevatorY;
        
        const step = nextY - currentY;
        elevatorGroup.position.y = nextY;
        
        if (inElevatorZone) {
            const playerY = controls.getObject().position.y;
            if (Math.abs(playerY - (currentY + 4)) < 0.5 || Math.abs(playerY - (currentY + 14)) < 0.5) {
                controls.getObject().position.y += step;
                velocity.y = 0; 
            }
        }
        
        // Check for intercepts
        const exactCurrentFloorIndex = Math.round(nextY / floorHeight);
        const exactY = exactCurrentFloorIndex * floorHeight;
        
        const isAtFloor = Math.abs(nextY - exactY) <= Math.abs(moveDelta);
        const isRequested = requestedFloors.has(exactCurrentFloorIndex);
        const isNewFloor = exactCurrentFloorIndex !== currentFloorIndex;
        
        if ((isNewFloor && isRequested && isAtFloor) || nextY === targetElevatorY) {
            // Stop at floor!
            elevatorGroup.position.y = exactY; // Snap precisely
            currentFloorIndex = exactCurrentFloorIndex;
            requestedFloors.delete(currentFloorIndex);
            updateButtonColors();
            
            elevatorState = 'idle';
            doorState = 'opening';
            
            if (requestedFloors.size === 0) {
                currentDirection = 'idle';
            }
        }
    }

    // --- PLAYER MOVEMENT ---
    if (controls.isLocked === true) {
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        
        if (elevatorState !== 'moving' || !inElevatorZone) {
            velocity.y -= 9.8 * 10.0 * delta;
        }

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize(); 

        const speed = 40.0;
        if (moveForward || moveBackward) velocity.z -= direction.z * speed * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * speed * delta;

        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);
        controls.getObject().position.y += (velocity.y * delta);

        const playerPos = controls.getObject().position;
        
        let baseFloorY;
        if (inElevatorZone) {
            const elY = elevatorGroup.position.y;
            if (playerPos.y >= elY + 13.5) {
                baseFloorY = elY + 10;
            } else if (playerPos.y >= elY + 3.5) {
                baseFloorY = elY;
            } else {
                baseFloorY = 0; // Fall to bottom of shaft
            }
        } else {
            const flooredFloor = Math.max(0, Math.floor(playerPos.y / floorHeight));
            baseFloorY = flooredFloor * floorHeight;
        }
        
        if (controls.getObject().position.y < baseFloorY + 4) {
            velocity.y = 0;
            controls.getObject().position.y = baseFloorY + 4;
            canJump = true;
        }

        // Zones
        const isNowInElevator = playerPos.z < -20 && playerPos.z > -28 && playerPos.x > -4 && playerPos.x < 4;
        
        if (isNowInElevator && !inElevatorZone) {
            inElevatorZone = true;
        } else if (!isNowInElevator && inElevatorZone) {
            inElevatorZone = false;
        }
        
        // Door collision
        const flooredFloor = Math.max(0, Math.floor(playerPos.y / floorHeight));
        let isFloorDoorOpen = false;
        if (flooredFloor === currentFloorIndex && doorOpenness > 0.4) {
            isFloorDoorOpen = true; 
        }

        if (!isFloorDoorOpen) {
            if (playerPos.z < -19.5 && playerPos.z > -20.5) {
                if (inElevatorZone) playerPos.z = -20.5;
                else playerPos.z = -19.5;
            }
        }

        // Bounds Checking
        if (playerPos.z < -27) playerPos.z = -27; 
        if (playerPos.z > 24) playerPos.z = 24;   
        
        let outerMaxX = 35;
        if (playerPos.z > -15 && playerPos.z < 15) {
             outerMaxX = 35 - (playerPos.z - (-15)) / 30 * 10;
        } else if (playerPos.z >= 15) {
             outerMaxX = 25;
        } else if (playerPos.z <= -15) {
             if (playerPos.z < -20) {
                 outerMaxX = 3.5;
             } else {
                 outerMaxX = 3.5 + (playerPos.z - (-20)) / 5 * 31.5;
             }
        }
        
        if (playerPos.x > outerMaxX - 0.5) playerPos.x = outerMaxX - 0.5;
        if (playerPos.x < -(outerMaxX - 0.5)) playerPos.x = -(outerMaxX - 0.5);

        // Inner hole bounds
        if (playerPos.z > -5.5 && playerPos.z < 15.5) {
            let maxX = 16.5;
            if (playerPos.z < 5) {
                maxX = 10.5 + (playerPos.z - (-5.5)) / 10.5 * 6; 
            }
            if (playerPos.x > -maxX && playerPos.x < maxX) {
                const distZTop = Math.abs(playerPos.z - (-5.5));
                const distZBot = Math.abs(playerPos.z - 15.5);
                const distX = Math.abs(Math.abs(playerPos.x) - maxX);
                const minDist = Math.min(distZTop, distZBot, distX);
                
                if (minDist === distZTop) playerPos.z = -5.5;
                else if (minDist === distZBot) playerPos.z = 15.5;
                else if (minDist === distX) playerPos.x = playerPos.x > 0 ? maxX : -maxX;
            }
        }
    }

    // --- MULTIPLAYER SYNC ---
    if (typeof io !== 'undefined' && socket && socket.connected) {
        const p = controls.getObject().position;
        const euler = new THREE.Euler(0, 0, 0, 'YXZ');
        euler.setFromQuaternion(camera.quaternion);
        
        if (!socket.lastPos || 
            Math.abs(socket.lastPos.x - p.x) > 0.05 || 
            Math.abs(socket.lastPos.y - p.y) > 0.05 || 
            Math.abs(socket.lastPos.z - p.z) > 0.05 || 
            Math.abs(socket.lastPos.rotY - euler.y) > 0.05) {
                
            socket.emit('playerMovement', {
                x: p.x, y: p.y, z: p.z, rotY: euler.y
            });
            socket.lastPos = { x: p.x, y: p.y, z: p.z, rotY: euler.y };
        }
    }

    prevTime = time;
    renderer.render(scene, camera);
}

// Ensure prompt text only shows up when interacting with raycaster, not permanently
function showPrompt(title, sub) {
    instructions.style.display = 'block';
    mainTitle.innerHTML = title;
    subTitle.innerHTML = sub;
}

function hidePrompt() {
    instructions.style.display = 'none';
}

// --- MULTIPLAYER FUNCTIONS ---
function initMultiplayer() {
    if (typeof io !== 'undefined') {
        socket = io();
        
        socket.on('currentPlayers', (players) => {
            Object.keys(players).forEach((id) => {
                if (id === socket.id) return;
                addOtherPlayer(id, players[id]);
            });
        });

        socket.on('newPlayer', (playerInfo) => {
            addOtherPlayer(playerInfo.id, playerInfo.player);
        });

        socket.on('playerMoved', (playerInfo) => {
            const op = otherPlayers[playerInfo.id];
            if (op) {
                const dx = playerInfo.x - op.group.position.x;
                const dz = playerInfo.z - op.group.position.z;
                const dist = Math.sqrt(dx*dx + dz*dz);
                
                op.group.position.set(playerInfo.x, playerInfo.y - 4, playerInfo.z);
                op.group.rotation.y = playerInfo.rotY;
                
                if (dist > 0.005) {
                    op.movingTimer += dist * 2;
                    const swing = Math.sin(op.movingTimer * 2.5) * 0.8; 
                    if (op.leftLeg) op.leftLeg.rotation.x = swing;
                    if (op.rightLeg) op.rightLeg.rotation.x = -swing;
                    if (op.leftArm) op.leftArm.rotation.x = -swing;
                    if (op.rightArm) op.rightArm.rotation.x = swing;
                } else {
                    if (op.leftLeg) op.leftLeg.rotation.x = 0;
                    if (op.rightLeg) op.rightLeg.rotation.x = 0;
                    if (op.leftArm) op.leftArm.rotation.x = 0;
                    if (op.rightArm) op.rightArm.rotation.x = 0;
                }
            }
        });

        socket.on('playerDisconnected', (id) => {
            if (otherPlayers[id]) {
                scene.remove(otherPlayers[id].group);
                delete otherPlayers[id];
            }
        });

        socket.on('elevatorCalled', (floorIndex) => {
            requestFloor(floorIndex, true);
        });
    }
}

function addOtherPlayer(id, playerInfo) {
    const group = new THREE.Group();
    const p = 0.12; // 1 pixel = 0.12 units in 3D
    
    // Steve Colors
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xd0a68d });
    const shirtMat = new THREE.MeshStandardMaterial({ color: 0x00aaaa });
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x333399 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x331b0f });
    
    // Helper to create pivot joints (so limbs swing from the top, not center)
    const createLimb = (w, h, d, mat, pivotY) => {
        const pivot = new THREE.Group();
        const geo = new THREE.BoxGeometry(w, h, d);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.y = -h / 2; // Offset so top of mesh is at pivot
        pivot.add(mesh);
        pivot.position.y = pivotY;
        return pivot;
    };
    
    // Legs (Pivot at Y = 12p)
    const legW = 4*p, legH = 12*p, legD = 4*p;
    const leftLeg = createLimb(legW, legH, legD, pantsMat, 12*p);
    leftLeg.position.x = -2*p;
    group.add(leftLeg);
    
    const rightLeg = createLimb(legW, legH, legD, pantsMat, 12*p);
    rightLeg.position.x = 2*p;
    group.add(rightLeg);
    
    // Body (Fixed at Y: 12p to 24p)
    const bodyGeo = new THREE.BoxGeometry(8*p, 12*p, 4*p);
    const body = new THREE.Mesh(bodyGeo, shirtMat);
    body.position.y = 18*p; // Center of 12->24
    group.add(body);
    
    // Arms (Pivot at Y = 24p)
    const armW = 4*p, armH = 12*p, armD = 4*p;
    const leftArm = createLimb(armW, armH, armD, skinMat, 24*p);
    leftArm.position.x = -6*p;
    group.add(leftArm);
    
    const rightArm = createLimb(armW, armH, armD, skinMat, 24*p);
    rightArm.position.x = 6*p;
    group.add(rightArm);
    
    // Head (Fixed on top, Y = 24p to 32p)
    const headGroup = new THREE.Group();
    headGroup.position.y = 24*p;
    
    const headGeo = new THREE.BoxGeometry(8*p, 8*p, 8*p);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 4*p; // Center of head
    headGroup.add(head);
    
    // Hair
    const hairGeo = new THREE.BoxGeometry(8.2*p, 2*p, 8.2*p);
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.y = 7.1*p; // Top of head
    headGroup.add(hair);
    
    // Eyes (simple black pixels)
    const eyeGeo = new THREE.BoxGeometry(1*p, 1*p, 0.5*p);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const lEye = new THREE.Mesh(eyeGeo, eyeMat);
    lEye.position.set(-2*p, 4*p, -4.1*p);
    const rEye = new THREE.Mesh(eyeGeo, eyeMat);
    rEye.position.set(2*p, 4*p, -4.1*p);
    headGroup.add(lEye);
    headGroup.add(rEye);
    
    group.add(headGroup);
    
    group.position.set(playerInfo.x, playerInfo.y - 4, playerInfo.z);
    group.rotation.y = playerInfo.rotY;
    
    scene.add(group);
    
    otherPlayers[id] = {
        group: group,
        leftLeg: leftLeg,
        rightLeg: rightLeg,
        leftArm: leftArm,
        rightArm: rightArm,
        movingTimer: 0
    };
}
