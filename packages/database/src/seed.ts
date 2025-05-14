import type { Prisma } from '../generated/prisma/client';
import { prisma } from './client';
import { hash } from 'bcrypt';

const DEFAULT_USERS: Prisma.UserCreateInput[] = [
    {
        email: 'test1@example.com',
        password: 'test1',
    },
    {
        email: 'test2@example.com',
        password: 'test2',
    },
    {
        email: 'test3@example.com',
        password: 'test3',
    },
];

void (async () => {
    try {
        await Promise.all(
            DEFAULT_USERS.map(async (user) => {
                const hashedPassword = await hash(user.password, 12);

                return prisma.user.upsert({
                    where: {
                        email: user.email,
                    },
                    update: {},
                    create: {
                        ...user,
                        password: hashedPassword,
                    },
                });
            }),
        );
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
    finally {
        await prisma.$disconnect();
    }
})();
