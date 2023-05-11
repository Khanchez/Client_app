import type { EventHandlerService } from '@core/services/EventHandlerService';
import type { TableViewEventHandlerService } from '@core/services/TableViewEventHandlerService';
import { injectable } from 'inversify';

@injectable()
export class TableViewEventHandlerServiceImpl implements TableViewEventHandlerService {

    private readonly _defaultDridId: string  = 'default';
    private readonly _handlers: Map<string, Map<string, EventHandlerService>> = new Map();

    register(gridHandlerService: EventHandlerService, gridId: string | undefined = undefined): void {
        if (!gridId) {
            gridId = this._defaultDridId;
        }

        if (!this._handlers.has(gridId)) {
            this._handlers.set(gridId, new Map());
        }

        const gridHandlersList = this._handlers.get(gridId);
        if (gridHandlersList) {
            gridHandlersList.set(gridHandlerService.id, gridHandlerService);
        }
    }

    getHandlerListByGridId(gridId: string): EventHandlerService[] {
        const defaultHandlersList = this._handlers.get(this._defaultDridId);
        const gridHandlersList = this._handlers.get(gridId);
        const ret: EventHandlerService[] = [];

        if (defaultHandlersList) {
            defaultHandlersList.forEach((handler, key) => {
                if (!gridHandlersList || !gridHandlersList.has(key)) {
                    ret.push(handler);
                }
            });
        }
        
        if (gridHandlersList) {
            gridHandlersList.forEach((handler, key) => {
                ret.push(handler);
            });
        }

        return ret;
    }

    executeDefaulAction(name: string, ...args): any {
        const defaultHandlersList = this._handlers.get(this._defaultDridId);
        if (defaultHandlersList) {
            const handler = defaultHandlersList.get(name);
            if (handler) {
                return handler.process(...args);
            }
        }
    }
}