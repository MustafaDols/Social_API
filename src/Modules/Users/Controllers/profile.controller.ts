import { Router } from "express";
import { authentication, Multer } from "../../../Middlewares";
import profileService from "../Services/profile.service";
const profileController = Router();

// update profile
profileController.put("/update-profile/:id", profileService.updateProfile)

// delete profile
profileController.delete("/delete-account", authentication, profileService.deleteAccount)

// get profile data

// upload profile picture
profileController.post("/upload-profile", authentication, Multer().single("profilePicture"), profileService.uploadProfilePicture)

// upload cover picture

// list all users 

// renew signed url 
profileController.post("/renew-signed-url", authentication, profileService.renewSignedUrl)

// send friend request
profileController.post("/send-friend-request", authentication, profileService.sendFriendShipRequest)

// list friend requests
profileController.get("/list-friend-requests", authentication, profileService.listFriendRequests)

// respond to friend request
profileController.patch("/respond-to-friend-request", authentication, profileService.respondToFriendRequest)


export { profileController }