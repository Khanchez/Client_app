import { I18nextProvider } from 'react-i18next'
import { useState, useEffect, ReactNode } from 'react'
import { localeService } from '@vitrosoftware/common-ui'
import { AjaxServiceImpl } from '@core/services/impl/AjaxServiceImpl';
import { AjaxInitServiceImpl } from '@core/services/impl/AjaxInitServiceImpl';
import { ListItemServiceImpl } from 'services/impl/ListItemServiceImpl';
import { ListServiceImpl } from '@core/services/impl/ListServiceImpl';
import { LocaleServiceFactoryImpl } from '@core/services/impl/LocaleServiceFactoryImpl'
import { LookupListItemServiceImpl } from '@core/services/impl/LookupListItemServiceImpl';
import { EventLogServiceImpl } from '@core/services/impl/EventLogServiceImpl'
import { JsonServiceImpl } from '@core/services/impl/JsonServiceImpl'
import { ContentTypeServiceImpl } from '@core/services/impl/ContentTypeServiceImpl'
import { UserServiceImpl } from '@core/services/impl/UserServiceImpl';
import { TableViewEventHandlerServiceImpl } from '@core/services/impl/TableViewEventHandlerServiceImpl';
import type { LocaleServiceFactory } from 'services/LocaleServiceFactory'
import * as FACTORY from '@core/constants/Factory';
import { interfaces } from 'inversify';
import ru from 'locales/ru.json'
import i18n from 'i18next'
import type { DisposableContainer } from '@core/models/DisposableContainer';

interface LocalizedApplicationProps {
    container: interfaces.Container
    children: ReactNode
}


export const LocalizedApplication = (props: LocalizedApplicationProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const container = props.container;

    useEffect(() => {
        const localeServiceFactory = container.get<LocaleServiceFactory>(FACTORY.SERVICE.LOCALE_SERVICE_FACTORY);
        localeServiceFactory.createI18n(i18n, ru).then(t => {
            FactoryHelper.initLocaleService(container, t);
            setIsLoaded(true);
            return t;
        })
    }, [])

    return <>{isLoaded &&
        <I18nextProvider i18n={i18n}>{props.children}</I18nextProvider>}
    </>
}


export default class FactoryHelper {

    public static initContainer(disposableContainer: DisposableContainer) {
        disposableContainer.registerSingleton(FACTORY.SERVICE.LOCALE_SERVICE_FACTORY, LocaleServiceFactoryImpl);
        disposableContainer.registerSingleton(FACTORY.SERVICE.USER, UserServiceImpl);
        disposableContainer.registerSingleton(FACTORY.SERVICE.AJAX, AjaxServiceImpl);
        disposableContainer.registerSingleton(FACTORY.SERVICE.AJAX_INIT, AjaxInitServiceImpl);
        disposableContainer.registerSingleton(FACTORY.SERVICE.LIST, ListServiceImpl);
        disposableContainer.registerSingleton(FACTORY.SERVICE.CONTENT_TYPE, ContentTypeServiceImpl);
        disposableContainer.registerSingleton(FACTORY.SERVICE.LIST_ITEM, ListItemServiceImpl);
        disposableContainer.registerSingleton(FACTORY.SERVICE.LOOKUP_LIST_ITEM, LookupListItemServiceImpl);
        disposableContainer.registerSingleton(FACTORY.SERVICE.JSON, JsonServiceImpl);
        disposableContainer.registerSingleton(FACTORY.SERVICE.TABLE_VIEW_EVENT_HANDLER, TableViewEventHandlerServiceImpl);
        disposableContainer.registerSingleton(FACTORY.SERVICE.EVENT_LOG, EventLogServiceImpl);
        return disposableContainer;
    }

    public static initLocaleService(container: interfaces.Container, translation: any) {
        localeService.init(translation);
        const localeServiceFactory = container.get<LocaleServiceFactory>(FACTORY.SERVICE.LOCALE_SERVICE_FACTORY);
        localeServiceFactory.initLocaleService(container, localeService.create);
    }

    public static dispose() {

    }

}
