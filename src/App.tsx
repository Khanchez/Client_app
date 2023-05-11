import { useState, useEffect } from 'react';
import 'isomorphic-fetch';
import { ScriptLoader } from '@vitrosoftware/common-ui';
import { Route } from 'react-router';
import { withRouter, Switch } from 'react-router-dom';
import { CorePageLayout } from './components/layout/CorePageLayout';
import { StartPage } from './components/StartPage';
import { LoginDialog } from './components/LoginDialog'; //todo microfrontend
import { List } from './components/List';
import EventList from './components/EventList';  //todo microfrontend
import { useInjection } from 'inversify-react';
import * as FACTORY from '@core/constants/Factory';
import type { LocaleService } from '@core/services/LocaleService';
import type { UserService } from '@core/services/UserService';
import { Planner } from './components/Planner';
import { FileUploadTest } from './components/FileUploadTest';

const RoutedLayout = withRouter(CorePageLayout);

const App = () => {
    const [user, setUser] = useState<any>();
    const userService = useInjection<UserService>(FACTORY.SERVICE.USER);
    const localeService = useInjection<LocaleService>(FACTORY.SERVICE.LOCALE);
    const pathname = window.location.pathname;

    if (window.currentPathname && pathname !== window.currentPathname) {
        console.log('Location changed');


        const event = new CustomEvent('vitro.onLocationChange',
            {
                detail:
                {
                    prevPathName: window.currentPathName,
                    patname: pathname
                }
            });
        window.dispatchEvent(event);
    }

    window.currentPathname = pathname;

    const logOut = () => {
        userService.logOut();
        window.location.reload();
    }

    window.logOut = logOut;

    useEffect(() => {

        window.document.title = localeService.create('app.core.title', null);

        const getUser = async () => {
            let user = {
                title: "Иванов Иван Иванович"
            }
            setUser(user);
        }

        if (!user) {
            getUser();
        }

    }, []);



    const scriptList = [
        {
            "url": "js/jquery-3.3.1.js",
            "id": "vitro-script-jquery"
        },
        {
            "url": "js/moment.js",
            "id": "vitro-script-moment"
        },
        {
            "url": "js/kendo.all.min.js",
            "id": "vitro-script-kendo"
        },
        {
            "url": "js/kendo.culture.ru-RU.min.js",
            "id": "vitro-script-kendo-culture-ru"
        },
        {
            "url": "js/kendo.messages.ru-RU.min.js",
            "id": "vitro-script-kendo-message-ru"
        },
        {
            url: 'js/resizeEventListener.js',
            id: 'vitro-script-resize-event-listener'
        },
        {
            url: 'js/perfect-scrollbar.min.js',
            id: 'vitro-script-perfect-scrollbar'
        },
        {
            "url": "js/microsoft/signalr/dist/browser/signalr.js",
            "id": "vitro-signalr"
        }
    ];

    const event = new CustomEvent('vitro.tableViewDetail.onInit', {});
    window.dispatchEvent(event);

    return (
        <> {


            <ScriptLoader urlList={scriptList.map(x => x.url)} idList={scriptList.map(x => x.id)}>
                {
                    !user && <LoginDialog
                        setUser={setUser} />
                }

                {
                    user && (
                        <RoutedLayout>
                            <Switch>
                                <Route exact path='/' component={props => <StartPage {...props} />} />
                                <Route exact path='/List/EventList/:listItemId?' component=
                                    {
                                        props =>
                                            <EventList history={props.history} match={props.match} />
                                    }
                                />

                                <Route exact path='/List/:listId' component=
                                    {
                                        props => <List history={props.history} match={props.match} />
                                    }
                                />

                                <Route exact path='/planner' component=
                                    {
                                    props => <Planner history={props.history}  />
                                    }
                                />

                                <Route exact path='/FileUploadTest' component=
                                    {
                                    props => <FileUploadTest history={props.history} />
                                    }
                                />
                            </Switch>
                        </RoutedLayout>
                    )}
            </ScriptLoader>
        }
        </>
    );
}

export default App;