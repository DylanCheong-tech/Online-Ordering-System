// uploadProductImages.js

// upload the product images per-color basic 
// parameters ==> bucket : Google Storage bucket, product_code: String, file_json: Object, color: String
async function uploadProductImages(bucket, product_code, file_json_arr, color) {
    file_json_arr.forEach((img, index) => {
        const file = bucket.file(product_code + "/" + color.toUpperCase() + "/" + color + "_" + (index + 1) + "." + img.mimetype.split("/")[1]);

        const blobStream = file.createWriteStream({
            resumable: false,
        })

        blobStream.on("finish", async () => {
            await bucket.file(product_code + "/" + color.toUpperCase() + "/" + color + "_" + (index + 1) + "." + img.mimetype.split("/")[1]).makePublic();
        });

        blobStream.end(img.buffer);
    });
}

module.exports = uploadProductImages;