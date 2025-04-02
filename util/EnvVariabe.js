import dotenv from 'dotenv'
import { customConsole } from './Util.js'

dotenv.config()


const _config = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    NodeEmail_Email: process.env.NodeEmail_Email,
    nodeEmailPassword: process.env.nodeEmailPassword,
    auth_Token: process.env.auth_Token,
    Account_sid: process.env.Account_sid,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
    cloud_name: process.env.cloud_name,
    giphyKey: process.env.giphyKey,
    OTP: process.env.OTP,
}




export const config = {
    get(key) {
        const value = _config[key]
        if (!value) {
            customConsole(`variable is not defined make sure you have set it in your .env file`, key);
            process.exit()
        }
        return value
    }
}



