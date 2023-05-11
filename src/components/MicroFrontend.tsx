import React, { FunctionComponent, useEffect, useRef, useMemo } from 'react';


interface MicroFrontendProps {
    name: string,
    host: string,
    data: any
}

class MicroFrontendState {
    constructor() {
        this.unmountAction = null;
        this.name = null;
        this.renderInProgress = false;
        this.init = false;
    }

    public unmount() {
        if (this.unmountAction != null) {
            this.unmountAction();
        }

        this.name = null;
        this.unmountAction = null;
        this.init = false;
    }

    public init: boolean;
    public name: string | null;
    public renderInProgress: boolean;
    public unmountAction: Function | null;

}

const renderMicrofrontend = function (rendererName: string, microFrontendState: MicroFrontendState, rootElement: HTMLElement, data: any, tryCnt: number) {
    if (!(window as any)[rendererName]) { //fix render on reload error

        if (tryCnt < 10) {
            setTimeout(() => { renderMicrofrontend(rendererName, microFrontendState, rootElement, data, tryCnt++) }, 100);
        }
        console.log(`${rendererName} load error. tryCnt: ${tryCnt}`);
        
    } else {
        microFrontendState.unmountAction = (window as any)[rendererName](rootElement, data);
    }
}

export const MicroFrontend: FunctionComponent<MicroFrontendProps> = (props: MicroFrontendProps) => {
    const rootRef = useRef(null);
    const containerId = (props.data && props.data.containerId) ? props.data.containerId : props.name;
    const microFrontendState = useMemo(() => new MicroFrontendState(), []);

    const renderMicroFrontend = () => {
        if (rootRef != null && rootRef.current != null) {
            const rendererName = `render${props.name}`;
            renderMicrofrontend(rendererName, microFrontendState, rootRef.current, props.data, 0);
        }

        microFrontendState.renderInProgress = false;
    };

    const render = () => {
        if (microFrontendState.init && props.data != null && props.name && !microFrontendState.renderInProgress && rootRef != null && rootRef.current != null) {
            microFrontendState.renderInProgress = true;
            if (microFrontendState.name && microFrontendState.name !== props.name) {
                microFrontendState.unmount();
            }

            microFrontendState.name = props.name;

            const scriptId = `micro-frontend-script-${props.name}`;

            if (document.getElementById(scriptId)) {
                renderMicroFrontend();
                return;
            }

            fetch(props.host)
                .then((res) => res.json())
                .then((manifest) => {
                    const script = document.createElement("script");
                    script.id = scriptId;
                    script.crossOrigin = "";
                    script.src = manifest.files["main.js"];
                    script.onload = () => {
                        renderMicroFrontend();
                    };
                    document.head.appendChild(script);
                });
        }

    };

    useEffect(() => {
        render();
    }, [props.data]);

    useEffect(() => {
        microFrontendState.init = true;
        render();
        return () => {
            microFrontendState.unmount();
        };
    }, []);

    return (
        <div id={containerId} ref={rootRef}>
        </div>
    );
}
