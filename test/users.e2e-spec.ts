import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import * as userCredentials from './config/user-tokens.json';
import { Role } from 'src/auth/roles/role.enum';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
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

  describe.only('/users GET', () => {
    it('should return 401 when no credentials informed', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')

      expect(response.statusCode).toEqual(401);
      expect(response.body.message).toEqual('Unauthorized');
    });

    it.only('should be forbidden for user role', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${userCredentials.user.access_token}`)

      expect(response.statusCode).toEqual(403);
      expect(response.body.message).toEqual('Forbidden resource');
    });

    it('should return a list with users when called by admin', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${userCredentials.admin.access_token}`)

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
    });
  });
});
