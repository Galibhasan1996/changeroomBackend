import express from "express";
import { goggleController, goggleCreateController, goggleDeleteController, shoeController, shoeCreateController, shoeDeleteController } from "../../controller/goggle/goggleController.js";
import { validateGoggle, validateShoe } from "../../util/Validator/Validator.js";

const route = express.Router();


// ----------------get all goggle----------------

route.get("/goggle", goggleController)

// ------------create goggle-------------------
route.post("/createGoggle", validateGoggle, goggleCreateController)

route.get('/shoe', shoeController)

route.post("/createShoe", validateShoe, shoeCreateController)

// -------------delete by id shoe ----------------
route.delete("/deletebyid/:id", shoeDeleteController)

route.delete("/deleteGoggleById/:id", goggleDeleteController)



export default route


