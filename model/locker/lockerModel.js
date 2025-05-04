import mongoose from "mongoose";



const lockerSchema = new mongoose.Schema(
    {
        sr_no: {
            type: Number,
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
            required: [true, "Employer is required"],
            trim: true,
            set: value => value?.toUpperCase(),
            validate: {
                validator: function (value) {
                    const allowedEmployers = [
                        "NEEM", "NAPS", "TDS", "SSD", "CHAUDHARY", "LOREAL", "PERFECT SERVICE", "FM", "SIS", "RKS",
                    ];
                    return allowedEmployers.includes(value.toUpperCase());
                },
                message: "Invalid employer value"
            }
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
        department: {
            type: String,
            required: [true, "Department is required"],
            trim: true,
            set: value => value?.toUpperCase(),
            validate: {
                validator: function (value) {
                    const allowedEmployers = [
                        "FLOW", "STORE", "OPERATOR", "SUPERVISOR",
                        "HOUSEKEEPING", "MAINTENANCE", "MFG", "QUALITY", "ADMIN", "HR", "PRODUCTION",
                        "FINANCE", "SAFETY", "ACCOUNT", "PROJECT", "IT", "MSC", "SECURITY", "UTILITY",
                        "BOILER", "ETP", "PACKING", "LOADING",
                        "CHANGEROOM", "CONTRECTOR",
                    ];
                    return allowedEmployers.includes(value.toUpperCase());
                },
                message: "Invalid department value"
            }
        },
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
            public_id: {
                type: String,
                default: ""
            },
            url: {
                type: String,
                default: ""
            },
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
        }
    },
    { timestamps: true }
);

const lockerModel = mongoose.model("LockerData", lockerSchema)


export default lockerModel


