import goggleModel from "../../../model/goggle/GoggleModel.js";
import fs from "fs";
import path from "path";

const deleteGoggle = async () => {
    try {
        const result = await goggleModel.deleteMany({});
        console.log("Delete Result:", result);
        return result;
    } catch (error) {
        console.error("Error deleting goggles:", error);
        throw error;
    }
};

// deleteGoggle()



const insertGogglesFromFile = async () => {
    try {
        // Fix the file path issue
        const filePath = path.resolve("D:/Bash/api/changeroom/goggleIssueList.json");

        // Read the JSON file
        const jsonData = fs.readFileSync(filePath, "utf-8");
        const gogglesData = JSON.parse(jsonData);

        // Insert into MongoDB
        const result = await goggleModel.insertMany(gogglesData);
        console.log("Inserted Goggles:", result);
        return result;
    } catch (error) {
        console.error("Error inserting goggles:", error);
        throw error;
    }
};

// insertGogglesFromFile();

