// src/knexfile.ts
import { Knex } from 'knex';

const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: './benchmark_raw_knex.db'
  },
  useNullAsDefault: true
};

export default config;
