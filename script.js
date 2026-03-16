document.addEventListener("DOMContentLoaded", function() {
    // 1. Mobile Menu Toggle
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const navItems = document.querySelectorAll(".nav-links li a");

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

    // Close menu when clicking link
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navLinks.classList.remove("active");
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
    const sections = document.querySelectorAll(".panel");
    const container = document.querySelector(".container");

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

                // Trigger General Animations
                const animatedElements = entry.target.querySelectorAll('.fade-up, .text-reveal, .list-item, .grid-box');
                animatedElements.forEach(el => el.classList.add('visible'));

                // Handle specific Word Reveal animation (Quote Section)
                if (id === 'quote') {
                    const words = entry.target.querySelectorAll('.word');
                    words.forEach((w, idx) => {
                        setTimeout(() => {
                            w.classList.add('visible');
                        }, 100 * idx); // Stagger word appear speed
                    });
                }

                // Header & Hamburger Color theme switch
                const isDark = entry.target.classList.contains('dark-bg');
                const bars = document.querySelectorAll('.bar');
                const logo = document.querySelector('.logo');
                
                if(isDark && (!hamburger || !hamburger.classList.contains('active'))) {
                    bars.forEach(b => b.style.backgroundColor = 'var(--text-light)');
                    logo.style.color = 'var(--text-light)';
                    navItems.forEach(item => item.style.color = 'var(--text-light)');
                    if(targetLink) targetLink.style.color = 'var(--accent)'; 
                } else {
                    bars.forEach(b => b.style.backgroundColor = 'var(--text-dark)');
                    logo.style.color = 'var(--accent)';
                    navItems.forEach(item => {
                        item.style.color = '#666';
                        if(item.classList.contains('active')) item.style.color = 'var(--accent)';
                    });
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));
});
