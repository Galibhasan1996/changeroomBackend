import { validationResult } from "express-validator";
import goggleModel from "../../model/goggle/GoggleModel.js";
import { customConsole } from "../../util/Util.js";
import shoeModel from "../../model/shoe/ShoeModel.js";
import mongoose from "mongoose";





export const goggleController = async (req, res) => {
    try {
        let { page, limit, sort, sortOrder, search, startDate, endDate } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 30;
        sort = sort || "date";
        sortOrder = sortOrder === "asc" ? 1 : -1;

        const skip = (page - 1) * limit;

        let searchCriteria = {};

        // Search filter
        if (search) {
            searchCriteria.$or = [
                { name: { $regex: search, $options: "i" } },
                { emp_code: { $regex: search, $options: "i" } },
                { department: { $regex: search, $options: "i" } },
            ];
        }

        // Date range filter
        // if (startDate && endDate) {
        //     searchCriteria.date = {
        //         $gte: new Date(startDate),
        //         $lte: new Date(endDate),
        //     };
        // }

        // if (startDate || endDate) {
        //     let dateFilter = {};
        //     if (startDate && !isNaN(Date.parse(startDate))) {
        //         dateFilter.$gte = new Date(startDate);
        //     }

        //     if (endDate && !isNaN(Date.parse(endDate))) {
        //         dateFilter.$lte = new Date(endDate);
        //     }
        //     if (Object.keys(dateFilter).length) {
        //         searchCriteria.date = dateFilter;
        //     }
        //     console.log("🚀 ~ goggleController.js:98 ~ goggleController ~ dateFilter:", dateFilter)
        // }


        const goggles = await goggleModel.find(searchCriteria)
            .skip(skip)
            .limit(limit)
            .sort({ [sort]: sortOrder });

        const totalGoggle = await goggleModel.countDocuments(searchCriteria);

        if (!goggles.length) {
            return res.status(404).json({
                success: false,
                message: "No goggles found",
            });
        }

        return res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: Math.ceil(totalGoggle / limit),
            totalGoggleCount: totalGoggle,
            perPage: limit,
            message: "Goggles fetched successfully",
            goggles,
        });

    } catch (error) {
        console.error("🚀 ~ goggleController.js: Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};



// ----------create ------------------------
export const goggleCreateController = async (req, res) => {
    try {

        const { name, emp_code, employer, department, issue_quantity } = req.body

        // Validate the request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // If there are validation errors, return them
            return res.status(400).json({ errors: errors.array() });
        }

        const goggle = await goggleModel.create({
            name,
            emp_code,
            employer,
            department,
            issue_quantity,
        })
        return res.status(200).json({
            success: true,
            message: "goggle created successfully",
            goggle,
        });

    } catch (error) {
        customConsole("🚀 ~ goggleController.js:57 ~ goggleCreateController ~ error:", error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}

export const shoeController = async (req, res) => {
    try {
        let { page, limit, sort, sortOrder, search, startDate, endDate } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 30;
        sort = sort || "date";
        sortOrder = sortOrder === "asc" ? 1 : -1;

        const skip = (page - 1) * limit;

        let searchCriteria = {};

        // Search filter
        if (search) {
            searchCriteria.$or = [
                { name: { $regex: search, $options: "i" } },
                { emp_code: { $regex: search, $options: "i" } },
                { department: { $regex: search, $options: "i" } },
            ];
        }

        // Date range filter
        // if (startDate && endDate) {
        //     searchCriteria.date = {
        //         $gte: new Date(startDate),
        //         $lte: new Date(endDate),
        //     };
        // }

        // if (startDate || endDate) {
        //     let dateFilter = {};
        //     if (startDate && !isNaN(Date.parse(startDate))) {
        //         dateFilter.$gte = new Date(startDate);
        //     }

        //     if (endDate && !isNaN(Date.parse(endDate))) {
        //         dateFilter.$lte = new Date(endDate);
        //     }
        //     if (Object.keys(dateFilter).length) {
        //         searchCriteria.date = dateFilter;
        //     }
        //     console.log("🚀 ~ goggleController.js:98 ~ goggleController ~ dateFilter:", dateFilter)
        // }


        const shoe = await shoeModel.find(searchCriteria)
            .skip(skip)
            .limit(limit)
            .sort({ [sort]: sortOrder });

        const totalShoe = await shoeModel.countDocuments(searchCriteria);

        if (!shoe.length) {
            return res.status(404).json({
                success: false,
                message: "No shoe found",
            });
        }

        return res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: Math.ceil(totalShoe / limit),
            totalShoeCount: totalShoe,
            perPage: limit,
            message: "shoe fetched successfully",
            shoe,
        });

    } catch (error) {
        console.log("🚀 ~ goggleController.js:199 ~ shoeController ~ error:", error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

export const shoeCreateController = async (req, res) => {
    try {

        const { name, emp_code, employer, department, issue_quantity, mobile, shoe_size } = req.body

        // Validate the request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // If there are validation errors, return them
            return res.status(400).json({ errors: errors.array() });
        }

        const shoe = await shoeModel.create({
            name,
            emp_code,
            employer,
            department,
            issue_quantity,
            mobile,
            shoe_size
        })
        return res.status(200).json({
            success: true,
            message: "shoe created successfully",
            shoe,
        });

    } catch (error) {
        console.log("🚀 ~ goggleController.js:236 ~ shoeCreateController ~ error:", error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}



// ------------shoe delete controller----------------

export const shoeDeleteController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Shoe ID is required",
            });
        }

        const trimmedId = id.trim();

        if (!mongoose.isValidObjectId(trimmedId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Shoe ID",
            });
        }

        const deletedShoe = await shoeModel.findByIdAndDelete(trimmedId);

        if (!deletedShoe) {
            return res.status(404).json({
                success: false,
                message: "Shoe not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Shoe deleted successfully",
            deletedShoe
        });

    } catch (error) {
        console.log("🚀 ~ goggleController.js:285 ~ shoeDeleteController ~ error:", error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};


export const goggleDeleteController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "goggle ID is required",
            });
        }

        const trimmedId = id.trim();

        if (!mongoose.isValidObjectId(trimmedId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid goggle ID",
            });
        }

        const deletedgoggle = await goggleModel.findByIdAndDelete(trimmedId);

        if (!deletedgoggle) {
            return res.status(404).json({
                success: false,
                message: "goggle not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "goggle deleted successfully",
            deletedgoggle
        });

    } catch (error) {
        console.log("🚀 ~ goggleController.js:330 ~ goggleDeleteController ~ error:", error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};