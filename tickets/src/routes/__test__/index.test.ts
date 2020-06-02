import request from 'supertest';

import { app } from '../../app';
import { Ticket } from '../../model/ticket';

it('should fetch a list of tickets', async () => {
  const list = [
    { title: '1', price: 20, userId: 'adfaslk' },
    { title: '2', price: 30, userId: 'dfs' },
  ];

  for (const i of list) {
    const ticket = Ticket.build({
      title: i.title,
      price: i.price,
      userId: i.userId,
    });

    await ticket.save();
  }

  const response = await request(app).get('/api/tickets').send().expect(200);

  expect(response.body.length).toEqual(2);
});
