import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import supertest from 'supertest';
import { app } from '../../app.js';

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready(); //await app is ready
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a new transaction', async() => {
    const data = {
      title: 'test title',
      amount: 1,
      type: 'credit'
    };
    const response = await supertest(app.server)
      .post('/transactions')
      .send(data);

    expect(response.statusCode).toEqual(201);

  });

  it('should be able to list all transaction', async() => {
    const data = {
      title: 'test title',
      amount: 1,
      type: 'credit'
    };
    const response = await supertest(app.server)
      .post('/transactions')
      .send(data);
    const cookies = response.get('Set-Cookie');

    const result = await supertest(app.server)
      .get('/transactions')
      .set('Cookie', cookies);
    expect(result.statusCode).toEqual(200);
    expect(result.body.transactions).toEqual([
      expect.objectContaining({
        title: 'test title',
        amount: 1,
      })
    ]);

  });
});