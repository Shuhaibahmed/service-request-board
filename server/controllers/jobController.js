const JobRequest = require('../models/JobRequest');

const getJobs = async (req, res, next) => {
  try {
    const jobs = await JobRequest.find();
    res.json(jobs);
  } catch (err) { next(err); }
};

const createJob = async (req, res, next) => {
  try {
    const job = new JobRequest(req.body);
    const saved = await job.save();
    res.status(201).json(saved);
  } catch (err) { next(err); }
};

const getJobById = async (req, res, next) => {
  try {
    const job = await JobRequest.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Not found' });
    res.json(job);
  } catch (err) { next(err); }
};

const updateJob = async (req, res, next) => {
  try {
    const updated = await JobRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { next(err); }
};

const deleteJob = async (req, res, next) => {
  try {
    await JobRequest.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};

module.exports = { getJobs, createJob, getJobById, updateJob, deleteJob };
