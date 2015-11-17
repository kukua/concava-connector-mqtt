import util from 'util'
import mqtt from 'mqtt'
import request from 'request'

// Configuration
var debug = true
var port = 3002
var concavaUrl = 'http://localhost:3000/v1/sensorData'
var keyrock = {
	url: 'http://concava:5000/v3/',
	adminToken: 'b0cf392a9562445d8cb222038010716a',
}

// Authentication method
function getUserByToken (token, cb) {
	request(keyrock.url + 'auth/tokens', {
		headers: {
			'Content-Type': 'application/json',
			'X-Auth-Token': keyrock.adminToken,
			'X-Subject-Token': token,
		},
	}, function (err, httpResponse, body) {
		if (err) return cb(err)
		if (httpResponse.statusCode !== 200) return cb('Unauthorized token.')

		var data = JSON.parse(body)

		if (data.error) {
			if (data.error.code === 401) return cb('Unauthorized token.')
			return cb(data.error.message)
		}

		var user = data.token.user

		cb(null, {
			id: user.id,
			name: user.name,
			token: token,
		})
	})
}

// Method for sending data to ConCaVa
function send (token, deviceId, payload, cb) {
	request.post({
		url: concavaUrl,
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
new mqtt.Server(function(client) {
	if ( ! this.clients) this.clients = {}

	client.on('connect', (packet) => {
		this.clients[packet.clientId] = client
		client.id = packet.clientId
		client.token = packet.password.toString()
		console.log('CONNECT(%s)', client.id)
		client.subscriptions = []
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

	client.on('pingreq', (packet) => {
		console.log('PINGREQ(%s)', client.id)
		client.pingresp()
	})

	client.on('disconnect', (packet) => {
		console.log('DISCONNECT(%s)', client.id)
		client.stream.end()
	})

	client.on('close', (packet) => {
		delete this.clients[client.id]
	})

	client.on('error', (err) => {
		client.stream.end()
		console.error(err)
	})
}).listen(port)

console.log('Listening on port', port)
