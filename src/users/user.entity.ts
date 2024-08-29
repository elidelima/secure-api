import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn("identity")
    id: number;

    @Column({ name: "email", unique: true })
    email: string;

    @Column({ name: "password" })
    password: string;

    @Column({ name: "full_name" })
    fullName: string;


}