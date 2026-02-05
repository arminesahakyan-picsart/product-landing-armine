/**
 * Picsart AI Hairstyles - Landing Page JavaScript
 * Handles interactivity and animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavbar();
    initSmoothScroll();
    initStyleChips();
    initScrollAnimations();
    initLightbox();
});

/**
 * Navbar - Scroll behavior and mobile menu
 */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    // Navbar background on scroll
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
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
 * Lightbox functionality for gallery
 */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCategory = lightbox?.querySelector('.lightbox-category');
    const lightboxTitle = lightbox?.querySelector('.lightbox-title');
    const lightboxCurrent = document.getElementById('lightbox-current');
    const lightboxTotal = document.getElementById('lightbox-total');
    const lightboxBackdrop = lightbox?.querySelector('.lightbox-backdrop');
    const lightboxClose = lightbox?.querySelector('.lightbox-close');
    const lightboxPrev = lightbox?.querySelector('.lightbox-prev');
    const lightboxNext = lightbox?.querySelector('.lightbox-next');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (!lightbox || galleryItems.length === 0) return;
    
    let currentIndex = 0;
    let visibleItems = Array.from(galleryItems);
    
    // Update visible items based on filter
    function updateVisibleItems() {
        visibleItems = Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
        if (lightboxTotal) {
            lightboxTotal.textContent = visibleItems.length;
        }
    }
    
    // Open lightbox
    function openLightbox(index) {
        updateVisibleItems();
        currentIndex = index;
        updateLightboxContent();
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
    
    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
    
    // Update lightbox content
    function updateLightboxContent() {
        const item = visibleItems[currentIndex];
        if (!item) return;
        
        const img = item.querySelector('img');
        const category = item.querySelector('.gallery-category')?.textContent || '';
        const title = item.querySelector('h4')?.textContent || '';
        
        // Get higher resolution image
        const imgSrc = img.src.replace('w=400', 'w=1200').replace('h=500', 'h=800');
        
        lightboxImage.src = imgSrc;
        lightboxImage.alt = img.alt;
        if (lightboxCategory) lightboxCategory.textContent = category;
        if (lightboxTitle) lightboxTitle.textContent = title;
        if (lightboxCurrent) lightboxCurrent.textContent = currentIndex + 1;
    }
    
    // Navigate to previous image
    function prevImage() {
        currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
        updateLightboxContent();
    }
    
    // Navigate to next image
    function nextImage() {
        currentIndex = (currentIndex + 1) % visibleItems.length;
        updateLightboxContent();
    }
    
    // Click on gallery item
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            updateVisibleItems();
            const visibleIndex = visibleItems.indexOf(item);
            if (visibleIndex !== -1) {
                openLightbox(visibleIndex);
            }
        });
    });
    
    // Close button
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    // Backdrop click
    if (lightboxBackdrop) {
        lightboxBackdrop.addEventListener('click', closeLightbox);
    }
    
    // Navigation buttons
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', prevImage);
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', nextImage);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
    });
    
    // Update total count
    updateVisibleItems();
}

// Add CSS class for animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
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
