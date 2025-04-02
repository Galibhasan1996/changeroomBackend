import mongoose from "mongoose";
import { config } from "./util/EnvVariabe.js";
import { currentIPAddress, currentTime, customConsole } from "./util/Util.js";
import chalk from "chalk";

export const connectDB = async () => {
    try {
        mongoose.connect(config.get("MONGO_URI"),)
            .then(() => {
                console.log(`DB Connected ( ${chalk.bold.red(currentIPAddress())}:${chalk.bold.red(config.get("PORT"))} ${chalk.bold.red(currentTime)} )`);
            })
            .catch((error) => {
                customConsole("🚀 ~ file: db.js:16 ~ connectDB ~ error:", error.message)
            })
    } catch (error) {
        customConsole("🚀 ~ file: db.js:19 ~ connectDB ~ error:", error.message)
    }
}




