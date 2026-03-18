/* ========================================
   Astrophotography Portfolio - JavaScript
   ======================================== */

// Gallery object data
const galleryObjects = {
    lagoon: {
        title: 'Lagoon Nebula (M8)',
        description: 'The Lagoon Nebula (M8) is a vast star-forming region located about 4,000-6,000 light-years away in the constellation Sagittarius—spanning 110 light-years across.',
        date: 'August 4th, 2024',
        location: 'Truro, MA',
        bortle: 'Bortle 3',
        equipment: 'Vaonis Stellina Smart Telescope',
        image: '/astro-static/images/IMG_1218.jpg'
    },
    trifid: {
        title: 'Trifid Nebula (M20)',
        description: 'The Trifid Nebula is a stunning star-forming region located about 4,100 light-years away in the constellation Sagittarius, spanning approximately 50 light-years across.',
        date: 'August 4th, 2024',
        location: 'Truro, MA',
        bortle: 'Bortle 3',
        equipment: 'Vaonis Stellina Smart Telescope',
        image: '/astro-static/images/IMG_1219.jpg'
    },
    pinwheel: {
        title: 'Pinwheel Galaxy (M101)',
        description: 'The Pinwheel Galaxy is a face-on spiral galaxy about 21 million light-years away in the constellation Ursa Major, spanning 170,000 light-years and known for its bright star-forming regions.',
        date: 'August 4th, 2024',
        location: 'Truro, MA',
        bortle: 'Bortle 3',
        equipment: 'Vaonis Stellina Smart Telescope',
        image: '/astro-static/images/IMG_1220.jpg'
    },
    omega: {
        title: 'Omega Centauri (NGC 5139)',
        description: 'Omega Centauri is the largest globular cluster in the Milky Way, located about 16,000 light-years away in the constellation Centaurus, spanning 150 light-years and containing over 10 million stars.',
        date: 'August 4th, 2024',
        location: 'Truro, MA',
        bortle: 'Bortle 3',
        equipment: 'Vaonis Stellina Smart Telescope',
        image: '/astro-static/images/IMG_1221.jpg'
    },
    ring: {
        title: 'Ring Nebula (M57)',
        description: 'The Ring Nebula is a planetary nebula about 2,300 light-years away in the constellation Lyra, with its iconic glowing ring spanning roughly 1 light-year across.',
        date: 'August 4th, 2024',
        location: 'Truro, MA',
        bortle: 'Bortle 3',
        equipment: 'Vaonis Stellina Smart Telescope',
        image: '/astro-static/images/IMG_1222.jpg'
    }
};

/* ========================================
   Scroll Reveal Animation
   ======================================== */
function initScrollReveal() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        // If reduced motion is preferred, show all elements immediately
        document.querySelectorAll('.reveal').forEach(el => {
            el.classList.add('active');
        });
        return;
    }

    // Create intersection observer for scroll animations
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Keep element visible once revealed
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with .reveal class
    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
}

/* ========================================
   Smooth Scroll Navigation
   ======================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navMenu = document.getElementById('navMenu');
                const navToggle = document.getElementById('navToggle');
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            }
        });
    });
}

/* ========================================
   Mobile Navigation Toggle
   ======================================== */
function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}

/* ========================================
   Lightbox Modal
   ======================================== */
function initLightbox() {
    const modal = document.getElementById('lightbox');
    const modalClose = document.getElementById('modalClose');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalMetadata = document.getElementById('modalMetadata');

    // Open modal when clicking gallery cards
    document.querySelectorAll('.gallery-card').forEach(card => {
        card.addEventListener('click', () => {
            const objectKey = card.getAttribute('data-object');
            const objectData = galleryObjects[objectKey];

            if (objectData) {
                // Set modal content
                modalImage.src = objectData.image;
                modalImage.alt = objectData.title;
                modalTitle.textContent = objectData.title;
                modalDescription.textContent = objectData.description;

                // Build metadata
                modalMetadata.innerHTML = `
                    <div class="metadata-item">
                        <span class="metadata-label">Date</span>
                        <span class="metadata-value">${objectData.date}</span>
                    </div>
                    <div class="metadata-item">
                        <span class="metadata-label">Location</span>
                        <span class="metadata-value">${objectData.location}</span>
                    </div>
                    <div class="metadata-item">
                        <span class="metadata-label">Sky Quality</span>
                        <span class="metadata-value">${objectData.bortle}</span>
                    </div>
                    <div class="metadata-item">
                        <span class="metadata-label">Equipment</span>
                        <span class="metadata-value">${objectData.equipment}</span>
                    </div>
                `;

                // Show modal
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);

    // Close when clicking overlay (outside modal content)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

/* ========================================
   Hero Parallax Effect (Subtle)
   ======================================== */
function initHeroParallax() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        return; // Skip parallax if user prefers reduced motion
    }

    const heroBackground = document.querySelector('.hero-background');

    if (!heroBackground) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroHeight = document.querySelector('.hero').offsetHeight;

        // Only apply parallax while hero is visible
        if (scrolled < heroHeight) {
            const parallaxSpeed = 0.3;
            heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
    });
}

/* ========================================
   Header Background on Scroll
   ======================================== */
function initHeaderScroll() {
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            header.style.background = 'rgba(10, 10, 15, 0.95)';
        } else {
            header.style.background = 'rgba(10, 10, 15, 0.8)';
        }
    });
}

/* ========================================
   Initialize All Functions
   ======================================== */
document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initSmoothScroll();
    initMobileNav();
    initLightbox();
    initHeroParallax();
    initHeaderScroll();

    console.log('Aki\'s AstroGallery loaded successfully');
});
