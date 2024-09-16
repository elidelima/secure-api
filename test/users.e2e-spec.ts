import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';

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
});
