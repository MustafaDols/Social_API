"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatonMiddleware = void 0;
const Utils_1 = require("../Utils");
const ValidatonMiddleware = (schema) => {
    return (req, res, next) => {
        const reqKeys = ["body", "params", "query", "headers"];
        const validationErrors = [];
        for (const key of reqKeys) {
            if (schema[key]) {
                const result = schema[key].safeParse(req[key]);
                if (!result?.success) {
                    const issues = result.error?.issues?.map((issue) => ({
                        path: issue.path,
                        message: issue.message,
                    }));
                    validationErrors.push({ key, issues });
                }
            }
        }
        if (validationErrors.length)
            throw new Utils_1.BadRequestException("validation failed", { validationErrors });
        next();
    };
};
exports.ValidatonMiddleware = ValidatonMiddleware;
