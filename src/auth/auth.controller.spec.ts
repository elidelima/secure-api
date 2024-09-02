import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';
import { AuthGuard } from './auth.guard';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    })
      .useMocker((token) => {
        if (token === AuthService) {
          return { signIn: jest.fn() }
        }
        if (token === AuthGuard) {
          return { any: jest.fn() }
        }
      })
      .overrideGuard(AuthGuard).useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('signIn', () => {
    it('should return ojbect with access token', async () => {
      const expectedResult = { access_token: 'access_token' };
      jest.spyOn(authService, "signIn").mockResolvedValue(expectedResult);
      
      const loginDto: LoginDto = { username: "username", password: "password" };
      const result = await controller.signIn(loginDto);
      
      expect(result).toEqual(expectedResult);
      expect(authService.signIn).toHaveBeenNthCalledWith(1, loginDto.username, loginDto.password);
    });
  });
});
