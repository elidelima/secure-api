
## Description

Boilerplate project built with [NestJS](https://github.com/nestjs/nest) framework.
* Authentication Enabled (AuthGuard & RoleGuard)
* E2E tests configured

## Project setup

```bash
$ npm install
```

## Database setup
```bash
# create database
$ npm run db:create

# run migrations
$ npm run migration:run

# revert migration
$ npm run migration:revert

# create new migration
$ npm run migration:generate --name=migration_name

# create new seed (seeds are the same as migrations, for control reason, they are just being kept in a different folder)
$ npm run seed:generate --name=seed_name

```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests˚
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).

## Nest License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
