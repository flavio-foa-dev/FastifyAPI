import {afterAll, beforeAll, beforeEach, describe, expect, it} from 'vitest';
import supertest from 'supertest';
import { app } from '../../src/app.js';
import { execSync } from 'node:child_process';

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready(); //await app is ready
  });

  beforeEach(()=> {
    execSync('npm run migrate:dow --all');
    execSync('npm run migrate:run');
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

  it('should be able to get a especific transaction', async() => {
    const data = {
      title: 'test title',
      amount: 1,
      type: 'credit'
    };

    const response = await supertest(app.server)
      .post('/transactions')
      .send(data);
    const cookies = response.get('Set-Cookie');

    const listTransactions = await supertest(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200);
    const transactionId = listTransactions.body.transactions[0].id;

    const getTransactionId = await supertest(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200);
    expect(getTransactionId.body.transaction).toEqual(
      expect.objectContaining({
        title: 'test title',
        amount: 1,
      })
    );
  });

  it('should be able to get the summary', async() => {
    const credito = {
      title: 'Credit transaction',
      amount: 10,
      type: 'credit'
    };
    const debito = {
      title: 'Debit transaction',
      amount: 3,
      type: 'debit'
    };

    const response = await supertest(app.server)
      .post('/transactions')
      .send(credito);
    const cookies = response.get('Set-Cookie');
    await supertest(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send(debito);

    const summury = await supertest(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200);


    expect(summury.body.summary).toEqual({
      amount: 7
    });
  });





});