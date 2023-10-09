import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { bookingService } from '@/services/booking-service';

export async function getBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;

    const bookingInfo = await bookingService.getBooking(userId)

    res.status(httpStatus.OK).send(bookingInfo);
}

export async function postCreateBooking(req: AuthenticatedRequest, res: Response) {

    res.status(httpStatus.OK).send();
}