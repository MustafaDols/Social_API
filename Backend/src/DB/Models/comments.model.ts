import mongoose from "mongoose";
import { Icomment } from "../../Common";

const commentSchema = new mongoose.Schema<Icomment>({
    content: String,
    attachments: String,
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    refId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'onModel',
        required: true
    },
    onModel: {
        type: String,
        enum: ['Post', 'Comment'],
        required: true
        
    }
   
})