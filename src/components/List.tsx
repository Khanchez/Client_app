import React, { FunctionComponent, useEffect, useState } from 'react'
import { MicroFrontend } from './MicroFrontend'
import * as FACTORY from '@core/constants/Factory';
import type { ListService } from '@core/services/ListService'
import type { ContentTypeService } from '@core/services/ContentTypeService'
import { useInjection, useContainer } from 'inversify-react';
import { interfaces } from 'inversify';

interface IListProps {
    history: any,
    match: any
}

export const List: FunctionComponent<IListProps> = (props: IListProps) => {
    const [componentData, setComponentData] = useState<{ listConfig: any, container: interfaces.Container, reactComponentData:any } | null>(null);

    const listService = useInjection<ListService>(FACTORY.SERVICE.LIST);
    const contentTypeService = useInjection<ContentTypeService>(FACTORY.SERVICE.CONTENT_TYPE);
    const container = useContainer();
    const [microFrontendHost, setMicroFrontendHost] = useState<string>('');
    const [microFrontendName, setMicroFrontendName] = useState<string>('');
    

    const initListConfig = (listId: string) => {
        if (listId) {
            listService.get(listId, true).then(listConfig => {

                contentTypeService.getByList(listId).then(contentTypeList => {
                    listConfig.contentTypeList = contentTypeList;

                    const fieldHash = new Set<string>();

                    listConfig.fieldList = [];
                    for (let contentType of contentTypeList) {
                        for (let field of contentType.fieldList) {
                            if (!fieldHash.has(field.internalName)) {
                                listConfig.fieldList.push(field);
                                fieldHash.add(field.internalName);
                            }
                        }
                    }
                    
                    const reactComponent = listConfig.fieldValueMap['reactComponent'] ?? 'tableViewContainer/api/resource:TableViewContainer';
                    const reactComponentSplit =  reactComponent.split(':');
                    setMicroFrontendHost(reactComponentSplit[0]);
                    setMicroFrontendName(reactComponentSplit[1]);
                    
                    const reactComponentData = listConfig.fieldValueMap['reactComponentData'] ?? {};

                    setComponentData({ listConfig: listConfig, container: container, reactComponentData: reactComponentData });
                });
            });

        }
    };

    useEffect(() => {
        setComponentData(null);

        initListConfig(props.match.params.listId);
        if (window.grid) {
            window.grid.Dispose();
        }


    }, []);

    return <MicroFrontend host={microFrontendHost} data={componentData} name={microFrontendName}/>
};
