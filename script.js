document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Navigation
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle (Enhanced Drawer Implementation)
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    // Create mobile backdrop if not present
    let backdrop = document.querySelector('.nav-backdrop');
    if (!backdrop && navbar) {
        backdrop = document.createElement('div');
        backdrop.className = 'nav-backdrop';
        document.body.appendChild(backdrop);
    }
    
    function toggleMobileMenu(open) {
        const isOpen = open !== undefined ? open : !navLinks.classList.contains('active');
        
        if (isOpen) {
            navLinks.classList.add('active');
            mobileBtn?.classList.add('active');
            backdrop?.classList.add('active');
            document.body.classList.add('menu-open');
            mobileBtn?.setAttribute('aria-expanded', 'true');
            
            const icon = mobileBtn?.querySelector('i');
            if (icon) {
                icon.className = 'ph ph-x';
            }
        } else {
            navLinks.classList.remove('active');
            mobileBtn?.classList.remove('active');
            backdrop?.classList.remove('active');
            document.body.classList.remove('menu-open');
            mobileBtn?.setAttribute('aria-expanded', 'false');
            
            const icon = mobileBtn?.querySelector('i');
            if (icon) {
                icon.className = 'ph ph-list';
            }
        }
    }

    if (mobileBtn && navLinks) {
        mobileBtn.setAttribute('aria-expanded', 'false');
        mobileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileMenu();
        });
        
        if (backdrop) {
            backdrop.addEventListener('click', () => toggleMobileMenu(false));
        }

        // Close menu on link clicks
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => toggleMobileMenu(false));
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                toggleMobileMenu(false);
            }
        });
    }

    // 3. Scroll Animations (Intersection Observer)
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Stop observing once animated
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15, // Trigger when 15% visible
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
        animationObserver.observe(el);
    });

    // 4. Counter Animation
    const counters = document.querySelectorAll('.counter');
    let hasAnimated = false;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000; // 2 seconds
                    const increment = target / (duration / 16); // 60fps
                    
                    let current = 0;
                    
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            // If integer, don't show decimals
                            if (target % 1 === 0) {
                                counter.innerText = Math.ceil(current);
                            } else {
                                counter.innerText = current.toFixed(1);
                            }
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    
                    updateCounter();
                });
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.statistics');
    if (statsSection) {
        counterObserver.observe(statsSection);
    }

    // 5. Smooth Scrolling for Anchor Links (Handles both in-page and cross-page anchor offset)
    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const hashIndex = href.indexOf('#');
            const targetId = href.substring(hashIndex);
            const path = href.substring(0, hashIndex);
            
            const currentPath = window.location.pathname.split('/').pop() || 'index.html';

            if (path === '' || path === currentPath) {
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                    window.scrollTo({
                         top: offsetPosition,
                         behavior: "smooth"
                    });
                    
                    history.pushState(null, null, targetId);
                }
            }
        });
    });

    // Handle hash on initial page load (for cross-page anchor links in footer)
    if (window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        }, 100);
    }
});

// Interactive Timeline
document.addEventListener('DOMContentLoaded', () => {
    const timelineSteps = document.querySelectorAll('.timeline-step');
    const timelineContents = document.querySelectorAll('.timeline-content');

    if (timelineSteps.length > 0) {
        timelineSteps.forEach(step => {
            step.addEventListener('click', () => {
                // Remove active class from all steps and contents
                timelineSteps.forEach(s => s.classList.remove('active'));
                timelineContents.forEach(c => c.classList.remove('active'));

                // Add active class to clicked step
                step.classList.add('active');

                // Add active class to target content
                const targetId = step.getAttribute('data-target');
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }
});

