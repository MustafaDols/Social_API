"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Common_1 = require("../../../Common");
const user_repository_1 = require("../../../DB/Repositories/user.repository");
const Models_1 = require("../../../DB/Models");
const Utils_1 = require("../../../Utils");
const Utils_2 = require("../../../Utils");
class AuthService {
    constructor() {
        this.userRepo = new user_repository_1.UserRepository(Models_1.UserModel);
        this.signUp = async (req, res, next) => {
            const { firstName, lastName, email, password, gender, DOB, phoneNumber } = req.body;
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
            return res.status(201).json({ message: 'User created successfully', data: { newUser } });
        };
    }
}
exports.default = new AuthService();
