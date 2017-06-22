/**
 * Test starter - with this version of sails.js we can only start one sails server,
 * to solve this problem we use only one before All and after All to start and
 * stop the server
 */
var Sails = require('sails');
var _ = require('lodash');
var sinon = require("sinon");

global.DOMAIN = 'http://localhost';
global.PORT = 1420;
global.HOST = DOMAIN + ':' + PORT;

before(function(callback) {
  this.timeout(7000);

  var configs = {
    log: {
      level: 'info'
    },
    connections: {
      memory: {
        // lets use memory tests ...
        adapter   : 'sails-memory'
      }
    },
    models: {
      connection: 'memory'
    },
    port: PORT,
    environment: 'test',

    // @TODO needs suport to csrf token
    csrf: false,

    // we dont need this configs in API test
    hooks: {
      grunt: false,
      socket: false,
      pubsub: false
    }
  };

  Sails.load(configs, function(err, sails) {
    if (err) {
      console.error(err);
      return callback(err);
    }

    // here you can load fixtures, etc.
    callback(err, sails);

    // build-test-dataもどき
    //_.each(sails.models,function(model){
    //  model.build = function(params){
    //    return params;
    //  }
    //});
  });

  //global.sync = require("synchronize");
  //_.each(sails.models,function(model){
  //  _.map(model,function(attrValue,attrKey){
  //    if(typeof attrValue=="function"){
  //      model[attrKey+"Sync"]=sync(attrValue);
  //    }
  //  });
  //});
});

after(function(done) {
  // here you can clear fixtures, etc.
  sails.lower(done);
});
