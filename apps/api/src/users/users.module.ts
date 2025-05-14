import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AccessTokenStrategy } from '../auth/strategies/access-token.strategy';
import { ConfigService } from '@nestjs/config';

@Module({
    controllers: [UsersController],
    providers: [UsersService, ConfigService, AccessTokenStrategy],
})
export class UsersModule {}
