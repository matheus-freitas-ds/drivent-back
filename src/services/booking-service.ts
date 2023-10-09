import { notFoundError } from '@/errors';
import { forbiddenError } from '@/errors/forbidden-error';
import { enrollmentRepository, ticketsRepository } from '@/repositories';
import { bookingRepository } from '@/repositories/booking-repository';

async function getBooking(userId: number) {
    const booking = await bookingRepository.findBooking(userId)

    if (!booking) throw notFoundError()

    return booking;
}

async function createBooking(userId: number, roomId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)
    if (!enrollment) throw notFoundError()

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id)
    if (!ticket) throw notFoundError()
    if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel || ticket.status === 'RESERVED') throw forbiddenError()

    const room = await bookingRepository.getRoomById(roomId)
    if (!room) throw notFoundError()

    const bookingsCounter = await bookingRepository.countBookingsByRoomId(roomId)
    if (bookingsCounter === room.capacity) throw forbiddenError()

    const booking = await bookingRepository.create(userId, roomId)

    return { bookingId: booking.id }
}

async function updateBooking(bookingId: number) {

}

export type CreateBookingSchema = {
    roomId: number
}

export const bookingService = {
    getBooking,
    createBooking,
    updateBooking
};
