"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileService = void 0;
const Utils_1 = require("../../../Utils");
const response_helper_utils_1 = require("../../../Utils/Response/response-helper.utils");
const Models_1 = require("../../../DB/Models");
const Repositories_1 = require("../../../DB/Repositories");
class profileService {
    constructor() {
        this.s3Client = new Utils_1.S3ClientService();
        this.userRepo = new Repositories_1.UserRepository(Models_1.UserModel);
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
    }
}
exports.profileService = profileService;
exports.default = new profileService();
