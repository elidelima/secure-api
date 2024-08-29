import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/auth/roles/role.enum';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async findOne(usernameOrEmail: string): Promise<User | undefined> {
    const user = await this.userRepository.createQueryBuilder()
      .where('username = :username', { username: usernameOrEmail })
      .orWhere('email = :email', { email: usernameOrEmail})
      .getOne();
    return user;
  }
}