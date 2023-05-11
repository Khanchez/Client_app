export interface EventHandlerService {

    readonly id: string;

    process(...params): unknown;
}