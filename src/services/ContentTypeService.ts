export interface ContentTypeService {

    get(contentTypeId: string): Promise<any>;

    getByList(listId: string): Promise<any>;
}
