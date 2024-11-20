const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// Adding Comment for Testing

// Routes
const users = require("./routes/users");
const auth = require("./routes/auth");
const jobs = require("./routes/jobs");
const jobApplication = require("./routes/jobApplications");
const resetCode = require("./routes/resetCode");
const userProfiles = require("./routes/userProfiles");
const availability = require("./routes/availabilities");
const hr = require("./routes/hr");
const onboarding= require("./utils/sendOnboardingEmail");
const profile= require("./routes/userProfiles");
const tasks= require("./routes/tasks");

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect("mongodb://localhost/theHiringHub")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDb", err));

// Routes
app.use(express.static("public"));
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/jobs", jobs);
app.use("/api/jobapplications", jobApplication);
app.use("/api/forgotpassword", resetCode);
app.use("/api/profiles", profile);
app.use("/api/availability",availability);
app.use("/hire",onboarding);
// app.use("/hire",hr);
app.use("/complete-task",tasks);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
