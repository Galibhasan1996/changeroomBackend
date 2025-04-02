import express from "express";
import {
    preAdminLockerGetByIdController,
    previousAdminLockerController,
    previousAdminLockerUpdateController,
    previousLockerController,
    previousLockerGetByIdController,
    previousLockerUpdateController
} from "../../../controller/Auth/previouslockerController/previouslockerController.js";



const route = express.Router();

// --------------get all locker route------------------
route.get("/previousAllLocker", previousLockerController)

// ---------------update by id route --------------------

route.put('/updatebyid/', previousLockerUpdateController)
//  ----------------get by prevous locker by id --------------------

route.get('/getbyid/:id', previousLockerGetByIdController)

// ----------------admin pre update--------------

route.put('/adminpreupdate', previousAdminLockerUpdateController)
// ---------------pre admim ---------------
route.get('/preAdmin', previousAdminLockerController)
// --------------get by id preAdmin----------------
route.get('/getPreAdminById/:id', preAdminLockerGetByIdController)






export default route;
