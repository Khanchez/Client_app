import type { TableViewFilter } from '@core/models/TableViewFilter';
import type { LookupListItemService } from '../LookupListItemService';
import { TableViewFilterImpl } from '@core/models/impl/TableViewFilterImpl';
import { FILTER_TYPE } from '@core/constants/FilterType';
import { FIELD } from '@core/constants/Field';
import { injectable } from 'inversify';

@injectable()
export class LookupListItemServiceImpl implements LookupListItemService {

    getValueList(listData: any, filterList: Array<TableViewFilter>) {

        let listDataFilters = listData.Filters;
        if (listDataFilters) {
            filterList = [...filterList, ...listDataFilters];
        }

        const data = this.createGridRequestData(listData, filterList);
        let formData = new FormData();
        formData.append('Data', data);

        return window.$.ajax({
            url: '/api/TableViewRequest/Page/' + (listData.listId || listData.ListId),
            type: 'POST',
            processData: false,
            contentType: false,
            data: formData
        }).then(gridData => this.convertGridDataToXml(gridData))
    }

    private createGridRequestData(listData: any, filterList: Array<TableViewFilter>) {
        if (listData.listId !== 'HistoryLog') {
            filterList.push(new TableViewFilterImpl(FIELD.STATUS, `1`, FILTER_TYPE.EQUAL));
        }


        const sortCol = listData.sortCol || 'ListItemId';
        const rowParam = listData.Rows || '';
        let data = '&lt;Grid&gt;&lt;Cfg SortCols="' + sortCol + '" SearchAction="" /&gt;';
        data += '&lt;Filters&gt;&lt;I id="Filter1" ';
        if (filterList) {
            filterList.forEach(filter => {
                data += this.stringValue(filter);
            });
        }

        data += ' /&gt;&lt;/Filters&gt;&lt;IO/&gt;';
        data += '&lt;Body&gt;&lt;B FilterOneLevel="1" Pos="0" Rows="' + rowParam + '" /&gt;';
        data += '&lt;/Body&gt;&lt;/Grid&gt;';
        return data;
    }

    private stringValue(filter: TableViewFilter): string {
        let val = `${filter.field} ='${filter.value}' ${filter.field}Filter='${filter.filterType}' `;
        return val;
    }

    private convertGridDataToXml(gridData) {
        const rowRegExp = /\<I (.*?)\/?\>/g;
        const rowParamsRegExp = /([0-9a-zA-Z\.]+)="(.*?)"/g;

        const ret: any = [];
        const rows = gridData.matchAll(rowRegExp);
        for (const rowMatch of rows) {
            const row = rowMatch[1];
            const params = row.matchAll(rowParamsRegExp)
            const o: any = {};
            for (const paramMatch of params) {
                let paramName = paramMatch[1];
                if (paramName) {
                    o[paramName] = this.decodeHTMLEntities(paramMatch[2]);
                }
            }

            o.id = o.Id;
            if (ret.indexOf(x => x.id === o.id) === -1) {
                ret.push(o);
            }
        }

        return ret;
    }

    private decodeHTMLEntities(rawStr) {
        if (rawStr) {
            return rawStr.replaceAll('&quot;', '"').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&');
        }

        return rawStr;
    }
}