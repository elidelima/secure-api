import { Role } from "src/auth/roles/role.enum";
import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class CreateUser1725389366350 implements MigrationInterface {

    TABLE_NAME = 'user';

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log(...Object.values(Role));
        await queryRunner.createTable(new Table({
            name: this.TABLE_NAME,
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'username',
                    type: 'varchar',
                    isNullable: false,
                    isUnique: true,
                },
                {
                    name: 'email',
                    type: 'varchar',
                    isNullable: false,
                    isUnique: true,
                },
                {
                    name: 'password',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'full_name',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'role',
                    type: 'enum',
                    enum: [...Object.values(Role)],
                    enumName: 'rolesEnum',
                    default: `'${Role.User}'`,
                    isNullable: false,
                },
            ]
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.TABLE_NAME, true);
    }

}
