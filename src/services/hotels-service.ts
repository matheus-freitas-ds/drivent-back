import { notFoundError } from "@/errors";
import { paymentNotFoundError } from "@/errors/payment-not-found-error";
import { enrollmentRepository } from "@/repositories";
import { hotelsRepository } from "@/repositories/hotels-repository";

async function getHotels(userId: number) {

    const ticketEnrollment = await enrollmentRepository.ticketValidation(userId)

    if (!ticketEnrollment || !ticketEnrollment.Ticket) throw notFoundError()

    if (ticketEnrollment.Ticket.status !== 'PAID') throw paymentNotFoundError()

    if (!ticketEnrollment.Ticket.TicketType.includesHotel || ticketEnrollment.Ticket.TicketType.isRemote) throw paymentNotFoundError()

    const hotels = await hotelsRepository.getHotelsList()

    if (hotels.length === 0) throw notFoundError()
    
    return hotels
}

async function getHotelRooms(hotelId: number, userId: number) {

    const ticketEnrollment = await enrollmentRepository.ticketValidation(userId)

    if (!ticketEnrollment || !ticketEnrollment.Ticket) throw notFoundError()

    if (ticketEnrollment.Ticket.status !== 'PAID') throw paymentNotFoundError()

    if (!ticketEnrollment.Ticket.TicketType.includesHotel || ticketEnrollment.Ticket.TicketType.isRemote) throw paymentNotFoundError()

    const hotelRooms = await hotelsRepository.getHotelRoomsList(hotelId)

    if (!hotelRooms) throw notFoundError()

    return hotelRooms
}

export const hotelsService = {
    getHotels,
    getHotelRooms
}