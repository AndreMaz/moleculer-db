"use strict";

const { ServiceBroker } = require("moleculer");
const CosmosDbAdapter = require("../../src");

describe("Test CosmosStoreAdapter", () => {
	const broker = new ServiceBroker({ logger: false });
	const service = broker.createService({
		name: "store"
	});

	const connection = {
		endpoint: "https://documents.azure.com",
		key: "my-secret-key"
	};
	const dbName = "sample database";
	const containerName = "sample collection";

	const adapter = new CosmosDbAdapter(connection, dbName, containerName);

	it("should be created", () => {
		expect(adapter).toBeDefined();

		expect(adapter.connection).toBe(connection);
		expect(adapter.dbName).toBe(dbName);
		expect(adapter.containerName).toBe(containerName);

		expect(adapter.init).toBeDefined();
		expect(adapter.connect).toBeDefined();
		expect(adapter.disconnect).toBeDefined();
		expect(adapter.find).toBeDefined();
		expect(adapter.findOne).toBeDefined();
		expect(adapter.findById).toBeDefined();
		expect(adapter.findByIds).toBeDefined();
		expect(adapter.count).toBeDefined();
		expect(adapter.insert).toBeDefined();
		expect(adapter.insertMany).toBeDefined();
		expect(adapter.updateMany).toBeDefined();
		expect(adapter.updateById).toBeDefined();
		expect(adapter.removeMany).toBeDefined();
		expect(adapter.removeById).toBeDefined();
		expect(adapter.clear).toBeDefined();
		expect(adapter.beforeSaveTransformID).toBeInstanceOf(Function);
		expect(adapter.afterRetrieveTransformID).toBeInstanceOf(Function);
	});
});
