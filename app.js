// Blueprint Animation Canvas
class BlueprintAnimation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.lines = [];
        this.animationFrame = 0;
        
        this.resize();
        this.createBlueprint();
        
        window.addEventListener('resize', () => {
            this.resize();
            this.createBlueprint();
        });
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }
    
    createBlueprint() {
        this.lines = [];
        
        // Building outline - main structure
        const buildingWidth = Math.min(400, this.canvas.width * 0.4);
        const buildingHeight = Math.min(300, this.canvas.height * 0.3);
        const startX = this.centerX - buildingWidth / 2;
        const startY = this.centerY - buildingHeight / 2;
        
        // Main building rectangle
        this.lines.push(
            { x1: startX, y1: startY, x2: startX + buildingWidth, y2: startY, progress: 0, speed: 0.015 },
            { x1: startX + buildingWidth, y1: startY, x2: startX + buildingWidth, y2: startY + buildingHeight, progress: 0, speed: 0.015 },
            { x1: startX + buildingWidth, y1: startY + buildingHeight, x2: startX, y2: startY + buildingHeight, progress: 0, speed: 0.015 },
            { x1: startX, y1: startY + buildingHeight, x2: startX, y2: startY, progress: 0, speed: 0.015 }
        );
        
        // Roof triangle
        const roofHeight = 80;
        this.lines.push(
            { x1: startX, y1: startY, x2: this.centerX, y2: startY - roofHeight, progress: 0, speed: 0.012 },
            { x1: this.centerX, y1: startY - roofHeight, x2: startX + buildingWidth, y2: startY, progress: 0, speed: 0.012 }
        );
        
        // Windows
        const windowWidth = 60;
        const windowHeight = 80;
        const windowSpacing = 40;
        const numWindows = 3;
        const totalWindowWidth = numWindows * windowWidth + (numWindows - 1) * windowSpacing;
        const windowStartX = this.centerX - totalWindowWidth / 2;
        
        for (let i = 0; i < numWindows; i++) {
            const wx = windowStartX + i * (windowWidth + windowSpacing);
            const wy = startY + 60;
            
            this.lines.push(
                { x1: wx, y1: wy, x2: wx + windowWidth, y2: wy, progress: 0, speed: 0.02 },
                { x1: wx + windowWidth, y1: wy, x2: wx + windowWidth, y2: wy + windowHeight, progress: 0, speed: 0.02 },
                { x1: wx + windowWidth, y1: wy + windowHeight, x2: wx, y2: wy + windowHeight, progress: 0, speed: 0.02 },
                { x1: wx, y1: wy + windowHeight, x2: wx, y2: wy, progress: 0, speed: 0.02 },
                { x1: wx + windowWidth / 2, y1: wy, x2: wx + windowWidth / 2, y2: wy + windowHeight, progress: 0, speed: 0.02 },
                { x1: wx, y1: wy + windowHeight / 2, x2: wx + windowWidth, y2: wy + windowHeight / 2, progress: 0, speed: 0.02 }
            );
        }
        
        // Door
        const doorWidth = 80;
        const doorHeight = 120;
        const doorX = this.centerX - doorWidth / 2;
        const doorY = startY + buildingHeight - doorHeight;
        
        this.lines.push(
            { x1: doorX, y1: doorY, x2: doorX + doorWidth, y2: doorY, progress: 0, speed: 0.018 },
            { x1: doorX + doorWidth, y1: doorY, x2: doorX + doorWidth, y2: doorY + doorHeight, progress: 0, speed: 0.018 },
            { x1: doorX + doorWidth, y1: doorY + doorHeight, x2: doorX, y2: doorY + doorHeight, progress: 0, speed: 0.018 },
            { x1: doorX, y1: doorY + doorHeight, x2: doorX, y2: doorY, progress: 0, speed: 0.018 }
        );
        
        // Dimension lines
        const dimOffset = 40;
        this.lines.push(
            { x1: startX - dimOffset, y1: startY, x2: startX - dimOffset, y2: startY + buildingHeight, progress: 0, speed: 0.01, isDimension: true },
            { x1: startX, y1: startY + buildingHeight + dimOffset, x2: startX + buildingWidth, y2: startY + buildingHeight + dimOffset, progress: 0, speed: 0.01, isDimension: true }
        );
        
        // Measurement arrows
        const arrowSize = 8;
        this.lines.push(
            { x1: startX - dimOffset, y1: startY, x2: startX - dimOffset - arrowSize, y2: startY + arrowSize, progress: 0, speed: 0.025, isDimension: true },
            { x1: startX - dimOffset, y1: startY, x2: startX - dimOffset + arrowSize, y2: startY + arrowSize, progress: 0, speed: 0.025, isDimension: true }
        );
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.lines.forEach(line => {
            if (line.progress < 1) {
                line.progress += line.speed;
                if (line.progress > 1) line.progress = 1;
            }
            
            const currentX = line.x1 + (line.x2 - line.x1) * line.progress;
            const currentY = line.y1 + (line.y2 - line.y1) * line.progress;
            
            this.ctx.beginPath();
            this.ctx.moveTo(line.x1, line.y1);
            this.ctx.lineTo(currentX, currentY);
            
            if (line.isDimension) {
                this.ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
                this.ctx.lineWidth = 1;
                this.ctx.setLineDash([5, 5]);
            } else {
                this.ctx.strokeStyle = 'rgba(0, 212, 255, 0.6)';
                this.ctx.lineWidth = 2;
                this.ctx.setLineDash([]);
                this.ctx.shadowColor = 'rgba(0, 212, 255, 0.5)';
                this.ctx.shadowBlur = 10;
            }
            
            this.ctx.stroke();
            this.ctx.shadowBlur = 0;
            
            // Draw glowing point at current position
            if (line.progress < 1 && !line.isDimension) {
                this.ctx.beginPath();
                this.ctx.arc(currentX, currentY, 3, 0, Math.PI * 2);
                this.ctx.fillStyle = 'rgba(0, 212, 255, 0.9)';
                this.ctx.fill();
            }
        });
        
        this.animationFrame++;
        
        // Reset animation every 8 seconds
        if (this.animationFrame > 480) {
            this.lines.forEach(line => line.progress = 0);
            this.animationFrame = 0;
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize blueprint animation
const blueprintCanvas = document.getElementById('blueprint-canvas');
const blueprintAnimation = new BlueprintAnimation(blueprintCanvas);
blueprintAnimation.animate();

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
});

// Close menu when clicking on a link
navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.textContent = '☰';
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Counter animation
const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    const suffix = element.getAttribute('data-suffix') || '';
    let current = 0;
    const increment = target / 60;
    const duration = 2000;
    const stepTime = duration / 60;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, stepTime);
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => {
    counterObserver.observe(el);
});

// Back to top button
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Form submission
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value
    };
    
    // Show success message
    formMessage.textContent = 'Dziękujemy za wiadomość! Skontaktujemy się z Tobą wkrótce.';
    formMessage.classList.add('success');
    formMessage.style.display = 'block';
    
    // Reset form
    contactForm.reset();
    
    // Hide message after 5 seconds
    setTimeout(() => {
        formMessage.style.display = 'none';
        formMessage.classList.remove('success');
    }, 5000);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Add stagger delay to grid items
const addStaggerDelay = (selector, baseDelay = 100) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
        el.style.transitionDelay = `${index * baseDelay}ms`;
    });
};

addStaggerDelay('.service-card', 100);
addStaggerDelay('.feature-box', 80);
addStaggerDelay('.portfolio-item', 60);
addStaggerDelay('.process-step', 100);