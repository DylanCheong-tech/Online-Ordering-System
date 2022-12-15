// uploadProductImages.js

// parameters ==> bucket : Google Storage bucket, file_json: Object
async function uploadProductImages(bucket, product_code, file_json) {
    for (let color in file_json) {
        file_json[color].forEach((img) => {
            const file = bucket.file(product_code + "/" + color.toUpperCase() + "/" + img.originalname);

            const blobStream = file.createWriteStream({
                resumable: false,
            })

            blobStream.on("finish", async () => {
                await bucket.file(product_code + "/" + color.toUpperCase() + "/" + img.originalname).makePublic();
            });

            blobStream.end(img.buffer);
        });
    }
}

module.exports = uploadProductImages;