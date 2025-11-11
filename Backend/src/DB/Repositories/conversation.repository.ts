import type { IConversation } from "../../Common/index.js";
import { conversationModel } from "../Models/conversations.model.js";
import { BaseRepository } from "./base.repository.js";

export class ConversationRepository extends BaseRepository<IConversation> {
  constructor() {
    super(conversationModel);
  }
}
