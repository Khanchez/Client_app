import 'reflect-metadata';

import * as ReactDom from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/reduxStore'
import { Container } from 'inversify';
import { Provider as InversifyProvider } from 'inversify-react';
import FactoryHelper, { LocalizedApplication } from './utils/FactoryHelper';

/*import '@vitrosoftware/common-ui/css/bootstrap.min.css'
import '@vitrosoftware/common-ui/css/jquery.rateyo.min.css'
import '@vitrosoftware/common-ui/css/common-layout.css'
import '@vitrosoftware/common-ui/css/common-control.css'
import '@vitrosoftware/common-ui/css/common-bootstrap.css'
import '@vitrosoftware/common-ui/css/common-third-party.css'
import '@vitrosoftware/common-ui/css/kendo.css'
*/
import './css/index.css'
import './css/common-third-party.css'
import { ContainerFactoryImpl } from '@core/services/impl/ContainerFactoryImpl';
import * as FACTORY from '@core/constants/Factory';

const containerFactory = new ContainerFactoryImpl();
const disposableContainer = containerFactory.create();
disposableContainer.registerConstant(FACTORY.SERVICE.CONTAINER_FACTORY, containerFactory);
FactoryHelper.initContainer(disposableContainer);


const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');
if (!baseUrl || !rootElement) {
    throw new DOMException();
}

const root = ReactDom.createRoot(rootElement);

root.render(
    <Provider store={store}>
        <InversifyProvider container={disposableContainer.container}>
            <LocalizedApplication container={disposableContainer.container}>
                <BrowserRouter basename={baseUrl}>
                    <App />
                </BrowserRouter>
            </LocalizedApplication>
        </InversifyProvider>
    </Provider>);
