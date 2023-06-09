﻿import { FunctionComponent } from 'react';
import { Employee } from '../models/employee';
import {
    Input,
    ButtonGroup,
    Button
} from '@vitrosoftware/common-ui'
import {useInjection} from "inversify-react";
import {EventService} from "@core/services/EventService";
import * as FACTORY from "@core/constants/Factory";
import {EVENT} from "@core/constants/Event";


interface IEmployeeProps {
    employee: Employee
}



const EmployeeDetails: FunctionComponent<IEmployeeProps> = (props: IEmployeeProps) => {

    const currentEmployee = {
        id: props.employee.id,
        firstName: props.employee.firstName,
        lastName: props.employee.lastName,
        secondName: props.employee.secondName,
    }
    const eventService = useInjection<EventService>(FACTORY.SERVICE.EVENT);

    function updateEmployee() {
        eventService.send("OnDataSend", currentEmployee)
    }

    return (
        <div>
            <Input label={'Фамилия'} value={currentEmployee.secondName} onChange={(e) => { currentEmployee.secondName = e.target.value }} onBlur={updateEmployee}>

            </Input>
            <Input label={'Имя'} value={currentEmployee.firstName} onChange={(e) => { currentEmployee.firstName = e.target.value }} onBlur={updateEmployee}>
            </Input>
            <Input label={'Отчество'} value={currentEmployee.lastName} onChange={(e) => { currentEmployee.lastName = e.target.value }} onBlur={updateEmployee}>
            </Input>
            <div>


            </div>
        </div>
        
        
        )
};

export default EmployeeDetails;