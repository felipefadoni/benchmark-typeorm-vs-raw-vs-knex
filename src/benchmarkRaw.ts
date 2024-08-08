// src/benchmarkRawSqlite3.ts
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

async function benchmarkRawSqlite3() {
  const db = await open({
    filename: 'benchmark_raw.db',
    driver: sqlite3.Database
  });

  // Criar a tabela se não existir
  await db.exec(`
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT
    )
  `);

  const batchSize = 500;
  const totalUsers = 100000;

  console.time("Raw Insert");
  for (let i = 0; i < totalUsers; i += batchSize) {
    let insertValues = [];
    for (let j = 0; j < batchSize && i + j < totalUsers; j++) {
      insertValues.push(`('User ${i + j}', 'user${i + j}@example.com')`);
    }
    const insertQuery = `INSERT INTO user (name, email) VALUES ${insertValues.join(", ")}`;
    await db.exec(insertQuery);
  }
  console.timeEnd("Raw Insert");

  console.time("Raw Select");
  const users = await db.all("SELECT * FROM user");
  console.timeEnd("Raw Select");

  console.log(`Found ${users.length} users`);
  await db.close();
}

benchmarkRawSqlite3().catch(error => console.log(error));
