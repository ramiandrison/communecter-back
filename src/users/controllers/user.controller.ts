import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { QueryUserDto } from '../dto/query-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
    constructor(private readonly usersService: UserService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
      return this.usersService.create(createUserDto);
    }

    @Get()
    findAll(@Query() query: QueryUserDto) {
      return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
      return `This action returns a #${id} cat`;
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateCatDto: UpdateUserDto) {
      return `This action updates a #${id} cat`;
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
      return `This action removes a #${id} cat`;
    }
}