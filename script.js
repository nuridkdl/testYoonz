document.addEventListener("DOMContentLoaded", function() {
    // 1. Mobile Menu Toggle
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const navItems = document.querySelectorAll(".nav-links li a");
    const sections = document.querySelectorAll(".panel");
    const container = document.querySelector(".container");

    let isScrolling = false;
    let currentSectionIndex = 0;

    if (hamburger) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navLinks.classList.toggle("active");
            
            // Adjust hamburger color if needed based on background
            const barLines = hamburger.querySelectorAll(".bar");
            if(hamburger.classList.contains("active")) {
                barLines.forEach(b => b.style.backgroundColor = 'var(--text-dark)');
            } else {
                const activeSection = document.querySelector('.panel.active-panel');
                if(activeSection && activeSection.classList.contains('dark-bg')) {
                    barLines.forEach(b => b.style.backgroundColor = 'var(--text-light)');
                }
            }
        });
    }

    // Close menu when clicking link and smoothly navigate
    navItems.forEach((item, index) => {
        item.addEventListener("click", (e) => {
            e.preventDefault(); // Stop native jump
            hamburger.classList.remove("active");
            navLinks.classList.remove("active");
            
            if (!isScrolling) {
                currentSectionIndex = index;
                scrollToSection(currentSectionIndex);
            }
        });
    });

    // 2. Setup Word Reveal for Quote Section
    const quoteEl = document.getElementById('animated-quote');
    if(quoteEl) {
        const textContent = quoteEl.innerHTML;
        const parts = textContent.split(/(<br>)/i);
        quoteEl.innerHTML = '';
        
        parts.forEach(part => {
            if (part.toLowerCase() === '<br>') {
                quoteEl.appendChild(document.createElement('br'));
            } else {
                const words = part.split(' ');
                words.forEach(word => {
                    if (word.trim() !== '') {
                        const wordWrap = document.createElement('span');
                        wordWrap.className = 'word';
                        const innerWrap = document.createElement('span');
                        innerWrap.innerHTML = word;
                        wordWrap.appendChild(innerWrap);
                        quoteEl.appendChild(wordWrap);
                        quoteEl.appendChild(document.createTextNode(' '));
                    }
                });
            }
        });
    }

    // 3. Intersection Observer for Scroll Animations & Nav

    const observerOptions = {
        root: container,
        rootMargin: "0px",
        threshold: 0.35
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Track active panel for hamburger color
                sections.forEach(s => s.classList.remove('active-panel'));
                entry.target.classList.add('active-panel');

                // Update Nav Links
                navItems.forEach(link => link.classList.remove("active"));
                const id = entry.target.getAttribute("id");
                const targetLink = document.querySelector(`.nav-links li a[href="#${id}"]`);
                if(targetLink) targetLink.classList.add("active");

                // Trigger General Animations (Removed from Section Observer)
                // We will handle these individually now because of long sections causing elements to stay invisible.

                // Handle specific Word Reveal animation (Quote Section)
                if (id === 'quote') {
                    const words = entry.target.querySelectorAll('.word');
                    words.forEach((w, idx) => {
                        setTimeout(() => {
                            w.classList.add('visible');
                        }, 100 * idx); // Stagger word appear speed
                    });

                    // Trigger strawberry roll immediately as the text STARTS revealing
                    const berry = entry.target.querySelector('.rolling-strawberry');
                    if(berry) {
                        // Small aesthetic delay so it doesn't feel abrupt, but essentially simultaneous with text
                        setTimeout(() => {
                            berry.classList.add('roll-now');
                            
                            // Listen for the CSS animation to truly end (respects hover pauses automatically)
                            berry.addEventListener('animationend', function onRollEnd(e) {
                                // Ensure we only trigger on the main roll-in animation
                                if (e.animationName === 'roll-in') {
                                    berry.classList.add('finished');
                                    // Remove the listener once finished so it doesn't trigger on other animations
                                    berry.removeEventListener('animationend', onRollEnd);
                                }
                            });
                        }, 100);
                    }
                }

                // Header & Hamburger Color theme switch
                const isDark = entry.target.classList.contains('dark-bg');
                const bars = document.querySelectorAll('.bar');
                const logoMain = document.querySelector('.logo-main');
                const logoSub = document.querySelector('.logo-sub');
                const navbar = document.querySelector('.navbar');
                
                if(isDark && (!hamburger || !hamburger.classList.contains('active'))) {
                    if (navbar) {
                        navbar.style.background = 'rgba(18, 18, 18, 0.9)';
                        navbar.style.setProperty('--accent', '#e63946'); // Elegant bright red for dark mode
                    }
                    bars.forEach(b => b.style.backgroundColor = 'var(--text-light)');
                    if(logoMain) logoMain.style.color = 'var(--text-light)';
                    if(logoSub) logoSub.style.color = '#ccc';
                    navItems.forEach(item => item.style.color = 'var(--text-light)');
                } else {
                    if (navbar) {
                        navbar.style.background = 'rgba(250, 249, 246, 0.9)';
                        navbar.style.setProperty('--accent', '#9b111e'); // Original dark red
                    }
                    bars.forEach(b => b.style.backgroundColor = 'var(--text-dark)');
                    if(logoMain) logoMain.style.color = 'var(--accent)';
                    if(logoSub) logoSub.style.color = '#888';
                    navItems.forEach(item => item.style.color = '#666');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    // 4. Individual Element Observer for Animations (Fixes visibility on long sections)
    const elementObserverOptions = {
        root: null, // Track against browser viewport (crucial for horizontal scroll)
        rootMargin: "0px 0px -10% 0px", // Trigger slightly before it hits the bottom
        threshold: 0.1
    };

    const elementObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                elementObserver.unobserve(entry.target); // Only animate once
            }
        });
    }, elementObserverOptions);

    const allAnimatedElements = document.querySelectorAll('.fade-up, .text-reveal, .list-item, .grid-box, .variety-card, .editorial-item, .editorial-header, .collection-list');
    allAnimatedElements.forEach(el => {
        elementObserver.observe(el);
    });

    // 4. Jelly-Like Custom Cursor Tracking
    const cursor = document.querySelector('.custom-cursor');
    const cursorVisual = document.querySelector('.cursor-visual');
    const interactiveElements = document.querySelectorAll('a:not(.polaroid-item), button, .hamburger');
    const imageElements = document.querySelectorAll('.gallery-item, .polaroid-item');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let velX = 0;
    let velY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const animateCursor = () => {
        // Spring physics for "boing" and jelly effect
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        // Tension & Friction
        velX += dx * 0.15;
        velY += dy * 0.15;
        velX *= 0.65;
        velY *= 0.65;

        cursorX += velX;
        cursorY += velY;

        // Calculate stretch based on velocity
        const speed = Math.sqrt(velX * velX + velY * velY);
        // Map speed to scale squash/stretch
        const scaleX = Math.min(1 + speed * 0.015, 1.8);
        const scaleY = Math.max(1 - speed * 0.006, 0.5);
        
        // Angle points to direction of velocity
        const angle = Math.atan2(velY, velX) * 180 / Math.PI;

        // Apply transformations: 
        // 1. Wrapper gets the position with an offset so the pointer is at the top-left edge of the circle
        if(cursor) {
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(0px, 0px)`;
        }
        
        // 2. Visual gets the jelly squash and stretch
        if(cursorVisual) {
            cursorVisual.style.transform = `rotate(${angle}deg) scale(${scaleX}, ${scaleY})`;
        }
        
        requestAnimationFrame(animateCursor);
    };
    requestAnimationFrame(animateCursor);

    // Expand cursor on interactive elements (Links, buttons)
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('active'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });

    const cursorText = document.querySelector('.cursor-text');

    // Special state on images: disable blend mode, add glassmorphism 'View' state
    imageElements.forEach(img => {
        img.addEventListener('mouseenter', () => {
            cursor.classList.add('on-image');
            if(img.classList.contains('polaroid-item')) {
                cursor.classList.add('search-mode');
                if(cursorText) cursorText.innerText = 'Search';
            }
        });
        img.addEventListener('mouseleave', () => {
            cursor.classList.remove('on-image');
            if(img.classList.contains('polaroid-item')) {
                cursor.classList.remove('search-mode');
                if(cursorText) cursorText.innerText = 'View';
            }
        });
    });

    // Special state on store list items: display red Custom Cursor (Section 5)
    const storeLinks = document.querySelectorAll('.store-link-target');
    
    storeLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            if(cursor) {
                cursor.classList.add('on-image', 'search-mode');
                if(cursorText) cursorText.innerText = 'Search';
            }
        });
        link.addEventListener('mouseleave', () => {
            if(cursor) {
                cursor.classList.remove('on-image', 'search-mode');
                if(cursorText) cursorText.innerText = 'View';
            }
        });
        // Force click navigation in case other scroll scripts intercept it
        link.addEventListener('click', (e) => {
            e.stopPropagation(); // Stop global click handlers
            const href = link.getAttribute('href');
            if (href && href !== '#') {
                window.open(href, '_blank');
            }
        });
    });


    // 5. Concept 3: The Canvas (Accordion Hover Logic)
    // Core expansion logic is handled purely by CSS flex-grow for maximum smoothness.
    // We only need JS to handle the custom cursor aesthetic when hovering over panels.
    const canvasPanels = document.querySelectorAll('.canvas-panel');

    if (canvasPanels.length > 0) {
        canvasPanels.forEach(panel => {
            panel.addEventListener('mouseenter', () => {
                cursor.classList.add('on-canvas');
            });

            panel.addEventListener('mouseleave', () => {
                cursor.classList.remove('on-canvas');
            });
        });
    }

    // Hide custom cursor when hovering the interactive rolling strawberry
    const rollingBerry = document.querySelector('.rolling-strawberry');
    if (rollingBerry) {
        rollingBerry.addEventListener('mouseenter', () => {
            if (cursor) cursor.classList.add('hidden-cursor');
        });
        rollingBerry.addEventListener('mouseleave', () => {
            if (cursor) cursor.classList.remove('hidden-cursor');
        });
    }

    // 6. Custom Smooth Scroll (Glide & Land Easing) - Simple Vertical Section Snap
    container.addEventListener('wheel', (e) => {
        if (window.innerWidth <= 1280) return; // Allow normal scroll on tablet/mobile
        e.preventDefault(); // Disable default vertical scroll
        if (isScrolling) return;
        
        if (e.deltaY > 0 && currentSectionIndex < sections.length - 1) {
            currentSectionIndex++;
            scrollToSection(currentSectionIndex);
        } else if (e.deltaY < 0 && currentSectionIndex > 0) {
            currentSectionIndex--;
            scrollToSection(currentSectionIndex);
        }
    }, { passive: false });

    // Touch support for Vertical Custom Scroll Snap
    let touchStartY = 0;
    container.addEventListener('touchstart', e => {
        touchStartY = e.touches[0].clientY;
    }, { passive: false });
    
    // Prevent default touch movement here ONLY for vertical bounds
    container.addEventListener('touchmove', e => {
        if (window.innerWidth <= 1280) return; // Allow normal touch scroll
        e.preventDefault(); 
    }, { passive: false });

    container.addEventListener('touchend', e => {
        if (window.innerWidth <= 1280) return; // Allow normal touch scroll
        if (isScrolling) return;
        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;
        
        if (diff > 50 && currentSectionIndex < sections.length - 1) {
            currentSectionIndex++;
            scrollToSection(currentSectionIndex);
        } else if (diff < -50 && currentSectionIndex > 0) {
            currentSectionIndex--;
            scrollToSection(currentSectionIndex);
        }
    });

    // The Easing Scroll Function
    function scrollToSection(index) {
        if (index < 0 || index >= sections.length) return;
        isScrolling = true;
        
        const targetTop = sections[index].offsetTop;
        const startTop = container.scrollTop;
        const distance = targetTop - startTop;
        const duration = 1200; // 1.2s for slow elegant glide -> "수웅~"
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Quartic Ease In Out - steep acceleration and graceful deceleration
            const ease = progress < 0.5 
                ? 8 * progress * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 4) / 2;
                
            container.scrollTop = startTop + distance * ease;

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            } else {
                // Ensure exact landing pixel
                container.scrollTop = targetTop;
                setTimeout(() => { isScrolling = false; }, 100); // 100ms lock-out buffer to prevent instant next jump
            }
        }
        requestAnimationFrame(animation);
    }
});
