import { prisma } from '@/config';

async function findBooking(userId: number) {
    return prisma.booking.findFirst({
        where: {
            userId: userId
        },
        include: {
            Room: true
        }
    })
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

async function countBookingsByRoomId(roomId: number) {
    return prisma.booking.count({
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