import { Controller, Get, ImATeapotException, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { ApiCookieAuth } from '@nestjs/swagger';
import { Request } from 'express';

import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { UsersService } from './users.service';

@Controller()
@UseInterceptors(CacheInterceptor)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(AccessTokenGuard)
    @Get('users')
    @CacheKey('users')
    @CacheTTL(60_000)
    @ApiCookieAuth()
    listUsers() {
        return this.usersService.getAllPublicUsers();
    }

    @UseGuards(AccessTokenGuard)
    @Get('me')
    @ApiCookieAuth()
    @CacheTTL(1000)
    getCurrentUser(@Req() req: Request) {
        if (!req.user) {
            throw new ImATeapotException();
        }
        return this.usersService.getPublicUser(req.user.sub);
    }
}
