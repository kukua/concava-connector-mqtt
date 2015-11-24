import mqtt from 'mqtt'

var client = mqtt.connect('mqtt://<container IP>:3002', {
	password: process.argv[2],
	clientId: process.argv[3],
})

client.on('connect', () => {
	client.publish('data', new Buffer(process.argv[4], 'hex'))
	setTimeout(() => client.end(), 3000)
})
