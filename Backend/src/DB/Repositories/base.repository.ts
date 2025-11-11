
import mongoose, { FilterQuery, Model, ProjectionType, QueryOptions, UpdateQuery } from "mongoose";



export class BaseRepository<T> {

    constructor(private model: Model<T>) { }

    async createNewDocument(document: Partial<T>): Promise<T> {
        return await this.model.create(document)
    }

    async findOneDocument(filters: FilterQuery<T>, projection?: ProjectionType<T>, options?: QueryOptions<T>): Promise<T | null> {
        return await this.model.findOne(filters, projection, options)
    }

    async findDocumentById(id: mongoose.Types.ObjectId | string,  projection?: ProjectionType<T>, options?: QueryOptions<T>): Promise<T | null> {
        return await this.model.findById(id, projection, options)
    }

    async deleteByIdDocument(id: mongoose.Types.ObjectId | string) {
        return await this.model.findByIdAndDelete(id)
    }

    async updateOneDocument(filters: FilterQuery<T>, updatedObject: UpdateQuery<T>, options?: QueryOptions<T>) {
        return await this.model.findOneAndUpdate( filters, updatedObject, options)
    }

    async findDocuments(
        filters: FilterQuery<T>,
        projection?: ProjectionType<T>,
        options?: QueryOptions<T> & { populate?: any }
    ): Promise<T[]> {
        let query = this.model.find(filters, projection, options);

        if (options?.populate) {
            if (Array.isArray(options.populate)) {
                options.populate.forEach((pop) => query.populate(pop));
            } else {
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