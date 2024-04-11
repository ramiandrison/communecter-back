import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/use.entity';
import { UserService } from '../services/user.service';
import { UserController } from '../controllers/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  controllers: [UserController],
  exports: [TypeOrmModule]
})
export class UsersModule {}