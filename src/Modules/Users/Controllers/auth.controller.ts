import { Router } from "express";
import AuthService from "../Services/auth.service";
const authController = Router();

// signup
authController.post('/signUp', AuthService.signUp)
// signin

// confirm email

// forgot password 

// reset password

// Authentication with gmail

// Resend

export { authController } 