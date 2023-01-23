// helper : getImageFiles.js 
// to get the image URI links from the Google Cloud Storage 
// function get image file for all or each product 

// parameters ==> bucket : Bucket, product_code : string
async function getImageFiles(bucket, product_code) {
    let query = {}
    if (product_code)
        query.prefix = product_code;
    const [files] = await bucket.getFiles(query);
    let return_json = {};
    files.forEach((element) => {
        // if match png, jpg and jpeg then add it into the result
        if (element.name.match(/(jpeg|jpg|png)$/))
            return_json[element.name] = element.metadata.mediaLink
    });
    return return_json;
}

// export 
module.exports = getImageFiles;