export interface AjaxInitService {

    process(url: string, method: string, data?: any): any[];

    add(handler: any): void;

    remove(handler: any): void;
}