import 'dotenv/config';
import { knex, Knex } from 'knex';
import { env } from '../env';
console.log(process.env);



export const knexConfig: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: env.DATABASE_URL
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: 'src/db/migrations'

  }
};

export const KnexConect = knex(knexConfig);