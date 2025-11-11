"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileService = void 0;
const Utils_1 = require("../../../Utils");
const Common_1 = require("../../../Common");
const response_helper_utils_1 = require("../../../Utils/Response/response-helper.utils");
const Models_1 = require("../../../DB/Models");
const Repositories_1 = require("../../../DB/Repositories");
class profileService {
    constructor() {
        this.s3Client = new Utils_1.S3ClientService();
        this.userRepo = new Repositories_1.UserRepository(Models_1.UserModel);
        this.friendShipRepo = new Repositories_1.FriendShipRepository();
        this.conversationRepo = new Repositories_1.ConversationRepository();
        this.uploadProfilePicture = async (req, res) => {
            const { file } = req;
            const { user } = req.loggedInUser;
            if (!file)
                throw new Utils_1.BadRequestException("Please upload a file");
            const uploaded = await this.s3Client.uploadLargeFileOnS3(file, `${user._id}/profile`);
            // user.profilePicture = Key
            // await user.save()
            res.json((0, response_helper_utils_1.SuccessResponse)("Profile picture uploaded successfully", 200, uploaded));
        };
        this.renewSignedUrl = async (req, res) => {
            const { user } = req.loggedInUser;
            const { key, keyType } = req.body;
            if (user[keyType] !== key)
                throw new Utils_1.BadRequestException("Invalid key");
            const url = await this.s3Client.getFileWithSignedUrl(key);
            res.json((0, response_helper_utils_1.SuccessResponse)("Signed url renewed successfully", 200, { key, url }));
        };
        this.deleteAccount = async (req, res) => {
            const { user } = req.loggedInUser;
            const deletedDocument = await this.userRepo.deleteByIdDocument(user._id);
            if (!deletedDocument)
                throw new Utils_1.BadRequestException("Account not found");
            // delete profile picture from s3
            const deletedResponse = await this.s3Client.DeleteFileFromS3(deletedDocument?.profilePicture);
            res.json((0, response_helper_utils_1.SuccessResponse)('Account deleted successfully', 200, deletedResponse));
        };
        this.updateProfile = async (req, res) => {
            // const { user: {_id }} = (req as unknown as IRequest).loggedInUser
            const { firstName, lastName, email, password, gender, phoneNumber, DOB } = req.body;
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
            await this.userRepo.updateOneDocument({ _id: req.params._id, email }, { $set: { firstName, lastName, email, password, gender, phoneNumber, DOB } }, { new: true });
            res.json((0, response_helper_utils_1.SuccessResponse)('Profile updated successfully', 200));
        };
        this.sendFriendShipRequest = async (req, res) => {
            const { user: { _id } } = req.loggedInUser;
            const { requestToId } = req.body;
            const user = await this.userRepo.findDocumentById(requestToId);
            if (!user)
                throw new Utils_1.BadRequestException('User not found');
            this.friendShipRepo.createNewDocument({ requestFromId: _id, requestToId });
            res.json((0, response_helper_utils_1.SuccessResponse)('Friend ship request sent successfully', 200));
        };
        this.listFriendRequests = async (req, res) => {
            const { user: { _id } } = req.loggedInUser;
            const { status } = req.query;
            const filters = { status: status ? status : Common_1.FriendShipStatusEnum.PENDING };
            if (filters.status == Common_1.FriendShipStatusEnum.ACCEPTED)
                filters.$or = [{ requestToId: _id }, { requestFromId: _id }];
            else
                filters.requestToId = _id;
            const requests = await this.friendShipRepo.findDocuments(filters, undefined, {
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
            });
            res.json((0, response_helper_utils_1.SuccessResponse)('Requests fetched successfully', 200, requests));
        };
        this.respondToFriendRequest = async (req, res) => {
            const { user: { _id } } = req.loggedInUser;
            const { friendRequestId, respone } = req.body;
            const friendRequest = await this.friendShipRepo.findOneDocument({ _id: friendRequestId, requestToId: _id, status: Common_1.FriendShipStatusEnum.PENDING });
            if (!friendRequest)
                throw new Utils_1.BadRequestException('Friend request not found');
            friendRequest.status = respone;
            await friendRequest.save();
            res.json((0, response_helper_utils_1.SuccessResponse)('Requests fetched successfully', 200, friendRequest));
        };
        this.createGroup = async (req, res) => {
            const { user: { _id }, } = req.loggedInUser;
            const { name, memberIds } = req.body; // 'test', ['','']
            const members = await this.userRepo.findDocuments({ _id: { $in: memberIds } });
            if (members.length !== memberIds.length)
                throw new Utils_1.BadRequestException('Members not found');
            const friendship = await this.friendShipRepo.findDocuments({
                $or: [
                    { requestFromId: _id, requestToId: { $in: memberIds } },
                    { requestFromId: { $in: memberIds }, requestToId: _id }
                ],
                status: Common_1.FriendShipStatusEnum.ACCEPTED
            });
            if (friendship.length !== memberIds.length)
                throw new Utils_1.BadRequestException('Members not found');
            const group = await this.conversationRepo.createNewDocument({
                type: 'group',
                name,
                members: [_id, ...memberIds]
            });
            const groups = await this.conversationRepo.findDocuments({ type: 'group', members: { $in: _id } });
            res.json((0, response_helper_utils_1.SuccessResponse)('Group created successfully', 200, group));
        };
    }
}
exports.profileService = profileService;
exports.default = new profileService();
