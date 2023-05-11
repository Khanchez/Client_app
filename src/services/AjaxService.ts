export interface AjaxService {

    get(url: string): Promise<any>;

    post(url: string, data?: any): Promise<any>;
}