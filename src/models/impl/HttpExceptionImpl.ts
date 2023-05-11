import { HttpException } from '@core/models/HttpException';

export class HttpExceptionImpl extends Error implements HttpException {

    type: string = ``;

    details: string = ``;

    statusCode: number = 200;

    extensions: Map<string, string>;

    title: string;

    exception: any;

    constructor(type: string, details: string, statusCode: number, exception: any) {
        super(type);
        this.type = type;
        this.details = details;
        this.statusCode = statusCode;
        this.extensions = new Map<string, string>();
        this.title = type;
        this.exception = exception;
    }


}