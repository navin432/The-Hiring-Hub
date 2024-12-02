const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// Routes
const users = require("./routes/users");
const auth = require("./routes/auth");
const jobs = require("./routes/jobs");
const jobApplication = require("./routes/jobApplications");
const resetCode = require("./routes/resetCode");
const availability = require("./routes/availabilities");
const onboarding = require("./routes/hire");
const profile = require("./routes/userProfiles");
const onBoardData = require("./routes/userDataOnBoard");
const employee = require("./routes/employeeRoutes");
const training = require("./routes/trainings");

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
app.use("/api/availability", availability);
app.use("/hire", onboarding);
app.use("/onboarding-data", onBoardData);
app.use("/api/employeeRating", employee);
app.use("/api/training", training);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
