import { prisma } from '@/config';

async function findBooking(userId: number) {
    const booking = await prisma.booking.findFirst({
        where: { userId: userId }
    });

    const room = await prisma.room.findUnique({
        where: { id: booking.roomId }
    })

    return { id: booking.id, Room: room }
}

export const bookingRepository = {
    findBooking
};