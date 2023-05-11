import { EventHandlerService } from '@core/services/EventHandlerService';

export interface EventService {
    send(eventId: string, data: any): void;
    register(eventHandler: EventHandlerService): void;
    remove(eventHandler: EventHandlerService): void;
}
