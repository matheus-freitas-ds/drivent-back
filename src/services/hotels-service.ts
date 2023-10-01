import { paymentNotFoundError } from "@/errors/payment-not-found-error";
import { enrollmentRepository } from "@/repositories";
import { hotelsRepository } from "@/repositories/hotels-repository";

async function getHotels(userId: number) {

    const ticketEnrollment = await enrollmentRepository.ticketValidation(userId)

    if (ticketEnrollment.Ticket.status !== 'PAID') throw paymentNotFoundError()

    if (!ticketEnrollment.Ticket.TicketType.includesHotel || ticketEnrollment.Ticket.TicketType.isRemote) throw paymentNotFoundError()

    const hotels = await hotelsRepository.getHotelsList()
    
    return hotels
}

export const hotelsService = {
    getHotels
}