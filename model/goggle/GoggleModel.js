import mongoose from "mongoose";


const goggleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,

    },
    emp_code: {
        type: String,
        required: [true, "Employee code is required"],
        trim: true,
    },
    employer: {
        type: String,
        required: [true, "Employer is required"],
        trim: true,
        validate: {
            validator: function (value) {
                const allowedEmployers = [
                    "NEEM", "NAPS", "TDS", "SSD", "CHAUDHARY", "LOREAL", "PERFECT SERVICE", "FM", "SIS"
                ];
                return allowedEmployers.includes(value.toUpperCase());
            },
            message: "Invalid employer value"
        }
    },
    department: {
        type: String,
        required: [true, "Department is required"],
        trim: true,
        validate: {
            validator: function (value) {
                const allowedEmployers = [
                    "FLOW", "STORE", "OPERATOR", "SUPERVISOR",
                    "HOUSEKEEPING", "MAINTENANCE", "MFG", "QUALITY", "ADMIN", "HR", "PRODUCTION",
                    "FINANCE", "SAFETY", "ACCOUNT", "PROJECT", "IT", "MSC", "SECURITY", "UTILITY",
                    "BOILER", "ETP", "PACKING", "SALES", "PURCHASE", "WAREHOUSE", "LOGISTICS",
                    "CHANGEROOM", "LEGAL", "CUSTOMER SERVICE", "MARKETING", "PUBLIC RELATIONS",
                    "R&D", "TRAINING", "CORPORATE COMMUNICATIONS", "BUSINESS DEVELOPMENT",
                    "PROCUREMENT", "AUDIT", "LEGAL & COMPLIANCE", "SUPPLY CHAIN", "CSR", "MEDIA",
                    "REGULATORY AFFAIRS", "INVESTOR RELATIONS", "TAX", "ADMINISTRATIVE SUPPORT"
                ];
                return allowedEmployers.includes(value.toUpperCase());
            },
            message: "Invalid department value"
        }
    },
    issue_quantity: {
        type: Number,
        required: [true, "Issue quantity is required"],
    },
    date: {
        type: Date,
        // required: [true, "Date is required"],
        default: Date.now,
    },
}, {
    timestamps: true,
    capped: { size: 1024 * 1024, max: 1000 },
});



const goggleModel = mongoose.model("Goggle", goggleSchema)

export default goggleModel