import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import * as userCredentials from './config/user-tokens.json';
import { Role } from 'src/auth/roles/role.enum';
import * as responseTime from 'response-time';
import { ConfigService } from '@nestjs/config';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let configService: ConfigService<EnvironmentVariables>;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    configService = app.get(ConfigService);
    app.use(responseTime({
      header: configService.get('responseTime').header,
      suffix: false
    }));

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/users GET', () => {
    it('should return 401 when no credentials informed', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')

      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual('Unauthorized');
    });

    it('should be forbidden for user role', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${userCredentials.user.access_token}`)

      expect(response.statusCode).toEqual(403);
      expect(response.body.message).toEqual('Forbidden resource');
    });

    const CALLS_WITH_RESPONSE_TIMES = [
      ['first', 10.000],
      ['second', 5.000],
      ['third', 5.000]
    ];
    it.each(CALLS_WITH_RESPONSE_TIMES)(
      'Calling for the %s time should return response under %sms',
      async (nthCall, expectedResponseTime) => {
        const response = await request(app.getHttpServer())
          .get('/users')
          .set('Authorization', `Bearer ${userCredentials.admin.access_token}`)

        const responseTimeHeaderName = configService.get('responseTime').header;
        const responseTime = Number(response.headers[responseTimeHeaderName]);
        
        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveLength(2);
        expect(response.body).toEqual(
          expect.arrayContaining(
            [
              expect.objectContaining({
                id: expect.any(Number),
                username: expect.any(String),
                email: expect.any(String),
                fullName: expect.any(String),
                role: expect.stringMatching(new RegExp(Object.values(Role).join('|'))),
              })
            ],
          )
        );
        expect(responseTime).toBeLessThanOrEqual(Number(expectedResponseTime));
      });
  });

  describe('/users POST', () => {
    it('should return 400 - bad params when body is empty', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send();
      expect(response.statusCode).toEqual(400);
      const { statusCode, message } = JSON.parse(response.text);
      expect(statusCode).toEqual(400);
      expect(message).toEqual(expect.arrayContaining([
        'username must be a string',
        'password must be a string',
        'email must be an email',
        'email must be a string',
        'fullName must be a string',
      ]));
    });

    it('should return 400 - bad params when body is imcomplete', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          username: 'username',
          password: 'password',
        });

      const { statusCode, message } = JSON.parse(response.text);
      expect(statusCode).toEqual(400);
      expect(message).toEqual(expect.arrayContaining([
        'email must be an email',
        'email must be a string',
        'fullName must be a string',
      ]));

    });

    it('should return 400 - bad params when email is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          username: 'username',
          password: 'password',
          fullName: 'fullName',
          email: 'email',
        });

      expect(response.statusCode).toEqual(400);

      const { message } = JSON.parse(response.text);
      expect(message).toEqual(expect.arrayContaining([
        'email must be an email'
      ]));
    });

    it('should create user and return new id', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({
          username: 'username',
          password: 'password',
          fullName: 'fullName',
          email: 'email@email.com',
        });

      expect(response.statusCode).toEqual(201);
      expect(response.body).toEqual(
        expect.objectContaining({ id: expect.any(Number) })
      );
    });
  });

  describe('/users GET after creating new user', () => {
    const CALLS_WITH_RESPONSE_TIMES = [
      ['first', 10.000],
      ['second', 5.000],
      ['third', 5.000]
    ];
    it.each(CALLS_WITH_RESPONSE_TIMES)(
      'Calling for the %s time should return response under %sms',
      async (nthCall, expectedResponseTime) => {
        const response = await request(app.getHttpServer())
          .get('/users')
          .set('Authorization', `Bearer ${userCredentials.admin.access_token}`)

        const responseTimeHeaderName = configService.get('responseTime').header;
        const responseTime = Number(response.headers[responseTimeHeaderName]);
        
        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveLength(3);
        expect(response.body).toEqual(
          expect.arrayContaining(
            [
              expect.objectContaining({
                id: expect.any(Number),
                username: expect.any(String),
                email: expect.any(String),
                fullName: expect.any(String),
                role: expect.stringMatching(new RegExp(Object.values(Role).join('|'))),
              })
            ],
          )
        );
        expect(responseTime).toBeLessThanOrEqual(Number(expectedResponseTime));
      });
  });
});
