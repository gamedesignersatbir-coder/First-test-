/* ===================================
   JoyPulse - Interactive Experience
   =================================== */

// State
let currentMood = 50;
let isSliding = false;

// Spring Physics Configuration
const springConfig = {
    tension: 170,
    friction: 26,
    mass: 1
};

// Spring Physics Class
class Spring {
    constructor(config) {
        this.tension = config.tension;
        this.friction = config.friction;
        this.mass = config.mass;
        this.velocity = 0;
        this.current = 0;
        this.target = 0;
    }

    update(target) {
        this.target = target;

        // Spring force: F = -kx
        const springForce = -this.tension * (this.current - this.target);

        // Damping force: F = -cv
        const dampingForce = -this.friction * this.velocity;

        // Total force
        const force = springForce + dampingForce;

        // Acceleration: a = F/m
        const acceleration = force / this.mass;

        // Update velocity and position
        this.velocity += acceleration * 0.016; // 60fps
        this.current += this.velocity * 0.016;

        // Check if spring has settled
        const isSettled = Math.abs(this.velocity) < 0.01 &&
                         Math.abs(this.current - this.target) < 0.01;

        if (isSettled) {
            this.current = this.target;
            this.velocity = 0;
        }

        return this.current;
    }

    isActive() {
        return Math.abs(this.velocity) > 0.01 ||
               Math.abs(this.current - this.target) > 0.01;
    }
}

// Initialize spring for slider
const sliderSpring = new Spring(springConfig);

// DOM Elements
const gradientBg = document.getElementById('gradientBg');
const moodSlider = document.getElementById('moodSlider');
const sliderFill = document.getElementById('sliderFill');
const sliderThumb = document.getElementById('sliderThumb');
const thumbEmoji = document.getElementById('thumbEmoji');
const moodValue = document.getElementById('moodValue');
const logMoodBtn = document.getElementById('logMoodBtn');
const cityName = document.getElementById('cityName');
const tickerContent = document.getElementById('tickerContent');
const confettiCanvas = document.getElementById('confettiCanvas');

// Set canvas size
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
});

/* ===================================
   Mood System
   =================================== */

const moodStates = [
    { min: 0, max: 20, emoji: '😢', text: 'Feeling Down', color1: '#1e3a8a', color2: '#3b82f6' },
    { min: 20, max: 40, emoji: '😔', text: 'A Bit Low', color1: '#3b82f6', color2: '#6366f1' },
    { min: 40, max: 60, emoji: '😊', text: 'Feeling Good', color1: '#6366f1', color2: '#8b5cf6' },
    { min: 60, max: 80, emoji: '😄', text: 'Pretty Happy', color1: '#8b5cf6', color2: '#f59e0b' },
    { min: 80, max: 100, emoji: '🤩', text: 'Absolutely Ecstatic', color1: '#f59e0b', color2: '#fbbf24' }
];

function getMoodState(value) {
    return moodStates.find(state => value >= state.min && value <= state.max) || moodStates[2];
}

function updateMoodUI(value) {
    const mood = getMoodState(value);

    // Update emoji
    thumbEmoji.textContent = mood.emoji;

    // Update text
    moodValue.textContent = mood.text;

    // Update fill height
    sliderFill.style.height = `${value}%`;

    // Update background gradient with smooth transition
    gradientBg.style.background = `linear-gradient(135deg, ${mood.color1} 0%, ${mood.color2} 100%)`;
}

function updateSliderThumbPosition(value) {
    // Calculate position (inverse because slider is bottom-to-top)
    const percentage = 100 - value;
    const trackHeight = sliderThumb.parentElement.offsetHeight;
    const thumbHeight = sliderThumb.offsetHeight;
    const maxPosition = trackHeight - thumbHeight;
    const position = (percentage / 100) * maxPosition;

    sliderThumb.style.top = `${position}px`;
}

/* ===================================
   Spring Animation Loop
   =================================== */

function animateSlider() {
    if (sliderSpring.isActive()) {
        const springValue = sliderSpring.update(currentMood);
        updateSliderThumbPosition(springValue);
        requestAnimationFrame(animateSlider);
    }
}

/* ===================================
   Slider Interaction
   =================================== */

moodSlider.addEventListener('input', (e) => {
    isSliding = true;
    currentMood = parseFloat(e.target.value);

    // Update spring target
    sliderSpring.target = currentMood;

    // Start animation if not already running
    if (!sliderSpring.isActive()) {
        sliderSpring.current = currentMood;
        animateSlider();
    }

    // Update UI
    updateMoodUI(currentMood);
});

moodSlider.addEventListener('change', () => {
    isSliding = false;
});

// Add smooth momentum on release
moodSlider.addEventListener('mouseup', () => {
    // Add a small velocity for spring effect
    sliderSpring.velocity = (Math.random() - 0.5) * 2;
    animateSlider();
});

moodSlider.addEventListener('touchend', () => {
    // Add a small velocity for spring effect
    sliderSpring.velocity = (Math.random() - 0.5) * 2;
    animateSlider();
});

/* ===================================
   Confetti System
   =================================== */

function triggerConfetti(mood) {
    const emoji = getMoodState(mood).emoji;

    // Multiple bursts for more impact
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = {
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 9999,
        shapes: ['circle', 'square']
    };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // Create confetti from multiple points
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            colors: mood > 60 ? ['#fbbf24', '#f59e0b', '#fb923c'] : ['#3b82f6', '#6366f1', '#8b5cf6']
        });

        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            colors: mood > 60 ? ['#fbbf24', '#f59e0b', '#fb923c'] : ['#3b82f6', '#6366f1', '#8b5cf6']
        });
    }, 250);

    // Emoji explosion in center
    confetti({
        particleCount: 100,
        spread: 160,
        origin: { y: 0.6 },
        scalar: 2,
        shapes: ['text'],
        shapeOptions: {
            text: {
                value: [emoji]
            }
        }
    });
}

/* ===================================
   Log Mood Button
   =================================== */

logMoodBtn.addEventListener('click', () => {
    // Trigger confetti
    triggerConfetti(currentMood);

    // Button feedback
    logMoodBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        logMoodBtn.style.transform = '';
    }, 200);

    // Add to ticker
    const mood = getMoodState(currentMood);
    addTickerItem(`You just logged: ${mood.text} ${mood.emoji}`);

    // Simulate saving (in real app, would send to backend)
    console.log('Mood logged:', {
        value: currentMood,
        mood: mood.text,
        timestamp: new Date().toISOString(),
        city: cityName.textContent
    });
});

/* ===================================
   City Detection
   =================================== */

async function detectCity() {
    try {
        // Try to get location
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();

        if (data.city) {
            cityName.textContent = data.city;
        } else if (data.country_name === 'India') {
            cityName.textContent = 'India';
        }
    } catch (error) {
        console.log('Could not detect city, using default');
        cityName.textContent = 'India';
    }
}

/* ===================================
   Live Ticker
   =================================== */

const tickerMessages = [
    "Mumbai just spiked to 78% Happy! 🎉",
    "Delhi feeling great at 82% 🌟",
    "Bangalore vibing at 75% ✨",
    "Hyderabad's mood improving to 68% 🚀",
    "Chennai spreading joy at 71% 💛",
    "Kolkata's happiness rising to 65% 📈",
    "Pune feeling fantastic at 80% 🎊",
    "Ahmedabad lighting up at 73% 💫"
];

function addTickerItem(message) {
    const item = document.createElement('div');
    item.className = 'ticker-item';
    item.textContent = message;

    tickerContent.insertBefore(item, tickerContent.firstChild);

    // Remove old items if more than 5
    while (tickerContent.children.length > 5) {
        tickerContent.removeChild(tickerContent.lastChild);
    }
}

function updateTicker() {
    const randomMessage = tickerMessages[Math.floor(Math.random() * tickerMessages.length)];
    addTickerItem(randomMessage);
}

// Update ticker every 5 seconds
setInterval(updateTicker, 5000);

/* ===================================
   Map Interactions
   =================================== */

const moodBubbles = document.querySelectorAll('.mood-bubble');

moodBubbles.forEach(bubble => {
    bubble.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.3)';
    });

    bubble.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });

    bubble.addEventListener('click', function() {
        const city = this.getAttribute('data-city');
        const title = this.querySelector('title').textContent;
        addTickerItem(`${title} - Click to see details!`);
    });
});

/* ===================================
   Joy Cards Interaction
   =================================== */

const joyCards = document.querySelectorAll('.joy-card');

joyCards.forEach(card => {
    card.addEventListener('click', () => {
        // Pulse animation
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 200);

        // Small confetti burst
        confetti({
            particleCount: 30,
            spread: 60,
            origin: {
                x: Math.random(),
                y: Math.random()
            },
            colors: ['#fbbf24', '#f59e0b']
        });
    });
});

/* ===================================
   Smooth Scroll for Footer Links
   =================================== */

const footerLinks = document.querySelectorAll('.footer-link');

footerLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        console.log('Navigate to:', href);
        // In a real app, would handle navigation here
    });
});

/* ===================================
   Initialize
   =================================== */

function init() {
    // Set initial mood
    currentMood = 50;
    sliderSpring.current = 50;
    sliderSpring.target = 50;

    // Update UI
    updateMoodUI(currentMood);
    updateSliderThumbPosition(currentMood);

    // Detect city
    detectCity();

    // Add welcome animation
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
}

// Start the experience
init();

/* ===================================
   Easter Egg: Keyboard Controls
   =================================== */

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        currentMood = Math.min(100, currentMood + 5);
        moodSlider.value = currentMood;
        sliderSpring.target = currentMood;
        animateSlider();
        updateMoodUI(currentMood);
    } else if (e.key === 'ArrowDown') {
        currentMood = Math.max(0, currentMood - 5);
        moodSlider.value = currentMood;
        sliderSpring.target = currentMood;
        animateSlider();
        updateMoodUI(currentMood);
    }
});
