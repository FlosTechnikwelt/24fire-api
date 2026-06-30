//███████╗██╗██████╗ ███████╗ █████╗ ██████╗ ██╗
//██╔════╝██║██╔══██╗██╔════╝██╔══██╗██╔══██╗██║
//█████╗  ██║██████╔╝█████╗  ███████║██████╔╝██║
//██╔══╝  ██║██╔══██╗██╔══╝  ██╔══██║██╔═══╝ ██║
//██║     ██║██║  ██║███████╗██║  ██║██║     ██║
//╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝
// TypeScript-Definitionen für 24fire-api v2
// Doku: https://apidocs.24fire.de/v2
// Made by FlosTechnikwelt <florian.linde@flostechnikwelt.de>
// https://apidocs.24fire.de/v2

/** Standard-Antwortformat der 24fire REST-API */
export interface FireResponse<T = unknown> {
    status: 'success' | 'error';
    message: string;
    data: T;
}

/** Fehler, der bei einer fehlgeschlagenen Anfrage geworfen wird */
export class FireAPIError extends Error {
    name: 'FireAPIError';
    /** HTTP-Statuscode */
    status?: number;
    /** Rohe API-Antwort */
    response?: unknown;
}

export interface FireAPIOptions {
    /** Abweichende Base-URL (Standard: https://manage.24fire.de/api) */
    baseUrl?: string;
}

/** Power-Aktionen für einen KVM-Server */
export type PowerMode = 'start' | 'stop' | 'restart' | (string & {});

export interface DnsRecordInput {
    type: string;
    name: string;
    data: string;
}

export interface DnsEditInput {
    record_id: string;
    type?: string;
    name?: string;
    data?: string;
}

export interface TrafficChartOptions {
    type?: string;
    summary?: string;
    output?: string;
    dataset_in_label?: string;
    dataset_out_label?: string;
    dataset_in_color?: string;
    dataset_out_color?: string;
    axes_y_label?: string;
    datapoints?: number;
    size?: string;
    [key: string]: unknown;
}

export interface DdosChangeOptions {
    layer4?: string;
    layer7?: string;
    ip_address?: string;
    [key: string]: unknown;
}

export interface KVM {
    config(): Promise<FireResponse>;
    status(): Promise<FireResponse>;
    power(mode: PowerMode): Promise<FireResponse>;
    start(): Promise<FireResponse>;
    stop(): Promise<FireResponse>;
    restart(): Promise<FireResponse>;
    backup: {
        list(): Promise<FireResponse>;
        create(description?: string): Promise<FireResponse>;
        createStatus(backupId: string): Promise<FireResponse>;
        restore(backupId: string): Promise<FireResponse>;
        restoreStatus(backupId: string): Promise<FireResponse>;
        delete(backupId: string): Promise<FireResponse>;
    };
    traffic: {
        current(): Promise<FireResponse>;
        log(): Promise<FireResponse>;
        chart(opts?: TrafficChartOptions): Promise<FireResponse>;
    };
    monitoring: {
        timings(): Promise<FireResponse>;
        incidences(): Promise<FireResponse>;
    };
    ddos: {
        get(): Promise<FireResponse>;
        change(opts?: DdosChangeOptions): Promise<FireResponse>;
    };
}

export interface Domain {
    info(): Promise<FireResponse>;
    dns: {
        list(): Promise<FireResponse>;
        add(record: DnsRecordInput): Promise<FireResponse>;
        edit(record: DnsEditInput): Promise<FireResponse>;
        remove(recordId: string): Promise<FireResponse>;
    };
}

export interface Webspace {
    info(): Promise<FireResponse>;
}

export default class FireAPI {
    constructor(apiKey: string, options?: FireAPIOptions);

    apiKey: string;
    baseUrl: string;

    account: {
        info(): Promise<FireResponse>;
        services(): Promise<FireResponse>;
        donations(): Promise<FireResponse>;
        affiliate(): Promise<FireResponse>;
    };

    /** Low-Level-Anfrage gegen die API. */
    request(method: string, path: string, body?: Record<string, unknown>): Promise<FireResponse>;

    kvm(internalId: string | number): KVM;
    domain(internalId: string | number): Domain;
    webspace(internalId: string | number): Webspace;
}

export { FireAPI };
