export interface ItemUpdateRequest {

    listId: string;

    id?: string;

    contentTypeId?: string;

    parentId?: string;

    file?: File;

    fieldValueMap?: Map<string, string>;
}
