const JobRequest = require('../models/JobRequest');

const getJobs = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const jobs = await JobRequest.find(filter);
    res.json(jobs);
  } catch (err) { next(err); }
};

const createJob = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

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

const updateJobStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const updated = await JobRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) { next(err); }
};

const deleteJob = async (req, res, next) => {
  try {
    const deleted = await JobRequest.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.status(204).send();
  } catch (err) { next(err); }
};

module.exports = { getJobs, createJob, getJobById, updateJobStatus, deleteJob };
