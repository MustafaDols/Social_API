"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_enum_js_1 = require("../../Common/Enums/user.enum.js");
const crypto_utils_js_1 = require("../../Utils/Encryption/crypto.utils.js");
const hash_utils_js_1 = require("../../Utils/Encryption/hash.utils.js");
const userSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: [4, "firstName must be at least 4 char long"],
    },
    lastName: {
        type: String,
        required: true,
        minLength: [4, "lastName must be at least 4 char long"],
    },
    email: {
        type: String,
        required: true,
        index: {
            unique: true,
            name: "idx_email_unique",
        },
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
        enum: user_enum_js_1.GenderEnum,
        default: user_enum_js_1.GenderEnum.OTHER,
    },
    role: {
        type: String,
        enum: user_enum_js_1.RoleEnum,
        default: user_enum_js_1.RoleEnum.USER,
    },
    DOB: {
        type: Date,
    },
    profilePicture: {
        secure_url: String,
        public_id: String,
    },
    coverPicture: {
        type: String,
    },
    provider: {
        type: String,
        enum: user_enum_js_1.PROVIDERENUM,
        default: user_enum_js_1.PROVIDERENUM.LOCAL,
    },
    googleId: {
        type: String,
    },
    isVerified: {
        type: Boolean,
    },
    phoneNumber: {
        type: String,
    },
    isConfirmed: {
        type: Boolean,
        default: false,
    },
    OTPS: [
        {
            value: { type: String, required: true },
            createdAt: { type: String, default: Date.now() + 600000 },
            otpType: { type: String, enum: user_enum_js_1.otpTypesEnum, required: true },
        },
    ],
});
userSchema.pre("save", function () {
    if (this.isModified("password")) {
        this.password = (0, hash_utils_js_1.generateHash)(this.password);
    }
    if (this.isModified("phoneNumber")) {
        this.phoneNumber = (0, crypto_utils_js_1.encrypt)(this.phoneNumber);
    }
});
userSchema.post(/^find/, function (doc) {
    if (this.op == "find") {
        doc.forEach((user) => {
            if (user.phoneNumber) {
                user.phoneNumber = (0, crypto_utils_js_1.decrypt)(user.phoneNumber);
            }
        });
    }
    else {
        doc.phoneNumber = (0, crypto_utils_js_1.decrypt)(doc.phoneNumber);
    }
});
const UserModel = mongoose_1.default.model("User", userSchema);
exports.UserModel = UserModel;
