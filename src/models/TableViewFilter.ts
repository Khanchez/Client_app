import { FILTER_TYPE } from '@core/constants/FilterType';

export interface TableViewFilter {

    field: string;

    value: string;

    filterType: FILTER_TYPE;
}