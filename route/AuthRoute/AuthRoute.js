import express from "express";
import {
    allAsAdminLockerController,
    createLockerController, deleteLocker, deleteUserController, getAllOtherController, getAllUserController, getLockerByIdController, getLockerCombineController, getLockerController, getTotalLokerController, loginController, refreshTokenController, registerController,
    searchByCodeLockerController, updateLockerController, updateUserController, updateUserPhotoController, verifyOtpController
} from "../../controller/Auth/AuthController.js";
import { validateLocker, validateLogin, validateRegister } from "../../util/Validator/Validator.js";
import { Auth, isAdmin } from "../../middleware/Auth/AuthMiddleware.js";
import { singleUpload } from "../../middleware/multer/multer.js";



const route = express.Router();

// -------------Register Route-----------------
route.post("/register", validateRegister, registerController)
// ----------------------Login Route----------------------
route.post("/login", validateLogin, loginController)
// --------------get all locker route------------------
route.get("/getLocker", Auth, getLockerController)
// ----------------create locker route-----------------
route.post('/createlocker', isAdmin, validateLocker, singleUpload, createLockerController)

// -----------------update locker route-----------------
route.put('/updatelocker/:_id', Auth, singleUpload, updateLockerController)
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
// ------------get combine locker ------------
route.get("/combine", getLockerCombineController)

// --------totol locker ------------------
route.get("/totallocker", getTotalLokerController)
// ---------------only admin bottom route-------------
route.get("/getOtherAllUesr", isAdmin, getAllOtherController)
// -----------delete user -------------------
route.delete("/deleteuser/:id", isAdmin, deleteUserController)
// ------------update user-------------------
route.put("/updateuser/:id", isAdmin, updateUserController)
// ------------delete Locker-----------------
route.delete("/delete_locker/:id", isAdmin, deleteLocker)
// --------------get all locker as admin ---------------
route.get("/getAllLockerAsAdmin", isAdmin, allAsAdminLockerController)


export default route;
