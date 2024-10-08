const express = require("express");
const app = express();
const mongoose = require("mongoose");

// Routes
const users = require("./routes/users");
const auth = require("./routes/auth");

app.use(express.json());

mongoose
  .connect("mongodb://localhost/theHiringHub")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDb", err));

// Routes
app.use(express.static("public"));
app.use("/api/users", users);
app.use("/api/auth", auth);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
