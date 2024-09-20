import { Test, TestingModule } from '@nestjs/testing';
import { UserControler } from './user.controller';
import { UsersService } from './users.service';
import { UserCreateDto } from './model/user-create.dto';
import { ValidationPipe } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { Role } from 'src/auth/roles/role.enum';
import { UserDto } from './model/user.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('UserController', () => {
  let app: TestingModule;
  let service: UsersService;
  let controller: UserControler;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [UserControler],
      providers: [{
        provide: CACHE_MANAGER,
        useValue: {
          get: () => 'any value',
          set: () => jest.fn(),
        },
      },]
    })
      .useMocker((token) => {
        if (token === UsersService) {
          return {
            create: jest.fn(),
            findAll: jest.fn(),
          }
        }
      })
      .compile();

    controller = app.get<UserControler>(UserControler);
    service = app.get<UsersService>(UsersService);
  });

  describe('createUser', () => {

    describe('UserCreateDTO validation', () => {
      it('should return bad params when body is incomplete', async () => {
        // Given
        const dto = plainToClass(UserCreateDto, {});

        // When
        const errors = validateSync(dto);

        // Then
        expect(errors).toHaveLength(4);
      });

      it('should return bad params when body is incomplete', async () => {
        // Given
        const dto = plainToClass(UserCreateDto, {
          username: 'username',
          password: 'password',
        });

        // When
        const errors = validateSync(dto);

        // Then
        expect(errors).toHaveLength(2);
      });

      it('should return bad params when body is incomplete', async () => {
        // Given
        const dto = plainToClass(UserCreateDto, {
          username: 'username',
          password: 'password',
          email: 'email@email.com',
          fullName: 'fullName',
        });

        // When
        const errors = validateSync(dto);

        // Then
        expect(errors).toHaveLength(0);
      });
    }),


      it('should create user and return id', async () => {
        // Given
        const dto: UserCreateDto = {
          username: 'username',
          password: 'password',
          email: 'email',
          fullName: 'fullName',
        }

        jest.spyOn(service, 'create').mockImplementationOnce(() => Promise.resolve(1));

        const expectedResult = { id: 1 };

        // When
        const result = await controller.createUser(dto);

        // Then
        expect(result).toEqual(expectedResult);
      });
  });

  describe('listAll', () => {
    it('should return a list of users', async () => {
      // Given
      const expectedUsers: UserDto[] = [
        {
          id: 1,
          username: 'username1',
          email: 'email1',
          fullName: 'fullName1',
          role: Role.User,
        }, {
          id: 2,
          username: 'username2',
          email: 'email2',
          fullName: 'fullName2',
          role: Role.User,
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValueOnce(expectedUsers);

      // When
      const users = await controller.getAll();

      // Then
      expect(users).toEqual(expectedUsers);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
