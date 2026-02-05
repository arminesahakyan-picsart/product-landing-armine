/**
 * Picsart AI Hairstyles - Landing Page JavaScript
 * Handles interactivity and animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavbar();
    initSmoothScroll();
    initActiveSection();
    initStyleChips();
    initScrollAnimations();
    initModal();
});

/**
 * Navbar - Scroll behavior and mobile menu
 */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            
            if (navLinks) {
                navLinks.classList.toggle('mobile-open');
            }
        });
    }
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
                
                if (navLinks && navLinks.classList.contains('mobile-open')) {
                    navLinks.classList.remove('mobile-open');
                    mobileMenuBtn.classList.remove('active');
                }
            }
        });
    });
}

/**
 * Active section highlight in navbar
 */
function initActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    function highlightActiveSection() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightActiveSection);
    highlightActiveSection(); // Run on page load
}

/**
 * Style chips interactivity in benefits section
 */
function initStyleChips() {
    const styleChips = document.querySelectorAll('.style-chip');
    const styledPreview = document.getElementById('styled-preview');
    
    styleChips.forEach(chip => {
        chip.addEventListener('click', () => {
            // Remove active from all chips
            styleChips.forEach(c => c.classList.remove('active'));
            
            // Add active to clicked chip
            chip.classList.add('active');
            
            // Update the styled image
            if (styledPreview && chip.dataset.image) {
                styledPreview.style.opacity = '0.5';
                styledPreview.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    styledPreview.src = chip.dataset.image;
                    styledPreview.style.opacity = '1';
                    styledPreview.style.transform = 'scale(1)';
                }, 150);
            }
        });
    });
}

/**
 * Scroll-triggered animations
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Elements to animate
    const animateElements = document.querySelectorAll(
        '.feature-card, .benefit-item, .testimonial-card, .pricing-card'
    );
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

/**
 * CTA Modal functionality
 */
function initModal() {
    const modal = document.getElementById('cta-modal');
    const modalBackdrop = modal?.querySelector('.modal-backdrop');
    const modalClose = modal?.querySelector('.modal-close');
    const openButtons = document.querySelectorAll('[data-open-modal="cta-modal"]');
    const form = document.getElementById('cta-form');
    
    if (!modal) return;
    
    // Open modal
    function openModal() {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Focus first input
        setTimeout(() => {
            const firstInput = modal.querySelector('input');
            if (firstInput) firstInput.focus();
        }, 100);
    }
    
    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        
        // Reset form
        if (form) {
            form.reset();
            clearErrors();
        }
    }
    
    // Clear all form errors
    function clearErrors() {
        form.querySelectorAll('input').forEach(input => {
            input.classList.remove('error');
        });
        form.querySelectorAll('.error-message').forEach(msg => {
            msg.textContent = '';
        });
    }
    
    // Validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Show error for a field
    function showError(input, message) {
        input.classList.add('error');
        const errorEl = input.parentElement.querySelector('.error-message');
        if (errorEl) {
            errorEl.textContent = message;
        }
    }
    
    // Clear error for a field
    function clearError(input) {
        input.classList.remove('error');
        const errorEl = input.parentElement.querySelector('.error-message');
        if (errorEl) {
            errorEl.textContent = '';
        }
    }
    
    // Validate form
    function validateForm() {
        const nameInput = form.querySelector('#name');
        const emailInput = form.querySelector('#email');
        let isValid = true;
        
        clearErrors();
        
        // Validate name
        if (!nameInput.value.trim()) {
            showError(nameInput, 'Name is required');
            isValid = false;
        } else if (nameInput.value.trim().length < 2) {
            showError(nameInput, 'Name must be at least 2 characters');
            isValid = false;
        }
        
        // Validate email
        if (!emailInput.value.trim()) {
            showError(emailInput, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(emailInput.value.trim())) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Open modal button clicks
    openButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });
    
    // Close button click
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // Backdrop click
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', closeModal);
    }
    
    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Form submission
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (validateForm()) {
                // Form is valid - show success
                const formData = {
                    name: form.querySelector('#name').value.trim(),
                    email: form.querySelector('#email').value.trim()
                };
                
                console.log('Form submitted:', formData);
                
                // Show success message (replace form content temporarily)
                const modalContent = modal.querySelector('.modal-content');
                const originalContent = modalContent.innerHTML;
                
                modalContent.innerHTML = `
                    <div style="text-align: center; padding: 40px 20px;">
                        <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                                <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <h2 style="font-size: 24px; font-weight: 700; color: #171717; margin-bottom: 12px;">Welcome aboard!</h2>
                        <p style="font-size: 16px; color: #737373; margin-bottom: 24px;">Check your email for next steps to start your AI hairstyle transformation.</p>
                        <button class="btn btn-primary" onclick="location.reload()">Got it!</button>
                    </div>
                `;
                
                // Auto close after 3 seconds
                setTimeout(() => {
                    closeModal();
                    modalContent.innerHTML = originalContent;
                    // Re-initialize form event listener would be needed in production
                }, 5000);
            }
        });
        
        // Real-time validation on blur
        form.querySelectorAll('input').forEach(input => {
            input.addEventListener('blur', () => {
                if (input.id === 'name') {
                    if (!input.value.trim()) {
                        showError(input, 'Name is required');
                    } else if (input.value.trim().length < 2) {
                        showError(input, 'Name must be at least 2 characters');
                    } else {
                        clearError(input);
                    }
                }
                
                if (input.id === 'email') {
                    if (!input.value.trim()) {
                        showError(input, 'Email is required');
                    } else if (!isValidEmail(input.value.trim())) {
                        showError(input, 'Please enter a valid email address');
                    } else {
                        clearError(input);
                    }
                }
            });
            
            // Clear error on input
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    clearError(input);
                }
            });
        });
    }
}

// Add CSS class for animations and active states
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .navbar.scrolled {
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        background: rgba(255, 255, 255, 0.98);
    }
    
    .nav-links a.active {
        color: var(--primary-purple) !important;
        position: relative;
    }
    
    .nav-links a.active::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 0;
        right: 0;
        height: 2px;
        background: var(--primary-gradient);
        border-radius: 2px;
    }
    
    .nav-links.mobile-open {
        display: flex !important;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        flex-direction: column;
        background: white;
        padding: 24px;
        gap: 16px;
        border-top: 1px solid var(--gray-200);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }
    
    .mobile-menu-btn.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .mobile-menu-btn.active span:nth-child(2) {
        opacity: 0;
    }
    
    .mobile-menu-btn.active span:nth-child(3) {
        transform: rotate(-45deg) translate(5px, -5px);
    }
`;
document.head.appendChild(style);
