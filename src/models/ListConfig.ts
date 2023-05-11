import { ContentType } from '@core/models/ContentType'

export interface ListConfig {

    id: string;

    contentTypeList: ContentType[];

    data: string;

    fieldList: any[];

    name: string;

    statusList: any[];
}