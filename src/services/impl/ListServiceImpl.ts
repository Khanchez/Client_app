import type { AjaxService } from '@core/services/AjaxService'
import type { ListService } from '@core/services/ListService'
import { injectable, inject } from 'inversify';
import * as FACTORY from '@core/constants/Factory';

const listApiBaseUrl = '/api/list/';

@injectable()
export class ListServiceImpl implements ListService {

    private listHash: Map<string, object> = new Map<string, object>();

    constructor(
        @inject(FACTORY.SERVICE.AJAX) private readonly ajaxService: AjaxService
    ) {
    }

    get(listId: string, update: boolean = false) {

        if (!update && this.listHash.has(listId)) {
            return new Promise((resolve) => {
                const listConfig = this.listHash.get(listId);
                resolve(listConfig);
            });
        }

        return this.ajaxService.post(listApiBaseUrl + `get\\${listId}`).then(listConfig => {
            this.listHash[listId] = listConfig
            return listConfig;
        });
    }
}