import { Entity, Column, PrimaryGeneratedColumn, IsNull } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ nullable: true })
    username: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    resetPasswordToken: string;

    @Column()
    email: string;

    @Column({ nullable: true })
    slug: string;

    @Column({ nullable: true })
    birthDate: Date;

    @Column({ nullable: true })
    phone: string;

    @Column({ default: true })
    activated: boolean;

    @Column({ nullable: true })
    activationToken: Date;
}