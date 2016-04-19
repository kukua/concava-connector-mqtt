# MQTT Connector

> MQTT connector for converting sensor data to a binary payload and forwarding it to ConCaVa.

## How to use

```bash
docker run -d -p 3000:3000 -v /path/to/config.js:/data/config.js kukuadev/concava-connector-mqtt
```

Make sure [ConCaVa](https://github.com/kukua/concava) is setup as well.
See [`config.js.sample`](https://github.com/kukua/concava-connector-mqtt/blob/master/config.js.sample) for the default configuration.

## Test

```js
npm run client '<container IP>:3000' '<token>' '<device ID>' '<hex>'
```

## Contribute

Your help and feedback are highly appreciated!

```bash
git clone https://github.com/kukua/concava-connector-mqtt
cd concava-connector-mqtt
npm install
npm start
```

## License

This software is licensed under the [MIT license](https://github.com/kukua/concava-connector-spul/blob/master/LICENSE).

© 2016 Kukua BV
