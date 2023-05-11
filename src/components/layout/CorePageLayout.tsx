import React, {useEffect, useState} from 'react'
import {useContainer, useInjection} from 'inversify-react';
import {interfaces} from 'inversify';
import {LocaleService} from "@core/services/LocaleService";
import {UserService} from "@core/services/UserService";
import * as FACTORY from "@core/constants/Factory"
import cfgSidebar from '@core/data/sidebar.json';
import '@vitrosoftware/common-ui-ts/dist/index.css';
import '@vitrosoftware/common-ui/dist/index.css';
import {TableViewEventHandler} from "@vitrosoftware/common-ui-ts/dist/controls/TableView/TableViewEventHandler";
import listlayout from '@core/data/listlayout.json';
import listdata from '@core/data/listdata.json';
import {TableView, TableViewContext, TableViewRow} from '@vitrosoftware/common-ui-ts'
import {
    CenterAlignControlGroup,
    Header,
    HeaderNavBar,
    HeaderNavService,
    Main,
    PageLayout,
    ProductTitle,
    RightAlignControlGroup,
    Sidebar,
    Splitter,
    TableViewDetail,
    UserProfile,
    UserProfileMenuItem
} from '@vitrosoftware/common-ui'
import {Employee} from '../../models/employee';
import EmployeeDetails from '../EmployeeDetails';
import {EventService} from "@core/services/EventService";



export const CorePageLayout = props => {

    const container = useContainer();
    const w = window as any;

    const [sidebar, setSidebar] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [topItemList, setTopItemList] = useState([] as any[]);
    const [employeeList, setEmployeeList] = useState(listdata);
    const [currentEmployee, setCurrentEmployee] = useState({})
    const [grid, setGrid] = useState({} as TableViewContext)

    const localeService = useInjection<LocaleService>(FACTORY.SERVICE.LOCALE);
    const userService = useInjection<UserService>(FACTORY.SERVICE.USER);
    const eventService = useInjection<EventService>(FACTORY.SERVICE.EVENT);



    const user = {
        title:  "Кукушкин Владимир Олегович"
    }
    const pageTitle = 'Simple App'

    const productTitle = 'Simple App'
    const [componentData, setComponentData] = useState<{ history: string, container: interfaces.Container } | null>(null);


    let onUpdateSidebar = () => {
        let event = new CustomEvent('vitro.history.update', {
            detail: {
                sidebarItemList: topItemList,
                pathname: props.history.location.pathname
            }
        });
        window.dispatchEvent(event);
    }




    useEffect(() => {
        onUpdateSidebar();
    }, [props.history.location.pathname]);

    useEffect(() => {

        window.addEventListener('vitro.sidebar.click', e => {
            let customEvent = (e as CustomEvent);
            setSidebar(customEvent.detail.state)
        });

        window.addEventListener('vitro.history.update', e => {
            let customEvent = (e as CustomEvent);
            props.history.push(customEvent.detail.pathname)
        });

        let createSideBar = () => {
            return (
                <Sidebar sidebar={sidebar} history={props.history} topItemList={topItemList} />
            );
        }

        let handleItem = (item) => ({ ...item, text: localeService.create('app.sidebar.' + item.text) });

        let handleSection = (section) => ({ ...section, itemList: section.itemList.map(handleItem) });

        const topItemList = cfgSidebar.topItemList.map(handleSection);
        setTopItemList(topItemList);


        window.addEventListener('vitro.header.load', () => {
            onUpdateSidebar();
        });
        window.addEventListener('vitro.sidebar.click', (e: any) => {
            setSidebar(e.detail.state);
        });

        setLoaded(true);

        setComponentData({ history: props.history, container: container });


        eventService.register({
            id: "OnDataSend",
            process: (e) => {
                let GridData = e.detail
                let ContextGrid = grid as TableViewContext
                let GridRow = ContextGrid.getRowById(GridData.id)
                console.log(GridRow)
                GridRow.FirstName = e.detail.firstName
                GridRow.LastName = e.detail.lastName
                GridRow.SecondName = e.detail.secondName
                ContextGrid.reRender(false, false)
            }
        })


    }, [grid]);

    const onEditCell: TableViewEventHandler = {
        id: 'OnEditCell',

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
            console.log(grid)
        }
    }   

    const onSelectHandler: TableViewEventHandler = {
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
            console.log(grid)
        }
    }   

    const handlerList = [onSelectHandler]

    const onInitTableView = (grid: TableViewContext) => {
        setGrid(grid)

    }

    return <> {componentData &&
            <PageLayout sidebar={sidebar}>
                <Sidebar sidebar={sidebar} history={props.history} topItemList={topItemList} />
                <Header sidebar={sidebar} setSidebar={setSidebar} history={props.history} cfgSidebar={{}}>
                   
                    <HeaderNavBar>

                        <ProductTitle
                            link="/"
                            img="img/logo-planner.svg"
                            alt={productTitle}
                        >
                            <div>
                                <h1>{productTitle}</h1>
                                {pageTitle && <h1>{pageTitle}</h1>}
                            </div>
                        </ProductTitle>

                        <CenterAlignControlGroup>

                        </CenterAlignControlGroup>
                        <RightAlignControlGroup>
                            <div style={{ "display": "flex", 'flexDirection': 'column', 'alignItems': 'flex-start', 'justifyContent': 'center' }}>
                                <UserProfile user={user}>
                                    <UserProfileMenuItem
                                        to="/"
                                        link={true}
                                        onClick={function() {}}
                                        text={localeService.create('app.core.logoutText')}>
                                    </UserProfileMenuItem>

                                </UserProfile>

                            </div>
                        </RightAlignControlGroup>
                    </HeaderNavBar>
                </Header>
            <Main>
                <div id="TableViewContainer">
                <Splitter>
                        <div id='CommonTable'>
                            <TableView  layout={listlayout} data={{ Body: [employeeList] }} id={'-employees'} eventHandlerList={handlerList} onInit={onInitTableView} />
                        </div>
                        <TableViewDetail >
                            <EmployeeDetails employee={currentEmployee} />

                        </TableViewDetail>
                    </Splitter>
                </div>
                </Main>
            </PageLayout>
    }</>;
}

/*let Main = props => (
    <div className="vitro-main" id="vitro-main">
        {props.children}
    </div>
);*/