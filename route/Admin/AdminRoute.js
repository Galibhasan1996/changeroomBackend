import express from "express";
import {
    createAdminLockerController, deleteByIdAdminLockerController,
    getAllAdminLockerController,
    getByIdAdminLockerController,
    searchAllAdminLockerController,
    updateByIdAdminLockerController,
} from "../../controller/Admin/GetAll/getAllAdminLockerController.js";
import { adminLockerValidate } from "../../util/Validator/Validator.js";
import { singleUpload } from "../../middleware/multer/multer.js";
const route = express.Router();



// ---------get all admin locker -------------
route.get("/adminGetAllLocker", getAllAdminLockerController)
// --------create-------------------
route.post("/createAdminLocker", singleUpload, adminLockerValidate, createAdminLockerController)
// -------------get by id-----------------
route.get("/getAdminLockerById/:id", getByIdAdminLockerController)

// -------------delete by id--------------
route.delete("/deletebyid/:id", deleteByIdAdminLockerController)
// --------------up date by id--------------
route.put("/updatebyid/:id", singleUpload, updateByIdAdminLockerController)
// ------------admin search -----------------
route.get("/search", searchAllAdminLockerController)

export default route