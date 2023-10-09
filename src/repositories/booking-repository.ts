import { prisma } from '@/config';

async function findBooking(userId: number) {
    return await prisma.booking.findFirst({
        where: {
            userId: userId
        },
        include: {
            Room: true
        }
    })
}

async function create(userId: number, roomId: number) {
    return await prisma.booking.create({
        data: {
            userId,
            roomId
        }
    })
}

async function getRoomById(roomId: number) {
    return await prisma.room.findFirst({
        where: {
            id: roomId
        },
        include: {
            Booking: true
        }
    })
}

async function countBookingsByRoomId(roomId: number) {
    return await prisma.booking.count({
        where: {
            roomId
        }
    })
}

export const bookingRepository = {
    findBooking,
    create,
    getRoomById,
    countBookingsByRoomId
};