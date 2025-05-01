import UserModel from "../../model/Auth/userModel/UserModel.js"
import JWT from "jsonwebtoken"
import { validationResult } from "express-validator"
import { config } from "../../util/EnvVariabe.js"
import { comparePassword, OTP } from "../../util/helper/Method.js"
import lockerModel from "../../model/locker/lockerModel.js"
import { getDataUri } from "../../middleware/multer/multer.js"
import cloudinary from 'cloudinary'
import mongoose from "mongoose"
import { sendOTPMailer } from "../../nodemailer/nodemailer.js"
import bcrypt from "bcrypt";
import { customConsole, ganerateToken, parseBoolean } from "../../util/Util.js"


// ----------------registerController----------------------
export const registerController = async (req, res) => {
    try {

        const { name, email, mobile, password, dateOfBirth } = req.body

        // Validate the request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // If there are validation errors, return them
            return res.status(400).json({ errors: errors.array() });
        }

        const isExist = await UserModel.findOne({ email })
        if (isExist) {
            return res.status(400).json({
                success: false,
                message: "user already exist",
            })
        }

        // const registerationAttemptsByUser = await UserModel.find({ email, Verified: false });
        const unverifiedAttemptsCount = await UserModel.countDocuments({ email, Verified: false });

        if (unverifiedAttemptsCount.length > 3) {

            return res.status(400).json({
                success: false,
                message: "You have exceeded the maximum number of attempts (3). Please try again after an hour.",
                error: "You have exceeded the maximum number of attempts (3). Please try again after an hour.",
            })
        }

        const user = await UserModel.create({
            name,
            email,
            mobile,
            password,
            dateOfBirth,
        })

        // const { refreshToken, token } = ganerateToken(user)
        const token = JWT.sign({ _id: user }, config.get("JWT_SECRET"), { expiresIn: "7d" })
        const refreshToken = JWT.sign({ _id: user }, config.get("JWT_SECRET"), { expiresIn: "15d" })

        const OTP = () => Math.floor(100000 + Math.random() * 900000).toString();
        const otpCode = OTP();

        await sendOTPMailer(email, otpCode)

        user.verificationToken = bcrypt.hashSync(otpCode, 10);

        await user.save()

        return res.status(200).json({
            success: true,
            message: "user register successfully",
            token,
            refreshToken,
            user,
        })
    } catch (error) {
        console.log("🚀 ~ AuthController.js:77 ~ registerController ~ error:", error)
        return res.status(400).json({
            success: false,
            message: "Something went wrong",
            error: error.message,
        });
    }
}

// -------------------LoginController----------------------

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body

        // Validate the request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // If there are validation errors, return them
            return res.status(400).json({ errors: errors.array() });
        }


        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user not found",
            })
        }

        const isMatch = await comparePassword(password, user.password)

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "password is not match",
            })
        }


        const varify = user.verified === false

        if (varify) {
            return res.status(400).json({
                success: false,
                message: "check your email and varify your account",
            })
        }

        const token = JWT.sign({ _id: user }, config.get("JWT_SECRET"), { expiresIn: "7d" })
        const refresh_token = JWT.sign({ _id: user }, config.get("JWT_SECRET"), { expiresIn: "15d" })

        await user.save()
        return res.status(200).cookie('token', token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: config.get("NODE_ENV") === "development" ? true : false,
            sameSite: config.get("NODE_ENV") === "development" ? true : false,
            secure: config.get("NODE_ENV") === "development" ? true : false,
        })
            .json({
                status: true,
                message: "Login successfully",
                token,
                refresh_token,
                user,
            })

    } catch (error) {
        console.log("🚀 ~ AuthController.js:146 ~ loginController ~ error:", error)
    }
}


export const getLockerController = async (req, res) => {
    try {
        let { page, limit, sort, sortOrder } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        sort = sort || "sr_no";
        sortOrder = sortOrder === "asc" ? -1 : 1;

        const skip = (page - 1) * limit;

        const lockers = await lockerModel.find({}).sort({ [sort]: sortOrder })
            .skip(skip)
            .limit(limit);

        const totalLockers = await lockerModel.countDocuments();

        if (!lockers.length) {
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
            parpage: limit,
            lockers,
        });

    } catch (error) {
        console.log("🚀 ~ AuthController.js:186 ~ getLockerController ~ error:", error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};



// --------------create locker controller ----------------------
export const createLockerController = async (req, res) => {
    try {

        const { sr_no, location, locker_no, unit, code, name, role, status, mobile, department, combine, shoe_size, aadhar, address } = req.body

        if (!code) {
            return res.status(400).json({
                success: false,
                message: "code are required",
            })
        }

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "name are required",
            })
        }

        if (!role) {
            return res.status(400).json({
                success: false,
                message: "role are required",
            })
        }

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "status are required",
            })
        }

        if (!mobile) {
            return res.status(400).json({
                success: false,
                message: "mobile are required",
            })
        }

        if (!department) {
            return res.status(400).json({
                success: false,
                message: "department are required",
            })
        }
        if (!shoe_size) {
            return res.status(400).json({
                success: false,
                message: "shoe_size are required",
            })
        }

        if (!aadhar) {
            return res.status(400).json({
                success: false,
                message: "aadhar are required",
            })
        }

        if (!address) {
            return res.status(400).json({
                success: false,
                message: "address are required",
            })
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file selected",
            });
        }
        // photo get 
        const file = getDataUri(req.file)

        // delete old photo in data
        // await cloudinary.v2.uploader.destroy(creatLocker.image.public_id)

        // update
        const imageFileUpload = await cloudinary.v2.uploader.upload(file.content)

        const creatLocker = await lockerModel.create({
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
            combine,
            shoe_size,
            image: {
                public_id: imageFileUpload.public_id,
                url: imageFileUpload.secure_url
            },
            aadhar,
            address
        })
        // save 
        await creatLocker.save()

        return res.status(200).json({
            success: true,
            url: imageFileUpload.secure_url,
            public_id: imageFileUpload.public_id,
            creatLocker,
            message: "locker create successfully",
        })
    } catch (error) {
        console.log("🚀 ~ AuthController.js:310 ~ createLockerController ~ error:", error)
        return res.status(400).json({
            success: false,
            message: "Something went wrong",
            error: error.message,
        });
    }
}

// --------------update locker controller ---------------------
export const updateLockerController = async (req, res) => {
    try {

        const { combine, sr_no, location, locker_no, unit, code, name, role, status, mobile, department, shoe_size, aadhar, address, isLeft } = req.body
        // console.log(req.body);
        const { _id } = req.params
        // Validate the request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // If there are validation errors, return them
            return res.status(400).json({ errors: errors.array() });
        }

        // Fetch the existing locker data before update
        const previousLocker = await lockerModel.findById(_id);

        if (!previousLocker) {
            return res.status(404).json({
                success: false,
                message: "Locker not found",
            });
        }

        const updateData = {
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
            isLeft: parseBoolean(isLeft)
        }

        const updateLocker = await lockerModel.findByIdAndUpdate(_id, updateData, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        if (!updateLocker) {
            return res.status(404).json({
                success: false,
                message: "Locker not found",
            });
        }

        return res.status(200).json({
            previousLocker,
            success: true,
            message: "Locker updated successfully",
            updateLocker
        });

    } catch (error) {
        console.log("🚀 ~ AuthController.js:382 ~ updateLockerController ~ error:", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message,
        });
    }
};

// export const updateLockerController = async (req, res) => {
//     try {

//         const { combine, sr_no, location, locker_no, unit, code, name, role, status, mobile, department, shoe_size, aadhar, address, isLeft } = req.body;
//         const { id } = req.params;

//         if (!mongoose.isValidObjectId(id)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid Locker ID",
//             });
//         }

//         const beforeUpdate = await lockerModel.findById(id);

//         if (!beforeUpdate) {
//             return res.status(400).json({
//                 success: false,
//                 message: "locker not found",
//             });
//         }

//         // Prepare the update data
//         const updateData = {
//             combine,
//             sr_no,
//             location,
//             unit,
//             role,
//             aadhar,
//             address,
//             code,
//             locker_no,
//             name,
//             department,
//             status,
//             mobile,
//             shoe_size,
//             isLeft: parseBoolean(isLeft),
//         };

//         // If new image is uploaded
//         if (req.file) {
//             const file = getDataUri(req.file);

//             // Delete old image if exists
//             if (beforeUpdate.image?.public_id) {
//                 try {
//                     await cloudinary.v2.uploader.destroy(beforeUpdate.image.public_id);
//                 } catch (error) {
//                     console.log("Error deleting image from Cloudinary:", error);
//                     return res.status(500).json({
//                         success: false,
//                         message: "Error while deleting image from Cloudinary",
//                         error: error.message,
//                     });
//                 }
//             }

//             // Upload new image
//             const uploadImage = await cloudinary.v2.uploader.upload(file.content, {
//                 folder: "lockers",
//                 transformation: [
//                     { width: 500, height: 500, crop: "limit" },
//                     { fetch_format: "auto", quality: "auto" }
//                 ]
//             });

//             updateData.image = {
//                 public_id: uploadImage.public_id,
//                 url: uploadImage.secure_url
//             };
//         }

//         const updateLocker = await lockerModel.findByIdAndUpdate(id, updateData, {
//             new: true,
//             runValidators: true,
//         });

//         return res.status(200).json({
//             beforeUpdate,
//             success: true,
//             message: "locker updated successfully",
//             updateLocker
//         });

//     } catch (error) {
//         console.log("🚀 ~ AuthController.js:476 ~ updateByIdAdminLockerController ~ error:", error)
//         return res.status(500).json({
//             success: false,
//             message: "Something went wrong while updating locker",
//             error: error.message,
//         });
//     }
// };

// get locker by id controller 
export const getLockerByIdController = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid locker ID",
            });
        }

        const locker = await lockerModel.findById(id).lean();
        if (!locker) {
            return res.status(404).json({
                success: false,
                message: "Locker not found",
            });
        }

        return res.status(200).json({
            success: true,
            locker,
        });
    } catch (error) {
        console.log("🚀 ~ AuthController.js:417 ~ getLockerByIdController ~ error:", error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};



// ----------updat user photo controller------------------

export const updateUserPhotoController = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if ID is missing
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Locker ID is required",
            });
        }

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid locker ID",
            });
        }

        // Check if locker exists
        const existingLocker = await lockerModel.findById(id);
        if (!existingLocker) {
            return res.status(404).json({
                success: false,
                message: "Locker not found",
            });
        }

        // Ensure file is provided
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image file provided",
            });
        }

        // Convert file to Data URI
        const file = getDataUri(req.file);

        // Delete previous image from Cloudinary if it exists
        if (existingLocker.image?.public_id) {
            try {
                await cloudinary.v2.uploader.destroy(existingLocker.image.public_id);
            } catch (err) {
                console.error("🚀 ~ Error deleting old image from Cloudinary:", err);
            }
        }

        // Upload new optimized image to Cloudinary
        const imageFileUpload = await cloudinary.v2.uploader.upload(file.content, {
            folder: "lockers", // Organizing images in a folder
            transformation: [
                { width: 500, height: 500, crop: "limit", }, // Resize (max 500x500)
                { fetch_format: "auto", quality: "auto" }   // Auto-format & compression
            ]
        });

        // Update locker image details
        existingLocker.image = {
            public_id: imageFileUpload.public_id,
            url: imageFileUpload.secure_url,
        };

        // Save updated locker
        await existingLocker.save();

        return res.status(200).json({
            success: true,
            message: "Locker photo updated successfully",
            locker: existingLocker,
        });

    } catch (error) {
        console.log("🚀 ~ AuthController.js:503 ~ updateUserPhotoController ~ error:", error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message,
        });
    }
};

// ------------search by all fields -------------------


export const searchByCodeLockerController = async (req, res) => {
    try {
        const { search, } = req.query;
        // Validate if search parameter is provided
        if (!search || search.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Query parameter 'search' is required",
            });
        }

        // Constructing dynamic search criteria
        let searchCriteria = {};

        if (search) {
            const isNumber = !isNaN(search); // Check if search input is a number
            searchCriteria = {
                $or: [
                    { code: { $regex: search, $options: "i" } },
                    { locker_no: { $regex: search, $options: "i" } },
                    { name: { $regex: search, $options: "i" } },
                    { role: { $regex: search, $options: "i" } },
                    { status: { $regex: search, $options: "i" } },
                    { department: { $regex: search, $options: "i" } },
                    // Only search in numeric fields if the input is a valid number
                    ...(isNumber ? [{ aadhar: Number(search) }, { mobile: Number(search) }] : []),
                ],
            };
        }

        // Fetching matching records
        const locker = await lockerModel.find(searchCriteria);
        const total = await lockerModel.countDocuments(searchCriteria);

        res.status(200).json({
            success: true,
            message: "Locker fetched successfully",
            total,
            locker,
        });
    } catch (err) {
        console.log("🚀 ~ AuthController.js:556 ~ searchByCodeLockerController ~ err:", err)
        res.status(500).json({
            error: true,
            message: "Internal Server Error",
            error: err.message
        });
    }
};



export const verifyOtpController = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!otp) {
            return res.status(400).json({
                success: false,
                error: "OTP is required",
            });
        }

        // Find the user
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found",
            });
        }

        if (!user.verificationToken) {
            return res.status(400).json({
                success: false,
                error: "OTP already verified",
            });
        }

        // Compare OTP
        const isOtpValid = await bcrypt.compare(otp, user.verificationToken);
        if (!isOtpValid) {
            return res.status(400).json({
                success: false,
                error: "Invalid OTP",
            });
        }

        // Mark user as verified
        user.verified = true;
        user.verificationToken = undefined;
        await user.save(); // Save changes

        return res.status(200).json({
            success: true,
            message: "User verified successfully",
            user,
        });

    } catch (error) {
        console.log("🚀 ~ AuthController.js:615 ~ verifyOtpController ~ error:", error.message)
        return res.status(500).json({
            success: false,
            error: "Something went wrong",
        });
    }
};


// ------------all user controller -------------------

export const getAllUserController = async (req, res) => {
    try {
        const allUsers = await UserModel.find();

        if (allUsers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No users found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "All users fetched successfully",
            count: allUsers.length,
            users: allUsers,
        });

    } catch (error) {
        console.log("🚀 ~ AuthController.js:645 ~ getAllUserController ~ error:", error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message, // Sending only the message for security reasons
        });
    }
};

// ------------refresh controller ----------------

export const refreshTokenController = async (req, res) => {
    try {
        const { refresh_token } = req.body;

        if (!refresh_token) {
            return res.status(401).json({
                success: false,
                message: `refresh_token is required`,
            });
        }

        let payload;
        try {
            payload = JWT.verify(refresh_token, config.get("JWT_SECRET"));
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({
                    success: false,
                    message: "Refresh token has expired. Please log in again.",
                    error: err
                });
            }
            return res.status(403).json({
                success: false,
                message: "Invalid refresh token.",
            });
        }

        const user = await UserModel.findById(payload._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const token = JWT.sign({ _id: user._id }, config.get("JWT_SECRET"), { expiresIn: "7d" });
        const refreshToken = JWT.sign({ _id: user._id }, config.get("JWT_SECRET"), { expiresIn: "15d" });

        return res.status(200).json({
            success: true,
            message: "Token refreshed successfully",
            token,
            refreshToken,
            user,
        });
    } catch (error) {
        console.log("🚀 ~ refreshTokenController error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


export const getAllUsersController = async (req, res) => {
    try {
        let { limit = 10, cursor = undefined, direction = "next", search = "" } = req.query;

        // Validate inputs
        limit = parseInt(limit);
        if (isNaN(limit) || limit <= 0) limit = 10;
        limit = Math.min(limit, 100); // Cap maximum limit

        if (direction !== "next" && direction !== "prev") direction = "next";

        if (cursor && !mongoose.Types.ObjectId.isValid(cursor)) {
            return res.status(400).json({
                success: false,
                message: "Invalid cursor format"
            });
        }

        // Build filter
        const filter = {};

        // Add search functionality
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Add cursor filtering
        if (cursor) {
            if (direction === "next") {
                filter._id = { $gt: new mongoose.Types.ObjectId(cursor) };
            } else if (direction === "prev") {
                filter._id = { $lt: new mongoose.Types.ObjectId(cursor) };
            }
        }

        const sortOrder = direction === "next" ? 1 : -1;

        // Execute query with optimization
        const users = await UserModel.find(filter)
            .select('name email profilePic role createdAt')
            .sort({ _id: sortOrder })
            .limit(limit + 1)
            .lean();

        // Check if we have more results
        const hasMore = users.length > limit;

        // Remove the extra item if we fetched one
        if (hasMore) users.pop();

        // Reverse for "prev" direction
        if (direction === "prev") {
            users.reverse();
        }

        // Set cursors
        let nextCursor = null;
        let prevCursor = null;

        if (users.length > 0) {
            nextCursor = hasMore ? users[users.length - 1]._id : null;
            prevCursor = users[0]._id;
        }

        // Set cache headers
        res.setHeader('Cache-Control', 'private, max-age=300');

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            pagination: {
                nextCursor,
                prevCursor,
                count: users.length,
                hasMore
            },
            users,
        });
    } catch (error) {
        console.error("Error in getAllUsersController:", error);

        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: "Invalid input format" });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};




export const getLockerCombineController = async (req, res) => {
    try {
        const { combine } = req.body;

        const split = combine.split(" / ");
        const swapped = [split[1], split[0]].join(" / ");

        let locker = await lockerModel.findOne({ combine });

        if (!locker) {
            locker = await lockerModel.findOne({ combine: swapped });
        }

        if (!locker) {
            return res.status(404).json({
                success: false,
                message: "No lockers found ",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Locker found successfully",
            locker,
        });

    } catch (error) {
        console.log("🚀 ~ AuthController.js:935 ~ getLockerCombineController ~ error:", error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
