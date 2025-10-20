import mongoose from "mongoose";
import { IBlackListedToken } from "../../Common";

const blacklistedTokenSchema = new mongoose.Schema<IBlackListedToken>({
    tokenId:{
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
})


const BlacklistedTokensModel = mongoose.model<IBlackListedToken>("BlacklistedTokens", blacklistedTokenSchema);
export { BlacklistedTokensModel } 