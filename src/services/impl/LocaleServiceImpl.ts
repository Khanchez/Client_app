import { injectable } from 'inversify';
import type { LocaleService } from '@core/services/LocaleService';

@injectable()
export class LocaleServiceImpl implements LocaleService {

    private _parentLocaleService: LocaleService | undefined;

    private _localeServiceCreate: any;

    constructor(localeServiceCreate: any, parentLocaleService?: LocaleService) {
        this._localeServiceCreate = localeServiceCreate;
        this._parentLocaleService = parentLocaleService;
    }

    create(key, parameterMap) {
        const ret = this._localeServiceCreate(key, parameterMap);
        if (ret === key && this._parentLocaleService) {
            return this._parentLocaleService.create(key, parameterMap);
        }

        return ret;
    }
}
