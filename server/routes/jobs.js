import express from "express";
import JobRequest from "../models/JobRequest.js";

const router = express.Router();

// GET /api/jobs - List all jobs with optional filters
router.get("/", async (req, res, next) => {
  try {
    const { category, status, search } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;

    // Bonus: keyword search across title and description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const jobs = await JobRequest.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    next(error);
  }
});

// GET /api/jobs/:id - Get single job
router.get("/:id", async (req, res, next) => {
  try {
    const job = await JobRequest.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.status(200).json({ success: true, data: job });
  } catch (error) {
    // Handle invalid ObjectId
    if (error.name === "CastError") {
      return res.status(404).json({ success: false, message: "Job not found - invalid ID" });
    }
    next(error);
  }
});

// POST /api/jobs - Create a new job
router.post("/", async (req, res, next) => {
  try {
    const { title, description, category, location, contactName, contactEmail } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const job = await JobRequest.create({
      title,
      description,
      category,
      location,
      contactName,
      contactEmail,
    });

    res.status(201).json({ success: true, data: job });
  } catch (error) {
    // Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(", ") });
    }
    next(error);
  }
});

// PATCH /api/jobs/:id - Update status only
router.patch("/:id", async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Open", "In Progress", "Closed"];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const job = await JobRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.status(200).json({ success: true, data: job });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ success: false, message: "Job not found - invalid ID" });
    }
    next(error);
  }
});

// DELETE /api/jobs/:id - Delete a job
router.delete("/:id", async (req, res, next) => {
  try {
    const job = await JobRequest.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.status(200).json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ success: false, message: "Job not found - invalid ID" });
    }
    next(error);
  }
});

export default router;
