// src/benchmarkKnex.ts
import knex from 'knex';
import config from './knexfile';

const db = knex(config);

async function benchmarkKnex() {
  // Criar a tabela se não existir
  await db.schema.createTable('user', table => {
    table.increments('id').primary();
    table.string('name');
    table.string('email');
  });

  const batchSize = 500; // Tamanho do batch para evitar o limite de termos
  const totalRecords = 100000;

  console.time("Knex Insert");
  for (let i = 0; i < totalRecords; i += batchSize) {
    const users = [];
    for (let j = 0; j < batchSize && i + j < totalRecords; j++) {
      users.push({ name: `User ${i + j}`, email: `user${i + j}@example.com` });
    }
    await db('user').insert(users);
  }
  console.timeEnd("Knex Insert");

  console.time("Knex Select");
  const retrievedUsers = await db('user').select();
  console.timeEnd("Knex Select");

  console.log(`Found ${retrievedUsers.length} users`);
  await db.destroy();
}

benchmarkKnex().catch(error => console.log(error));
