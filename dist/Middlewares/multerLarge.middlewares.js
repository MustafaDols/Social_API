"use strict";
// import multer, { type FileFilterCallback } from "multer";
// import type { Request } from "express";
// import { allowedFileExtentions, fileTyps } from "../Common/Constants/file.constant.js";
// export const hostuploadLarge = () => {
//     const storage = multer.diskStorage({});
//     const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
//         console.log("Incoming File:", {
//             fieldname: file.fieldname,
//             originalname: file.originalname,
//             mimetype: file.mimetype,
//         });
//         const [keyPart, fileExtension] = file.mimetype.split("/");
//         if (!keyPart || !fileExtension) {
//             return cb(new Error("invalid mimetype format"));
//         }
//         const fileKey = keyPart.toUpperCase();
//         const fileType = (fileTyps as Record<string, string>)[fileKey];
//         if (!fileType) {
//             return cb(new Error("invalid file type"));
//         }
//         if (!allowedFileExtentions[fileType]?.includes(fileExtension)) {
//             return cb(new Error("invalid file extension"));
//         }
//         cb(null, true);
//     };
//     return multer({
//         limits: { fileSize: 1024 * 1024 * 5 }, 
//         fileFilter,
//         storage,
//     }).single("profile");
// };
