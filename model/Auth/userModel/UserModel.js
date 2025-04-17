import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { customConsole } from "../../../util/Util.js";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        trim: true,
    },
    mobile: {
        type: String,
        required: [true, "mobile is required"],
        trim: true,
    },
    password: {
        type: String,
        required: [true, "password is required"],
        trim: true,
    },
    dateOfBirth: {
        type: String,
        required: [true, "date of birth is required"],
        trim: true,
    },

    isAdmin: {
        type: Boolean,
        default: false
    },
    verified: {
        type: Boolean,
        default: false,
    },
    verificationToken: String,
}, {
    timestamps: true
})

userSchema.pre("save", async function (next) {
    customConsole("Before Save password from user model", this.password)

    if (!this.isModified("password")) {
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10)
    customConsole("After Save password from user model", this.password)
    next()
})



const UserModel = mongoose.model("User", userSchema)

export default UserModel







