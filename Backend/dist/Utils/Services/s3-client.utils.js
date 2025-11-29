"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3ClientService = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const node_fs_1 = __importDefault(require("node:fs"));
const lib_storage_1 = require("@aws-sdk/lib-storage");
class S3ClientService {
    constructor() {
        this.s3Client = new client_s3_1.S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });
        this.key_Folder = process.env.AWS_KEY_FOLDER;
    }
    async getFileWithSignedUrl(key, expiresIn = 60) {
        const getCommand = new client_s3_1.GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key
        });
        return await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, getCommand, { expiresIn });
    }
    async UploadFileOnS3(file, key) {
        const keyName = `${this.key_Folder}/${key}/${Date.now()}-${file.originalname}}`;
        console.log("the key name is ", keyName);
        console.log("the file into ", file);
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: keyName,
            Body: node_fs_1.default.createReadStream(file.path),
            ContentType: file.mimetype,
            // ACL: 'public-read'
        };
        const putCommand = new client_s3_1.PutObjectCommand(params);
        await this.s3Client.send(putCommand);
        const signedUrl = await this.getFileWithSignedUrl(keyName);
        return {
            key: keyName,
            url: signedUrl
        };
    }
    async UploadFilesOnS3(files, key) {
        const keys = files.map(file => this.UploadFileOnS3(file, key));
        return await Promise.all(keys);
    }
    async DeleteFileFromS3(key) {
        const deleteCommand = new client_s3_1.DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key
        });
        return await this.s3Client.send(deleteCommand);
    }
    async DeleteBulkFromS3(keys) {
        const deleteCommand = new client_s3_1.DeleteObjectsCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Delete: {
                Objects: keys.map(key => ({ Key: key }))
            }
        });
        return await this.s3Client.send(deleteCommand);
    }
    async uploadLargeFileOnS3(file, key) {
        const keyName = `${this.key_Folder}/${key}/${Date.now()}-${file.originalname}}`;
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: keyName,
            Body: node_fs_1.default.createReadStream(file.path),
            ContentType: file.mimetype,
            // ACL: 'public-read'
        };
        const upload = new lib_storage_1.Upload({
            client: this.s3Client,
            params,
            queueSize: 4, // how many parts to upload in parallel
            partSize: 5 * 1024 * 1024, // each part = 5 MB
            leavePartsOnError: false, // auto-cleanup failed parts
        });
        upload.on("httpUploadProgress", (progress) => {
            console.log(`Uploaded ${progress.loaded} bytes of ${progress.total}`);
        });
        return await upload.done();
    }
}
exports.S3ClientService = S3ClientService;
