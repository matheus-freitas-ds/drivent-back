import { enrollmentRepository } from '@/repositories';
import { bookingRepository } from '@/repositories/booking-repository';
import { ticketsRepository } from '@/repositories/tickets-repository';
import { bookingService } from '@/services/booking-service';
import { mockEnrollment, mockTicket, mockTicketType, mockUser } from '../factories';
import { TicketStatus } from '@prisma/client';

beforeEach(() => {
    jest.clearAllMocks();
});


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

    it('should respond with booking data', async () => {
        const bookingInfo = { id: 1, Room: {} };
        jest.spyOn(bookingRepository, 'findBooking').mockImplementationOnce((): any => {
            return bookingInfo;
        });
        const booking = bookingService.getBooking(1);
        expect(booking).resolves.toEqual(bookingInfo);
    });
});

describe('POST /booking unit tests', () => {
    it('should respond with status 404 if there is no enrollment', async () => {
        jest.spyOn(bookingRepository, 'getRoomWithBookingById').mockImplementationOnce((): any => {
            return {
                capacity: 10,
                Booking: [1, 2],
            };
        });
        jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
            return null;
        });
        const booking = bookingService.createBooking(1, 1);
        expect(booking).rejects.toEqual({
            name: 'NotFoundError',
            message: 'No result for this search!',
        });
    });

    it('should respond with status 404 if room does not exist', async () => {
        jest.spyOn(bookingRepository, 'getRoomWithBookingById').mockImplementationOnce((): any => {
            return null;
        });
        jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
            return null;
        });
        await expect(bookingService.createBooking(1, 1)).rejects.toEqual({
            name: 'NotFoundError',
            message: 'No result for this search!',
        });
    });

 /*   it('should respond with status 403 if room is full', async () => {
        const user = mockUser()
        const enrollment = mockEnrollment(user)
        const ticketType =  mockTicketType()
        const ticket = mockTicket(ticketType.id, enrollment.id, TicketStatus.PAID)
        jest.spyOn(bookingRepository, 'getRoomWithBookingById').mockImplementationOnce((): any => {
            return {
                capacity: 1,
                Booking: [1, 2],
            };
        });
        jest.spyOn(enrollmentRepository, 'findWithAddressByUserId').mockImplementationOnce((): any => {
            return enrollment;
        });
        jest.spyOn(ticketsRepository, 'findTicketByEnrollmentId').mockImplementationOnce((): any => {
            return { ...ticket, TicketType: ticketType };
        });
        await expect(bookingService.createBooking(1, 1)).rejects.toEqual({
            name: 'NotFoundError',
            message: 'No result for this search!',
        });
    }); */
});
