import mongoose from "mongoose";



const previouslockerSchema = new mongoose.Schema(
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
            enum: ["active", "inactive"], // Define valid status values if applicable
            default: "inactive",
        },
        mobile: {
            type: Number,
            default: 1234567899,
            validate: {
                validator: function (value) {
                    return /^[0-9]{10}$/.test(value); // Ensures exactly 10 digits
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
                    return value >= 3 && value <= 12; // Ensures shoe_size is between 3-12
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
                    return /^[0-9]{12}$/.test(value); // Ensures exactly 12 digits
                },
                message: "Aadhar number must be exactly 12 digits",
            },
        },
        address: { type: String, trim: true, default: "" },
    },
    { timestamps: true }
);

const previouslockerModel = mongoose.model("previouslocker", previouslockerSchema)


export default previouslockerModel


