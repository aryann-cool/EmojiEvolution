// Game state
const gameState = {
    level: 1,
    score: 0,
    taps: 0,
    evolution: 0,
    currentEvolutionStage: 0,
    currentPathIndex: 0,
    completedPaths: [],
    unlockedAchievements: [],
    tapStrength: 1,
    tapMultiplier: 1,
    autoTaps: 0,
    completedPathCount: 0,
    purchasedUpgrades: [],
    shareCount: 0,
    username: null,
    settings: {
        soundEnabled: true,
        particlesEnabled: true
    }
};

// Evolution paths
const evolutionPaths = [
    // Path 1: Life Cycle
    ['🥚', '🐣', '🐥', '🐤', '🐓', '🦚', '🦜', '🦅', '🪽', '🔥', '🧬'],
    
    // Path 2: Space
    ['🌱', '🌿', '🌳', '🌍', '🌎', '🌏', '🪐', '🌌', '🚀', '👽', '🛸'],
    
    // Path 3: Technology
    ['💡', '⚙️', '🔋', '📱', '💻', '🖥️', '🤖', '🦾', '🧠', '⚛️', '🌐'],
    
    // Path 4: Fantasy
    ['✨', '🧙', '🧝', '🐉', '🦄', '🏰', '👑', '🔮', '🧿', '⭐', '🌈'],
    
    // Path 5: Ocean
    ['💧', '🐟', '🐠', '🐬', '🦈', '🐙', '🐋', '🧜', '🌊', '🏝️', '🔱'],
    
    // Path 6: Food
    ['🌱', '🥕', '🍅', '🍲', '🥗', '🍰', '🎂', '👨‍🍳', '🍕', '🍔', '🍷'],
    
    // Path 7: Civilization
    ['🏕️', '🏠', '🏘️', '🏙️', '🌆', '🌇', '🌉', '🌃', '🏛️', '🏦', '🚄'],
    
    // Path 8: Music
    ['🎵', '🎹', '🎸', '🎻', '🎷', '🥁', '🎤', '🎼', '🎧', '🎭', '🎬'],
    
    // Path 9: Animal Kingdom
    ['🐜', '🐌', '🐁', '🐇', '🦊', '🐕', '🐅', '🦁', '🐘', '🦣', '🦖'],
    
    // Path 10: Abstract Concepts
    ['💭', '💡', '📚', '🔍', '📊', '🧩', '🔮', '🧿', '🌀', '💫', '✨']
];

// Allow generated paths to be added
const generatedPaths = [];

// Upgrade definitions
const upgrades = [
    { 
        id: 'tap_strength', 
        name: 'Stronger Taps', 
        description: 'Increase tap strength by 1', 
        baseCost: 30, 
        costMultiplier: 1.4,
        effect: () => { gameState.tapStrength += 1; }
    },
    { 
        id: 'auto_tapper', 
        name: 'Auto Tapper', 
        description: 'Automatically tap once per second', 
        baseCost: 80, 
        costMultiplier: 1.7,
        effect: () => { gameState.autoTaps += 1; }
    },
    { 
        id: 'tap_multiplier', 
        name: 'Tap Multiplier', 
        description: 'Multiply all tap values by 1.5', 
        baseCost: 150, 
        costMultiplier: 2.2,
        effect: () => { gameState.tapMultiplier *= 1.5; }
    },
    { 
        id: 'evolution_booster', 
        name: 'Evolution Booster', 
        description: 'Speed up evolution progress by 20%', 
        baseCost: 180, 
        costMultiplier: 2,
        effect: () => { /* Logic handled in handleTap */ }
    },
    { 
        id: 'score_boost', 
        name: 'Score Booster', 
        description: 'Increase score gain by 30%', 
        baseCost: 100, 
        costMultiplier: 1.8,
        effect: () => { /* Logic handled in handleTap */ }
    }
];

// Achievement definitions
const achievements = [
    { id: 'first_tap', emoji: '👆', name: 'First Step', requirement: () => gameState.taps >= 1, description: 'Tap for the first time' },
    { id: 'tap_10', emoji: '🔟', name: 'Dedicated Tapper', requirement: () => gameState.taps >= 10, description: 'Tap 10 times' },
    { id: 'tap_50', emoji: '💯', name: 'Tap Master', requirement: () => gameState.taps >= 50, description: 'Tap 50 times' },
    { id: 'tap_100', emoji: '🏆', name: 'Tap Champion', requirement: () => gameState.taps >= 100, description: 'Tap 100 times' },
    { id: 'tap_500', emoji: '🤖', name: 'Tap Machine', requirement: () => gameState.taps >= 500, description: 'Tap 500 times' },
    { id: 'tap_1000', emoji: '🦾', name: 'Tap Cyborg', requirement: () => gameState.taps >= 1000, description: 'Tap 1000 times' },
    { id: 'first_evolution', emoji: '🔄', name: 'Evolution Begins', requirement: () => gameState.currentEvolutionStage >= 1, description: 'Reach your first evolution' },
    { id: 'third_evolution', emoji: '🧬', name: 'Evolving Fast', requirement: () => gameState.currentEvolutionStage >= 3, description: 'Reach the third evolution stage' },
    { id: 'halfway', emoji: '🔝', name: 'Halfway There', requirement: () => gameState.currentEvolutionStage >= 5, description: 'Reach the halfway point' },
    { id: 'almost_done', emoji: '🏁', name: 'Almost Complete', requirement: () => gameState.currentEvolutionStage >= 9, description: 'Almost at the final form' },
    { id: 'final_form', emoji: '⭐', name: 'Final Form', requirement: () => gameState.currentEvolutionStage >= 10, description: 'Reach the final evolution form' },
    { id: 'complete_path', emoji: '🛣️', name: 'Path Completed', requirement: () => gameState.completedPaths.length >= 1, description: 'Complete one evolution path' },
    { id: 'complete_3_paths', emoji: '🔀', name: 'Triple Threat', requirement: () => gameState.completedPaths.length >= 3, description: 'Complete three evolution paths' },
    { id: 'complete_5_paths', emoji: '🌟', name: 'Master Explorer', requirement: () => gameState.completedPaths.length >= 5, description: 'Complete five evolution paths' },
    { id: 'complete_all', emoji: '🏆', name: 'Master Evolver', requirement: () => gameState.completedPaths.length >= evolutionPaths.length, description: 'Complete all evolution paths' },
    { id: 'first_upgrade', emoji: '🔼', name: 'First Upgrade', requirement: () => gameState.purchasedUpgrades.length >= 1, description: 'Purchase your first upgrade' },
    { id: 'three_upgrades', emoji: '📈', name: 'Upgrade Enthusiast', requirement: () => gameState.purchasedUpgrades.length >= 3, description: 'Purchase three upgrades' },
    { id: 'all_upgrades', emoji: '🛒', name: 'Fully Upgraded', requirement: () => gameState.purchasedUpgrades.length >= upgrades.length, description: 'Purchase all upgrades' },
    { id: 'speed_run', emoji: '⚡', name: 'Speed Runner', requirement: () => gameState.currentEvolutionStage >= 5 && gameState.taps < 40, description: 'Reach halfway with fewer than 40 taps' },
    { id: 'night_owl', emoji: '🦉', name: 'Night Owl', requirement: () => new Date().getHours() >= 22 || new Date().getHours() <= 5, description: 'Play between 10 PM and 5 AM' },
    { id: 'early_bird', emoji: '🐦', name: 'Early Bird', requirement: () => new Date().getHours() >= 5 && new Date().getHours() <= 9, description: 'Play between 5 AM and 9 AM' },
    { id: 'weekend_warrior', emoji: '🏋️', name: 'Weekend Warrior', requirement: () => [0, 6].includes(new Date().getDay()), description: 'Play on a weekend' },
    { id: 'social_butterfly', emoji: '🦋', name: 'Social Butterfly', requirement: () => gameState.shareCount >= 3, description: 'Share your evolution 3 times' },
    { id: 'generated_path', emoji: '🧠', name: 'AI Explorer', requirement: () => gameState.completedPaths.length >= evolutionPaths.length, description: 'Unlock an AI-generated path' }
];

// DOM Elements
const currentEmojiEl = document.getElementById('current-emoji');
const progressEl = document.getElementById('progress');
const levelEl = document.getElementById('level');
const scoreEl = document.getElementById('score');
const achievementsListEl = document.getElementById('achievements-list');
const evolutionPathEl = document.getElementById('evolution-path');
const evolutionModalEl = document.getElementById('evolution-modal');
const oldEmojiEl = document.getElementById('old-emoji');
const newEmojiEl = document.getElementById('new-emoji');
const evolutionMessageEl = document.getElementById('evolution-message');
const continueBtnEl = document.getElementById('continue-btn');
const shareModalEl = document.getElementById('share-modal');
const shareBtnEl = document.getElementById('share-btn');
const closeShareBtnEl = document.getElementById('close-share-btn');
const downloadBtnEl = document.getElementById('download-btn');
const shareLevelEl = document.getElementById('share-level');
const shareScoreEl = document.getElementById('share-score');
const shareEmojiEl = document.getElementById('share-emoji');
const shareEmojiDisplayEl = document.getElementById('share-emoji-display');
const shareCaptionEl = document.getElementById('share-caption');
const emojiContainerEl = document.getElementById('emoji-container');
const upgradesListEl = document.getElementById('upgrades-list');
const communityPostsEl = document.getElementById('community-posts');
const loadMoreBtnEl = document.getElementById('load-more-btn');
const settingsBtnEl = document.getElementById('settings-btn');
const settingsModalEl = document.getElementById('settings-modal');
const closeSettingsBtnEl = document.getElementById('close-settings-btn');
const soundToggleEl = document.getElementById('sound-toggle');
const particleToggleEl = document.getElementById('particle-toggle');

// Initialize the game
function init() {
    // Set initial emoji
    currentEmojiEl.textContent = evolutionPaths[gameState.currentPathIndex][0];
    
    // Initialize evolution path display
    updateEvolutionPathDisplay();
    
    // Set up achievements
    initAchievements();
    
    // Set up upgrades
    initUpgrades();
    
    // Initialize WebsimSocket for database
    window.room = new WebsimSocket();
    
    // Get username if available
    getUsername();
    
    // Add event listeners
    emojiContainerEl.addEventListener('click', handleTap);
    continueBtnEl.addEventListener('click', closeEvolutionModal);
    shareBtnEl.addEventListener('click', openShareModal);
    closeShareBtnEl.addEventListener('click', closeShareModal);
    downloadBtnEl.addEventListener('click', shareToWebsim);
    loadMoreBtnEl.addEventListener('click', loadMoreCommunityPosts);
    settingsBtnEl.addEventListener('click', openSettingsModal);
    closeSettingsBtnEl.addEventListener('click', closeSettingsModal);
    soundToggleEl.addEventListener('change', toggleSound);
    particleToggleEl.addEventListener('change', toggleParticles);
    
    // Start auto tapper
    startAutoTapper();
    
    // Save initial game state
    saveGameState();
    
    // Load community posts
    loadCommunityPosts();
    
    // Initialize the share count if it doesn't exist
    if (gameState.shareCount === undefined) {
        gameState.shareCount = 0;
    }
    
    // Initialize settings
    updateSettingsFromState();
}

// Get user's username
async function getUsername() {
    try {
        if (window.websim) {
            const user = await window.websim.getUser();
            if (user && user.username) {
                gameState.username = user.username;
            }
        }
    } catch (error) {
        console.error("Error getting username:", error);
    }
}

// Custom confetti implementation
function createConfetti(count = 50) {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    
    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.width = `${Math.random() * 10 + 5}px`;
        confetti.style.height = `${Math.random() * 10 + 5}px`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = `${Math.random() * 2 + 2}s`;
        
        // Different shapes
        const shapes = ['circle', 'square', 'triangle'];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        
        if (shape === 'circle') {
            confetti.style.borderRadius = '50%';
        } else if (shape === 'triangle') {
            confetti.style.width = '0';
            confetti.style.height = '0';
            confetti.style.backgroundColor = 'transparent';
            confetti.style.borderLeft = `${Math.random() * 10 + 5}px solid transparent`;
            confetti.style.borderRight = `${Math.random() * 10 + 5}px solid transparent`;
            confetti.style.borderBottom = `${Math.random() * 10 + 5}px solid ${colors[Math.floor(Math.random() * colors.length)]}`;
        }
        
        document.body.appendChild(confetti);
        
        // Remove after animation completes
        setTimeout(() => {
            document.body.removeChild(confetti);
        }, 4000);
    }
}

// Handle tapping on the emoji
function handleTap() {
    gameState.taps++;
    
    // Calculate tap power based on upgrades
    const tapPower = gameState.tapStrength * gameState.tapMultiplier;
    
    // Increase evolution progress - higher base value at lower levels
    const evolutionBoost = gameState.purchasedUpgrades.includes('evolution_booster') ? 1.2 : 1;
    const levelFactor = Math.max(0.6, 1 - (gameState.level * 0.015)); // Starts at 1, gradually decreases
    gameState.evolution += (1 + Math.random() * 0.5) * tapPower * evolutionBoost * levelFactor;
    
    // Update score instead of points
    const scoreBoost = gameState.purchasedUpgrades.includes('score_boost') ? 1.3 : 1;
    gameState.score += Math.ceil(gameState.level * tapPower * scoreBoost);
    
    // Update progress bar
    updateProgress();
    
    // Add tap effect
    createTapEffect();
    
    // Check for evolution
    checkEvolution();
    
    // Update stats
    updateStats();
    
    // Check achievements
    checkAchievements();
    
    // Save game state
    saveGameState();
}

// Update progress bar
function updateProgress() {
    const baseNeeded = 25;
    const levelMultiplier = Math.min(10, 3 + (gameState.level * 0.8));
    const progressNeeded = baseNeeded + (gameState.level * levelMultiplier);
    const percentage = (gameState.evolution / progressNeeded) * 100;
    progressEl.style.width = `${Math.min(percentage, 100)}%`;
}

// Check if evolution should occur
function checkEvolution() {
    // Progressive difficulty: easy at first, gets harder as you level up
    const baseNeeded = 15; // Reduced from 25
    const levelMultiplier = Math.min(7, 2 + (gameState.level * 0.6)); // Reduced multiplier
    const progressNeeded = baseNeeded + (gameState.level * levelMultiplier);
    
    if (gameState.evolution >= progressNeeded) {
        // Reset evolution progress
        gameState.evolution = 0;
        
        // Increase level
        gameState.level++;
        
        // Evolve to next stage if not at final stage
        if (gameState.currentEvolutionStage < getCurrentPath().length - 1) {
            const oldEmoji = getCurrentPath()[gameState.currentEvolutionStage];
            gameState.currentEvolutionStage++;
            const newEmoji = getCurrentPath()[gameState.currentEvolutionStage];
            
            // Show evolution modal
            showEvolutionModal(oldEmoji, newEmoji);
            
            // Update current emoji
            currentEmojiEl.textContent = newEmoji;
            
            // Update evolution path display
            updateEvolutionPathDisplay();
        } else {
            // Path completed, switch to next path
            completePath();
        }
        
        // Reset progress bar
        updateProgress();
        
        // Update stats
        updateStats();
    }
}

// Complete current path and move to the next
function completePath() {
    // Add current path to completed paths
    gameState.completedPaths.push(gameState.currentPathIndex);
    gameState.completedPathCount++;
    
    // Show path completion modal
    showPathCompletionModal();
    
    // Find next available path
    let nextPath = (gameState.currentPathIndex + 1) % (evolutionPaths.length + generatedPaths.length);
    while (gameState.completedPaths.includes(nextPath) && 
           gameState.completedPaths.length < evolutionPaths.length + generatedPaths.length) {
        nextPath = (nextPath + 1) % (evolutionPaths.length + generatedPaths.length);
    }
    
    // If all paths are completed, generate a new path
    if (gameState.completedPaths.length >= evolutionPaths.length + generatedPaths.length) {
        generateNewPath();
        nextPath = evolutionPaths.length + generatedPaths.length - 1;
    }
    
    // Reset evolution stage
    gameState.currentEvolutionStage = 0;
    gameState.currentPathIndex = nextPath;
    
    // Update current emoji
    const currentPath = getCurrentPath();
    currentEmojiEl.textContent = currentPath[0];
    
    // Update evolution path display
    updateEvolutionPathDisplay();
    
    // Check achievements
    checkAchievements();
}

// Get current path (either built-in or generated)
function getCurrentPath() {
    if (gameState.currentPathIndex < evolutionPaths.length) {
        return evolutionPaths[gameState.currentPathIndex];
    } else {
        return generatedPaths[gameState.currentPathIndex - evolutionPaths.length];
    }
}

// Generate a new evolution path when all paths are completed
function generateNewPath() {
    // Define themes for generated paths
    const themes = [
        "Future Tech", "Mythical Creatures", "Weather", "Sports", "Emotions",
        "Vehicles", "History", "Architecture", "Art", "Seasons"
    ];
    
    // Select a random theme from the list
    const themeIndex = generatedPaths.length % themes.length;
    const theme = themes[themeIndex];
    
    // Show generating notification
    showNotification(`Generating a new "${theme}" evolution path...`, "info");
    
    // Create a new array for the path
    const newPath = [];
    
    // Generate path based on theme
    switch(theme) {
        case "Future Tech":
            newPath.push(...['💾', '📀', '🖲️', '📟', '🤖', '👾', '🦿', '🧠', '💫', '👁️', '🌐']);
            break;
        case "Mythical Creatures":
            newPath.push(...['🐣', '🦎', '🐉', '🧙', '🧝', '🧚', '🦄', '🧜', '🧞', '🔮', '✨']);
            break;
        case "Weather":
            newPath.push(...['☁️', '🌧️', '⛈️', '🌩️', '❄️', '☃️', '🌨️', '🌤️', '☀️', '🌈', '⚡']);
            break;
        case "Sports":
            newPath.push(...['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎯', '🏆']);
            break;
        case "Emotions":
            newPath.push(...['😊', '😃', '😂', '🥰', '😍', '🤩', '😎', '🥳', '😇', '🤯', '✨']);
            break;
        case "Vehicles":
            newPath.push(...['🚲', '🛵', '🏍️', '🚗', '🚕', '🚙', '🚌', '🚅', '✈️', '🚀', '🛸']);
            break;
        case "History":
            newPath.push(...['🏺', '⚔️', '🛡️', '👑', '🏰', '⛪', '🧭', '🚂', '🗽', '🚀', '🔭']);
            break;
        case "Architecture":
            newPath.push(...['🏠', '🏘️', '🏢', '🏛️', '⛪', '🕌', '🏯', '🏙️', '🌉', '🗼', '🌃']);
            break;
        case "Art":
            newPath.push(...['✏️', '🖌️', '🎨', '🖼️', '📷', '📸', '🎬', '🎭', '🎼', '🎹', '🎻']);
            break;
        case "Seasons":
            newPath.push(...['🌱', '🌿', '🌳', '🌻', '🍂', '🍁', '❄️', '⛄', '🌧️', '🌈', '♻️']);
            break;
    }
    
    // Add the new path to generatedPaths
    generatedPaths.push(newPath);
    
    // Update game state
    gameState.level += 5; // Bonus for unlocking a new path
    gameState.score += 1000; // Bonus points
    updateStats();
    
    // Show notification
    showNotification(`New "${theme}" evolution path unlocked!`, "info");
    createConfetti(100);
}

// Get the name of a path based on its index
function getPathName(pathIndex) {
    const pathNames = [
        "Life Cycle", "Space", "Technology", "Fantasy", "Ocean", 
        "Food", "Civilization", "Music", "Animal Kingdom", "Abstract Concepts"
    ];
    
    const generatedThemes = [
        "Future Tech", "Mythical Creatures", "Weather", "Sports", "Emotions",
        "Vehicles", "History", "Architecture", "Art", "Seasons"
    ];
    
    if (pathIndex < pathNames.length) {
        return pathNames[pathIndex];
    } else {
        const genIndex = (pathIndex - pathNames.length) % generatedThemes.length;
        return generatedThemes[genIndex];
    }
}

// Show path completion modal
function showPathCompletionModal() {
    oldEmojiEl.textContent = getCurrentPath()[getCurrentPath().length - 1];
    newEmojiEl.textContent = '🏆';
    
    evolutionMessageEl.textContent = `Congratulations! You've completed the ${getPathName(gameState.currentPathIndex)} evolution path!`;
    
    evolutionModalEl.style.display = 'flex';
    
    // Add custom confetti
    createConfetti(100);
    
    // Play a sound effect
    playSound('pathComplete');
}

// Show evolution modal
function showEvolutionModal(oldEmoji, newEmoji) {
    oldEmojiEl.textContent = oldEmoji;
    newEmojiEl.textContent = newEmoji;
    
    const evolutionMessages = [
        "Amazing transformation!",
        "You've reached a new stage!",
        "Evolution complete!",
        "Incredible growth!",
        "You're evolving fast!",
        "A new form emerges!",
        "Spectacular transformation!"
    ];
    
    evolutionMessageEl.textContent = evolutionMessages[Math.floor(Math.random() * evolutionMessages.length)];
    
    evolutionModalEl.style.display = 'flex';
    
    // Add custom confetti
    createConfetti(50);
    
    // Play a sound effect
    playSound('evolution');
}

// Close evolution modal
function closeEvolutionModal() {
    evolutionModalEl.style.display = 'none';
}

// Update game stats display
function updateStats() {
    levelEl.textContent = `Level: ${gameState.level}`;
    scoreEl.textContent = `Score: ${gameState.score}`;
}

// Initialize achievements
function initAchievements() {
    achievementsListEl.innerHTML = '';
    achievements.forEach(achievement => {
        const achievementEl = document.createElement('div');
        achievementEl.classList.add('achievement');
        achievementEl.id = `achievement-${achievement.id}`;
        achievementEl.innerHTML = `
            <span>${achievement.emoji}</span>
            <span>${achievement.name}</span>
        `;
        achievementEl.title = achievement.description;
        
        if (gameState.unlockedAchievements.includes(achievement.id)) {
            achievementEl.classList.add('unlocked');
        }
        
        achievementsListEl.appendChild(achievementEl);
    });
}

// Initialize upgrades
function initUpgrades() {
    upgradesListEl.innerHTML = '';
    upgrades.forEach(upgrade => {
        const upgradeEl = document.createElement('div');
        upgradeEl.classList.add('upgrade');
        upgradeEl.id = `upgrade-${upgrade.id}`;
        
        const level = getPurchaseCountForUpgrade(upgrade.id);
        const cost = getUpgradeCost(upgrade, level);
        
        upgradeEl.innerHTML = `
            <div class="upgrade-info">
                <div class="upgrade-name">${upgrade.name} ${level > 0 ? `(Level ${level})` : ''}</div>
                <div class="upgrade-description">${upgrade.description}</div>
            </div>
            <div class="upgrade-cost">${cost} Score</div>
        `;
        
        if (gameState.purchasedUpgrades.includes(upgrade.id) && upgrade.id !== 'tap_strength' && upgrade.id !== 'auto_tapper') {
            upgradeEl.classList.add('purchased');
        }
        
        upgradeEl.addEventListener('click', () => purchaseUpgrade(upgrade));
        
        upgradesListEl.appendChild(upgradeEl);
    });
}

// Get the number of times an upgrade has been purchased
function getPurchaseCountForUpgrade(upgradeId) {
    return gameState.purchasedUpgrades.filter(id => id === upgradeId).length;
}

// Get the cost of an upgrade based on how many times it's been purchased
function getUpgradeCost(upgrade, level) {
    return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, level));
}

// Purchase an upgrade
function purchaseUpgrade(upgrade) {
    const level = getPurchaseCountForUpgrade(upgrade.id);
    const cost = getUpgradeCost(upgrade, level);
    
    if (gameState.score >= cost) {
        // Deduct score instead of points
        gameState.score -= cost;
        
        // Add to purchased upgrades
        gameState.purchasedUpgrades.push(upgrade.id);
        
        // Apply upgrade effect
        upgrade.effect();
        
        // Update upgrades display
        initUpgrades();
        
        // Update stats display after purchase
        updateStats();
        
        // Check achievements
        checkAchievements();
        
        // Play sound
        playSound('purchase');
        
        // Save game state
        saveGameState();
    } else {
        // Show "not enough points" notification
        showNotification("Not enough score to purchase!", "error");
    }
}

// Start auto tapper
function startAutoTapper() {
    setInterval(() => {
        if (gameState.autoTaps > 0) {
            // Auto tap based on purchased auto tappers
            for (let i = 0; i < gameState.autoTaps; i++) {
                gameState.evolution += gameState.tapStrength * gameState.tapMultiplier * 0.6; // 60% as effective as manual taps
                // Update score instead of points
                gameState.score += Math.ceil(gameState.level * gameState.tapStrength * 0.6);
                
                // Visual feedback for auto taps (limited to prevent performance issues)
                if (i < 3 && gameState.settings.particlesEnabled) {
                    const sparkle = document.createElement('div');
                    sparkle.classList.add('evolution-sparkle');
                    sparkle.textContent = '✨';
                    sparkle.style.left = `${Math.random() * 80 + 10}%`;
                    sparkle.style.top = `${Math.random() * 80 + 10}%`;
                    emojiContainerEl.appendChild(sparkle);
                    
                    setTimeout(() => {
                        if (emojiContainerEl.contains(sparkle)) {
                            emojiContainerEl.removeChild(sparkle);
                        }
                    }, 1000);
                }
            }
            
            // Play tap sound for auto taps (but only once per interval)
            if (gameState.settings.soundEnabled) {
                playSound('tap');
            }
            
            // Update UI
            updateProgress();
            updateStats();
            
            // Check for evolution
            checkEvolution();
            
            // Save game state
            saveGameState();
        }
    }, 1000);
}

// Check achievements
function checkAchievements() {
    achievements.forEach(achievement => {
        if (!gameState.unlockedAchievements.includes(achievement.id) && achievement.requirement()) {
            unlockAchievement(achievement);
        }
    });
}

// Unlock achievement
function unlockAchievement(achievement) {
    gameState.unlockedAchievements.push(achievement.id);
    
    const achievementEl = document.getElementById(`achievement-${achievement.id}`);
    if (achievementEl) {
        achievementEl.classList.add('unlocked');
    }
    
    // Score bonus for achievement - add to score only
    gameState.score += 50; // More balanced reward
    updateStats();
    
    // Show notification
    showAchievementNotification(achievement);
    
    // Play sound
    playSound('achievement');
}

// Show achievement notification
function showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.classList.add('achievement-notification');
    notification.innerHTML = `
        <div style="position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); 
                   background-color: rgba(255, 215, 0, 0.9); color: #333; padding: 15px 20px;
                   border-radius: 10px; display: flex; align-items: center; gap: 10px;
                   font-weight: bold; box-shadow: 0 4px 15px rgba(0,0,0,0.2); z-index: 1000;
                   animation: slideUp 0.5s, fadeOut 0.5s 3.5s forwards;">
            <div style="font-size: 2rem;">${achievement.emoji}</div>
            <div>
                <div style="font-size: 1.1rem;">Achievement Unlocked!</div>
                <div>${achievement.name}</div>
                <div style="font-size: 0.8rem; opacity: 0.8;">${achievement.description}</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 4000);
}

// Show general notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    
    const bgColor = type === 'error' ? 'rgba(255, 0, 0, 0.8)' : 'rgba(0, 128, 255, 0.8)';
    
    notification.innerHTML = `
        <div style="position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); 
                   background-color: ${bgColor}; color: white; padding: 15px 20px;
                   border-radius: 10px; display: flex; align-items: center; gap: 10px;
                   font-weight: bold; box-shadow: 0 4px 15px rgba(0,0,0,0.2); z-index: 1000;
                   animation: slideUp 0.5s, fadeOut 0.5s 2.5s forwards;">
            <div>${message}</div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

// Update evolution path display
function updateEvolutionPathDisplay() {
    evolutionPathEl.innerHTML = '';
    
    const currentPath = getCurrentPath();
    
    currentPath.forEach((emoji, index) => {
        const emojiEl = document.createElement('div');
        emojiEl.classList.add('emoji-path-item');
        emojiEl.textContent = emoji;
        
        if (index === gameState.currentEvolutionStage) {
            emojiEl.classList.add('active');
        } else if (index < gameState.currentEvolutionStage) {
            emojiEl.classList.add('completed');
        }
        
        evolutionPathEl.appendChild(emojiEl);
    });
}

// Create tap effect
function createTapEffect() {
    // Visual feedback when tapping
    emojiContainerEl.classList.add('tap-active');
    setTimeout(() => {
        emojiContainerEl.classList.remove('tap-active');
    }, 100);
    
    // Add sparkle effect if enabled
    if (gameState.settings.particlesEnabled) {
        const sparkleEmojis = ['✨', '⭐', '💫', '🌟', '🔥'];
        const sparkleCount = Math.min(3 + Math.floor(gameState.tapStrength / 2), 10);
        
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            sparkle.classList.add('evolution-sparkle');
            sparkle.textContent = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
            sparkle.style.left = `${Math.random() * 80 + 10}%`;
            sparkle.style.top = `${Math.random() * 80 + 10}%`;
            emojiContainerEl.appendChild(sparkle);
            
            setTimeout(() => {
                if (emojiContainerEl.contains(sparkle)) {
                    emojiContainerEl.removeChild(sparkle);
                }
            }, 1000);
        }
    }
    
    // Play sound effect if enabled
    if (gameState.settings.soundEnabled) {
        playSound('tap');
    }
}

// Open share modal
function openShareModal() {
    shareLevelEl.textContent = gameState.level;
    shareScoreEl.textContent = gameState.score;
    shareEmojiEl.textContent = getCurrentPath()[gameState.currentEvolutionStage];
    shareEmojiDisplayEl.textContent = getCurrentPath()[gameState.currentEvolutionStage];
    
    const captions = [
        "I've evolved to this amazing form!",
        "Check out my progress in Emoji Evolution!",
        "Can you beat my score?",
        "Evolution is a journey, not a destination!",
        "This is my creature so far! What's yours?"
    ];
    
    const evolutionInfo = `Path: ${getPathName(gameState.currentPathIndex)}, Completed Paths: ${gameState.completedPathCount}`;
    shareCaptionEl.textContent = `${captions[Math.floor(Math.random() * captions.length)]} ${evolutionInfo}`;
    
    shareModalEl.style.display = 'flex';
}

// Close share modal
function closeShareModal() {
    shareModalEl.style.display = 'none';
}

// Share to Websim API
async function shareToWebsim() {
    try {
        // Get username if not already set
        if (!gameState.username && window.websim) {
            const user = await window.websim.getUser();
            if (user && user.username) {
                gameState.username = user.username;
            }
        }
        
        if (!gameState.username) {
            showNotification("Unable to determine username", "error");
            return;
        }
        
        // Get current path name
        const pathName = getPathName(gameState.currentPathIndex);
        const currentEmoji = getCurrentPath()[gameState.currentEvolutionStage];
        
        // Sanitize all inputs to prevent XSS
        const sanitizedEmoji = currentEmoji;
        const sanitizedPathName = escapeHtml(pathName);
        const sanitizedLevel = Number(gameState.level);
        const sanitizedScore = Number(gameState.score);
        const sanitizedTaps = Number(gameState.taps);
        const sanitizedPaths = Number(gameState.completedPathCount);
        
        // Show notification
        showNotification("Sharing your evolution...", "info");
        
        // Save the evolution to the database
        await window.room.collection('evolution_post').create({
            emoji: sanitizedEmoji,
            path_name: sanitizedPathName,
            level: sanitizedLevel,
            score: sanitizedScore,
            taps: sanitizedTaps,
            completed_paths: sanitizedPaths,
            timestamp: new Date().toISOString()
        });
        
        // Increment share count for achievement tracking
        gameState.shareCount = (gameState.shareCount || 0) + 1;
        saveGameState();
        
        showNotification("Successfully shared your evolution!", "info");
        
        // Additional confetti celebration
        createConfetti(70);
        
        // Check achievements
        checkAchievements();
        
        // Refresh community posts to show the new post
        loadCommunityPosts();
        
        // Close share modal
        closeShareModal();
        
    } catch (error) {
        console.error("Error sharing:", error);
        showNotification("Error sharing evolution", "error");
    }
}

// Escape HTML to prevent XSS
function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') return unsafe;
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Load community posts from the database
async function loadCommunityPosts() {
    try {
        communityPostsEl.innerHTML = '<div class="loading">Loading community evolutions...</div>';
        
        if (window.room) {
            // Get evolution posts from database, sorted by newest first
            const evolutionPosts = window.room.collection('evolution_post').getList();
            
            if (evolutionPosts && evolutionPosts.length > 0) {
                displayDatabasePosts(evolutionPosts);
            } else {
                // Subscribe to changes in the evolution_post collection
                window.room.collection('evolution_post').subscribe(function(posts) {
                    if (posts && posts.length > 0) {
                        displayDatabasePosts(posts);
                    } else {
                        // Fallback to hardcoded examples if no posts are found initially
                        displayFakeCommunityPosts();
                    }
                });
            }
        } else {
            // Fallback to hardcoded examples if database isn't available
            displayFakeCommunityPosts();
        }
    } catch (error) {
        console.error("Error loading community posts:", error);
        displayFakeCommunityPosts();
    }
}

// Display posts from database
function displayDatabasePosts(posts) {
    communityPostsEl.innerHTML = '';
    
    if (!posts || posts.length === 0) {
        communityPostsEl.innerHTML = '<div class="no-posts">No community evolutions yet. Be the first to share!</div>';
        return;
    }
    
    // Sort posts with newest first
    const sortedPosts = [...posts].sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
    });
    
    // Create header
    const header = document.createElement('div');
    header.classList.add('community-section-header');
    header.textContent = "Community Evolutions";
    header.style.fontSize = "1rem";
    header.style.fontWeight = "bold";
    header.style.marginBottom = "10px";
    header.style.color = "#118AB2";
    communityPostsEl.appendChild(header);
    
    // Display the posts
    sortedPosts.slice(0, 6).forEach(post => {
        createEvolutionPostElement(post);
    });
}

// Create a community evolution post element
function createEvolutionPostElement(post) {
    const postEl = document.createElement('div');
    postEl.classList.add('community-post');
    
    // Format timestamp
    let timeAgo = "Just now";
    if (post.timestamp || post.created_at) {
        const date = new Date(post.timestamp || post.created_at);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 60) {
            timeAgo = `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
        } else if (diffMins < 1440) {
            const hours = Math.floor(diffMins / 60);
            timeAgo = `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        } else {
            const days = Math.floor(diffMins / 1440);
            timeAgo = `${days} day${days !== 1 ? 's' : ''} ago`;
        }
    }
    
    // Get avatar URL
    const avatarUrl = `https://images.websim.ai/avatar/${post.username}`;
    
    // Create post content safely with escaped values
    postEl.innerHTML = `
        <div class="post-header">
            <div class="post-user" style="display: flex; align-items: center; gap: 8px;">
                <img src="${avatarUrl}" alt="Avatar" style="width: 24px; height: 24px; border-radius: 50%; background-color: #f0f0f0;">
                @${escapeHtml(post.username)}
            </div>
            <div class="post-time">${timeAgo}</div>
        </div>
        <div class="post-content">
            <div class="post-emoji">${post.emoji || '✨'}</div>
            <div class="post-message">
                <b>Level:</b> ${post.level || 0} | 
                <b>Taps:</b> ${post.taps || 0} | 
                <b>Score:</b> ${post.score || 0} | 
                <b>Path:</b> ${escapeHtml(post.path_name || '')} | 
                <b>Completed Paths:</b> ${post.completed_paths || 0}
            </div>
        </div>
    `;
    
    communityPostsEl.appendChild(postEl);
}

// Load more community posts
function loadMoreCommunityPosts() {
    try {
        if (window.room) {
            // Get all evolution posts
            const evolutionPosts = window.room.collection('evolution_post').getList();
            
            // Display more posts if available
            if (evolutionPosts && evolutionPosts.length > 0) {
                // Count existing posts
                const existingPostCount = document.querySelectorAll('.community-post').length;
                
                // If there are more posts to show
                if (existingPostCount < evolutionPosts.length) {
                    // Sort posts by newest first
                    const sortedPosts = [...evolutionPosts].sort((a, b) => {
                        return new Date(b.created_at) - new Date(a.created_at);
                    });
                    
                    // Show more posts
                    sortedPosts.slice(existingPostCount, existingPostCount + 6).forEach(post => {
                        createEvolutionPostElement(post);
                    });
                    
                    showNotification("More evolutions loaded", "info");
                } else {
                    showNotification("No more evolutions to load", "info");
                }
            } else {
                displayFakeCommunityPosts(true);
            }
        } else {
            displayFakeCommunityPosts(true);
        }
    } catch (error) {
        console.error("Error loading more posts:", error);
        displayFakeCommunityPosts(true);
    }
}

// Display fake community posts when API is unavailable
function displayFakeCommunityPosts(append = false) {
    if (!append) {
        communityPostsEl.innerHTML = '';
    }
    
    const fakePosts = [
        { username: "evolution_master", message: "Just reached level 42 with 🔮 in Emoji Evolution! Path: Fantasy, Score: 12500, Completed Paths: 3", time: "2 hours ago" },
        { username: "emoji_lover", message: "My creature evolved to 🦄 on the Fantasy path! Score: 8750, Level: 28", time: "5 hours ago" },
        { username: "game_explorer", message: "Just completed the Technology path! Final form: 🌐 - Moving to Ocean next!", time: "1 day ago" },
        { username: "tap_champion", message: "Unlocked a new AI-generated path: Sports! Starting with ⚽", time: "3 days ago" }
    ];
    
    fakePosts.forEach(post => {
        createEvolutionPostElement(post);
    });
}

// Play sound effects
function playSound(type) {
    // Skip if sounds are disabled
    if (!gameState.settings.soundEnabled) return;
    
    const sounds = {
        tap: { frequency: 800, type: 'sine', duration: 0.05 },
        evolution: { frequency: 440, type: 'sine', duration: 0.8, steps: 10 },
        achievement: { frequency: 600, type: 'square', duration: 0.3, steps: 3 },
        pathComplete: { frequency: 330, type: 'sine', duration: 1.2, steps: 15 },
        purchase: { frequency: 520, type: 'square', duration: 0.2, steps: 2 }
    };
    
    const soundDef = sounds[type];
    
    if (!soundDef) return;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    if (soundDef.steps) {
        // Play a sequence of notes for effects like evolution
        let startTime = audioContext.currentTime;
        
        for (let i = 0; i < soundDef.steps; i++) {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.type = soundDef.type;
            oscillator.frequency.value = soundDef.frequency + (i * 50);
            
            gainNode.gain.setValueAtTime(0.2, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + soundDef.duration / soundDef.steps);
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + soundDef.duration / soundDef.steps);
            
            startTime += soundDef.duration / soundDef.steps * 0.9;
        }
    } else {
        // Play a simple sound for taps
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = soundDef.type;
        oscillator.frequency.value = soundDef.frequency;
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + soundDef.duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + soundDef.duration);
    }
}

// Save game state to localStorage
function saveGameState() {
    localStorage.setItem('emojiEvolutionState', JSON.stringify(gameState));
}

// Load game state from localStorage
function loadGameState() {
    const savedState = localStorage.getItem('emojiEvolutionState');
    
    if (savedState) {
        const parsedState = JSON.parse(savedState);
        
        // Ensure settings exist in loaded state
        if (!parsedState.settings) {
            parsedState.settings = {
                soundEnabled: true,
                particlesEnabled: true
            };
        }
        
        Object.assign(gameState, parsedState);
        
        // Make sure current path index is valid
        if (gameState.currentPathIndex >= evolutionPaths.length + generatedPaths.length) {
            gameState.currentPathIndex = 0;
        }
        
        // Update UI based on loaded state
        currentEmojiEl.textContent = getCurrentPath()[gameState.currentEvolutionStage];
        updateEvolutionPathDisplay();
        updateProgress();
        updateStats();
        updateSettingsFromState();
    }
}

// Open settings modal
function openSettingsModal() {
    settingsModalEl.style.display = 'flex';
}

// Close settings modal
function closeSettingsModal() {
    settingsModalEl.style.display = 'none';
}

// Toggle sound setting
function toggleSound() {
    gameState.settings.soundEnabled = soundToggleEl.checked;
    saveGameState();
}

// Toggle particle effects setting
function toggleParticles() {
    gameState.settings.particlesEnabled = particleToggleEl.checked;
    saveGameState();
}

// Update settings UI from game state
function updateSettingsFromState() {
    soundToggleEl.checked = gameState.settings.soundEnabled;
    particleToggleEl.checked = gameState.settings.particlesEnabled;
}

// Load game
window.addEventListener('DOMContentLoaded', () => {
    loadGameState();
    init();
    
    // Add welcome message
    setTimeout(() => {
        showAchievementNotification({
            emoji: '👋',
            name: 'Welcome to Emoji Evolution',
            description: 'Tap the emoji to begin your evolution journey!'
        });
    }, 1000);
});
