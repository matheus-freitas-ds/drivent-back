import { prisma } from "@/config";

async function getHotelsList() {
    return await prisma.hotel.findMany()
}

async function getHotelRoomsList(hotelId: number) {
    const hotelWithRooms = await prisma.hotel.findFirst({
        where: {
            id: hotelId
        },
        include: {
            Rooms: true
        }
    })

    return hotelWithRooms
}

export const hotelsRepository = {
    getHotelsList,
    getHotelRoomsList
}