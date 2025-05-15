import type { Prisma } from '../dist/client';
import { prisma } from '.';
import { hash } from '@repo/crypto';

const DEFAULT_USERS: Prisma.UserCreateInput[] = Array.from({ length: 3 }, (_, i) => {
    return {
        email: `test${i + 1}@example.com`,
        password: 'dummyuser',
    };
});

void (async () => {
    try {
        await Promise.all(
            DEFAULT_USERS.map(async ({ email, password }) => {
                return prisma.user.upsert({
                    where: {
                        email,
                    },
                    update: {},
                    create: {
                        email,
                        password: await hash(password), // Thats okay even if we are setting same password for each user
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
