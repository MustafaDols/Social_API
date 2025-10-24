import { Request, Response } from "express";
import { BadRequestException, S3ClientService } from "../../../Utils";
import { IRequest } from "../../../Common";
import { SuccessResponse } from "../../../Utils/Response/response-helper.utils";
import { UserModel } from "../../../DB/Models";
import { UserRepository } from "../../../DB/Repositories";
import mongoose from "mongoose";


export class profileService {
    private s3Client = new S3ClientService()
    private userRepo = new UserRepository(UserModel)

    uploadProfilePicture = async (req: Request, res: Response) => {
        const { file } = req
        const { user } = (req as unknown as IRequest).loggedInUser
        if (!file) throw new BadRequestException("Please upload a file")

        const uploaded = await this.s3Client.uploadLargeFileOnS3(file, `${user._id}/profile`)

        // user.profilePicture = Key
        // await user.save()

        res.json(SuccessResponse("Profile picture uploaded successfully", 200, uploaded))

    }

    renewSignedUrl = async (req: Request, res: Response) => {
        const { user } = (req as unknown as IRequest).loggedInUser
        const { key, keyType }: { key: string, keyType: "profilePicture" | "coverPicture" } = req.body

        if (user[keyType] !== key) throw new BadRequestException("Invalid key")

        const url = await this.s3Client.getFileWithSignedUrl(key)
        res.json(SuccessResponse<unknown>("Signed url renewed successfully", 200, { key, url }))
    }

    deleteAccount = async (req: Request, res: Response) => {
        const { user } = (req as unknown as IRequest).loggedInUser
        const deletedDocument = await this.userRepo.deleteByIdDocument(user._id as mongoose.Schema.Types.ObjectId)
        if (!deletedDocument) throw new BadRequestException("Account not found")
        // delete profile picture from s3
        const deletedResponse = await this.s3Client.DeleteFileFromS3(deletedDocument?.profilePicture as string)

        res.json(SuccessResponse<unknown>('Account deleted successfully', 200, deletedResponse))
    }

    updateProfile = async (req: Request, res: Response) => {
        // const { user: {_id }} = (req as unknown as IRequest).loggedInUser
        const { firstName, lastName, email, password, gender, phoneNumber, DOB } = req.body

        // const user = await this.userRepo.findDocumentById(_id as mongoose.Schema.Types.ObjectId)
        // if (!user) throw new BadRequestException("User not found")

        // if (firstName) user.firstName = firstName
        // if (lastName) user.lastName = lastName
        // if (email) user.email = email
        // if (password) user.password = password
        // if (gender) user.gender = gender
        // if (phoneNumber) user.phoneNumber = phoneNumber
        // if (DOB) user.DOB = DOB

        // await user.save()

        await this.userRepo.updateOneDocument(
            { _id: req.params._id, email },
            { $set: { firstName, lastName, email, password, gender, phoneNumber, DOB } },
            { new: true }
        )
        res.json(SuccessResponse<unknown>('Profile updated successfully', 200))
    }
}

export default new profileService() 