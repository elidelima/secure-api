import { Inject, Injectable, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserCreateDto } from './model/user-create.dto';
import * as bcrypt from 'bcrypt';
import { UserDto } from './model/user.dto';
import { plainToClass } from 'class-transformer';
import { CacheKeys } from 'src/config/cache.config';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheInterceptor, EvictCache } from 'src/cache/cache.interceptor';
import { Cacheable, CacheEvict } from 'nestjs-cacheable';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  @CacheEvict({
    key: CacheKeys.GET_ALL_USERS,
    namespace: 'user',
  })
  async create(dto: UserCreateDto): Promise<number> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const { id } = await this.userRepository.save({ 
      ...dto,
      password: hashedPassword,
    })
    
    return id;
  }

  async findOne(usernameOrEmail: string): Promise<User | undefined> {
    const user = await this.userRepository.createQueryBuilder()
      .where('username = :username', { username: usernameOrEmail })
      .orWhere('email = :email', { email: usernameOrEmail })
      .getOne();
    return user;
  }

  @Cacheable({
    key: CacheKeys.GET_ALL_USERS,
    namespace: 'user',
  })
  async findAll(): Promise<UserDto[]>{
    // await new Promise(resolve => setTimeout(resolve, 100));
    const users = await this.userRepository.find();
    return users.map((user) => plainToClass(UserDto, user));
  }
}