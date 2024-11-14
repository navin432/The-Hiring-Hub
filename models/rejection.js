const mongoose = require("mongoose");

const rejectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  status: {
    type: String,
    default: "rejected",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Rejection = mongoose.model("Rejection", rejectionSchema);
module.exports = Rejection;
