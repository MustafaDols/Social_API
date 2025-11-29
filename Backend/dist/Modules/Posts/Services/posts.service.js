"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const s3_client_utils_1 = require("./../../../Utils/Services/s3-client.utils");
const Repositories_1 = require("../../../DB/Repositories");
const Common_1 = require("../../../Common");
const Utils_1 = require("../../../Utils");
const Models_1 = require("../../../DB/Models");
class PostService {
    constructor() {
        this.postRepo = new Repositories_1.PostRepository();
        this.userRepo = new Repositories_1.UserRepository(Models_1.UserModel);
        this.friendShipRepo = new Repositories_1.FriendShipRepository();
        this.S3ClientService = new s3_client_utils_1.S3ClientService();
        this.addPost = async (req, res, next) => {
            const { user: { _id } } = req.loggedInUser;
            const { description, allowComments, tags } = req.body;
            const files = req.files;
            if (!description && (files && !files.length))
                throw new Utils_1.BadRequestException('Description or files is required');
            let uniqueTags = [];
            if (tags) {
                const users = await this.userRepo.findDocuments({ _id: { $in: tags } });
                if (users.length !== tags.length)
                    throw new Utils_1.BadRequestException('Invalid tags');
                // validate friends
                const friends = await this.friendShipRepo.findDocuments({
                    status: Common_1.FriendShipStatusEnum.ACCEPTED,
                    $or: [
                        { requestFromId: _id, requestToId: { $in: tags } },
                        { requestFromId: { $in: tags }, requestToId: _id }
                    ]
                });
                if (friends.length !== tags.length)
                    throw new Utils_1.BadRequestException('Invalid tags');
                uniqueTags = Array.from(new Set(tags));
            }
            let attachments = [];
            if (files?.length) {
                const uploadedData = await this.S3ClientService.UploadFilesOnS3(files, `${_id}/posts`);
                attachments = uploadedData.map(({ key }) => (key));
            }
            const post = await this.postRepo.createNewDocument({
                description,
                ownerId: _id,
                attachments,
                allowComments,
                tags: uniqueTags
            });
            return res.status(201).json({
                success: true,
                message: 'Post added successfully',
                data: post
            });
        };
        this.listHomePosts = async (req, res, next) => {
            // const { user: { _id } } = (req as IRequest).loggedInUser
            const { page, limit } = req.query;
            const { limit: currentLimit, skip } = (0, Utils_1.pagiantion)({ page: Number(page), limit: Number(limit) });
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
            });
            return res.status(200).json({
                success: true,
                message: 'Posts fetched successfully',
                data: { posts }
            });
        };
    }
}
exports.default = new PostService();
