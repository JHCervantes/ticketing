import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { Ticket } from '../../model/ticket';

it('should return a 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it('should return a ticket if the ticket is found', async () => {
  const title = 'This is a test title';
  const ticket = Ticket.build({
    title,
    price: 20,
    userId: 'jhtk4df',
  });
  await ticket.save();

  const response = await request(app)
    .get(`/api/tickets/${ticket.id}`)
    .send()
    .expect(200);

  expect(response.body.title).toEqual(title);
  expect(response.body.price).toEqual(20);
});
