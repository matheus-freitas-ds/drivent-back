import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getBooking, postCreateBooking } from '@/controllers/booking-controller';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('/', getBooking)
  .post('/', postCreateBooking);

export { bookingRouter };