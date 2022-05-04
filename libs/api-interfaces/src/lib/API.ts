import { Reading } from './api-interfaces';

async function fetchJsonData<T>(url: string) {
    return new Promise<T>((resolve, reject) => {
        fetch(url)
            .then((response) => response.json())
            .then((data) => resolve(data))
            .catch((error) => reject(error));
    });
}

export class API {
    readonly baseUrl: string;

    constructor() {
        this.baseUrl = '/api';
    }

    get readings() {
        return {
            serials: () =>
                fetchJsonData<string[]>(`${this.baseUrl}/readings/serials`),
            deviceIds: (serial: string) =>
                fetchJsonData<string[]>(
                    `${this.baseUrl}/readings/${serial}/devices`
                ),
            get: (serial: string, deviceId: string) =>
                fetchJsonData<Reading[]>(
                    `${this.baseUrl}/readings/${serial}/${deviceId}`
                ),
        };
    }
}
