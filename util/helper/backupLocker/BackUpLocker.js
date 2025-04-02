import UserModel from "../../../model/Auth/userModel/UserModel.js";
import previouslockerModel from "../../../model/locker/previouslocker/previouslocker.js";


export const StoreLocker = async (_id) => {
    try {
        if (!_id) {
            console.log("❌ StoreLocker Error: No ID provided");
            return;
        }

        const findCurrentLocker = await UserModel.findById(_id);

        if (!findCurrentLocker) {
            console.log("⚠️ StoreLocker Warning: Current locker not found");
            return;
        }

        console.log("🚀 ~ StoreLocker ~ findCurrentLocker:", findCurrentLocker);

    } catch (error) {
        console.error("🚨 StoreLocker Error:", error);
    }
};