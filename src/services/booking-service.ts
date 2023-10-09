import { notFoundError } from '@/errors';
import { forbiddenError } from '@/errors/forbidden-error';
import { enrollmentRepository, ticketsRepository } from '@/repositories';
import { bookingRepository } from '@/repositories/booking-repository';
import { TicketStatus } from '@prisma/client';

async function getBooking(userId: number) {
    const booking = await bookingRepository.findBooking(userId)

    if (!booking) throw notFoundError()

    return booking;
}

async function createBooking(userId: number, roomId: number) {
    await validateCreateBooking(userId)
    await validateAvailableRoomCapacity(roomId)

    const booking = await bookingRepository.create(userId, roomId)

    return { bookingId: booking.id }
}

async function updateBooking(bookingId: number) {

}

async function validateCreateBooking(userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)
    if (!enrollment) throw notFoundError()

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id)
    if (!ticket) throw notFoundError()

    const type = ticket.TicketType

    if (ticket.status === TicketStatus.RESERVED || type.isRemote || !type.includesHotel) throw forbiddenError()
}

async function validateAvailableRoomCapacity(roomId: number) {
    const room = await bookingRepository.getRoomById(roomId)
    if (!room) throw notFoundError()
    
    const bookingsCount = await bookingRepository.countBookingsByRoomId(roomId)
    if (bookingsCount === room.capacity) throw forbiddenError()

}

export type CreateBookingSchema = {
    roomId: number
}

export const bookingService = {
    getBooking,
    createBooking,
    updateBooking
};
