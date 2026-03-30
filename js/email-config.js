/**
 * Configuration du service d'email
 * ============================================================
 * OPTION A: EmailJS (le plus simple — pas de serveur nécessaire)
 * ============================================================
 * 1. Créez un compte gratuit sur https://www.emailjs.com/
 * 2. Ajoutez un service email (Gmail, Outlook, etc.)
 * 3. Créez un template d'email avec ces variables:
 *    {{to_email}}, {{subject}}, {{message}}, {{booking_id}}, {{customer_name}}, {{total_amount}}
 * 4. Remplacez les valeurs EMAILJS_CONFIG ci-dessous
 *
 * ============================================================
 * OPTION B: Backend Node.js + Nodemailer (le plus pro)
 * ============================================================
 * 1. Installez les dépendances: cd js && npm install
 * 2. Configurez les credentials dans js/app.js (Gmail ou Mailtrap)
 * 3. Démarrez le serveur: node js/app.js
 * 4. Le frontend appellera automatiquement http://localhost:5000/api/send-email
 * ============================================================
 */

// Configuration EmailJS (Option A — remplacer avec vos vraies valeurs)
const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'VOTRE_CLE_PUBLIQUE_EMAILJS', // Ex: user_abc123xyz
    SERVICE_ID: 'VOTRE_SERVICE_ID',          // Ex: service_gmail
    TEMPLATE_ID: 'VOTRE_TEMPLATE_ID'          // Ex: template_booking
};

// URL du backend (Option B)
const BACKEND_URL = 'http://localhost:5000';

/**
 * Initialise EmailJS avec la clé publique
 */
function initEmailJS() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        console.log('EmailJS initialisé avec succès');
    } else {
        console.warn('EmailJS n\'est pas chargé. Veuillez inclure le script EmailJS dans votre HTML.');
    }
}

/**
 * Envoie un email via EmailJS
 */
async function sendEmailWithEmailJS(emailData) {
    try {
        if (typeof emailjs === 'undefined') {
            throw new Error('EmailJS n\'est pas disponible');
        }

        const templateParams = {
            to_email: emailData.to_email,
            subject: emailData.subject,
            message: emailData.html,
            booking_id: emailData.booking_id,
            customer_name: emailData.customer_name,
            total_amount: emailData.total_amount,
            reply_to: emailData.to_email
        };

        const response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            templateParams
        );

        console.log('Email envoyé avec succès:', response);
        return { success: true, response };

    } catch (error) {
        console.error('Erreur EmailJS:', error);
        throw new Error('Échec de l\'envoi de l\'email: ' + error.text);
    }
}

/**
 * Option B: Envoi via le backend Node.js + Nodemailer
 */
async function sendEmailViaBackend(emailData) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/send-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Erreur serveur: ${response.status}`);
        }

        const result = await response.json();
        console.log('Email envoyé via backend:', result);
        return result;

    } catch (error) {
        console.error('Erreur backend:', error);
        throw error;
    }
}

/**
 * Fonction principale d'envoi d'email
 * Ordre de priorité:
 * 1. EmailJS (si configuré avec de vraies clés)
 * 2. Backend Nodemailer (si le serveur tourne sur localhost:5000)
 * 3. Simulation (pour le développement sans configuration)
 */
async function sendEmailWithServiceFromConfig(emailData) {
    // Option A: EmailJS (si configuré)
    if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.PUBLIC_KEY !== 'VOTRE_CLE_PUBLIQUE_EMAILJS') {
        console.log('[Email] Envoi via EmailJS...');
        return await sendEmailWithEmailJS(emailData);
    }
    
    // Option B: Backend Nodemailer
    try {
        console.log('[Email] Tentative d\'envoi via le backend Nodemailer...');
        return await sendEmailViaBackend(emailData);
    } catch (error) {
        console.warn('[Email] Backend non disponible:', error.message);
    }
    
    // Fallback: Simulation pour le développement
    console.log('[Email] Mode simulation — l\'email n\'a pas été envoyé réellement.');
    console.log('[Email] Pour envoyer de vrais emails:');
    console.log('  - Option A: Configurez EmailJS dans js/email-config.js');
    console.log('  - Option B: Démarrez le serveur avec: node js/app.js');
    return { success: true, simulated: true };
}

// Rendre la fonction disponible globalement
window.sendEmailWithServiceFromConfig = sendEmailWithServiceFromConfig;

// Exporter les fonctions pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        EMAILJS_CONFIG,
        initEmailJS,
        sendEmailWithEmailJS,
        sendEmailViaBackend,
        sendEmailWithService: sendEmailWithServiceFromConfig
    };
}
