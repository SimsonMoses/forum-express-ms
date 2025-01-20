import expressAsyncHandler from "express-async-handler";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "../../config/awsConfig.js";
// import { processFile } from "../../middleware/fileUploadMiddleware.js";

/**
 * Handles files, uploaded to AWS S3.
 */

export const fileUpload = expressAsyncHandler(async (req, res) => {
    try {
        if (!req.file) {
            throw new Error("No file uploaded");
        }

        const { buffer, mimetype, originalname } = req.file;
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `forum-uploads/${originalname}`, // Path in the S3 bucket
            Body: buffer,
            ContentType: mimetype,
        };

        await s3Client.send(new PutObjectCommand(params));
        res.status(200).json({ message: "File uploaded successfully" });
    } catch (err) {
        console.error("Error uploading file:", err);
        res.status(500).json({ message: "Failed to upload file", error: err.message });
    }
});

