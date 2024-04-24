import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user/use.entity';
import { CreateUserDto } from '../../dto/user/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserDto } from 'src/dto/user/user.dto';
import { UserParser } from 'src/parsers/user/user.parser';
import { QueryUserDto } from 'src/dto/user/query-user.dto';
import { UpdateUserDto } from 'src/dto/user/update-user.dto';
import { ApiResponse } from 'src/config/api.response';
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private userParser: UserParser
    ) {}

    async create(createUserDto: CreateUserDto): Promise<ApiResponse<UserDto|null>> {
        const existUser = await this.usersRepository.findOne({
            where : {
              email : createUserDto.email
            }
        });

        if(existUser){
            return new ApiResponse<null>(
                null,
                'User already exist',
                false,
                HttpStatus.UNAUTHORIZED
            )
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const newUser = this.usersRepository.create({
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            password: hashedPassword,
            email: createUserDto.email,
        });

        const user: User = await this.usersRepository.save(newUser);
        const userDto : UserDto = this.userParser.parseOne(user);

        return new ApiResponse<UserDto>(
            userDto,
            'User saved',
            true,
            HttpStatus.CREATED
        )
    }

    async update(userId: number, updateUserDto: UpdateUserDto): Promise<ApiResponse<UserDto|null>> {
        const existUser = await this.usersRepository.findOneBy({ id: userId });
        if (!existUser) {
            return new ApiResponse<null>(
                null,
                'User not found',
                false,
                HttpStatus.NOT_FOUND
            )
        }
        Object.assign(existUser, updateUserDto);

        const user = await this.usersRepository.save(existUser);
        const userDto =  this.userParser.parseOne(user);

        return new ApiResponse<UserDto>(
            userDto,
            'User updated',
            true,
            HttpStatus.OK
        )
    }

    async paginate(page: number = 1, limit: number = 10): Promise<{ results: UserDto[]; total: number }> {
        limit = limit > 100 ? 100 : limit;
        const [data, total] = await this.usersRepository.findAndCount({
            take: limit,
            skip: (page - 1) * limit,
        });

        return {
            results: this.userParser.parseMultiple(data),
            total: total,
        };
    }

    async findAll(query: QueryUserDto): Promise<ApiResponse<any>> {
        let data = null;
        if(query?.page && query?.limit){
            data = await this.paginate(query?.page, query?.limit);
        }else{
            const users = await this.usersRepository.find();
            data = this.userParser.parseMultiple(users)
        }

        return new ApiResponse<any>(
            data,
            'Success',
            true,
            HttpStatus.OK
        )
    }

    async findOneById(id: number): Promise<UserDto | null> {
        const user = await this.usersRepository.findOneBy({ id });
        return this.userParser.parseOne(user)
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