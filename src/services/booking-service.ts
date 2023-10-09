import { notFoundError } from '@/errors';
import { forbiddenError } from '@/errors/forbidden-error';
import { ticketsRepository } from '@/repositories';
import { bookingRepository } from '@/repositories/booking-repository';

async function getBooking(userId: number) {
    const booking = bookingRepository.findBooking(userId)

    if (!booking) throw notFoundError()

    return booking;
}

async function createBooking(userId: number, roomId: number) {
    const ticket = await ticketsRepository.findTicketByUserId(userId)
    if (ticket.TicketType.isRemote || ticket.TicketType.includesHotel == false || ticket.status !== 'PAID') throw forbiddenError()

    const room = await bookingRepository.getRoomById(roomId)
    if (!room) throw notFoundError()
    if (room.Booking.length >= room.capacity) throw forbiddenError()

    const booking = await bookingRepository.create(userId, roomId)

    return { bookingId: booking.roomId }
}

export type CreateBookingSchema = {
    roomId: number
}

export const bookingService = {
    getBooking,
    createBooking
};
