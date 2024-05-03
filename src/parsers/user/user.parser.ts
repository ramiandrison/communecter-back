import { Injectable } from "@nestjs/common";
import { UserDto } from "src/dto/user/user.dto";
import { User } from "src/entities/user/user.entity";

@Injectable()
export class UserParser {
    parseMultiple (users: User[] =[]){
        const res = []
        users.forEach((item:any) => {
            res.push(this.parseOne(item));
        });
        return res;
    }

    parseOne (user: User) : UserDto
    {
        const userDto = new UserDto();
        userDto.id = user.id;
        userDto.firstName = user.firstName;
        userDto.lastName = user.lastName;
        userDto.email = user.email;
        userDto.birthDate = user.birthDate;
        userDto.phone = user.phone;
        return userDto
    }
}