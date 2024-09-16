import { Test, TestingModule } from '@nestjs/testing';
import { UserControler } from './user.controller';
import { UsersService } from './users.service';
import { UserCreateDto } from './model/user-create.dto';
import { ValidationPipe } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

describe('UserController', () => {
  let app: TestingModule;
  let service: UsersService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [UserControler],
    })
      .useMocker((token) => {
        if (token === UsersService) {
          return { create: jest.fn() }
        }
      })
      .compile();

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
        const appController = app.get(UserControler);
        const dto: UserCreateDto = {
          username: 'username',
          password: 'password',
          email: 'email',
          fullName: 'fullName',
        }

        jest.spyOn(service, 'create').mockImplementationOnce(() => Promise.resolve(1));

        const expectedResult = 1;

        // When
        const result = await appController.createUser(dto);

        // Then
        expect(result).toBe(expectedResult);
      });
  });
});
