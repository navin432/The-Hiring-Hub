const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    minlength: 6,
    maxlength: 254,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  role: {
    type: String,
    default: "guest",
    minlength: 3,
    maxlength: 20,
  },
  resetCode: {
    type: Number,
  },
});

const User = mongoose.model("User", userSchema);
function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(4).max(50).required(),
    email: Joi.string().min(6).max(254).required().email(),
    password: Joi.string().min(6).max(254).required(),
    role: Joi.string().min(3).max(20),
  });
  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
