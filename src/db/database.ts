import { knex, Knex } from 'knex';

export const knexConfig: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: './src/temp/app.sqlite'
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: 'src/db/migrations'

  }
};

export const KnexConect = knex(knexConfig);