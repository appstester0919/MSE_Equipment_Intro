document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const screens = {
        floorSelection: document.getElementById('floor-selection-screen'),
        roomSelection: document.getElementById('room-selection-screen'),
        equipmentDisplay: document.getElementById('equipment-display-screen'),
        equipmentDetail: document.getElementById('equipment-detail-screen'),
    };

    const floorButtons = document.querySelectorAll('.floor-button');
    const roomListContainer = document.getElementById('room-list');
    const equipmentListContainer = document.getElementById('equipment-list');
    const roomSelectionTitle = document.getElementById('room-selection-title');
    const equipmentDisplayTitle = document.getElementById('equipment-display-title');

    const backToFloorSelectionButton = document.getElementById('back-to-floor-selection');
    const backToRoomSelectionButton = document.getElementById('back-to-room-selection');
    const backToEquipmentDisplayButton = document.getElementById('back-to-equipment-display');

    const equipmentDetailImage = document.getElementById('equipment-detail-image');
    const equipmentAudioPlayer = document.getElementById('equipment-audio-player');
    const equipmentNameTitle = document.getElementById('equipment-name-title');

    const versionSelect = document.getElementById('version-select');
    const languageSelect = document.getElementById('language-select');

    // App State
    let currentFloorId = null;
    let currentRoomId = null;
    let currentEquipment = null;

    // --- Navigation --- 
    function showScreen(screenName) {
        Object.values(screens).forEach(screen => screen.classList.remove('active'));
        if (screens[screenName]) {
            screens[screenName].classList.add('active');
        }
    }

    // --- Data Loading and Display --- 
    function loadRooms(floorId) {
        currentFloorId = floorId;
        const floor = window.appData.floors.find(f => f.id === floorId);
        if (!floor) {
            console.error('Floor not found:', floorId);
            return;
        }

        roomSelectionTitle.textContent = `Select a Room (${floor.name})`;
        roomListContainer.innerHTML = ''; // Clear previous rooms

        floor.rooms.forEach(room => {
            const roomButton = document.createElement('button');
            roomButton.className = 'grid-item-button room-button';
            roomButton.textContent = room.name;
            roomButton.dataset.roomId = room.id;
            roomButton.addEventListener('click', () => {
                loadEquipment(floorId, room.id);
            });
            roomListContainer.appendChild(roomButton);
        });
        showScreen('roomSelection');
    }

    function loadEquipment(floorId, roomId) {
        currentRoomId = roomId;
        const floor = window.appData.floors.find(f => f.id === floorId);
        if (!floor) return;
        const room = floor.rooms.find(r => r.id === roomId);
        if (!room) {
            console.error('Room not found:', roomId, 'on floor:', floorId);
            return;
        }

        equipmentDisplayTitle.textContent = `Equipment in ${room.name} (${floor.name})`;
        equipmentListContainer.innerHTML = ''; // Clear previous equipment

        if (room.equipment.length === 0) {
            equipmentListContainer.innerHTML = '<p>No equipment listed for this room.</p>';
        }

        room.equipment.forEach(equipment => {
            const equipDiv = document.createElement('div');
            equipDiv.className = 'grid-item-button equipment-button';
            equipDiv.innerHTML = `
                <img src="${equipment.image}" alt="${equipment.name}" style="width: 100px; height: auto; margin-bottom: 10px;" onerror="this.onerror=null;this.src='assets/images/equipment-placeholder.svg';">
                <span class="equipment-name">${equipment.name}</span>`;
            equipDiv.addEventListener('click', () => showEquipmentDetail(equipment));
            equipmentListContainer.appendChild(equipDiv);
        });
        showScreen('equipmentDisplay');
    }

    function showEquipmentDetail(equipment) {
        currentEquipment = equipment;
        equipmentNameTitle.innerHTML = `${equipment.name}<br><span style="font-size: 0.8em; color: #555;">${equipment.name_zh || ''}</span>`;
        equipmentDetailImage.src = equipment.image || 'assets/images/equipment-placeholder.svg';
        equipmentDetailImage.alt = equipment.name;
        equipmentDetailImage.onerror = () => { equipmentDetailImage.src = 'assets/images/equipment-placeholder.svg'; }; 
        updateAudioSource();
        showScreen('equipmentDetail');
    }

    function updateAudioSource() {
        if (!currentEquipment) return;

        const version = versionSelect.value; // 'general' or 'pro'
        const language = languageSelect.value; // 'eng' or 'pth'

        let audioPath = '';
        try {
            audioPath = currentEquipment.audio[language][version];
        } catch (e) {
            console.error('Audio path not found for:', currentEquipment.name, language, version, e);
            equipmentAudioPlayer.src = '';
            equipmentAudioPlayer.pause();
            // Optionally, display a message to the user that the audio is unavailable
            return;
        }
        
        if (audioPath) {
            equipmentAudioPlayer.src = audioPath;
            // equipmentAudioPlayer.play(); // Optional: auto-play on selection
        } else {
            console.warn('Audio file not specified for:', currentEquipment.name, language, version);
            equipmentAudioPlayer.src = '';
            equipmentAudioPlayer.pause();
        }
    }

    // --- Event Listeners ---
    floorButtons.forEach(button => {
        button.addEventListener('click', () => {
            loadRooms(button.dataset.floor);
        });
    });

    backToFloorSelectionButton.addEventListener('click', () => {
        showScreen('floorSelection');
        currentFloorId = null;
        currentRoomId = null;
        currentEquipment = null;
    });

    backToRoomSelectionButton.addEventListener('click', () => {
        if (currentFloorId) {
            loadRooms(currentFloorId);
        } else {
            showScreen('floorSelection'); // Fallback if something went wrong
        }
        currentRoomId = null;
        currentEquipment = null;
    });

    backToEquipmentDisplayButton.addEventListener('click', () => {
        if (currentFloorId && currentRoomId) {
            loadEquipment(currentFloorId, currentRoomId);
        } else if (currentFloorId) {
            loadRooms(currentFloorId); // Fallback to room selection
        } else {
            showScreen('floorSelection'); // Fallback
        }
        currentEquipment = null;
    });

    versionSelect.addEventListener('change', updateAudioSource);
    languageSelect.addEventListener('change', updateAudioSource);

    // --- Initial Setup ---
    showScreen('floorSelection'); // Start with the floor selection screen

    // Create placeholder images if they don't exist (for robustness)
    function createPlaceholderSVG(filename, text) {
        // This is a client-side attempt. Ideally, these are actual files.
        // For a real app, ensure these SVGs exist in assets/images/
        const svgContent = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#ccc"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#555" font-size="12">${text}</text></svg>`;
        // In a browser, you can't write files. This is more for conceptual understanding.
        // console.log(`Placeholder for ${filename}: ${svgContent}`);
    }

    createPlaceholderSVG('7f-placeholder.svg', '7F');
    createPlaceholderSVG('2f-placeholder.svg', '2F');
    createPlaceholderSVG('equipment-placeholder.svg', 'No Image');
});