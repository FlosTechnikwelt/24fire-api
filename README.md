[![POWERED BY 24FIRE](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOTkuOTM3NTM4MTQ2OTcyNjYiIGhlaWdodD0iMzUiIHZpZXdCb3g9IjAgMCAxOTkuOTM3NTM4MTQ2OTcyNjYgMzUiPjxyZWN0IHdpZHRoPSIxMjEuMjgxMjcyODg4MTgzNiIgaGVpZ2h0PSIzNSIgZmlsbD0iI2ZmODQwMCIvPjxyZWN0IHg9IjEyMS4yODEyNzI4ODgxODM2IiB3aWR0aD0iNzguNjU2MjY1MjU4Nzg5MDYiIGhlaWdodD0iMzUiIGZpbGw9IiNmZjVhMDMiLz48dGV4dCB4PSI2MC42NDA2MzY0NDQwOTE4IiB5PSIxNy41IiBmb250LXNpemU9IjEyIiBmb250LWZhbWlseT0iJ1JvYm90bycsIHNhbnMtc2VyaWYiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBsZXR0ZXItc3BhY2luZz0iMiI+UE9XRVJFRCBCWTwvdGV4dD48dGV4dCB4PSIxNjAuNjA5NDA1NTE3NTc4MTIiIHk9IjE3LjUiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtZmFtaWx5PSInTW9udHNlcnJhdCcsIHNhbnMtc2VyaWYiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtd2VpZ2h0PSI5MDAiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBsZXR0ZXItc3BhY2luZz0iMiI+MjRGSVJFPC90ZXh0Pjwvc3ZnPg==)](https://forthebadge.com)


# 24fire-api


Die 24fire-api soll die Interaktion mit der 24fire Kunden Api vereinfachen und verbessern.


## Features

- 🔗 Kommunikation über SSL
- 🏃 Schnelle interaktion
- ➡️ Direkte Anfragen ohne Middelware
- ℹ️ Einfache Bedienung


## Optimierungen & Feedback

Welche Optimierungen hast du in deinem Code vorgenommen? Z.B. Refactoring, Performance-Verbesserungen

Wenn du Feedback hast, wenden dich an mich unter support@flostechnikwelt.de

## Author & Credits
 - Flostechnikwelt
 - Lars.1309
## Empfehlenswert

 - [Offizielle API Dokumentation](https://documenter.getpostman.com/view/18955936/2s93zB6hJu)
 - [24fire](https://24fire.de/)
 - [Discord](https://discord.gg/24fire)


## Wie wird es installiert?

Um die 24fire-api in deinem Projekt zu installieren, führe bitte den folgenden Befehl aus

```bash
  npm install 24fire-api
```


## Wie bekomme ich einen API Key?

Jeder Kunde hat die möglichkeit für seine VM einen API-Key zu bekommen.
#### 1. Wähle deinen Server aus
![Bild1](https://i.imgur.com/F5k2Z2s.png)
#### 2. Öffne das Menu durch den Buttn mit den drei Strichen
![Bild2](https://i.imgur.com/YPkNMX7.png)
#### 3. Klicke auf "API-Key anzeigen"
![Bild3](https://i.imgur.com/Qq95Ojo.png)
#### 4. Nun sollte dieses Modal erscheinen, hier kannst du den API-Key kopieren
![Bild4](https://i.imgur.com/s2llq6W.png)## Wie verwende ich fireapi-24fire?


### Einen fireApi Client erstellen

```javascript
  const fireApi = require("24fire-api")
  const apiKey = 'DEIN_API_SCHLÜSSEL';
  const myFireApi = new fireApi(apiKey);
```



### VM

#### -> Zeige die VM Konfiguration an

```javascript
  myFireApi.vm().getVMconfig().then(data => {
    console.log('VM config:', data);
  }).catch(error => {
    console.error('Fehler:', error);
  });
```

#### -> Den aktuellen VM Status Abrufen

```javascript
  myFireApi.vm().getVMstatus().then(data => {
    console.log('Aktueller VM Status:', data);
  }).catch(error => {
    console.error('Fehler:', error);
  });
```

#### -> Die VM Starten

```javascript
  myFireApi.vm().startVM().then(data => {
    console.log('Antwort: ', data);
  }).catch(error => {
    console.error('Fehler: ', error);
  });
```

#### -> Die VM herunterfahren

```javascript
  myFireApi.vm().stopVM().then(data => {
    console.log('Antwort: ', data);
  }).catch(error => {
    console.error('Fehler: ', error);
  });
```


#### -> Die VM neustarten

```javascript
  myFireApi.vm().restartVM().then(data => {
    console.log('Antwort:', data);
  }).catch(error => {
    console.error('Fehler:', error);
  });
```
