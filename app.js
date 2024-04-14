const express = require("express")
const morgan = require("morgan")
const createError = require("http-errors")
require('dotenv').config()
require("./helpers/mongodb")
const AuthRoute = require("./routes/Auth.route")
const { verifyAccessToken } = require("./helpers/jwt")
require("./helpers/redis")

const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", verifyAccessToken, async (req, res, next) => {
    console.log(req.headers['authorization'])
    res.send("Hello World!")
})

app.use("/auth", AuthRoute)

// if route not present 
app.use(async (req, res, next) => {
    // // way 1
    // const error = new Error("Not found")
    // error.status = 404
    // next(error)

    // way 2
    next(createError.NotFound('This route does not exist'))
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})