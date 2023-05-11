import React, {FunctionComponent, useEffect, useState} from 'react'
import EmployeeDetails from "@core/components/EmployeeDetails";
import listlayout from '@core/data/listlayout.json';
import listdata from '@core/data/listdata.json';
import {
    TableView,
    TableViewContext,
    TableViewRow
} from '@vitrosoftware/common-ui-ts'
import { Splitter, TableViewDetail } from '@vitrosoftware/common-ui'
import { Employee } from '../models/employee';
import {TableViewEventHandler} from "@vitrosoftware/common-ui-ts/dist/controls/TableView/TableViewEventHandler";
import {useInjection} from "inversify-react";
import {LocaleService} from "@core/services/LocaleService";
import * as FACTORY from "@core/constants/Factory";
import {EventService} from "@core/services/EventService";
import {EVENT} from "@core/constants/Event";

interface IStartPageProps {

}

export const StartPage: FunctionComponent<IStartPageProps> = (props: IStartPageProps) => {


    const eventService = useInjection<EventService>(FACTORY.SERVICE.EVENT);

    const [employeeList, setEmployeeList] = useState(listdata);
    const [currentEmployee, setCurrentEmployee] = useState({})


    useEffect(() => {
        console.log("effect")
        eventService.register({
            id: EVENT.EMPLOYEE_UPDATED,
            process: (params) => {
                console.log("************")
                console.log(params)
            }
        })
    }, [])

    const handler: TableViewEventHandler = {
        id: 'OnSelect',
        process: (grid: TableViewContext, row: TableViewRow, deselect: boolean, columnList: string[], test: boolean) => {
            let employee: Employee = {
                id: row.id,
                firstName: row.FirstName,
                secondName: row.SecondName,
                lastName: row.LastName,
                birthDate: row.Birthdate,
                department: row.Department
            }
            setCurrentEmployee(employee)
            console.log(employee)
        }
    }
    const handlerList = [handler]

    return (
        <div className='vitro-start-page-white'>
            <div id="TableViewContainer">
                <Splitter>
                    <div id='CommonTable'>
                        <TableView layout={listlayout} data={{ Body: [employeeList] }} id={'-employees'} eventHandlerList={handlerList}  />
                    </div>
                    <TableViewDetail >
                        <EmployeeDetails employee={currentEmployee} />

                    </TableViewDetail>
                </Splitter>
            </div> 
        </div>
    );
}
