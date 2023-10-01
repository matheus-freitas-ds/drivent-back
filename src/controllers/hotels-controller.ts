import { AuthenticatedRequest } from '@/middlewares';
import { hotelsService } from '@/services/hotels-service';
import { Response } from 'express';
import httpStatus from 'http-status';

export async function getHotels(req: AuthenticatedRequest, res: Response) {

    const result = await hotelsService.getHotels(req.userId)

    return res.status(httpStatus.OK).send(result);
}

export async function getHotelRooms(req: AuthenticatedRequest, res: Response) {

    const result = ''

    return res.status(httpStatus.OK).send(result);
}