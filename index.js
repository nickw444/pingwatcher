"use strict";

const HOST = process.env.CHECK_HOST
    , ES_URL = process.env.ES_URL || 'http://elasticsearch:9200'
    , ping = require ("net-ping")
    , elasticsearch = require('elasticsearch');
    ;

if (!HOST) {
  console.error("No host defined. Please specify env CHECK_HOST");
  process.exit(1)
}

let pingSession = ping.createSession();
let esclient = elasticsearch.Client({
  host: ES_URL
})

function getStatus() {
  pingSession.pingHost(HOST, function(error, target) {
    const isAlive = error === null;
    console.log("Alive: " + isAlive);
    esclient.index({
      index: 'host-watcher',
      type: 'document',
      body: {
        host: HOST,
        isAlive: isAlive? 1 : 0,
        '@timestamp': new Date(),
      }
    }, (err, resp) => {
      if (err) console.error("Error whilst talking to ES: ", err);
      // console.log(resp);
    });
  })
}

setInterval(getStatus, 5000);
getStatus();
