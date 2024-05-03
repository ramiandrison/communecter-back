import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from 'src/filters/api.response';  // Ensure correct import path

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const success =  exception.getStatus() === 200 ? true : false;
        const status = exception.getStatus();
        const exceptionResponse: any = exception.getResponse();

        let errorMessage = 'An unexpected error occurred';  // Default message

        // Handle different formats of the exception response
        if (typeof exceptionResponse === 'string') {
            errorMessage = exceptionResponse;
        } else if (exceptionResponse?.message) {
            if (Array.isArray(exceptionResponse.message)) {
                // Join message array into a single string if it's an array
                errorMessage = exceptionResponse.message.join(', ');
            } else {
                // Directly use the message if it's a string
                errorMessage = exceptionResponse.message;
            }
        }

        response.status(status).json(new ApiResponse(
            null,
            errorMessage,
            success,
            status
        ));
    }
}