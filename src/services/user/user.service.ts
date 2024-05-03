import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user/user.entity';
import { CreateUserDto } from '../../dto/user/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserDto } from 'src/dto/user/user.dto';
import { UserParser } from 'src/parsers/user/user.parser';
import { QueryUserDto } from 'src/dto/user/query-user.dto';
import { UpdateUserDto } from 'src/dto/user/update-user.dto';
import { ApiResponse } from 'src/filters/api.response';
import { MESSAGE_USER_NOT_FOUND, MESSAGE_USER_OR_EMAIL_ALREADY_EXIST } from 'src/constants/view-model';
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private userParser: UserParser
    ) {}

    async save(user: User){
        return this.usersRepository.save(user)
    }

    async create(createUserDto: CreateUserDto): Promise<UserDto|null> {
        const existUser = await this.usersRepository.findOneBy({email : createUserDto.email});

        if(existUser){
            throw new ConflictException(null, MESSAGE_USER_OR_EMAIL_ALREADY_EXIST);
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const newUser = this.usersRepository.create({
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            password: hashedPassword,
            email: createUserDto.email,
        });

        const user: User = await this.save(newUser);
        return this.userParser.parseOne(user);
    }

    async update(userId: number, updateUserDto: UpdateUserDto): Promise<UserDto|any> {
        const existUser = await this.usersRepository.findOneBy({ id: userId });
        if (!existUser) {
            throw new NotFoundException(null, MESSAGE_USER_NOT_FOUND);
        }
        Object.assign(existUser, updateUserDto);

        const user = await this.save(existUser);
        return this.userParser.parseOne(user);
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

    async findAll(query: QueryUserDto): Promise<any> {
        const data = query?.page && query?.limit
            ? await this.paginate(query.page, query.limit)
            : this.userParser.parseMultiple(await this.usersRepository.find());
        return data
    }

    async findOneById(id: number): Promise<UserDto | null> {
        const user = await this.usersRepository.findOneBy({ id });
        return user ? this.userParser.parseOne(user) : null
    }

    async findByEmail(email: string): Promise<User | null>{
        return await this.usersRepository.findOneBy({ email });
    }

    async findByResetPassWordToken(resetPasswordToken: string): Promise<User | null>{
        return this.usersRepository.findOneBy({ resetPasswordToken });
    }

    async remove(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }
}