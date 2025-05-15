import { Controller, Post, Body, Res, Req, UseGuards, HttpCode, UsePipes } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCookieAuth, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { CredentialsDto } from './dto/credentials.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller('auth')
@ApiTags('Auth')
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @ApiCreatedResponse({ description: 'Signed up successfully' })
    @ApiBadRequestResponse({ description: 'Invalid payload or user already exists' })
    @UsePipes(ZodValidationPipe)
    async signUp(@Body() credentials: CredentialsDto, @Res({ passthrough: true }) response: Response) {
        const cookies = await this.authService.signUp(credentials);
        AuthController.writeCookiesTo(response, cookies);
    }

    @Post('login')
    @ApiOkResponse({ description: 'Login successful' })
    @ApiUnauthorizedResponse({ description: 'Invalid email or password' })
    @HttpCode(200)
    @UsePipes(ZodValidationPipe)
    async signIn(@Body() credentials: CredentialsDto, @Res({ passthrough: true }) response: Response) {
        const cookies = await this.authService.signIn(credentials);
        AuthController.writeCookiesTo(response, cookies);
    }

    @UseGuards(RefreshTokenGuard)
    @Post('refresh')
    @ApiCreatedResponse({ description: 'Tokens refreshed' })
    @ApiUnauthorizedResponse({ description: 'Invalid or stale refresh_token' })
    @ApiCookieAuth('refresh_token')
    async refresh(@Req() req: Request, @Res({ passthrough: true }) response: Response) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const cookies = await this.authService.refresh(req.user?.sub, req.cookies['refresh_token']); // It has to be valid due to ApiCookieAuth decorator
        AuthController.writeCookiesTo(response, cookies);
    }

    private static writeCookiesTo(response: Response, cookies: Record<string, { value: string; maxAge: number }>) {
        for (const [name, data] of Object.entries(cookies)) {
            response.cookie(name, data.value, {
                httpOnly: true,
                maxAge: data.maxAge,
                // insecure, no restrictions, no predefined path
            });
        }
    }
}
