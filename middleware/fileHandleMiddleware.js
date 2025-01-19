// import multer from "multer";
// import { Readable } from "stream";

// /**
//  * Middleware for handling file uploads with Multer.
//  */
// const upload = multer({ storage: multer.memoryStorage() });
//
// export const fileUploadMiddleware = upload.single("file");
//
// /**
//  * Converts the uploaded file into a readable stream for AWS S3.
//  * @param {Object} file - The uploaded file from Multer.
//  * @returns {Object} Streamed file data for AWS S3.
//  */
// export const processFile = (file) => {
//     if (!file) {
//         throw new Error("No file uploaded");
//     }
//
//     return {
//         fileStream: Readable.from(file.buffer),
//         mimeType: file.mimetype,
//         originalName: file.originalname,
//     };
// };

import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

export const fileUploadMiddleware = (req, res, next) => {
    upload.single("file")
    (req, res, (err) => {
        if (err) {
            console.error("Multer error:", err);
            return res.status(500).json({ message: "Failed to process file", error: err.message });
        }
        if (!req.file) {
            console.error("No file uploaded");
            return res.status(400).json({ message: "No file uploaded" });
        }
        console.log("File processed successfully:", req.file);
        next();
    });
};
