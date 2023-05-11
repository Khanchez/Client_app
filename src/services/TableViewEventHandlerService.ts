import { EventHandlerService } from '@core/services/EventHandlerService'

export interface TableViewEventHandlerService {

    register(gridHandlerService: EventHandlerService): void;

    register(gridHandlerService: EventHandlerService, gridId: string): void;

    getHandlerListByGridId(gridId: string): EventHandlerService[];

    executeDefaulAction(name: string, ...args): any;
}