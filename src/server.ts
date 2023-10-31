import { app } from './app.js';
import { env } from './env';



app.listen({
  port: env.PORT
}).then(() => {
  console.log('listening on port', env.PORT);
}).catch((error) => {
  console.log('error: ', error.message);
});