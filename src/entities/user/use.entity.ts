import { Entity, Column, PrimaryGeneratedColumn, IsNull } from 'typeorm';

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

    @Column()
    email: string;

    @Column({ nullable: true })
    slug: string;

    @Column({ nullable: true })
    birthDate: Date;

    @Column({ nullable: true })
    phone: string;

    @Column({ default: true })
    isActive: boolean;
}