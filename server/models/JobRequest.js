import mongoose from "mongoose";

const jobRequestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
    },
    category: {
      type: String,
      enum: ["Plumbing", "Electrical", "Painting", "Joinery", "Cleaning", "Gardening", "Other"],
      default: "Other",
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    contactName: {
      type: String,
      trim: true,
      default: "",
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
      default: "",
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Closed"],
      default: "Open",
    },
  },
  {
    timestamps: true, // auto-adds createdAt and updatedAt
  }
);

// Index for search
jobRequestSchema.index({ title: "text", description: "text" });

const JobRequest = mongoose.model("JobRequest", jobRequestSchema);

export default JobRequest;
