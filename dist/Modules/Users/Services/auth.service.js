"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const black_listed_repository_1 = require("./../../../DB/Repositories/black-listed.repository");
const Common_1 = require("../../../Common");
const user_repository_1 = require("../../../DB/Repositories/user.repository");
const Models_1 = require("../../../DB/Models");
const Utils_1 = require("../../../Utils");
const Utils_2 = require("../../../Utils");
const hash_utils_1 = require("../../../Utils/Encryption/hash.utils");
const token_utils_1 = require("../../../Utils/Encryption/token.utils");
const uuid_1 = __importDefault(require("uuid"));
const response_helper_utils_1 = require("../../../Utils/Response/response-helper.utils");
class AuthService {
    constructor() {
        this.userRepo = new user_repository_1.UserRepository(Models_1.UserModel);
        this.blackListedRepo = new black_listed_repository_1.BlackListedRepository(Models_1.BlacklistedTokensModel);
        this.signUp = async (req, res, next) => {
            const { firstName, lastName, email, password, gender, phoneNumber, DOB } = req.body;
            const isEmailExists = await this.userRepo.findOneDocument({ email }, 'email');
            if (isEmailExists)
                return res.status(409).json({ message: 'Email already exists', data: { invalidEmail: email } });
            // Encrypt phone number
            const encryptedPhoneNumber = (0, Utils_1.encrypt)(phoneNumber);
            // Hash password
            const hashedPassword = (0, Utils_1.generateHash)(password);
            // Send OTP
            const otp = Math.floor(Math.random() * 1000000).toString();
            Utils_2.emitter.emit('sendEmail', {
                to: email,
                subject: 'Verify your email',
                content: `Your OTP is ${otp}`
            });
            const confirmationOtp = {
                value: (0, Utils_1.generateHash)(otp),
                expiresAt: Date.now() + 600000,
                otpType: Common_1.OtpTypesEnum.CONFIRMATION
            };
            const newUser = await this.userRepo.createNewDocument({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                gender,
                DOB,
                phoneNumber: encryptedPhoneNumber,
                OTPS: [confirmationOtp]
            });
            return res.status(201).json((0, response_helper_utils_1.SuccessResponse)('User created successfully', 201, newUser));
        };
        this.SignIn = async (req, res) => {
            const { email, password } = req.body;
            const user = await this.userRepo.findOneDocument({ email });
            if (!user)
                return res.status(401).json({ message: 'Email/password is incorrect' });
            const isPasswordMatched = (0, hash_utils_1.compareHash)(password, user.password);
            if (!isPasswordMatched)
                return res.status(401).json({ message: 'Email/password is incorrect' });
            const accessToken = (0, token_utils_1.generateToken)({
                _id: user._id,
                email: user.email,
                provider: user.provider,
                role: user.role,
            }, process.env.JWT_ACCESS_SECRET, {
                expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
                jwtid: uuid_1.default.v4(),
            });
            const refreshToken = (0, token_utils_1.generateToken)({
                _id: user._id,
                email: user.email,
                provider: user.provider,
                role: user.role,
            }, process.env.JWT_REFRESH_SECRET, {
                expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
                jwtid: uuid_1.default.v4(),
            });
            res.status(200).json({ message: 'User logged in successfully', data: { tokens: { accessToken, refreshToken } } });
        };
        this.ConfirmEmail = async (req, res, next) => {
            const { email, otp } = req.body;
            const user = await this.userRepo.findOneDocument({
                email,
                isConfirmed: false,
            });
            if (!user)
                return res.status(409).json({
                    message: "invalid Email",
                    data: { invalidEmail: email },
                });
            const confirmationOtp = user.OTPS?.find((otpItem) => otpItem.otpType === Common_1.OtpTypesEnum.CONFIRMATION);
            if (!confirmationOtp) {
                return res.status(400).json({ message: "No confirmation OTP found" });
            }
            const isOtpMatched = (0, hash_utils_1.compareHash)(otp, confirmationOtp.value);
            if (!isOtpMatched) {
                return res.status(400).json({ message: "Invalid OTP" });
            }
            user.isVerified = true;
            user.OTPS = user.OTPS?.filter((otpItem) => otpItem.otpType !== Common_1.OtpTypesEnum.CONFIRMATION);
            await user.save();
            return res.status(201).json({ message: "User confirmed succesfully" });
        };
        this.logOut = async (req, res) => {
            const { token: { jti, exp } } = req.loggedInUser;
            const blackListedToken = await this.blackListedRepo.createNewDocument({
                tokenId: jti, expiresAt: new Date(exp || Date.now() + 600000)
            });
            res.status(200).json({ message: 'User logged out successfully', data: { blackListedToken } });
        };
    }
}
exports.default = new AuthService();
