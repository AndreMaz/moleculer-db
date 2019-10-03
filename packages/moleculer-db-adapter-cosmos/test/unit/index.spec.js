"use strict";
const { ServiceBroker } = require("moleculer");
const CosmosDbAdapter = require("../../src");
const { default: cosmosServer } = require("@zeit/cosmosdb-server");

const https = require("https");

describe("Test CosmosStoreAdapter", () => {
	let cosmosMock;

	const broker = new ServiceBroker({ logger: false });
	const service = broker.createService({
		name: "store"
	});

	const connection = {
		endpoint: `https://localhost:3000`,
		key: "dummy key",
		agent: https.Agent({ rejectUnauthorized: false })
	};
	const dbName = "dbTest";
	const containerName = "dbContainer";

	const adapter = new CosmosDbAdapter(connection, dbName, containerName);

	beforeAll(() => {
		return new Promise((resolve, reject) => {
			cosmosMock = cosmosServer().listen(3000, () => {
				console.log(
					`Cosmos DB server running at https://localhost:3000`
				);
				resolve();
			});
		});
	});

	beforeEach(() => {
		adapter.init(broker, service);
	});

	afterAll(() => {
		cosmosMock.close(err => {
			if (err) console.log(err);
		});
	});

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

		expect(adapter.updateById).toBeDefined();
		expect(adapter.updateMany).toBeDefined();

		expect(adapter.removeById).toBeDefined();
		expect(adapter.removeMany).toBeDefined();

		expect(adapter.clear).toBeDefined();
		expect(adapter.beforeSaveTransformID).toBeInstanceOf(Function);
		expect(adapter.afterRetrieveTransformID).toBeInstanceOf(Function);
	});

	it("call init", () => {
		expect(adapter.broker).toBe(broker);
		expect(adapter.service).toBe(service);
	});

	it("call connect", async () => {
		try {
			await adapter.connect();
			expect(adapter.database).toBeDefined();
			expect(adapter.container).toBeDefined();
		} catch (error) {
			expect(error).toBeDefined;
		}
	});

	it("call disconnect", () => {
		return adapter.disconnect().then(res => {
			expect(res).toBe("Disconnected");
		});
	});

	it("should `find` zero elements", () => {
		return adapter.find().then(response => {
			expect(response.length).toBe(0);
		});
	});

	it("should `insert` one entry", () => {
		const entry = {
			test: "hello"
		};
		return adapter.insert(entry).then(response => {
			expect(response._etag).toBeDefined();
			expect(response._rid).toBeDefined();
			expect(response._self).toBeDefined();
			expect(response._ts).toBeDefined();
			expect(response.id).toBeDefined();
			expect(response.test).toBe(entry.test);
		});
	});

	it("should `find` one element", () => {
		return adapter.find().then(response => {
			expect(response.length).toBe(1);
		});
	});
});
