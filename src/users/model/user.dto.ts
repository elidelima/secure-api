import { Exclude } from "class-transformer";
import { Role } from "src/auth/roles/role.enum";

export class UserDto {

    id: number;

    username: string;

    email: string;
    
    @Exclude()
    password?: string;

    fullName: string;

    role: Role;
}