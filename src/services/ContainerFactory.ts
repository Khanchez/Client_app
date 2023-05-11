import { interfaces } from 'inversify';
import { DisposableContainer } from '@core/models/DisposableContainer'

export interface ContainerFactory {

    create(parentContainer?: interfaces.Container): DisposableContainer;
}
