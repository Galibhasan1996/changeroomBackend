import dotenv from "dotenv"
import express from "express"
import morgan from "morgan"
import cors from "cors"
import helmet from "helmet"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import ExpressMongoSanitize from "express-mongo-sanitize"
import mongoSanitize from "express-mongo-sanitize"
import rateLimit from "express-rate-limit"
import hpp from "hpp"
import { currentIPAddress, currentTime } from "./util/Util.js"
import { config } from "./util/EnvVariabe.js"
import chalk from "chalk"
import { connectDB } from "./db.js"
import AuthRoute from "./route/AuthRoute/AuthRoute.js"
import previous from "./route/AuthRoute/previouslockerRoute/previouslockerRoute.js"
import Admin from "./route/Admin/AdminRoute.js"
import goggle from "./route/goggle/goggleRoute.js"
import cloudinary from 'cloudinary';


dotenv.config()




// cloudinary config

cloudinary.config({
    cloud_name: config.get("cloud_name"),
    api_key: config.get("api_key"),
    api_secret: config.get("api_secret"),
    secure: true
});



connectDB()
const app = express()



app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(helmet())
app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(mongoSanitize())
app.use(ExpressMongoSanitize())
app.use(hpp())

app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
}))

app.use("/api/v1/auth", AuthRoute)
app.use("/api/v1/previous", previous)
app.use("/api/v1/admin", Admin)
app.use("/api/v1/goggle", goggle)



app.get("/", (req, res) => {
    res.json({ message: "Welcome to the Changeroom API" })
})



app.listen(config.get("PORT"), () => {
    console.log(`Server run ( ${chalk.bold.red(currentIPAddress())}:${chalk.bold.red(config.get("PORT"))} ${chalk.bold.red(currentTime)} )`);
})
