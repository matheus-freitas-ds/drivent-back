import Joi from "joi";
import { CreateBookingParamsSchema, CreateBookingSchema } from "@/services/booking-service";

export const bookingSchema = Joi.object<CreateBookingSchema>({
    roomId: Joi.number().required()
})

export const BookingParamsSchema = Joi.object<CreateBookingParamsSchema>({
    bookingId: Joi.number().required()
})