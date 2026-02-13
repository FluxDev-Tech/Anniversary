// ============================================
// CONFIGURATION & CONSTANTS
// ============================================

const CONFIG = {
    validPasswords: ['adi', 'Adi', '2004', 'iloveyouadi', 'Iloveyouadi'],
    floatingHeartInterval: 800,
    floatingHeartDuration: 8000,
    particleCount: 20,
    puzzleSize: 3,
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0
};

// ============================================
// MOBILE DETECTION & UTILITIES
// ============================================

/**
 * Detect if device is mobile
 */
function isMobileDevice() {
    return CONFIG.isMobile || CONFIG.isTouch;
}

/**
 * Prevent default touch behaviors
 */
function preventDefaultTouch(e) {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}

/**
 * Fix mobile viewport height issue
 */
function setMobileVH() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

/**
 * Debounce function for resize events
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// STATE MANAGEMENT
// ============================================

const state = {
    puzzleState: [],
    selectedTile: null,
    puzzleImage: null,
    isPuzzleSolved: false,
    musicPlaying: false
};

// ============================================
// GALLERY MEMORIES DATA
// ============================================

const memories = [
    {
        title: "Our First Moments",
        caption: "I remember the first time I saw you. Time stopped, and I knew you were special. You've been stealing my heart ever since that beautiful day. Every moment with you since then has been a treasure.",
        emoji: "📸",
        color: "from-pink-300 via-rose-300 to-pink-400"
    },
    {
        title: "Why I Love You",
        caption: "Your smile brightens my darkest days. Your laugh is my favorite sound. Your kindness inspires me. Your love completes me. You are everything I ever dreamed of and so much more.",
        emoji: "❤️",
        color: "from-rose-300 via-red-300 to-rose-400"
    },
    {
        title: "Us, Always",
        caption: "Together we are unstoppable. Through every challenge, every joy, every moment - I choose you, today and always. You and me against the world, forever and ever.",
        emoji: "💑",
        color: "from-pink-300 via-rose-400 to-pink-500"
    },
    {
        title: "Special Moments",
        caption: "Every second with you becomes a treasured memory. From quiet mornings to late-night conversations, each moment is a gift I'll forever cherish in my heart.",
        emoji: "🌹",
        color: "from-rose-300 via-pink-300 to-rose-400"
    },
    {
        title: "My Favorite Person",
        caption: "You make ordinary days extraordinary. You turn my tears into laughter. You make everything better just by being you. You are my home, my heart, my happiness.",
        emoji: "💝",
        color: "from-pink-400 via-rose-300 to-pink-400"
    },
    {
        title: "Forever & Always",
        caption: "This is just the beginning of our forever. I promise to love you more each day, to support your dreams, and to build a beautiful life together. Here's to all our tomorrows.",
        emoji: "💕",
        color: "from-rose-400 via-red-300 to-rose-400"
    }
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Hide an element by adding 'hidden' class
 */
function hideElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add('hidden');
    }
}

/**
 * Show an element by removing 'hidden' class
 */
function showElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('hidden');
    }
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Generate random number between min and max
 */
function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

// ============================================
// PARTICLE EFFECTS
// ============================================

/**
 * Create floating particles on login screen
 */
function createParticles() {
    const container = document.getElementById('particlesContainer');
    if (!container) return;

    for (let i = 0; i < CONFIG.particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.width = randomBetween(5, 15) + 'px';
        particle.style.height = particle.style.width;
        particle.style.backgroundColor = `rgba(236, 72, 153, ${randomBetween(0.2, 0.7)})`;
        particle.style.animationDelay = Math.random() * 4 + 's';
        particle.style.animationDuration = randomBetween(3, 6) + 's';
        container.appendChild(particle);
    }
}

/**
 * Create floating hearts animation
 */
function createFloatingHearts() {
    const container = document.getElementById('heartsContainer');
    if (!container) return;

    const heartEmojis = ['❤️', '💕', '💖', '💗', '💝', '💞'];

    const interval = setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = randomBetween(6, 10) + 's';
        heart.style.fontSize = randomBetween(20, 40) + 'px';

        container.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, CONFIG.floatingHeartDuration);
    }, CONFIG.floatingHeartInterval);

    // Clean up interval when section is hidden
    return interval;
}

// ============================================
// PASSWORD & LOGIN
// ============================================

/**
 * Check if entered password is valid
 */
function checkPassword() {
    const input = document.getElementById('passwordInput');
    const message = document.getElementById('loginMessage');
    const password = input.value.trim();

    if (CONFIG.validPasswords.includes(password)) {
        message.textContent = '💖 Unlocking your gift...';
        message.className = 'text-center text-sm text-green-600 h-6 font-medium';

        setTimeout(() => {
            hideElement('loginSection');
            showElement('puzzleSection');
            initPuzzle();
        }, 1500);
    } else {
        message.textContent = 'Not quite, my love. Try again... I know you know this! 💕';
        message.className = 'text-center text-sm text-rose-600 h-6 font-medium';
        input.value = '';
        input.focus();
        
        // Add shake animation to input
        input.classList.add('animate-shake');
        setTimeout(() => input.classList.remove('animate-shake'), 500);
    }
}

/**
 * Handle Enter key press on password input
 */
function handlePasswordKeyPress(event) {
    if (event.key === 'Enter') {
        checkPassword();
    }
}

// ============================================
// PUZZLE GAME
// ============================================

/**
 * Create a placeholder puzzle image
 */
function createPlaceholderImage() {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 600, 600);
    gradient.addColorStop(0, '#f9a8d4');
    gradient.addColorStop(0.5, '#fb7185');
    gradient.addColorStop(1, '#f43f5e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 600, 600);

    // Add decorative circles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.arc(150, 150, 100, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(450, 450, 120, 0, Math.PI * 2);
    ctx.fill();

    // Add heart emoji
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.font = 'bold 200px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('❤️', 300, 280);

    // Add text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 50px Arial';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 10;
    ctx.fillText('US', 300, 500);

    return canvas.toDataURL();
}

/**
 * Initialize the puzzle game
 */
function initPuzzle() {
    state.puzzleImage = createPlaceholderImage();
    state.isPuzzleSolved = false;
    shufflePuzzle();
}

/**
 * Shuffle the puzzle pieces
 */
function shufflePuzzle() {
    // Create ordered array [0, 1, 2, 3, 4, 5, 6, 7, 8]
    state.puzzleState = Array.from({ length: CONFIG.puzzleSize * CONFIG.puzzleSize }, (_, i) => i);
    
    // Shuffle the array
    state.puzzleState = shuffleArray(state.puzzleState);
    
    state.selectedTile = null;
    state.isPuzzleSolved = false;
    
    renderPuzzle();
    updateProgress();
}

/**
 * Render the puzzle grid
 */
function renderPuzzle() {
    const grid = document.getElementById('puzzleGrid');
    if (!grid) return;

    grid.innerHTML = '';

    state.puzzleState.forEach((piece, index) => {
        const tile = document.createElement('div');
        tile.className = 'puzzle-piece aspect-square';
        tile.onclick = () => selectTile(index);

        // Create background image for the piece
        const img = document.createElement('div');
        img.style.width = '300%';
        img.style.height = '300%';
        img.style.backgroundImage = `url(${state.puzzleImage})`;
        img.style.backgroundSize = '100% 100%';

        // Calculate position based on piece number
        const row = Math.floor(piece / CONFIG.puzzleSize);
        const col = piece % CONFIG.puzzleSize;
        img.style.backgroundPosition = `-${col * 100}% -${row * 100}%`;

        tile.appendChild(img);
        grid.appendChild(tile);
    });
}

/**
 * Handle tile selection and swapping
 */
function selectTile(index) {
    const tiles = document.querySelectorAll('.puzzle-piece');

    if (state.selectedTile === null) {
        // First tile selected
        state.selectedTile = index;
        tiles[index].classList.add('selected');
        
        // Haptic feedback on mobile (if supported)
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    } else {
        // Second tile selected
        tiles[state.selectedTile].classList.remove('selected');

        if (state.selectedTile !== index) {
            // Swap the tiles
            [state.puzzleState[state.selectedTile], state.puzzleState[index]] = 
            [state.puzzleState[index], state.puzzleState[state.selectedTile]];
            
            // Haptic feedback for successful swap
            if (navigator.vibrate) {
                navigator.vibrate([30, 10, 30]);
            }
            
            renderPuzzle();
            updateProgress();

            // Check if puzzle is solved
            if (checkPuzzleSolved()) {
                // Success haptic
                if (navigator.vibrate) {
                    navigator.vibrate([50, 50, 50, 50, 200]);
                }
                setTimeout(showPuzzleComplete, 500);
            }
        }

        state.selectedTile = null;
    }
}

/**
 * Check if puzzle is correctly solved
 */
function checkPuzzleSolved() {
    return state.puzzleState.every((piece, index) => piece === index);
}

/**
 * Update progress bar based on correctly placed tiles
 */
function updateProgress() {
    const correctCount = state.puzzleState.filter((piece, index) => piece === index).length;
    const totalPieces = CONFIG.puzzleSize * CONFIG.puzzleSize;
    const percentage = Math.round((correctCount / totalPieces) * 100);

    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');

    if (progressBar) {
        progressBar.style.width = percentage + '%';
    }
    if (progressText) {
        progressText.textContent = percentage + '%';
    }
}

/**
 * Show puzzle completion animation and message
 */
function showPuzzleComplete() {
    const grid = document.getElementById('puzzleGrid');
    if (!grid) return;

    state.isPuzzleSolved = true;

    grid.innerHTML = `
        <div class="col-span-3 bg-gradient-to-br from-pink-100 via-rose-100 to-red-100 rounded-3xl p-10 text-center fade-in shadow-2xl border-4 border-rose-300">
            <div class="text-8xl mb-6 animate-bounce">❤️</div>
            <h3 class="text-4xl md:text-5xl dancing text-rose-600 mb-6 drop-shadow-lg">
                You completed the pieces of my heart!
            </h3>
            <p class="text-gray-700 text-lg md:text-xl mb-8 max-w-md mx-auto leading-relaxed">
                Just like this puzzle, you make me whole. Every piece of you fits perfectly with every piece of me. 💕
            </p>
            <button 
                onclick="showLetter()"
                class="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white px-10 py-4 rounded-full font-semibold text-lg hover:from-pink-600 hover:via-rose-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-2xl active:scale-95 inline-flex items-center gap-3"
            >
                Continue
                <span class="text-2xl">💕</span>
            </button>
        </div>
    `;

    // Update progress to 100%
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    if (progressBar) progressBar.style.width = '100%';
    if (progressText) progressText.textContent = '100%';
}

// ============================================
// NAVIGATION BETWEEN SECTIONS
// ============================================

/**
 * Show love letter section
 */
function showLetter() {
    hideElement('puzzleSection');
    showElement('letterSection');
    
    // Trigger fade-in animations for letter content
    const letterElements = document.querySelectorAll('#letterSection .fade-in');
    letterElements.forEach((el, index) => {
        el.style.opacity = '0';
        setTimeout(() => {
            el.style.opacity = '1';
        }, index * 300);
    });
}

/**
 * Show gallery section
 */
function showGallery() {
    hideElement('letterSection');
    showElement('gallerySection');
    
    // Animate gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        setTimeout(() => {
            item.style.transition = 'all 0.6s ease-out';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

/**
 * Show final surprise section
 */
function showFinalSurprise() {
    hideElement('gallerySection');
    showElement('finalSection');
    createFloatingHearts();
}

// ============================================
// GALLERY MODAL
// ============================================

/**
 * Open gallery modal with memory details
 */
function openModal(index) {
    const modal = document.getElementById('galleryModal');
    const modalInner = document.getElementById('modalInner');
    const content = document.getElementById('modalContent');
    const memory = memories[index];

    if (!modal || !content || !memory) return;

    content.innerHTML = `
        <div class="fade-in">
            <div class="mb-8">
                <div class="inline-block w-24 h-24 bg-gradient-to-br ${memory.color} rounded-full flex items-center justify-center text-6xl shadow-2xl mb-6 animate-bounce">
                    ${memory.emoji}
                </div>
            </div>
            <h3 class="playfair text-3xl md:text-4xl text-rose-600 font-bold mb-6 drop-shadow-lg">
                ${memory.title}
            </h3>
            <div class="h-1 w-32 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full mx-auto mb-8"></div>
            <p class="text-gray-700 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                ${memory.caption}
            </p>
            <div class="mt-10">
                <button 
                    onclick="closeModal()"
                    class="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-rose-600 transition-all transform hover:scale-105 shadow-lg"
                >
                    Close
                </button>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // Animate modal entrance
    setTimeout(() => {
        modalInner.classList.remove('scale-95', 'opacity-0');
        modalInner.classList.add('scale-100', 'opacity-100');
    }, 10);
}

/**
 * Close gallery modal
 */
function closeModal() {
    const modal = document.getElementById('galleryModal');
    const modalInner = document.getElementById('modalInner');

    if (!modal || !modalInner) return;

    // Animate modal exit
    modalInner.classList.remove('scale-100', 'opacity-100');
    modalInner.classList.add('scale-95', 'opacity-0');

    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }, 300);
}

// ============================================
// MUSIC CONTROLS
// ============================================

/**
 * Toggle background music
 */
function toggleMusic() {
    const button = document.getElementById('musicButton');
    if (!button) return;

    state.musicPlaying = !state.musicPlaying;

    if (state.musicPlaying) {
        button.innerHTML = `
            <span class="text-2xl group-hover:scale-125 transition-transform">⏸️</span>
            Pause Our Song
        `;
        button.classList.add('pulse-slow');
        
        // Here you would add your actual audio play logic
        // Example: document.getElementById('backgroundMusic').play();
        
        showMusicNotification();
    } else {
        button.innerHTML = `
            <span class="text-2xl group-hover:scale-125 transition-transform">🎵</span>
            Play Our Song
        `;
        button.classList.remove('pulse-slow');
        
        // Example: document.getElementById('backgroundMusic').pause();
    }
}

/**
 * Show notification about adding music
 */
function showMusicNotification() {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 glass rounded-2xl p-4 shadow-2xl z-50 max-w-sm fade-in';
    notification.innerHTML = `
        <div class="flex items-start gap-3">
            <span class="text-2xl">🎵</span>
            <div>
                <p class="font-semibold text-rose-600 mb-1">Add Your Song</p>
                <p class="text-sm text-gray-700">To play music, add an &lt;audio&gt; element with your favorite song to the HTML!</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ============================================
// EVENT LISTENERS
// ============================================

/**
 * Initialize event listeners when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    // Mobile viewport height fix
    setMobileVH();
    window.addEventListener('resize', debounce(setMobileVH, 150));
    window.addEventListener('orientationchange', setMobileVH);
    
    // Prevent pull-to-refresh on mobile
    document.body.addEventListener('touchmove', function(e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Prevent pinch-to-zoom on specific elements
    document.addEventListener('touchmove', function(e) {
        if (e.scale !== 1) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Create particles on login screen
    createParticles();

    // Password input enter key listener
    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', handlePasswordKeyPress);
        
        // Auto-focus on desktop only (prevents keyboard pop-up on mobile)
        if (!isMobileDevice()) {
            passwordInput.focus();
        }
    }

    // Modal close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Prevent default form submission
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => e.preventDefault());
    });
    
    // Add touch feedback class to mobile
    if (isMobileDevice()) {
        document.body.classList.add('touch-device');
    }
    
    // Optimize for mobile performance
    if (isMobileDevice()) {
        // Reduce particle count on mobile
        CONFIG.particleCount = 10;
    }
});

// ============================================
// CONSOLE MESSAGE
// ============================================

console.log(`
%c❤️ Anniversary Gift Website ❤️
%cMade with love for someone special
%c💕 Every detail crafted with care 💕
`, 
'color: #ec4899; font-size: 24px; font-weight: bold;',
'color: #f43f5e; font-size: 14px;',
'color: #ec4899; font-size: 14px;'
);
