declare module '@repo/crypto' {
    export function hash(data: string | Buffer): Promise<string>;
    export { compare } from 'bcrypt';
}
