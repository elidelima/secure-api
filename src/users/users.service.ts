import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserCreateDto } from './model/user-create.dto';
import * as bcrypt from 'bcrypt';
import { UserDto } from './model/user.dto';
import { plainToClass } from 'class-transformer';
import { CacheKeys } from 'src/config/cache.config';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(CACHE_MANAGER)
    private cacheManager?: Cache
  ) { }

  async create(dto: UserCreateDto): Promise<number> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const { id } = await this.userRepository.save({ 
      ...dto,
      password: hashedPassword,
    })
    
    // TODO move to another place 
    this.cacheManager?.del(CacheKeys.GET_ALL_USERS);

    return id;
  }

  async findOne(usernameOrEmail: string): Promise<User | undefined> {
    const user = await this.userRepository.createQueryBuilder()
      .where('username = :username', { username: usernameOrEmail })
      .orWhere('email = :email', { email: usernameOrEmail })
      .getOne();
    return user;
  }

  async findAll(): Promise<UserDto[]>{
    // await new Promise(resolve => setTimeout(resolve, 100));
    const users = await this.userRepository.find();
    return users.map((user) => plainToClass(UserDto, user));
  }
}