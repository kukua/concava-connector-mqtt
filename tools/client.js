import mqtt from 'mqtt'

var client = mqtt.connect('mqtt://' + process.argv[2], {
	password: process.argv[3],
	clientId: process.argv[4],
})

client.on('connect', () => {
	client.publish('data', new Buffer(process.argv[5], 'hex'))
	setTimeout(() => client.end(), 3000)
})
