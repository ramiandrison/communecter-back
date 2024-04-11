export class CreateUserDto {
    firstName: string;
    lastName: string;
    username?: string;
    slug?: string;
    birthDate?: Date;
    phone?: string;
}