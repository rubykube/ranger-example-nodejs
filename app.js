#!/usr/bin/env node

var args      = require('args')
var websocket = require('ws')
var url       = require('url')

args.option('host', 'Specify host of running Ranger server', 'ws.ranger.wb.local')
args.option('jwt', 'Specify JWT token of member')

var options = args.parse(process.argv)

const streams = [
	'global.tickers',
	'usdbtc.update',
	'order',
	'trade',
]

const address = 'ws://' + url.format({
   'host': options.host,
   'query': {
	   'stream': streams,
   },
})

console.log('[INFO]', 'Connecting to Ranger at', address)

const client = new websocket(address)

client.on('open', function() {
	console.log(
		'[INFO]', 'Connection to Ranger at has been established'
	)

	if (!options.jwt) {
		console.log(
			'[WARNING]', 'JWT token is not specified, ' +
			'will be subscribed only for public channels'
		)
		console.log(
			'[WARNING]', 'If you want to subscribe for private channel, you '+
			'need to specify JWT token using --jwt flag'
		)

		return
	}

	console.log('[INFO]', 'Solving authorization challenge by sending JWT token')

	client.send(
		JSON.stringify({
			'jwt': 'Bearer '+options.jwt,
		})
	)
})

client.on('error', function(err) {
	if (err.syscall == 'connect') {
		console.log(
			'[ERROR]', 'Unable to establish connection with Ranger: '+ err.message
		)
	} else {
		console.log('[ERROR]', err.message)
	}
	process.exit(1)
})

client.on('message', function(message) {
	var data = JSON.parse(message)

	if (data instanceof Array) {
		var channel = data[0]
		var payload = data[1]

		console.log(
			'[INFO]',
			'Channel:', channel,
			'Payload:', JSON.stringify(payload, null, 2)
		)
	} else {
		if (data['success']) {
			console.log('[INFO]', data['success']['message'])
		} else {
			console.log('[ERROR]', data['error']['message'])
			process.exit(1)
		}
	}
})
