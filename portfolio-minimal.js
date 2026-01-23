

document.addEventListener('DOMContentLoaded', function() {
    // --- 1. GESTION DU MENU MOBILE (AVEC CROIX) ---
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        const menuIcon = mobileMenuBtn.querySelector('i');

        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = navLinks.classList.toggle('active');
            
            // Changement d'icône : Bars <-> Times (Croix)
            if (isOpen) {
                menuIcon.classList.replace('fa-bars', 'fa-times');
            } else {
                menuIcon.classList.replace('fa-times', 'fa-bars');
            }
        });

        // Fermer le menu au clic sur un lien
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuIcon.classList.replace('fa-times', 'fa-bars');
            });
        });

        // Fermer le menu si on clique n'importe où ailleurs
        document.addEventListener('click', function(e) {
            if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navLinks.classList.remove('active');
                menuIcon.classList.replace('fa-times', 'fa-bars');
            }
        });
    }

    // --- 2. SMOOTH SCROLL (DÉFILEMENT FLUIDE) ---
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

    // --- 3. ANIMATION D'APPARITION AU SCROLL ---
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

    // Cible tous les éléments à animer
    const animatedElements = document.querySelectorAll('.project-card, .skill-group, .feature-card, .insight-card, .info-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});

// document.addEventListener('DOMContentLoaded', function() {
//     const mobileMenuBtn = document.getElementById('mobileMenuBtn');
//     const navLinks = document.querySelector('.nav-links');
//     const links = document.querySelectorAll('.nav-link');

//     // 1. Toggle Menu Mobile
//     if (mobileMenuBtn && navLinks) {
//         mobileMenuBtn.addEventListener('click', function(e) {
//             e.stopPropagation();
//             navLinks.classList.toggle('active');
//             mobileMenuBtn.classList.toggle('active');
//         });

//         // 2. Fermer le menu au clic sur un lien
//         links.forEach(link => {
//             link.addEventListener('click', () => {
//                 navLinks.classList.remove('active');
//                 mobileMenuBtn.classList.remove('active');
//             });
//         });

//         // 3. Fermer le menu si on clique n'importe où ailleurs sur l'écran
//         document.addEventListener('click', function(e) {
//             if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
//                 navLinks.classList.remove('active');
//                 mobileMenuBtn.classList.remove('active');
//             }
//         });
//     }

//     // 4. Animation d'apparition au scroll (Optionnel mais propre)
//     const observerOptions = {
//         threshold: 0.1
//     };

//     const observer = new IntersectionObserver((entries) => {
//         entries.forEach(entry => {
//             if (entry.isIntersecting) {
//                 entry.target.style.opacity = '1';
//                 entry.target.style.transform = 'translateY(0)';
//             }
//         });
//     }, observerOptions);

//     document.querySelectorAll('.project-card, .skill-group').forEach(el => {
//         el.style.opacity = '0';
//         el.style.transform = 'translateY(20px)';
//         el.style.transition = 'all 0.6s ease-out';
//         observer.observe(el);
//     });
// });




// ══════════════════════════════════════════════════════════════
// PORTFOLIO DHELLYE - JAVASCRIPT RESPONSIVE
// ══════════════════════════════════════════════════════════════

// document.addEventListener('DOMContentLoaded', function() {
//     console.log('✅ Portfolio chargé !');
    
    // ══════════════════════════════════════════════════════════════
    // MENU MOBILE
    // ══════════════════════════════════════════════════════════════
    
    // const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    // const navLinks = document.querySelector('.nav-links');
    
    // if (mobileMenuBtn && navLinks) {
    //     // Toggle du menu au clic sur le bouton hamburger
    //     mobileMenuBtn.addEventListener('click', function(e) {
    //         e.stopPropagation();
            
    //         // Toggle classes
    //         navLinks.classList.toggle('active');
    //         mobileMenuBtn.classList.toggle('active');
            
    //         console.log('Menu mobile:', navLinks.classList.contains('active') ? 'ouvert' : 'fermé');
    //     });
        
    //     // Fermer le menu en cliquant sur un lien
    //     navLinks.querySelectorAll('a').forEach(function(link) {
    //         link.addEventListener('click', function() {
    //             navLinks.classList.remove('active');
    //             mobileMenuBtn.classList.remove('active');
    //         });
    //     });
        
    //     // Fermer le menu en cliquant en dehors
    //     document.addEventListener('click', function(e) {
    //         if (navLinks.classList.contains('active')) {
    //             if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
    //                 navLinks.classList.remove('active');
    //                 mobileMenuBtn.classList.remove('active');
    //             }
    //         }
    //     });
        
    //     // Fermer le menu avec la touche Escape
    //     document.addEventListener('keydown', function(e) {
    //         if (e.key === 'Escape' && navLinks.classList.contains('active')) {
    //             navLinks.classList.remove('active');
    //             mobileMenuBtn.classList.remove('active');
    //         }
    //     });
    // }
    
    // ══════════════════════════════════════════════════════════════
    // SMOOTH SCROLL AVEC OFFSET POUR NAVBAR FIXE
    // ══════════════════════════════════════════════════════════════
    
    // document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    //     anchor.addEventListener('click', function(e) {
    //         const href = this.getAttribute('href');
            
    //         // Ignorer les liens vides ou "#"
    //         if (!href || href === '#') return;
            
    //         const target = document.querySelector(href);
            
    //         if (target) {
    //             e.preventDefault();
                
    //             // Calculer l'offset pour la navbar fixe
    //             const nav = document.querySelector('.nav');
    //             const navHeight = nav ? nav.offsetHeight : 0;
    //             const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                
    //             window.scrollTo({
    //                 top: targetPosition,
    //                 behavior: 'smooth'
    //             });
    //         }
    //     });
    // });
    
    // ══════════════════════════════════════════════════════════════
    // ANIMATIONS AU SCROLL (INTERSECTION OBSERVER)
    // ══════════════════════════════════════════════════════════════
    
    // if ('IntersectionObserver' in window) {
    //     const observerOptions = {
    //         threshold: 0.1,
    //         rootMargin: '0px 0px -50px 0px'
    //     };
        
    //     const observer = new IntersectionObserver(function(entries) {
    //         entries.forEach(function(entry) {
    //             if (entry.isIntersecting) {
    //                 entry.target.style.opacity = '1';
    //                 entry.target.style.transform = 'translateY(0)';
    //                 // Optionnel: arrêter d'observer une fois animé
    //                 // observer.unobserve(entry.target);
    //             }
    //         });
    //     }, observerOptions);
        
    //     // Sélectionner tous les éléments à animer
    //     const elementsToAnimate = document.querySelectorAll(
    //         '.project-card, .skill-group, .feature-card, .insight-card, .info-card'
    //     );
        
    //     elementsToAnimate.forEach(function(el, index) {
    //         el.style.opacity = '0';
    //         el.style.transform = 'translateY(30px)';
    //         el.style.transition = 'opacity 0.6s ease ' + (index * 0.1) + 's, transform 0.6s ease ' + (index * 0.1) + 's';
    //         observer.observe(el);
    //     });
        
    //     console.log('✅ Animations scroll configurées pour', elementsToAnimate.length, 'éléments');
    // }
    
    // ══════════════════════════════════════════════════════════════
    // EFFET DE SHADOW SUR LA NAVBAR AU SCROLL
    // ══════════════════════════════════════════════════════════════
    
    // const nav = document.querySelector('.nav');
    // let ticking = false;
    
    // window.addEventListener('scroll', function() {
    //     if (!ticking) {
    //         window.requestAnimationFrame(function() {
    //             if (window.pageYOffset > 50) {
    //                 nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
    //             } else {
    //                 nav.style.boxShadow = 'none';
    //             }
    //             ticking = false;
    //         });
    //         ticking = true;
    //     }
    // });
    
    // ══════════════════════════════════════════════════════════════
    // GESTION DU REDIMENSIONNEMENT (fermer menu mobile si on passe en desktop)
    // ══════════════════════════════════════════════════════════════
    
//     let resizeTimeout;
//     window.addEventListener('resize', function() {
//         clearTimeout(resizeTimeout);
//         resizeTimeout = setTimeout(function() {
//             if (window.innerWidth > 768 && navLinks && navLinks.classList.contains('active')) {
//                 navLinks.classList.remove('active');
//                 if (mobileMenuBtn) {
//                     mobileMenuBtn.classList.remove('active');
//                 }
//             }
//         }, 100);
//     });
    
//     console.log('✨ Portfolio prêt !');
//});
