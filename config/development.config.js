"use strict";

module.exports = function (ROOT_PATH) {
    var config = {
        server: {
            port: 3000,
            hostname: 'localhost',
        },
        database: {
            url: 'mongodb://localhost:27017/mixpanel'
        }
    }
    return config;
}