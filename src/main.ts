import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
//import { TransformInterceptor } from './config/api.interceptor';

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
    //app.useGlobalInterceptors(new TransformInterceptor());
    await app.listen(PORT);
}
bootstrap();
