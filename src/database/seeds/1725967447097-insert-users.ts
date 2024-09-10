import { Role } from "src/auth/roles/role.enum";
import { User } from "src/users/user.entity";
import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from 'bcrypt';

export class InsertUsers1725967447097 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const hashedPassword = await bcrypt.hash('changeme', 10);
        await queryRunner.manager.save(User, [
            {
                email: 'admin@api.com',
                password: hashedPassword,
                username: 'admin',
                fullName: 'Admin',
                role: Role.Admin,
            }, {
                email: 'user@api.com',
                password: hashedPassword,
                username: 'user',
                fullName: 'User',
                role: Role.User,
            },
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        return Promise.resolve();
    }
}
