import { FieldOldNewValue } from '@core/models/FieldOldNewValue';

export interface ItemEvent {

    readonly id: string;

    readonly contentTypeId: string;

    readonly type: number;

    readonly listId: string;

    readonly itemId: string;

    readonly destId?: string;

    insertUserName?: string;

    insertDate?: string;

    fieldOldNewValues: FieldOldNewValue[];
}
