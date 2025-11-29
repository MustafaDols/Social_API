"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagiantion = void 0;
const pagiantion = ({ page = 1, limit = 10 }) => {
    if (Number(page) < 1)
        page = 1;
    if (Number(limit) < 1 || Number(limit) > 100)
        limit = 10;
    const skip = (Number(page) - 1) * Number(limit);
    return {
        limit,
        skip
    };
};
exports.pagiantion = pagiantion;
