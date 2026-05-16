const express = require('express');
const router = express.Router();
const { getJobs, createJob, getJobById, updateJob, deleteJob } = require('../controllers/jobController');

router.get('/', getJobs);
router.post('/', createJob);
router.get('/:id', getJobById);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

module.exports = router;
