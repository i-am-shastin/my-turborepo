import { Controller, Post, Body, Res, Req, UseGuards, HttpCode, UsePipes } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCookieAuth, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { CredentialsDto } from './dto/credentials.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller('auth')
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @ApiCreatedResponse({ description: 'Signed up successfully' })
    @ApiBadRequestResponse({ description: 'Invalid payload or user already exists' })
    @UsePipes(ZodValidationPipe)
    async signUp(@Body() credentials: CredentialsDto, @Res({ passthrough: true }) response: Response) {
        const tokens = await this.authService.signUp(credentials);
        AuthController.writeResponseCookies(response, tokens);
    }

    @Post('login')
    @ApiOkResponse({ description: 'Login successful' })
    @ApiUnauthorizedResponse({ description: 'Invalid email or password' })
    @HttpCode(200)
    @UsePipes(ZodValidationPipe)
    async signIn(@Body() credentials: CredentialsDto, @Res({ passthrough: true }) response: Response) {
        const tokens = await this.authService.signIn(credentials);
        AuthController.writeResponseCookies(response, tokens);
    }

    @UseGuards(RefreshTokenGuard)
    @Post('refresh')
    @ApiCreatedResponse({ description: 'Tokens refreshed' })
    @ApiUnauthorizedResponse({ description: 'Invalid or stale refresh_token' })
    @ApiCookieAuth('refresh_token')
    async refresh(@Req() req: Request, @Res({ passthrough: true }) response: Response) {
        const tokens = await this.authService.refresh(req.user);
        AuthController.writeResponseCookies(response, tokens);
    }

    private static writeResponseCookies(response: Response, tokens: Record<string, { value: string; maxAge: number }>) {
        for (const [name, data] of Object.entries(tokens)) {
            response.cookie(`${name}_token`, data.value, { httpOnly: true, maxAge: data.maxAge });
        }
    }
}
