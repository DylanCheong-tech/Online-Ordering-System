// helper : getPreviewImageFiles.js 
// to get one preview image URI links from the Google Cloud Storage 
// function get image file for all or each product 

// parameters ==> bucket : Bucket, product_code : string
async function getPreviewImageFiles(bucket, product_code, color) {
    let query = {}
    query.prefix = product_code + "/" + color.toUpperCase();

    const [files] = await bucket.getFiles(query);
    let return_img_url = "";
    files.forEach((element, index) => {
        // if match png, jpg and jpeg then add it into the result
        if (element.name.match(/.*_1\.(jpeg|jpg|png)$/))
            return_img_url = element.metadata.mediaLink;

    });
    return return_img_url;
}

// export 
module.exports = getPreviewImageFiles;