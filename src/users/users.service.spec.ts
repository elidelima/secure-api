import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockRepositoryFactory } from 'src/helpers/test/mock-repository.factory';

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
});
