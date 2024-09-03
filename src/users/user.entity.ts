import { Role } from "src/auth/roles/role.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ name: "username", nullable: false })
    username: string;

    @Column({ name: "email", nullable: false, unique: true })
    email: string;

    @Column({ name: "password", nullable: false })
    password: string;

    @Column({ name: "full_name", nullable: false })
    fullName: string;

    @Column({ name: 'role', enum: Role, nullable: false })
    role: Role;
}