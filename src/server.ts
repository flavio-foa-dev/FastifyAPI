import fastify from 'fastify';
import { KnexConect } from './db/database.js';

const app = fastify();

app.get('/test', async () => {
  const table = await KnexConect('sqlite_schema').select('*');
  return{message: 'Hello Flavio', table};
});

app.get('/transaction', async () => {
  const table = await KnexConect('sqlite_schema').select('*');
  return{message: 'Hello Flavio', table};
});

app.listen({
  port: 3333
}).then(() => {
  console.log('listening on port 3333');
}).catch((error) => {
  console.log('error: ', error.message);
});