/**
 * Created by Chen on 09/01/2016.
 */

var Job     = require('../models/job')

/***********
 * Public
 ***********/
module.exports = {
    // TODO seperate create and update
    createOrUpdateJob: createOrUpdateJob
    , deleteJob: deleteJob
    , getJob: getJob
    , getJobs: getJobs
}

/***********
 * Private
 ***********/
function createOrUpdateJob(job) {
    var jobInstance = createJobInstance(job);

    var upsertJob = jobInstance.toObject();
    delete upsertJob._id;
    return Job.findOneAndUpdate({'code': job.code}, upsertJob, {upsert: true, new: true}).exec();
}

function createJobInstance(job) {
    var newJob = new Job(
        {
            name: job.name
            , code: job.code
            , city: job.city
            , description: job.description
        }
    );

    return newJob;
}

function deleteJob(id) {
    return Job.findById(id).exec()
        .then(function (job) {
            if (job == undefined || job == null)
                return;

            return job.remove();
        });
}

function getJob(jobId) {
    return Job.findById(jobId).exec();
}

function getJobs() {
    return Job.find().exec();
}

