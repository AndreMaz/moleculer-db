/*
 * moleculer-db-adapter-cosmosDB
 * Copyright (c) 2019 MoleculerJS (https://github.com/moleculerjs/moleculer-db)
 * MIT Licensed
 */

"use strict";

const _ = require("lodash");
const Promise = require("bluebird");
const { ServiceSchemaError } = require("moleculer").Errors;
const { CosmosClient } = require("@azure/cosmos");

class CosmosDbAdapter {
	/**
	 * Creates an instance of CosmosDbAdapter.
	 * @param {Object} connection
	 * @param {Object} opts
	 *
	 * @memberof CosmosDbAdapter
	 */
	constructor(connection, dbName, containerName) {
		this.connection = connection;
		this.dbName = dbName;
		this.containerName = containerName;
	}

	/**
	 * Initialize adapter
	 *
	 * @param {ServiceBroker} broker
	 * @param {Service} service
	 *
	 * @memberof CosmosDbAdapter
	 */
	init(broker, service) {
		this.broker = broker;
		this.service = service;

		if (!this.dbName) {
			/* istanbul ignore next */
			throw new ServiceSchemaError(
				"Missing `database` definition in DB adapter!"
			);
		}

		if (!this.containerName) {
			/* istanbul ignore next */
			throw new ServiceSchemaError(
				"Missing `container` definition in DB adapter!"
			);
		}
	}

	/**
	 * Connect to database
	 *
	 * @returns {Promise}
	 *
	 * @memberof CosmosDbAdapter
	 */
	async connect() {
		try {
			this.client = new CosmosClient(this.connection);

			const dbResponse = await this.client.databases.createIfNotExists(
				this.dbName
			);
			this.database = dbResponse.database;

			const containerResponse = await this.database.containers.createIfNotExists(
				this.containerName
			);
			this.container = containerResponse.container;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Disconnect from database
	 *
	 * @returns {Promise}
	 *
	 * @memberof CosmosDbAdapter
	 */
	async disconnect() {
		// ToDo: gracefully close connection with DB

		return Promise.resolve();
	}

	find(filters) {
		throw new Error("Method Not Implemented");
	}

	findOne(query) {
		throw new Error("Method Not Implemented");
	}

	findById(_id) {
		throw new Error("Method Not Implemented");
	}

	findByIds(idList) {
		throw new Error("Method Not Implemented");
	}

	count(filters = {}) {
		throw new Error("Method Not Implemented");
	}

	insert(entity) {
		throw new Error("Method Not Implemented");
	}

	insertMany(entities) {
		throw new Error("Method Not Implemented");
	}

	updateMany(query, update) {
		throw new Error("Method Not Implemented");
	}

	updateById(_id, update) {
		throw new Error("Method Not Implemented");
	}

	removeMany(query) {
		throw new Error("Method Not Implemented");
	}

	removeById(_id) {
		throw new Error("Method Not Implemented");
	}

	clear() {
		throw new Error("Method Not Implemented");
	}

	entityToObject(entity) {
		throw new Error("Method Not Implemented");
	}

	createCursor(params, isCounting) {
		throw new Error("Method Not Implemented");
	}

	transformSort(paramSort) {
		throw new Error("Method Not Implemented");
	}

	stringToObjectID(id) {
		throw new Error("Method Not Implemented");
	}

	objectIDToString(id) {
		throw new Error("Method Not Implemented");
	}

	beforeSaveTransformID(entity, idField) {
		throw new Error("Method Not Implemented");
	}

	afterRetrieveTransformID(entity, idField) {
		throw new Error("Method Not Implemented");
	}
}

module.exports = CosmosDbAdapter;
