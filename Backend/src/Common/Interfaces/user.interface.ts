import { Document, Types } from "mongoose";
import { GenderEnum, ProviderEnum, RoleEnum, OtpTypesEnum, FriendShipStatusEnum } from "..";
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

interface IMessage {
    _id?: Types.ObjectId;
    text?: string;
    conversationId: Types.ObjectId;
    senderId: Types.ObjectId;
    attachments?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}
interface IConversation {
    _id?: Types.ObjectId;
    type?: "direct" | "group" | string;
    name?: string;
    members?: Types.ObjectId[] | undefined;
    createdAt?: Date;
    updatedAt?: Date;
}

interface IOtp {
    value: string;
    expiresAt: number;
    otpType: OtpTypesEnum;
}

interface IUser extends Document<Types.ObjectId> {
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

interface IFriendShip extends Document<Types.ObjectId> {
    requestFromId: Types.ObjectId,
    requestToId: Types.ObjectId,
    status: FriendShipStatusEnum
}




export { IUser, IEmailArgument, IRequest, IBlackListedToken, IFriendShip, IMessage, IConversation }