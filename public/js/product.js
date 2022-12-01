// product.js 

let category = (new URLSearchParams(window.location.search)).get("category");
let product_code = (new URLSearchParams(window.location.search)).get("product_code");

function render(data) {
    console.log("The data is fetched and ready");
    console.log(data);
}

fetch("/product/" + category + "/" + product_code)
    .then((res) => res.json())
    .then((data) => render(data));