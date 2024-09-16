import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockRepositoryFactory } from 'src/helpers/test/mock-repository.factory';
import { UserCreateDto } from './model/user-create.dto';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useFactory: mockRepositoryFactory }
      ],
    })
    .compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
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
      const expectedResult = 1;
    
      // When
      const result = await service.create(dto);

      // Then
      expect(result).toEqual(expectedResult);
    })
  })
});
