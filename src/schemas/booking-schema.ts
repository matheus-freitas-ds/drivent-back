import Joi from "joi";
import { CreateBookingSchema } from "@/services/booking-service";

export const bookingSchema = Joi.object<CreateBookingSchema>({
    roomId: Joi.number().required()
})