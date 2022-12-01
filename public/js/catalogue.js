// catalogue.js 

let category = (new URLSearchParams(window.location.search)).get("category");

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
            {/* <img src={props.img_url} /> */}
            {/* hardcode the img src here */}
            <img src="./img/sample2.jpeg" />
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
            <ProductSection category="featured" title="Featured Products" content_arr_json={props.arr_json[0]} />
            <ProductSection category="all" title="All Products" content_arr_json={props.arr_json[1]} />
        </div>
    );
}

function render(data) {
    // console.log("The data is fetched and ready");
    // console.log(data);
    const root = document.getElementById("content_pane");
    const container = ReactDOM.createRoot(root);
    // mock the category data
    let mock_categories = ["Category 1", "Category 2", "Category 3", "Category 4", "Category 5", "Category 6", "Category 7"]
    container.render(
        <React.Fragment>
            <LeftPane categories_arr={mock_categories} />
            <RightPane arr_json={[data.response, data.response]} />
        </React.Fragment>
    );
}

fetch("/product_catalogue/" + category)
    .then((res) => res.json())
    .then((data) => render(data));