// login.js

// MD5 Hasher object 
const MD5_Hash = new Hashes.MD5();

document.getElementById("login_form").addEventListener("submit", (event) => {
    let password_input = document.getElementById("password_input");
    password_input.value = MD5_Hash.hex(password_input.value);
})