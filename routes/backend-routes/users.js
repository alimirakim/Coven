const bcrypt = require("bcryptjs")
const express = require("express")
const { check } = require("express-validator")
const {
  asyncHandler,
  handleValidationErrors,
  checkForUser
} = require("../../utils")
const { makeUserToken, requireAuthentication } = require("../../auth")
const { User, Story, Comment, Like, Bookmark, Follow } = require("../../db/models")
// const { values } = require("sequelize/types/lib/operators")
// const { Model } = require("sequelize/types")
const usersRouter = express.Router()

const nameValidators = [
  check("firstName")
    .exists({ checkFalsy: true })
    .withMessage("Please give us a first name.")
    .isLength({ min: 1, max: 40 })
    .withMessage("A first name must be between 1 to 40 characters in length."),
  check("lastName")
    .exists({ checkFalsy: true })
    .withMessage("Please give us a last name.")
    .isLength({ max: 40 })
    .withMessage("A last name can't be longer than 40 characters in length."),
]

const emailValidator = [
  check("email")
    .exists({ checkFalsy: true })
    .withMessage("Please give us an email.")
    .isEmail()
    .withMessage("Please give us a valid email address.")
    .isLength({ max: 80 })
    .withMessage("An email can't be longer than 80 characters in length.")
    .custom(async (val, { req }) => {
      let emailExists = await User.findOne({ where: { email: val } })
      if (emailExists) {
        throw new Error("Email is in use")
      }
    })
]
const passwordValidator = [
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please give us a password.")
    .isLength({ min: 10, max: 20 })
    .withMessage("A password must be between 10 to 20 characters in length.")
    .custom((val, { req }) => {
      if (val !== req.body.confirmPassword) {
        throw new Error('Passwords do not match')
      } else {
        return val;
      }
    }
    )
]

// Get User by id
usersRouter.get("/:id(\\d+)",
  asyncHandler(checkForUser),
  asyncHandler(async (req, res) => {
    res.json(req.user)
  })
)

// Create a new User.
usersRouter.post("/",
  nameValidators,
  emailValidator,
  passwordValidator,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({
      firstName, lastName, email, hashedPassword, bio: ""
    })
    const token = makeUserToken(newUser) // TODO Implement auth AFTER routes.
    res.status(201).json({ token, newUser })
  })
)

// Create a new JWT token for a user on login(?)
usersRouter.post("/token",
  asyncHandler(async (req, res, next) => {
    const { email, password } = req.body
    const user = await User.findOne({ where: { email } })
    if (!user || !user.validatePassword(password)) {
      const err = new Error("The login failed.")
      err.title = "401 Login Failed"
      err.status = 401
      err.errors = ["The provided credentials are INVALID."]
      return next(err)
    }
    const token = makeUserToken(user)
    await res.json({ token, user })
  })
)

// Edit User data by id.
usersRouter.patch("/:id(\\d+)",
  asyncHandler(checkForUser),
  nameValidators,
  emailValidator,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { firstName, lastName, bio, email } = req.body
    await req.user.update({ firstName, lastName, bio, email })
    res.json(req.user)
  })
)

// TODO MIRA How to handle changing passwords.

// Delete User by id
// TODO Test this soft delete idea.
// Existing user, dependencies: 500 Server Error, 'update or delete violates constraint'
usersRouter.delete("/:id(\\d+)",
  asyncHandler(checkForUser),
  asyncHandler(async (req, res) => {
    try {
      await req.user.destroy()
      res.status(204).end()
    } catch (err) {
      req.user.firstName = "(Deleted)"
      req.user.lastName = ""
      req.user.bio = ""
      req.user.email = "deleted@deleted.com"
      // req.password = 
      await req.user.save()
      res.status(204).end()
    }
  })
)



module.exports = usersRouter
