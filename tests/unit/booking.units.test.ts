import { bookingRepository } from '@/repositories/booking-repository';
import { bookingService } from '@/services/booking-service';

describe('GET /booking unit tests', () => {
    it('should respond with status 404 if there is no booking for given user', async () => {
        jest.spyOn(bookingRepository, 'findBooking').mockImplementationOnce((): any => {
            return null
        });

        const booking = bookingService.getBooking(1);
        expect(booking).rejects.toEqual({
            name: 'NotFoundError',
            message: 'No result for this search!',
        });
    });

    it('Return a reservation if it exists for the user', async () => {
        const bookingInfo = { id: 1, Room: {} };
        jest.spyOn(bookingRepository, 'findBooking').mockImplementationOnce((): any => {
            return bookingInfo;
        });
        const booking = bookingService.getBooking(1);
        expect(booking).resolves.toEqual(bookingInfo);
    });
});
