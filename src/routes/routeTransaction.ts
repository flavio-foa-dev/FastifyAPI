import { FastifyInstance } from 'fastify';
import { KnexConect } from '../db/database.js';
import { z } from 'zod';
import { randomUUID } from 'crypto';

export async function transactionRoutes(app: FastifyInstance){

  app.get('/', async () => {
    const transactions = await KnexConect('transaction').select('*');
    return {transactions};

  });

  app.get('/:id', async (request)=> {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    });
    const {id} = getTransactionParamsSchema.parse(request.params);
    const transaction = await  KnexConect('transaction').where('id', id).first();
    return {transaction};
  });

  app.get('/summary', async ()=> {
    const summary = await KnexConect('transaction').sum('amount', {as: 'amount'}).first();

    return {summary};
  });


  app.post('/', async (request, reply) => {
    const createTrasactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    });

    const {title, amount, type} = createTrasactionBodySchema.parse(request.body);
    await KnexConect('transaction').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
    });

    return reply.status(201).send();
  });

}