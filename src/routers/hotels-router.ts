import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getHotelRooms, getHotels } from '@/controllers/hotels-controller';

const hotelsRouter = Router();

hotelsRouter
    .get('/hotels', authenticateToken, getHotels)
    .get('/hotels/:hotelId', authenticateToken, getHotelRooms)

export { hotelsRouter };