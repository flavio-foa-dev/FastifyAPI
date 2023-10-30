import fastify from 'fastify';
import { KnexConect } from './db/database.js';
import { env } from './env/index.js';


const app = fastify();

app.get('/test', async () => {
  const table = await KnexConect('sqlite_schema').select('*');
  return{message: 'Hello Flavio', table};
});

app.get('/transaction', async () => {
  const table = await KnexConect('transaction').select('*');
  return table;
});

app.listen({
  port: env.PORT
}).then(() => {
  console.log('listening on port 3333');
}).catch((error) => {
  console.log('error: ', error.message);
});