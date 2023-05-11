import React, { FunctionComponent, useEffect, useState } from 'react'
import { MicroFrontend } from './MicroFrontend'
import * as FACTORY from '@core/constants/Factory';
import type { ListService } from '@core/services/ListService'
import type { ContentTypeService } from '@core/services/ContentTypeService'
import { useInjection, useContainer } from 'inversify-react';
import { interfaces } from 'inversify';

interface IListProps {
    history: any
}

export const Planner: FunctionComponent<IListProps> = (props: IListProps) => {
    const [componentData, setComponentData] = useState<{ listConfig: any, container: interfaces.Container, history: any } | null>(null);

    const listService = useInjection<ListService>(FACTORY.SERVICE.LIST);
    const contentTypeService = useInjection<ContentTypeService>(FACTORY.SERVICE.CONTENT_TYPE);
    const container = useContainer();
    

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

                    setComponentData({ listConfig: listConfig, container: container, history: props.history });
                });
            });

        }
    };

    useEffect(() => {
        setComponentData(null);

        initListConfig('6A54BC67-0A25-4A9D-AB1D-C22A16FB64E5');
        if (window.grid) {
            window.grid.Dispose();
        }


    }, []);

    return <MicroFrontend host={'/planner/api/resource'} data={componentData} name="PlannerSimplePage" />
};
