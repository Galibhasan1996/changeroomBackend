import mongoose from "mongoose";



const preAdminLockerSchema = new mongoose.Schema(
    {
        sr_no: {
            type: Number,
            trim: true,
            unique: true,
        },
        code: {
            type: String,
            trim: true,
            default: ""
        },
        before: {
            type: String,
            trim: true,
            default: ""
        },
        locker_no: {
            type: String,
            trim: true,
            default: ""
        },
        name: {
            type: String,
            trim: true,
            default: ""
        },
        department: {
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
    },
    { timestamps: true }
);

preAdminLockerSchema.pre("save", async function (next) {
    if (!this.sr_no) {
        const lastLocker = await mongoose.model("preAdminlockerdata").findOne().sort({ sr_no: -1 });
        this.sr_no = lastLocker ? lastLocker.sr_no + 1 : 1;
    }
    next();
});



const preAdminLockerModel = mongoose.model("preAdminlockerdata", preAdminLockerSchema)


export default preAdminLockerModel


