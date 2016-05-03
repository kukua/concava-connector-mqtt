import mqtt from 'mqtt'
import request from 'request'

// Configuration
//const debug = (process.env['DEBUG'] === 'true' || process.env['DEBUG'] === '1')
const url   = (process.env['CONCAVA_URL'] || 'unknown.host')
const port  = (parseInt(process.env['PORT']) || 3000)

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
		console.log('CONNECT(%s)', client.id)

		if ( ! client.id.match(/^[a-zA-Z0-9]{16}$/)) {
			client.connack({ returnCode: 2 })
			return
		}
		if ( ! client.token.match(/^[a-zA-Z0-9]{32}$/)) {
			client.connack({ returnCode: 4 })
			return
		}

		client.connack({ returnCode: 0 })
	})

	client.on('subscribe', (packet) => {
		console.log('SUBSCRIBE(%s): Attempt to subscribe on %s', client.id, packet.topic)
		// TODO(mauvm): Send back error
		client.suback({ messageId: packet.messageId, granted: [] })
	})

	client.on('publish', (packet) => {
		console.log('PUBLISH(%s): %s %j', client.id, packet.topic, packet.payload)

		// TODO(mauvm): Send back error
		if (packet.topic !== 'data') return

		send(client.token, client.id, packet.payload, (err) => {
			// TODO(mauvm): Send back error
			console.log('RESULT(%s): %s', client.id, err)
		})
	})

	client.on('pingreq', () => {
		console.log('PINGREQ(%s)', client.id)
		client.pingresp()
	})

	client.on('disconnect', () => {
		console.log('DISCONNECT(%s)', client.id)
		client.stream.end()
	})

	client.on('close', () => {
		delete this.clients[client.id]
	})

	client.on('error', (err) => {
		client.stream.end()
		console.error(err)
	})
}).listen(port)

console.log('Listening on port', port)
