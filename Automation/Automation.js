import cron from 'node-cron';
import UserModel from '../model/Auth/userModel/UserModel.js';



export const removeUnverifiedAccounts = () => {
    cron.schedule("*/30 * * * *", async () => {
        try {
            const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
            const result = await UserModel.deleteMany({
                verified: false,
                createdAt: { $lt: thirtyMinutesAgo },
            });

            console.log(`Deleted ${result.deletedCount} unverified accounts at ${new Date().toISOString()}`);
        } catch (error) {
            console.log("🚀 ~ Automation.js:17 ~ cron.schedule ~ error:", error)
        }
    });
};
