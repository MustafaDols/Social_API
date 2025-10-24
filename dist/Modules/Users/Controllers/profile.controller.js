"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileController = void 0;
const express_1 = require("express");
const Middlewares_1 = require("../../../Middlewares");
const profile_service_1 = __importDefault(require("../Services/profile.service"));
const profileController = (0, express_1.Router)();
exports.profileController = profileController;
// update profile
profileController.put("/update-profile/:id", profile_service_1.default.updateProfile);
// delete profile
profileController.delete("/delete-account", Middlewares_1.authentication, profile_service_1.default.deleteAccount);
// get profile data
// upload profile picture
profileController.post("/upload-profile", Middlewares_1.authentication, (0, Middlewares_1.Multer)().single("profilePicture"), profile_service_1.default.uploadProfilePicture);
// upload cover picture
// list all users 
// renew signed url 
profileController.post("/renew-signed-url", Middlewares_1.authentication, profile_service_1.default.renewSignedUrl);
