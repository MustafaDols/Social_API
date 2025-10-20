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
    }
}
exports.profileService = profileService;
exports.default = new profileService();
