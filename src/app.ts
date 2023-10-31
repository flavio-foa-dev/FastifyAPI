import fastify from 'fastify';
import { KnexConect } from './db/database.js';

import { transactionRoutes } from './routes/routeTransaction.js';
import fastifyCookie from '@fastify/cookie';


export const app = fastify();
app.register(fastifyCookie);

app.get('/test', async () => {
  const table = await KnexConect('sqlite_schema').select('*');
  return{message: 'Hello Flavio', table};
});

app.register(transactionRoutes,{
  prefix: 'transactions',
});