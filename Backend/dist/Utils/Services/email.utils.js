"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitter = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const node_events_1 = require("node:events");
const sendEmail = async ({ to, cc, subject, content, attachments = [] }) => {
    const transporter = nodemailer_1.default.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        service: 'gmail',
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASSWORD
        },
    });
    const info = await transporter.sendMail({
        from: `No-reply < ${process.env.USER_EMAIL}>`,
        to,
        cc,
        subject,
        html: content,
        attachments: []
    });
    return info;
};
exports.sendEmail = sendEmail;
exports.emitter = new node_events_1.EventEmitter();
exports.emitter.on('sendEmail', (args) => {
    console.log('the sending Email event is started');
    (0, exports.sendEmail)(args);
});
