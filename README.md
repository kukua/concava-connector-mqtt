# MQTT Connector

> MQTT Connector for converting sensor data to a binary payload and forwarding it to ConCaVa.

## How to use

```bash
docker run -d -p 3002 -v /path/to/config.js:/data/config.js kukuadev/concava-mqtt-connector
```

Make sure [ConCaVa](https://github.com/kukua/concava) is setup aswell.
See [`config.js.sample`](https://github.com/kukua/concava-mqtt-connector/blob/master/config.js.sample) for the default configuration.

## Test

```js
npm run client '<token>' '<device ID>' '<hex>'
```

## Contribute

Your help and feedback are highly welcome!

```bash
git clone https://github.com/kukua/concava-mqtt-connector
cd concava-mqtt-connector
npm install
npm start
```
