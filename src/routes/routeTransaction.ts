import { FastifyInstance } from 'fastify';
import { KnexConect } from '../db/database.js';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { checkSessionIdentity } from '../middleware/validateCokies.js';

export async function transactionRoutes(app: FastifyInstance){
  app.addHook('preHandler', (req, res, next) =>{
    console.log(`[${req.method}] ${req.url}`);
    next();
  });

  app.get('/',{preHandler: [checkSessionIdentity]}, async (request) => {
    const sessionId = request.cookies.sessionId;
    const transactions = await KnexConect('transaction')
      .where('session_Id', sessionId)
      .select('*');
    return {transactions};

  });

  app.get('/:id',{preHandler: [checkSessionIdentity]}, async (request)=> {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    });
    const {id} = getTransactionParamsSchema.parse(request.params);
    const sessionId = request.cookies.sessionId;

    const transaction = await  KnexConect('transaction')
      .where('id', id)
      .andWhere('session_Id', sessionId)
      .first();
    return {transaction};
  });

  app.get('/summary', {preHandler: [checkSessionIdentity]}, async (request)=> {
    const sessionId = request.cookies.sessionId;

    const summary = await KnexConect('transaction')
      .where('session_id', sessionId)
      .sum('amount', {as: 'amount'})
      .first();

    return {summary};
  });


  app.post('/', async (request, reply) => {
    const createTrasactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    });

    const {title, amount, type} = createTrasactionBodySchema.parse(request.body);
    let sessionId = request.cookies.sessionId;
    console.log(`Session ID: ${sessionId}`);

    if (!sessionId) {
      sessionId = randomUUID();
    }

    reply.cookie('sessionId', sessionId, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    });

    await KnexConect('transaction').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId
    });

    return reply.status(201).send();
  });

}