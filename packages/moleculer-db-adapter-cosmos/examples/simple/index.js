"use strict";

let { ServiceBroker } = require("moleculer");
let StoreService = require("../../../moleculer-db/index");

let CosmosDbAdapter = require("../../index");
const connectOpt = require('../../../../../connectOpt')

const dbName = { id: "sample database" };
const containerName = { id: "sample collection" };
const documentDefinition = { id: "hello world doc", content: "Hello World!" };

// Create broker
let broker = new ServiceBroker({
	logger: console,
	logLevel: "debug"
});

// Load my service
broker.createService(StoreService, {
	name: "posts",
	adapter: new CosmosDbAdapter(connectOpt, dbName, containerName),
	collection: "posts",
	settings: {},

	afterConnected() {
		console.log(this.adapter)
	}
});

broker.start()