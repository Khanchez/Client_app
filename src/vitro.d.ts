declare module '@vitrosoftware/common-ui'
declare module '@vitrosoftware/common-ui-ts'
declare module 'react-i18next'

export { };

declare global {
    interface Window {
        currentPathname: string;
        currentPathName: string;
        DisposeGrids: Function;
        TGSetEvent: Function;
        $: any;
        grid: any,
        vitro: any,
        localeService: any,
        logOut: Function
    }
}