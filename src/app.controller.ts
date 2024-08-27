import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public, Roles } from 'nest-keycloak-connect';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/admin')
  @Roles({ roles: ['realm:admin']})
  getHelloToAdmin(): string {
    return 'relow admin';
  }

  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }
}
