import { Model } from "mongoose";
import { IUser } from "../../Common";
import { UserModel } from "../Models/user.model"
import { BaseRepository } from "./base.repository";



export class UserRepository extends BaseRepository<IUser> {

    constructor(protected _userModel:Model<IUser>){
        super(_userModel)
    }

    // find User By Email

    // deleteUserAlongWithPictures
}

