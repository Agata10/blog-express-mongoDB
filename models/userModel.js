const mongoose = require('mongoose');
const Joi = require('joi');

//Joi schema
const emailSchema = Joi.object({
  email: Joi.string().email(),
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 4,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  img: {
    type: String,
    default: '/images/none-img.jpeg',
  },
});

// userSchema.methods.joiEmailValidate = function () {
//   const emailSchema = Joi.object({
//     email: Joi.string().email(),
//   });
//   return emailSchema.validate({ email: this.email });
// };

userSchema.pre('save', async function (next) {
  console.log('checking email');
  const validationResult = emailSchema.validate({ email: this.email });
  if (validationResult.error) {
    return next(new Error(validationResult.error.message));
  }
  next();
});

userSchema.static.getUsername = function () {
  return this.username;
};

module.exports = mongoose.model('User', userSchema);
