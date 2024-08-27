import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard, KeycloakConnectModule, PolicyEnforcementMode, ResourceGuard, RoleGuard, TokenValidation } from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [KeycloakConnectModule.register({
    authServerUrl: 'http://localhost:8080', // might be http://localhost:8080/auth for older keycloak versions
    realm: 'cloud-backup-system',
    clientId: 'api-service',
    secret: "eRtr2j2nFVIPj2gCtymPqp9NjIyCpPsS",
    policyEnforcement: PolicyEnforcementMode.PERMISSIVE, // optional
    tokenValidation: TokenValidation.ONLINE, // optional
  }), AuthModule, UsersModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    AppService],
})
export class AppModule {}
