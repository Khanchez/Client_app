import { Field } from '@core/models/Field'

export interface ContentType {

    readonly description: string;

    readonly fieldList: Field[];

    readonly fieldValueMap: any;

    readonly id: string;

    readonly isFolder: boolean;

    readonly name: string;

    readonly parentId: string;

    readonly status: number;
}