import { DataSource } from 'typeorm';
import { User } from './user.entity';
import { faker } from '@faker-js/faker';
import 'dotenv/config';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DBHost,
  port: Number(process.env.DBPort),
  username: process.env.DBUser,
  password: process.env.DBPassword,
  database: process.env.database,
  entities: [User],
  synchronize: true,
});

async function seed() {
    await dataSource.initialize();
    const userRepository = dataSource.getRepository(User);
  
    const users: Partial<User>[] = [];
    const BATCH_SIZE = 10000;
  
    for (let i = 0; i < 1000000; i++) {
      users.push({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        age: faker.number.int({ min: 18, max: 80 }),
        gender: faker.helpers.arrayElement(['male', 'female']),
        hasProblems: faker.datatype.boolean(),
      });
  
      if (users.length === BATCH_SIZE) {
        console.log(`Saving batch of ${BATCH_SIZE} users...`);
        await userRepository.save(users);
        users.length = 0;
      }
    }
  
    if (users.length > 0) {
      console.log(`Saving the last batch of ${users.length} users...`);
      await userRepository.save(users);
    }
  
    console.log('Users have been seeded');
    await dataSource.destroy();
  }
  
  seed();