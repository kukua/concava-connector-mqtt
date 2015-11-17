# MQTT Connector

> MQTT Connector for converting sensor data to binary payload and forwarding it to ConCaVa.

## How to use

Setup ConCaVa first, see the [ConCaVa README](https://github.com/Kukua/concava).

```bash
docker-compose up -d

# A local instance can be started with:
npm install
npm start

./tools/appendSensorMetadata.sh
npm run client <token> <payload>
# Example payload: 31302e35000003FC (temp: 10.5, pressure: 1020)
```
