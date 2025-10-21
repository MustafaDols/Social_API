"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUpValidator = void 0;
const zod_1 = __importDefault(require("zod"));
const index_js_1 = require("../../Common/index.js");
const mongoose_1 = require("mongoose");
exports.SignUpValidator = {
    body: zod_1.default.strictObject({
        firstName: zod_1.default.string().min(3).max(10),
        lastName: zod_1.default.string().min(3).max(10),
        email: zod_1.default.email(),
        password: zod_1.default.string(),
        passwordConfirmation: zod_1.default.string(),
        gender: zod_1.default.enum(index_js_1.GenderEnum),
        DOB: zod_1.default.date().optional(),
        phoneNumber: zod_1.default.string().min(11).max(11),
    })
        .safeExtend({
        userId: zod_1.default.string().optional()
    })
        .superRefine((val, ctx) => {
        // password match
        if (val.password !== val.passwordConfirmation) {
            ctx.addIssue({
                code: zod_1.default.ZodIssueCode.custom,
                message: "Passwords do not match",
                path: ["passwordConfirmation"],
            });
        }
        // user is valid moongose id
        if (val.userId && !(0, mongoose_1.isValidObjectId)(val)) {
            ctx.addIssue({
                code: zod_1.default.ZodIssueCode.custom,
                message: "Invalid user id",
                path: ["userId"],
            });
        }
    })
    // .extend({ userId: z.string().optional() })
    // .refine((data ) => {
    //     if (data.password !== data.passwordConfirmation) return false
    //     return true
    // },
    //     { path: ["passwordConfirmation"], message: "Passwords do not match" }
    // )
};
