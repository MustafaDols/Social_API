import { S3ClientService } from './../../../Utils/Services/s3-client.utils';
import { NextFunction, Request, Response } from "express"
import { FriendShipRepository, PostRepository, UserRepository } from "../../../DB/Repositories"
import { FriendShipStatusEnum, IRequest } from "../../../Common"
import { BadRequestException, pagiantion } from "../../../Utils"
import { PostModel, UserModel } from '../../../DB/Models';
import { Types } from 'mongoose'

class PostService {
    private postRepo = new PostRepository()
    private userRepo = new UserRepository(UserModel)
    private friendShipRepo = new FriendShipRepository()
    private S3ClientService = new S3ClientService()

    addPost = async (req: Request, res: Response, next: NextFunction) => {

        const { user: { _id } } = (req as IRequest).loggedInUser
        const { description, allowComments, tags } = req.body
        const files = req.files as Express.Multer.File[]

        if (!description && (files && !files.length)) throw new BadRequestException('Description or files is required')

        let uniqueTags: Types.ObjectId[] = []
        if (tags) {
            const users = await this.userRepo.findDocuments({ _id: { $in: tags } })
            if (users.length !== tags.length) throw new BadRequestException('Invalid tags')

            // validate friends
            const friends = await this.friendShipRepo.findDocuments({
                status: FriendShipStatusEnum.ACCEPTED,
                $or: [
                    { requestFromId: _id, requestToId: { $in: tags } },
                    { requestFromId: { $in: tags }, requestToId: _id }
                ]
            })
            if (friends.length !== tags.length) throw new BadRequestException('Invalid tags')

            uniqueTags = Array.from(new Set(tags))
        }

        let attachments: string[] = []
        if (files?.length) {
            const uploadedData = await this.S3ClientService.UploadFilesOnS3(files, `${_id}/posts`)
            attachments = uploadedData.map(({ key }) => (key))
        }

        const post = await this.postRepo.createNewDocument({
            description,
            ownerId: _id,
            attachments,
            allowComments,
            tags: uniqueTags
        })

        return res.status(201).json({
            success: true,
            message: 'Post added successfully',
            data: post
        })
    }

    listHomePosts = async (req: Request, res: Response, next: NextFunction) => {
        // const { user: { _id } } = (req as IRequest).loggedInUser
        const { page, limit } = req.query

        const { limit: currentLimit, skip } = pagiantion({ page: Number(page), limit: Number(limit) })
        console.log({ currentLimit, skip, page });

        // const posts = await this.postRepo.findDocuments({}, {}, { limit: currentLimit, skip })
        // const totalPages = (await this.postRepo.countDocuments()) / Number(limit)

        const posts = await this.postRepo.findDocuments({
            attachments: { $ne: [] }
        }, {
            limit: currentLimit,
            page: Number(page),
            customLabels: {
                totalDocs: 'totalPages',
                docs: 'posts',
                page: 'currentPage',
            },
            populate: [
                {
                    path: 'ownerId',
                    select: 'firstName lastName '
                }
            ]
        })
        return res.status(200).json({
            success: true,
            message: 'Posts fetched successfully',
            data: { posts }
        })
    }

}

export default new PostService()