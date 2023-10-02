import httpStatus from "http-status";
import supertest from "supertest";
import { TicketStatus } from "@prisma/client";
import { cleanDb, generateValidToken } from "../helpers";
import app, { init } from "@/app";
import { createEnrollmentWithAddress, createTicket, createTicketTypeWithHotel, createUser } from "../factories";
import { createHotel } from "../factories/hotels-factory";

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/hotels');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {
        it('should respond with status 404 when there is no enrollment', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`)

            expect(response.status).toEqual(httpStatus.NOT_FOUND)
        })

        it('should respond with status 404 when there is no ticket', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);

            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`)

            expect(response.status).toEqual(httpStatus.NOT_FOUND)

        })

        it('should respond with status 404 when there is no hotel', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel(true, false);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`)

            expect(response.status).toEqual(httpStatus.NOT_FOUND)

        })

        it('should respond with status 402 if the ticket has not been paid', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`)

            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED)

        })

        it('should respond with status 402 if the ticket is remote', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`)

            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED)

        })

        it('should respond with status 402 if hotel is not included', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel(false, false);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`)

            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED)

        })

        it('should respond with status 200 and with the hotels data', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel(true, false);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const hotel = await createHotel()

            const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`)

            expect(response.status).toBe(httpStatus.OK)
            expect(response.body).toEqual([
                {
                    id: hotel.id,
                    name: hotel.name,
                    image: hotel.image,
                    createdAt: hotel.createdAt.toISOString(),
                    updatedAt: hotel.updatedAt.toISOString(),
                  }
            ])

        })

    })
})