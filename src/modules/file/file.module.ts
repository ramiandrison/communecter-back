import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { FileController } from 'src/controllers/file/file.controller';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
    imports: [
        MulterModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                /*dest: configService.get<string>('MULTER_DEST'),
                fileFilter: (req, file, callback) => {
                    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                        return callback(new Error('Only image files are allowed!'), false);
                    }
                    callback(null, true);
                },*/
                storage: diskStorage({
                    destination: configService.get<string>('MULTER_DEST'),
                    filename: (req, file, callback) => {
                      const uniqueName = `${Date.now()}-file-${Math.round(Math.random() * 1E9)}${extname(file.originalname)}`;
                      callback(null, uniqueName);
                    }
                }),
            }),
            inject: [ConfigService],
        })
    ],
    providers: [],
    controllers: [FileController],
    exports: []
})

export class FileModule {}
