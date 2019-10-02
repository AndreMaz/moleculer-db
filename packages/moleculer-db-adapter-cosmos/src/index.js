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
	disconnect() {
		return Promise.resolve();
	}

	find(filters) {
		// throw new Error("Method Not Implemented");
		return this.createCursor(filters);
	}

	findOne(query) {
		throw new Error("Method `findOne` Not Implemented");
	}

	async findById(_id) {
		// throw new Error("Method `findById` Not Implemented");
		try {
			const readResponse = await this.container.item(_id).read();
			if (readResponse.statusCode === 404) return;

			return response.resource;
		} catch (error) {
			throw error;
		}
	}

	/**
	 *
	 * @param {Array} idList
	 */
	async findByIds(idList) {
		// throw new Error("Method `findByIds` Not Implemented");
		const ids = idList.map(elem => `"${elem}"`).join(",");

		const q = {
			query: `SELECT * FROM c WHERE c.id IN (${ids})`,
			parameters: []
		};

		const response = await this.container.items.query(q).fetchAll();
		return response.resources;
	}

	count(filters = {}) {
		throw new Error("Method `count` Not Implemented");
	}

	async insert(entity) {
		try {
			const response = await this.container.items.create(entity);
			return response.resource;
		} catch (error) {
			throw error;
		}
	}

	insertMany(entities) {
		throw new Error("Method `insertMany` Not Implemented");
	}

	updateMany(query, update) {
		throw new Error("Method `updateMany` Not Implemented");
	}

	updateById(_id, update) {
		throw new Error("Method `updateById` Not Implemented");
	}

	removeMany(query) {
		throw new Error("Method `removeMany` Not Implemented");
	}

	async removeById(_id) {
		try {
			const readResponse = await this.container.item(_id).read();
			if (readResponse.statusCode === 404) return;

			const delResponse = await this.container.item(_id).delete();
			if (delResponse.statusCode === 404) return;

			return response.resource;
		} catch (error) {
			throw error;
		}
	}

	clear() {
		throw new Error("Method `clear` Not Implemented");
	}

	entityToObject(entity) {
		// throw new Error("Method Not Implemented");
		return entity;
	}

	async createCursor(params = {}, isCounting) {
		const q = {
			query: params.query || "SELECT * from c", // By default get everything
			parameters: []
		};

		const response = await this.container.items.query(q).fetchAll();
		return response.resources;
	}

	transformSort(paramSort) {
		throw new Error("Method `transformSort` Not Implemented");
	}

	stringToObjectID(id) {
		throw new Error("Method `stringToObjectID` Not Implemented");
	}

	objectIDToString(id) {
		throw new Error("Method `objectIDToString` Not Implemented");
	}

	beforeSaveTransformID(entity, idField) {
		return entity;
		// throw new Error("Method `beforeSaveTransformID` Not Implemented");
	}

	afterRetrieveTransformID(entity, idField) {
		// throw new Error("Method Not Implemented");
		return entity;
	}
}

module.exports = CosmosDbAdapter;
