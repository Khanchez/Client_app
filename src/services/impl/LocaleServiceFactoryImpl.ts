import { injectable, inject, interfaces } from 'inversify';
import * as FACTORY from '@core/constants/Factory';
import type { LocaleService } from '@core/services/LocaleService'
import type { JsonService } from '@core/services/JsonService';
import type { LocaleServiceFactory } from '@core/services/LocaleServiceFactory';
import { commonRu } from '@vitrosoftware/common-ui'
import LanguageDetector from 'i18next-browser-languagedetector'
import { i18n as i18nInterface } from 'i18next'
import moment from 'moment';
import { LocaleServiceImpl } from '@core/services/impl/LocaleServiceImpl';

@injectable()
export class LocaleServiceFactoryImpl implements LocaleServiceFactory {

    constructor(
        @inject(FACTORY.SERVICE.JSON) private readonly jsonService: JsonService
    ) {
    }


    createI18n(i18n: i18nInterface, localizationDictionary?: any): Promise<any> {
        let translations = commonRu;

        if (localizationDictionary) {
            translations = this.jsonService.merge(localizationDictionary, translations);
        }

        return i18n.use(LanguageDetector).init({
            resources: {
                ru: { translations: translations },
                en: { translations: translations }
            },
            fallbackLng: 'ru',
            returnObjects: true,
            debug: true,
            ns: ['translations'],
            defaultNS: 'translations',
            interpolation: {
                escapeValue: false,
                formatSeparator: ',',
                format: function (value, format, lng) {
                    if (format === 'uppercase') return value.toUpperCase();
                    if (value instanceof Date) {
                        const date = new Date(value);
                        return moment(new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()))).format(format);
                    }
                    return value;
                }
            }
        });
    }

    initLocaleService(container: interfaces.Container, localeServiceCreate): void {
        if (container.isBound(FACTORY.SERVICE.LOCALE)) {
            const parentLocaleService = container.get<LocaleService>(FACTORY.SERVICE.LOCALE);
            container.bind(FACTORY.SERVICE.LOCALE).toConstantValue(new LocaleServiceImpl(localeServiceCreate, parentLocaleService));
        } else {
            container.bind(FACTORY.SERVICE.LOCALE).toConstantValue(new LocaleServiceImpl(localeServiceCreate));
        }
    }
}
