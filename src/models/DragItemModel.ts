import { DRAG_ITEM_TYPE } from '@core/constants/DragItemType';

export interface DragItemModel {

    listId: string;

    listItemId: string;

    toListItemId: string;

    type: DRAG_ITEM_TYPE;
}