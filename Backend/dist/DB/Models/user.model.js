"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Common_1 = require("../../Common");
const Utils_1 = require("../../Utils");
const Utils_2 = require("../../Utils");
const userSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: [4, "First name must be at least 4 characters long"]
    },
    lastName: {
        type: String,
        required: true,
        minLength: [4, "Last name must be at least 4 characters long"]
    },
    email: {
        type: String,
        required: true,
        index: {
            unique: true,
            name: "idx_email_unique"
        }
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: Common_1.RoleEnum,
        default: Common_1.RoleEnum.USER
    },
    gender: {
        type: String,
        enum: Common_1.GenderEnum,
        default: Common_1.GenderEnum.MALE
    },
    DOB: Date,
    profilePicture: String,
    coverPicture: String,
    provider: {
        type: String,
        enum: Common_1.ProviderEnum,
        default: Common_1.ProviderEnum.LOCAL
    },
    googleId: String,
    phoneNumber: String,
    OTPS: [{
            value: { type: String, required: true },
            expiresAt: { type: Date, default: Date.now() + 600000 }, // default 10 min from now
            otpType: { type: String, enum: Common_1.OtpTypesEnum, required: true },
        }]
});
// Document middleware
userSchema.pre("save", function () {
    if (this.isModified("password")) {
        // hash password
        this.password = (0, Utils_1.generateHash)(this.password);
    }
    if (this.isModified("phoneNumber")) {
        // encrypt phone number
        this.phoneNumber = (0, Utils_1.encrypt)(this.phoneNumber);
    }
});
// Query middleware
userSchema.post(/^find/, function (doc) {
    if (this.op === 'find') {
        doc.forEach((user) => {
            if (user.phoneNumber) {
                user.phoneNumber = (0, Utils_1.decrypt)(user.phoneNumber);
            }
        });
    }
    else {
        if (doc && doc.phoneNumber) {
            doc.phoneNumber = (0, Utils_1.decrypt)(doc.phoneNumber);
        }
    }
});
userSchema.post('findOneAndDelete', async function (doc) {
    const S3Service = new Utils_2.S3ClientService();
    if (doc.profilePicture) {
        await S3Service.DeleteFileFromS3(doc.profilePicture);
    }
});
const UserModel = mongoose_1.default.model("User", userSchema);
exports.UserModel = UserModel;
