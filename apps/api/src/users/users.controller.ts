import { Controller, Get, ImATeapotException, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { ApiCookieAuth, ApiIAmATeapotResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Request } from 'express';

import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { UsersService } from './users.service';

@Controller()
@UseGuards(AccessTokenGuard)
@ApiCookieAuth()
@ApiOkResponse()
@ApiUnauthorizedResponse({ description: 'Simon says: Access denied' })
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('users')
    @UseInterceptors(CacheInterceptor)
    @CacheKey('users')
    @CacheTTL(60_000)
    listUsers() {
        return this.usersService.getAllPublicUsers();
    }

    @Get('me')
    @ApiIAmATeapotResponse({ description: 'Beep-bop! I\'m a teapot' })
    getCurrentUser(@Req() req: Request) {
        if (!req.user) {
            throw new ImATeapotException();
        }
        return this.usersService.getPublicUser(req.user.sub);
    }
}
