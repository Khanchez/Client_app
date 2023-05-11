import { Container, interfaces } from 'inversify';
import * as FACTORY from '@core/constants/Factory';
import { ContainerFactory } from '@core/services/ContainerFactory';
import { EventServiceImpl } from '@core/services/impl/EventServiceImpl';
import type { DisposableContainer }  from '@core/models/DisposableContainer'

export class ContainerFactoryImpl implements ContainerFactory {

    create(parentContainer?: interfaces.Container): DisposableContainer {
        const container = new Container();
        if (parentContainer) {
            container.parent = parentContainer;
        }

        const disposableContainer = new DisposableContainerImpl(container);
        disposableContainer.registerSingleton(FACTORY.SERVICE.EVENT, EventServiceImpl);
        disposableContainer.registerConstant(FACTORY.SERVICE.CONTAINER, disposableContainer);
        return disposableContainer;
    }
}

class DisposableContainerImpl implements DisposableContainer {

    private readonly disposableList: any[] = [];

    constructor(
        readonly container: interfaces.Container
    ) {
    }

    registerSingleton<T>(key: string, constructor: new (...args: never[]) => T): void {
        const disposableContaier = this;
        this.container.bind(key).to(constructor).inSingletonScope().onActivation((context, instance) => {
            disposableContaier.addDisposable(instance);
            return instance;
        });
    }

    registerConstant<T>(key: string, value: T): void {
        this.container.bind(key).toConstantValue(value)
    }

    registerDynamicValue<T>(key: string, func: interfaces.DynamicValue<T>) {
        this.container.bind(key).toDynamicValue(func);
    }

    private addDisposable(instance: any) {
        if (instance.dispose) {
            this.disposableList.push(instance);
        }
    }

    dispose(): void {
        this.disposableList.forEach(c => c.dispose && c.dispose());
    }
}
