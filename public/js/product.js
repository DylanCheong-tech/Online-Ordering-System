// product.js 

let category = (new URLSearchParams(window.location.search)).get("category");
let product_code = (new URLSearchParams(window.location.search)).get("product_code");

// React Component : Image Pane
function ImagePane(props) {
    return (
        <div id="image_pane">
            <img class="icon" src="../img/icon_previous.svg" />
            <img src={props.images["NP-120/White_1.jpg"]} />
            <img class="icon" src="../img/icon_next.svg" />
        </div>
    );
}

// React Component : Content Pane 
function ContentPane(props) {
    let info = props.info;
    let diameter_content = "";
    if (info.diameters) {
        diameter_content = 
        <React.Fragment>
            Inside Diameter : {info.diameters.inside} cm <br />
            Outside Diameter : {info.diameters.outside} cm <br />
            Lower Diameter : {info.diameters.lower} cm <br />
        </React.Fragment>
    }
    return (
        <div id="description_pane">
            <h2>{info.product_name}</h2>
            <p>
                Code : {info.product_code} <br />
                Stock Status : {info.stock_status} <br />
                Material : {info.material} <br />
                Color : {info.colors.join(", ")} <br />
                { diameter_content }
                Height : {info.dimensions.height} cm <br />
                Length : {info.dimensions.length} cm <br />
                Width : {info.dimensions.width} cm <br />
                Descriptions :
                <ol>
                    {info.descriptions.map((element) => {
                        return <li>{element}</li>
                    })}
                </ol>
            </p>
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
            <ImagePane images={data.images} />
            <ContentPane info={data} />
        </React.Fragment>
    );
}

fetch("/product/" + category + "/" + product_code)
    .then((res) => res.json())
    .then((data) => render(data.response));