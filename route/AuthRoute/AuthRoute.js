import express from "express";
import {
    createLockerController, getAllUserController, getLockerByIdController, getLockerController, loginController, refreshTokenController, registerController,
    searchByCodeLockerController, updateLockerController, updateUserPhotoController, verifyOtpController
} from "../../controller/Auth/AuthController.js";
import { validateLocker, validateLogin, validateRegister } from "../../util/Validator/Validator.js";
import { Auth } from "../../middleware/Auth/AuthMiddleware.js";
import { singleUpload } from "../../middleware/multer/multer.js";



const route = express.Router();

// -------------Register Route-----------------
route.post("/register", validateRegister, registerController)
// ----------------------Login Route----------------------
route.post("/login", validateLogin, loginController)
// --------------get all locker route------------------
route.get("/getLocker", Auth, getLockerController)
// ----------------create locker route-----------------
route.post('/createlocker', Auth, validateLocker, singleUpload, createLockerController)

// -----------------update locker route-----------------
route.put('/updatelocker/:_id', Auth, validateLocker, updateLockerController)
// ----------------get locker by id route-----------------

route.get('/getlockerbyid/:id', Auth, getLockerByIdController)

// -------------update user photo-----------------

route.put('/updateUserPhoto/:id', Auth, singleUpload, updateUserPhotoController)

route.get("/search", Auth, searchByCodeLockerController)

// ------------varify otp ----------------------
route.post("/varifyotp", verifyOtpController)

// -------------all user ------------------
route.get("/alluser", getAllUserController)

// ---------------refresh token ------------------
route.post("/refreshToken", refreshTokenController)




export default route;
