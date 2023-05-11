import { Field } from '@core/models/Field';
import { ItemEventDetail } from '@core/models/ItemEventDetail';
import { Item } from '@core/models/Item';

export class ItemEventDetailImpl implements ItemEventDetail {

    fields: any[];

    junctions: Map<string, any>;

    data: Map<string, any>;

    oldItem: Item;

    constructor(fields: Field[], junctions: Map<string, any>, data: Map<string, any>, oldItem: Item) {
        this.fields = fields;
        this.junctions = junctions;
        this.data = data;
        this.oldItem = oldItem;
    }
}
