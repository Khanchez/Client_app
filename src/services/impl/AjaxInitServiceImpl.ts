import type { AjaxInitService } from '@core/services/AjaxInitService';
import { injectable } from 'inversify';

@injectable()
export class AjaxInitServiceImpl implements AjaxInitService {

    private _urlInitList: Map<string, any> = new Map();

    constructor() {
    }

    process(url: string, method: string, data: any = null) {

        const handlerList = this._urlInitList.get(url);
        if (handlerList) {
            handlerList.forEach(handler => [url, method, data] = handler.process(url, method, data));
        }

        return [url, method, data];
    }

    add(handler: any) {
        const url = handler.getUrl();
        let processList = this._urlInitList.get(url);
        if (!processList) {
            processList = new Set();
            this._urlInitList.set(url, processList);
        }

        processList.add(handler);
    }

    remove(handler: any) {
        let processList = this._urlInitList.get(handler.getUrl());
        if (processList) {
            processList.delete(handler);
        }
    }
}