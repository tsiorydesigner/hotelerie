import { ROOM_TYPES } from './constants.js';

const API_URL = 'http://localhost:5000/api';

export async function getReservations() {
    const response = await fetch(`${API_URL}/bookings`);
    return await response.json();
}

export async function saveReservation(booking) {
    const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
    });
    return await response.json();
}

export function calculateNights(checkin, checkout) {
    const start = new Date(checkin);
    const end = new Date(checkout);
    const diffTime = end - start;
    if (diffTime <= 0) return 0;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function calculateTotalPrice(checkin, checkout, roomType) {
    const nights = calculateNights(checkin, checkout);
    const pricePerNight = ROOM_TYPES[roomType]?.price || 0;
    return pricePerNight * nights;
}

export function getRoomTypeName(roomType) {
    return ROOM_TYPES[roomType]?.name || roomType;
}