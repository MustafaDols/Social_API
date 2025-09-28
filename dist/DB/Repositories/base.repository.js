"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    async createNewDocument(document) {
        return await this.model.create(document);
    }
    async findOneDocument(filters, projection, options) {
        return await this.model.findOne(filters, projection, options);
    }
    findDocumentById() { }
    updateOneDocument() { }
    updateMultipleDocuments() { }
    deleteOneDocument() { }
    deleteMultipleDocuments() { }
    findAndUpdateDocument() { }
    findAndDeleteDocument() { }
    findDocuments() { }
}
exports.BaseRepository = BaseRepository;
