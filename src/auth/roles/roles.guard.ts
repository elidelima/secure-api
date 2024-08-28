import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLES_KEY } from "./roles.decorator";
import { Role } from "./role.enum";
import { UsersService } from "src/users/users.service";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private usersService: UsersService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
         const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
        console.log({ requiredRoles});
        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        // We could rely on the context and send the roles together with the credntials
        // That would save one query to the DB to verify the roles
        const { roles: userRoles } = await this.usersService.findOne(user.username);
        return requiredRoles.some((role) => userRoles?.includes(role));
    }
}