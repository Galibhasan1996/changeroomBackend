import express from "express";
import { goggleController, goggleCreateController, shoeController, shoeCreateController } from "../../controller/goggle/goggleController.js";
import { validateGoggle, validateShoe } from "../../util/Validator/Validator.js";

const route = express.Router();


// ----------------get all goggle----------------

route.get("/goggle", goggleController)

// ------------create goggle-------------------
route.post("/createGoggle", validateGoggle, goggleCreateController)

route.get('/shoe', shoeController)

route.post("/createShoe", validateShoe, shoeCreateController)


export default route


