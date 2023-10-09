import { Router } from 'express';
import { authenticateToken, validateBody, validateParams } from '@/middlewares';
import { getBooking, createBooking, updateBooking } from '@/controllers/booking-controller';
import { BookingParamsSchema, bookingSchema } from '@/schemas/booking-schema';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('/', getBooking)
  .post('/', validateBody(bookingSchema), createBooking)
  .put('/:bookingId', validateBody(bookingSchema), validateParams(BookingParamsSchema), updateBooking)

export { bookingRouter };