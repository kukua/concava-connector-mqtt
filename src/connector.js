import bunyan from 'bunyan'
import mqtt from 'mqtt'
import request from 'request'

// Logger
const debug = (process.env['DEBUG'] === 'true' || process.env['DEBUG'] === '1')
const logFile = (process.env['LOG_FILE'] || '/mqtt.log')
const log = bunyan.createLogger({
	name: (process.env['LOG_NAME'] || 'concava-connector-mqtt'),
	streams: [
		{ level: 'warn', stream: process.stdout },
		{ level: (debug ? 'debug' : 'info'), path: logFile }
	]
})

// Exception handling
process.on('uncaughtException', (err) => {
	log.error({ type: 'uncaught-exception', stack: err.stack }, '' + err)
})

// Configuration
const url = (process.env['CONCAVA_URL'] || 'unknown.host')
const port = (parseInt(process.env['PORT']) || 3000)

// Method for sending data to ConCaVa
function send (token, deviceId, payload, cb) {
	request.post({
		url,
		body: Buffer.concat([new Buffer(deviceId, 'hex'), payload]),
		headers: {
			'Content-Type': 'application/octet-stream',
			'Authorization': 'Token ' + token,
		},
	}, function (err, httpResponse, body) {
		if (err) return cb(err)

		if (httpResponse.statusCode !== 200) {
			return cb('Error in ConCaVa (' + httpResponse.statusMessage + '): ' + body)
		}

		cb()
	})
}

// Source: https://github.com/mqttjs/MQTT.js/blob/master/examples/server/orig.js
new mqtt.Server(function (client) {
	if ( ! this.clients) this.clients = {}

	client.on('connect', (packet) => {
		this.clients[packet.clientId] = client
		client.id = packet.clientId
		client.token = packet.password.toString()

		log.debug({ type: 'connect', deviceId: client.id })

		if ( ! client.id.match(/^[a-zA-Z0-9]{16}$/)) {
			log.warn({ type: 'invalid-device-id', deviceId: client.id })

			client.connack({ returnCode: 2 })
			return
		}
		if ( ! client.token.match(/^[a-zA-Z0-9]{32}$/)) {
			log.warn({ type: 'invalid-auth-token', deviceId: client.id })

			client.connack({ returnCode: 4 })
			return
		}

		client.connack({ returnCode: 0 })
	})

	client.on('subscribe', (packet) => {
		log.debug({
			type: 'subscribe', deviceId: client.id,
			topic: packet.topic
		})

		// TODO(mauvm): Send back error
		client.suback({ messageId: packet.messageId, granted: [] })
	})

	client.on('publish', (packet) => {
		var { topic, payload } = packet

		log.info({
			type: 'publish', deviceId: client.id,
			topic, payload
		})

		send(client.token, client.id, payload, (err) => {
			// TODO(mauvm): Send back error
			log.debug({
				type: 'result', deviceId: client.id,
				err
			})
		})
	})

	client.on('pingreq', () => {
		log.debug({ type: 'pingreq', deviceId: client.id })

		client.pingresp()
	})

	client.on('disconnect', () => {
		log.debug({ type: 'disconnect', deviceId: client.id })

		client.stream.end()
	})

	client.on('close', () => {
		delete this.clients[client.id]
	})

	client.on('error', (err) => {
		log.error({
			type: 'error', deviceId: client.id,
			err
		})

		client.stream.end()
	})
}).listen(port)

log.info('Listening on port ' + port)
