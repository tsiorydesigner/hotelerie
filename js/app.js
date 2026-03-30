const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const app = express();

app.use(express.json());
app.use(cors());

// ============================================================
// CONFIGURATION DU TRANSPORTEUR D'EMAIL
// ============================================================
// Option 1: Gmail — Utilisez un "Mot de passe d'application" (pas votre mot de passe Gmail)
//   1. Allez sur https://myaccount.google.com/apppasswords
//   2. Générez un mot de passe d'application pour "Mail"
//   3. Remplacez ci-dessous
//
// Option 2: Mailtrap (pour tester sans envoyer de vrais emails)
//   1. Créez un compte sur https://mailtrap.io
//   2. Copiez les credentials SMTP de votre inbox de test
//   3. Décommentez la section Mailtrap ci-dessous et commentez Gmail
// ============================================================
const transporter = nodemailer.createTransport({
    // === OPTION 1: Gmail ===
    service: 'gmail',
    auth: {
        user: 'VOTRE_EMAIL@gmail.com',           // Remplacer par votre email Gmail
        pass: 'VOTRE_MOT_DE_PASSE_APPLICATION'    // Remplacer par votre mot de passe d'application Gmail
    }

    // === OPTION 2: Mailtrap (décommentez pour utiliser) ===
    // host: 'sandbox.smtp.mailtrap.io',
    // port: 2525,
    // auth: {
    //     user: 'VOTRE_USER_MAILTRAP',
    //     pass: 'VOTRE_PASS_MAILTRAP'
    // }
});

/**
 * Génère un Buffer PDF pour la facture
 */
function generateInvoicePDF(booking) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);

        // Contenu du PDF
        doc.fontSize(20).text('FACTURE - HÔTEL LUXE', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Référence : RES-${booking._id.toString().slice(-6)}`);
        doc.text(`Date : ${new Date().toLocaleDateString('fr-FR')}`);
        doc.moveDown();
        doc.text(`Client : ${booking.firstName} ${booking.lastName}`);
        doc.text(`Chambre : ${booking.roomTypeName || booking.roomType}`);
        doc.text(`Séjour : du ${new Date(booking.checkin).toLocaleDateString('fr-FR')} au ${new Date(booking.checkout).toLocaleDateString('fr-FR')}`);
        doc.moveDown();
        doc.fontSize(14).text(`TOTAL À PAYER : ${booking.totalPrice.toLocaleString()} Ar`, { weight: 'bold' });
        doc.end();
    });
}

// ============================================================
// CONNEXION MONGODB (Optionnelle - le serveur démarre sans)
// ============================================================
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hotelerie';

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connecté'))
    .catch(err => console.warn('MongoDB non disponible:', err.message, '\nLes réservations seront sauvegardées côté client uniquement.'));

// Modèle de Réservation
const BookingSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    roomType: String,
    checkin: Date,
    checkout: Date,
    guests: Number,
    totalPrice: Number,
    paymentMethod: String,
    paymentStatus: { type: String, default: 'confirmé' }
});

let Booking;
try {
    Booking = mongoose.model('Booking');
} catch {
    Booking = mongoose.model('Booking', BookingSchema);
}

// Route pour créer une réservation
app.post('/api/bookings', async (req, res) => {
    try {
        const bookingData = req.body;
        const newBooking = new Booking(bookingData);
        
        // 1. On enregistre d'abord en base de données (Action critique)
        await newBooking.save();

        // 2. On tente d'envoyer l'email (Action non-critique pour le succès de la requête)
        try {
            // Génération de la facture PDF
            const pdfBuffer = await generateInvoicePDF(newBooking);

            // Préparation de la fiche de notification (HTML)
            const mailOptions = {
                from: '"Hôtel Luxe" <ton-email@gmail.com>',
                to: bookingData.email,
                subject: `Confirmation de Réservation #${newBooking._id.toString().slice(-6)}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #ddd; padding: 20px;">
                        <h2 style="color: #e74c3c; text-align: center;">Fiche de Réservation</h2>
                        <p>Bonjour <strong>${bookingData.firstName} ${bookingData.lastName}</strong>,</p>
                        <p>Nous avons le plaisir de vous confirmer votre séjour à l'Hôtel Luxe.</p>
                        <hr>
                        <table style="width: 100%;">
                            <tr><td><strong>Type de chambre:</strong></td><td>${bookingData.roomTypeName || bookingData.roomType}</td></tr>
                            <tr><td><strong>Arrivée:</strong></td><td>${new Date(bookingData.checkin).toLocaleDateString('fr-FR')}</td></tr>
                            <tr><td><strong>Départ:</strong></td><td>${new Date(bookingData.checkout).toLocaleDateString('fr-FR')}</td></tr>
                            <tr><td><strong>Nombre de personnes:</strong></td><td>${bookingData.guests}</td></tr>
                            <tr><td><strong>Montant Total:</strong></td><td>${bookingData.totalPrice.toLocaleString()} Ar</td></tr>
                            <tr><td><strong>Mode de paiement:</strong></td><td>${bookingData.paymentMethod.toUpperCase()}</td></tr>
                        </table>
                        <hr>
                        <p style="text-align: center; color: #666; font-size: 12px;">Merci de votre confiance. À bientôt !</p>
                    </div>
                `,
                attachments: [
                    {
                        filename: `facture_hotel_luxe_${newBooking._id.toString().slice(-6)}.pdf`,
                        content: pdfBuffer
                    }
                ]
            };

            // Envoi de l'email
            await transporter.sendMail(mailOptions);
        } catch (mailError) {
            // On loggue l'erreur de mail mais on ne stoppe pas le processus
            console.error('Échec de l\'envoi de l\'email de confirmation:', mailError);
        }

        // 3. On répond au client avec succès car la réservation est sauvée
        res.status(201).send(newBooking);
    } catch (error) {
        // Ici on ne capture que les erreurs critiques (ex: MongoDB est down)
        console.error('Erreur critique lors de la réservation:', error);
        res.status(500).send({ message: "Erreur lors de l'enregistrement de la réservation" });
    }
});

// Route pour envoyer uniquement un email (sans enregistrer en BDD)
app.post('/api/send-email', async (req, res) => {
    try {
        const { to_email, subject, html, booking_id, customer_name, total_amount } = req.body;

        if (!to_email || !subject || !html) {
            return res.status(400).json({ 
                success: false, 
                message: 'Champs requis manquants: to_email, subject, html' 
            });
        }

        const mailOptions = {
            from: '"Hôtel le Bonheur" <VOTRE_EMAIL@gmail.com>',
            to: to_email,
            subject: subject,
            html: html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email envoyé:', info.messageId);

        res.json({ 
            success: true, 
            messageId: info.messageId,
            message: 'Email envoyé avec succès' 
        });

    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Échec de l\'envoi de l\'email',
            error: error.message 
        });
    }
});

// Route de test pour vérifier que le serveur fonctionne
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Serveur opérationnel' });
});

// Démarrage du serveur
app.listen(5000, () => console.log('Serveur démarré sur http://localhost:5000'));