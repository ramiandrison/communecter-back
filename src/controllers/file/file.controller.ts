import { Body, Controller, HttpException, HttpStatus, Post, Req, Request, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { fileValidator, fileValidators } from 'src/config/file.validator';

@Controller()
export class FileController {
    constructor(){}

    //@Public()
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile(fileValidator) file: Express.Multer.File) {
        console.log('File uploaded:', file);
    }

    //@Public()
    @Post('uploads')
    @UseInterceptors(FilesInterceptor('files'))
    uploadMultipleFiles(@UploadedFiles(fileValidators) files: Array<Express.Multer.File>) {
        console.log(files);
    }
}
