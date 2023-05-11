import type { JsonService } from '@core/services/JsonService'
import { injectable } from 'inversify';

@injectable()
export class JsonServiceImpl implements JsonService {

    parse(value) {
        return JSON.parse(value, this.toLowerKeyReviver);
    }

    private toLowerKeyReviver(key, value) {
        if (value && typeof value === 'object') {
            for (var k in value) {
                if (/^[A-Z]/.test(k) && Object.hasOwnProperty.call(value, k)) {
                    value[k.charAt(0).toLowerCase() + k.substring(1)] = value[k];
                    delete value[k];
                }
            }
        }
        return value;
    }

    merge(target: any, ...sources: any) {

        if (!sources.length) return target;
        const source = sources.shift();

        if (this.isObject(target) && this.isObject(source)) {
            for (const key in source) {
                if (this.isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    this.merge(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }

        return this.merge(target, ...sources);
    }

    private isObject(item: any) {
        return (item && typeof item === 'object' && !Array.isArray(item));
    }

}