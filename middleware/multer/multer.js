import multer from "multer";
const storage = multer.memoryStorage()
import DataURIParser from 'datauri/parser.js';
import path from 'path';
// but you can use also key pair same storage

export const singleUpload = multer({ storage }).single("file")



export const getDataUri = (file) => {
    const parser = new DataURIParser();
    const extName = path.extname(file.originalname).substring(1); // Remove the dot (.)
    return parser.format(extName, file.buffer);
};




// file object

// {
//     fieldname: 'file',
//     originalname: 'Screenshot-2024-06-12-at-8.39.05 AM (2).png',
//     encoding: '7bit',
//     mimetype: 'image/png',
//     buffer: <Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 00 00 02 26 00 00 01 de 08 02 00 00 00 20 85 57 f8 00 00 00 04 67 41 4d 41 00 00 b1 8f 0b fc 61 05 00 ... 593843 more bytes>,
//     size: 593893
//   }


