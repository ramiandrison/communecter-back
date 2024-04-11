import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/use.entity';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UserService {
    constructor(
      @InjectRepository(User)
      private usersRepository: Repository<User>,
    ) {}

    create(createUserDto: CreateUserDto): Promise<User> {
      const newUser = this.usersRepository.create({
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
      });

      return this.usersRepository.save(newUser);
    }

    findAll(): Promise<User[]> {
      return this.usersRepository.find();
    }

    findOne(id: number): Promise<User | null> {
      return this.usersRepository.findOneBy({ id });
    }

    async remove(id: number): Promise<void> {
      await this.usersRepository.delete(id);
    }
}