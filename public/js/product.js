// product.js 

let category = (new URLSearchParams(window.location.search)).get("category");
let product_code = (new URLSearchParams(window.location.search)).get("product_code");

// React Component : Image Pane
function ImagePane(props) {
    return (
        <div id="image_pane">
            <button type="button">previous</button>
            <img src="./img/sample2.jpeg" />
            <button type="button">next</button>
        </div>
    );
}

// React Component : Content Pane 
function ContentPane(props) {
    return (
        <div id="description_pane">
            <h2>Product XXX</h2>
            <p>Descriptions .... Descriptions .... Descriptions .... Descriptions .... Descriptions .... Descriptions ....</p>
        </div>
    );
}

function render(data) {
    console.log("The data is fetched and ready");
    console.log(data);

    const root = document.getElementById("content_pane");
    const container = ReactDOM.createRoot(root);
    container.render(
        <React.Fragment>
            <ImagePane />
            <ContentPane />
        </React.Fragment>
    );
}

fetch("/product/" + category + "/" + product_code)
    .then((res) => res.json())
    .then((data) => render(data));