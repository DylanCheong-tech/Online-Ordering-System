// helper : encryption.js
// this module encapsulates all the encryption features
// - key generations 
// - encryption function 
// - decryption function 

// acquired asymmetric encryption algorithm - RSA
// npm module - encrypt-rsa v2.1.5

const RSA = require("encrypt-rsa").default;
const RSA_API = new RSA();

// key generator 
// @return {Object} keys - consists of public and private keys in name of "privateKey" and "publicKey" respectively 
function key_generator() {
    return RSA_API.createPrivateAndPublicKeys();
}

// encryption 
// @param {String} plainText 
// @param {String} publicKey
// 
// @return {String} cipherText
function encrypt(plainText, publicKey) {
    return RSA_API.encryptStringWithRsaPublicKey({
        text: plainText,
        publicKey: publicKey
    });
}

// decryption 
// @param {String} cipherText
// @param {String} privateKey
// 
// @return {String} plainText
function decrypt(cipherText, privateKey) {
    return RSA_API.decryptStringWithRsaPrivateKey({
        text: cipherText,
        privateKey: privateKey
    });
}

module.exports = {
    key_generator: key_generator,
    encrypt: encrypt,
    decrypt: decrypt
}