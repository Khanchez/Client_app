export interface ListService {

    get(listId: string): Promise<any>;

    get(listId: string, update: boolean): Promise<any>;
}
