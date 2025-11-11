import type { IMessage } from "../../Common/index.js";
import { messageModel } from  "../Models/messages.model.js";
import { BaseRepository } from "./base.repository.js";

export class MessageRepository extends BaseRepository<IMessage> {
    constructor() {
        super(messageModel);
    }
}