import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/admin')
  getHelloToAdmin(): string {
    return 'relow admin';
  }

  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }
}
