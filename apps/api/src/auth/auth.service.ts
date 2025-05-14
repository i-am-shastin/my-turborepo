import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';

import { CredentialsDto } from './dto/credentials.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    private static readonly JWT_ACCESS_SECRET_EXPIRE_IN = 900;
    private static readonly JWT_REFRESH_SECRET_EXPIRE_IN = 604_800;

    constructor(private readonly usersService: UsersService, private jwtService: JwtService, private configService: ConfigService) {}

    async signUp(credentials: CredentialsDto) {
        const hashedPassword = await hash(credentials.password, 12);
        const newUser = await this.usersService.create(credentials.email, hashedPassword);

        const tokens = await this.getTokens(newUser.id, newUser.email);
        await this.updateRefreshToken(newUser.id, tokens.refresh.value);
        return tokens;
    }

    async signIn(credentials: CredentialsDto) {
        const user = await this.usersService.findByEmail(credentials.email);
        if (!user) {
            throw new UnauthorizedException();
        }

        const isPasswordValid = await compare(credentials.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException();
        }

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refresh.value);
        return tokens;
    }

    async refresh(user?: Express.User) {
        if (!user) {
            throw new UnauthorizedException();
        }

        const tokens = await this.getTokens(user.sub, user.email);
        await this.updateRefreshToken(user.sub, tokens.refresh.value);
        return tokens;
    }

    async updateRefreshToken(id: number, refreshToken: string) {
        return this.usersService.update(id, {
            refreshToken: await hash(refreshToken, 12),
        });
    }

    async getTokens(sub: number, email: string) {
        const payload = { sub, email };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                payload,
                {
                    secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                    expiresIn: AuthService.JWT_ACCESS_SECRET_EXPIRE_IN,
                },
            ),
            this.jwtService.signAsync(
                payload,
                {
                    secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                    expiresIn: AuthService.JWT_REFRESH_SECRET_EXPIRE_IN,
                },
            ),
        ]);

        return {
            access: {
                value: accessToken,
                maxAge: AuthService.JWT_ACCESS_SECRET_EXPIRE_IN * 1000,
            },
            refresh: {
                value: refreshToken,
                maxAge: AuthService.JWT_REFRESH_SECRET_EXPIRE_IN * 1000,
            },
        };
    }
}
