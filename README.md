# MQTT Connector

> MQTT connector for converting sensor data into a binary payload and forwarding it to ConCaVa.

## Installation

The MQTT connector can be run as a NodeJS program or in a Docker container.

Make sure [ConCaVa](https://github.com/kukua/concava) is setup as well.
See [`.env.sample`](https://github.com/kukua/concava-connector-mqtt/tree/master/.env.sample) for the default configuration.

### NodeJS

```bash
git clone https://github.com/kukua/concava-connector-mqtt.git
cd concava-connector-mqtt
cp .env.sample .env
chmod 600 .env
# > Edit .env

npm install
npm run compile
source .env
npm start
```

Tested with NodeJS v5.1

### Docker

First, [install Docker](http://docs.docker.com/engine/installation/). Then run:

```bash
curl https://raw.githubusercontent.com/kukua/concava-connector-mqtt/master/.env.sample > .env
chmod 600 .env
# > Edit .env

touch $PWD/mqtt.log
docker run -d -p 3333:3333 -p 5555:5555 \
	-v $PWD/mqtt.log:/mqtt.log
	--env-file .env --name mqtt_connector \
	kukuadev/concava-connector-mqtt
```

Tested with Docker v1.9.

## Test

```js
npm run client '<container IP or localhost>:3000' '<auth token>' '<device ID>' '<payload hex>'
```

## Contribute

Your help and feedback are highly appreciated!

## License

This software is licensed under the [MIT license](https://github.com/kukua/concava-connector-mqtt/blob/master/LICENSE).

© 2016 Kukua BV
