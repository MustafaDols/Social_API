import { Router } from "express";
import { authentication , Multer} from "../../../Middlewares";
import profileService from "../Services/profile.service";
const profileController = Router();

// update profile

// delete profile
profileController.delete("/delete-account", authentication, profileService.deleteAccount)

// get profile data

// upload profile picture
profileController.post("/upload-profile", authentication, Multer().single("profilePicture"), profileService.uploadProfilePicture)
 
// upload cover picture

// list all users 

// renew signed url 
profileController.post("/renew-signed-url", authentication, profileService.renewSignedUrl)

export { profileController }