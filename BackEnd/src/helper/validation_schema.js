const joi = require("joi")
const { joiPassword } = require("joi-password")
module.exports.registerSchema = joi.object({
  username: joi.string().min(6).max(45).alphanum().required(),

  email: joi.string().email().required(),

  password: joiPassword.string()
    .min(8)
    .max(45)
    .minOfSpecialCharacters(1)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .required(),
  re_password: joi.valid(joi.ref("password")).messages({
    "any.only": "Password must match"
  })
})

module.exports.loginSchema = joi.object({
  login: joi.alternatives().try(
    joi.string().min(6).max(45).alphanum(), joi.string().email()
  ).required(),
  password: joi.string()
    .required()
})

module.exports.editSchema = joi.object({
  username: joi.string().min(6).max(45).alphanum().required(),
  fullname: joi.string().min(6).max(45).required(),
  bio: joi.string().min(10).max(255).required(),

})

module.exports.storySchema = joi.object({
  content: joi.string().required()
})