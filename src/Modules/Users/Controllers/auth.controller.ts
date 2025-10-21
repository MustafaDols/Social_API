import { Router } from "express";
import AuthService from "../Services/auth.service";
import { authentication, ValidatonMiddleware } from "../../../Middlewares";
import { SignUpValidator } from "../../../Validators";
const authController = Router();

// signup
authController.post('/signUp',ValidatonMiddleware(SignUpValidator), AuthService.signUp)
// signin
authController.post('/signIn', AuthService.SignIn)
// confirm email
authController.post('/confirmEmail', authentication, AuthService.ConfirmEmail)
// authController.post('/confirmEmail', AuthService.confirmEmail)

// forgot password 

// reset password

// Authentication with gmail

// Resend

// logout
authController.post('/logout', authentication, AuthService.logOut)
export { authController } 