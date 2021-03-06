/**
 * Created by Chen on 08/01/2016.
 */
'use strict';

var UserService = require('../server/services/userService');
var CvService = require('../server/services/cvService');
var UserModel = require('../server/models/user');
var config = require('../server/config');
var jwt  = require('jsonwebtoken');
var utils = require('./testUtils');
var should = require('chai').should();
var expect = require('chai').expect;

describe('User service - Testing CRUD operations', function () {
    this.timeout(utils.TIMEOUT);
    describe('Create', function () {
        it('should return the user after created', function () {
            var newUser = utils.createMockedUserPlainObject();

            return UserService.createUser(newUser)
                .then(function (createdUser) {
                    // verify that the returned user is what we expect
                    createdUser.name.should.equal('Chen');
                    createdUser.username.should.equal('chenop');
                });
        });
    });

    describe('Read', function () {
        it('should get user', function (done) {
            var newUser = utils.createMockedUserPlainObject();

            return UserService.createUser(newUser)
                .then(function(createdUser) {
                    return UserService.getUser(createdUser.id)
                })
                .then(function(fetchedUser){
                    // verify that the returned user is what we expect
                    fetchedUser.name.should.equal('Chen');
                    fetchedUser.username.should.equal('chenop');

                    return UserModel.count({'email': fetchedUser.email}).exec()
                        .then(function (count) {
                            count.should.equal(1);
                            done();
                        })
                });
        });
    })

    describe('Update', function () {
        it('should return the updated user', function () {
            var newUser = utils.createMockedUserPlainObject();

            // First cal to create
            return UserService.createUser(newUser)
                .then(function (createdUser) {
                    createdUser.name = "Chen Update";

                    // Second call to update
                    return UserService.updateUser(createdUser)
                        .then(function (updatedUser) {
                            // verify that the returned user is what we expect
                            updatedUser.name.should.equal('Chen Update');

                            return UserModel.count({role: "JobSeeker"}).exec()
                                .then(function (count) {
                                    count.should.equal(1);
                                })
                        });
                });
        });
    });

    describe('Delete', function () {
        it('should not found the deleted user', function () {
            var newUser = utils.createMockedUserPlainObject();

            return UserService.createUser(newUser)
                .then(function(createUser) {
                    return UserService.deleteUser(createUser._id);
                })
                .then(UserModel.count({'email': newUser.email}).exec()
                    .then(function (count) {
                        count.should.equal(0);
                    }));
        });
    });
});

describe("Others", function () {
    it("getCvByUserId", function(done) {
        var newCv = utils.createMockedCvPlainObject(["GUI", "JavaScript"]);
        var newUser = utils.createMockedUserPlainObject(true);

        return CvService.createCv(newCv)
            .then(function(createdCv) {
                return UserService.createUser(newUser)
                    .then(function(createdUser) {
                        createdUser.cv = createdCv;

                        return createdUser.save();
                    })
                    .then(function(savedUser) {
                        return UserService.getCvByUserId(savedUser._id)
                            .then(function(cv) {
                                cv.should.not.be.null;
                                expect(cv.fileName).to.equal(newCv.fileName);
                                done();
                            })
                    });
            })
    });

    it("authenticate", function(done) {
        function prepareToken(user) {
            return jwt.sign(user, config.secret);
        }

        var user = utils.createMockedUserPlainObject();
        var token = prepareToken(user);

        var decoded = jwt.verify(token, config.secret);
        decoded.should.not.be.null;
        done();
    })
});
