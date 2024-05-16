import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { TransformInterceptor } from './filters/api.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const PORT = parseInt(process.env.PORT, 10) || 3000;

    app.useGlobalPipes(new ValidationPipe(
        {
            whitelist: true, // Strips properties not defined in the DTO
            forbidNonWhitelisted: true, // Throws an error when non-whitelisted properties are received
            transform: true // Automatically transform payloads to match DTO classes
        }
    ));

    app.useGlobalInterceptors(new TransformInterceptor());

    app.setGlobalPrefix('api'); // /api/route

    app.useGlobalFilters(new HttpExceptionFilter());

    const config = new DocumentBuilder()
        .setTitle('API DOC')
        .setDescription('Documentation de l\'api')
        .setVersion('1.0')
        .addTag('co')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/doc', app, document);

    await app.listen(PORT);
}
bootstrap();
