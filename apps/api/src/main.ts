import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { patchNestJsSwagger } from 'nestjs-zod';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());
    app.enableCors({
        origin: true, // Just for the demonstration purposes
        credentials: true,
    });
    patchNestJsSwagger();

    const config = new DocumentBuilder()
        .setTitle('My Turborepo')
        .setDescription('The Turborepo API description')
        .setVersion('10:33')
        .addTag('Auth', '<pre><b>Bakin\' some cookies</b></pre>')
        .addTag('Users', '<pre>const [users, setUsers] = use(Users)</pre>')
        .addCookieAuth('access_token', { type: 'apiKey' })
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);

    await app.listen(process.env.PORT ?? 30000);
}
void bootstrap();
