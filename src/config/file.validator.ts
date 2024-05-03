import { FileTypeValidator, HttpStatus, MaxFileSizeValidator, ParseFilePipe, ParseFilePipeBuilder } from "@nestjs/common";

export const fileValidator = new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 5000 }),
      //new FileTypeValidator({ fileType: 'image/jpeg' }),
    ],
});

export const fileValidators = new ParseFilePipeBuilder()
/*.addFileTypeValidator({
    fileType: 'jpeg',
})*/
.addMaxSizeValidator({
    maxSize: 5000
})
.build({
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
});