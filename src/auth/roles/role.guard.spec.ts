import { Test } from "@nestjs/testing";

import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { RolesGuard } from "./roles.guard";
import { UsersService } from "src/users/users.service";
import { User } from "src/users/user.entity";

describe('RoleGuard', () => {
    let guard: RolesGuard;
    let reflector: Reflector;
    let usersService: UsersService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [RolesGuard],
        }).useMocker((token) => {
            if (token === Reflector) return { getAllAndOverride: jest.fn() }
            if (token === UsersService) return { findOne: jest.fn() }
        })
            .compile();

        guard = module.get<RolesGuard>(RolesGuard);
        reflector = module.get<Reflector>(Reflector);
        usersService = module.get<UsersService>(UsersService);
    })

    describe('canActivate', () => {
        it('should grant access when annotation for rules is present', async () => {
            // Given
            jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(null);
            jest.spyOn(usersService, 'findOne');

            const executionContext = {
                getHandler: () => null,
                getClass: () => null,
            } as any as ExecutionContext;

            // When
            const response = await guard.canActivate(executionContext);

            // Then
            expect(response).toEqual(true);
            expect(reflector.getAllAndOverride).toHaveBeenCalledWith('roles', [null, null]);
            expect(usersService.findOne).not.toHaveBeenCalled();
        })

        it('should deny access', async () => {
            // Given
            const user = { role: 'user' } as User;
            jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);
            jest.spyOn(usersService, 'findOne').mockResolvedValueOnce(user);

            const executionContext = {
                getHandler: () => null,
                getClass: () => null,
                switchToHttp: () => ({
                    getRequest: () => ({
                        user: { username: 'username' },
                    }),
                }),
            } as any as ExecutionContext;

            // When
            const response = await guard.canActivate(executionContext);

            // Then
            expect(response).toBe(false);
            expect(reflector.getAllAndOverride).toHaveBeenCalledWith('roles', [null, null]);
            expect(usersService.findOne).toHaveBeenCalledWith('username');
        })

        it('should grant access', async () => {
            // Given
            const user = { role: 'user' } as User;
            jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['user']);
            jest.spyOn(usersService, 'findOne').mockResolvedValueOnce(user);

            const executionContext = {
                getHandler: () => null,
                getClass: () => null,
                switchToHttp: () => ({
                    getRequest: () => ({
                        user: { username: 'username' },
                    }),
                }),
            } as any as ExecutionContext;

            // When 
            const response = await guard.canActivate(executionContext);

            // Then
            expect(response).toBe(true);
            expect(reflector.getAllAndOverride).toHaveBeenCalledWith('roles', [null, null]);
            expect(usersService.findOne).toHaveBeenCalledWith('username');
        })
    })

})