// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeModal();
    setupSmoothScroll();
    setupFormValidation();
});

// ===== MODAL FUNCTIONALITY =====
function initializeModal() {
    const modal = document.getElementById('lead-dialog');
    const openBtns = document.querySelectorAll('[id^="open-dialog-btn"]');
    const closeBtn = document.querySelector('.close-btn');
    const form = document.getElementById('contact-form');

    // Open modal
    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
        });
    });

    // Close modal with X button
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });

    // Form submission
    form.addEventListener('submit', handleFormSubmit);
}

// ===== FORM SUBMISSION =====
async function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';

    try {
        const formData = new FormData(form);
        const data = {
            timestamp: new Date().toLocaleString('en-IN'),
            name: formData.get('Name'),
            email: formData.get('Email'),
            mobile: formData.get('Mobile'),
            experience: formData.get('Experience'),
            interest: formData.get('Interest')
        };

        console.log('Form Data:', data);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Show success message
        showNotification('✓ Success! Your registration is confirmed. Check your email for trial access.', 'success');

        // Reset form and close modal
        form.reset();
        document.getElementById('lead-dialog').classList.remove('active');
    } catch (error) {
        console.error('Error:', error);
        showNotification('❌ An error occurred. Please try again.', 'error');
    } finally {
        // Restore button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// ===== FORM VALIDATION =====
function setupFormValidation() {
    const form = document.getElementById('contact-form');
    const inputs = form.querySelectorAll('input, select');

    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('change', validateField);
    });
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();

    // Remove previous error state
    field.classList.remove('error');

    if (!value) {
        field.classList.add('error');
        return false;
    }

    // Email validation
    if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            field.classList.add('error');
            return false;
        }
    }

    // Mobile validation
    if (field.name === 'Mobile') {
        if (!/^\d{10}$/.test(value)) {
            field.classList.add('error');
            return false;
        }
    }

    return true;
}

// ===== SMOOTH SCROLL =====
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '') return;

            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                // Close modal if open
                const modal = document.getElementById('lead-dialog');
                if (modal.classList.contains('active')) {
                    modal.classList.remove('active');
                }

                // Smooth scroll
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Add active state to nav
                updateActiveNavLink(href);
            }
        });
    });
}

// ===== UPDATE ACTIVE NAV LINK =====
function updateActiveNavLink(sectionId) {
    document.querySelectorAll('.navbar a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === sectionId) {
            link.classList.add('active');
        }
    });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            ${message}
        </div>
        <button class="notification-close">&times;</button>
    `;

    // Add to DOM
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 10);

    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });

    // Auto close after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ===== SCROLL ANIMATIONS =====
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all feature cards and testimonial cards
    document.querySelectorAll('.feature-card, .testimonial-card, .why-item, .stat').forEach(el => {
        observer.observe(el);
    });
}

// ===== PARALLAX EFFECT =====
function setupParallax() {
    const heroImage = document.querySelector('.hero-image img');
    
    if (!heroImage) return;

    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const heroSection = document.querySelector('.hero');
        
        if (scrollPosition < heroSection.offsetHeight) {
            heroImage.style.transform = `translateY(${scrollPosition * 0.3}px)`;
        }
    });
}

// ===== INITIALIZE ALL EFFECTS =====
document.addEventListener('DOMContentLoaded', function() {
    setupScrollAnimations();
    setupParallax();
});

// ===== HEADER SCROLL EFFECT =====
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ===== STATS COUNTER =====
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat h3');
    
    stats.forEach(stat => {
        const finalValue = stat.textContent;
        const numericValue = parseInt(finalValue);
        
        if (isNaN(numericValue)) return;

        let currentValue = 0;
        const increment = Math.ceil(numericValue / 50);
        
        const counter = setInterval(() => {
            currentValue += increment;
            
            if (currentValue >= numericValue) {
                stat.textContent = finalValue;
                clearInterval(counter);
            } else {
                stat.textContent = currentValue + '+';
            }
        }, 30);
    });
}

// Trigger counter when stats section comes into view
document.addEventListener('DOMContentLoaded', function() {
    const statsSection = document.querySelector('.trust-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                initStatsCounter();
                observer.unobserve(entry.target);
            }
        });
    });

    if (statsSection) {
        observer.observe(statsSection);
    }
});