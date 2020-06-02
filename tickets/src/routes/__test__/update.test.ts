import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { Ticket } from '../../model/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('should return a 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.getAuthCookie())
    .send({
      title: 'dasf',
      price: 20,
    })
    .expect(404);
});

it('should return a status of 401 if user is not signed in', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'dasf',
      price: 20,
    })
    .expect(401);
});

it('should return a 401 if the user does not own this ticket', async () => {
  const title = 'This is a test title';
  const ticket = Ticket.build({
    title,
    price: 20,
    userId: 'jhtk4df',
  });
  await ticket.save();

  await request(app)
    .put(`/api/tickets/${ticket._id}`)
    .set('Cookie', global.getAuthCookie())
    .send({
      title: 'Updated Title',
      price: 30,
    })
    .expect(401);
});

it('should return a 400 if the user provides an invalid title or price', async () => {
  const title = 'This is a test title';
  const ticket = Ticket.build({
    title,
    price: 20,
    userId: global.staticId,
  });
  await ticket.save();

  await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set('Cookie', global.getAuthCookie(false))
    .send({
      title: '',
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set('Cookie', global.getAuthCookie(false))
    .send({
      title: 'Valid title',
      price: -20,
    })
    .expect(400);
});

it('should update the ticket provided valid inputs', async () => {
  const title = 'This is a test title';
  const ticket = Ticket.build({
    title,
    price: 20,
    userId: global.staticId,
  });
  await ticket.save();

  await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set('Cookie', global.getAuthCookie(false))
    .send({
      title: 'new title',
      price: 100,
    })
    .expect(200);

  const ticketResponse = await Ticket.findById(ticket.id);

  if (ticketResponse) {
    expect(ticketResponse.title).toEqual('new title');
    expect(ticketResponse.price).toEqual(100);
  } else {
    fail();
  }
});

it('should publish an event', async () => {
  const title = 'This is a test title';
  const ticket = Ticket.build({
    title,
    price: 20,
    userId: global.staticId,
  });
  await ticket.save();

  await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set('Cookie', global.getAuthCookie(false))
    .send({
      title: 'new title',
      price: 100,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('should reject the update if the ticket is reserved', async () => {
  const orderId = mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: 'This is a test title',
    price: 20,
    userId: global.staticId,
  });
  ticket.set({ orderId });
  await ticket.save();

  await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set('Cookie', global.getAuthCookie(false))
    .send({
      title: 'new title',
      price: 100,
    })
    .expect(400);
});
