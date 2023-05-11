export interface HttpException extends Error {

    title: string;

    details: string;

    statusCode: number;

    extensions: Map<string, string>;
}