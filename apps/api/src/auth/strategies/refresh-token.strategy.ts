import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(readonly configService: ConfigService<EnvironmentVariables>) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([RefreshTokenStrategy.extractJWT]),
            secretOrKey: configService.getOrThrow('JWT_REFRESH_SECRET'),
            passReqToCallback: true,
        });
    }

    validate(req: Request, payload: any): any {
        const refreshToken = RefreshTokenStrategy.extractJWT(req);
        if (!refreshToken) {
            throw new UnauthorizedException();
        }

        return { ...payload, refreshToken };
    }

    private static extractJWT(this: void, req: Request) {
        return req.cookies.refresh_token as string || null;
    }
}
