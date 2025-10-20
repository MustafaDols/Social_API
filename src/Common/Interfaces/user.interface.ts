import { Document } from "mongoose";
import { GenderEnum, ProviderEnum, RoleEnum, OtpTypesEnum } from "..";
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

interface IOtp {
    value: string;
    expiresAt: number;
    otpType: OtpTypesEnum;
}

interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: RoleEnum;
    gender: GenderEnum;
    DOB?: Date;
    profilePicture?: string;
    coverPicture?: string;
    provider: ProviderEnum;
    googleId?: string;
    phoneNumber?: string;
    isVerified: boolean;
    OTPS?: IOtp[]
}

interface IEmailArgument {
    to: string,
    cc?: string,
    subject: string,
    content: string,
    attachments?: []
}

interface IRequest extends Request {
    loggedInUser: { user: IUser, token: JwtPayload }
}

interface IBlackListedToken extends Document {
    tokenId: string,
    expiresAt: Date
}


export { IUser, IEmailArgument, IRequest, IBlackListedToken }