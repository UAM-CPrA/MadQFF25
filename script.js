// Enhanced Hero Section Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Counter Animation
    function animateCounters() {
        const counters = document.querySelectorAll('.counter');
        const speed = 200; // The lower the number, the faster the animation
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const count = parseInt(counter.innerText);
            const increment = target / speed;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(() => animateCounters(), 1);
            } else {
                counter.innerText = target;
            }
        });
    }
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('counter')) {
                    // Reset counters and animate
                    document.querySelectorAll('.counter').forEach(counter => {
                        counter.innerText = '0';
                    });
                    animateCounters();
                }
            }
        });
    }, observerOptions);
    
    // Observe stats section
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
    
    // Parallax effect for quantum elements
    function handleParallax() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelectorAll('.quantum-orb');
        const speed = 0.5;
        
        parallax.forEach((element, index) => {
            const yPos = -(scrolled * speed * (index + 1) * 0.3);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
    
    // Smooth scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ 
                    behavior: 'smooth' 
                });
            }
        });
    }
    
    // Enhanced button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Quantum particles animation on mouse move
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        const particles = document.querySelector('.quantum-particles');
        if (particles) {
            const xPercent = (mouseX / window.innerWidth) * 100;
            const yPercent = (mouseY / window.innerHeight) * 100;
            
            particles.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
        }
    });
    
    // Window scroll effects
    window.addEventListener('scroll', () => {
        handleParallax();
        
        // Hide/show scroll indicator
        const scrollY = window.scrollY;
        const scrollIndicator = document.querySelector('.scroll-indicator');
        
        if (scrollIndicator) {
            if (scrollY > 100) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'auto';
            }
        }
    });
    
    // Add loading animation for hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'all 1s ease-out';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 500);
    }
    
    // Countdown Timer for Final CTA
    function initCountdown() {
        // Set the festival start date (October 27, 2025)
        const festivalDate = new Date('2025-10-27T09:00:00').getTime();
        
        function updateCountdown() {
            const now = new Date().getTime();
            const distance = festivalDate - now;
            
            if (distance > 0) {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                
                const daysElement = document.getElementById('days');
                const hoursElement = document.getElementById('hours');
                const minutesElement = document.getElementById('minutes');
                
                if (daysElement) daysElement.textContent = days.toString().padStart(2, '0');
                if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
                if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
            } else {
                // Festival has started
                const daysElement = document.getElementById('days');
                const hoursElement = document.getElementById('hours');
                const minutesElement = document.getElementById('minutes');
                
                if (daysElement) daysElement.textContent = '00';
                if (hoursElement) hoursElement.textContent = '00';
                if (minutesElement) minutesElement.textContent = '00';
                
                // Update countdown label
                const countdownLabel = document.querySelector('.countdown-label');
                if (countdownLabel) {
                    countdownLabel.textContent = 'Festival is now live!';
                }
            }
        }
        
        // Update countdown immediately and then every minute
        updateCountdown();
        setInterval(updateCountdown, 60000); // Update every minute
    }
    
    // Initialize countdown if the countdown elements exist
    if (document.getElementById('days')) {
        initCountdown();
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// QFF Images Carousel
class QFFCarousel {
    constructor() {
        // We'll dynamically load images from QFFNodes folder
        this.images = [];
        this.basePath = 'QFFNodes/';
        this.currentIndex = 0;
        this.itemsPerView = 4;
        this.maxIndex = 0;
        
        this.loadQFFNodeImages();
    }
    
    async loadQFFNodeImages() {
        // For now, we'll use the known images and can expand this list
        // In a real application, you might fetch this from an API
        const knownImages = [
            'CPrA.png'
            // Add more node images as they become available
        ];
        
        // You can also add fallback to Emojis if QFFNodes is empty
        const fallbackImages = [
            'Atom_01.png',
            'Atom_03.png', 
            'Atom-02.png',
            'Badge_01.png',
            'Badge_02.png',
            'Badge_03.png',
            'Cat_01.png',
            'Cat_02.png',
            'Circuit.png',
            'Entanglement.png',
            'Qiskit_01.png',
            'Qiskit_02.png',
            'Qiskit_03.png',
            'Text_Fall Fest_01.png',
            'Text_Fall Fest_02.png',
            'Text_Qiskit_01.png',
            'Text_Qiskit_02.png',
            'Text_Quantum_01.png',
            'Text_Quantum_02.png',
            'Theme.png',
            'Timeline_01.png',
            'Timeline_02.png',
            'Timeline_03.png',
            'Timeline_04.png'
        ];
        
        // Try to use QFFNodes images first, fallback to Emojis if needed
        if (knownImages.length > 0) {
            this.images = knownImages.map(img => ({
                src: this.basePath + img,
                alt: `QFF Node ${img.replace('.png', '').replace(/_/g, ' ')}`
            }));
        } else {
            // Fallback to Emojis folder
            this.basePath = 'Fall Fest Graphics/Emojis/';
            this.images = fallbackImages.map(img => ({
                src: this.basePath + img,
                alt: `QFF ${img.replace('.png', '').replace(/_/g, ' ')}`
            }));
        }
        
        this.maxIndex = Math.max(0, this.images.length - this.itemsPerView);
        this.init();
    }
    
    init() {
        this.createCarousel();
        this.createIndicators();
        this.bindEvents();
        this.startAutoPlay();
    }
    
    createCarousel() {
        const track = document.getElementById('qffCarousel');
        if (!track || this.images.length === 0) return;
        
        track.innerHTML = this.images.map(image => `
            <div class="carousel-item">
                <img src="${image.src}" 
                     alt="${image.alt}" 
                     loading="lazy"
                     onerror="this.style.display='none'">
            </div>
        `).join('');
        
        this.updateCarousel();
    }
    
    createIndicators() {
        const indicatorsContainer = document.getElementById('carouselIndicators');
        if (!indicatorsContainer || this.images.length === 0) return;
        
        const indicatorCount = Math.ceil(this.images.length / this.itemsPerView);
        indicatorsContainer.innerHTML = Array.from({length: indicatorCount}, (_, i) => `
            <div class="indicator ${i === 0 ? 'active' : ''}" data-index="${i}"></div>
        `).join('');
    }
    
    updateCarousel() {
        const track = document.getElementById('qffCarousel');
        const indicators = document.querySelectorAll('.indicator');
        
        if (track) {
            const translateX = -(this.currentIndex * (100 / this.itemsPerView));
            track.style.transform = `translateX(${translateX}%)`;
        }
        
        indicators.forEach((indicator, index) => {
            const indicatorIndex = Math.floor(this.currentIndex / this.itemsPerView);
            indicator.classList.toggle('active', index === indicatorIndex);
        });
    }
    
    next() {
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0; // Loop back to start
        }
        this.updateCarousel();
    }
    
    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            this.currentIndex = this.maxIndex; // Loop to end
        }
        this.updateCarousel();
    }
    
    goToSlide(index) {
        this.currentIndex = Math.min(index * this.itemsPerView, this.maxIndex);
        this.updateCarousel();
    }
    
    bindEvents() {
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        const indicators = document.querySelectorAll('.indicator');
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.next());
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prev());
        }
        
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Touch/swipe support
        let startX = 0;
        let endX = 0;
        
        const carousel = document.querySelector('.carousel-container');
        if (carousel) {
            carousel.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            });
            
            carousel.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                this.handleSwipe();
            });
            
            carousel.addEventListener('mousedown', (e) => {
                startX = e.clientX;
                carousel.style.cursor = 'grabbing';
            });
            
            carousel.addEventListener('mouseup', (e) => {
                endX = e.clientX;
                carousel.style.cursor = 'grab';
                this.handleSwipe();
            });
        }
    }
    
    handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.next();
            } else {
                this.prev();
            }
        }
    }
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, 4000); // Change slide every 4 seconds
        
        // Pause on hover
        const carousel = document.querySelector('.carousel-container');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => {
                clearInterval(this.autoPlayInterval);
            });
            
            carousel.addEventListener('mouseleave', () => {
                this.startAutoPlay();
            });
        }
    }
    
    // Responsive adjustment
    updateItemsPerView() {
        const oldItemsPerView = this.itemsPerView;
        
        if (window.innerWidth < 480) {
            this.itemsPerView = 1;
        } else if (window.innerWidth < 768) {
            this.itemsPerView = 2;
        } else if (window.innerWidth < 1024) {
            this.itemsPerView = 3;
        } else {
            this.itemsPerView = 4;
        }
        
        if (oldItemsPerView !== this.itemsPerView) {
            this.maxIndex = Math.max(0, this.images.length - this.itemsPerView);
            this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
            this.createIndicators();
            this.updateCarousel();
        }
    }
}

// Initialize carousel when DOM is loaded
let qffCarousel;

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(15, 15, 35, 0.98)';
    } else {
        header.style.background = 'rgba(15, 15, 35, 0.95)';
    }
});

// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Node interaction (updated for Leaflet)
const nodeItems = document.querySelectorAll('.node-item');

nodeItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remove active class from all items
        nodeItems.forEach(i => i.classList.remove('active'));
        
        // Add active class to clicked item
        item.classList.add('active');
        
        // Pan to corresponding region on map if it exists
        const region = item.dataset.region;
        if (window.qffMap && region) {
            const regionCoords = {
                'north-america': [45, -100],
                'south-america': [-15, -60],
                'europe': [54, 15],
                'asia': [35, 104]
            };
            
            if (regionCoords[region]) {
                window.qffMap.setView(regionCoords[region], 3);
            }
        }
    });
});

// Timeline navigation
const timelineBtns = document.querySelectorAll('.timeline-btn');
const timelineContent = document.querySelector('.timeline-content');

// Sample data for different days
const timelineData = {
    today: [
        {
            time: '14:00 UTC',
            timezone: 'Now',
            title: 'Quantum Algorithms Workshop',
            description: 'Deep dive into Grover\'s and Shor\'s algorithms',
            node: 'Tokyo Node',
            type: 'Workshop',
            btnText: 'Join'
        },
        {
            time: '16:30 UTC',
            timezone: '2.5h',
            title: 'Quantum Hardware Hackathon',
            description: 'Build quantum circuits on real IBM hardware',
            node: 'Berlin Node',
            type: 'Hackathon',
            btnText: 'Register'
        },
        {
            time: '20:00 UTC',
            timezone: '6h',
            title: 'Quantum Machine Learning Panel',
            description: 'Industry experts discuss QML applications',
            node: 'San Francisco Node',
            type: 'Panel',
            btnText: 'Remind Me'
        }
    ],
    tomorrow: [
        {
            time: '08:00 UTC',
            timezone: 'Tomorrow',
            title: 'Quantum Computing 101',
            description: 'Introduction to quantum computing basics',
            node: 'London Node',
            type: 'Tutorial',
            btnText: 'Register'
        },
        {
            time: '12:00 UTC',
            timezone: '+20h',
            title: 'Research Collaboration Meet',
            description: 'Connect with researchers worldwide',
            node: 'Toronto Node',
            type: 'Networking',
            btnText: 'Join'
        },
        {
            time: '18:00 UTC',
            timezone: '+26h',
            title: 'Quantum Error Correction Workshop',
            description: 'Advanced concepts in quantum error correction',
            node: 'Sydney Node',
            type: 'Workshop',
            btnText: 'Register'
        }
    ],
    week: [
        {
            time: 'Mon 10:00 UTC',
            timezone: 'This Week',
            title: 'Weekly Quantum Challenge',
            description: 'Solve quantum problems and win prizes',
            node: 'Global',
            type: 'Challenge',
            btnText: 'Participate'
        },
        {
            time: 'Wed 15:00 UTC',
            timezone: 'Wed',
            title: 'Industry Guest Speaker Series',
            description: 'Quantum computing in finance and healthcare',
            node: 'New York Node',
            type: 'Lecture',
            btnText: 'Register'
        },
        {
            time: 'Fri 19:00 UTC',
            timezone: 'Fri',
            title: 'Global Quantum Showcase',
            description: 'Present your quantum projects',
            node: 'All Nodes',
            type: 'Showcase',
            btnText: 'Submit Project'
        }
    ]
};

function updateTimeline(day) {
    const activities = timelineData[day] || timelineData.today;
    
    timelineContent.innerHTML = activities.map(activity => `
        <div class="activity-card">
            <div class="activity-time">
                <span class="time">${activity.time}</span>
                <span class="timezone">${activity.timezone}</span>
            </div>
            <div class="activity-info">
                <h3>${activity.title}</h3>
                <p>${activity.description}</p>
                <div class="activity-meta">
                    <span class="activity-node">${activity.node}</span>
                    <span class="activity-type">${activity.type}</span>
                </div>
            </div>
            <button class="btn btn-small">${activity.btnText}</button>
        </div>
    `).join('');
}

timelineBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        timelineBtns.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Update timeline content
        const day = btn.dataset.day;
        updateTimeline(day);
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.about-card, .node-item, .activity-card, .schedule-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Real-time clock for activities
function updateCurrentTime() {
    const now = new Date();
    const utcTime = now.toUTCString().split(' ')[4];
    
    // Update any "Now" indicators
    document.querySelectorAll('.timezone').forEach(el => {
        if (el.textContent === 'Now') {
            // Update with actual current UTC time if needed
        }
    });
}

// Update time every minute
setInterval(updateCurrentTime, 60000);

// Particle animation for hero background
function createParticles() {
    const hero = document.querySelector('.hero');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(99, 102, 241, 0.3);
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        hero.appendChild(particle);
    }
}

// Initialize particles
if (window.innerWidth > 768) {
    createParticles();
}

// Button click handlers
document.addEventListener('click', (e) => {
    if (e.target.matches('.btn')) {
        // Add click animation
        e.target.style.transform = 'scale(0.95)';
        setTimeout(() => {
            e.target.style.transform = '';
        }, 150);
        
        // Handle specific button actions
        const btnText = e.target.textContent.trim();
        
        switch (btnText) {
            case 'Join the Festival':
                showNotification('Welcome to Global Entanglement! 🎉');
                break;
            case 'View Schedule':
                document.querySelector('#schedule').scrollIntoView({ behavior: 'smooth' });
                break;
            case 'Join':
            case 'Register':
                showNotification('Registration link will be sent to your email! 📧');
                break;
            case 'Remind Me':
                showNotification('Reminder set! We\'ll notify you 15 minutes before. ⏰');
                break;
        }
    }
});

// Notification system
function showNotification(message) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--gradient-primary);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: var(--shadow-lg);
        z-index: 1001;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .particle {
        pointer-events: none;
        z-index: 1;
    }
    
    @media (max-width: 768px) {
        .nav-links.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: var(--bg-primary);
            border-top: 1px solid var(--border-color);
            padding: 1rem;
            gap: 1rem;
        }
        
        .nav-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;
document.head.appendChild(style);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize QFF Carousel
    qffCarousel = new QFFCarousel();
    
    // Initialize Partnerships Carousel
    initializePartnershipsCarousel();
    
    // Initialize Leaflet Map (only if container exists)
    const mapContainer = document.getElementById('worldMap');
    if (mapContainer) {
        await initializeWorldMap();
    } else {
        console.log('🗺️ World map container not found - skipping map initialization');
    }
    
    // Update sidebar with loaded data
    await updateNodesSidebar();
    
// ASTONISHING QUANTUM CALENDAR ENHANCEMENTS

// Initialize enhanced calendar features
function initializeAstonishingCalendar() {
    try {
        console.log('🚀 Initializing Astonishing Calendar...');
        initializeQuantumAnimations();
        initializeCounterAnimations();
        initializeViewSwitcher();
        initializeProgressRings();
        initializeEventModal();
        initializeQuantumEffects();
        initializeCalendarInteractions();
        console.log('✅ Astonishing Calendar initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing Astonishing Calendar:', error);
    }
}

// Quantum animations for the calendar
function initializeQuantumAnimations() {
    // Animate letters on hover
    const quantumText = document.querySelector('.quantum-text');
    if (quantumText) {
        const letters = quantumText.querySelectorAll('.letter');
        letters.forEach((letter, index) => {
            letter.addEventListener('mouseenter', () => {
                letter.style.animationDelay = '0s';
                letter.style.animation = 'quantumLetterHover 0.6s ease-in-out';
            });
            
            letter.addEventListener('animationend', () => {
                letter.style.animation = `quantumLetterFloat 3s ease-in-out infinite`;
                letter.style.animationDelay = `${(index + 1) * 0.1}s`;
            });
        });
    }

    // Add quantum particle effects to week headers
    const weekHeaders = document.querySelectorAll('.quantum-week-header');
    weekHeaders.forEach(header => {
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'quantum-particle';
            particle.style.cssText = `
                position: absolute;
                width: 3px;
                height: 3px;
                background: radial-gradient(circle, #06b6d4, transparent);
                border-radius: 50%;
                animation: quantumParticleMove ${3 + Math.random() * 2}s linear infinite;
                animation-delay: ${Math.random() * 2}s;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
            `;
            header.appendChild(particle);
        }
    });
}

// Counter animation for stats
function initializeCounterAnimations() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    // Check if stat elements exist before proceeding
    if (statNumbers.length === 0) {
        console.log('No stat-number elements found, skipping counter animations');
        return;
    }
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -10% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target) {
                const targetValue = parseInt(entry.target.getAttribute('data-target'));
                if (!isNaN(targetValue)) {
                    animateCounter(entry.target, targetValue);
                    observer.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);

    statNumbers.forEach(stat => {
        if (stat && stat.getAttribute('data-target')) {
            observer.observe(stat);
        }
    });
}

function animateCounter(element, target) {
    // Safety check to ensure element exists
    if (!element || element.textContent === undefined) {
        console.warn('animateCounter: Invalid element provided');
        return;
    }
    
    let current = 0;
    const increment = target / 60; // 60 frames for smooth animation
    const timer = setInterval(() => {
        // Additional safety check during animation
        if (!element || element.textContent === undefined) {
            clearInterval(timer);
            return;
        }
        
        current += increment;
        element.textContent = Math.ceil(current);
        
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
            if (element.style) {
                element.style.animation = 'quantumNumberPulse 2s ease-in-out infinite';
            }
        }
    }, 16); // ~60fps
}

// View switcher functionality
function initializeViewSwitcher() {
    const viewBtns = document.querySelectorAll('.view-btn');
    const weeklyView = document.getElementById('weekly-view');
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Add transition effect
            weeklyView.style.transform = 'scale(0.95)';
            weeklyView.style.opacity = '0.7';
            
            setTimeout(() => {
                weeklyView.style.transform = 'scale(1)';
                weeklyView.style.opacity = '1';
                
                // Here you would implement different view modes
                const viewType = btn.getAttribute('data-view');
                console.log(`🔮 Switching to ${viewType} view`);
                
                // Add quantum transition effect
                createQuantumTransition();
            }, 200);
        });
    });
}

// Progress rings animation
function initializeProgressRings() {
    const progressRings = document.querySelectorAll('.progress-circle');
    
    if (progressRings.length === 0) {
        console.log('No progress rings found, skipping progress ring animations');
        return;
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target) {
                try {
                    const circle = entry.target;
                    const progressText = circle.parentElement?.querySelector('.progress-text');
                    
                    if (!progressText) {
                        console.warn('Progress text element not found for progress ring');
                        return;
                    }
                    
                    // Random progress for demo
                    const progress = Math.floor(Math.random() * 100);
                    const circumference = 2 * Math.PI * 25; // radius = 25
                    const offset = circumference - (progress / 100) * circumference;
                    
                    circle.style.strokeDashoffset = offset;
                    
                    // Animate the percentage text
                    animateCounter(progressText, progress);
                    progressText.style.color = progress > 66 ? '#06b6d4' : progress > 33 ? '#f59e0b' : '#ef4444';
                    
                    observer.unobserve(entry.target);
                } catch (error) {
                    console.error('Error animating progress ring:', error);
                }
            }
        });
    }, { threshold: 0.5 });
    
    progressRings.forEach(ring => {
        if (ring) observer.observe(ring);
    });
}

// Event modal functionality
function initializeEventModal() {
    const modal = document.getElementById('event-modal');
    const closeBtn = modal?.querySelector('.modal-close');
    const backdrop = modal?.querySelector('.modal-backdrop');
    
    // Close modal handlers
    [closeBtn, backdrop].forEach(element => {
        element?.addEventListener('click', closeModal);
    });
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.style.display === 'block') {
            closeModal();
        }
    });
    
    function closeModal() {
        if (modal) {
            modal.style.animation = 'modalFadeOut 0.3s ease';
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }
    
    // Add global function to show modal
    window.showEventModal = function(eventData) {
        if (!modal) return;
        
        // Populate modal content
        modal.querySelector('.modal-title').textContent = eventData.title;
        modal.querySelector('.event-time').innerHTML = `<i class="fas fa-clock"></i> ${eventData.time}`;
        modal.querySelector('.event-speaker').innerHTML = `<i class="fas fa-user"></i> ${eventData.speaker}`;
        modal.querySelector('.event-description').textContent = eventData.description;
        
        // Show modal with animation
        modal.style.display = 'block';
        modal.style.animation = 'modalFadeIn 0.3s ease';
    };
}

// Quantum effects
function initializeQuantumEffects() {
    // Add hover effects to calendar slots
    const quantumSlots = document.querySelectorAll('.quantum-slot');
    quantumSlots.forEach(slot => {
        slot.addEventListener('mouseenter', () => {
            createQuantumRipple(slot);
        });
    });
    
    // Add quantum glow to day headers
    const dayHeaders = document.querySelectorAll('.quantum-day-header');
    dayHeaders.forEach(header => {
        header.addEventListener('mouseenter', () => {
            const glow = header.querySelector('.day-glow');
            if (glow) {
                glow.style.animation = 'dayGlow 1s ease-in-out';
            }
        });
    });
}

function createQuantumRipple(element) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${rect.width / 2 - size / 2}px;
        top: ${rect.height / 2 - size / 2}px;
        background: radial-gradient(circle, rgba(6, 182, 212, 0.3), transparent);
        border-radius: 50%;
        transform: scale(0);
        animation: quantumRipple 0.8s ease-out;
        pointer-events: none;
        z-index: 10;
    `;
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 800);
}

function createQuantumTransition() {
    const transition = document.createElement('div');
    transition.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(6, 182, 212, 0.1), transparent);
        z-index: 9999;
        animation: quantumTransitionEffect 0.8s ease-out;
        pointer-events: none;
    `;
    
    document.body.appendChild(transition);
    setTimeout(() => transition.remove(), 800);
}

// Calendar interactions
function initializeCalendarInteractions() {
    // Add click handlers for time slots
    const timeSlots = document.querySelectorAll('.quantum-slot');
    timeSlots.forEach(slot => {
        slot.addEventListener('click', () => {
            const time = slot.getAttribute('data-time');
            const date = slot.closest('.quantum-day')?.getAttribute('data-date');
            
            if (time && date) {
                console.log(`🕐 Clicked slot: ${date} at ${time}`);
                // Here you would show event details or add event functionality
                createQuantumPulse(slot);
            }
        });
    });
    
    // DISABLED parallax effect on week sections - was causing overlap!
    // const weekSections = document.querySelectorAll('.weekly-calendar-section');
    // window.addEventListener('scroll', () => {
    //     const scrolled = window.pageYOffset;
    //     weekSections.forEach((section, index) => {
    //         const rate = scrolled * -0.5 * (index + 1) * 0.1;
    //         section.style.transform = `translateY(${rate}px)`;
    //     });
    // });
}

function createQuantumPulse(element) {
    const pulse = document.createElement('div');
    pulse.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, #06b6d4, transparent);
        border-radius: 50%;
        transform: translate(-50%, -50%) scale(0);
        animation: quantumPulse 1s ease-out;
        pointer-events: none;
        z-index: 10;
    `;
    
    element.style.position = 'relative';
    element.appendChild(pulse);
    
    setTimeout(() => pulse.remove(), 1000);
}

// Add new keyframes to CSS dynamically
function addQuantumKeyframes() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes quantumParticleMove {
            0% { transform: translate(0, 0) scale(1); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) scale(0); opacity: 0; }
        }
        
        @keyframes quantumRipple {
            0% { transform: scale(0); opacity: 0.8; }
            100% { transform: scale(2); opacity: 0; }
        }
        
        @keyframes quantumTransitionEffect {
            0% { opacity: 0; transform: scale(0); }
            50% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(2); }
        }
        
        @keyframes quantumPulse {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(10); opacity: 0; }
        }
        
        @keyframes quantumNumberPulse {
            0%, 100% { text-shadow: 0 0 20px rgba(6, 182, 212, 0.5); }
            50% { text-shadow: 0 0 40px rgba(6, 182, 212, 0.8); }
        }
        
        @keyframes modalFadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('🎯 DOM Content Loaded - Initializing Quantum Calendar...');
        addQuantumKeyframes();
        
        // Small delay to ensure DOM is fully ready
        setTimeout(() => {
            initializeAstonishingCalendar();
        }, 250);
    } catch (error) {
        console.error('❌ Error in DOMContentLoaded handler:', error);
    }
});

    // Initialize Weekly Calendar
    initializeWeeklyCalendar();
    
    // Initialize Astonishing Calendar Features
    setTimeout(() => {
        initializeAstonishingCalendar();
    }, 100);    // Set initial active states
    updateCurrentTime();
    
    // Handle window resize for responsive carousel
    window.addEventListener('resize', () => {
        if (qffCarousel) {
            qffCarousel.updateItemsPerView();
        }
    });
    
    // Trigger initial animations
    setTimeout(() => {
        document.querySelectorAll('.hero-content > *').forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }, 500);
});

// Partnerships Carousel Implementation
function initializePartnershipsCarousel() {
    // Sample partnerships data - this would typically come from a JSON file or API
    const partnerships = [
        {
            name: "IBM Quantum",
            logo: "Fall Fest Graphics/Illustration Exports/IBM Quantum Logo.png",
            description: "Quantum Computing Leader"
        },
        {
            name: "Qiskit",
            logo: "Fall Fest Graphics/Illustration Exports/qiskit logo.svg",
            description: "Open Source Quantum Framework"
        },
    ];

    const track = document.querySelector('.partnerships-track');
    
    if (!track) return;

    // Clear existing content
    track.innerHTML = '';

    // Add partnership items
    partnerships.forEach((partner, index) => {
        const item = document.createElement('div');
        item.className = 'partnership-item';
        
        if (partner.logo) {
            const img = document.createElement('img');
            img.src = partner.logo;
            img.alt = partner.name;
            img.onerror = () => {
                // Fallback to placeholder if image fails to load
                img.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.className = 'partnership-placeholder';
                placeholder.textContent = partner.placeholder || partner.name;
                item.appendChild(placeholder);
            };
            item.appendChild(img);
        } else {
            const placeholder = document.createElement('div');
            placeholder.className = 'partnership-placeholder';
            placeholder.textContent = partner.placeholder || partner.name;
            item.appendChild(placeholder);
        }
        
        // Add hover tooltip
        item.title = partner.description;
        
        track.appendChild(item);
    });

    // Handle "Become a Partner" button
    const partnerBtn = document.querySelector('.hero-cta .btn-secondary:last-child');
    if (partnerBtn && partnerBtn.textContent.includes('Become a Partner')) {
        partnerBtn.addEventListener('click', () => {
            // You can customize this action - could open a modal, redirect to a form, etc.
            alert('Partnership application coming soon! Please contact us at partnerships@globalentanglement.org');
        });
    }
}

// Leaflet World Map Implementation
async function initializeWorldMap() {
    // Initialize the map
    const map = L.map('worldMap', {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 6,
        zoomControl: true,
        scrollWheelZoom: true,
        dragging: true
    });

    // Add dark tile layer with quantum color scheme
    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
        attribution: '© <a href="https://stadiamaps.com/">Stadia Maps</a>',
        maxZoom: 20
    }).addTo(map);

    // QFF Nodes data - will be loaded from JSON
    let qffNodesData = null;
    let qffNodes = [];
    
    // Load QFF nodes data from JSON file
    async function loadQFFNodes() {
        try {
            const response = await fetch('qff-nodes.json');
            qffNodesData = await response.json();
            
            // Process nodes data for map display
            qffNodes = qffNodesData.nodes.map(node => ({
                region: node.region,
                name: node.name,
                coords: [node.coordinates.lat, node.coordinates.lng],
                institution: node.institution,
                city: node.city,
                country: node.country,
                participants: node.participants,
                status: node.status
            }));
            
            return qffNodesData;
        } catch (error) {
            console.error('Error loading QFF nodes data:', error);
            // Fallback to empty data
            qffNodes = [];
            return null;
        }
    }
    
    // Initialize nodes data and then create markers
    await loadQFFNodes();

    // Custom quantum-themed marker icon
    const quantumIcon = L.divIcon({
        className: 'quantum-marker',
        html: `
            <div class="quantum-marker-inner">
                <div class="quantum-pulse"></div>
                <div class="quantum-dot"></div>
            </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    // Add markers and popups
    qffNodes.forEach(node => {
        const marker = L.marker(node.coords, { icon: quantumIcon }).addTo(map);
        
        const popupContent = `
            <div class="quantum-popup">
                <h3 class="popup-title">${node.name}</h3>
                <div class="popup-info">
                    <p><strong>Institution:</strong> ${node.institution}</p>
                    <p><strong>City:</strong> ${node.city}</p>
                    <p><strong>Country:</strong> ${node.country}</p>
                </div>
                <div class="popup-stats">
                    <div class="popup-stat">
                        <span class="stat-number">${node.participants}</span>
                        <span class="stat-label">Participants</span>
                    </div>
                    <div class="popup-stat">
                        <span class="stat-label">Status: ${node.status}</span>
                    </div>
                </div>
            </div>
        `;
        
        marker.bindPopup(popupContent);
        
        // Update corresponding node item when marker is clicked
        marker.on('click', () => {
            updateNodeSelection(node.region);
        });
    });

    // Store map reference for potential future use
    window.qffMap = map;
}

// Update node selection
function updateNodeSelection(region) {
    // Remove active class from all items
    document.querySelectorAll('.node-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to selected region
    const selectedItem = document.querySelector(`[data-region="${region}"]`);
    if (selectedItem) {
        selectedItem.classList.add('active');
    }
}

// Update nodes sidebar with loaded data
async function updateNodesSidebar() {
    try {
        const response = await fetch('qff-nodes.json');
        const data = await response.json();
        
        const nodesList = document.querySelector('.nodes-list');
        if (!nodesList) return;
        
        // Clear existing content
        nodesList.innerHTML = '';
        
        // Group nodes by region
        const regionGroups = {};
        data.nodes.forEach(node => {
            if (!regionGroups[node.region]) {
                regionGroups[node.region] = [];
            }
            regionGroups[node.region].push(node);
        });
        
        // Create node items for each region
        Object.keys(data.regions).forEach((regionKey, index) => {
            const region = data.regions[regionKey];
            const nodesInRegion = regionGroups[regionKey] || [];
            
            const nodeItem = document.createElement('div');
            nodeItem.className = `node-item ${index === 0 ? 'active' : ''}`;
            nodeItem.setAttribute('data-region', regionKey);
            
            nodeItem.innerHTML = `
                <h3>${region.name}</h3>
                <p>${region.nodeCount} active nodes</p>
                <span class="node-count">${region.totalParticipants} participants</span>
                <div class="node-details">
                    ${nodesInRegion.map(node => `
                        <div class="node-detail">
                            <strong>${node.name}</strong> - ${node.institution}
                        </div>
                    `).join('')}
                </div>
            `;
            
            // Add click handler
            nodeItem.addEventListener('click', () => {
                updateNodeSelection(regionKey);
                
                // Pan map to first node in region if available
                if (nodesInRegion.length > 0 && window.qffMap) {
                    const firstNode = nodesInRegion[0];
                    window.qffMap.setView([firstNode.coordinates.lat, firstNode.coordinates.lng], 4);
                }
            });
            
            nodesList.appendChild(nodeItem);
        });
        
    } catch (error) {
        console.error('Error updating nodes sidebar:', error);
    }
}

// Weekly Calendar functionality for MadQFF'25
let weeklyCalendarEvents = {};

// Parse and load events from calendar.ics
async function loadCalendarFromICS() {
    try {
        console.log('📅 Loading calendar from ICS file...');
        const response = await fetch('calendar.ics');
        const icsContent = await response.text();
        weeklyCalendarEvents = parseICSContent(icsContent);
        populateWeeklyCalendar();
        console.log('📅 SUCCESS: Events loaded from calendar.ics:', weeklyCalendarEvents);
    } catch (error) {
        console.error('📅 ERROR loading calendar.ics:', error);
        // Fall back to hardcoded events if ICS file fails
        loadHardcodedEvents();
    }
}

function parseICSContent(icsContent) {
    const events = {};
    const eventBlocks = icsContent.split('BEGIN:VEVENT').slice(1);
    
    eventBlocks.forEach(eventBlock => {
        const lines = eventBlock.split('\n');
        let event = {};
        
        lines.forEach(line => {
            line = line.trim();
            if (line.startsWith('DTSTART:')) {
                const dateTimeStr = line.replace('DTSTART:', '');
                if (dateTimeStr.includes('T') && dateTimeStr.includes('Z')) {
                    // Parse: 20251027T150000Z -> 2025-10-27 15:00 UTC
                    const dateStr = dateTimeStr.substring(0, 8); // 20251027
                    const timeStr = dateTimeStr.substring(9, 15); // 150000
                    
                    const year = dateStr.substring(0, 4);
                    const month = dateStr.substring(4, 6);
                    const day = dateStr.substring(6, 8);
                    event.date = `${year}-${month}-${day}`;
                    
                    const utcHour = parseInt(timeStr.substring(0, 2)); // 15 = 3PM UTC
                    // Convert UTC to Madrid time (UTC+1): 15 UTC = 16 Madrid (4PM)
                    const madridHour = utcHour + 1;
                    event.startHour = madridHour;
                    
                    console.log(`📅 DTSTART parsed: ${event.date} at ${utcHour}:00 UTC = ${madridHour}:00 Madrid`);
                } else if (dateTimeStr.includes('T')) {
                    // Local time without Z
                    const date = new Date(dateTimeStr.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/, '$1-$2-$3T$4:$5:$6'));
                    event.date = formatDateForEvent(date);
                    event.startHour = date.getHours();
                } else {
                    // All day event - skip for now
                    return;
                }
            }
            if (line.startsWith('DTEND:')) {
                const dateTimeStr = line.replace('DTEND:', '');
                if (dateTimeStr.includes('T') && dateTimeStr.includes('Z')) {
                    // Parse: 20251027T170000Z -> 17:00 UTC = 18:00 Madrid
                    const timeStr = dateTimeStr.substring(9, 15); // 170000
                    const utcHour = parseInt(timeStr.substring(0, 2)); // 17 = 5PM UTC
                    const madridHour = utcHour + 1; // 18 = 6PM Madrid
                    event.endHour = madridHour;
                    
                    console.log(`📅 DTEND parsed: ${utcHour}:00 UTC = ${madridHour}:00 Madrid`);
                }
            }
            if (line.startsWith('SUMMARY:')) {
                event.title = line.replace('SUMMARY:', '').replace(/\\,/g, ',');
            }
        });
        
        // Skip events that contain "NOTSURE" - they are not confirmed
        if (event.title && event.title.includes('NOTSURE')) {
            console.log(`📅 Skipping NOTSURE event: ${event.title}`);
            return; // Skip this event completely
        }
        
        if (event.date && event.title && event.startHour !== undefined) {
            if (!events[event.date]) {
                events[event.date] = {};
            }
            
            // Calculate duration in hours
            const durationHours = event.endHour ? (event.endHour - event.startHour) : 1;
            
            // Extract speaker and company from title using format: [Speaker] : [Company]
            let speaker = '';
            let title = event.title;
            
            if (event.title.includes(' : ')) {
                const parts = event.title.split(' : ');
                if (parts.length >= 2) {
                    speaker = parts[0];                    // [Speaker]
                    title = parts.slice(1).join(' : ');   // [Company] (or [Company] : [Additional Info])
                }
            } else if (event.title.includes(' - ')) {
                // Fallback to dash format for backward compatibility
                const parts = event.title.split(' - ');
                if (parts.length >= 2) {
                    speaker = parts[0];
                    title = parts.slice(1).join(' - ');
                }
            }
            
            // Store event with actual duration
            const eventData = {
                title: title,
                speaker: speaker,
                startHour: event.startHour,
                endHour: event.endHour || (event.startHour + 1),
                duration: durationHours
            };
            
            events[event.date][event.startHour.toString()] = eventData;
            
            console.log(`📅 Added event: ${event.date} at ${event.startHour}:00-${eventData.endHour}:00 (${durationHours}h) - ${title} (${speaker})`);
        }
    });
    
    return events;
}

function formatDateForEvent(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatTimeForEvent(date) {
    // Convert UTC to local time (Madrid timezone)
    const madridOffset = 1; // UTC+1 (or UTC+2 during daylight saving)
    const localDate = new Date(date.getTime() + madridOffset * 60 * 60 * 1000);
    const hours = localDate.getUTCHours();
    const minutes = localDate.getUTCMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function loadHardcodedEvents() {
    console.log('📅 Loading hardcoded events...');
    weeklyCalendarEvents = {
        // Week 1: Oct 27-31 (Madrid time: UTC+1, so 150000Z = 4PM Madrid, 160000Z = 5PM Madrid, etc.)
        '2025-10-27': {
            '16': { title: 'Quantum Computing 101', speaker: 'Enrique Anguiano-Vara' }, // 150000Z UTC = 4PM Madrid
            '17': { title: 'Hands-on Qiskit!', speaker: '' }, // 160000Z UTC = 5PM Madrid
            '18': { title: 'Qiskit notebook pt.1', speaker: '' } // 170000Z UTC = 6PM Madrid
        },
        '2025-10-28': {
            '16': { title: 'Must-know QC Algorithms', speaker: 'Enrique Anguiano-Vara' } // 150000Z-170000Z = 4-6PM Madrid
        },
        '2025-10-29': {
            '16': { title: 'Quantum Chemistry', speaker: 'Enrique Anguiano-Vara' } // 150000Z-170000Z = 4-6PM Madrid
        },
        '2025-10-30': {
            '16': { title: 'QML Introduction', speaker: 'Claudia Zendejas-Morales' } // 150000Z-170000Z = 4-6PM Madrid
        },
        '2025-10-31': {
            '16': { title: 'Types of quantum computers', speaker: '' }, // 150000Z UTC = 4PM Madrid
            '17': { title: 'Quantum Photonics Introduction', speaker: '' } // 160000Z UTC = 5PM Madrid
        },
        
        // Week 2: Nov 3-7
        '2025-11-03': {
            '16': { title: 'TBA', speaker: 'Victor Onofre (Pasqal)' }, // 150000Z UTC = 4PM Madrid
            '17': { title: 'TBA', speaker: 'Oliver Luscombe Nørregaard (Sparrow Quantum)' }, // 160000Z UTC = 5PM Madrid
            '18': { title: 'Full-stack photonic quantum computing', speaker: 'Alexia Salavrakos (Quandela)' }, // 170000Z UTC = 6PM Madrid
            '19': { title: 'EXTRA TIME', speaker: '' } // 180000Z UTC = 7PM Madrid
        },
        '2025-11-04': {
            '16': { title: 'MadQCI : UPM', speaker: 'Martín Ayuso (UPM)' }, // 150000Z UTC = 4PM Madrid
            '17': { title: 'MadQCI to Reality', speaker: 'TBA (IMDEA Software)' }, // 160000Z UTC = 5PM Madrid
            '18': { title: 'TBA', speaker: 'Farzam Nosrati (IMDEA Software)' }, // 170000Z UTC = 6PM Madrid
            '19': { title: 'EXTRA TIME', speaker: '' } // 180000Z UTC = 7PM Madrid
        },
        '2025-11-05': {
            '16': { title: 'EXTRA TIME', speaker: '' }, // 150000Z UTC = 4PM Madrid
            '17': { title: 'Certified many-body physics', speaker: 'Antonio Acín (ICFO)' }, // 160000Z UTC = 5PM Madrid
            '18': { title: 'TBA', speaker: 'Helen Urgelles Pérez (UPV)' }, // 170000Z UTC = 6PM Madrid
            '19': { title: 'EXTRA TIME', speaker: '' } // 180000Z UTC = 7PM Madrid
        },
        '2025-11-06': {
            '16': { title: 'QML Research at ICMM-UAM (TBA)', speaker: 'Yue Ban (ICMM-UAM)' }, // 150000Z UTC = 4PM Madrid
            '17': { title: 'QML Research at ICMM-UAM (TBA)', speaker: 'Xi Chen (ICMM-UAM)' }, // 160000Z UTC = 5PM Madrid
            '18': { title: 'Real-Time Dynamics in a (2+1)-D Gauge Theory', speaker: 'César Benito (IFF-CSIC)' }, // 170000Z UTC = 6PM Madrid
            '19': { title: 'EXTRA TIME', speaker: '' } // 180000Z UTC = 7PM Madrid
        },
        '2025-11-07': {
            '10': { title: 'TBA', speaker: 'Román Orús (Multiverse Computing)' }, // 090000Z UTC = 10AM Madrid
            '16': { title: 'QWorld', speaker: 'Claudia Zendejas-Morales' }, // 150000Z UTC = 4PM Madrid
            '16.5': { title: 'CPrA: the Spanish QCousin', speaker: '' }, // 153000Z UTC = 4:30PM Madrid
            '17': { title: 'IBM Quantum', speaker: 'Ismael Faro (IBM Quantum)' }, // 160000Z UTC = 5PM Madrid
            '18': { title: 'Protein folding', speaker: 'Alejandro Gómez Cadavid (Quantum Kipu)' }, // 170000Z UTC = 6PM Madrid
            '19': { title: 'CPrA : Hackathon Introduction', speaker: '' } // 180000Z UTC = 7PM Madrid
        }
    };
    populateWeeklyCalendar();
    console.log('📅 Using hardcoded events for weekly calendar');
}

function addSeparatorsToWeek(week, weekData, dayNames) {
    const weekSection = document.querySelector(`.${week.prefix}-quantum`);
    if (!weekSection) return;
    
    const weeklyGrid = weekSection.querySelector('.weekly-grid');
    if (!weeklyGrid) return;
    
    // Add separators to each day column
    week.dates.forEach((date, dayIndex) => {
        const dayColumn = weeklyGrid.querySelector(`[data-date="${date}"]`);
        if (!dayColumn) return;
        
        weekData.separators.forEach(separator => {
            // Check if separator already exists
            const existingSeparator = dayColumn.querySelector(`[data-gap="${separator.id}"]`);
            if (existingSeparator) return;
            
            // Create separator element
            const separatorElement = document.createElement('div');
            separatorElement.className = 'time-separator';
            separatorElement.setAttribute('data-gap', separator.id);
            separatorElement.innerHTML = `
                <div class="separator-line"></div>
                <div class="separator-label">
                    ${separator.label}
                    <br><span class="separator-time">${separator.timeRange}</span>
                    <br><span class="separator-resume">${separator.resumeTime}</span>
                </div>
            `;
            
            // Insert separator in the correct position
            const dayHeader = dayColumn.querySelector('.day-header');
            const existingSlots = dayColumn.querySelectorAll('.hour-slot');
            
            // Find where to insert the separator based on hour order
            let insertAfterElement = dayHeader;
            
            existingSlots.forEach(slot => {
                const slotHour = parseInt(slot.id.split('-').pop());
                if (slotHour < separator.nextActivityHour) {
                    insertAfterElement = slot;
                }
            });
            
            // Insert after the determined element
            insertAfterElement.parentNode.insertBefore(separatorElement, insertAfterElement.nextSibling);
        });
    });
}

function generateCalendarHTML(week, weekData, dayNames) {
    // Don't regenerate HTML completely - instead, just ensure proper structure exists
    // The existing HTML already has the correct week classes that we need to preserve
    console.log(`📅 Preserving existing calendar structure for ${week.prefix} to maintain styling`);
    
    // If we need dynamic hours, we'll handle them in populateWeeklyCalendar
    // This function now just validates that the week structure exists
    const weekSection = document.querySelector(`.${week.prefix}-quantum`);
    if (!weekSection) {
        console.warn(`📅 Week section not found: ${week.prefix}-quantum`);
        return;
    }
    
    const weeklyGrid = weekSection.querySelector('.weekly-grid');
    if (!weeklyGrid) {
        console.warn(`📅 Weekly grid not found in: ${week.prefix}`);
        return;
    }
    
    console.log(`📅 Week ${week.prefix} structure validated and ready`);
}

function populateWeeklyCalendar() {
    console.log('📅 Populating weekly calendar with events:', weeklyCalendarEvents);
    
    const weekConfigs = [
        { prefix: 'week1', dates: ['2025-10-27', '2025-10-28', '2025-10-29', '2025-10-30', '2025-10-31'] },
        { prefix: 'week2', dates: ['2025-11-03', '2025-11-04', '2025-11-05', '2025-11-06', '2025-11-07'] },
        { prefix: 'week3', dates: ['2025-11-10', '2025-11-11', '2025-11-12', '2025-11-13', '2025-11-14'] }
    ];
    
    const dayNames = ['mon', 'tue', 'wed', 'thu', 'fri'];
    
    // Calculate dynamic hours for each week based on actual activities
    const getWeekHours = (weekDates) => {
        let allHours = new Set();
        
        // Collect all hours that have activities
        weekDates.forEach(date => {
            if (weeklyCalendarEvents[date]) {
                Object.keys(weeklyCalendarEvents[date]).forEach(hour => {
                    const hourNum = parseInt(hour);
                    const activity = weeklyCalendarEvents[date][hour];
                    allHours.add(hourNum);
                    // Add all hours covered by multi-hour activities
                    const endHour = activity.endHour || (hourNum + 1);
                    for (let h = hourNum; h < endHour; h++) {
                        allHours.add(h);
                    }
                });
            }
        });
        
        if (allHours.size === 0) {
            return { hours: ['16', '17', '18'], separators: [] }; // default fallback
        }
        
        // Convert to sorted array
        const sortedHours = Array.from(allHours).sort((a, b) => a - b);
        const minHour = sortedHours[0];
        const maxHour = sortedHours[sortedHours.length - 1];
        
        // Generate hours array with separators for gaps > 1 hour
        const hoursWithSeparators = [];
        const separators = [];
        
        let currentHour = minHour;
        
        while (currentHour <= maxHour) {
            if (allHours.has(currentHour)) {
                hoursWithSeparators.push(currentHour.toString());
                currentHour++;
            } else {
                // Find the end of the gap
                let gapStart = currentHour;
                let gapEnd = currentHour;
                while (gapEnd <= maxHour && !allHours.has(gapEnd)) {
                    gapEnd++;
                }
                
                const gapSize = gapEnd - gapStart;
                
                // Only add separator for gaps > 1 hour
                if (gapSize > 1 && gapEnd <= maxHour) {
                    const separatorId = `gap-${gapStart}-${gapEnd - 1}`;
                    hoursWithSeparators.push(separatorId);
                    separators.push({
                        id: separatorId,
                        startHour: gapStart,
                        endHour: gapEnd - 1,
                        nextActivityHour: gapEnd,
                        label: `No activities`,
                        timeRange: `${gapStart.toString().padStart(2, '0')}:00 - ${gapEnd.toString().padStart(2, '0')}:00`,
                        resumeTime: `Activities resume at ${gapEnd.toString().padStart(2, '0')}:00`
                    });
                }
                
                currentHour = gapEnd;
            }
        }
        
        console.log(`📅 Week hours with separators:`, hoursWithSeparators);
        console.log(`📅 Separators:`, separators);
        return { hours: hoursWithSeparators, separators };
    };
    
    // Generate dynamic calendar HTML for each week
    weekConfigs.forEach(week => {
        const weekData = getWeekHours(week.dates);
        generateCalendarHTML(week, weekData, dayNames);
    });
    
    // Process activities for each week with dynamic hours
    weekConfigs.forEach(week => {
        const weekData = getWeekHours(week.dates);
        const weekHours = weekData.hours.filter(item => !item.startsWith('gap-')); // Only actual hours, not separators
        
        // Add separators to the calendar if needed
        if (weekData.separators.length > 0) {
            addSeparatorsToWeek(week, weekData, dayNames);
        }
        
        // Reset containers
        week.dates.forEach((date, dayIndex) => {
            weekHours.forEach(hour => {
                const containerId = `${week.prefix}-${dayNames[dayIndex]}-${hour}`;
                const container = document.getElementById(containerId);
                if (container) {
                    container.style.display = 'block';
                    container.style.gridRow = 'span 1';
                    container.style.minHeight = '120px';
                    container.classList.remove('multi-hour-event');
                    container.removeAttribute('data-occupied');
                }
            });
        });
        
        // Populate activities
        week.dates.forEach((date, dayIndex) => {
            weekHours.forEach(hour => {
                const containerId = `${week.prefix}-${dayNames[dayIndex]}-${hour}`;
                const container = document.getElementById(containerId);
                
                if (container) {
                    const dayEvents = weeklyCalendarEvents[date] || {};
                    const hourEvent = dayEvents[hour];
                    
                    if (hourEvent) {
                        console.log(`📅 Adding event to ${containerId}:`, hourEvent);
                        
                        // Use the actual duration from the calendar.ics file
                        const eventDuration = hourEvent.duration || 1;
                        
                        let eventHtml = renderActivityForHour(hourEvent);
                        
                        // Apply multi-hour styling if event lasts more than 1 hour
                        if (eventDuration > 1 && eventDuration <= 3) {
                            container.style.gridRow = `span ${eventDuration}`;
                            container.style.minHeight = `${120 * eventDuration}px`;
                            container.classList.add('multi-hour-event');
                            
                            // Hide subsequent hour containers to avoid overlap
                            for (let i = 1; i < eventDuration; i++) {
                                const nextHour = String(parseInt(hour) + i);
                                const nextContainerId = `${week.prefix}-${dayNames[dayIndex]}-${nextHour}`;
                                const nextContainer = document.getElementById(nextContainerId);
                                if (nextContainer && weekHours.includes(nextHour)) {
                                    nextContainer.style.display = 'none';
                                    nextContainer.setAttribute('data-occupied', 'true');
                                }
                            }
                        }
                        
                        container.innerHTML = eventHtml;
                        container.style.display = 'block';
                        container.style.minHeight = `${120 * eventDuration}px`;
                    } else {
                        // Check if this slot is occupied by a multi-hour event
                        if (!container.getAttribute('data-occupied')) {
                            // Leave all weeks empty when no activity
                            container.innerHTML = '';
                            container.style.backgroundColor = 'transparent';
                            container.style.border = 'none';
                            container.style.display = 'block';
                            container.style.minHeight = '120px';
                        }
                    }
                } else {
                    console.warn(`📅 Container not found: ${containerId}`);
                }
            });
        });
    });
}

function renderActivityForHour(activity) {
    if (!activity) {
        return '<div class="no-activity">—</div>';
    }
    
    const speakerText = activity.speaker ? `<div class="activity-speaker">${activity.speaker}</div>` : '';
    
    // Calculate Spanish time (UTC+1) display
    let timeText = '';
    if (activity.startHour !== undefined) {
        const startTime = `${activity.startHour.toString().padStart(2, '0')}:00`;
        const endHour = activity.endHour || (activity.startHour + 1);
        const endTime = `${endHour.toString().padStart(2, '0')}:00`;
        timeText = `${startTime} - ${endTime}`;
    }
    
    const timeDisplay = timeText ? `<div class="activity-time">${timeText}</div>` : '';
    
    // Check for special activity types - prioritize intro/outro/welcome over challenges/hackathons
    const titleLower = activity.title.toLowerCase();
    
    // More explicit detection
    const hasChallenge = titleLower.indexOf('challenge') !== -1;
    const hasHackathon = titleLower.indexOf('hackathon') !== -1;
    const hasOutro = titleLower.indexOf('outro') !== -1;
    const hasWelcome = titleLower.indexOf('welcome') !== -1;
    const hasIntro = titleLower.indexOf(' intro ') !== -1 || titleLower.startsWith('intro ') || titleLower.endsWith(' intro');
    
    // Explicit IBM challenges
    const isIBMChallenge = titleLower.indexOf('ibm quantum') !== -1 && (hasChallenge || titleLower.indexOf('qiskit') !== -1);
    
    const isIntroOutroActivity = hasOutro || hasWelcome || hasIntro;
    const isGoldActivity = (hasChallenge || hasHackathon || isIBMChallenge) && !isIntroOutroActivity;
    
    // Debug logging
    console.log(`Activity: "${activity.title}"`);
    console.log(`  - hasChallenge: ${hasChallenge}, hasHackathon: ${hasHackathon}, isIBMChallenge: ${isIBMChallenge}`);
    console.log(`  - isGoldActivity: ${isGoldActivity}, isIntroOutroActivity: ${isIntroOutroActivity}`);
    
    let specialClass = '';
    if (isIntroOutroActivity) {
        specialClass = ' green-activity';
        console.log(`  - Applied GREEN class`);
    } else if (isGoldActivity) {
        specialClass = ' gold-activity';
        console.log(`  - Applied GOLD class`);
    } else {
        console.log(`  - Applied NO special class`);
    }
    
    return `
        <div class="activity${specialClass}">
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                ${speakerText}
            </div>
            ${timeDisplay}
        </div>
    `;
}

function initializeWeeklyCalendar() {
    console.log('📅 Starting weekly calendar initialization...');
    // Add a small delay to ensure DOM elements are fully rendered
    setTimeout(() => {
        loadCalendarFromICS();
    }, 100);
}

// Initialize weekly calendar functionality on page load
console.log('📅 Weekly calendar system ready for MadQFF\'25');


