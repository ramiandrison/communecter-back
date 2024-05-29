import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { TransformInterceptor } from './filters/api.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    
    app.enableCors();
    
    app.useStaticAssets(join(__dirname, '..', 'public/build'));
    app.setBaseViewsDir(join(__dirname, '..', 'public/build'));
    app.setViewEngine('html');

    app.useGlobalPipes(new ValidationPipe(
        {
            whitelist: true, // Strips properties not defined in the DTO
            forbidNonWhitelisted: true, // Throws an error when non-whitelisted properties are received
            transform: true // Automatically transform payloads to match DTO classes
        }
    ));

    app.useGlobalInterceptors(new TransformInterceptor());

    // Set global prefix for API routes
    app.setGlobalPrefix('api');

    // Middleware to handle React routes
    app.use((req, res, next) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(join(__dirname, '..', 'public/build', 'index.html'));
        } else {
            next();
        }
    });

    app.useGlobalFilters(new HttpExceptionFilter());

    const config = new DocumentBuilder()
        .setTitle('API DOC')
        .setDescription('Documentation de l\'api')
        .setVersion('1.0')
        .addTag('Doc')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/doc', app, document);

    const PORT = parseInt(process.env.PORT, 10) || 3000;
    await app.listen(PORT);
}
bootstrap();
