import { Module } from '@nestjs/common';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        CacheModule.register({ isGlobal: true }),
        AuthModule,
        UsersModule,
        PrismaModule,
    ],
    controllers: [],
    providers: [{
        provide: APP_INTERCEPTOR,
        useClass: CacheInterceptor,
    }],
})
export class AppModule {}
