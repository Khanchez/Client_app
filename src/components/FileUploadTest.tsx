import React, { FunctionComponent, useEffect, useRef } from 'react'
import * as FACTORY from '@core/constants/Factory';
import { useInjection } from 'inversify-react';
import type { ListItemService } from '@core/services/ListItemService';
import { ItemUpdateRequest } from '@core/models/ItemUpdateRequest';
import { FIELD } from '@core/constants/Field';

interface ListProps {
    history: any
}

export const FileUploadTest: FunctionComponent<ListProps> = (props: ListProps) => {

    const listItemService = useInjection<ListItemService>(FACTORY.SERVICE.LIST_ITEM);

    const fileInput = useRef<HTMLInputElement | null>(null);



    const handleFileChange = () => {
        if (fileInput.current) {
            if (fileInput.current.files) {
                const fileList = fileInput.current.files;
                const itemList: ItemUpdateRequest[] = [];
                for (let i = 0; i < fileList.length; i++) {
                    const itemUpdateRequest: ItemUpdateRequest = {
                        listId: 'D4670CC9-4AD3-4936-9E5F-09DF54ED2B6D',
                        parentId: '168df365-a472-4998-bb59-af62007e6d7c',
                        contentTypeId: 'F6062D01-45E2-47C9-B743-1908587D0282',
                        file: fileList[i],
                        fieldValueMap: new Map([
                            [FIELD.NAME, fileList[i].name],

                        ])
                    };

                    itemList.push(itemUpdateRequest);
                }

                listItemService.update(itemList);
            }
        }
    }

    useEffect(() => {
        if (fileInput && fileInput.current) {
            fileInput.current.onchange = handleFileChange;
        }
    }, []);

    return <>
        <input type="file" name="filefield" multiple ref={fileInput} />
    </>
};
