"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SucessResponse = SucessResponse;
exports.FailedResponse = FailedResponse;
function SucessResponse(message = "Your request is processed successfully", status = 200, data) {
    return {
        meta: {
            status,
            success: true,
        },
        data: {
            message,
            data,
        },
    };
}
function FailedResponse(message = "Your request is failed", status = 500, error) {
    return {
        meta: {
            status,
            success: false,
        },
        error: {
            message,
            context: error,
        },
    };
}
