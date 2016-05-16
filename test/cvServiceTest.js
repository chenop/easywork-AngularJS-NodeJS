/**
 * Created by Chen on 08/01/2016.
 */
'use strict';

var CvService = require('../server/services/cvService');
var UserService = require('../server/services/userService');
var CvModel = require('../server/models/cv');
var utils = require('./testUtils');
var should = require('chai').should();

describe.only('Cv service', function () {
    this.timeout(utils.TIMEOUT);
    describe('CRUD operations', function () {
        describe('Create', function () {
            it('should return the CV after created', function () {
                var newCv = utils.createMockedCvPlainObject(["GUI", "JavaScript"]);
                var newUser = utils.createMockedUserPlainObject();

                return UserService.createUser(newUser)
                    .then(function(user) {
                        newCv.user = user;
                        return CvService.createCv(newCv)
                            .then(function (createdCv) {
                                // verify that the returned cv is what we expect
                                //createdCv.skills.should.not('Toluna');
                                createdCv.fileName.should.equal('cv.doc');
                                createdCv.user.should.to.not.be.null;
                            });
                    })
            });
        });

        describe('Read', function () {
            it('should get cv', function (done) {
                var newCv = utils.createMockedCvPlainObject(["GUI", "JavaScript"]);

                return CvService.createCv(newCv)
                    .then(function (createdCv) {
                        return CvService.getCv(createdCv.id)
                    })
                    .then(function (fetchedCv) {
                        // verify that the returned cv is what we expect
                        fetchedCv.fileName.should.equal('cv.doc');

                        return CvModel.count({'fileName': fetchedCv.fileName}).exec()
                            .then(function (count) {
                                count.should.equal(1);
                                done();
                            })
                    });
            });

            it('should get cvs', function (done) {
                var cv1 = utils.createMockedCvPlainObject(["GUI", "JavaScript"]);
                var cv2 = utils.createMockedCvPlainObject(["Java", "Web"]);

                return CvService.getCvs()
                    .then(function(cvs) {
                        return CvService.createCv(cv1)
                            .then(function() {
                                return CvService.createCv(cv2);
                            })
                            .then(CvService.getCvs)
                            .then(function (cvs) {
                                cvs.length.should.equal(2);
                                done();
                            });

                    })
            })
        })

        describe('Update', function () {
            it('should return the updated cv', function () {
                var newCv = utils.createMockedCvPlainObject(["GUI", "JavaScript"]);

                // First cal to create
                return CvService.createCv(newCv)
                    .then(function (createdCv) {
                        createdCv.skills.push("Java");

                        // Second call to update
                        return CvService.updateCv(createdCv)
                            .then(function (updatedCv) {
                                // verify that the returned cv is what we expect
                                updatedCv.skills.indexOf("Java").should.be.above(-1);

                                return CvModel.count().exec()
                                    .then(function (count) {
                                        count.should.equal(1);
                                    })
                            });
                    });
            });
        });

        describe('Delete', function () {
            it('should not found the deleted cv', function () {
                var newCv = utils.createMockedCvPlainObject(["GUI", "JavaScript"]);

                return CvService.createCv(newCv)
                    .then(function (createCv) {
                        return CvService.deleteCv(createCv._id);
                    })
                    .then(CvModel.count({}).exec()
                        .then(function (count) {
                            count.should.equal(0);
                        }));
            });
        });
    });
});

