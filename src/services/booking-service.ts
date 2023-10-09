import { notFoundError } from '@/errors';
import { bookingRepository } from '@/repositories/booking-repository';

async function getBooking(userId: number) {
    const booking = bookingRepository.findBooking(userId)

    if (!booking) throw notFoundError()

    return booking;
}

export const bookingService = {
    getBooking
};
