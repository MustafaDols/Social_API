"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUpValidator = void 0;
const zod_1 = __importDefault(require("zod"));
const index_js_1 = require("../../Common/index.js");
exports.SignUpValidator = {
    body: zod_1.default.strictObject({
        firstName: zod_1.default.string().min(3).max(10),
        lastName: zod_1.default.string().min(3).max(10),
        email: zod_1.default.email(),
        password: zod_1.default.string(),
        gender: zod_1.default.enum(index_js_1.GenderEnum),
        DOB: zod_1.default.date().optional(),
        phoneNumber: zod_1.default.string().min(11).max(11),
        age: zod_1.default.number().min(18).max(60)
    })
};
