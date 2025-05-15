import { hash as bcryptHash } from 'bcrypt';

const BCRYPT_DEFAULT_ROUNDS = 12;

export function hash(data) {
    return bcryptHash(data, BCRYPT_DEFAULT_ROUNDS);
}

export { compare } from 'bcrypt';
