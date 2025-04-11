import mongoose from "mongoose";
import previouslockerModel from "../../../model/locker/previouslocker/previouslocker.js";
import preAdminLockerModel from './../../../model/locker/Admin/PreAdmin/PreAdminModel.js';



// export const previousLockerController = async (req, res) => {
//     try {

//         let { page, limit,search } = req.query;

//         // Convert page and limit to numbers, set default values if not provided
//         page = parseInt(page) || 1;
//         limit = parseInt(limit) || 10;

//         // Calculate the number of documents to skip
//         const skip = (page - 1) * limit;

//         // Constructing dynamic search criteria
//         let searchCriteria = {};

//         if (search) {
//             searchCriteria = {
//                 $or: [
//                     { locker_no: { $regex: search, $options: "i" } },
//                 ],
//             };
//         }


//         const locker = await previouslockerModel.find({}).skip(skip).limit(limit)
//         // Get total count of lockers for pagination metadata
//         const totalLockers = await previouslockerModel.countDocuments();

//         if (!locker) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Locker not found",
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             currentPage: page,
//             totalPages: Math.ceil(totalLockers / limit),
//             totalLockers,
//             message: "Lockers fetched successfully",
//             locker,
//         });
//     } catch (error) {
//         console.log("🚀 ~ previousLockerController ~ error:", error)
//         return res.status(400).json({
//             success: false,
//             message: "something wrong",
//             error: error.message
//         })
//     }
// }


export const previousLockerController = async (req, res) => {
    try {
        let { page, limit, search, sort, sortOrder } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 30;
        sort = sort || "sr_no";
        sortOrder = sortOrder === "asc" ? -1 : 1;

        const skip = (page - 1) * limit;

        let searchCriteria = {};

        if (search) {
            searchCriteria = {
                $or: [{ locker_no: { $regex: search, $options: "i" } }],
            };
        }

        const lockers = await previouslockerModel.find(searchCriteria)
            .sort({ [sort]: sortOrder })
            .skip(skip)
            .limit(limit);

        const totalLockers = await previouslockerModel.countDocuments(searchCriteria);

        if (lockers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No lockers found",
            });
        }

        return res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: Math.ceil(totalLockers / limit),
            totalLockers,
            message: "Lockers fetched successfully",
            lockers,
        });
    } catch (error) {
        console.log("🚀 ~ previouslockerController.js:98 ~ previousLockerController ~ error:", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message,
        });
    }
};



// -----------------privous locker update controller -----------------
export const previousLockerUpdateController = async (req, res) => {
    try {
        const { combine, sr_no, location, locker_no, unit, code, name, role, status, mobile, department, shoe_size, aadhar, address, public_id, url } = req.body;

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Request body cannot be empty",
            });
        }

        let locker = await previouslockerModel.findOne({ locker_no });

        if (!locker) {
            locker = await previouslockerModel.create({
                combine,
                sr_no,
                location,
                locker_no,
                unit,
                code,
                name,
                role,
                status,
                mobile,
                department,
                shoe_size,
                aadhar,
                address,
                image: {
                    public_id: public_id,
                    url: url
                }
            });

            return res.status(201).json({
                success: true,
                message: "Locker created successfully",
                data: locker
            });
        } else {
            locker = await previouslockerModel.findOneAndUpdate({ locker_no }, {
                combine,
                sr_no,
                location,
                locker_no,
                unit,
                code,
                name,
                role,
                status,
                mobile,
                department,
                shoe_size,
                aadhar,
                address,
                image: {
                    public_id: public_id,
                    url: url
                }
            }, { new: true });

            return res.status(200).json({
                success: true,
                message: "Locker updated successfully",
                data: locker
            });
        }
    } catch (error) {
        console.log("🚀 ~ previouslockerController.js:179 ~ previousLockerUpdateController ~ error:", error)

        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid locker ID",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};

// -------------------get pre locker by id-----------------


export const previousLockerGetByIdController = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Locker ID is required",
            });
        }

        const locker = await previouslockerModel.findById(id);

        if (!locker) {
            return res.status(404).json({
                success: false,
                message: "Locker not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Locker fetched successfully",
            data: locker
        });

    } catch (error) {
        console.log("🚀 ~ previouslockerController.js:226 ~ previousLockerGetByIdController ~ error:", error)

        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid locker ID format",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};



export const previousAdminLockerUpdateController = async (req, res) => {
    try {

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Request body cannot be empty",
            });
        }
        const { sr_no, locker_no, code, name, status, mobile, department, shoe_size, public_id, url, before } = req.body;

        if (!locker_no) {
            return res.status(400).json({
                success: false,
                message: "locker_no is required",
            });
        }

        let locker = await preAdminLockerModel.findOne({ locker_no });

        if (!locker) {
            locker = await preAdminLockerModel.create({

                image: {
                    public_id: public_id,
                    url: url
                },
                code,
                before,
                locker_no,
                name,
                department,
                status,
                mobile,
                shoe_size,
                sr_no,
            });

            return res.status(201).json({
                success: true,
                message: "Locker created successfully",
                data: locker
            });
        } else {
            locker = await preAdminLockerModel.findOneAndUpdate({ locker_no }, {
                image: {
                    public_id: public_id,
                    url: url
                },
                code,
                before,
                locker_no,
                name,
                department,
                status,
                mobile,
                shoe_size,
                // sr_no,
            }, { new: true });

            return res.status(200).json({
                success: true,
                message: "Locker updated successfully",
                data: locker
            });
        }
    } catch (error) {
        console.log("🚀 ~ previouslockerController.js:317 ~ previousAdminLockerUpdateController ~ error:", error)

        if (error.code === 11000 && error.keyValue) {
            const duplicateField = Object.keys(error.keyValue)[0];
            return res.status(400).json({
                success: false,
                message: `Duplicate value for '${duplicateField}'. A record with this ${duplicateField} already exists.`,
            });
        }


        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};

// -------------pre admin ----------------

export const previousAdminLockerController = async (req, res) => {
    try {

        let { page, limit, search, sort, sortOrder } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 15;
        sort = sort || "sr_no";
        sortOrder = sortOrder === "asc" ? -1 : 1;

        const skip = (page - 1) * limit;

        let searchCriteria = {};

        if (search) {
            searchCriteria = {
                $or: [{ locker_no: { $regex: search, $options: "i" } }],
            };
        }

        const lockers = await preAdminLockerModel.find(searchCriteria)
            .sort({ [sort]: sortOrder })
            .skip(skip)
            .limit(limit);

        const totalLockers = await preAdminLockerModel.countDocuments(searchCriteria);

        if (lockers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No Admin lockers found",
            });
        }

        return res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: Math.ceil(totalLockers / limit),
            totalLockers,
            parpage: limit,
            message: "Pre Admin Lockers fetched successfully",
            lockers,
        });

    } catch (error) {
        console.log("🚀 ~ previouslockerController.js:332 ~ previousAdminLockerController ~ error:", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        })
    }
}

// ------------------pre admin ----------------------
export const preAdminLockerGetByIdController = async (req, res) => {
    try {
        const { id } = req.params;


        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid  Locker ID",
            });
        }


        const locker = await preAdminLockerModel.findById(id).lean()

        if (!locker) {
            return res.status(404).json({
                success: false,
                message: "Locker not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Locker fetched successfully",
            locker
        });

    } catch (error) {
        console.log("🚀 ~ previouslockerController.js:410 ~ preAdminLockerGetByIdController ~ error:", error)

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};