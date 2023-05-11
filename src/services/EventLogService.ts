import { ItemEvent } from '@core/models/ItemEvent';
import { ListConfig } from '@core/models/ListConfig';

export interface EventLogService {

    getItemEventByTableViewRow(row, changedOnly?: boolean): ItemEvent;

    getItemEvent(eventLog, listConfig: ListConfig): ItemEvent;
}