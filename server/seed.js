import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import JobRequest from "./models/JobRequest.js";

const sampleJobs = [
  {
    title: "Leaking kitchen tap needs urgent repair",
    description: "My kitchen tap has been leaking for 3 days. Water dripping constantly and causing water bill issues. Need a professional plumber ASAP.",
    category: "Plumbing",
    location: "Glasgow",
    contactName: "James MacDonald",
    contactEmail: "james.mac@email.com",
    status: "Open",
  },
  {
    title: "Electrical socket not working in living room",
    description: "Three electrical sockets in my living room have stopped working after a power surge. Need an electrician to inspect and repair.",
    category: "Electrical",
    location: "Edinburgh",
    contactName: "Sarah Connor",
    contactEmail: "sarah.c@email.com",
    status: "In Progress",
  },
  {
    title: "Full house interior painting needed",
    description: "Looking for a painter to repaint the entire interior of a 3-bedroom flat. Walls and ceilings only. Paint will be provided.",
    category: "Painting",
    location: "Manchester",
    contactName: "Tom Bridges",
    contactEmail: "tom.b@email.com",
    status: "Open",
  },
  {
    title: "Garden fence repair after storm damage",
    description: "The storm last weekend knocked down two panels of my garden fence. Need a joiner to replace the damaged panels and reinforce the rest.",
    category: "Joinery",
    location: "Bristol",
    contactName: "Emma Wilson",
    contactEmail: "emma.w@email.com",
    status: "Open",
  },
  {
    title: "Deep clean needed for 2-bed flat",
    description: "Moving out of my flat next week and need a thorough deep clean including carpets, kitchen appliances, bathrooms, and windows.",
    category: "Cleaning",
    location: "London",
    contactName: "Ahmed Hassan",
    contactEmail: "ahmed.h@email.com",
    status: "Closed",
  },
  {
    title: "Bathroom ceiling light fitting replacement",
    description: "Old bathroom ceiling light has gone. The fitting itself is broken and needs replacing entirely. Bathroom is upstairs.",
    category: "Electrical",
    location: "Glasgow",
    contactName: "Patricia Lowe",
    contactEmail: "p.lowe@email.com",
    status: "Open",
  },
  {
    title: "Overgrown garden needs full clearance",
    description: "Back garden has not been tended to in 2 years. Full of weeds, overgrown bushes, and dead plants. Need complete clearance and basic tidying.",
    category: "Gardening",
    location: "Leeds",
    contactName: "Robert Park",
    contactEmail: "r.park@email.com",
    status: "Open",
  },
];

const seedDatabase = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not set in .env file");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Clear existing data
    await JobRequest.deleteMany({});
    console.log("🗑️  Cleared existing jobs");

    // Insert sample data
    const inserted = await JobRequest.insertMany(sampleJobs);
    console.log(`✅ Seeded ${inserted.length} sample jobs successfully`);

    await mongoose.disconnect();
    console.log("👋 Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
};

seedDatabase();
