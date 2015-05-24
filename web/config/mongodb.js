'use strict';

var config = require('./config'),
    Db = require('mongodb').Db,
    Server = require('mongodb').Server,
    Connection = require('mongodb').Connection;

module.exports = function() {
  var db = new Db(config.dbname, new Server(config.dbserver, config.dbport), {safe: false, native_parser: false});
  db.open(function(err, db) {
    if (err) throw err;
  });

  return db;
}
