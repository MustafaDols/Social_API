"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowedFileExtentions = exports.fileTyps = void 0;
exports.fileTyps = {
    IMAGE: "image",
    VIDEO: "video",
    AUIDO: "audio",
    APPLICATION: "application"
};
exports.allowedFileExtentions = {
    [exports.fileTyps.IMAGE]: ["png", "jpg", "jpeg", "gif", "webp"],
    [exports.fileTyps.VIDEO]: ["mp4", "avi", "mkv", "mov", "mwv"],
    [exports.fileTyps.AUIDO]: ["mp3", "wav", "ogg", "wma", "aac"],
    [exports.fileTyps.APPLICATION]: ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"],
};
