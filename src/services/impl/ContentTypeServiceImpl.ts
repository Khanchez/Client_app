import type { AjaxService } from '@core/services/AjaxService'
import type { ContentTypeService } from '@core/services/ContentTypeService'
import { injectable, inject } from 'inversify';
import * as FACTORY from 'constants/Factory';

const contentTypeApiBaseUrl = '/api/contentType/';

@injectable()
export class ContentTypeServiceImpl implements ContentTypeService {

    private _ajaxService: AjaxService;

    constructor(
        @inject(FACTORY.SERVICE.AJAX) ajaxService: AjaxService
    ) {
        this._ajaxService = ajaxService;
    }

    get(listId: string) {

        return this._ajaxService.post(contentTypeApiBaseUrl + `get\\${listId}`).then(listConfig => {
            return listConfig;
        });
    }

    getByList(listId: string): Promise<any> {
        return this._ajaxService.post(contentTypeApiBaseUrl + `getByList\\${listId}`).then(listConfig => {
            return listConfig;
        });
    }
}