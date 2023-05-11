import type { UserService } from '@core/services/UserService';
import type { AjaxInitService } from '@core/services/AjaxInitService';
import type { AjaxService } from '@core/services/AjaxService';
import type { HttpException } from '@core/models/HttpException';
import * as FACTORY from '@core/constants/Factory';
import { HttpExceptionImpl } from '@core/models/impl/HttpExceptionImpl';
import { injectable, inject } from 'inversify';
import { HTTP_METHOD } from '../../constants/HttpMethod';
import { CTRL } from '../../constants/Ctrl';
import { HEADER } from '../../constants/Header';

@injectable()
export class AjaxServiceImpl implements AjaxService {
    
    constructor(
        @inject(FACTORY.SERVICE.USER) private readonly userService: UserService,
        @inject(FACTORY.SERVICE.AJAX_INIT) private readonly ajaxInitService: AjaxInitService
    ) {
    }

    get(url: string) {
        return this.ajax(url, HTTP_METHOD.GET);
    }

    post(url: string, data: any) {
        return this.ajax(url, HTTP_METHOD.POST, data);
    }

    private async ajax(url: string, method: string, data: any = null) {
        [url, method, data] = this.ajaxInitService.process(url, method, data);

        let token = this.userService.getToken()
        let headers = new Headers();
        if (!(data instanceof FormData)) {
            headers.set(HEADER.CONTENT_TYPE, HEADER.APP_JSON);
        }

        if (token) {
            headers.set(HEADER.AUTH_TOKEN, token);
        }

        let request: RequestInit = {
            method: method,
            headers: headers,
            body: CTRL.EMPTY
        };
        if (data) {
            if (data instanceof FormData) {
                request.body = data;
            } else {
                request.body = JSON.stringify(data)
            }
        }

        const response = await fetch(url, request);
        const responseText = await response.text();
        const contentLength = responseText.length;
        const responseJson = contentLength ? JSON.parse(responseText) : {}; 

        if (response.ok) 
            return responseJson;
        
        throw this.handleError(responseJson);
    }

    private handleError(data: any): HttpException {
        let exceptionType = data?.type ?? HEADER.ERROR;
        let errorDetails = data?.title ?? HEADER.ERROR;
        let code = data?.status ?? 500;
        let baseException = data.exception ?? {};
        let ex = new HttpExceptionImpl(exceptionType, errorDetails, code, baseException);
        Object.keys(data).forEach(key => {
            ex.extensions.set(key, data[key]);
        });
        return ex;
    }
}