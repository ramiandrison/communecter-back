import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user/use.entity';
import { CreateUserDto } from '../../dto/user/create-user.dto';

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
          password: createUserDto.password,
          email: createUserDto.email,
        });

        return this.usersRepository.save(newUser);
    }

    findAll(): Promise<User[]> {
      return this.usersRepository.find();
    }

    findOneById(id: number): Promise<User | null> {
      return this.usersRepository.findOneBy({ id });
    }

    findByEmail(email: string): Promise<User | null>{
        return this.usersRepository.findOne({
            where : {
              email
            }
        });
    }

    async remove(id: number): Promise<void> {
      await this.usersRepository.delete(id);
    }
}