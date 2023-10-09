import { prisma } from '@/config';

async function findBooking(userId: number) {
    const booking = await prisma.booking.findFirst({
        where: {
            userId: userId
        }
    })

    if (!booking) return null

    const room = await prisma.room.findUnique({
        where: {
            id: booking.roomId
        }
    })

    return { id: booking.id, Room: room }
}

async function create(userId: number, roomId: number) {
    return prisma.booking.create({
        data: {
            userId,
            roomId
        }
    })
}

async function getRoomById(roomId: number) {
    return prisma.room.findFirst({
        where: {
            id: roomId
        },
        include: {
            Booking: true
        }
    })
}

export const bookingRepository = {
    findBooking,
    create,
    getRoomById
};