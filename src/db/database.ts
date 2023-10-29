import { knex } from 'knex';

export const KnexConect = knex({
  client: 'sqlite',
  connection: {
    filename: './src/temp/app.sqlite'
  }
});