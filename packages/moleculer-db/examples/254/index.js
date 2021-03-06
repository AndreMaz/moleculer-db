"use strict";

const { ServiceBroker } = require("moleculer");
const DbService = require("../../index");
const MongoDBAdapter = require("../../../moleculer-db-adapter-mongo");

const broker = new ServiceBroker({
    validation:true,
    logger: {
      type: 'Console',
      options: {
        level: 'debug',
      }
    },
   
});


broker.createService({
  name:"service1",
  mixins:[DbService],
  // add the mongo adapter and you will see the issue
  adapter: new MongoDBAdapter("mongodb://localhost:27017",{useNewURrlParser:true},"adb"),
  collection:"service1",
  settings:{
    idField:"id",
    fields:["id","name","service2Items"],
    entityValidator:{
      name:"string",
      service2Items:"array"
    },
    populates:{
      "service2Items":"service2.get"
    }
  }
});

broker.createService({
  name:"service2",
  mixins:[DbService],
  // add the mongo adapter and you will see the issue
  adapter: new MongoDBAdapter("mongodb://localhost:27017",{useNewURrlParser:true},"adb"),
  collection:"service2",
  settings:{
    idField:"id",
    fields:["id","name"],
    entityValidator:{
      name:"string"
    }
  }
});

let idA,idB,idX

broker
	.start()
	.then(() => broker.call("service2.create", { name: "A" }))
	.then((res) => {
		idA = res.id;
		console.log(res);
	})
	.then(() => broker.call("service2.create", { name: "B" }))
	.then((res) => {
		idB = res.id;
		console.log(res);
	})
	.then(() =>
		broker.call("service1.create", { name: "X", service2Items: [idA, idB] })
	)
	.then((res) => {
		idX = res.id;
		console.log(res);
	})
	.then(() =>
		broker.call("service1.get", { id: idX, populate: "service2Items" })
	)
	.then((output) => {
        console.log('______________Output______________')
		console.log(output);
	});