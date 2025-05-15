import { User } from '@repo/db';

export const PUBLIC_USER_FIELDS: Partial<Record<keyof User, boolean>> = {
    id: true,
    email: true,
};
