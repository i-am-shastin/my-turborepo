declare namespace Express {
    export interface User {
        sub: number;
        email: string;
    }
}

interface EnvironmentVariables {
    JWT_ACCESS_SECRET: string;
    JWT_ACCESS_EXPIRE_SECONDS: number;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRE_SECONDS: number;
}

type JwtPayload = {
    sub: number;
    email: string;
};
