import { FILTER_TYPE } from '@core/constants/FilterType';
import { TableViewFilter } from '@core/models/TableViewFilter';

export class TableViewFilterImpl implements TableViewFilter {

    field: string;

    value: string;

    filterType: FILTER_TYPE;

    constructor(field: string, value: string, filterType: FILTER_TYPE = 1) {
        this.field = field;
        this.value = value;
        this.filterType = filterType;
    }
}
