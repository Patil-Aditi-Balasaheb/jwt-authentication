const express = require("express")
const router = express.Router()
const createError = require("http-errors")
const User = require("../models/User.model")
const { authSchema } = require("../helpers/validation_schema")
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../helpers/jwt")

router.post("/register", async (req, res, next) => {
    try {
        // const { email, password } = req.body
        // if (!email || !password) throw createError.BadRequest()

        // Request body validation using JOI validation schema
        const result = await authSchema.validateAsync(req.body)

        // Check user in DB whether exists already
        const doesExist = await User.findOne({ email: result.email })
        if (doesExist) throw createError.Conflict(`${result.email} is already been registered`)

        // Create new user
        const user = new User(result)
        const savedUser = await user.save()

        // Generate jwt access token
        const accessToken = await signAccessToken(savedUser.id)

        // Generate jwt refresh token
        const refreshToken = await signRefreshToken(savedUser.id)

        // Send the access token and refresh token as response
        res.send({ accessToken, refreshToken })
    } catch (error) {
        if (error.isJoi === true) error.status = 422
        next(error)
    }
})

router.post("/login", async (req, res, next) => {
    try {
        // Request body validation using JOI validation schema
        const result = await authSchema.validateAsync(req.body)

        // Find user in DB
        const user = await User.findOne({ email: result.email })
        if (!user) throw createError.NotFound("User not registered.")

        // Check password validity
        const isMatch = await user.isValidPassword(result.password)
        if (!isMatch) throw createError.Unauthorized("Username/Password not valid.")

        // Generate jwt access token
        const accessToken = await signAccessToken(user.id)

        // Generate jwt refresh token
        const refreshToken = await signRefreshToken(user.id)

        // Send the access token and refresh token as response
        res.send({ accessToken, refreshToken })
    } catch (error) {
        if (error.isJoi === true) return next(createError.BadRequest("Invalid Username/Password."))
        next(error)
    }
})

router.post("/refresh-token", async (req, res, next) => {
    try {
        const { refreshToken } = req.body
        if (!refreshToken) throw createError.BadRequest()

        // Verify the refresh token
        const userId = await verifyRefreshToken(refreshToken)

        // Generate new jwt access token
        const accessToken = await signAccessToken(userId)

        // Generate new jwt refresh token
        const refToken = await signRefreshToken(userId)

        // Send the access token and refresh token as response
        res.send({ accessToken, refreshToken: refToken })
    } catch (error) {
        next(error)
    }
})

router.delete("/logout", async (req, res, next) => {
    res.send("logout route")
})

module.exports = router