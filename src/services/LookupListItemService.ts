import { TableViewFilter } from '../models/TableViewFilter';

export interface LookupListItemService {

    getValueList(listData: any, filterList: Array<TableViewFilter>): Promise<any>;
}