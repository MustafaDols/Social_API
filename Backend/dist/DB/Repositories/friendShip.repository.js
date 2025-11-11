"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendShipRepository = void 0;
const friendShip_model_1 = require("../Models/friendShip.model");
const base_repository_1 = require("./base.repository");
class FriendShipRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(friendShip_model_1.FriendshipModel);
    }
}
exports.FriendShipRepository = FriendShipRepository;
