const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");

const client = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadFile(buffer, fileName) {
    try {
        const result = await client.files.upload({
            file: await toFile(buffer, fileName),
            fileName: fileName,
            useUniqueFileName: true,
        });

        return result;
    } catch (err) {
        console.error("ImageKit Upload Error:", err);
        throw err;
    }
}

module.exports = {
    uploadFile,
};