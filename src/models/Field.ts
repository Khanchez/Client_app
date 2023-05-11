import { FieldType } from '@core/models/FieldType';

export interface Field {

    readonly id: string;

    readonly internalName: string;

    readonly name: string;

    readonly data: string;

    readonly fieldType: FieldType;

    readonly fieldValueMap: any;
}