/**
 * Fichier principal d'initialisation de l'application
 * Corrige tous les bugs et assure le bon fonctionnement
 */

// Importations des modules
import { ROOM_TYPES } from './constants.js';
import { 
    calculateTotalPrice, 
    calculateNights, 
    getRoomTypeName, 
    saveReservation 
} from './data-manager.js';
import { validateBooking } from './validation.js';

// Variables globales
let currentBooking = null;

/**
 * Initialise l'application complète
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initialisation de l\'application...');
    
    // Initialiser toutes les fonctionnalités
    initializeApp();
    
    // S'assurer que EmailJS est chargé
    if (typeof emailjs !== 'undefined') {
        console.log('EmailJS est disponible');
    } else {
        console.warn('EmailJS n\'est pas chargé');
    }
});

/**
 * Initialise tous les composants de l'interface utilisateur
 */
function initializeApp() {
    setupMobileMenu();
    setupSmoothScrolling();
    setupBookingForms();
    setupContactForm();
    setupDateValidation();
    setupModal();
    setupRoomSelectionButtons();
    setupNavigationAnimations();
    setupPaymentMethods();
}

/**
 * Gère le menu hamburger sur mobile
 */
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

/**
 * Active le défilement fluide pour les ancres
 */
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

/**
 * Configure les formulaires de réservation (rapide et complet)
 */
function setupBookingForms() {
    // Formulaire de vérification rapide
    const quickForm = document.getElementById('quickBookingForm');
    if (quickForm) {
        quickForm.addEventListener('submit', handleQuickBooking);
    }

    // Formulaire de réservation complet
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleFullBooking);
    }
}

/**
 * Gère la réservation rapide
 */
function handleQuickBooking(e) {
    e.preventDefault();
    console.log('Réservation rapide soumise');
    
    const formData = new FormData(e.target);
    
    // Transférer les données vers le formulaire complet
    const checkinFull = document.getElementById('checkinFull');
    const checkoutFull = document.getElementById('checkoutFull');
    const roomTypeFull = document.getElementById('roomTypeFull');
    const guestsFull = document.getElementById('guestsFull');
    
    if (checkinFull) checkinFull.value = formData.get('checkin');
    if (checkoutFull) checkoutFull.value = formData.get('checkout');
    if (roomTypeFull) roomTypeFull.value = formData.get('roomType');
    if (guestsFull) guestsFull.value = formData.get('guests');
    
    // Scroller vers le formulaire complet
    const reservationsSection = document.getElementById('reservations');
    if (reservationsSection) {
        reservationsSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Mettre à jour l'affichage du prix
    updatePriceDisplay();
    
    // Afficher un message de confirmation
    showSuccess('Veuillez compléter vos informations personnelles pour finaliser la réservation.');
}

/**
 * Gère la réservation complète
 */
function handleFullBooking(e) {
    e.preventDefault();
    console.log('Réservation complète soumise');
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
    
    // Mapper les données du formulaire
    const booking = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        checkin: formData.get('checkinFull'),
        checkout: formData.get('checkoutFull'),
        roomType: formData.get('roomTypeFull'),
        roomTypeName: getRoomTypeName(formData.get('roomTypeFull')),
        guests: formData.get('guestsFull'),
        paymentMethod: paymentMethod,
        totalPrice: calculateTotalPrice(formData.get('checkinFull'), formData.get('checkoutFull'), formData.get('roomTypeFull')),
        id: 'RES-' + Date.now().toString().slice(-6)
    };
    
    console.log('Données de réservation:', booking);
    
    // Validation
    if (!validateBooking(booking, showError)) {
        return;
    }
    
    // État de chargement
    const originalContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading"></span> Traitement en cours...';
    
    // Traitement asynchrone
    setTimeout(async () => {
        try {
            // Sauvegarder la réservation
            await saveReservation(booking);
            
            // Envoyer la fiche de notification par email
            await sendBookingNotification(booking);
            
            // Afficher la confirmation
            showConfirmation(booking);
            form.reset();
            
            // Réinitialisation de l'UI
            const paymentDetails = document.getElementById('paymentDetails');
            const priceDetails = document.getElementById('priceDetails');
            if (paymentDetails) paymentDetails.style.display = 'none';
            if (priceDetails) priceDetails.innerHTML = '<p>Veuillez sélectionner vos dates pour voir le prix total</p>';
            
            // Restaurer le bouton
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;
            
        } catch (error) {
            console.error('Erreur lors de la réservation:', error);
            showError('Une erreur est survenue lors de la réservation. Veuillez réessayer.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;
        }
    }, 2000);
}

/**
 * Configure les méthodes de paiement
 */
function setupPaymentMethods() {
    const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            showPaymentFields(e.target.value);
        });
    });
}

/**
 * Affiche les champs de paiement selon la méthode choisie
 */
function showPaymentFields(method) {
    const container = document.getElementById('paymentDetails');
    if (!container) return;

    let html = '';
    
    if (['mvola', 'orange-money', 'airtel-money'].includes(method)) {
        const prefix = method === 'mvola' ? '034' : (method === 'orange-money' ? '032' : '033');
        const label = method === 'mvola' ? 'MVola' : (method === 'orange-money' ? 'Orange Money' : 'Airtel Money');
        const methodKey = method.replace('-', '');
        
        html = `
            <div class="form-group">
                <label for="${methodKey}Number">Numéro ${label}</label>
                <input type="tel" id="${methodKey}Number" name="${methodKey}Number" placeholder="${prefix} XX XXX XX" required>
            </div>
            <div class="form-group">
                <label for="${methodKey}Code">Code secret</label>
                <input type="password" id="${methodKey}Code" name="${methodKey}Code" placeholder="****" maxlength="4" required>
            </div>
        `;
    } else if (method === 'visa') {
        html = `
            <div class="form-group">
                <label for="cardNumber">Numéro de carte</label>
                <input type="text" id="cardNumber" name="cardNumber" placeholder="XXXX XXXX XXXX XXXX" required>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="cardExpiry">Expiration (MM/AA)</label>
                    <input type="text" id="cardExpiry" name="cardExpiry" placeholder="MM/AA" maxlength="5" required>
                </div>
                <div class="form-group">
                    <label for="cardCVV">CVV</label>
                    <input type="text" id="cardCVV" name="cardCVV" placeholder="XXX" maxlength="3" required>
                </div>
            </div>
        `;
    }

    container.innerHTML = html;
    container.style.display = html ? 'block' : 'none';
    
    // Ajouter les écouteurs pour le formatage
    setupPaymentInputListeners();
}

/**
 * Configure les écouteurs pour les champs de paiement
 */
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
    const cardCVV = document.getElementById('cardCVV');
    if (cardCVV) {
        cardCVV.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
}

/**
 * Configure la validation des dates
 */
function setupDateValidation() {
    const today = new Date().toISOString().split('T')[0];
    ['checkin', 'checkout', 'checkinFull', 'checkoutFull'].forEach(id => {
        const input = document.getElementById(id);
        if (input) input.min = today;
    });

    ['checkinFull', 'checkoutFull', 'roomTypeFull'].forEach(id => {
        const input = document.getElementById(id);
        if (input) input.addEventListener('change', updatePriceDisplay);
    });
}

/**
 * Met à jour l'affichage du prix
 */
function updatePriceDisplay() {
    const checkin = document.getElementById('checkinFull')?.value;
    const checkout = document.getElementById('checkoutFull')?.value;
    const roomType = document.getElementById('roomTypeFull')?.value;
    const priceDetails = document.getElementById('priceDetails');

    if (!priceDetails) return;

    if (checkin && checkout && roomType) {
        const nights = calculateNights(checkin, checkout);
        if (nights <= 0) {
            priceDetails.innerHTML = '<p style="color: #e74c3c;">La date de départ doit être après l\'arrivée.</p>';
            return;
        }
        const total = calculateTotalPrice(checkin, checkout, roomType);
        priceDetails.innerHTML = `
            <div style="text-align: left; padding: 10px; border-left: 4px solid #e74c3c; background: #fff;">
                <p><strong>Type:</strong> ${getRoomTypeName(roomType)}</p>
                <p><strong>Durée:</strong> ${nights} nuit(s)</p>
                <p style="font-size: 1.2rem; color: #e74c3c;"><strong>Total:</strong> ${total.toLocaleString()} Ar</p>
            </div>
        `;
    } else {
        priceDetails.innerHTML = '<p>Veuillez sélectionner vos dates pour voir le prix total</p>';
    }
}

/**
 * Configure le modal de confirmation
 */
function setupModal() {
    const modal = document.getElementById('confirmationModal');
    const closeBtns = document.querySelectorAll('.close, .modal-close-btn');
    closeBtns.forEach(btn => btn.addEventListener('click', () => modal.style.display = 'none'));
    window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
}

/**
 * Affiche la confirmation de réservation
 */
function showConfirmation(booking) {
    const modal = document.getElementById('confirmationModal');
    const message = document.getElementById('confirmationMessage');
    if (message) {
        message.innerHTML = `Félicitations <strong>${booking.firstName}</strong> ! <br>Votre réservation <strong>#${booking.id}</strong> est confirmée pour un montant de <strong>${booking.totalPrice.toLocaleString()} Ar</strong>.`;
    }
    if (modal) modal.style.display = 'block';
}

/**
 * Configure les boutons de sélection de chambre
 */
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

/**
 * Configure le formulaire de contact
 */
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            showSuccess('Votre message a été envoyé ! Nous vous répondrons bientôt.');
            form.reset();
        });
    }
}

/**
 * Configure les animations de navigation
 */
function setupNavigationAnimations() {
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
}

/**
 * Génère et envoie la fiche de notification par email
 */
async function sendBookingNotification(booking) {
    try {
        console.log('Envoi de la notification par email pour:', booking.email);
        
        // Créer le contenu HTML de la fiche de notification
        const notificationHTML = generateBookingNotificationHTML(booking);
        
        // Configuration du service d'email
        const emailData = {
            to_email: booking.email,
            subject: `Confirmation de Réservation #${booking.id} - Hôtel le Bonheur`,
            html: notificationHTML,
            booking_id: booking.id,
            customer_name: `${booking.firstName} ${booking.lastName}`,
            total_amount: booking.totalPrice.toLocaleString() + ' Ar'
        };

        // Utiliser la fonction d'envoi configurée
        if (typeof window.sendEmailWithServiceFromConfig === 'function') {
            const result = await window.sendEmailWithServiceFromConfig(emailData);
            console.log('Email envoyé avec succès:', result);
        } else {
            // Simulation pour le développement
            console.log('Simulation d\'envoi d\'email:', emailData);
            console.log('Pour une vraie implémentation, configurez EmailJS dans js/email-config.js');
        }
        
    } catch (error) {
        console.error('Erreur lors de l\'envoi de la notification:', error);
        // Ne pas bloquer la réservation si l'email échoue
        console.warn('La réservation est confirmée mais l\'email n\'a pas pu être envoyé');
    }
}

/**
 * Génère le contenu HTML de la fiche de notification
 */
function generateBookingNotificationHTML(booking) {
    const checkinDate = new Date(booking.checkin).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const checkoutDate = new Date(booking.checkout).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Fiche de Réservation - Hôtel le Bonheur</title>
            <style>
                body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
                .container { max-width: 600px; margin: 0 auto; background: white; }
                .header { background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; padding: 30px 20px; text-align: center; }
                .header h1 { margin: 0; font-size: 28px; }
                .header p { margin: 10px 0 0 0; opacity: 0.9; }
                .content { padding: 30px 20px; }
                .booking-info { background: #f8f9fa; border-left: 4px solid #e74c3c; padding: 20px; margin: 20px 0; }
                .info-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
                .info-row:last-child { border-bottom: none; }
                .info-label { font-weight: bold; color: #555; }
                .info-value { color: #333; }
                .total { background: #2c3e50; color: white; padding: 20px; text-align: center; font-size: 18px; font-weight: bold; }
                .footer { background: #34495e; color: white; padding: 20px; text-align: center; font-size: 14px; }
                .payment-info { background: #e8f5e8; border: 1px solid #27ae60; padding: 15px; margin: 20px 0; border-radius: 5px; }
                .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">🏨 HÔTEL LE BONHEUR</div>
                    <h1>FICHE DE RÉSERVATION</h1>
                    <p>Merci pour votre confiance !</p>
                </div>
                
                <div class="content">
                    <h2 style="color: #2c3e50; text-align: center;">Détails de votre réservation</h2>
                    
                    <div class="booking-info">
                        <div class="info-row">
                            <span class="info-label">📋 Numéro de réservation:</span>
                            <span class="info-value"><strong>#${booking.id}</strong></span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">👤 Client:</span>
                            <span class="info-value">${booking.firstName} ${booking.lastName}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">📧 Email:</span>
                            <span class="info-value">${booking.email}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">📱 Téléphone:</span>
                            <span class="info-value">${booking.phone}</span>
                        </div>
                    </div>
                    
                    <div class="booking-info">
                        <div class="info-row">
                            <span class="info-label">🏨 Type de chambre:</span>
                            <span class="info-value">${booking.roomTypeName || booking.roomType}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">📅 Date d'arrivée:</span>
                            <span class="info-value">${checkinDate}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">📅 Date de départ:</span>
                            <span class="info-value">${checkoutDate}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">👥 Nombre de personnes:</span>
                            <span class="info-value">${booking.guests} personne(s)</span>
                        </div>
                    </div>
                    
                    <div class="payment-info">
                        <h3 style="margin: 0 0 10px 0; color: #27ae60;">✅ Paiement confirmé</h3>
                        <p style="margin: 0;"><strong>Méthode de paiement:</strong> ${getPaymentMethodName(booking.paymentMethod)}</p>
                    </div>
                    
                    <div class="total">
                        💰 MONTANT TOTAL: ${booking.totalPrice.toLocaleString()} Ar
                    </div>
                    
                    <div style="margin-top: 30px; padding: 20px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px;">
                        <h3 style="color: #856404; margin-top: 0;">📌 Informations importantes</h3>
                        <ul style="color: #856404; line-height: 1.6;">
                            <li>Présentation à la réception avec une pièce d'identité</li>
                            <li>Check-in à partir de 14h00, Check-out avant 12h00</li>
                            <li>Pour toute modification, contactez-nous 48h à l'avance</li>
                            <li>Numéro de service client: +261 34 12 345 67</li>
                        </ul>
                    </div>
                </div>
                
                <div class="footer">
                    <p><strong>HÔTEL LE BONHEUR</strong></p>
                    <p>Antananarivo, Madagascar</p>
                    <p>📞 +261 34 12 345 67 | 📧 reservation@hotellebonheure.mg</p>
                    <p style="margin-top: 15px; font-size: 12px; opacity: 0.8;">
                        Cet email est une confirmation automatique. Merci de ne pas répondre.
                    </p>
                </div>
            </div>
        </body>
        </html>
    `;
}

/**
 * Obtient le nom formaté de la méthode de paiement
 */
function getPaymentMethodName(method) {
    const methods = {
        'mvola': 'MVOLA',
        'orange-money': 'Orange Money',
        'airtel-money': 'Airtel Money',
        'visa': 'Carte Visa'
    };
    return methods[method] || method.toUpperCase();
}

/**
 * Affiche un message de succès
 */
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
        z-index: 10000;
        max-width: 300px;
    `;
    successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

/**
 * Affiche un message d'erreur
 */
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #e74c3c;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
        z-index: 10000;
        max-width: 300px;
    `;
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

/**
 * Ferme le modal
 */
function closeModal() {
    const modal = document.getElementById('confirmationModal');
    if (modal) modal.style.display = 'none';
}

// Rendre les fonctions disponibles globalement si nécessaire
window.closeModal = closeModal;
window.showError = showError;
window.showSuccess = showSuccess;
