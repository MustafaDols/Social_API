import { Request, Response } from "express";
import { BadRequestException, S3ClientService } from "../../../Utils";
import { IRequest, IFriendShip, FriendShipStatusEnum } from "../../../Common";
import { SuccessResponse } from "../../../Utils/Response/response-helper.utils";
import { UserModel } from "../../../DB/Models";
import { UserRepository, FriendShipRepository, ConversationRepository } from "../../../DB/Repositories";
import mongoose, { FilterQuery } from "mongoose";
import { access } from "fs";


export class profileService {
    private s3Client = new S3ClientService()
    private userRepo = new UserRepository(UserModel)
    private friendShipRepo = new FriendShipRepository()
    private conversationRepo = new ConversationRepository()


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
        const deletedDocument = await this.userRepo.deleteByIdDocument(user._id)
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

    sendFriendShipRequest = async (req: Request, res: Response) => {

        const { user: { _id } } = (req as IRequest).loggedInUser
        const { requestToId } = req.body

        const user = await this.userRepo.findDocumentById(requestToId)
        if (!user) throw new BadRequestException('User not found')

        this.friendShipRepo.createNewDocument({ requestFromId: _id, requestToId })

        res.json(SuccessResponse<unknown>('Friend ship request sent successfully', 200))
    }


    listFriendRequests = async (req: Request, res: Response) => {
        const { user: { _id } } = (req as IRequest).loggedInUser
        const { status } = req.query

        const filters: FilterQuery<IFriendShip> = { status: status ? status : FriendShipStatusEnum.PENDING }

        if (filters.status == FriendShipStatusEnum.ACCEPTED) filters.$or = [{ requestToId: _id }, { requestFromId: _id }]
        else filters.requestToId = _id

        const requests = await this.friendShipRepo.findDocuments(
            filters,
            undefined,
            {
                populate: [
                    {
                        path: 'requestFromId',
                        select: 'firstName lastName profilePicture'
                    },
                    {
                        path: 'requestToId',
                        select: 'firstName lastName profilePicture'
                    }
                ]
            })
        res.json(SuccessResponse<IFriendShip[]>('Requests fetched successfully', 200, requests))
    }


    respondToFriendRequest = async (req: Request, res: Response) => {
        const { user: { _id } } = (req as IRequest).loggedInUser
        const { friendRequestId, respone } = req.body

        const friendRequest = await this.friendShipRepo.findOneDocument({ _id: friendRequestId, requestToId: _id, status: FriendShipStatusEnum.PENDING })
        if (!friendRequest) throw new BadRequestException('Friend request not found')

        friendRequest.status = respone
        await friendRequest.save()

        res.json(SuccessResponse<IFriendShip>('Requests fetched successfully', 200, friendRequest))
    }



    createGroup = async (req: Request, res: Response) => {
        const { user: { _id }, } = (req as IRequest).loggedInUser
        const { name, memberIds } = req.body // 'test', ['','']
        const members = await this.userRepo.findDocuments({ _id: { $in: memberIds } })
        if (members.length !== memberIds.length) throw new BadRequestException('Members not found')

        const friendship = await this.friendShipRepo.findDocuments({
            $or: [
                { requestFromId: _id, requestToId: { $in: memberIds } },
                { requestFromId: { $in: memberIds }, requestToId: _id }
            ],
            status: FriendShipStatusEnum.ACCEPTED
        })

        if (friendship.length !== memberIds.length) throw new BadRequestException('Members not found')

        const group = await this.conversationRepo.createNewDocument({
            type: 'group',
            name,
            members: [_id, ...memberIds]
        })

        const groups = await this.conversationRepo.findDocuments({ type: 'group', members: { $in: _id } })
        res.json(SuccessResponse('Group created successfully', 200, group))
    }

}

export default new profileService() 