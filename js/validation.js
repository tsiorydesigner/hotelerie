export function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

export function validatePhone(phone) {
    const re = /^[\d\s\+\-\(\)]+$/;
    return re.test(phone) && phone.length >= 10;
}

export function validateBookingDates(checkin, checkout) {
    if (!checkin || !checkout) return false;
    const start = new Date(checkin);
    const end = new Date(checkout);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return start >= today && end > start;
}

export function validatePhoneNumber(phone, prefix) {
    const cleanPhone = phone.replace(/\s/g, '');
    return cleanPhone.startsWith(prefix) && cleanPhone.length === 10;
}

export function validatePaymentMethod(method, showError) {
    switch(method) {
        case 'mvola':
            const mvolaNumber = document.getElementById('mvolaNumber')?.value;
            const mvolaCode = document.getElementById('mvolaCode')?.value;
            if (!validatePhoneNumber(mvolaNumber || '', '034')) {
                showError('Veuillez entrer un numéro MVola valide (034 XX XXX XX).');
                return false;
            }
            if ((mvolaCode?.length || 0) < 4) {
                showError('Le code secret MVola doit contenir au moins 4 caractères.');
                return false;
            }
            break;
        case 'orange':
            const orangeNumber = document.getElementById('orangeNumber')?.value;
            const orangeCode = document.getElementById('orangeCode')?.value;
            if (!validatePhoneNumber(orangeNumber || '', '032')) {
                showError('Veuillez entrer un numéro Orange Money valide (032 XX XXX XX).');
                return false;
            }
            if ((orangeCode?.length || 0) < 4) {
                showError('Le code secret Orange Money doit contenir au moins 4 caractères.');
                return false;
            }
            break;
        case 'airtel':
            const airtelNumber = document.getElementById('airtelNumber')?.value;
            const airtelCode = document.getElementById('airtelCode')?.value;
            if (!validatePhoneNumber(airtelNumber || '', '033')) {
                showError('Veuillez entrer un numéro Airtel Money valide (033 XX XXX XX).');
                return false;
            }
            if ((airtelCode?.length || 0) < 4) {
                showError('Le code secret Airtel Money doit contenir au moins 4 caractères.');
                return false;
            }
            break;
        case 'visa':
            const cardNumber = document.getElementById('cardNumber')?.value.replace(/\s/g, '');
            const cardExpiry = document.getElementById('cardExpiry')?.value;
            const cardCVV = document.getElementById('cardCVV')?.value;
            
            if (!cardNumber || cardNumber.length < 13 || cardNumber.length > 19) {
                showError('Numéro de carte invalide.');
                return false;
            }
            const expiryMatch = cardExpiry?.match(/(\d{2})\/(\d{2})/);
            if (!expiryMatch) {
                showError('Date d\'expiration invalide (MM/AA).');
                return false;
            }
            if (cardCVV?.length !== 3) {
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

export function validateBooking(booking, showError) {
    if (!booking.firstName || !booking.lastName || !booking.email || !booking.phone) {
        showError('Veuillez remplir tous les champs obligatoires.');
        return false;
    }
    if (!validateEmail(booking.email)) {
        showError('Email invalide.');
        return false;
    }
    if (!validatePhone(booking.phone)) {
        showError('Téléphone invalide.');
        return false;
    }
    if (!validateBookingDates(booking.checkin, booking.checkout)) {
        showError('Dates invalides.');
        return false;
    }
    
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
    if (!paymentMethod) {
        showError('Sélectionnez un paiement.');
        return false;
    }
    
    return validatePaymentMethod(paymentMethod, showError);
}