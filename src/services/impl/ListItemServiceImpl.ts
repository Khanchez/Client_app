import type { DragItemModel } from '../../models/DragItemModel';
import type { Item } from '@core/models/Item';
import type { AjaxService } from '@core/services/AjaxService';
import type { ListItemService } from '@core/services/ListItemService'
import type { EventService } from '@core/services/EventService';
import type { ItemUpdateRequest } from '@core/models/ItemUpdateRequest';
import { injectable, inject } from 'inversify';
import * as FACTORY from '@core/constants/Factory';
import { FIELD } from "@core/constants/Field";
import { URL } from "../../constants/Url";
import { EVENT } from "../../constants/Event";
import { FORM_DATA } from '../../constants/FormData';


@injectable()
export class ListItemServiceImpl implements ListItemService {

    constructor(
        @inject(FACTORY.SERVICE.AJAX) private readonly ajaxService: AjaxService,
        @inject(FACTORY.SERVICE.EVENT) private readonly eventService: EventService
    ) {
        this.ajaxService = ajaxService;
        this.eventService = eventService;
    }

    get(listItem) {
        return this.ajaxService.post(URL.LIST_ITEM_API + `${URL.GET}\\${listItem.listItemId}`);
    }

    getList(listId: string) {
        return this.ajaxService.post(URL.LIST_ITEM_API + `${URL.GET_LIST}\\${listId}`);
    }

    createByContentType(listId: string, contentTypeId: string, parentId: string = '') {

        if (!parentId) {
            parentId = listId
        }

        const itemUpdateRequest: ItemUpdateRequest = {
            listId: listId,
            parentId: parentId,
            contentTypeId: contentTypeId,
        };

        return this.update([itemUpdateRequest]);
    }

    update(itemList: ItemUpdateRequest[]) {

        const formData = this.createItemListUpdateRequestFormData(itemList);
        return this.ajaxService.post(URL.LIST_ITEM_API + URL.UPDATE, formData).then((itemList: Item[]) => {
            this.eventService.send(EVENT.UPDATED, itemList);
            return itemList;
        });
    }

    delete(idList: string[]): Promise<string[]> {
        const itemList = idList.map(id => ({ id: id }));
        return this.ajaxService.post(URL.LIST_ITEM_API + URL.DELETE, itemList).then((itemIdList: string[]) => {
            this.eventService.send(EVENT.DELETED, itemIdList);
            return itemIdList;
        });
    }

    restoreById(listId: string, id: string) {
        return this.ajaxService.post(URL.LIST_ITEM_API + URL.RESTORE, { listId, id });
    }

    drag(dragModel: DragItemModel) {
        return this.ajaxService.post(URL.LIST_ITEM_API + `${URL.MOVE}/${dragModel.listItemId}/${dragModel.toListItemId}/${dragModel.type}`);
    }

    private createItemListUpdateRequestFormData(itemList: ItemUpdateRequest[]): FormData {
        const formData = new FormData();
        const itemUpdateRequestMapList: { [key: string]: string | number }[] = [];
        const fileList: File[] = [];

        for (const item of itemList) {
            const itemUpdateRequestMap = this.createItemUpdateRequestMap(item);
            if (item.file) {
                itemUpdateRequestMap[FORM_DATA.FILE] = fileList.length;
                fileList.push(item.file);
            }

            itemUpdateRequestMapList.push(itemUpdateRequestMap);
        }

        formData.set(FORM_DATA.ITEM_LIST_JSON, JSON.stringify(itemUpdateRequestMapList));

        for (const file of fileList) {
            formData.append(FORM_DATA.FILE_LIST, file);
        }

        return formData;
    }

    private createItemUpdateRequestMap(item: ItemUpdateRequest): { [key: string]: string | number } {
        const itemUpdateMap: { [key: string]: string | number } = {};
        itemUpdateMap[FIELD.LIST_ID] = item.listId ?? item[FIELD.LIST_ID];

        if (item.id) {
            itemUpdateMap[FIELD.ID] = item.id;
        }

        if (item.contentTypeId) {
            itemUpdateMap[FIELD.CONTENT_TYPE_ID] = item.contentTypeId;
        }

        if (item.parentId) {
            itemUpdateMap[FIELD.PARENT_ID] = item.parentId;
        }

        if (item.fieldValueMap) {
            for (const [key, value] of item.fieldValueMap) {
                itemUpdateMap[key] = value;
            }
        }

        return itemUpdateMap;
    }
}