import type { Junction } from '@core/models/Junction';
import type { Item } from '@core/models/Item'
import type { Field } from '@core/models/Field'
import type { LocaleService } from '@core/services/LocaleService'
import type { JsonService } from '@core/services/JsonService'
import type { ListConfig } from '@core/models/ListConfig';
import type { ItemEvent } from '@core/models/ItemEvent';
import type { EventLogService } from '@core/services/EventLogService';
import type { FieldOldNewValue } from '@core/models/FieldOldNewValue';
import type { ItemEventDetail } from '@core/models/ItemEventDetail';
import { ItemEventDetailImpl } from '@core/models/impl/ItemEventDetailImpl';
import { injectable, inject } from 'inversify';
import * as FACTORY from '@core/constants/Factory';

@injectable()
export class EventLogServiceImpl implements EventLogService {

    private readonly contentTypeIdFieldname = 'ContentTypeId';

    constructor(
        @inject(FACTORY.SERVICE.LOCALE) private readonly localeService: LocaleService,
        @inject(FACTORY.SERVICE.JSON) private readonly jsonService: JsonService
    ) {
    }

    getItemEventByTableViewRow(row, changedOnly?: boolean): ItemEvent {
        const data = this.getData(row.Data);
        const oldItem = this.getOldItem(row.OldItem);
        const contentTypeId = data.get(this.contentTypeIdFieldname) ?? oldItem[this.contentTypeIdFieldname];
        const ret: ItemEvent = {
            id: row.id,
            contentTypeId: contentTypeId,
            type: row.Type,
            listId: row.ListId,
            itemId: row.ListItemId,
            fieldOldNewValues: []
        };

        const itemEventDetail = new ItemEventDetailImpl(this.getFields(row.Fields), this.getJunctions(row.Junctions), data, oldItem);
        const contentTypeFieldName = this.localeService.create('app.fields.contentType');
        this.initField(ret.fieldOldNewValues, this.contentTypeIdFieldname, contentTypeFieldName, itemEventDetail, changedOnly);
        for (const field of itemEventDetail.fields) {
            this.initField(ret.fieldOldNewValues, field.internalName, field.name, itemEventDetail, changedOnly);
        }

        return ret;
    }

    getItemEvent(eventLog, listConfig: ListConfig): ItemEvent {
        const data = this.getData(eventLog.data);
        const oldItem = this.getOldItem(eventLog.oldItem);
        const contentTypeId = (data.get(this.contentTypeIdFieldname) ?? oldItem[this.contentTypeIdFieldname]).toLowerCase();

        eventLog.contentTypeId = contentTypeId;
        eventLog.fieldOldNewValues = [];
        const ret: ItemEvent = eventLog;
        

        let fieldList: Field[] = [];
        if (contentTypeId) {
            const contentTypeIdLowerCase = contentTypeId.toLowerCase();
            const contentType = listConfig.contentTypeList.find(ct => ct.id === contentTypeIdLowerCase);
            if (contentType) {
                fieldList = contentType.fieldList;
            }
        }

        const itemEventDetail = new ItemEventDetailImpl(fieldList, this.getJunctions(eventLog.junctions), data, oldItem);

        for (var fieldInternalName of itemEventDetail.data.keys()) {
            let fieldName = fieldInternalName;
            const field = fieldList.find(f => f.internalName === fieldInternalName);
            if (field) {
                fieldName = field.name;
            }
            this.initField(ret.fieldOldNewValues, fieldInternalName, fieldName, itemEventDetail, true);
        }

        return ret;
    }


    private initField(ret: FieldOldNewValue[], fieldInternalName: string, fieldName: string, itemEventDetail: ItemEventDetail, changedOnly?: boolean) {
        const [oldValue, oldValueData] = this.getValue(itemEventDetail.junctions, itemEventDetail.oldItem[fieldInternalName]);
        const newValueDataString = itemEventDetail.data.get(fieldInternalName);
        if (!newValueDataString && changedOnly) {
            return;
        }

        let [newValue, newValueData] = [oldValue, oldValueData];
        if (newValueDataString) {
            [newValue, newValueData] = this.getValue(itemEventDetail.junctions, newValueDataString);
        }

        const fieldOldNewValue: FieldOldNewValue = {
            internalName: fieldInternalName,
            name: fieldName,
            newValue,
            newValueData,
            oldValue
        };

        ret.push(fieldOldNewValue);
    }
    
    private getValue(junctions: Map<string, any>, value: any): [any, any] {
        if (value && junctions.has(value)) {
            return this.getJunctionValue(junctions.get(value));
        }

        return [value, value];
    }

    private getJunctionValue(junctionValue: string): [any, any] {
        let value = '';
        var valueData: any;
        if (junctionValue) {
            JSON.parse(junctionValue, (k, v) => {
                if (!value) {
                    value = v;
                }
            })
        }

        return [value, valueData];
    }


    private getFields(fieldsData: string): Field[] {
        return this.parse(fieldsData);
    }

    private getJunctions(junctionsData: string): Map<string, string> {
        const junctions: Junction[] = this.parse(junctionsData);
        const ret: Map<string, string> = new Map();
        for (let j of junctions) {
            if (j.value) {
                ret.set(j.id, j.value);
            }
        }

        return ret;
    }

    private getData(data: string): Map<string, any> {
        var ret = new Map<string, any>();
        var a = this.parse(data);
        for (let d of a) {
            ret.set(d.field, d.new);
        }
        return ret;
    }

    private getOldItem(oldItemData: string): Item {
        if (oldItemData) {
            return JSON.parse(oldItemData);
        }

        return ({} as any);
    }

    private parse(data: string) {
        if (data) {
            return this.jsonService.parse(data);
        }

        return [];
    }

    
}