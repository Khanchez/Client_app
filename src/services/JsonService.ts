export interface JsonService {

    parse(string: string): any;

    merge(target: any, ...sources: any);
}