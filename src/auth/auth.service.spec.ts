import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker((token) => {
        if (token === UsersService) {
          return { findOne: async () => jest.fn() };
        }
        if (token === JwtService) {
          return { signAsync: () => jest.fn() }
        }
      })
      .compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signIn', () => {
    const user = { id: 1, username: 'username', password: bcrypt.hashSync('password', 10) } as User;
    
    it('should throw unauthorized exception when password is invalid', () => {
      jest.spyOn(userService, "findOne").mockResolvedValue(user);
      jest.spyOn(jwtService, "signAsync");
      expect(
        async () => await service.signIn("username", "wrong_password")
      ).rejects.toThrow(UnauthorizedException);
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should return object with access token when credentials are valid', async () => {
      jest.spyOn(userService, "findOne").mockResolvedValue(user);
      jest.spyOn(jwtService, "signAsync").mockResolvedValue("access_token") 

      const expectedResult = { access_token: 'access_token' };
      const result = await service.signIn("username", "password")

      expect(result).toEqual(expectedResult);
    });
  })
});
