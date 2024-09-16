import { Body, Controller, Post, ValidationPipe } from "@nestjs/common";
import { UserCreateDto } from "./model/user-create.dto";
import { UsersService } from "./users.service";
import { Public } from "src/auth/auth.guard";

@Controller('/users')
export class UserControler {

    constructor(private usersService: UsersService) {}

    @Post()
    @Public()
    async createUser(@Body(new ValidationPipe()) userCreateDto: UserCreateDto): Promise<{ id: Number}> {
        return { id: await this.usersService.create(userCreateDto) };
    }
}