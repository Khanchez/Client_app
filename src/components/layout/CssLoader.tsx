import React, { ReactNode, useEffect, useState } from 'react'

interface ICssLoaderProps {
    children: ReactNode;
}

export function CssLoader(props: ICssLoaderProps) {

    const [loaded, setLoaded] = useState(false);

    let loadStylePromise = url => {
        return new window.Promise(resolve => {
            if (document.getElementById(url)) {
                resolve(url);
            } else {
                let link = document.createElement('link');
                link.id = url;
                link.rel = 'stylesheet';
                link.type = 'text/css';
                link.href = url;
                link.media = 'all';
                link.onload = () => resolve(link);
                document.head.appendChild(link);
            }
        });
    };

    let loadStyleList = async (urlList, callback) => {
        for (const url of urlList) {
            await loadStylePromise(url);
        }
        callback();
    };

    useEffect(() => {
        window.fetch('/api/config/createStyleUrlList', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                loadStyleList(data, () => setLoaded(true));
            });
    }, []);

    if (!loaded) {
        return <></>
    }

    return <>{props.children}</>;
}