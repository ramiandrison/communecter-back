export class ApiResponse<T> {
    // Define properties that will be set by the constructor
    public data: T;
    public message: string;
    public success: boolean;
    public statusCode: number;
    public errors?: string[];

    constructor(data: any, message: string, success: boolean, statusCode: number, errors?: string[]) {
        // Initialize properties with the values passed to the constructor
        this.data = data;
        this.message = message;
        this.success = success;
        this.statusCode = statusCode;
        this.errors = errors;
    }
}