#!/bin/sh

(curl concava:1026/v1/updateContext -s -S --header 'Content-Type: application/json' \
    --header 'Accept: application/json' -d @- | python -mjson.tool) <<EOF
{
	"contextElements": [
		{
			"type": "SensorMetadata",
			"isPattern": "false",
			"id": "0000000000000539",
			"attributes": [
				{
					"name": "temp",
					"type": "asciiFloat",
					"value": 4,
					"metadatas": [
						{
							"name": "index",
							"value": 0
						}
					]
				},
				{
					"name": "pressure",
					"type": "integer",
					"value": 4,
					"metadatas": [
						{
							"name": "index",
							"value": 1
						}
					]
				}
			]
		}
	],
	"updateAction": "APPEND"
}
EOF
