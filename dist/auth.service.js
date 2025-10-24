"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../../../Common/index.js");
const user_repository_js_1 = require("../../../DB/Repositorye/user.repository.js");
const user_modle_js_1 = require("../../../DB/Modles/user.modle.js");
const hash_utils_js_1 = require("../../../Utils/Encryption/hash.utils.js");
const index_js_2 = require("../../../Utils/index.js");
const tokens_utils_js_1 = require("../../../Utils/Tokens/tokens.utils.js");
const uuid_1 = require("uuid");
const black_listed_repository_js_1 = require("../../../DB/Repositorye/black-listed.repository.js");
const blackList_model_js_1 = require("../../../DB/Modles/blackList.model.js");
const exception_utils_js_1 = require("../../../Utils/Errors/exception.utils.js");
const response_helper_utils_js_1 = require("../../../Utils/Responses/response-helper.utils.js");
const cloundiary_service_js_1 = require("../../../Common/Service/cloundiary.service.js");
class AuthService {
    constructor() {
        this.userRepo = new user_repository_js_1.userRepository(user_modle_js_1.UserModel);
        this.blackListRepo = new black_listed_repository_js_1.BlackListedRepository(blackList_model_js_1.BlackList);
        this.signUp = async (req, res, next) => {
            const { firstName, lastName, email, age, gender, DOB, phoneNumber, password, } = req.body;
            const isEmailExist = await this.userRepo.findonDocoment({ email }, "email");
            if (isEmailExist)
                throw new exception_utils_js_1.ConflictExeption("Email already exists", {
                    invalidEmail: email,
                });
            const otp = Math.floor(Math.random() * 1000000).toString();
            index_js_2.localEmitter.emit("sendEmail", {
                to: email,
                subject: "otp for signUp",
                content: `Your otp is ${otp}`,
            });
            const confirmationOtp = {
                value: (0, hash_utils_js_1.generateHash)(otp),
                expiresAt: Date.now() + 600000,
                otpType: index_js_1.otpTypesEnum.CONFIRMATION,
            };
            const newUser = await this.userRepo.createNewDocoment({
                firstName,
                lastName,
                email,
                password,
                gender,
                DOB,
                phoneNumber,
                age,
                OTPS: [confirmationOtp],
            });
            return res
                .status(201)
                .json((0, response_helper_utils_js_1.SucessResponse)("User creates successfully", 201, newUser));
        };
        this.signIn = async (req, res, next) => {
            const { email, password } = req.body;
            const user = await this.userRepo.findonDocoment({ email });
            if (!user)
                return res.status(409).json({
                    message: "invaild email or password",
                    data: { invalidEmail: email },
                });
            const isPasswrdMatch = (0, hash_utils_js_1.compareHash)(password, user.password);
            if (!isPasswrdMatch) {
                return res.status(404).json({ message: "invaild email or password" });
            }
            const { JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRES_IN, JWT_REFERSH_SECRET, JWT_REFERSH_EXPIRES_IN, } = process.env;
            if (!JWT_ACCESS_SECRET ||
                !JWT_ACCESS_EXPIRES_IN ||
                !JWT_REFERSH_SECRET ||
                !JWT_REFERSH_EXPIRES_IN) {
                throw new Error("JWT environment variables are not set properly");
            }
            if (!user._id) {
                return res.status(500).json({ message: "User ID is missing" });
            }
            const accesstoken = (0, tokens_utils_js_1.generateToken)({ _id: user._id.toString(), email: user.email }, JWT_ACCESS_SECRET, {
                expiresIn: Number(process.env.JWT_ACCESS_EXPIRES_IN),
                jwtid: (0, uuid_1.v4)(),
            });
            const refershToken = (0, tokens_utils_js_1.generateToken)({ _id: user._id.toString(), email: user.email }, JWT_REFERSH_SECRET, {
                expiresIn: Number(JWT_REFERSH_EXPIRES_IN),
                jwtid: (0, uuid_1.v4)(),
            });
            return res.status(201).json({
                message: "User signIn succesfully",
                date: { user, accesstoken, refershToken },
            });
        };
        this.confirmEmail = async (req, res, next) => {
            const { email, otp } = req.body;
            const user = await this.userRepo.findonDocoment({
                email,
                isConfirmed: false,
            });
            if (!user)
                return res.status(409).json({
                    message: "invalid Email",
                    data: { invalidEmail: email },
                });
            const confirmationOtp = user.OTPS?.find((otpItem) => otpItem.otpType === index_js_1.otpTypesEnum.CONFIRMATION);
            if (!confirmationOtp) {
                return res.status(400).json({ message: "No confirmation OTP found" });
            }
            const isOtpMatched = (0, hash_utils_js_1.compareHash)(otp, confirmationOtp.value);
            if (!isOtpMatched) {
                return res.status(400).json({ message: "Invalid OTP" });
            }
            user.isConfirmed = true;
            user.OTPS = user.OTPS?.filter((otpItem) => otpItem.otpType !== index_js_1.otpTypesEnum.CONFIRMATION);
            await user.save();
            return res.status(201).json({ message: "User confirmed succesfully" });
        };
        this.logout = async (req, res) => {
            const { token: { jti, exp }, } = req.loggedInUser;
            const blackListToken = await this.blackListRepo.createNewDocoment({
                expirationDate: new Date(exp || Date.now() + 600000),
                tokenId: jti,
            });
            res.status(200).json({
                message: "user logged out successfully",
                date: { blackListToken },
            });
        };
        this.deletAcoount = async (req, res) => {
            const { user: { _id }, } = req.loggedInUser;
            const deletedUser = await user_modle_js_1.UserModel.findByIdAndDelete(_id);
            if (!deletedUser) {
                return res.status(404).json({ message: "User not found" });
            }
            if (deletedUser.profilePicture?.public_id) {
                await (0, cloundiary_service_js_1.deleteFileCloudinary)(deletedUser.profilePicture.public_id);
            }
            return res
                .status(201)
                .json({ message: "User deleted succesfully", deletedUser });
        };
    }
}
exports.default = new AuthService();
