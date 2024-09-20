import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockRepositoryFactory } from 'src/helpers/test/mock-repository.factory';
import { UserCreateDto } from './model/user-create.dto';
import * as bcrypt from 'bcrypt';
import { UserDto } from './model/user.dto';
import { Role } from 'src/auth/roles/role.enum';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useFactory: mockRepositoryFactory },
        { provide: CACHE_MANAGER, useValue: { del: () => jest.fn() }}
      ],
    })
    .compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  describe('findOne', () => {
    it('should query database and return user', async () => {
      // Given
      const expectedResult = { id: 1, username: 'username' } as User;
      jest.spyOn(userRepository, 'createQueryBuilder');
      const queryBuilder = userRepository.createQueryBuilder();
      jest.spyOn(queryBuilder, 'getOne')
        .mockResolvedValueOnce(expectedResult);
      
      // When
      const result = await service.findOne('username');
      
      // Then
      expect(result).toEqual(expectedResult);
      expect(userRepository.createQueryBuilder).toHaveBeenCalledTimes(2);
      expect(queryBuilder.where).toHaveBeenCalledTimes(1);
      expect(queryBuilder.orWhere).toHaveBeenCalledTimes(1);
    });
  })

  describe('create', () => {
    it('should create new user and return id', async () => {
      // Given
      const dto: UserCreateDto = {
        password: 'password',
        username: 'username',
        fullName: 'fullName',
        email: 'email',
      };
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce({ id: 1 } as User);
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => 'hashedPassword');
      jest.spyOn(cacheManager, 'del').mockImplementation(() => Promise.resolve());

      const expectedResult = 1;
    
      // When
      const result = await service.create(dto);

      // Then
      expect(result).toEqual(expectedResult);
    })
  })

  describe('findAll', () => {
    it('should query database and find all users and return filtered dto', async () => {
      // Given
      const users = [ {
        id: 1,
        username: 'username',
        email: 'email',
        fullName: 'fullName',
        password: 'password',
        role: Role.User,
      }]

      jest.spyOn(userRepository, 'find').mockResolvedValueOnce(users);

      const expectedUsers: UserDto[] = [
        {
          id: 1,
          username: 'username',
          email: 'email',
          fullName: 'fullName',
          role: Role.User,
        }
      ];

      // When
      const response = await service.findAll();

      expect(response).toEqual(expectedUsers);
      expect(userRepository.find).toHaveBeenCalledTimes(1);
    });
  });
});
