import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@repo/db';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
    private static readonly OMITTED_FIELDS: Partial<Record<keyof User, boolean>> = {
        password: true,
        refreshToken: true,
    };

    constructor(private readonly prisma: PrismaService) {}

    async create(email: string, hashedPassword: string) {
        const existingUser = await this.findByEmail(email);

        if (existingUser) {
            throw new BadRequestException();
        }

        return this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
            omit: UsersService.OMITTED_FIELDS,
        });
    }

    async update(id: number, data: Prisma.UserUpdateInput) {
        return this.prisma.user.update({
            where: {
                id,
            },
            data,
            omit: UsersService.OMITTED_FIELDS,
        });
    }

    getAllPublicUsers() {
        return this.prisma.user.findMany({
            omit: UsersService.OMITTED_FIELDS,
        });
    }

    getPublicUser(id: number) {
        return this.prisma.user.findUnique({
            where: { id },
            omit: UsersService.OMITTED_FIELDS,
        });
    }

    findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
}
