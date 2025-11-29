"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRepository = void 0;
const Models_1 = require("../Models");
const base_repository_1 = require("./base.repository");
class PostRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(Models_1.PostModel);
    }
    async countDocuments() {
        return await Models_1.PostModel.countDocuments();
    }
    async postsPagination(filters, options) {
        return await Models_1.PostModel.paginate(filters, options);
    }
}
exports.PostRepository = PostRepository;
