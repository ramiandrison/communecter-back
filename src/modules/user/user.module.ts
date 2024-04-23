import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user/use.entity';
import { UserService } from '../../services/user/user.service';
import { UserController } from '../../controllers/user/user.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule],
  providers: [
      UserService
  ],
  controllers: [UserController],
  exports: [TypeOrmModule]
})
export class UsersModule {}