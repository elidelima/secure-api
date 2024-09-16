import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { HttpStatus, INestApplication } from '@nestjs/common';

describe('AuthController (e2e)', () => {
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

  describe('/auth/login (POST)', () => {

    it('should return UNAUTHORIZED when credentials are empty', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: '',
          password: '',
        });
      expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it('should return UNAUTHORIZED when credentials are invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'admin',
          password: ''
        });

      expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it('should return status 200 with valid access token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: 'admin',
          password: 'changeme'
        });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          access_token: expect.any(String)
        })
      );
    });
  })
});
