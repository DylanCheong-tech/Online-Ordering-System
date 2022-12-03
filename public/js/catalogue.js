const { useState } = React;

// catalogue.js 
let category = (new URLSearchParams(window.location.search)).get("category");

// React component : left pane 
function LeftPane(props) {
    let categories = props.categories_arr.map((element) => {
        return <span onClick={() => props.display_category_updater(element)}>{element}</span>
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
        <span onClick={() => { window.location.href = "/product.html?category=" + category + "&product_code=" + props.product_code }}>
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
    console.log(array)
    let return_arr = array.map(element => {
        return <ProductItemCard key={i++} img_url={element.image_url} product_code={element.product_code} product_name={element.product_name} desc={element.descriptions[0]} />
    });

    return return_arr;
}

// React component : product section 
function ProductSection(props) {
    return (
        <div id={props.title.toLowerCase().replace(" ", "_") + "_products"}>
            <h1 class="product_section_headers">{props.title}</h1>
            <div class="products_listing">
                {generateProductItemCards(props.content_arr_json)}
            </div>
        </div>
    );
}

// React component : right pane
function RightPane(props) {
    let display_category = props.display_category;
    // check if there is any category to display
    // if not display the featured and all products
    if (!display_category) {
        return (
            <div id="right_pane">
                <ProductSection title="Featured Products" content_arr_json={props.product_items.filter((product) => product.featured)} />
                <ProductSection title="All Products" content_arr_json={props.product_items} />
            </div>
        );
    }
    else {
        let product_items_arr = [];
        if (display_category == "Search Results")
            product_items_arr = props.product_items;
        else 
            product_items_arr = props.product_items.filter((product) => product.shop_category == display_category);
        return (
            <div id="right_pane">
                {
                    <ProductSection title={display_category} content_arr_json={product_items_arr} />
                }
            </div>
        );
    }
}

// React Component : content pane 
function ContentPane(props) {
    // state hook
    const [display_category, set_display_category] = useState(props.display_category);
    let data = props.data;
    return (
        <React.Fragment>
            <LeftPane categories_arr={data.shop_category} display_category_updater={set_display_category} />
            <RightPane product_items={data.product_items} display_category={display_category} />
        </React.Fragment>
    );

}

function render(data, display_category) {
    // function from title_banner.jsx 
    render_title_banner(data.title);

    const root = document.getElementById("content_pane");
    const container = ReactDOM.createRoot(root);
    container.render(
        <React.Fragment>
            <ContentPane data={data} display_category={display_category} />
        </React.Fragment>
    );
}

fetch("/product_catalogue/" + category)
    .then((res) => res.json())
    .then((data) => render(data, null));