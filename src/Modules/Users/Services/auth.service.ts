import { BlackListedRepository } from './../../../DB/Repositories/black-listed.repository';
import { Request, Response, NextFunction } from "express"
import { IUser, OtpTypesEnum, IRequest } from "../../../Common"
import { UserRepository } from "../../../DB/Repositories/user.repository"
import { BlacklistedTokensModel, UserModel } from "../../../DB/Models"
import { encrypt, generateHash } from "../../../Utils"
import { emitter } from "../../../Utils"
import { compareHash } from "../../../Utils/Encryption/hash.utils"
import { generateToken } from "../../../Utils/Encryption/token.utils"
import uuid from 'uuid';
import { SignOptions } from "jsonwebtoken"
import { VerifyOptions } from "jsonwebtoken"
import { compareSync } from 'bcrypt';
import { SuccessResponse } from '../../../Utils/Response/response-helper.utils';


class AuthService {

    private userRepo: UserRepository = new UserRepository(UserModel)
    private blackListedRepo: BlackListedRepository = new BlackListedRepository(BlacklistedTokensModel)

    signUp = async (req: Request, res: Response, next: NextFunction) => {
        const { firstName, lastName, email, password, gender, DOB, phoneNumber }: Partial<IUser> = req.body

        const isEmailExists = await this.userRepo.findOneDocument({ email }, 'email')
        if (isEmailExists) return res.status(409).json({ message: 'Email already exists', data: { invalidEmail: email } })

        // Encrypt phone number
        const encryptedPhoneNumber = encrypt(phoneNumber as string)

        // Hash password
        const hashedPassword = generateHash(password as string)

        // Send OTP
        const otp = Math.floor(Math.random() * 1000000).toString()
        emitter.emit('sendEmail',
            {
                to: email,
                subject: 'Verify your email',
                content: `Your OTP is ${otp}`
            })

        const confirmationOtp = {
            value: generateHash(otp),
            expiresAt: Date.now() + 600000,
            otpType: OtpTypesEnum.CONFIRMATION
        }

        const newUser = await this.userRepo.createNewDocument({
            firstName, 
            lastName,
            email,
            password: hashedPassword,
            gender,
            DOB,
            phoneNumber: encryptedPhoneNumber,
            OTPS: [confirmationOtp]
        })

        return res.status(201).json(SuccessResponse<IUser>('User created successfully', 201, newUser))
    }

    SignIn = async (req: Request, res: Response) => {

        const { email, password } = req.body;

        const user: IUser | null = await this.userRepo.findOneDocument({ email });
        if (!user) return res.status(401).json({ message: 'Email/password is incorrect' });

        const isPasswordMatched = compareHash(password, user.password);
        if (!isPasswordMatched) return res.status(401).json({ message: 'Email/password is incorrect' });

        const accessToken = generateToken(
            {
                _id: user._id,
                email: user.email,
                provider: user.provider,
                role: user.role,
            },
            process.env.JWT_ACCESS_SECRET as string,
            {
                expiresIn: process.env.JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn'],
                jwtid: uuid.v4(),
            }
        );

        const refreshToken = generateToken(
            {
                _id: user._id,
                email: user.email,
                provider: user.provider,
                role: user.role,
            },
            process.env.JWT_REFRESH_SECRET as string,
            {
                expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'],
                jwtid: uuid.v4(),
            }
        );

        res.status(200).json({ message: 'User logged in successfully', data: { tokens: { accessToken, refreshToken } } })
    }

    ConfirmEmail = async (req: Request, res: Response, next: NextFunction) => {
        const { email, otp }: { email: string; otp: string } = req.body;

        const user = await this.userRepo.findOneDocument({
            email,
            isConfirmed: false,
        });
        if (!user)
            return res.status(409).json({
                message: "invalid Email",
                data: { invalidEmail: email },
            });

        const confirmationOtp = user.OTPS?.find(
            (otpItem) => otpItem.otpType === OtpTypesEnum.CONFIRMATION
        );
        if (!confirmationOtp) {
            return res.status(400).json({ message: "No confirmation OTP found" });
        }

        const isOtpMatched = compareHash(otp, confirmationOtp.value);
        if (!isOtpMatched) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        user.isVerified = true;

        user.OTPS = user.OTPS?.filter(
            (otpItem) => otpItem.otpType !== OtpTypesEnum.CONFIRMATION
        );

        await (user as any).save();

        return res.status(201).json({ message: "User confirmed succesfully" });
    };

    logOut = async (req: Request, res: Response) => {
        const { token: { jti, exp } } = (req as unknown as IRequest).loggedInUser
        const blackListedToken = await this.blackListedRepo.createNewDocument({
            tokenId: jti, expiresAt: new Date(exp || Date.now() + 600000)
        })
        res.status(200).json({ message: 'User logged out successfully', data: { blackListedToken } })
    }
}

export default new AuthService()
