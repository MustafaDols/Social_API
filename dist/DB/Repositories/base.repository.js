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
    async findDocumentById(id, projection, options) {
        return await this.model.findById(id, projection, options);
    }
    async deleteByIdDocument(id) {
        return await this.model.findByIdAndDelete(id);
    }
    async updateOneDocument(filters, updatedObject, options) {
        return await this.model.findOneAndUpdate(filters, updatedObject, options);
    }
    async findDocuments(filters, projection, options) {
        let query = this.model.find(filters, projection, options);
        if (options?.populate) {
            if (Array.isArray(options.populate)) {
                options.populate.forEach((pop) => query.populate(pop));
            }
            else {
                query.populate(options.populate);
            }
        }
        return await query.exec();
    }
    updateMultipleDocuments() { }
    deleteOneDocument() { }
    deleteMultipleDocuments() { }
    findAndUpdateDocument() { }
    findAndDeleteDocument() { }
}
exports.BaseRepository = BaseRepository;
