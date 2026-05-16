const express = require('express');
const router = express.Router();
const { getJobs, createJob, getJobById, updateJobStatus, deleteJob } = require('../controllers/jobController');

router.get('/', getJobs);
router.post('/', createJob);
router.get('/:id', getJobById);
router.patch('/:id', updateJobStatus);
router.delete('/:id', deleteJob);

module.exports = router;
