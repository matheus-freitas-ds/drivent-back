import { prisma } from "@/config";

async function getHotelsList() {
    return await prisma.hotel.findMany()
}

export const hotelsRepository = {
    getHotelsList
}