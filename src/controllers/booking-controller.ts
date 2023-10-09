import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { CreateBookingSchema, bookingService } from '@/services/booking-service';

export async function getBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;

    const bookingInfo = await bookingService.getBooking(userId)

    res.status(httpStatus.OK).send(bookingInfo);
}

export async function createBooking(req: AuthenticatedRequest, res: Response) {
    const { roomId } = req.body as CreateBookingSchema
    const { userId } = req

    const createBookingInfo = await bookingService.createBooking(userId, roomId) 

    res.status(httpStatus.OK).send(createBookingInfo);
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
    const { bookingId } = req.params
    const { roomId } = req.body as CreateBookingSchema
    const { userId } = req

    const updateBookingInfo = await bookingService.updateBooking(roomId, userId)

    res.status(httpStatus.OK).send(updateBookingInfo);
}
