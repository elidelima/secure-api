import { Test } from "@nestjs/testing";
import { AuthGuard } from "./auth.guard"
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { ExecutionContext, UnauthorizedException } from "@nestjs/common";

describe('AuthGuard', () => {
    let guard: AuthGuard;
    let jwtService: JwtService;
    let reflector: Reflector;
    let configService: ConfigService<EnvironmentVariables>;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [AuthGuard],
        }).useMocker((token) => {
            if (token === JwtService) return { verifyAsync: jest.fn() }
            if (token === Reflector) return { getAllAndOverride: jest.fn() }
            if (token === ConfigService) return { get: jest.fn() }
        })
            .compile();

        guard = module.get<AuthGuard>(AuthGuard);
        jwtService = module.get<JwtService>(JwtService);
        reflector = module.get<Reflector>(Reflector);
        configService = module.get<ConfigService<EnvironmentVariables>>(ConfigService);
    })

    describe('canActivate', () => {
        it('should grant access for public public routes', async () => {
            // Given
            const isPublic = true;
            jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(isPublic);
            jest.spyOn(jwtService, 'verifyAsync');
            jest.spyOn(configService, 'get');

            const executionContext = {
                getHandler: () => null,
                getClass: () => null,
            } as any as ExecutionContext;

            // When
            const response = await guard.canActivate(executionContext);

            // Then
            expect(response).toEqual(true);
            expect(reflector.getAllAndOverride).toHaveBeenCalledWith('isPublic', [null, null]);
            expect(jwtService.verifyAsync).not.toHaveBeenCalled();
            expect(configService.get).not.toHaveBeenCalled();
        })

        it('should deny access', () => {
            // Given
            const isPublic = false;
            jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(isPublic);
            jest.spyOn(jwtService, 'verifyAsync');
            jest.spyOn(configService, 'get');

            const executionContext = {
                getHandler: () => null,
                getClass: () => null,
                switchToHttp: () => ({
                    getRequest: () => ({ headers: {} }),
                }),
            } as any as ExecutionContext;

            // When - Then
            expect(async () => await guard.canActivate(executionContext)).rejects.toThrow(UnauthorizedException);

            // Then
            expect(reflector.getAllAndOverride).toHaveBeenCalledWith('isPublic', [null, null]);
            expect(jwtService.verifyAsync).not.toHaveBeenCalled();
            expect(configService.get).not.toHaveBeenCalled();
        })

        it('should grant access', async () => {
            // Given
            const isPublic = false;
            jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(isPublic);
            jest.spyOn(jwtService, 'verifyAsync').mockResolvedValueOnce({});
            jest.spyOn(configService, 'get').mockReturnValue("secret");

            const executionContext = {
                getHandler: () => null,
                getClass: () => null,
                switchToHttp: () => ({
                    getRequest: () => ({ 
                        headers: {
                            authorization: "Bearer access_token"
                        } 
                    }),
                }),
            } as any as ExecutionContext;

            // When 
            const response = await guard.canActivate(executionContext);

            // Then
            expect(response).toBe(true);
            expect(reflector.getAllAndOverride).toHaveBeenCalledWith('isPublic', [null, null]);
            expect(jwtService.verifyAsync).toHaveBeenCalledWith('access_token', { secret: 'secret'});
            expect(configService.get).toHaveBeenCalledWith('jwtSecret');
        })
    })

})