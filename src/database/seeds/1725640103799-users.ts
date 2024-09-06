import { User } from 'src/users/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class Users1725640103799 implements Seeder {
    track = true;

    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ): Promise<any> {
        const repository = dataSource.getRepository(User);
        await repository.insert([{
            email: 'eli@lima.com',
            password: '123456',
            username: 'elilima',
            fullName: 'Eli Lima'
        }])

    }
}
