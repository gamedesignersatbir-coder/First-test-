/* ===================================
   JoyPulse - Premium Interactive Experience
   =================================== */

// ===================================
// State Management
// ===================================
const state = {
    currentMood: 50,
    isSliding: false,
    chart: null,
    hasLoaded: false
};

// ===================================
// Spring Physics Engine
// ===================================
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
        const springForce = -this.tension * (this.current - this.target);
        const dampingForce = -this.friction * this.velocity;
        const force = springForce + dampingForce;
        const acceleration = force / this.mass;

        this.velocity += acceleration * 0.016;
        this.current += this.velocity * 0.016;

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

const sliderSpring = new Spring({ tension: 170, friction: 26, mass: 1 });

// ===================================
// DOM Elements
// ===================================
const elements = {
    // Loading
    loadingScreen: document.getElementById('loadingScreen'),

    // Background
    gradientBg: document.getElementById('gradientBg'),
    particles: document.getElementById('particles'),

    // Navigation
    navBar: document.getElementById('navBar'),
    navLinks: document.querySelectorAll('.nav-link'),
    shareBtn: document.getElementById('shareBtn'),

    // Hero
    cityName: document.getElementById('cityName'),
    counters: document.querySelectorAll('.counter'),

    // Mood Slider
    moodSlider: document.getElementById('moodSlider'),
    sliderFill: document.getElementById('sliderFill'),
    sliderThumb: document.getElementById('sliderThumb'),
    thumbEmoji: document.getElementById('thumbEmoji'),
    moodValue: document.getElementById('moodValue'),
    sliderParticles: document.getElementById('sliderParticles'),
    logMoodBtn: document.getElementById('logMoodBtn'),

    // Stats
    happiestCity: document.getElementById('happiestCity'),

    // Trends
    moodChart: document.getElementById('moodChart'),
    trendBtns: document.querySelectorAll('.trend-btn'),

    // Map
    indiaMap: document.getElementById('indiaMap'),
    moodBubbles: document.querySelectorAll('.mood-bubble'),
    mapControlBtns: document.querySelectorAll('.map-control-btn'),
    tickerContent: document.getElementById('tickerContent'),

    // Joy Cards
    joyCards: document.querySelectorAll('.joy-card'),

    // Insights
    insightBtns: document.querySelectorAll('.insight-btn'),

    // Newsletter
    newsletterForm: document.querySelector('.newsletter-form'),

    // Confetti
    confettiCanvas: document.getElementById('confettiCanvas')
};

// ===================================
// Loading Screen
// ===================================
function hideLoadingScreen() {
    setTimeout(() => {
        elements.loadingScreen.classList.add('hidden');
        state.hasLoaded = true;
        initAnimations();
    }, 1500);
}

// ===================================
// Particle System
// ===================================
function createParticles() {
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 20}s`;
        particle.style.animationDuration = `${15 + Math.random() * 10}s`;
        elements.particles.appendChild(particle);
    }
}

// ===================================
// Animated Counters
// ===================================
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

function initCounters() {
    elements.counters.forEach(counter => {
        animateCounter(counter);
    });
}

// ===================================
// Mood System
// ===================================
const moodStates = [
    { min: 0, max: 20, emoji: '😢', text: 'Overwhelmed & Struggling', color1: '#1a1a2e', color2: '#4a5568' },
    { min: 20, max: 40, emoji: '😔', text: 'Feeling Low & Drained', color1: '#4a5568', color2: '#7c3aed' },
    { min: 40, max: 60, emoji: '😊', text: 'Content & Balanced', color1: '#7c3aed', color2: '#f59e0b' },
    { min: 60, max: 80, emoji: '😄', text: 'Joyful & Energized', color1: '#f59e0b', color2: '#fbbf24' },
    { min: 80, max: 100, emoji: '🌟', text: 'Grateful & Radiant', color1: '#fbbf24', color2: '#fb923c' }
];

function getMoodState(value) {
    return moodStates.find(state => value >= state.min && value <= state.max) || moodStates[2];
}

function updateMoodUI(value) {
    const mood = getMoodState(value);

    // Update emoji
    elements.thumbEmoji.textContent = mood.emoji;

    // Update text
    elements.moodValue.textContent = mood.text;

    // Update fill height
    elements.sliderFill.style.height = `${value}%`;

    // Update background gradient
    elements.gradientBg.style.background = `linear-gradient(135deg, ${mood.color1} 0%, ${mood.color2} 100%)`;

    // Create slider particles
    if (state.isSliding && Math.random() > 0.7) {
        createSliderParticle(value);
    }
}

function updateSliderThumbPosition(value) {
    const percentage = 100 - value;
    const trackHeight = elements.sliderThumb.parentElement.offsetHeight;
    const thumbHeight = elements.sliderThumb.offsetHeight;
    const maxPosition = trackHeight - thumbHeight;
    const position = (percentage / 100) * maxPosition;

    elements.sliderThumb.style.top = `${position}px`;
}

function createSliderParticle(mood) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = '6px';
    particle.style.height = '6px';
    particle.style.borderRadius = '50%';
    particle.style.background = mood > 60 ? '#fbbf24' : '#6366f1';
    particle.style.left = '50%';
    particle.style.top = `${100 - mood}%`;
    particle.style.transform = 'translateX(-50%)';
    particle.style.opacity = '0.8';
    particle.style.pointerEvents = 'none';

    elements.sliderParticles.appendChild(particle);

    // Animate and remove
    setTimeout(() => {
        particle.style.transition = 'all 1s ease-out';
        particle.style.opacity = '0';
        particle.style.transform = `translateX(${Math.random() * 40 - 20}px) translateY(-30px)`;

        setTimeout(() => particle.remove(), 1000);
    }, 50);
}

// ===================================
// Spring Animation Loop
// ===================================
function animateSlider() {
    if (sliderSpring.isActive()) {
        const springValue = sliderSpring.update(state.currentMood);
        updateSliderThumbPosition(springValue);
        requestAnimationFrame(animateSlider);
    }
}

// ===================================
// Mood Slider Interactions
// ===================================
elements.moodSlider.addEventListener('input', (e) => {
    state.isSliding = true;
    state.currentMood = parseFloat(e.target.value);

    sliderSpring.target = state.currentMood;

    if (!sliderSpring.isActive()) {
        sliderSpring.current = state.currentMood;
        animateSlider();
    }

    updateMoodUI(state.currentMood);
});

elements.moodSlider.addEventListener('change', () => {
    state.isSliding = false;
});

elements.moodSlider.addEventListener('mouseup', () => {
    sliderSpring.velocity = (Math.random() - 0.5) * 2;
    animateSlider();
});

elements.moodSlider.addEventListener('touchend', () => {
    sliderSpring.velocity = (Math.random() - 0.5) * 2;
    animateSlider();
});

// ===================================
// Confetti System
// ===================================
function triggerConfetti(mood) {
    const emoji = getMoodState(mood).emoji;
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

    // Emoji explosion
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

// ===================================
// Log Mood Button
// ===================================
elements.logMoodBtn.addEventListener('click', () => {
    triggerConfetti(state.currentMood);

    elements.logMoodBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        elements.logMoodBtn.style.transform = '';
    }, 200);

    const mood = getMoodState(state.currentMood);
    addTickerItem(`You just logged: ${mood.text} ${mood.emoji}`, 'just now');

    // Log to console (in real app, would send to backend)
    console.log('Mood logged:', {
        value: state.currentMood,
        mood: mood.text,
        timestamp: new Date().toISOString(),
        city: elements.cityName.textContent
    });
});

// ===================================
// City Detection
// ===================================
async function detectCity() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();

        if (data.city) {
            elements.cityName.textContent = data.city;
        } else if (data.country_name === 'India') {
            elements.cityName.textContent = 'India';
        }
    } catch (error) {
        console.log('Could not detect city, using default');
        elements.cityName.textContent = 'India';
    }
}

// ===================================
// Live Ticker
// ===================================
const tickerMessages = [
    { text: "Mumbai just spiked to 85% Happy!", icon: "🎉" },
    { text: "Delhi feeling great at 82%", icon: "🌟" },
    { text: "Bangalore vibing at 75%", icon: "✨" },
    { text: "Hyderabad's mood improving to 68%", icon: "🚀" },
    { text: "Chennai spreading joy at 72%", icon: "💛" },
    { text: "Kolkata's happiness rising to 65%", icon: "📈" },
    { text: "Pune feeling fantastic at 78%", icon: "🎊" },
    { text: "Ahmedabad lighting up at 80%", icon: "💫" }
];

function addTickerItem(message, time = '2m ago') {
    const item = document.createElement('div');
    item.className = 'ticker-item';
    item.innerHTML = `
        <span class="ticker-icon">${tickerMessages[Math.floor(Math.random() * tickerMessages.length)].icon}</span>
        <span class="ticker-text">${message}</span>
        <span class="ticker-time">${time}</span>
    `;

    elements.tickerContent.insertBefore(item, elements.tickerContent.firstChild);

    while (elements.tickerContent.children.length > 5) {
        elements.tickerContent.removeChild(elements.tickerContent.lastChild);
    }
}

function updateTicker() {
    const random = tickerMessages[Math.floor(Math.random() * tickerMessages.length)];
    addTickerItem(random.text, `${Math.floor(Math.random() * 10) + 1}m ago`);
}

setInterval(updateTicker, 8000);

// ===================================
// Mood Chart (Chart.js)
// ===================================
function createMoodChart() {
    if (!elements.moodChart) {
        console.log('Chart canvas not found');
        return;
    }

    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded!');
        return;
    }

    const ctx = elements.moodChart.getContext('2d');

    // Sample data
    const todayData = [45, 52, 58, 68, 72, 75, 70, 65, 62, 58, 55, 52];
    const weekData = [55, 58, 62, 65, 68, 70, 72];
    const monthData = [50, 52, 55, 58, 60, 63, 65, 67, 68, 70, 71, 72];

    const gradientStroke = ctx.createLinearGradient(0, 0, 0, 300);
    gradientStroke.addColorStop(0, 'rgba(251, 191, 36, 0.4)');
    gradientStroke.addColorStop(1, 'rgba(251, 191, 36, 0.0)');

    state.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM', '12AM', '2AM', '4AM'],
            datasets: [{
                label: 'Happiness Level',
                data: todayData,
                borderColor: '#fbbf24',
                backgroundColor: gradientStroke,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#fbbf24',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleColor: '#fbbf24',
                    bodyColor: '#ffffff',
                    borderColor: '#fbbf24',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });

    // Trend button handlers
    elements.trendBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.trendBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const period = btn.getAttribute('data-period');
            let newData, newLabels;

            switch (period) {
                case 'today':
                    newData = todayData;
                    newLabels = ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM', '12AM', '2AM', '4AM'];
                    break;
                case 'week':
                    newData = weekData;
                    newLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                    break;
                case 'month':
                    newData = monthData;
                    newLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Week 11', 'Week 12'];
                    break;
            }

            state.chart.data.labels = newLabels;
            state.chart.data.datasets[0].data = newData;
            state.chart.update();
        });
    });
}

// ===================================
// Map Interactions
// ===================================
elements.moodBubbles.forEach(bubble => {
    bubble.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.4)';
    });

    bubble.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });

    bubble.addEventListener('click', function() {
        const city = this.getAttribute('data-city');
        const mood = this.getAttribute('data-mood');
        addTickerItem(`${city}: ${mood}% Happy - You clicked to see details!`, 'just now');

        // Mini confetti
        confetti({
            particleCount: 30,
            spread: 60,
            origin: {
                x: Math.random(),
                y: Math.random() * 0.5
            },
            colors: ['#fbbf24', '#f59e0b']
        });
    });
});

// Map control buttons
elements.mapControlBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        elements.mapControlBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const view = btn.getAttribute('data-view');
        console.log('Switched to view:', view);

        // Switch visualization based on view
        elements.moodBubbles.forEach(bubble => {
            if (view === 'heat') {
                bubble.style.opacity = '1';
                bubble.style.filter = bubble.classList.contains('very-happy') ? 'drop-shadow(0 0 30px #fbbf24)' :
                                      bubble.classList.contains('happy') ? 'drop-shadow(0 0 25px #f59e0b)' :
                                      bubble.classList.contains('neutral') ? 'drop-shadow(0 0 20px #7c3aed)' :
                                      'drop-shadow(0 0 15px #6b7280)';
            } else if (view === 'cities') {
                bubble.style.opacity = '0.8';
                bubble.style.filter = 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))';
            } else if (view === 'density') {
                const mood = parseInt(bubble.getAttribute('data-mood'));
                const size = (mood / 100) * 30 + 15; // Scale between 15-45
                bubble.style.r = size;
                bubble.style.opacity = (mood / 100) * 0.5 + 0.5; // 0.5 to 1
                bubble.style.filter = 'blur(5px) drop-shadow(0 0 15px currentColor)';
            }
        });

        addTickerItem(`Map view switched to ${view} mode`, 'just now');
    });
});

// ===================================
// Joy Cards Interactions
// ===================================
elements.joyCards.forEach(card => {
    card.addEventListener('click', () => {
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 200);

        const action = card.getAttribute('data-action');
        console.log('Joy action:', action);

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

// ===================================
// Insight Buttons
// ===================================
elements.insightBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 200);

        // In real app, would open modal or navigate
        console.log('Insight clicked:', btn.textContent);
    });
});

// ===================================
// Navigation Scroll Detection
// ===================================
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        elements.navBar.style.background = 'rgba(255, 255, 255, 0.08)';
    } else {
        elements.navBar.style.background = 'rgba(255, 255, 255, 0.03)';
    }

    // Smooth scroll nav links
    elements.navLinks.forEach(link => {
        const section = document.querySelector(link.getAttribute('href'));
        if (section) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                elements.navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });

    lastScroll = currentScroll;
});

// Smooth scroll for nav links
elements.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);

        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===================================
// Share Button
// ===================================
elements.shareBtn.addEventListener('click', async () => {
    const shareData = {
        title: 'JoyPulse - Mood of the Nation',
        text: `I just logged my mood on JoyPulse! ${elements.cityName.textContent} is feeling great! Join me and help turn the map gold! 🌟`,
        url: window.location.href
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
            console.log('Shared successfully');
        } else {
            // Fallback: copy to clipboard
            await navigator.clipboard.writeText(shareData.url);
            alert('Link copied to clipboard!');
        }
    } catch (err) {
        console.log('Error sharing:', err);
    }
});

// ===================================
// Newsletter Form
// ===================================
elements.newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = elements.newsletterForm.querySelector('input[type="email"]').value;

    // In real app, would send to backend
    console.log('Newsletter signup:', email);

    // Show success
    confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.8 }
    });

    elements.newsletterForm.reset();

    // Show success message
    const btn = elements.newsletterForm.querySelector('button');
    const originalText = btn.textContent;
    btn.textContent = 'Subscribed! ✓';
    btn.style.background = '#22c55e';

    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
    }, 3000);
});

// ===================================
// Keyboard Controls
// ===================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        state.currentMood = Math.min(100, state.currentMood + 5);
        elements.moodSlider.value = state.currentMood;
        sliderSpring.target = state.currentMood;
        animateSlider();
        updateMoodUI(state.currentMood);
    } else if (e.key === 'ArrowDown') {
        state.currentMood = Math.max(0, state.currentMood - 5);
        elements.moodSlider.value = state.currentMood;
        sliderSpring.target = state.currentMood;
        animateSlider();
        updateMoodUI(state.currentMood);
    }
});

// ===================================
// Intersection Observer for Animations
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';

            // Trigger counter animations when stats section is visible
            if (entry.target.classList.contains('stats-section')) {
                initCounters();
            }
        }
    });
}, observerOptions);

function initAnimations() {
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// ===================================
// Canvas Resize Handler
// ===================================
function resizeCanvas() {
    elements.confettiCanvas.width = window.innerWidth;
    elements.confettiCanvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);

// ===================================
// Initialize Everything
// ===================================
function init() {
    // Set initial mood
    state.currentMood = 50;
    sliderSpring.current = 50;
    sliderSpring.target = 50;

    // Update UI
    updateMoodUI(state.currentMood);
    updateSliderThumbPosition(state.currentMood);

    // Create particles
    createParticles();

    // Resize canvas
    resizeCanvas();

    // Detect city
    detectCity();

    // Create chart - wait for Chart.js to load
    setTimeout(() => {
        if (typeof Chart !== 'undefined') {
            createMoodChart();
        } else {
            console.error('Chart.js failed to load');
        }
    }, 500);

    // Hide loading screen
    hideLoadingScreen();

    console.log('%cJoyPulse ✨', 'font-size: 32px; font-weight: bold; color: #fbbf24;');
    console.log('%cSpread joy, measure happiness, multiply smiles', 'font-size: 14px; color: #6366f1;');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ===================================
// Easter Eggs
// ===================================
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Easter egg: Super confetti explosion
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                confetti({
                    particleCount: 200,
                    spread: 180,
                    origin: { x: Math.random(), y: Math.random() }
                });
            }, i * 300);
        }
        console.log('🎉 Easter egg activated! Maximum joy!');
    }
});
