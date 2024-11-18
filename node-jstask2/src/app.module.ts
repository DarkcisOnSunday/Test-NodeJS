import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import 'dotenv/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DBHost,
      port: Number(process.env.DBPort),
      username: process.env.DBUser,
      password: process.env.DBPassword,
      database: process.env.database,
      entities: [User],
      synchronize: true,
    }),
    UserModule,
  ],
})
export class AppModule {}