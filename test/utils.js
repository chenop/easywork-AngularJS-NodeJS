/**
 * Created by Chen on 08/01/2016.
 */
'use strict';


//  Modified from https://github.com/elliotf/mocha-mongoose


//var config = require('../config');
var mongoose = require('mongoose');


// ensure the NODE_ENV is set to 'test'
// this is helpful when you would like to change behavior when testing
process.env.NODE_ENV = 'test';


beforeEach(function (done) {


    function clearDB() {
        for (var i in mongoose.connection.collections) {
            mongoose.connection.collections[i].remove(function() {});
        }
        return done();
    }


    if (mongoose.connection.readyState === 0) {
        mongoose.connect("mongodb://chenop:selavi99@ds039185.mongolab.com:39185/heroku_hjgps9xv", function (err) {
            if (err) {
                throw err;
            }
            return clearDB();
        });
    } else {
        return clearDB();
    }
});


afterEach(function (done) {
    mongoose.disconnect();
    return done();
});

function createMockedUserPlainObject() {
    var newUser = {
        email: 'chenop@gmail.com'
        , name: "Chen"
        , username: "chenop"
        , password: "123456"
        , role: "JobSeeker"
        //, skills: {"GUI", "AngularJS"}
    };
    return newUser;
}

module.exports = {
    createMockedUserPlainObject: createMockedUserPlainObject
}