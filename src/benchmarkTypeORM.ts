// src/benchmarkTypeORM.ts
import "reflect-metadata";
import { createConnection, getRepository } from "typeorm";
import { User } from "./entity/User";

async function benchmarkTypeORM() {
  const connection = await createConnection();
  const userRepository = getRepository(User);

  const batchSize = 500;
  const totalUsers = 100000;

  console.time("TypeORM Insert");
  for (let i = 0; i < totalUsers; i += batchSize) {
    const users: User[] = [];
    for (let j = 0; j < batchSize && i + j < totalUsers; j++) {
      const user = new User();
      user.name = `User ${i + j}`;
      user.email = `user${i + j}@example.com`;
      users.push(user);
    }
    await userRepository.save(users);
  }
  console.timeEnd("TypeORM Insert");

  console.time("TypeORM Select");
  const retrievedUsers = await userRepository.find();
  console.timeEnd("TypeORM Select");

  console.log(`Found ${retrievedUsers.length} users`);
  await connection.close();
}

benchmarkTypeORM().catch(error => console.log(error));
