import faker from '@faker-js/faker';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import { TicketStatus } from '@prisma/client';
import {
  createUser,
  createTicketType,
  createEnrollmentWithAddress,
  createTicket,
  createHotel,
  createBooking,
  createRoomWithHotelId,
  createRoomWithHotelIdAndCapacityExceeded,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
    it('should respond with status 401 if no token is given', async () => {
      const response = await server.get('/booking');
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
  
      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
  
      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    describe('when token is valid', () => {
      it('should respond with status 404 if user has no booking', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
  
        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
  
        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });

      it('should respond with status 200 and booking data', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType(false, true);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id);
        const booking = await createBooking(user.id, room.id);
  
        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
  
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual({
          id: booking.id,
          Room: {
            id: room.id,
            name: room.name,
            capacity: room.capacity,
            hotelId: room.hotelId,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        });
      });
    });
  });

  describe('POST /booking', () => {  
    it('should respond with status 401 if no token is given', async () => {
      const response = await server.post('/booking').send({ roomId: 1 });
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
  
      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: 1 });
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
  
      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: 1 });
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    describe('when token is valid', () => {
      it('should respond with status 400 if there is no roomId', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
  
        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);
  
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });
  
      it('should respond with status 404 if there is no enrollment for given user', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
  
        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: 1 });
  
        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });
  
      it('should respond with status 404 if user does not have ticket', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        await createEnrollmentWithAddress(user);
  
        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: 1 });
  
        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });
  
      it('should respond with status 403 if the ticket is not paid', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType();
        await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
  
        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: 1 });
  
        expect(response.status).toBe(httpStatus.FORBIDDEN);
      });
  
      it('should respond with status 403 if ticket does not include hotel', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType(false, false);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
  
        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: 1 });
  
        expect(response.status).toBe(httpStatus.FORBIDDEN);
      });
  
      it('should respond with status 404 if the room is not found', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType(false, true);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
  
        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId: 1 });
  
        expect(response.status).toBe(httpStatus.NOT_FOUND);
      });
    
      it('should respond with status 403 if the room is full', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType(false, true);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const hotel = await createHotel();
        const room = await createRoomWithHotelIdAndCapacityExceeded(hotel.id);
  
        const body = { roomId: room.id };
        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
  
        expect(response.status).toBe(httpStatus.FORBIDDEN);
      });
  
      it('should respond with status 200 with bookingId', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType(false, true);
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id);
  
        const body = { roomId: room.id };
        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
  
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual(
          expect.objectContaining({
            bookingId: expect.any(Number),
          }),
        );
      });
    });
  });