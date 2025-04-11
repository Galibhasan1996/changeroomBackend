import mongoose from "mongoose";



const lockerSchema = new mongoose.Schema(
    {
        sr_no: {
            type: Number,
            trim: true,
            default: ""
        },
        location: {
            type: String,
            trim: true,
            default: ""
        },
        locker_no: {
            type: String,
            trim: true,
            default: ""
        },
        unit: {
            type: String,
            trim: true,
            default: ""
        },
        code: {
            type: String,
            trim: true,
            default: ""
        },
        name: {
            type: String,
            trim: true,
            default: ""
        },
        role: {
            type: String,
            trim: true,
            default: ""
        },
        status: {
            type: String,
            trim: true,
            enum: ["active", "inactive"],
            default: "inactive",
        },
        mobile: {
            type: Number,
            default: 1234567899,
            validate: {
                validator: function (value) {
                    return /^[0-9]{10}$/.test(value);
                },
                message: "Mobile number must be exactly 10 digits",
            },
        },
        department: { type: String, trim: true, default: "" },
        combine: { type: String, trim: true, default: "" },
        shoe_size: {
            type: Number,
            default: 3,
            validate: {
                validator: function (value) {
                    return value >= 3 && value <= 12;
                },
                message: "Shoe size must be between 3 and 12",
            },
        },
        image: {
            public_id: { type: String, default: "" },
            url: { type: String, default: "" },
        },
        aadhar: {
            type: Number,
            default: 123456789123,
            validate: {
                validator: function (value) {
                    return /^[0-9]{12}$/.test(value);
                },
                message: "Aadhar number must be exactly 12 digits",
            },
        },
        address: { type: String, trim: true, default: "" },
        isLeft: {
            type: Boolean,
            default: false,
            trim: true
        }
    },
    { timestamps: true }
);

const lockerModel = mongoose.model("LockerData", lockerSchema)


export default lockerModel


