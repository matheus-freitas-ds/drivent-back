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

async function getRoomWithBookingById(roomId: number) {
    return await prisma.room.findFirst({
        where: {
            id: roomId
        },
        include: {
            Booking: true
        }
    })
}

async function getRoomById(roomId: number) {
    return await prisma.room.findFirst({
        where: {
            id: roomId
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

async function update (roomId: number, bookingId: number) {
    return await prisma.booking.update({
        where: {
            id: bookingId
        },
        data: {
            roomId,
            updatedAt: new Date()
        }
    })
}

export const bookingRepository = {
    findBooking,
    create,
    getRoomWithBookingById,
    getRoomById,
    countBookingsByRoomId,
    update
};