export class CreateUserDto {
    firstName: string;
    lastName: string;
    email: string;
    slug: string;
    password: string;
    birthDate?: Date;
    phone?: string;
}