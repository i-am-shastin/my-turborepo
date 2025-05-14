import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CredentialsSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

// class is required for using DTO as a type
export class CredentialsDto extends createZodDto(CredentialsSchema) {}
