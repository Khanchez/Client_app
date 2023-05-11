import type { DragItemModel } from '@core/models/DragItemModel';
import type { ItemUpdateRequest } from '@core/models/ItemUpdateRequest';

export interface ListItemService {

    get(listItem: any): Promise<any>;

    getList(listId: string, fileList?: File[]): Promise<Array<any>>;

    createByContentType(listId: string, contentTypeId: string, parentId?: string): Promise<any>;

    update(itemList: ItemUpdateRequest[]): Promise<any>;

    delete(idList: string[]): Promise<string[]>;

    restoreById(listId: string, id: string): Promise<any>;

    drag(dragModel: DragItemModel): Promise<any>;
}