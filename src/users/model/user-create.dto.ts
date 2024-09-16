import { IsEmail, IsString } from "class-validator";

export class UserCreateDto {
    @IsString()
    username: string;
    
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsString()
    fullName: string;
}