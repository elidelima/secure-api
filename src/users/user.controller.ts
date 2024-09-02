import { Body, Controller, Post } from "@nestjs/common";
import { UserCreateDto } from "./model/user-create.dto";

@Controller('/users')
export class UserControler {

    @Post()
    createUser(@Body() userCreateDto: UserCreateDto) {

    }
}