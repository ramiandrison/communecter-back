import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../../dto/user/create-user.dto';
import { QueryUserDto } from '../../dto/user/query-user.dto';
import { UserService } from '../../services/user/user.service';
import { UpdateUserDto } from '../../dto/user/update-user.dto';
import { GetUser } from 'src/decorators/user.connected';
import { Response } from 'express';
//import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('user')
export class UserController {
    constructor(private readonly usersService: UserService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    findAll(@Query() query: QueryUserDto, /*@GetUser() user:any*/) {
        return this.usersService.findAll(query);
    }

    @Get(':id')
    findOneById(@Param('id') id: number) {
        return this.usersService.findOneById(id);
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto
    ) {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id',ParseIntPipe) id: string) {
        return `This action removes a #${id} cat`;
    }
}