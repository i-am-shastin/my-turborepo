import { Module } from '@nestjs/common';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AccessTokenStrategy } from '../auth/strategies/access-token.strategy';

@Module({
    controllers: [UsersController],
    providers: [UsersService, AccessTokenStrategy],
})
export class UsersModule {}
