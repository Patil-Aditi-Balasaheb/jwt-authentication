const mongoose = require("mongoose")
const Schema = mongoose.Schema
const bcrypt = require("bcrypt")

// User schema
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

// Hashing password using bcrypt before saving the user
UserSchema.pre('save', async function (next) {
    try {
        // console.log("Called before saving a user")
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.password, salt)
        this.password = hashedPassword
        next()
    } catch (error) {
        next(error)
    }
})

// UserSchema.post('save', async function (next) {
//     try {
//         console.log("Called after saving a user")
//     } catch (error) {
//         next(error)
//     }
// })

// Method to check valid password
UserSchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw error
    }
}

const User = mongoose.model('user', UserSchema)

module.exports = User