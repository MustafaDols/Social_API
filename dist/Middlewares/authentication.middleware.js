"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = void 0;
const Utils_1 = require("../Utils");
const Repositories_1 = require("../DB/Repositories");
const Models_1 = require("../DB/Models");
``;
const userRepo = new Repositories_1.UserRepository(Models_1.UserModel);
const blackListedRepo = new Repositories_1.BlackListedRepository(Models_1.BlacklistedTokensModel);
const authentication = async (req, res, next) => {
    const { authorization: accessToken } = req.headers;
    if (!accessToken)
        throw next(new Utils_1.BadRequestException('Please login first'));
    const [prefix, token] = accessToken.split(' ');
    if (prefix !== process.env.JWT_PREFIX)
        return res.status(401).json({ message: 'invalid token' });
    const decodedData = (0, Utils_1.verifyToken)(token, process.env.JWT_ACCESS_SECRET);
    if (!decodedData._id)
        return res.status(401).json({ message: 'invalid payload' });
    const blacklistedToken = await blackListedRepo.findOneDocument({ tokenId: decodedData.jti });
    if (blacklistedToken)
        return res.status(401).json({ message: 'Your session has been expired please login again' });
    const user = await userRepo.findDocumentById(decodedData._id, '-password');
    if (!user)
        return res.status(404).json({ message: 'Please register first' });
    req.loggedInUser = { user, token: decodedData };
    next();
};
exports.authentication = authentication;
