// deleteBucket.js
// this helper function will delete the whole image folder in the storage bucket 

async function deleteBucketFiles(bucket, product_code) {
    const [files] = await bucket.getFiles({ prefix: product_code });

    files.forEach(async (file) => {
        await file.delete();
    })
}

module.exports = deleteBucketFiles;