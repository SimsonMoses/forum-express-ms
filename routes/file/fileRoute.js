import express from "express";

import {fileUploadMiddleware} from "../../middleware/fileHandleMiddleware.js";
import {fileUpload} from "../../controller/file/fileController.js";

const router = express.Router();

router.post("/upload", fileUploadMiddleware, fileUpload);

export default router;