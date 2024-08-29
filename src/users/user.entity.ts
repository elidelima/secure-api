import { Role } from "src/auth/roles/role.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ name: "username" })
    username: string;

    @Column({ name: "email", unique: true })
    email: string;

    @Column({ name: "password" })
    password: string;

    @Column({ name: "full_name" })
    fullName: string;

    @Column({ name: 'role', enum: Role })
    role: Role;
}