import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserCreateDto } from './model/user-create.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  // TODO add test
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
}