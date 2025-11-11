"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const express_1 = require("express");
const auth_service_1 = __importDefault(require("../Services/auth.service"));
const Middlewares_1 = require("../../../Middlewares");
const Validators_1 = require("../../../Validators");
const authController = (0, express_1.Router)();
exports.authController = authController;
// signup
authController.post('/signUp', (0, Middlewares_1.ValidatonMiddleware)(Validators_1.SignUpValidator), auth_service_1.default.signUp);
// signin
authController.post('/signIn', auth_service_1.default.SignIn);
// confirm email
authController.post('/confirmEmail', Middlewares_1.authentication, auth_service_1.default.ConfirmEmail);
// authController.post('/confirmEmail', AuthService.confirmEmail)
// forgot password 
// reset password
// Authentication with gmail
// Resend
// logout
authController.post('/logout', Middlewares_1.authentication, auth_service_1.default.logOut);
