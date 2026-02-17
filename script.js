// Toggle staff card expansion - Global function
function toggleStaffCard(card) {
    try {
        const details = card.querySelector('.staff-details');
        const toggle = card.querySelector('.staff-toggle');
        const icon = toggle.querySelector('i');
        
        if (!details || !toggle || !icon) {
            console.error('Missing required elements in staff card');
            return;
        }
        
        if (details.classList.contains('show')) {
            details.classList.remove('show');
            toggle.classList.remove('expanded');
            card.classList.remove('expanded');
            icon.className = 'fas fa-chevron-down';
        } else {
            details.classList.add('show');
            toggle.classList.add('expanded');
            card.classList.add('expanded');
            icon.className = 'fas fa-chevron-up';
        }
    } catch (error) {
        console.error('Error in toggleStaffCard:', error);
    }
}

/* ==========================================================================
   PARALLAX EFFECT FOR ANCIENT CITY BACKGROUND
   ========================================================================== */

// Parallax effect for ancient city background
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    
    // Track mouse movement for parallax effect
    document.addEventListener('mousemove', (e) => {
        // Parallax effect - move background opposite to cursor
        const moveX = (e.clientX - window.innerWidth / 2) * 0.02;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.02;
        
        body.style.backgroundPosition = `calc(50% + ${moveX}px) calc(50% + ${moveY}px)`;
    });
    
    // Reset on mouse leave
    document.addEventListener('mouseleave', () => {
        body.style.backgroundPosition = 'center';
    });

    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealSelectors = [
        'main h1',
        'main h2',
        'main h3',
        'main p',
        'main li',
        '.feature-card',
        '.stat-item',
        '.goal-content',
        '.mission-text',
        '.intro-text',
        '.cta-content',
        '.form-container',
        '.story-card',
        '.benefit-item',
        '.signup-button-container',
        '.signup-button-section',
        '.staff-card'
    ];

    const isDesktop = window.innerWidth >= 769;
    const isVolunteerOrStudentPage = document.body.classList.contains('page-volunteer') || 
                                      document.body.classList.contains('page-student');

    // Filter out list items and benefits on desktop for volunteer/student pages
    const candidates = Array.from(document.querySelectorAll(revealSelectors.join(',')))
        .filter((el) => !el.closest('nav') && !el.closest('footer'))
        .filter((el) => {
            if (!isDesktop || !isVolunteerOrStudentPage) return true;
            // Skip LI elements and benefits list elements
            if (el.tagName === 'LI') return false;
            if (el.classList.contains('benefits-list') || el.classList.contains('benefit-item')) return false;
            return true;
        });

    if (prefersReducedMotion) {
        candidates.forEach((el) => el.classList.add('intro-animate', 'is-visible'));
        return;
    }

    candidates.forEach((el) => {
        el.classList.add('intro-animate');
    });

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                el.classList.add('is-visible');
                obs.unobserve(el);
            });
        },
        {
            root: null,
            threshold: 0.15,
            rootMargin: '0px 0px -10% 0px'
        }
    );

    candidates.forEach((el) => observer.observe(el));
});

/* ==========================================================================
   MOBILE NAVIGATION TOGGLE
   ========================================================================== */

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (!hamburger || !navMenu) return;
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

/* ==========================================================================
   FORM VALIDATION AND SUBMISSION
   ========================================================================== */

// Form Validation and Submission
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        clearErrors(form);
        
        // Validate form fields
        const isValid = validateFields(form);
        
        if (isValid) {
            // Disable submit button
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            
            // Simulate form submission
            await simulateSubmission();
            
            // Show success message
            showSuccessMessage(form);
            
            // Reset form
            form.reset();
            
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Application';
        }
    });
}

// Validate form fields
function validateFields(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            showError(input, 'This field is required');
            isValid = false;
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
            showError(input, 'Please enter a valid email address');
            isValid = false;
        } else if (input.type === 'tel' && !isValidPhone(input.value)) {
            showError(input, 'Please enter a valid phone number');
            isValid = false;
        } else if (input.type === 'checkbox' && !input.checked) {
            showError(input, 'This field is required');
            isValid = false;
        }
    });
    
    return isValid;
}

// Show error message
function showError(input, message) {
    const errorElement = input.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        input.style.borderColor = '#ef4444';
    }
}

// Clear all error messages
function clearErrors(form) {
    const errorMessages = form.querySelectorAll('.error-message');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    errorMessages.forEach(error => {
        error.textContent = '';
        error.style.display = 'none';
    });
    
    inputs.forEach(input => {
        input.style.borderColor = '#e5e7eb';
    });
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation
function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// Simulate form submission
function simulateSubmission() {
    return new Promise(resolve => setTimeout(resolve, 2000));
}

// Show success message
function showSuccessMessage(form) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <strong>Success!</strong> Your application has been submitted successfully. We'll contact you within 2-3 business days.
    `;
    
    form.parentElement.insertBefore(successDiv, form);
    
    // Scroll to success message
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */

// Initialize forms when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    validateForm('volunteerForm');
    validateForm('studentForm');
    
    // Animate elements on scroll
    animateOnScroll();
    
    // Counter animation for stats
    animateCounters();
    
    // Smooth scrolling for anchor links
    smoothScroll();
});

/* ==========================================================================
   SCROLL ANIMATIONS
   ========================================================================== */

// Animate elements on scroll
function animateOnScroll() {
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
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.feature-card, .stat-item, .story-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

/* ==========================================================================
   COUNTER ANIMATIONS
   ========================================================================== */

// Animate counter numbers
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;
    
    counters.forEach(counter => {
        const animate = () => {
            const target = +counter.getAttribute('data-target') || counter.innerText;
            const count = +counter.innerText;
            const increment = target / speed;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(animate, 1);
            } else {
                counter.innerText = target;
            }
        };
        
        animate();
    });
}

/* ==========================================================================
   SMOOTH SCROLLING
   ========================================================================== */

// Smooth scrolling for anchor links
function smoothScroll() {
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
}

/* ==========================================================================
   UTILITY FUNCTIONS
   ========================================================================== */

// Debounce function for performance optimization
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Smooth scrolling for anchor links
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

// Add hover effects to interactive elements
document.querySelectorAll('.btn, .feature-card, .story-card, .nav-link').forEach(element => {
    element.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    element.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Form field focus effects
document.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    field.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
    });
});

// Progress bar animation
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                const width = entry.target.style.width;
                entry.target.style.width = '0';
                
                setTimeout(() => {
                    entry.target.style.width = width;
                    entry.target.classList.add('animated');
                }, 100);
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Initialize progress bars
animateProgressBars();

// Add floating animation to hero graphic
const heroGraphic = document.querySelector('.hero-graphic');
if (heroGraphic) {
    heroGraphic.style.animation = 'float 3s ease-in-out infinite';
}

// Add typing effect to hero title (optional enhancement)
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}


