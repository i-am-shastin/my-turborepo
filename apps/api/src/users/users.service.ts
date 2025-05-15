import type { Prisma } from '@repo/db';
import { Injectable } from '@nestjs/common';

import { PUBLIC_USER_FIELDS } from 'src/const';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async update(id: number, data: Prisma.UserUpdateInput) {
        return this.prisma.user.update({
            where: { id },
            data,
            select: PUBLIC_USER_FIELDS,
        });
    }

    getAllPublicUsers() {
        return this.prisma.user.findMany({
            select: PUBLIC_USER_FIELDS,
        });
    }

    getPublicUser(id: number) {
        return this.prisma.user.findUnique({
            where: { id },
            select: PUBLIC_USER_FIELDS,
        });
    }
}
