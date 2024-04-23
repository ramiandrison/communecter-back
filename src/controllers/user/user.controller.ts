import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../../dto/user/create-user.dto';
import { QueryUserDto } from '../../dto/user/query-user.dto';
import { UserService } from '../../services/user/user.service';
import { UpdateUserDto } from '../../dto/user/update-user.dto';
//import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('user')
export class UserController {
    constructor(private readonly usersService: UserService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
      return this.usersService.create(createUserDto);
    }

    //@UseGuards(AuthGuard)
    @Get()
    findAll(@Query() query: QueryUserDto) {
      return this.usersService.findAll();
    }

    @Get(':id')
    findOneById(@Param('id') id: number) {
        return this.usersService.findOneById(id);
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