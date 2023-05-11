import { injectable } from 'inversify';
import type { EventHandlerService } from '@core/services/EventHandlerService';
import type { EventService } from '@core/services/EventService'

@injectable()
export class EventServiceImpl implements EventService {

    private readonly handlerList: Map<EventHandlerService, (...params) => any> = new Map();

    constructor() {
    }

    send(eventId: string, data: any): void {
        let event = new CustomEvent(eventId, { detail: data });
        window.dispatchEvent(event);
    }

    register(eventHandler: EventHandlerService): void {
        if (!this.handlerList.has(eventHandler)) {
            const process = eventHandler.process.bind(eventHandler);
            this.handlerList.set(eventHandler, process);
            window.addEventListener(eventHandler.id, process);
        }
    }

    remove(eventHandler: EventHandlerService): void {
        const process = this.handlerList.get(eventHandler);
        if (process) {
            window.removeEventListener(eventHandler.id, process);
        }
    }

    dispose(): void {
        for (let handler of this.handlerList.keys()) {
            this.remove(handler)
        }
    }
}
