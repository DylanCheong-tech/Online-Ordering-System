// bucketInfo.js
// this module exports all the existing Google Cloud Storage Buckets

const { Storage } = require("@google-cloud/storage");
const storage = new Storage({ keyFilename: "mr-buy-370317-c4413fb24e9d.json" });
const buckets = { "plastic": storage.bucket("plastic-pot-images"), "iron": storage.bucket("iron-stand-images") }

module.exports = {
    allBuckets : buckets,
    ... buckets,

}