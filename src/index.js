//███████╗██╗██████╗ ███████╗ █████╗ ██████╗ ██╗
//██╔════╝██║██╔══██╗██╔════╝██╔══██╗██╔══██╗██║
//█████╗  ██║██████╔╝█████╗  ███████║██████╔╝██║
//██╔══╝  ██║██╔══██╗██╔══╝  ██╔══██║██╔═══╝ ██║
//██║     ██║██║  ██║███████╗██║  ██║██║     ██║
//╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝
// 24fire REST-API v2 für Node.js
// Doku: https://apidocs.24fire.de/v2
// Made by FlosTechnikwelt <florian.linde@flostechnikwelt.de>

'use strict';

const BASE_URL = 'https://manage.24fire.de/api';

/**
 * Fehler der bei einer fehlgeschlagenen API-Anfrage geworfen wird
 * Enthält die HTTP-Statuscode und die rohe API-Antwort
 */
class FireAPIError extends Error {
    constructor(message, { status, response } = {}) {
        super(`[24fire] ${message}`);
        this.name = 'FireAPIError';
        this.status = status;
        this.response = response;
    }
}

/**
 * Entfernt undefined/null-Werte aus einem Objekt, damit optionale
 * Parameter einfach weggelassen werden können
 */
function clean(obj) {
    const out = {};
    for (const [key, value] of Object.entries(obj || {})) {
        if (value !== undefined && value !== null) out[key] = value;
    }
    return out;
}

/**
 * Ein Client wird einmalig mit dem API-Key erstellt:
 *
 *   const FireAPI = require('24fire-api');
 *   const fire = new FireAPI('DEIN_API_KEY');
 */
class FireAPI {
    /**
     * @param {string} apiKey  
     * @param {object} [options]
     * @param {string} [options.baseUrl]  Abweichende Base-URL (Standard: https://manage.24fire.de/api)
     */
    constructor(apiKey, options = {}) {
        if (!apiKey || typeof apiKey !== 'string') {
            throw new FireAPIError('Es wurde kein gültiger API-Key übergeben');
        }
        if (typeof fetch !== 'function') {
            throw new FireAPIError('Globales fetch nicht verfügbar – bitte Node.js 18 oder neuer verwenden');
        }
        this.apiKey = apiKey;
        this.baseUrl = (options.baseUrl || BASE_URL).replace(/\/$/, '');

        // Account-Endpunkte
        this.account = {
            /** Account-Informationen */
            info: () => this.request('GET', '/account'),
            /** Übersicht aller aktiven Dienste */
            services: () => this.request('GET', '/account/services'),
            /** Daten zur Spendenseite */
            donations: () => this.request('GET', '/account/donations'),
            /** Daten zum Affiliate-System */
            affiliate: () => this.request('GET', '/account/affiliate'),
        };
    }

    /**
     * Interne Methode für alle HTTP-Anfragen.
     * @param {string} method  GET | POST | PUT | DELETE
     * @param {string} path    Pfad ab der Base-URL, z.B. "/account"
     * @param {object} [body]  Body-Parameter (werden als x-www-form-urlencoded gesendet)
     * @returns {Promise<object>} geparste JSON-Antwort der API
     */
    async request(method, path, body) {
        const headers = { 'X-Fire-Apikey': this.apiKey };
        const options = { method, headers };

        const data = clean(body);
        if (Object.keys(data).length > 0) {
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
            options.body = new URLSearchParams(data).toString();
        }

        let res;
        try {
            res = await fetch(this.baseUrl + path, options);
        } catch (err) {
            throw new FireAPIError(`Netzwerkfehler: ${err.message}`);
        }

        const text = await res.text();
        let json;
        try {
            json = text ? JSON.parse(text) : null;
        } catch {
            json = text;
        }

        if (!res.ok || (json && json.status === 'error')) {
            const message = (json && json.message) || res.statusText || 'Unbekannter Fehler';
            throw new FireAPIError(message, { status: res.status, response: json });
        }
        return json;
    }

    /**
     * Liefert einen Client für einen bestimmten KVM-Server
     * @param {string|number} internalId  internal_id des Servers (siehe account.services())
     */
    kvm(internalId) {
        return new KVM(this, internalId);
    }

    /**
     * Liefert einen Client für eine bestimmte Domain
     * @param {string|number} internalId  internal_id der Domain (siehe account.services())
     */
    domain(internalId) {
        return new Domain(this, internalId);
    }

    /**
     * Liefert einen Client für einen bestimmten Webspace
     * @param {string|number} internalId  internal_id des Webspace (siehe account.services())
     */
    webspace(internalId) {
        return new Webspace(this, internalId);
    }
}

/** Alle Endpunkte eines einzelnen KVM-Servers */
class KVM {
    constructor(client, internalId) {
        if (!internalId && internalId !== 0) {
            throw new FireAPIError('kvm() benötigt eine internal_id');
        }
        this._client = client;
        this._base = `/kvm/${encodeURIComponent(internalId)}`;

        this.backup = {
            /** Alle Backups auflisten */
            list: () => this._req('GET', '/backup/list'),
            /** Neues Backup erstellen (24fire+). @param {string} [description] max. 24 Zeichen */
            create: (description) => this._req('POST', '/backup/create', { description }),
            /** Status der Backup-Erstellung abfragen */
            createStatus: (backupId) => this._req('POST', '/backup/create/status', { backup_id: backupId }),
            /** Backup wiederherstellen (24fire+) */
            restore: (backupId) => this._req('POST', '/backup/restore', { backup_id: backupId }),
            /** Status der Wiederherstellung abfragen */
            restoreStatus: (backupId) => this._req('POST', '/backup/restore/status', { backup_id: backupId }),
            /** Backup löschen */
            delete: (backupId) => this._req('DELETE', '/backup/delete', { backup_id: backupId }),
        };

        this.traffic = {
            /** Aktueller Traffic-Verbrauch des Monats */
            current: () => this._req('GET', '/traffic/current'),
            /** Traffic-Log (Messung alle 10 Minuten) */
            log: () => this._req('GET', '/traffic/log'),
            /**
             * Traffic-Diagramm generieren (24fire+)
             * @param {object} opts z.B. { type, summary, output, datapoints, size, ... }
             */
            chart: (opts = {}) => this._req('POST', '/traffic/chart', opts),
        };

        this.monitoring = {
            /** Monitoring-Messungen (Timings) abrufen */
            timings: () => this._req('GET', '/monitoring/timings'),
            /** Ausfälle / Incidences abrufen */
            incidences: () => this._req('GET', '/monitoring/incidences'),
        };

        this.ddos = {
            /** Aktuelle DDoS-Einstellungen abrufen */
            get: () => this._req('GET', '/ddos'),
            /**
             * DDoS-Einstellungen ändern (24fire+)
             * @param {object} opts { layer4, layer7, ip_address? }
             */
            change: (opts = {}) => this._req('POST', '/ddos/change', opts),
        };
    }

    _req(method, path, body) {
        return this._client.request(method, this._base + path, body);
    }

    /** Server-Konfiguration abrufen */
    config() {
        return this._req('GET', '/config');
    }

    /** Aktuellen Status und Auslastung abrufen */
    status() {
        return this._req('GET', '/status');
    }

    /**
     * Server starten / stoppen / neu starten.
     * @param {string} mode  z.B. "start", "stop", "restart"
     */
    power(mode) {
        return this._req('POST', '/power', { mode });
    }

    /** Kurzform für power('start') */
    start() {
        return this.power('start');
    }

    /** Kurzform für power('stop') */
    stop() {
        return this.power('stop');
    }

    /** Kurzform für power('restart') */
    restart() {
        return this.power('restart');
    }
}

/** Alle Endpunkte einer einzelnen Domain */
class Domain {
    constructor(client, internalId) {
        if (!internalId && internalId !== 0) {
            throw new FireAPIError('domain() benötigt eine internal_id');
        }
        this._client = client;
        this._base = `/domain/${encodeURIComponent(internalId)}`;

        this.dns = {
            /** Alle DNS-Einträge auflisten */
            list: () => this._req('GET', '/dns'),
            /**
             * DNS-Eintrag hinzufügen (24fire+)
             * @param {object} record { type, name, data }
             */
            add: (record = {}) => this._req('PUT', '/dns/add', record),
            /**
             * DNS-Eintrag bearbeiten (24fire+)
             * @param {object} record { record_id, type?, name?, data? }
             */
            edit: (record = {}) => this._req('POST', '/dns/edit', record),
            /**
             * DNS-Eintrag entfernen
             * @param {string} recordId  ID des Eintrags (siehe dns.list())
             */
            remove: (recordId) => this._req('DELETE', '/dns/remove', { record_id: recordId }),
        };
    }

    _req(method, path, body) {
        return this._client.request(method, this._base + path, body);
    }

    /** Domain-Informationen abrufen */
    info() {
        return this._req('GET', '');
    }
}

/** Endpunkte eines einzelnen Webspace */
class Webspace {
    constructor(client, internalId) {
        if (!internalId && internalId !== 0) {
            throw new FireAPIError('webspace() benötigt eine internal_id');
        }
        this._client = client;
        this._base = `/webspace/${encodeURIComponent(internalId)}`;
    }

    /** Webspace-Daten abrufen */
    info() {
        return this._client.request('GET', this._base);
    }
}

module.exports = FireAPI;
module.exports.FireAPI = FireAPI;
module.exports.FireAPIError = FireAPIError;
module.exports.default = FireAPI;
