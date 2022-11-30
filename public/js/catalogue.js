// catalogue.js 

let category = (new URLSearchParams(window.location.search)).get("category");

function render(data) {
    console.log("The data is fetched and ready");
    console.log(data);
}

fetch("/product_catalogue/" + category)
    .then((res) => res.json())
    .then((data) => render(data));

