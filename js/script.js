// Variables globales
let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
let currentBooking = {};

// Prix des chambres (en Ariary)
const roomPrices = {
    standard: 300000,
    'standard-jumeaux': 350000,
    deluxe: 450000,
    suite: 700000
};

// Données de toutes les chambres
const allRooms = [
    {
        id: 'standard-1',
        type: 'standard',
        name: 'Chambre Standard',
        description: 'Chambre confortable avec lit double, salle de bain privée et Wi-Fi gratuit.',
        price: 300000,
        capacity: 2,
        features: ['Lit double', 'Wi-Fi gratuit', 'TV écran plat', 'Salle de bain privée', 'Climatisation', 'Minibar'],
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'standard-2',
        type: 'standard-jumeaux',
        name: 'Chambre Standard Jumeaux',
        description: 'Chambre avec deux lits simples, idéale pour les voyages d\'affaires.',
        price: 350000,
        capacity: 2,
        features: ['Deux lits simples', 'Wi-Fi gratuit', 'TV écran plat', 'Salle de bain privée', 'Climatisation', 'Bureau'],
        image: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'deluxe-1',
        type: 'deluxe',
        name: 'Chambre Deluxe',
        description: 'Chambre spacieuse avec lit king-size, balcon et vue sur la ville.',
        price: 450000,
        capacity: 2,
        features: ['Lit king-size', 'Wi-Fi gratuit', 'TV 4K', 'Machine à café', 'Balcon', 'Climatisation'],
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'deluxe-2',
        type: 'deluxe',
        name: 'Chambre Deluxe Familiale',
        description: 'Chambre deluxe avec espace supplémentaire pour les familles.',
        price: 500000,
        capacity: 4,
        features: ['Lit king-size + canapé-lit', 'Wi-Fi gratuit', 'TV 4K', 'Machine à café', 'Balcon', 'Espace bureau'],
        image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'suite-1',
        type: 'suite',
        name: 'Suite Executive',
        description: 'Suite luxueuse avec salon séparé, jacuzzi et service premium.',
        price: 700000,
        capacity: 2,
        features: ['Lit king-size', 'Salon séparé', 'Jacuzzi', 'Mini-bar premium', 'Service premium', 'Balcon panoramique'],
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'suite-2',
        type: 'suite',
        name: 'Suite Présidentielle',
        description: 'La suite la plus luxueuse avec vue panoramique et services exclusifs.',
        price: 1000000,
        capacity: 4,
        features: ['Lit king-size', 'Salon spacieux', 'Jacuzzi privé', 'Service concierge', 'Balcon panoramique', 'Service de chambre 24/7'],
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    }
];

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Navigation mobile
    setupMobileMenu();
    
    // Smooth scrolling
    setupSmoothScrolling();
    
    // Animations navigation
    setupNavigationAnimations();
    
    // Formulaires
    setupBookingForms();
    
    // Contact form
    setupContactForm();
    
    // Validation des dates
    setupDateValidation();
    
    // Calcul du prix
    setupPriceCalculation();
    
    // Gestion du modal
    setupModal();
    
    // Gestion du paiement
    setupPaymentMethods();
    
    // Boutons de sélection de chambre
    setupRoomSelectionButtons();
    
    // Section disponibilité des chambres
    setupAvailabilitySection();

    // Gestion des vidéos de chambre
    setupRoomVideos();

    // Vidéo dans la card Deluxe
    setupDeluxeCardVideo();

    // Animations au scroll (reveal)
    setupScrollRevealAnimations();
}

// Menu mobile
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
}

// Smooth scrolling
function setupSmoothScrolling() {
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

// Animations navigation
function setupNavigationAnimations() {
    // Animation au chargement de la page
    animateNavOnLoad();
    
    // Animation au scroll
    animateNavOnScroll();
    
    // Animation au survol
    animateNavOnHover();
    
    // Animation de la section active
    updateActiveSection();
}

// Animation au chargement
function animateNavOnLoad() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link, index) => {
        // Style initial
        link.style.opacity = '0';
        link.style.transform = 'translateY(-20px)';
        
        // Animation avec délai progressif
        setTimeout(() => {
            link.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
        }, 100 + (index * 100));
    });
}

// Animation au scroll
function animateNavOnScroll() {
    let lastScrollY = window.scrollY;
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Effet de transparence au scroll
        if (currentScrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.backdropFilter = 'blur(20px)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
        
        // Animation des liens selon la direction du scroll
        if (currentScrollY > lastScrollY) {
            // Scroll vers le bas - les liens se rétractent légèrement
            navLinks.forEach(link => {
                link.style.transform = 'translateY(-2px) scale(0.98)';
            });
        } else {
            // Scroll vers le haut - les liens reviennent à la normale
            navLinks.forEach(link => {
                link.style.transform = 'translateY(0) scale(1)';
            });
        }
        
        lastScrollY = currentScrollY;
    });
}

// Animation au survol
function animateNavOnHover() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            // Animation d'entrée au survol
            this.style.transform = 'translateY(-3px) scale(1.05)';
            this.style.color = '#e74c3c';
            this.style.textShadow = '0 2px 8px rgba(231, 76, 60, 0.3)';
            
            // Animation du pseudo-élément ::after
            const afterElement = document.createElement('div');
            afterElement.className = 'nav-link-hover-effect';
            afterElement.style.cssText = `
                position: absolute;
                bottom: -5px;
                left: 0;
                width: 0;
                height: 2px;
                background: linear-gradient(90deg, #e74c3c, #c0392b);
                transition: width 0.3s ease;
            `;
            this.appendChild(afterElement);
            
            setTimeout(() => {
                afterElement.style.width = '100%';
            }, 10);
        });
        
        link.addEventListener('mouseleave', function() {
            // Animation de sortie du survol
            this.style.transform = 'translateY(0) scale(1)';
            this.style.color = '#333';
            this.style.textShadow = 'none';
            
            // Supprimer l'effet de survol
            const hoverEffect = this.querySelector('.nav-link-hover-effect');
            if (hoverEffect) {
                hoverEffect.style.width = '0';
                setTimeout(() => {
                    if (hoverEffect.parentNode) {
                        hoverEffect.parentNode.removeChild(hoverEffect);
                    }
                }, 300);
            }
        });
        
        // Animation au clic
        link.addEventListener('click', function(e) {
            // Effet de ripple
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(231, 76, 60, 0.3);
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
    });
}

// Mise à jour de la section active
function updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-100px 0px -100px 0px'
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetId = entry.target.getAttribute('id');
                const targetLink = document.querySelector(`.nav-link[href="#${targetId}"]`);
                
                // Retirer la classe active de tous les liens
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    link.style.color = '#333';
                    link.style.fontWeight = '500';
                });
                
                // Ajouter la classe active au lien correspondant
                if (targetLink) {
                    targetLink.classList.add('active');
                    targetLink.style.color = '#e74c3c';
                    targetLink.style.fontWeight = '600';
                    
                    // Animation spéciale pour la section active
                    targetLink.style.transform = 'translateY(-2px) scale(1.02)';
                    setTimeout(() => {
                        targetLink.style.transform = 'translateY(0) scale(1)';
                    }, 200);
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// Configuration des formulaires de réservation
function setupBookingForms() {
    // Formulaire rapide
    const quickBookingForm = document.getElementById('quickBookingForm');
    if (quickBookingForm) {
        quickBookingForm.addEventListener('submit', handleQuickBooking);
    }

    // Formulaire complet
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleFullBooking);
    }
}

// Gestion du formulaire rapide
function handleQuickBooking(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const booking = {
        checkin: formData.get('checkin'),
        checkout: formData.get('checkout'),
        guests: formData.get('guests'),
        roomType: formData.get('roomType')
    };

    if (!validateBookingDates(booking.checkin, booking.checkout)) {
        showError('Veuillez vérifier vos dates. La date de départ doit être postérieure à la date d\'arrivée.');
        return;
    }

    // Vérifier la disponibilité
    if (checkAvailability(booking)) {
        // Remplir le formulaire complet
        fillFullBookingForm(booking);
        // Scroller vers la section réservations
        document.getElementById('reservations').scrollIntoView({ behavior: 'smooth' });
    } else {
        showError('Désolé, cette chambre n\'est pas disponible pour les dates sélectionnées.');
    }
}

// Gestion du formulaire complet
function handleFullBooking(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
    
    const booking = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        checkin: formData.get('checkinFull'),
        checkout: formData.get('checkoutFull'),
        roomType: formData.get('roomTypeFull'),
        guests: formData.get('guestsFull'),
        specialRequests: formData.get('specialRequests'),
        paymentMethod: paymentMethod,
        id: 'RES-' + Date.now().toString().slice(-6),
        createdAt: new Date().toISOString()
    };

    if (!validateBooking(booking)) {
        return;
    }

    // Calculer le prix total
    booking.totalPrice = calculateTotalPrice(booking.checkin, booking.checkout, booking.roomType);
    booking.nights = calculateNights(booking.checkin, booking.checkout);

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading"></span> Traitement en cours...';

    // Sauvegarder la réservation
    saveReservation(booking);

    // Envoyer la notification par email
    sendBookingNotification(booking);

    // Afficher la confirmation
    showConfirmation(booking);
    
    // Réinitialiser le formulaire
    e.target.reset();
    document.getElementById('priceDetails').innerHTML = '<p>Veuillez sélectionner vos dates pour voir le prix total</p>';
    document.getElementById('paymentDetails').style.display = 'none';
    document.querySelectorAll('input[name="paymentMethod"]').forEach(r => r.checked = false);
    
    // Restaurer le bouton
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalContent;
}

// Validation des dates
function setupDateValidation() {
    const today = new Date().toISOString().split('T')[0];
    
    // Définir la date minimale pour tous les champs de date
    document.querySelectorAll('input[type="date"]').forEach(input => {
        input.setAttribute('min', today);
    });

    // Écouter les changements de dates pour le calcul du prix
    const checkinFull = document.getElementById('checkinFull');
    const checkoutFull = document.getElementById('checkoutFull');
    const roomTypeFull = document.getElementById('roomTypeFull');

    if (checkinFull && checkoutFull && roomTypeFull) {
        [checkinFull, checkoutFull, roomTypeFull].forEach(element => {
            element.addEventListener('change', updatePriceDisplay);
        });
    }
}

// Configuration du calcul du prix
function setupPriceCalculation() {
    updatePriceDisplay();
}

// Boutons de sélection de chambre (Réserver dans la galerie)
function setupRoomSelectionButtons() {
    document.querySelectorAll('[data-room-type]').forEach(btn => {
        btn.addEventListener('click', () => {
            const roomTypeFull = document.getElementById('roomTypeFull');
            const reservations = document.getElementById('reservations');
            
            if (roomTypeFull) roomTypeFull.value = btn.dataset.roomType;
            if (reservations) reservations.scrollIntoView({ behavior: 'smooth' });
            updatePriceDisplay();
        });
    });
}

// ============================================================
// SECTION DISPONIBILITÉ DES CHAMBRES
// ============================================================

function setupAvailabilitySection() {
    // Définir la date minimale
    const today = new Date().toISOString().split('T')[0];
    const checkinInput = document.getElementById('availCheckin');
    const checkoutInput = document.getElementById('availCheckout');
    if (checkinInput) checkinInput.min = today;
    if (checkoutInput) checkoutInput.min = today;

    // Bouton vérifier
    const btnCheck = document.getElementById('btnCheckAvailability');
    if (btnCheck) {
        btnCheck.addEventListener('click', filterRooms);
    }

    // Changement de dates => filtrage automatique
    if (checkinInput) checkinInput.addEventListener('change', filterRooms);
    if (checkoutInput) checkoutInput.addEventListener('change', filterRooms);

    // Afficher toutes les chambres au chargement
    renderAllRooms();
}

function renderAllRooms(filteredRooms) {
    const container = document.getElementById('availabilityResults');
    if (!container) return;

    const rooms = filteredRooms || allRooms;

    if (rooms.length === 0) {
        container.innerHTML = `
            <div class="no-rooms-found">
                <i class="fas fa-bed"></i>
                <h3>Aucune chambre disponible</h3>
                <p>Aucune chambre ne correspond à vos critères pour les dates sélectionnées.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = rooms.map(room => renderRoomCard(room)).join('');

    // Attacher les événements "Réserver"
    container.querySelectorAll('.room-book-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const roomId = btn.dataset.roomId;
            const room = allRooms.find(r => r.id === roomId);
            if (!room) return;

            // Remplir le formulaire complet
            const roomTypeFull = document.getElementById('roomTypeFull');
            const checkinFull = document.getElementById('checkinFull');
            const checkoutFull = document.getElementById('checkoutFull');
            const guestsFull = document.getElementById('guestsFull');
            const availCheckin = document.getElementById('availCheckin');
            const availCheckout = document.getElementById('availCheckout');
            const availGuests = document.getElementById('availGuests');

            if (roomTypeFull) roomTypeFull.value = room.type;
            if (checkinFull && availCheckin?.value) checkinFull.value = availCheckin.value;
            if (checkoutFull && availCheckout?.value) checkoutFull.value = availCheckout.value;
            if (guestsFull && availGuests?.value) guestsFull.value = availGuests.value;

            // Scroller vers le formulaire de réservation
            const reservations = document.getElementById('reservations');
            if (reservations) reservations.scrollIntoView({ behavior: 'smooth' });

            updatePriceDisplay();
        });
    });
}

function renderRoomCard(room) {
    const checkin = document.getElementById('availCheckin')?.value;
    const checkout = document.getElementById('availCheckout')?.value;
    const isAvailable = checkRoomAvailability(room.id, room.type, checkin, checkout);
    const hasDates = checkin && checkout;

    const featureIcons = {
        'Lit double': 'fa-bed',
        'Deux lits simples': 'fa-bed',
        'Lit king-size': 'fa-bed',
        'Lit king-size + canapé-lit': 'fa-bed',
        'Wi-Fi gratuit': 'fa-wifi',
        'TV écran plat': 'fa-tv',
        'TV 4K': 'fa-tv',
        'Salle de bain privée': 'fa-shower',
        'Climatisation': 'fa-snowflake',
        'Minibar': 'fa-glass-martini-alt',
        'Minibar premium': 'fa-glass-martini-alt',
        'Bureau': 'fa-desktop',
        'Machine à café': 'fa-coffee',
        'Balcon': 'fa-door-open',
        'Balcon panoramique': 'fa-door-open',
        'Salon séparé': 'fa-couch',
        'Salon spacieux': 'fa-couch',
        'Jacuzzi': 'fa-hot-tub',
        'Jacuzzi privé': 'fa-hot-tub',
        'Service premium': 'fa-concierge-bell',
        'Service concierge': 'fa-concierge-bell',
        'Espace bureau': 'fa-desktop',
        'Service de chambre 24/7': 'fa-concierge-bell'
    };

    const featuresHTML = room.features.slice(0, 5).map(f => {
        const icon = featureIcons[f] || 'fa-check';
        return `<li><i class="fas ${icon}"></i> ${f}</li>`;
    }).join('');

    let statusBadge = '';
    if (hasDates) {
        if (isAvailable) {
            statusBadge = '<span class="room-status available"><i class="fas fa-check-circle"></i> Disponible</span>';
        } else {
            statusBadge = '<span class="room-status unavailable"><i class="fas fa-times-circle"></i> Réservée</span>';
        }
    } else {
        statusBadge = '';
    }

    // Calculer le nombre de nuits et le total si dates sélectionnées
    let priceInfo = '';
    if (hasDates && isAvailable) {
        const nights = calculateNights(checkin, checkout);
        if (nights > 0) {
            const total = room.price * nights;
            priceInfo = `<div class="room-total"><span>${nights} nuit(s)</span> <strong>${total.toLocaleString()} Ar</strong></div>`;
        }
    }

    const btnDisabled = hasDates && !isAvailable;
    const btnClass = btnDisabled ? 'btn-disabled' : 'btn-primary';

    return `
        <div class="avail-room-card ${!isAvailable && hasDates ? 'room-booked' : ''}">
            <div class="avail-room-image">
                <img src="${room.image}" alt="${room.name}">
                <div class="avail-room-price">
                    <span class="price">${room.price.toLocaleString()} Ar</span>
                    <span>/nuit</span>
                </div>
                ${statusBadge}
            </div>
            <div class="avail-room-info">
                <h3>${room.name}</h3>
                <p>${room.description}</p>
                <div class="avail-room-meta">
                    <span><i class="fas fa-users"></i> ${room.capacity} personne(s)</span>
                    <span><i class="fas fa-tag"></i> ${room.type.charAt(0).toUpperCase() + room.type.slice(1)}</span>
                </div>
                <ul class="avail-room-features">
                    ${featuresHTML}
                </ul>
                ${priceInfo}
                <button class="${btnClass} room-book-btn" data-room-id="${room.id}" ${btnDisabled ? 'disabled' : ''}>
                    ${btnDisabled ? 'Non disponible' : '<i class="fas fa-calendar-check"></i> Réserver cette chambre'}
                </button>
            </div>
        </div>
    `;
}

function checkRoomAvailability(roomId, roomType, checkin, checkout) {
    if (!checkin || !checkout) return true;

    const requestedStart = new Date(checkin);
    const requestedEnd = new Date(checkout);

    if (requestedEnd <= requestedStart) return true;

    // Récupérer les réservations existantes
    const existingReservations = JSON.parse(localStorage.getItem('reservations')) || [];

    // Vérifier les conflits pour cette chambre (même type)
    const conflicting = existingReservations.filter(res => {
        if (res.roomType !== roomType) return false;
        
        const resStart = new Date(res.checkin);
        const resEnd = new Date(res.checkout);

        // Deux périodes se chevauchent si:
        // début1 < fin2 ET début2 < fin1
        return requestedStart < resEnd && resStart < requestedEnd;
    });

    // Pour simplifier: chaque type de chambre a 2 chambres disponibles
    // Standard: 2 chambres, Deluxe: 2 chambres, Suite: 2 chambres
    const maxRooms = 2;
    return conflicting.length < maxRooms;
}

function filterRooms() {
    const checkin = document.getElementById('availCheckin')?.value;
    const checkout = document.getElementById('availCheckout')?.value;
    const guests = document.getElementById('availGuests')?.value;

    let filtered = [...allRooms];

    // Filtrer par capacité
    if (guests) {
        const guestCount = parseInt(guests);
        filtered = filtered.filter(room => room.capacity >= guestCount);
    }

    // Filtrer par disponibilité (si dates sélectionnées)
    if (checkin && checkout) {
        const start = new Date(checkin);
        const end = new Date(checkout);

        if (end <= start) {
            showError('La date de départ doit être après la date d\'arrivée.');
            return;
        }

        filtered = filtered.filter(room => checkRoomAvailability(room.id, room.type, checkin, checkout));
    }

    renderAllRooms(filtered);
}

// Gestion des vidéos (Lecture/Pause au clic)
function setupRoomVideos() {
    const containers = document.querySelectorAll('.video-container');
    
    containers.forEach(container => {
        const video = container.querySelector('video');
        const card = container.closest('.video-card');

        container.style.cursor = 'pointer';

        container.addEventListener('click', () => {
            if (video.paused) {
                // Optionnel : Arrêter les autres vidéos qui tournent
                document.querySelectorAll('video').forEach(v => v.pause());
                
                video.play();
                card.classList.add('video-playing');
            } else {
                video.pause();
                card.classList.remove('video-playing');
            }
        });

        // Synchroniser si l'utilisateur utilise les contrôles natifs du navigateur
        video.addEventListener('play', () => card.classList.add('video-playing'));
        video.addEventListener('pause', () => card.classList.remove('video-playing'));
        video.addEventListener('ended', () => card.classList.remove('video-playing'));
    });
}

// Vidéo intégrée dans la card Chambre Deluxe
function setupDeluxeCardVideo() {
    const videoContainer = document.querySelector('.room-image-video');
    if (!videoContainer) return;

    const video = videoContainer.querySelector('video');
    if (!video) return;

    videoContainer.addEventListener('click', () => {
        if (video.paused) {
            video.muted = false;
            video.play();
            videoContainer.classList.add('video-playing');
        } else {
            video.pause();
            videoContainer.classList.remove('video-playing');
        }
    });

    video.addEventListener('play', () => videoContainer.classList.add('video-playing'));
    video.addEventListener('pause', () => videoContainer.classList.remove('video-playing'));
    video.addEventListener('ended', () => videoContainer.classList.remove('video-playing'));
}

// Mise à jour de l'affichage du prix
function updatePriceDisplay() {
    const checkin = document.getElementById('checkinFull').value;
    const checkout = document.getElementById('checkoutFull').value;
    const roomType = document.getElementById('roomTypeFull').value;
    const priceDetails = document.getElementById('priceDetails');

    if (checkin && checkout && roomType) {
        if (!validateBookingDates(checkin, checkout)) {
            priceDetails.innerHTML = '<p style="color: #e74c3c;">Veuillez vérifier vos dates.</p>';
            return;
        }

        const nights = calculateNights(checkin, checkout);
        const totalPrice = calculateTotalPrice(checkin, checkout, roomType);
        
        priceDetails.innerHTML = `
            <div style="text-align: left;">
                <p><strong>Type de chambre:</strong> ${getRoomTypeName(roomType)}</p>
                <p><strong>Prix par nuit:</strong> ${roomPrices[roomType].toLocaleString()} Ar</p>
                <p><strong>Nombre de nuits:</strong> ${nights}</p>
                <hr style="margin: 10px 0;">
                <p style="font-size: 1.2rem; color: #e74c3c;"><strong>Total:</strong> ${totalPrice.toLocaleString()} Ar</p>
            </div>
        `;
    } else {
        priceDetails.innerHTML = '<p>Veuillez sélectionner vos dates pour voir le prix total</p>';
    }
}

// Calcul du nombre de nuits
function calculateNights(checkin, checkout) {
    const start = new Date(checkin);
    const end = new Date(checkout);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Calcul du prix total
function calculateTotalPrice(checkin, checkout, roomType) {
    const nights = calculateNights(checkin, checkout);
    return roomPrices[roomType] * nights;
}

// Obtenir le nom du type de chambre
function getRoomTypeName(roomType) {
    const names = {
        standard: 'Standard',
        'standard-jumeaux': 'Standard Jumeaux',
        deluxe: 'Deluxe',
        suite: 'Suite'
    };
    return names[roomType] || roomType;
}

// Validation d'une réservation
function validateBooking(booking) {
    if (!booking.firstName || !booking.lastName || !booking.email || !booking.phone) {
        showError('Veuillez remplir tous les champs obligatoires.');
        return false;
    }

    if (!validateEmail(booking.email)) {
        showError('Veuillez entrer une adresse email valide.');
        return false;
    }

    if (!validatePhone(booking.phone)) {
        showError('Veuillez entrer un numéro de téléphone valide.');
        return false;
    }

    if (!validateBookingDates(booking.checkin, booking.checkout)) {
        showError('Veuillez vérifier vos dates. La date de départ doit être postérieure à la date d\'arrivée.');
        return false;
    }

    // Validation du mode de paiement
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    if (!paymentMethod) {
        showError('Veuillez sélectionner une méthode de paiement.');
        return false;
    }

    if (!validatePaymentMethod(paymentMethod.value)) {
        return false;
    }

    return true;
}

// Validation des champs de paiement
function validatePaymentMethod(method) {
    switch(method) {
        case 'mvola':
            const mvolaPhone = document.getElementById('mvolaPhone')?.value;
            const mvolaName = document.getElementById('mvolaName')?.value;
            const mvolaCode = document.getElementById('mvolaCode')?.value;
            if (!mvolaPhone || !mvolaName || !mvolaCode) {
                showError('Veuillez remplir tous les champs MVOLA.');
                return false;
            }
            if (mvolaCode.length < 4) {
                showError('Le code de confirmation MVOLA doit contenir au moins 4 caractères.');
                return false;
            }
            break;
        case 'orange-money':
            const orangePhone = document.getElementById('orangePhone')?.value;
            const orangeName = document.getElementById('orangeName')?.value;
            const orangeCode = document.getElementById('orangeCode')?.value;
            if (!orangePhone || !orangeName || !orangeCode) {
                showError('Veuillez remplir tous les champs Orange Money.');
                return false;
            }
            if (orangeCode.length < 4) {
                showError('Le code de confirmation Orange Money doit contenir au moins 4 caractères.');
                return false;
            }
            break;
        case 'airtel-money':
            const airtelPhone = document.getElementById('airtelPhone')?.value;
            const airtelName = document.getElementById('airtelName')?.value;
            const airtelCode = document.getElementById('airtelCode')?.value;
            if (!airtelPhone || !airtelName || !airtelCode) {
                showError('Veuillez remplir tous les champs Airtel Money.');
                return false;
            }
            if (airtelCode.length < 4) {
                showError('Le code de confirmation Airtel Money doit contenir au moins 4 caractères.');
                return false;
            }
            break;
        case 'visa':
            const cardNumber = document.getElementById('cardNumber')?.value;
            const cardExpiry = document.getElementById('cardExpiry')?.value;
            const cardCvv = document.getElementById('cardCvv')?.value;
            const cardName = document.getElementById('cardName')?.value;
            if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
                showError('Veuillez remplir tous les champs de la carte bancaire.');
                return false;
            }
            if (cardNumber.replace(/\s/g, '').length < 13) {
                showError('Numéro de carte invalide.');
                return false;
            }
            if (cardCvv.length !== 3) {
                showError('CVV invalide (3 chiffres).');
                return false;
            }
            break;
        default:
            showError('Méthode de paiement non reconnue.');
            return false;
    }
    return true;
}

// Validation des dates
function validateBookingDates(checkin, checkout) {
    if (!checkin || !checkout) return false;
    
    const start = new Date(checkin);
    const end = new Date(checkout);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return start >= today && end > start;
}

// Validation email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validation téléphone
function validatePhone(phone) {
    const re = /^[\d\s\+\-\(\)]+$/;
    return re.test(phone) && phone.length >= 10;
}

// Vérification de disponibilité
function checkAvailability(booking) {
    // Simuler une vérification de disponibilité
    // En réalité, cela vérifierait contre une base de données
    return true;
}

// Remplir le formulaire complet
function fillFullBookingForm(booking) {
    document.getElementById('checkinFull').value = booking.checkin;
    document.getElementById('checkoutFull').value = booking.checkout;
    document.getElementById('roomTypeFull').value = booking.roomType;
    document.getElementById('guestsFull').value = booking.guests;
    
    // Mettre à jour l'affichage du prix
    updatePriceDisplay();
}

// Sauvegarder une réservation
function saveReservation(booking) {
    reservations.push(booking);
    localStorage.setItem('reservations', JSON.stringify(reservations));
    console.log('Réservation sauvegardée:', booking);
}

// Afficher la confirmation
function showConfirmation(booking) {
    const modal = document.getElementById('confirmationModal');
    const message = document.getElementById('confirmationMessage');
    
    message.innerHTML = `
        <div style="text-align: left;">
            <p><strong>Nom:</strong> ${booking.firstName} ${booking.lastName}</p>
            <p><strong>Email:</strong> ${booking.email}</p>
            <p><strong>Téléphone:</strong> ${booking.phone}</p>
            <p><strong>Date d'arrivée:</strong> ${formatDate(booking.checkin)}</p>
            <p><strong>Date de départ:</strong> ${formatDate(booking.checkout)}</p>
            <p><strong>Type de chambre:</strong> ${getRoomTypeName(booking.roomType)}</p>
            <p><strong>Nombre de personnes:</strong> ${booking.guests}</p>
            <p><strong>Nombre de nuits:</strong> ${booking.nights}</p>
            <p style="font-size: 1.2rem; color: #e74c3c;"><strong>Total:</strong> ${booking.totalPrice.toLocaleString()} Ar</p>
            ${booking.specialRequests ? `<p><strong>Demandes spéciales:</strong> ${booking.specialRequests}</p>` : ''}
            <p style="margin-top: 15px; color: #27ae60;"><strong>Numéro de réservation:</strong> #${booking.id}</p>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Configuration du modal
function setupModal() {
    const modal = document.getElementById('confirmationModal');
    const closeBtn = document.querySelector('.close');

    closeBtn.addEventListener('click', closeModal);

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
}

// Fermer le modal
function closeModal() {
    document.getElementById('confirmationModal').style.display = 'none';
}

// Configuration du formulaire de contact
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
}

// Gestion du formulaire de contact
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const contact = {
        name: formData.get('contactName'),
        email: formData.get('contactEmail'),
        message: formData.get('contactMessage'),
        createdAt: new Date().toISOString()
    };

    if (!contact.name || !contact.email || !contact.message) {
        showError('Veuillez remplir tous les champs du formulaire.');
        return;
    }

    if (!validateEmail(contact.email)) {
        showError('Veuillez entrer une adresse email valide.');
        return;
    }

    // Simuler l'envoi du message
    console.log('Message de contact:', contact);
    
    // Afficher un message de succès
    showSuccess('Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.');
    
    // Réinitialiser le formulaire
    e.target.reset();
}

// Réserver une chambre depuis la galerie
function bookRoom(roomType) {
    // Remplir le type de chambre dans le formulaire complet
    document.getElementById('roomTypeFull').value = roomType;
    
    // Scroller vers la section réservations
    document.getElementById('reservations').scrollIntoView({ behavior: 'smooth' });
    
    // Mettre à jour l'affichage du prix si les dates sont déjà sélectionnées
    updatePriceDisplay();
}

// Envoi de la notification de réservation par email
async function sendBookingNotification(booking) {
    try {
        console.log('Envoi de la notification par email pour:', booking.email);
        
        const notificationHTML = generateBookingNotificationHTML(booking);
        
        const emailData = {
            to_email: booking.email,
            subject: `Confirmation de Réservation #${booking.id} - Hôtel le Bonheur`,
            html: notificationHTML,
            booking_id: booking.id,
            customer_name: `${booking.firstName} ${booking.lastName}`,
            total_amount: booking.totalPrice.toLocaleString() + ' Ar'
        };

        if (typeof window.sendEmailWithServiceFromConfig === 'function') {
            const result = await window.sendEmailWithServiceFromConfig(emailData);
            console.log('Email envoyé avec succès:', result);
        } else {
            console.log('Simulation d\'envoi d\'email:', emailData);
        }
    } catch (error) {
        console.error('Erreur lors de l\'envoi de la notification:', error);
        console.warn('La réservation est confirmée mais l\'email n\'a pas pu être envoyé');
    }
}

// Génère le HTML de la fiche de notification
function generateBookingNotificationHTML(booking) {
    const checkinDate = new Date(booking.checkin).toLocaleDateString('fr-FR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    const checkoutDate = new Date(booking.checkout).toLocaleDateString('fr-FR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const paymentNames = {
        'mvola': 'MVOLA',
        'orange-money': 'Orange Money',
        'airtel-money': 'Airtel Money',
        'visa': 'Carte Visa'
    };
    const paymentName = paymentNames[booking.paymentMethod] || booking.paymentMethod;

    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white;">
            <div style="background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; padding: 30px 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 28px;">FICHE DE RÉSERVATION</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Hôtel le Bonheur - Merci pour votre confiance !</p>
            </div>
            <div style="padding: 30px 20px;">
                <div style="background: #f8f9fa; border-left: 4px solid #e74c3c; padding: 20px; margin: 20px 0;">
                    <p><strong>N° Réservation:</strong> #${booking.id}</p>
                    <p><strong>Client:</strong> ${booking.firstName} ${booking.lastName}</p>
                    <p><strong>Email:</strong> ${booking.email}</p>
                    <p><strong>Téléphone:</strong> ${booking.phone}</p>
                </div>
                <div style="background: #f8f9fa; border-left: 4px solid #e74c3c; padding: 20px; margin: 20px 0;">
                    <p><strong>Chambre:</strong> ${getRoomTypeName(booking.roomType)}</p>
                    <p><strong>Arrivée:</strong> ${checkinDate}</p>
                    <p><strong>Départ:</strong> ${checkoutDate}</p>
                    <p><strong>Personnes:</strong> ${booking.guests}</p>
                </div>
                <div style="background: #e8f5e8; border: 1px solid #27ae60; padding: 15px; margin: 20px 0; border-radius: 5px;">
                    <p style="color: #27ae60; margin: 0;"><strong>Paiement:</strong> ${paymentName}</p>
                </div>
                <div style="background: #2c3e50; color: white; padding: 20px; text-align: center; font-size: 18px; font-weight: bold;">
                    MONTANT TOTAL: ${booking.totalPrice.toLocaleString()} Ar
                </div>
            </div>
            <div style="background: #34495e; color: white; padding: 20px; text-align: center; font-size: 14px;">
                <p><strong>HÔTEL LE BONHEUR</strong></p>
                <p>Antananarivo, Madagascar</p>
                <p>+261 34 12 345 67 | reservation@hotellebonheure.mg</p>
            </div>
        </div>
    `;
}

// Afficher un message d'erreur
function showError(message) {
    showMessage(message, 'error');
}

// Afficher un message de succès
function showSuccess(message) {
    showMessage(message, 'success');
}

// Afficher un message générique
function showMessage(message, type) {
    // Créer l'élément de message
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 3000;
        padding: 15px 20px;
        border-radius: 8px;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease-out;
    `;

    // Ajouter au corps du document
    document.body.appendChild(messageDiv);

    // Supprimer après 5 secondes
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 300);
    }, 5000);
}

// Formater une date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

// Obtenir les réservations
function getReservations() {
    return JSON.parse(localStorage.getItem('reservations')) || [];
}

// Supprimer une réservation
function deleteReservation(id) {
    reservations = reservations.filter(r => r.id !== id);
    localStorage.setItem('reservations', JSON.stringify(reservations));
}

// Exporter les réservations (pour administration)
function exportReservations() {
    const dataStr = JSON.stringify(reservations, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `reservations_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Styles pour les animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Gestion des méthodes de paiement
function setupPaymentMethods() {
    const paymentRadios = document.querySelectorAll('.payment-radio');
    const paymentDetails = document.getElementById('paymentDetails');
    
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                showPaymentDetails(this.value);
            }
        });
    });
}

function showPaymentDetails(method) {
    const paymentDetails = document.getElementById('paymentDetails');
    paymentDetails.style.display = 'block';
    
    let detailsHTML = '';
    
    switch(method) {
        case 'mvola':
            detailsHTML = `
                <h4>Détails de paiement MVOLA</h4>
                <div class="form-row">
                    <div class="form-group">
                        <label for="mvolaPhone">Numéro MVOLA</label>
                        <input type="tel" id="mvolaPhone" name="mvolaPhone" placeholder="034 XX XXX XX" required>
                    </div>
                    <div class="form-group">
                        <label for="mvolaName">Nom du titulaire</label>
                        <input type="text" id="mvolaName" name="mvolaName" placeholder="Nom complet" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="mvolaCode">Code de confirmation</label>
                    <input type="text" id="mvolaCode" name="mvolaCode" placeholder="Entrez le code reçu par SMS" required>
                </div>
                <p style="font-size: 0.9rem; color: #666; margin-top: 1rem;">
                    <i class="fas fa-info-circle"></i> 
                    Vous recevrez un code de confirmation par SMS pour valider le paiement.
                </p>
                <button type="button" class="payment-button" onclick="processMobileMoneyPayment('mvola')">
                    <i class="fas fa-mobile-alt"></i> Payer avec MVOLA
                </button>
            `;
            break;
            
        case 'orange-money':
            detailsHTML = `
                <h4>Détails de paiement Orange Money</h4>
                <div class="form-row">
                    <div class="form-group">
                        <label for="orangePhone">Numéro Orange Money</label>
                        <input type="tel" id="orangePhone" name="orangePhone" placeholder="032 XX XXX XX" required>
                    </div>
                    <div class="form-group">
                        <label for="orangeName">Nom du titulaire</label>
                        <input type="text" id="orangeName" name="orangeName" placeholder="Nom complet" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="orangeCode">Code de confirmation</label>
                    <input type="text" id="orangeCode" name="orangeCode" placeholder="Entrez le code reçu par SMS" required>
                </div>
                <p style="font-size: 0.9rem; color: #666; margin-top: 1rem;">
                    <i class="fas fa-info-circle"></i> 
                    Vous recevrez un code de confirmation par SMS pour valider le paiement.
                </p>
                <button type="button" class="payment-button" onclick="processMobileMoneyPayment('orange-money')">
                    <i class="fas fa-mobile-alt"></i> Payer avec Orange Money
                </button>
            `;
            break;
            
        case 'airtel-money':
            detailsHTML = `
                <h4>Détails de paiement Airtel Money</h4>
                <div class="form-row">
                    <div class="form-group">
                        <label for="airtelPhone">Numéro Airtel Money</label>
                        <input type="tel" id="airtelPhone" name="airtelPhone" placeholder="033 XX XXX XX" required>
                    </div>
                    <div class="form-group">
                        <label for="airtelName">Nom du titulaire</label>
                        <input type="text" id="airtelName" name="airtelName" placeholder="Nom complet" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="airtelCode">Code de confirmation</label>
                    <input type="text" id="airtelCode" name="airtelCode" placeholder="Entrez le code reçu par SMS" required>
                </div>
                <p style="font-size: 0.9rem; color: #666; margin-top: 1rem;">
                    <i class="fas fa-info-circle"></i> 
                    Vous recevrez un code de confirmation par SMS pour valider le paiement.
                </p>
                <button type="button" class="payment-button" onclick="processMobileMoneyPayment('airtel-money')">
                    <i class="fas fa-mobile-alt"></i> Payer avec Airtel Money
                </button>
            `;
            break;
            
        case 'visa':
            detailsHTML = `
                <h4>Détails de carte bancaire</h4>
                <div class="form-group">
                    <label for="cardNumber">Numéro de carte</label>
                    <input type="text" id="cardNumber" name="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="cardExpiry">Date d'expiration</label>
                        <input type="text" id="cardExpiry" name="cardExpiry" placeholder="MM/AA" maxlength="5" required>
                    </div>
                    <div class="form-group">
                        <label for="cardCvv">CVV</label>
                        <input type="text" id="cardCvv" name="cardCvv" placeholder="123" maxlength="3" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="cardName">Nom sur la carte</label>
                    <input type="text" id="cardName" name="cardName" placeholder="NOM COMPLET" required>
                </div>
                <p style="font-size: 0.9rem; color: #666; margin-top: 1rem;">
                    <i class="fas fa-lock"></i> 
                    Paiement sécurisé via SSL. Vos informations bancaires sont protégées.
                </p>
                <button type="button" class="payment-button" onclick="processCardPayment()">
                    <i class="fab fa-cc-visa"></i> Payer avec Visa
                </button>
            `;
            break;
    }
    
    paymentDetails.innerHTML = detailsHTML;
    
    // Ajouter les écouteurs d'événements pour les nouveaux champs
    setupPaymentInputListeners();
}

function setupPaymentInputListeners() {
    // Formatter le numéro de carte
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }
    
    // Formatter la date d'expiration
    const cardExpiry = document.getElementById('cardExpiry');
    if (cardExpiry) {
        cardExpiry.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }
    
    // N'autoriser que les chiffres pour le CVV
    const cardCvv = document.getElementById('cardCvv');
    if (cardCvv) {
        cardCvv.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
    
    // Formatter les numéros de téléphone mobile money
    const phoneInputs = document.querySelectorAll('input[name$="Phone"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 10) {
                value = value.slice(0, 10);
            }
            e.target.value = value;
        });
    });
}

function processMobileMoneyPayment(provider) {
    // Map provider to the correct input ID prefix used in showPaymentDetails
    const prefixMap = {
        'mvola': 'mvola',
        'orange-money': 'orange',
        'airtel-money': 'airtel'
    };
    const prefix = prefixMap[provider] || provider.replace('-', '');
    
    const phoneInput = document.getElementById(prefix + 'Phone');
    const nameInput = document.getElementById(prefix + 'Name');
    const codeInput = document.getElementById(prefix + 'Code');
    
    if (!phoneInput?.value || !nameInput?.value || !codeInput?.value) {
        showError('Veuillez remplir tous les champs pour le paiement.');
        return;
    }
    
    // Simuler le traitement du paiement
    showProcessingPayment();
    
    setTimeout(() => {
        // Simuler une confirmation de paiement réussi
        hideProcessingPayment();
        showSuccess(`Paiement ${provider.toUpperCase()} traité avec succès!`);
        
        // Ajouter les informations de paiement à la réservation
        currentBooking.paymentMethod = provider;
        currentBooking.paymentInfo = {
            phone: phoneInput.value,
            name: nameInput.value,
            status: 'paid'
        };
    }, 2000);
}

function processCardPayment() {
    const cardNumber = document.getElementById('cardNumber')?.value;
    const cardExpiry = document.getElementById('cardExpiry')?.value;
    const cardCvv = document.getElementById('cardCvv')?.value;
    const cardName = document.getElementById('cardName')?.value;
    
    if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
        showError('Veuillez remplir tous les champs de la carte bancaire.');
        return;
    }
    
    // Validation basique de la carte
    if (cardNumber.replace(/\s/g, '').length !== 16) {
        showError('Numéro de carte invalide.');
        return;
    }
    
    if (cardCvv.length !== 3) {
        showError('CVV invalide.');
        return;
    }
    
    // Simuler le traitement du paiement
    showProcessingPayment();
    
    setTimeout(() => {
        hideProcessingPayment();
        showSuccess('Paiement par carte Visa traité avec succès!');
        
        // Ajouter les informations de paiement à la réservation
        currentBooking.paymentMethod = 'visa';
        currentBooking.paymentInfo = {
            cardNumber: '****-****-****-' + cardNumber.slice(-4),
            cardName: cardName,
            status: 'paid'
        };
    }, 2000);
}

function showProcessingPayment() {
    const processingDiv = document.createElement('div');
    processingDiv.id = 'processingPayment';
    processingDiv.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; padding: 2rem; border-radius: 15px; text-align: center;">
                <div class="loading" style="margin: 0 auto 1rem;"></div>
                <h3>Traitement du paiement...</h3>
                <p>Veuillez patienter pendant que nous traitons votre paiement.</p>
            </div>
        </div>
    `;
    document.body.appendChild(processingDiv);
}

function hideProcessingPayment() {
    const processingDiv = document.getElementById('processingPayment');
    if (processingDiv) {
        processingDiv.remove();
    }
}

// ==========================================
// Scroll Reveal Animations (Intersection Observer)
// ==========================================
function setupScrollRevealAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                
                const cards = entry.target.querySelectorAll('.room-card, .avail-room-card');
                cards.forEach(card => {
                    card.classList.add('revealed');
                });

                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.rooms, .availability').forEach(section => {
        revealObserver.observe(section);
    });

    const cardObserverOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.05
    };

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                cardObserver.unobserve(entry.target);
            }
        });
    }, cardObserverOptions);

    document.querySelectorAll('.room-card, .avail-room-card').forEach(card => {
        cardObserver.observe(card);
    });
}
