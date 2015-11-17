import mqtt from 'mqtt'

var client = mqtt.connect('mqtt://localhost:3002', {
	clientId: '0000000000000539',
	password: process.argv[2],
})

client.on('connect', () => {
	client.publish('data', new Buffer(process.argv[3], 'hex'))
	setTimeout(() => client.end(), 3000)
})
