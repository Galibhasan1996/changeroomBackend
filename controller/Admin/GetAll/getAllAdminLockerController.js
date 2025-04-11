import { validationResult } from "express-validator";
import AdminLockerModel from "../../../model/locker/Admin/AdminModel.js"
import { getDataUri } from "../../../middleware/multer/multer.js";
import cloudinary from 'cloudinary'
import mongoose from "mongoose";
import { parseBoolean } from "../../../util/Util.js";

// ----------get all admin locker -------------
export const getAllAdminLockerController = async (req, res) => {
    try {
        let { page, limit, sortBy, sortOrder } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        sortBy = sortBy || "sr_no";
        sortOrder = sortOrder === "asc" ? -1 : 1;
        const skip = (page - 1) * limit;

        const adminLockers = await AdminLockerModel.find({}).sort({ [sortBy]: sortOrder }).skip(skip).limit(limit);

        const totalAdminLocker = await AdminLockerModel.countDocuments();


        if (adminLockers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No Admin Lockers found",
            });
        }

        return res.status(200).json({
            success: true,
            totalPage: Math.ceil(totalAdminLocker / limit),
            message: "Admin Lockers fetched successfully",
            parpage: limit,
            count: totalAdminLocker,
            adminLockers,
        });
    } catch (error) {
        console.log("🚀 ~ getAllAdminLockerController.js:36 ~ getAllAdminLockerController ~ error:", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching admin lockers",
            error: error.message,
        });
    }
};

// -----------create admin locker controller------------

export const createAdminLockerController = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // If there are validation errors, return them
            return res.status(400).json({ errors: errors.array() });
        }

        const { code, before, locker_no, name, department, status, mobile, shoe_size, } = req.body

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image is required",
            });
        }

        const isExist = await AdminLockerModel.findOne({ locker_no })
        if (isExist) {
            return res.status(400).json({
                success: false,
                message: `This locker number ( - ${locker_no} - ) already exist`,
            })
        }



        const file = getDataUri(req.file)

        let uploadImage;
        try {
            uploadImage = await cloudinary.v2.uploader.upload(file.content);
        } catch (uploadError) {
            return res.status(500).json({
                success: false,
                message: "Image upload failed",
                error: uploadError.message,
            });
        }


        const createNewAdminLocker = await AdminLockerModel.create({
            code,
            before,
            locker_no,
            name,
            department,
            status,
            mobile,
            shoe_size,
            image: {
                public_id: uploadImage.public_id,
                url: uploadImage.secure_url
            }
        })

        await createNewAdminLocker.save()

        return res.status(200).json({
            success: true,
            message: "Admin locker created successfully",
            adminLocker: createNewAdminLocker
        })

    } catch (error) {
        console.log("🚀 ~ getAllAdminLockerController.js:49 ~ createAdminLockerController ~ error:", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating admin locker",
            error: error.message,
        })
    }
}

// ----------get by id controller----------------
export const getByIdAdminLockerController = async (req, res) => {
    try {
        const { id } = req.params


        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid  Locker ID",
            });
        }


        const isExist = await AdminLockerModel.findById(id)
        if (!isExist) {
            return res.status(400).json({
                success: false,
                message: "Admin locker not found",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Admin locker fetched successfully",
            isExist
        })


    } catch (error) {
        console.log("🚀 ~ getAllAdminLockerController.js:129 ~ getByIdAdminLockerController ~ error:", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching admin locker",
            error: error.message,
        })
    }
}

export const deleteByIdAdminLockerController = async (req, res) => {
    try {

        const { id } = req.params

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid  Locker ID",
            });
        }

        const deletedLocker = await AdminLockerModel.findByIdAndDelete(id)

        if (!deletedLocker) {
            return res.status(400).json({
                success: false,
                message: "Admin locker not found",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Admin locker deleted successfully",
            deletedLocker
        })

    } catch (error) {
        console.log("🚀 ~ getAllAdminLockerController.js:174 ~ deleteByIdAdminLockerController ~ error:", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting admin locker",
            error: error.message,
        })
    }
}

// -----------update admin locker controller------------

// export const updateByIdAdminLockerController = async (req, res) => {
//     try {

//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             // If there are validation errors, return them
//             return res.status(400).json({ errors: errors.array() });
//         }

//         const { code, before, locker_no, name, department, status, mobile, shoe_size, isLeft } = req.body

//         const { id } = req.params

//         if (!req.file) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Image is required",
//             });
//         }

//         if (!mongoose.isValidObjectId(id)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid  Locker ID",
//             });
//         }

//         const beforeUpdate = await AdminLockerModel.findById(id)

//         if (!beforeUpdate) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Admin before locker not found",
//             })
//         }

//         const file = getDataUri(req.file)

//         if (beforeUpdate.image.public_id) {
//             try {
//                 await cloudinary.v2.uploader.destroy(beforeUpdate.image.public_id)

//             } catch (error) {
//                 console.log("🚀 ~ getAllAdminLockerController.js:246 ~ updateByIdAdminLockerController ~ error:", error)
//                 return res.status(500).json({
//                     success: false,
//                     message: "Error while deleting image from cloudinary",
//                     error: error.message,
//                 })
//             }
//         }

//         const uploadImage = await cloudinary.v2.uploader.upload(file.content, {
//             folder: "admin Locker",
//             transformation: [
//                 { width: 500, height: 500, crop: "limit" },
//                 { fetch_format: "auto", quality: "auto" }
//             ]
//         })

//         const updateData = {
//             code,
//             before,
//             locker_no,
//             name,
//             department,
//             status,
//             mobile,
//             shoe_size,
//             isLeft: parseBoolean(isLeft),
//             image: {
//                 public_id: uploadImage.public_id,
//                 url: uploadImage.secure_url
//             }
//         }

//         const updateLocker = await AdminLockerModel.findByIdAndUpdate(id, updateData, {
//             new: true,
//             runValidators: true,
//         });

//         return res.status(200).json({
//             beforeUpdate: beforeUpdate,
//             success: true,
//             message: "Admin locker updated successfully",
//             updateLocker: updateLocker
//         })

//     } catch (error) {
//         console.log("🚀 ~ getAllAdminLockerController.js:213 ~ updateByIdAdminLockerController ~ error:", error)
//         return res.status(500).json({
//             success: false,
//             message: "Something went wrong while updating admin locker",
//             error: error.message,
//         })
//     }
// }


export const updateByIdAdminLockerController = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { code, before, locker_no, name, department, status, mobile, shoe_size, isLeft } = req.body;
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Locker ID",
            });
        }

        const beforeUpdate = await AdminLockerModel.findById(id);

        if (!beforeUpdate) {
            return res.status(400).json({
                success: false,
                message: "Admin locker not found",
            });
        }

        // Prepare the update data
        const updateData = {
            code,
            before,
            locker_no,
            name,
            department,
            status,
            mobile,
            shoe_size,
            isLeft: parseBoolean(isLeft),
        };

        // If new image is uploaded
        if (req.file) {
            const file = getDataUri(req.file);

            // Delete old image if exists
            if (beforeUpdate.image?.public_id) {
                try {
                    await cloudinary.v2.uploader.destroy(beforeUpdate.image.public_id);
                } catch (error) {
                    console.log("Error deleting image from Cloudinary:", error);
                    return res.status(500).json({
                        success: false,
                        message: "Error while deleting image from Cloudinary",
                        error: error.message,
                    });
                }
            }

            // Upload new image
            const uploadImage = await cloudinary.v2.uploader.upload(file.content, {
                folder: "admin Locker",
                transformation: [
                    { width: 500, height: 500, crop: "limit" },
                    { fetch_format: "auto", quality: "auto" }
                ]
            });

            updateData.image = {
                public_id: uploadImage.public_id,
                url: uploadImage.secure_url
            };
        }

        const updateLocker = await AdminLockerModel.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        return res.status(200).json({
            beforeUpdate,
            success: true,
            message: "Admin locker updated successfully",
            updateLocker
        });

    } catch (error) {
        console.log("Update Admin Locker Error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating admin locker",
            error: error.message,
        });
    }
};



export const searchAllAdminLockerController = async (req, res) => {
    try {
        let { search } = req.query;

        if (!search || search.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Query parameter 'search' is required",
            });
        }

        // Constructing dynamic search criteria
        let searchCriteria = {};

        if (search) {
            const isNumber = !isNaN(search);
            searchCriteria = {
                $or: [
                    { code: { $regex: search, $options: "i" } },
                    { locker_no: { $regex: search, $options: "i" } },
                    { name: { $regex: search, $options: "i" } },
                    { role: { $regex: search, $options: "i" } },
                    { status: { $regex: search, $options: "i" } },
                    { department: { $regex: search, $options: "i" } },
                    // Only search in numeric fields if the input is a valid number
                    ...(isNumber ? [{ mobile: Number(search) }] : []),

                ],
            };
        }

        // Fetching matching records
        const locker = await AdminLockerModel.find(searchCriteria)
        const total = await AdminLockerModel.countDocuments(searchCriteria);

        res.status(200).json({
            success: true,
            message: "Admin Locker fetched successfully",
            total,
            locker,
        });
    } catch (err) {
        console.log("🚀 ~ getAllAdminLockerController.js:343 ~ searchAllAdminLockerController ~ err:", err)
        res.status(500).json({
            error: true,
            message: "Internal Server Error",
            error: err.message
        });
    }
};