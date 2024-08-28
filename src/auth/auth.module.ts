import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles/roles.guard';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    // JwtModule.register({
    //   secret:jwtConstants.secret,
    //   global: true,
    //   signOptions: { expiresIn: '60s' },
    // })
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService<EnvironmentVariables>) => {
        return {
          secret: configService.get('jwtSecret'),
          global: true,
          signOptions: { expiresIn: '60s' },
        }
      },
      inject: [ConfigService]
    })
  ],
controllers: [AuthController],
  providers: [
    AuthService, 
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ]
})
export class AuthModule { }
