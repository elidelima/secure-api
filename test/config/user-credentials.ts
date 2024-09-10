import { AuthService } from "src/auth/auth.service";
import { User } from "src/users/user.entity"
import { UsersService } from "src/users/users.service"
import { DataSource } from "typeorm"
import { JwtService } from '@nestjs/jwt';
import { config as dotenvConfig } from 'dotenv';
import * as fs from 'fs';
import { Role } from "src/auth/roles/role.enum";

dotenvConfig({ path: '.env' });

export type UserCredentials = {
    [role in Role]: { access_token: string};
}

export default async function loadUserCredentials(datasource: DataSource) {
    const userRepository = datasource.getRepository(User);
    
    const usersService = new UsersService(userRepository);
    
    const jwtService = new JwtService({
        secret: process.env.JWT_SECRET,
        global: true,
        signOptions: { expiresIn: '1000s' },
    });

    const authService = new AuthService(usersService, jwtService);

    const userCredentials = {
        admin: await authService.signIn('admin', 'changeme'),
        user: await authService.signIn('user', 'changeme'),
    }

    const strData = JSON.stringify(userCredentials, null, 2);
    
    fs.writeFileSync('./test/config/user-tokens.json', strData);    
}