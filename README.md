[![POWERED BY 24FIRE](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOTkuOTM3NTM4MTQ2OTcyNjYiIGhlaWdodD0iMzUiIHZpZXdCb3g9IjAgMCAxOTkuOTM3NTM4MTQ2OTcyNjYgMzUiPjxyZWN0IHdpZHRoPSIxMjEuMjgxMjcyODg4MTgzNiIgaGVpZ2h0PSIzNSIgZmlsbD0iI2ZmODQwMCIvPjxyZWN0IHg9IjEyMS4yODEyNzI4ODgxODM2IiB3aWR0aD0iNzguNjU2MjY1MjU4Nzg5MDYiIGhlaWdodD0iMzUiIGZpbGw9IiNmZjVhMDMiLz48dGV4dCB4PSI2MC42NDA2MzY0NDQwOTE4IiB5PSIxNy41IiBmb250LXNpemU9IjEyIiBmb250LWZhbWlseT0iJ1JvYm90bycsIHNhbnMtc2VyaWYiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBsZXR0ZXItc3BhY2luZz0iMiI+UE9XRVJFRCBCWTwvdGV4dD48dGV4dCB4PSIxNjAuNjA5NDA1NTE3NTc4MTIiIHk9IjE3LjUiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtZmFtaWx5PSInTW9udHNlcnJhdCcsIHNhbnMtc2VyaWYiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtd2VpZ2h0PSI5MDAiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBsZXR0ZXItc3BhY2luZz0iMiI+MjRGSVJFPC90ZXh0Pjwvc3ZnPg==)](https://forthebadge.com)


# 24fire-api

Ein einfacher Node.js-Wrapper für die **24fire REST-API v2**.
Verwalte deinen Account, KVM-Server, Domains und Webspaces direkt aus deinem Code.

## Features

- 🔗 Kommunikation über SSL (`https://manage.24fire.de/api`)
- 📦 **Keine Abhängigkeiten** nutzt das eingebaute `fetch` von Node.js
- 🧩 Intuitive, verschachtelte Bedienung (`fire.kvm(id).backup.list()`)
- 🟦 Mitgelieferte TypeScript-Typen
- ⚡ Schnell & leichtgewichtig

> **Hinweis:** Dies ist Version **2.0**. Die API-Struktur hat sich gegenüber v1 komplett geändert
> (neue Base-URL, neuer Auth-Header, `internal_id` pro Dienst). Siehe [Migration von v1](#migration-von-v1).

## Voraussetzungen

- Node.js **18 oder neuer** (wegen des globalen `fetch`)

## Installation

```bash
npm install 24fire-api
```

## API-Key erstellen

1. Logge dich im [24fire Control Panel](https://manage.24fire.de) ein.
2. Gehe zu **Einstellungen → API-Keys** und klicke auf „API-Key erstellen“.
3. Speichere den Key sicher ab – er wird nur **einmal** angezeigt.

## Schnellstart

```javascript
const FireAPI = require('24fire-api');
// oder:  import FireAPI from '24fire-api';

const fire = new FireAPI('DEIN_API_KEY');

// Account-Infos abrufen
const account = await fire.account.info();
console.log(account.data);

// Alle Dienste anzeigen (hier findest du die internal_id jedes Dienstes)
const services = await fire.account.services();
console.log(services.data);

// Einen Server starten
await fire.kvm('INTERNAL_ID').start();
```

Jede Methode gibt die API-Antwort im Format `{ status, message, data }` zurück.
Bei Fehlern wird ein `FireAPIError` geworfen (siehe [Fehlerbehandlung](#fehlerbehandlung)).

---

## Account

```javascript
await fire.account.info();        // Account-Informationen (Name, E-Mail, Guthaben …)
await fire.account.services();    // Übersicht aller aktiven Dienste (mit internal_id)
await fire.account.donations();   // Daten zur Spendenseite
await fire.account.affiliate();   // Daten zum Affiliate-System
```

## KVM-Server

Zuerst einen Server über seine `internal_id` auswählen:

```javascript
const vm = fire.kvm('INTERNAL_ID');
```

### Allgemein

```javascript
await vm.config();          // Konfiguration (Hardware, IPs, OS …)
await vm.status();          // Status & Auslastung (running / stopped / …)

await vm.power('start');    // Power-Aktion: 'start' | 'stop' | 'restart'
await vm.start();           // Kurzform für power('start')
await vm.stop();            // Kurzform für power('stop')
await vm.restart();         // Kurzform für power('restart')
```

### Backups

```javascript
await vm.backup.list();                       // Alle Backups auflisten
await vm.backup.create('Notiz');              // Backup erstellen (24fire+), Notiz optional, max. 24 Zeichen
await vm.backup.createStatus('BACKUP_ID');    // Status der Erstellung abfragen
await vm.backup.restore('BACKUP_ID');         // Backup wiederherstellen (24fire+)
await vm.backup.restoreStatus('BACKUP_ID');   // Status der Wiederherstellung abfragen
await vm.backup.delete('BACKUP_ID');          // Backup löschen
```

### Traffic

```javascript
await vm.traffic.current();   // Aktueller Traffic-Verbrauch des Monats
await vm.traffic.log();       // Traffic-Log (Messung alle 10 Minuten)

// Traffic-Diagramm generieren (24fire+)
await vm.traffic.chart({
    type: 'both',             // Eingehend / Ausgehend / Beides
    summary: 'DAILY',         // DAILY | HOURLY | NONE
    output: 'apexcharts',     // chartjs | apexcharts | base64
    datapoints: 30,
    size: '900x300',
});
```

### Monitoring

```javascript
await vm.monitoring.timings();      // Messungen abrufen
await vm.monitoring.incidences();   // Ausfälle abrufen
```

### DDoS (24fire+)

```javascript
await vm.ddos.get();                // Aktuelle DDoS-Einstellungen abrufen
await vm.ddos.change({
    layer4: 'permanent',
    layer7: 'on',
    ip_address: '88.151.194.253',   // optional; ohne Angabe gilt es für alle IPv4 der VM
});
```

## Domains

```javascript
const domain = fire.domain('INTERNAL_ID');

await domain.info();        // Domain-Informationen
await domain.dns.list();    // Alle DNS-Einträge

// DNS-Eintrag hinzufügen (24fire+)
await domain.dns.add({ type: 'A', name: '*', data: '1.2.3.4' });

// DNS-Eintrag bearbeiten (24fire+)
await domain.dns.edit({ record_id: 'RECORD_ID', data: '5.6.7.8' });

// DNS-Eintrag entfernen
await domain.dns.remove('RECORD_ID');
```

## Webspace

```javascript
await fire.webspace('INTERNAL_ID').info();   // Webspace-Daten abrufen
```

---

## Fehlerbehandlung

Schlägt eine Anfrage fehl (HTTP-Fehler oder `status: "error"`), wird ein `FireAPIError` geworfen:

```javascript
const { FireAPIError } = require('24fire-api');

try {
    await fire.kvm('INTERNAL_ID').start();
} catch (err) {
    if (err instanceof FireAPIError) {
        console.error('API-Fehler:', err.message);
        console.error('HTTP-Status:', err.status);
        console.error('Antwort:', err.response);
    }
}
```

## Migration von v1

| | v1 (alt) | v2 (neu) |
|---|---|---|
| Base-URL | `https://api.24fire.de` | `https://manage.24fire.de/api` |
| Auth-Header | `X-FIRE-APIKEY` | `X-Fire-Apikey` |
| Server-Auswahl | global über den Key | pro Dienst über die `internal_id` |
| Abhängigkeiten | `axios` | keine (eingebautes `fetch`) |

**Beispiel:**

```javascript
// v1
myFireApi.vm().getVMstatus();
myFireApi.vm().startVM();
myFireApi.backup().listBackups();

// v2
fire.kvm('INTERNAL_ID').status();
fire.kvm('INTERNAL_ID').start();
fire.kvm('INTERNAL_ID').backup.list();
```

> Manche Endpunkte (z. B. DNS-Verwaltung, Backups erstellen/wiederherstellen, DDoS, Traffic-Chart)
> erfordern ein aktives **24fire+** Abonnement.

## Author & Credits

- Florian Linde <florian.linde@flostechnikwelt.de> (FlosTechnikwelt)

## Empfehlenswert

- [Offizielle API-Dokumentation (v2)](https://apidocs.24fire.de/v2)
- [24fire](https://24fire.de/) 
- [Discord](https://discord.gg/24fire)

## Feedback

Wenn du Feedback hast, wende dich an mich unter support@flostechnikwelt.de


