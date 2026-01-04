// ══════════════════════════════════════════════════════════════
// PORTFOLIO MINIMAL - JAVASCRIPT (VERSION AMÉLIORÉE)
// ══════════════════════════════════════════════════════════════

console.log('🚀 Début chargement JavaScript...');

// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM chargé !');
    
    // ══════════════════════════════════════════════════════════════
    // MENU MOBILE
    // ══════════════════════════════════════════════════════════════
    
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');
    
    console.log('🔍 Recherche éléments menu...');
    console.log('Bouton hamburger:', mobileMenuBtn);
    console.log('Navigation:', navLinks);
    
    if (mobileMenuBtn && navLinks) {
        console.log('✅ Bouton et navigation trouvés !');
        
        mobileMenuBtn.addEventListener('click', function() {
            console.log('🖱️ Clic sur le menu hamburger !');
            
            // Toggle classes
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            
            console.log('Menu actif ?', navLinks.classList.contains('active'));
            
            // Animation des barres du hamburger
            const spans = mobileMenuBtn.querySelectorAll('span');
            const isActive = mobileMenuBtn.classList.contains('active');
            
            spans.forEach(function(span, index) {
                if (isActive) {
                    // Forme X
                    if (index === 0) {
                        span.style.transform = 'rotate(45deg) translateY(9px)';
                    }
                    if (index === 1) {
                        span.style.opacity = '0';
                    }
                    if (index === 2) {
                        span.style.transform = 'rotate(-45deg) translateY(-9px)';
                    }
                } else {
                    // Forme hamburger
                    span.style.transform = '';
                    span.style.opacity = '';
                }
            });
        });
        
        console.log('✅ Event listener ajouté au menu !');
    } else {
        console.error('❌ ERREUR: Éléments du menu non trouvés !');
        if (!mobileMenuBtn) console.error('   - Bouton hamburger manquant (id="mobileMenuBtn")');
        if (!navLinks) console.error('   - Navigation manquante (class="nav-links")');
    }
    
    // ══════════════════════════════════════════════════════════════
    // SMOOTH SCROLL
    // ══════════════════════════════════════════════════════════════
    
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    console.log('🔍 Liens d\'ancrage trouvés:', anchorLinks.length);
    
    anchorLinks.forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignorer les liens vides
            if (href === '#') {
                return;
            }
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            console.log('🔗 Clic sur lien:', href);
            
            if (target) {
                console.log('✅ Section trouvée, scroll...');
                
                // Scroll smooth vers la section
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Fermer le menu mobile si ouvert
                if (navLinks && navLinks.classList.contains('active')) {
                    console.log('🔒 Fermeture du menu mobile...');
                    navLinks.classList.remove('active');
                    
                    if (mobileMenuBtn) {
                        mobileMenuBtn.classList.remove('active');
                        
                        const spans = mobileMenuBtn.querySelectorAll('span');
                        spans.forEach(function(span) {
                            span.style.transform = '';
                            span.style.opacity = '';
                        });
                    }
                }
            } else {
                console.warn('⚠️ Section non trouvée:', href);
            }
        });
    });
    
    console.log('✅ Smooth scroll configuré !');
    
    // ══════════════════════════════════════════════════════════════
    // ANIMATIONS AU SCROLL
    // ══════════════════════════════════════════════════════════════
    
    // Vérifier si IntersectionObserver est supporté
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);
        
        // Observer les cartes de projets et compétences
        const elementsToObserve = document.querySelectorAll('.project-card-minimal, .skill-group-minimal');
        console.log('👀 Éléments observés pour animations:', elementsToObserve.length);
        
        elementsToObserve.forEach(function(el) {
            observer.observe(el);
        });
        
        console.log('✅ Animations scroll configurées !');
    } else {
        console.warn('⚠️ IntersectionObserver non supporté');
    }
    
    // ══════════════════════════════════════════════════════════════
    // FERMETURE DU MENU EN CLIQUANT DEHORS
    // ══════════════════════════════════════════════════════════════
    
    document.addEventListener('click', function(e) {
        if (navLinks && navLinks.classList.contains('active')) {
            // Si clic en dehors du menu et du bouton
            if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                console.log('🔒 Fermeture menu (clic extérieur)');
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                
                const spans = mobileMenuBtn.querySelectorAll('span');
                spans.forEach(function(span) {
                    span.style.transform = '';
                    span.style.opacity = '';
                });
            }
        }
    });
    
    console.log('✅ Fermeture menu extérieur activée !');
    
    // ══════════════════════════════════════════════════════════════
    // FIN DU CHARGEMENT
    // ══════════════════════════════════════════════════════════════
    
    console.log('✨ Portfolio minimal chargé avec succès !');
    console.log('═══════════════════════════════════════════════════════════════');
});

// Log initial
console.log('📄 Fichier portfolio-minimal.js chargé');