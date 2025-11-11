import crypto from "node:crypto";
import fs from "node:fs";

const IV_LENGTH = parseInt(process.env.IV_LENGTH as string)
const ENCRYPTION_SECRET_KEY = Buffer.from(process.env.ENCRYPTION_SECRET_KEY as string)

export const encrypt = (text: string) : string=> {

    const iv = crypto.randomBytes(IV_LENGTH as number) ;

    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_SECRET_KEY, iv);

    let encryptedData = cipher.update(text, 'utf-8', 'hex');

    encryptedData += cipher.final('hex');

    return `${iv.toString('hex')}:${encryptedData}`;
}

export const decrypt = (encryptData: string) : string => {

    const [iv, encryptedText] = encryptData.split(':');

    const binaryLikeIv = Buffer.from(iv, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_SECRET_KEY, binaryLikeIv);

    let decryptedData = decipher.update(encryptedText, 'hex', 'utf-8');

    decryptedData += decipher.final('utf-8');

    return decryptedData

}


if (fs.existsSync('publicKey.pem') && fs.existsSync('privateKey.pem')) {

    console.log('Keys already exist');

} else {

    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {

        modulusLength: 2048,

        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
        }

    })

    fs.writeFileSync('publicKey.pem', publicKey);
    fs.writeFileSync('privateKey.pem', privateKey);
}


