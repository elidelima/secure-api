import { Body, Controller, Get, Post, UseInterceptors, ValidationPipe } from "@nestjs/common";
import { UserCreateDto } from "./model/user-create.dto";
import { UsersService } from "./users.service";
import { Public } from "src/auth/auth.guard";
import { UserDto } from "./model/user.dto";
import { Role } from "src/auth/roles/role.enum";
import { Roles } from "src/auth/roles/roles.decorator";
import { CacheKeys } from "src/config/cache.config";
import { CacheInterceptor, EvictCache, UseCache } from "src/cache/cache.interceptor";

@Controller('/users')
// @UseInterceptors(CacheInterceptor)
export class UserControler {

    constructor(private usersService: UsersService) {}

    @Post()
    @Public()
    // @EvictCache({ key: CacheKeys.GET_ALL_USERS })
    async createUser(@Body(new ValidationPipe()) userCreateDto: UserCreateDto): Promise<{ id: Number}> {
        return { id: await this.usersService.create(userCreateDto) };
    }

    @Get()
    @Roles(Role.Admin)
    // @UseInterceptors(CacheInterceptor)
    // @CacheKey(CacheKeys.GET_ALL_USERS)
    // @UseCache({ key: CacheKeys.GET_ALL_USERS })
    async getAll(): Promise<UserDto[]> {
        return this.usersService.findAll();
    }
}