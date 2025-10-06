// === ENHANCED SITE INITIALIZATION ===
class NeoDesignApp {
    constructor() {
        this.isSoundEnabled = true;
        this.isLoading = true;
        this.mouse = { x: 0, y: 0 };
        this.init();
    }

    async init() {
        await this.preloadAssets();
        this.setupEventListeners();
        this.init3DBackground();
        this.initCustomCursor();
        this.initAnimations();
        this.initVideoPlayers();
        this.hideLoadingScreen();
    }

    async preloadAssets() {
        // Preload critical assets
        const preloadPromises = [
            this.loadImage('https://images.unsplash.com/photo-1558655146-9f40138edfeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'),
            this.loadImage('https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80')
        ];

        await Promise.all(preloadPromises);
    }

    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = src;
        });
    }

    setupEventListeners() {
        // Mouse movement tracking
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.updateCursorPosition();
            this.updateMagneticElements();
        });

        // Scroll effects
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        // Sound toggle
        document.getElementById('soundToggle')?.addEventListener('click', () => {
            this.toggleSound();
        });

        // Magnetic buttons
        document.querySelectorAll('.btn--magnetic, .nav__item--magnetic').forEach(element => {
            element.addEventListener('mouseenter', () => this.handleMagneticEnter(element));
            element.addEventListener('mouseleave', () => this.handleMagneticLeave(element));
        });

        // 3D card interactions
        document.querySelectorAll('.feature-3d-card').forEach(card => {
            this.init3DCard(card);
        });
    }

    // === 3D BACKGROUND WITH THREE.JS ===
    init3DBackground() {
        if (typeof THREE === 'undefined') return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            canvas: document.getElementById('heroCanvas'),
            alpha: true,
            antialias: true 
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 1500;
        
        const posArray = new Float32Array(particlesCount * 3);
        const colorArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 10;
            colorArray[i] = Math.random();
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.02,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        camera.position.z = 2;

        // Animation
        const clock = new THREE.Clock();

        const animate = () => {
            requestAnimationFrame(animate);

            const elapsedTime = clock.getElapsedTime();

            particlesMesh.rotation.y = elapsedTime * 0.1;
            particlesMesh.rotation.x = elapsedTime * 0.05;

            particlesMesh.position.x = Math.sin(elapsedTime * 0.3) * 0.5;
            particlesMesh.position.y = Math.cos(elapsedTime * 0.2) * 0.3;

            renderer.render(scene, camera);
        };

        animate();

        // Handle resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // === CUSTOM CURSOR ===
    initCustomCursor() {
        this.cursor = document.getElementById('cursor');
        
        document.addEventListener('mousemove', (e) => {
            if (this.cursor) {
                this.cursor.style.left = e.clientX + 'px';
                this.cursor.style.top = e.clientY + 'px';
            }
        });

        // Cursor effects on interactive elements
        const interactiveElements = document.querySelectorAll('button, a, [data-modal-open], .video-card, .feature-3d-card');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (this.cursor) {
                    this.cursor.style.transform = 'scale(2)';
                    this.cursor.style.background = 'var(--color-neon-pink)';
                }
                this.playSound('hover');
            });

            el.addEventListener('mouseleave', () => {
                if (this.cursor) {
                    this.cursor.style.transform = 'scale(1)';
                    this.cursor.style.background = 'var(--color-neon-blue)';
                }
            });
        });
    }

    // === MAGNETIC EFFECTS ===
    updateMagneticElements() {
        const magneticElements = document.querySelectorAll('.btn--magnetic, .nav__item--magnetic');
        
        magneticElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const distanceX = this.mouse.x - centerX;
            const distanceY = this.mouse.y - centerY;
            
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            const maxDistance = 100;
            
            if (distance < maxDistance) {
                const power = 1 - (distance / maxDistance);
                const moveX = distanceX * power * 0.1;
                const moveY = distanceY * power * 0.1;
                
                element.style.transform = `translate(${moveX}px, ${moveY}px)`;
            } else {
                element.style.transform = 'translate(0, 0)';
            }
        });
    }

    handleMagneticEnter(element) {
        element.style.transition = 'transform 0.3s cubic-bezier(0.23, 1, 0.320, 1)';
    }

    handleMagneticLeave(element) {
        element.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.320, 1)';
        element.style.transform = 'translate(0, 0)';
    }

    // === 3D CARD INTERACTIONS ===
    init3DCard(card) {
        card.addEventListener('mousemove', (e) => {
            if (!card.classList.contains('feature-3d-card')) return;
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = (x - centerX) / 25;
            const rotateX = (centerY - y) / 25;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            card.style.transition = 'transform 0.5s ease';
        });
    }

    // === ANIMATIONS AND GSAP ===
    initAnimations() {
        // Typing effect
        this.initTypingEffect();
        
        // Counter animations
        this.initCounters();
        
        // Scroll animations
        this.initScrollAnimations();
        
        // Particle effects
        this.initParticles();
    }

    initTypingEffect() {
        const typingElement = document.getElementById('typingText');
        if (!typingElement) return;

        const texts = [
            "Превращаем сложные идеи в элегантные digital-решения",
            "Создаем инновационные пользовательские интерфейсы", 
            "Разрабатываем будущее веб-технологий",
            "Преодолеваем границы digital-дизайна"
        ];

        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const type = () => {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }

            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                setTimeout(type, 2000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                setTimeout(type, 500);
            } else {
                setTimeout(type, isDeleting ? 50 : 100);
            }
        };

        setTimeout(type, 1000);
    }

    initCounters() {
        const counters = document.querySelectorAll('[data-count]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            // Start counter when element is in viewport
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            });

            observer.observe(counter);
        });
    }

    initScrollAnimations() {
        // Animate elements on scroll
        const animatedElements = document.querySelectorAll('.fade-in, .feature-3d-card, .project-3d-card');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Stagger animation for cards
                    if (entry.target.classList.contains('feature-3d-card')) {
                        const delay = Array.from(animatedElements).indexOf(entry.target) * 100;
                        entry.target.style.animationDelay = `${delay}ms`;
                    }
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => observer.observe(el));
    }

    initParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;

        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: var(--color-neon-blue);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: floatParticle ${5 + Math.random() * 10}s infinite linear;
                animation-delay: ${Math.random() * 5}s;
            `;
            
            particlesContainer.appendChild(particle);
        }

        // Add CSS for particle animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatParticle {
                0% { transform: translateY(0) translateX(0); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // === VIDEO PLAYERS ===
    initVideoPlayers() {
        // Video modal functionality
        const videoTriggers = document.querySelectorAll('[data-video]');
        
        videoTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const videoUrl = trigger.getAttribute('data-video');
                this.openVideoModal(videoUrl);
            });
        });

        // Project modal
        const projectButtons = document.querySelectorAll('[data-project]');
        projectButtons.forEach(button => {
            button.addEventListener('click', () => {
                const projectId = button.getAttribute('data-project');
                this.openProjectModal(projectId);
            });
        });
    }

    openVideoModal(videoUrl) {
        const modal = document.getElementById('demoModal');
        const videoIframe = modal.querySelector('.modal__video');
        
        videoIframe.src = videoUrl;
        modal.showModal();
        
        this.playSound('click');
    }

    openProjectModal(projectId) {
        // In a real app, you would fetch project data
        const modal = document.getElementById('projectModal');
        const content = document.getElementById('projectModalContent');
        
        content.innerHTML = `
            <div class="project-detail">
                <h2>Детали проекта #${projectId}</h2>
                <p>Здесь будет подробная информация о проекте...</p>
            </div>
        `;
        
        modal.showModal();
        this.playSound('click');
    }

    // === SOUND SYSTEM ===
    playSound(type) {
        if (!this.isSoundEnabled) return;

        const sound = document.getElementById(type === 'hover' ? 'hoverSound' : 'clickSound');
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log('Audio play failed:', e));
        }
    }

    toggleSound() {
        this.isSoundEnabled = !this.isSoundEnabled;
        const toggle = document.getElementById('soundToggle');
        const icon = toggle.querySelector('.sound-toggle__icon');
        
        icon.textContent = this.isSoundEnabled ? '🔊' : '🔇';
        toggle.classList.toggle('sound-toggle--muted', !this.isSoundEnabled);
        
        this.playSound('click');
    }

    // === UTILITY METHODS ===
    updateCursorPosition() {
        // Additional cursor updates can go here
    }

    handleScroll() {
        const header = document.querySelector('.header--enhanced');
        if (window.scrollY > 100) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    }

hideLoadingScreen() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.visibility = 'hidden';
            document.body.classList.add('loaded');
        }
    }, 2000); // Уменьши время загрузки
}

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
    // Check for WebGL support
    if (!window.WebGLRenderingContext) {
        console.warn('WebGL not supported - falling back to basic features');
    }

    // Initialize the app
    window.neoSite = new NeoDesignApp();

    // Register service worker for PWA capabilities
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(console.error);
    }

    // Add beforeunload event for smooth exit
    window.addEventListener('beforeunload', () => {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease';
    });
});

// === PERFORMANCE OPTIMIZATIONS ===
// Throttle scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
            scrollTimeout = null;
            // Handle scroll actions
        }, 16);
    }
});

// Debounce resize events
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Handle resize actions
    }, 250);
});

// === ERROR HANDLING ===
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

// Unhandled promise rejection
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// Emergency fallback - hide loading screen no matter what
setTimeout(() => {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen && loadingScreen.style.display !== 'none') {
        console.log('🆘 Emergency: Force hiding loading screen');
        loadingScreen.style.display = 'none';
        document.body.classList.add('loaded');
    }
}, 5000);
