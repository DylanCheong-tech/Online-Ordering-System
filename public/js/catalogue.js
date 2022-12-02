// catalogue.js 
let category = (new URLSearchParams(window.location.search)).get("category");
let json_data = null;

// React component : left pane 
function LeftPane(props) {
    let categories = props.categories_arr.map((element) => {
        return <span>{element}</span>
    });

    return (
        <div id="left_pane">
            <span>Shop By Category</span>
            {categories}
        </div>
    );
}

// React component : product item
function ProductItemCard(props) {
    return (
        <span>
            <img src={props.img_url} />
            <h3>{props.product_code}</h3>
            <p>{props.product_name} <br /> {props.desc}</p>
        </span>
    );
}

// helper : generate list of product item cards
// return array of ProductItemCard
function generateProductItemCards(array) {
    let i = 1;
    let return_arr = array.map(element => {
        return <ProductItemCard key={i++} img_url={element.image_url} product_code={element.product_code} product_name={element.product_name} desc={element.descriptions[0]} />
    });

    return return_arr;
}

// React component : product section 
function ProductSection(props) {
    return (
        <div id={props.category.toLowerCase() + "_products"}>
            <h1 class="product_section_headers">{props.title}</h1>
            <div class="products_listing">
                {generateProductItemCards(props.content_arr_json)}
            </div>
        </div>
    );
}

// React component : right pane
function RightPane(props) {
    return (
        <div id="right_pane">
            {
                Object.keys(props.json_data).map((key) => {
                    return (
                        <ProductSection category={key.replace(" ", "_")} title={key} content_arr_json={props.json_data[key]} />
                    )
                })
            }
        </div>
    );
}

function render(data) {
    document.getElementById("title_header").innerHTML = data.title;

    const root = document.getElementById("content_pane");
    const container = ReactDOM.createRoot(root);
    // this render should bring out as a component to implement the state / state hook 
    // state in RightPane but the state changes will be trigger in LeftPane
    container.render(
        <React.Fragment>
            <LeftPane categories_arr={data.shop_category} />
            <RightPane json_data={{"Features Products" : data.product_items, "All Products" : data.product_items}} />
        </React.Fragment>
    );

    json_data = data;
}

fetch("/product_catalogue/" + category)
    .then((res) => res.json())
    .then((data) => render(data));

setTimeout(() => {
    console.log(json_data)
}, 1000);
