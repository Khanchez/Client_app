import { FunctionComponent } from 'react';
import { MicroFrontend } from './MicroFrontend';
import { useContainer } from 'inversify-react';

interface IListProps {
    history: History;
    match: any;
}

const EventList: FunctionComponent<IListProps> = (props: IListProps) => {
    const container = useContainer();

    return <MicroFrontend host={'/events/api/resource'} data={{ listItemId: props.match.params.listItemId, history: props.history, container: container }} name="Events" />
};

export default EventList;
