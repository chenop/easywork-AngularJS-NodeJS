/**
 * Created by Chen on 08/01/2016.
 */
'use strict';


//  Modified from https://github.com/elliotf/mocha-mongoose


//var config = require('../config');
var mongoose = require('mongoose');
var fs = require('fs');
var mime = require('mime');
var CompanyModel = require('../server/models/company');
var UserModel = require('../server/models/user');
var JobModel = require('../server/models/job');
var CvModel = require('../server/models/cv');

var UserService = require('../server/services/userService');

// ensure the NODE_ENV is set to 'test'
// this is helpful when you would like to change behavior when testing
//console.log("process.env.NODE_ENV: " + process.env.NODE_ENV);
process.env.NODE_ENV = 'test';
var config = require('../server/config');

var TIMEOUT = 20000;

beforeEach(function (done) {
	this.timeout(TIMEOUT);

	// First try to empty database - very slow
	//mongoose.connect(config.dbUrl, function () {
	//    mongoose.connection.db.dropDatabase(function () {
	//        done();
	//    })
	//});

	// Second try to empty database - faster
	function clearDB() {
		if (process.env.NODE_ENV !== "test")
			throw new Error("Error! - working on env which is not test environment is not allowed!!!");
		if (config.dbUrl !== config.TEST_DB_URL)
			throw new Error("Error! - clear DB which is not test db is not allowed!!!");

		var promises = [
			CompanyModel.remove().exec(),
			UserModel.remove().exec(),
			JobModel.remove().exec(),
			CvModel.remove().exec()
		];

		Promise.all(promises)
			.then(function () {
				return createAdminUser();
			})
			.then(function () {
				done();
			});
	}

	if (mongoose.connection.readyState === 0) {
		mongoose.connect(config.dbUrl, function (err) {
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

function getAdminUser() {
	return {
		email: 'admin@gmail.com',
		role: 'admin',
		password: "123456"
	};
}

function getJobProviderUser() {
	return {
		email: 'jobProvider@gmail.com',
		role: 'jobProvider',
		password: "123456"
	};
}

function createAdminUser() {
	var promises = [
		UserService.createUser(getAdminUser())
	];

	return Promise.all(promises);
}

function createMockedUserPlainObject() {
	var newUser = {
		email: 'chenop@gmail.com'
		, name: "Chen"
		, username: "chenop"
		, password: "123456"
		, role: "JobSeeker"
	};
	return newUser;
}

function createMockedJobPlainObject(name, skills) {
	return {
		name: name
		, code: "111222"
		, city: "Haifa"
		, description: "Job of my dreams"
		, skills: (!skills) ? ["AngularJS"] : skills
	};
}

function createMockedCompanyPlainObject(name) {
	var newCompany = {
		name: name
		, locations: [{
			street: "Matam 1"
			, city: "Haifa"
		}]
		, addresses: "Matam 1"
		, email: "chen.oppenhaim@toluna.com"
	};
	return newCompany;
}

function createMockedCvPlainObject(skills, fileName) {
	var fileName = fileName || "test-cv.docx";
	var buffer = fs.readFileSync('./test/cvs/' + fileName);
	var fileType = mime.lookup('./test/cvs/' + fileName);
	var newCv = {
		fileName: fileName
		, fileData: fileType + ',' + buffer.toString('base64')
		, skills: skills
	}

	return newCv;
}

module.exports = {
	createMockedUserPlainObject: createMockedUserPlainObject
	, createMockedJobPlainObject: createMockedJobPlainObject
	, createMockedCompanyPlainObject: createMockedCompanyPlainObject
	, createMockedCvPlainObject: createMockedCvPlainObject
	, TIMEOUT: TIMEOUT
	, getAdminUser: getAdminUser
	, getJobProviderUser: getJobProviderUser
}