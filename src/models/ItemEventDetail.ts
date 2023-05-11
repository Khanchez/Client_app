import { Item } from '@core/models/Item'

export interface ItemEventDetail {

    fields: any[];

    junctions: Map<string, any>;

    data: Map<string, any>;

    oldItem: Item;
}
