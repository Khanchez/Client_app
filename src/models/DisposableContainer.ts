import { interfaces } from 'inversify';

export interface DisposableContainer {

    readonly container: interfaces.Container;

    registerSingleton<T>(key: string, constructor: new (...args: never[]) => T): void;

    registerConstant<T>(key: string, value: T): void;

    registerDynamicValue<T>(key: string, func: interfaces.DynamicValue<T>);

    dispose(): void;
}