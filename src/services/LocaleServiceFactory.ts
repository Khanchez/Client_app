import { interfaces } from 'inversify';
import { i18n as i18nInterface } from 'i18next'

export interface LocaleServiceFactory {

    createI18n(i18n: i18nInterface, localizationDictionary?: any): Promise<any>;

    initLocaleService(container: interfaces.Container, localeService): void;
}
