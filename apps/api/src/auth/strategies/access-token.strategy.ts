import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

type JwtPayload = {
    sub: string;
    username: string;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt-access') {
    constructor(readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                AccessTokenStrategy.extractJWT,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            secretOrKey: configService.get('JWT_ACCESS_SECRET')!,
        });
    }

    validate(payload: JwtPayload) {
        return payload;
    }

    private static extractJWT(this: void, req: Request) {
        return req.cookies.access_token as string || null;
    }
}
