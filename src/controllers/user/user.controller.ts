import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../../dto/user/create-user.dto';
import { QueryUserDto } from '../../dto/user/query-user.dto';
import { UserService } from '../../services/user/user.service';
import { UpdateUserDto } from '../../dto/user/update-user.dto';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private readonly usersService: UserService) {}

    @Post()
    @ApiOperation({ summary: 'Create user' })
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all user' })
    findAll(@Query() query: QueryUserDto, /*@GetUser() user:any*/) {
        return this.usersService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get user by id' })
    findOneById(@Param('id') id: number) {
        return this.usersService.findOneById(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update user by id' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto
    ) {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete user by id' })
    remove(@Param('id',ParseIntPipe) id: number) {
        return this.usersService.remove(id);
    }
}