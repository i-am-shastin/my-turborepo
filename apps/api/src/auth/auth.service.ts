import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from '@repo/crypto';

import { CredentialsDto } from './dto/credentials.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PUBLIC_USER_FIELDS } from 'src/const';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService<EnvironmentVariables>,
    ) {}

    async signUp({ email, password }: CredentialsDto) {
        const hashedPassword = await hash(password);
        const newUser = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        return this.bakeTastyCookies(newUser.id, newUser.email);
    }

    async signIn({ email, password }: CredentialsDto) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new UnauthorizedException();
        }

        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException();
        }

        return this.bakeTastyCookies(user.id, user.email);
    }

    async refresh(id: number | undefined, token: string) {
        if (!id) {
            throw new UnauthorizedException();
        }

        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user || !user.refreshToken) {
            throw new UnauthorizedException();
        }

        const isRefreshTokenValid = await compare(token, user.refreshToken);
        if (!isRefreshTokenValid) {
            throw new UnauthorizedException();
        }

        return this.bakeTastyCookies(id, user.email);
    }

    private async bakeTastyCookies(id: number, email: string) {
        const cookies = await this.getJWTCookies(id, email);

        await this.prisma.user.update({
            where: { id },
            data: {
                refreshToken: await hash(cookies.refresh_token.value),
            },
            select: PUBLIC_USER_FIELDS,
        });

        return cookies;
    }

    private async getJWTCookies(sub: number, email: string) {
        const payload = { sub, email };

        return {
            access_token: await this.createCookie(
                payload,
                this.configService.getOrThrow('JWT_ACCESS_SECRET'),
                this.configService.getOrThrow('JWT_ACCESS_EXPIRE_SECONDS'),
            ),
            refresh_token: await this.createCookie(
                payload,
                this.configService.getOrThrow('JWT_REFRESH_SECRET'),
                this.configService.getOrThrow('JWT_REFRESH_EXPIRE_SECONDS'),
            ),
        };
    }

    private async createCookie(payload: JwtPayload, secret: string | Buffer<ArrayBufferLike>, expiresIn: number) {
        const value = await this.jwtService.signAsync(payload, { secret, expiresIn: `${expiresIn}s` });
        return {
            value,
            maxAge: expiresIn * 1000,
        };
    }
}
